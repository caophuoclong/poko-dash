import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
  type QueryKey,
} from '@tanstack/react-query'

export interface ApiQueryOptions<T> extends Omit<
  UseQueryOptions<T, Error, T, QueryKey>,
  'queryKey' | 'queryFn'
> {
  fallback?: T
  silentError?: boolean
}

export interface ApiMutationOptions<TData, TVariables> extends Omit<
  UseMutationOptions<TData, Error, TVariables>,
  'mutationFn'
> {
  invalidateKeys?: QueryKey[]
}

export function useApiQuery<T>(
  queryKey: QueryKey,
  fetcher: () => Promise<T>,
  options?: ApiQueryOptions<T>,
) {
  const { fallback, silentError = true, ...queryOptions } = options || {}

  return useQuery({
    queryKey,
    queryFn: async (): Promise<T> => {
      try {
        return await fetcher()
      } catch (error) {
        if (fallback !== undefined) {
          return fallback
        }
        if (silentError) {
          console.error(
            `API query failed for ${JSON.stringify(queryKey)}:`,
            error,
          )
        }
        throw error
      }
    },
    ...queryOptions,
  })
}

export function useApiMutation<TData, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: ApiMutationOptions<TData, TVariables>,
) {
  const queryClient = useQueryClient()
  const { invalidateKeys = [], onSuccess, ...mutationOptions } = options || {}

  return useMutation({
    mutationFn,
    onSuccess: async (data, variables, onMutateResult, context) => {
      if (invalidateKeys.length > 0) {
        await Promise.all(
          invalidateKeys.map((key) =>
            queryClient.invalidateQueries({ queryKey: key }),
          ),
        )
      }

      if (onSuccess) {
        await onSuccess(data, variables, onMutateResult, context)
      }
    },
    ...mutationOptions,
  })
}
