import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type {
  GetPlatformIntegrationsResponse,
  PostPlatformIntegrationsRequest,
  GetAvailableTargetsResponse,
  PlatformProvider,
} from '#/dtos/platform-integrations'
import {
  fetchPlatformIntegrations,
  createPlatformIntegrations,
  reconnectIntegration,
  deleteIntegration,
  startOAuthConnect,
  fetchAvailableTargets,
} from '../api/platform-integrations-api'

export function usePlatformIntegrations(params?: {
  page?: number
  limit?: number
  provider?: string
  status?: string
}) {
  return useQuery({
    queryKey: ['platform-integrations', params ?? {}],
    queryFn: () => fetchPlatformIntegrations(params),
    placeholderData: {
      data: [],
      pagination: {
        total_records: 0,
        current_page: 1,
        total_pages: 0,
      },
    } as unknown as GetPlatformIntegrationsResponse,
  })
}

export function useStartPlatformConnect() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: { provider: PlatformProvider; redirectUri: string }) =>
      startOAuthConnect(params.provider, params.redirectUri),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platform-integrations'] })
    },
  })
}

export function useSelectIntegrationTargets() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: PostPlatformIntegrationsRequest) =>
      createPlatformIntegrations(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platform-integrations'] })
    },
  })
}

export function useReconnectIntegration() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => reconnectIntegration(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platform-integrations'] })
    },
  })
}

export function useDisconnectIntegration() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteIntegration(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platform-integrations'] })
    },
  })
}

export function useAvailableIntegrationTargets(
  provider: PlatformProvider,
  code: string,
) {
  return useQuery({
    queryKey: ['platform-oauth', 'available-targets', provider, code],
    queryFn: () => fetchAvailableTargets(provider, code),
    enabled: false,
  })
}

export type { GetAvailableTargetsResponse }
