import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'
import {
  getProductsControllerListAllQueryOptions,
  getProductsControllerGetByIdQueryOptions,
  useAffiliateLinksControllerList,
  useAffiliateLinksControllerCreate,
  useAffiliateLinksControllerPatch,
  getAffiliateLinksControllerListQueryKey,
  getProductsControllerListAllQueryKey,
} from '#/api/client'
import type {
  ManualImportRequest,
  ManualImportResponse,
} from '../types/manual-import'

export function useProducts() {
  const queryOptions = getProductsControllerListAllQueryOptions()
  return useQuery({
    ...queryOptions,
    placeholderData: [] as any,
    select: (res) => res.data,
  })
}

export function useProduct(productId: string) {
  const queryOptions = getProductsControllerGetByIdQueryOptions(productId, {
    query: { enabled: !!productId },
  })
  return useQuery({
    ...queryOptions,
    select: (res: any) => res.data,
  })
}

export function useAllAffiliateLinks() {
  return useAffiliateLinksControllerList({
    query: {
      select: (res: any) => res.data,
      placeholderData: [] as any,
    },
  })
}

export function useAffiliateLinks(productId: string) {
  return useAffiliateLinksControllerList({
    query: {
      enabled: !!productId,
      select: (res: any) => res.data,
      placeholderData: [] as any,
    },
  })
}

export function useCreateAffiliateLink() {
  const queryClient = useQueryClient()
  const m = useAffiliateLinksControllerCreate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getAffiliateLinksControllerListQueryKey(),
        })
      },
    },
  })
  const { mutate: origMutate, mutateAsync: origMutateAsync, ...rest } = m
  return {
    ...rest,
    mutate: (variables: any, options?: any) =>
      origMutate({ data: variables }, options),
    mutateAsync: (variables: any, options?: any) =>
      origMutateAsync({ data: variables }, options),
  }
}

export function useUpdateAffiliateLink() {
  const queryClient = useQueryClient()
  const m = useAffiliateLinksControllerPatch({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getAffiliateLinksControllerListQueryKey(),
        })
      },
    },
  })
  const { mutate: origMutate, mutateAsync: origMutateAsync, ...rest } = m
  return {
    ...rest,
    mutate: (variables: any, options?: any) =>
      origMutate({ linkId: variables.linkId, data: variables.data }, options),
    mutateAsync: (variables: any, options?: any) =>
      origMutateAsync(
        { linkId: variables.linkId, data: variables.data },
        options,
      ),
  }
}

export function useManualImport() {
  const queryClient = useQueryClient()
  return useMutation<ManualImportResponse, Error, ManualImportRequest>({
    mutationFn: async (data) => {
      const res = await fetch('/api/manual-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        throw new Error(`Manual import failed: ${res.status}`)
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getProductsControllerListAllQueryKey(),
      })
    },
  })
}
