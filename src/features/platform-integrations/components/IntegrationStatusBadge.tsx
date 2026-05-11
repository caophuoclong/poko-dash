import { Badge } from '#/components/ui/badge'
import type { BadgeTone } from '#/components/ui/badge'
import type { PlatformIntegrationStatus } from '#/dtos/platform-integrations'
import { INTEGRATION_STATUS_META } from '../constants'

interface IntegrationStatusBadgeProps {
  status: PlatformIntegrationStatus
  className?: string
}

export function IntegrationStatusBadge({
  status,
  className,
}: IntegrationStatusBadgeProps) {
  const meta = INTEGRATION_STATUS_META[status] ?? {
    label: status,
    tone: 'neutral',
  }

  return (
    <Badge tone={meta.tone} size="sm" className={className}>
      {meta.label}
    </Badge>
  )
}
