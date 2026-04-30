import type {
  PlatformIntegrationDto,
  PlatformProvider,
  PlatformIntegrationStatus,
  AvailablePlatformTargetDto,
} from '#/dtos/platform-integrations'

export type Integration = PlatformIntegrationDto
export type Provider = PlatformProvider
export type IntegrationStatus = PlatformIntegrationStatus
export type AvailableTarget = AvailablePlatformTargetDto

export interface ProviderConfig {
  provider: Provider
  name: string
  description: string
  targetLabelSingular: string
  targetLabelPlural: string
}
