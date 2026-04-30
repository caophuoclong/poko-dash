import { useState, useEffect, useCallback, useMemo } from 'react'
import { PageHeader } from '#/components/ui/page-header'
import { SectionCard, SectionCardHeader, SectionCardBody } from '#/components/ui/section-card'
import { EmptyState, emptyStatePresets } from '#/components/ui/empty-state'
import {
  usePlatformIntegrations,
  useStartPlatformConnect,
  useSelectIntegrationTargets,
  useReconnectIntegration,
  useDisconnectIntegration,
} from '../hooks/use-platform-integrations'
import { fetchAvailableTargets } from '../api/platform-integrations-api'
import { ProviderConnectGrid } from './ProviderConnectGrid'
import { IntegrationTable } from './IntegrationTable'
import { AvailableTargetsDialog } from './AvailableTargetsDialog'
import { OAuthCallbackHandler } from './OAuthCallbackHandler'
import { PROVIDERS } from '../constants'
import type { Provider, Integration, AvailableTarget } from '../types'

interface PlatformIntegrationsPageProps {
  oauthProvider?: Provider
  oauthCode?: string
  oauthError?: string
}

type FlowPhase =
  | 'idle'
  | 'connecting'
  | 'callback-exchanging'
  | 'callback-error'
  | 'target-selection'
  | 'target-selection-loading'
  | 'target-selection-error'

