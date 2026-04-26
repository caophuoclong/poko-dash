import {
  useQuery,
  type UseQueryOptions,
  type QueryKey,
} from '@tanstack/react-query'

export interface ApiQueryOptions<T> extends Omit<
  UseQueryOptions<T, Error, T, QueryKey>,
  'queryKey' | 'queryFn'
> {
  fallback?: T
  silentError?: boolean
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
