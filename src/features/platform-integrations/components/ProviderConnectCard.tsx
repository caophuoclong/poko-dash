import { Loader2 } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { IntegrationStatusBadge } from './IntegrationStatusBadge'
import type { ProviderConfig } from '../types'
import { cn } from '#/shared/utils'

interface ProviderConnectCardProps {
  provider: ProviderConfig
  connectedCount: number
  activeCount: number
  connecting: boolean
  isConnectingProvider: boolean
  onConnect: (provider: ProviderConfig['provider']) => void
}

export function ProviderConnectCard({
  provider,
  connectedCount,
  activeCount,
  connecting,
  isConnectingProvider,
  onConnect,
}: ProviderConnectCardProps) {
  const isConnected = connectedCount > 0
  const allActive = isConnected && activeCount === connectedCount

  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-2xl border border-frost bg-surface p-5 transition-colors',
        connecting && isConnectingProvider && 'border-accent-blue/30',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <h3 className="font-display text-base font-semibold text-near-white">
            {provider.name}
          </h3>
          <p className="text-xs text-muted-text">{provider.description}</p>
        </div>
        {isConnected ? (
          <IntegrationStatusBadge status={allActive ? 'active' : 'expired'} />
        ) : (
          <span className="text-xs text-muted-text">Not connected</span>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-frost pt-4">
        <span className="text-xs text-muted-text">
          {isConnected
            ? `${activeCount}/${connectedCount} active`
            : `No ${provider.targetLabelPlural.toLowerCase()} connected`}
        </span>
        <Button
          size="sm"
          color="blue"
          disabled={connecting}
          onClick={() => onConnect(provider.provider)}
        >
          {connecting && isConnectingProvider ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              Connecting...
            </>
          ) : isConnected ? (
            'Add More'
          ) : (
            'Connect'
          )}
        </Button>
      </div>
    </div>
  )
}
