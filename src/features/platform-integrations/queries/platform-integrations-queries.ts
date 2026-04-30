import { queryOptions } from '@tanstack/react-query'
import type {
  GetPlatformIntegrationsResponse,
  PlatformProvider,
} from '#/dtos/platform-integrations'
import {
  fetchPlatformIntegrations,
  fetchAvailableTargets,
} from '../api/platform-integrations-api'

export const platformIntegrationsQueryOptions = (params?: {
  page?: number
  limit?: number
  provider?: string
  status?: string
}) =>
  queryOptions<GetPlatformIntegrationsResponse>({
    queryKey: ['platform-integrations', params ?? {}],
    queryFn: () => fetchPlatformIntegrations(params),
    staleTime: 15_000,
  })

export const availableTargetsQueryOptions = (
  provider: PlatformProvider,
  code: string,
) =>
  queryOptions({
    queryKey: ['platform-oauth', 'available-targets', provider, code],
    queryFn: () => fetchAvailableTargets(provider, code),
    staleTime: 0,
    enabled: false,
  })
