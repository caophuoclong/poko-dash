import { createFileRoute } from '@tanstack/react-router'
import { platformIntegrationsQueryOptions } from '#/features/platform-integrations/queries/platform-integrations-queries'
import { PlatformIntegrationsPage } from '#/features/platform-integrations/components/PlatformIntegrationsPage'
import type { Provider } from '#/features/platform-integrations/types'

function validateSearch(search: Record<string, unknown>) {
  const provider = typeof search.provider === 'string' ? search.provider : undefined
  const code = typeof search.code === 'string' ? search.code : undefined
  const error = typeof search.error === 'string' ? search.error : undefined

  return {
    provider: provider as Provider | undefined,
    code,
    error,
  }
}

export const Route = createFileRoute('/dash/integrations/')({
  validateSearch,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(platformIntegrationsQueryOptions()),
  component: IntegrationsPage,
})

function IntegrationsPage() {
  const search = Route.useSearch()
  return (
    <PlatformIntegrationsPage
      oauthProvider={search.provider}
      oauthCode={search.code}
      oauthError={search.error}
    />
  )
}
