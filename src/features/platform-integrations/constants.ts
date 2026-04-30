import type { ProviderConfig } from './types'
import type { PlatformIntegrationStatus } from '#/dtos/platform-integrations'
import type { BadgeTone } from '#/components/ui/badge'

export const PROVIDERS: ProviderConfig[] = [
  {
    provider: 'facebook',
    name: 'Facebook',
    description:
      'Connect Facebook Pages to publish posts directly from Poko.',
    targetLabelSingular: 'Page',
    targetLabelPlural: 'Pages',
  },
  {
    provider: 'tiktok',
    name: 'TikTok',
    description:
      'Connect TikTok accounts to publish content to your profile.',
    targetLabelSingular: 'Account',
    targetLabelPlural: 'Accounts',
  },
]

export const INTEGRATION_STATUS_META: Record<
  PlatformIntegrationStatus,
  { label: string; tone: BadgeTone }
> = {
  active: { label: 'Active', tone: 'green' },
  expired: { label: 'Expired', tone: 'orange' },
  revoked: { label: 'Revoked', tone: 'red' },
  error: { label: 'Error', tone: 'red' },
}

export function formatTokenExpiry(expiresAt?: string): string {
  if (!expiresAt) return 'No expiry'
  const expiryDate = new Date(expiresAt)
  const now = new Date()
  const diffMs = expiryDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return 'Expired'
  if (diffDays === 0) return 'Expires today'
  if (diffDays === 1) return 'Expires in 1 day'
  if (diffDays < 30) return `Expires in ${diffDays} days`
  const diffMonths = Math.floor(diffDays / 30)
  if (diffMonths === 1) return 'Expires in 1 month'
  return `Expires in ${diffMonths} months`
}
