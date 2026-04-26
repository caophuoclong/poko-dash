// layer: types
export interface ApiQueryOptions<T> {
  fallback?: T
  silentError?: boolean
}

export interface ApiMutationOptions<TData, TVariables> {
  invalidateKeys?: QueryKey[]
  onSuccess?: (data: TData, variables: TVariables) => Promise<void> | void
}

export type QueryKey = readonly unknown[]
