import { PROVIDERS } from '../constants'
import { ProviderConnectCard } from './ProviderConnectCard'
import type { Provider } from '../types'

interface ProviderConnectGridProps {
  connectedCounts: Record<Provider, { total: number; active: number }>
  connecting: boolean
  connectingProvider: Provider | null
  onConnect: (provider: Provider) => void
}

export function ProviderConnectGrid({
  connectedCounts,
  connecting,
  connectingProvider,
  onConnect,
}: ProviderConnectGridProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {PROVIDERS.map((provider) => (
        <ProviderConnectCard
          key={provider.provider}
          provider={provider}
          connectedCount={connectedCounts[provider.provider]?.total ?? 0}
          activeCount={connectedCounts[provider.provider]?.active ?? 0}
          connecting={connecting}
          isConnectingProvider={connectingProvider === provider.provider}
          onConnect={onConnect}
        />
      ))}
    </div>
  )
}
