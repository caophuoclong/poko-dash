// layer: logic
import { queryOptions } from '@tanstack/react-query'

export function createQueryOptions<T>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<T>,
  staleTime: number = 30_000,
) {
  return queryOptions<T>({
    queryKey,
    queryFn,
    staleTime,
  })
}

export function createResourceQueryOptions<T, TFilter = void>(
  resourceKey: string,
  fetchers: {
    fetchAll: (filter?: TFilter) => Promise<T[]>
    fetchOne: (id: string) => Promise<T>
  },
) {
  const allQueryOptions = (filter?: TFilter) =>
    createQueryOptions([resourceKey, filter ?? {}], () => fetchers.fetchAll(filter))

  const oneQueryOptions = (id: string) =>
    createQueryOptions([resourceKey, id], () => fetchers.fetchOne(id))

  return { allQueryOptions, oneQueryOptions }
}