export function PlatformIntegrationsPage({
  oauthProvider: initialProvider,
  oauthCode: initialCode,
  oauthError: initialError,
}: PlatformIntegrationsPageProps) {
  const {
    data: integrationsData,
    isLoading,
    isRefetching,
    refetch,
  } = usePlatformIntegrations()

  const startConnect = useStartPlatformConnect()
  const selectTargets = useSelectIntegrationTargets()
  const reconnect = useReconnectIntegration()
  const disconnect = useDisconnectIntegration()

  const [phase, setPhase] = useState<FlowPhase>('idle')
  const [connectingProvider, setConnectingProvider] = useState<Provider | null>(null)
  const [oauthProvider, setOAuthProvider] = useState<Provider | null>(null)
  const [oauthCode, setOAuthCode] = useState<string | null>(null)
  const [oauthError, setOAuthError] = useState<string | null>(null)
  const [availableTargets, setAvailableTargets] = useState<AvailableTarget[] | null>(null)
  const [targetsError, setTargetsError] = useState<string | null>(null)

  const integrations = useMemo<Integration[]>(
    () => integrationsData?.data ?? [],
    [integrationsData],
  )

  const connectedCounts = useMemo(() => {
    const counts: Record<Provider, { total: number; active: number }> = {
      facebook: { total: 0, active: 0 },
      tiktok: { total: 0, active: 0 },
    }
    for (const i of integrations) {
      if (counts[i.provider]) {
        counts[i.provider].total++
        if (i.status === 'active') counts[i.provider].active++
      }
    }
    return counts
  }, [integrations])

  useEffect(() => {
    if (!initialProvider || !PROVIDERS.some((p) => p.provider === initialProvider))
      return

    if (initialError) {
      setOAuthProvider(initialProvider)
      setOAuthError(decodeURIComponent(initialError))
      setPhase('callback-error')
      return
    }

    if (initialCode) {
      setOAuthProvider(initialProvider)
      setOAuthCode(initialCode)
      setPhase('callback-exchanging')

      fetchAvailableTargets(initialProvider, initialCode)
        .then((res) => {
          setAvailableTargets(res.targets ?? [])
          setPhase('target-selection')
        })
        .catch((err) => {
          setOAuthError(err?.message ?? 'Failed to load available targets')
          setPhase('callback-error')
        })
        .finally(() => {
          window.history.replaceState({}, '', window.location.pathname)
        })
    }
  }, [])

  const handleConnect = useCallback(
    async (provider: Provider) => {
      setConnectingProvider(provider)
      setPhase('connecting')
      try {
        const redirectUri = `${window.location.origin}/dash/integrations`
        const res = await startConnect.mutateAsync({ provider, redirectUri })
        if (res.authUrl) {
          window.location.href = res.authUrl
        }
      } catch (err: any) {
        setOAuthError(err?.message ?? 'Failed to start connection')
        setOAuthProvider(provider)
        setPhase('callback-error')
      } finally {
        setConnectingProvider(null)
      }
    },
    [startConnect],
  )

  const handleCallbackRetry = useCallback(() => {
    setOAuthError(null)
    setPhase('idle')
  }, [])

  const handleCallbackCancel = useCallback(() => {
    setOAuthProvider(null)
    setOAuthCode(null)
    setOAuthError(null)
    setAvailableTargets(null)
    setPhase('idle')
  }, [])

  const handleTargetSelect = useCallback(
    async (selectedIds: string[]) => {
      if (!oauthProvider || !availableTargets || !oauthCode) return

      const selectedTargets = availableTargets.filter((t) =>
        selectedIds.includes(t.targetId),
      )

      setPhase('target-selection-loading')
      try {
        await selectTargets.mutateAsync({
          provider: oauthProvider,
          targets: selectedTargets.map((t) => ({
            targetId: t.targetId,
            name: t.name,
            type: t.type,
            avatar: t.avatar,
            metadata: t.metadata,
          })),
          oauthCode,
        })

        setOAuthProvider(null)
        setOAuthCode(null)
        setAvailableTargets(null)
        setPhase('idle')
        refetch()
      } catch (err: any) {
        setPhase('target-selection-error')
        setTargetsError(err?.message ?? 'Failed to create integrations')
      }
    },
    [oauthProvider, availableTargets, oauthCode, selectTargets, refetch],
  )

  const handleTargetCancel = useCallback(() => {
    setOAuthProvider(null)
    setOAuthCode(null)
    setAvailableTargets(null)
    setTargetsError(null)
    setPhase('idle')
  }, [])

  const handleTargetRetry = useCallback(() => {
    setTargetsError(null)
    if (oauthProvider && oauthCode) {
      setPhase('target-selection-loading')
    }
  }, [oauthProvider, oauthCode])

  const handleReconnect = useCallback(
    async (id: string) => {
      await reconnect.mutateAsync(id)
      refetch()
    },
    [reconnect, refetch],
  )

  const handleDisconnect = useCallback(
    async (id: string) => {
      const integration = integrations.find((i) => i.integrationId === id)
      const confirmed = window.confirm(
        `Disconnect ${integration?.targetName ?? 'this integration'}? This will stop publishing to this ${integration?.targetType ?? 'target'}.`,
      )
      if (!confirmed) return
      await disconnect.mutateAsync(id)
      refetch()
    },
    [disconnect, integrations, refetch],
  )

  const providerConfig = useMemo(
    () => PROVIDERS.find((p) => p.provider === oauthProvider),
    [oauthProvider],
  )

  if (phase === 'callback-exchanging') {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Platform Integrations"
          subtitle="Manage publish targets connected to Poko."
        />
        <SectionCard padded>
          <OAuthCallbackHandler
            phase="exchanging"
            error={null}
            providerLabel={providerConfig?.name ?? 'provider'}
            onRetry={handleCallbackRetry}
            onCancel={handleCallbackCancel}
          />
        </SectionCard>
      </div>
    )
  }

  if (phase === 'callback-error' && oauthError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Platform Integrations"
          subtitle="Manage publish targets connected to Poko."
        />
        <SectionCard padded>
          <OAuthCallbackHandler
            phase="error"
            error={oauthError}
            providerLabel={providerConfig?.name ?? 'provider'}
            onRetry={handleCallbackRetry}
            onCancel={handleCallbackCancel}
          />
        </SectionCard>
      </div>
    )
  }

  const hasIntegrations = integrations.length > 0

  if (!isLoading && !hasIntegrations && phase === 'idle') {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Platform Integrations"
          subtitle="Manage publish targets connected to Poko."
        />
        <SectionCard padded>
          <SectionCardHeader
            title="Connect a Platform"
            description="Choose a publishing platform to connect. You'll select specific targets after authentication."
          />
          <SectionCardBody>
            <ProviderConnectGrid
              connectedCounts={connectedCounts}
              connecting={startConnect.isPending}
              connectingProvider={connectingProvider}
              onConnect={handleConnect}
            />
          </SectionCardBody>
        </SectionCard>
        <EmptyState
          variant="page"
          {...emptyStatePresets.integrations}
          note="Connect a provider above to get started."
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Integrations"
        subtitle="Manage publish targets connected to Poko."
      />

      <SectionCard padded>
        <SectionCardHeader
          title="Connect a Platform"
          description="Add new publishing targets by connecting a platform."
        />
        <SectionCardBody>
          <ProviderConnectGrid
            connectedCounts={connectedCounts}
            connecting={startConnect.isPending}
            connectingProvider={connectingProvider}
            onConnect={handleConnect}
          />
        </SectionCardBody>
      </SectionCard>

      <SectionCard padded>
        <SectionCardHeader
          title="Connected Targets"
          description="Publish targets currently linked to your Poko account."
        />
        <SectionCardBody>
          {isLoading ? (
            <IntegrationTable
              integrations={[]}
              isLoading
              isRefetching={false}
              onReconnect={handleReconnect}
              onDisconnect={handleDisconnect}
              onRefresh={() => refetch()}
            />
          ) : integrations.length === 0 ? (
            <EmptyState
              variant="card"
              title="No connected targets"
              description="Connect a platform above to add publish targets."
            />
          ) : (
            <IntegrationTable
              integrations={integrations}
              isLoading={false}
              isRefetching={isRefetching}
              onReconnect={handleReconnect}
              onDisconnect={handleDisconnect}
              onRefresh={() => refetch()}
            />
          )}
        </SectionCardBody>
      </SectionCard>

      <AvailableTargetsDialog
        open={
          phase === 'target-selection' ||
          phase === 'target-selection-loading' ||
          phase === 'target-selection-error'
        }
        provider={oauthProvider}
        providerName={providerConfig?.name ?? ''}
        targetLabelPlural={providerConfig?.targetLabelPlural ?? 'Targets'}
        targets={availableTargets}
        isLoading={
          phase === 'target-selection-loading' &&
          availableTargets === null
        }
        isError={phase === 'target-selection-error'}
        isSubmitting={selectTargets.isPending}
        errorMessage={targetsError ?? undefined}
        onConfirm={handleTargetSelect}
        onCancel={handleTargetCancel}
        onRetry={handleTargetRetry}
      />
    </div>
  )
}
