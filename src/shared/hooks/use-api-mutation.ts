import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { QueryKey } from '@tanstack/react-query'

export interface ApiMutationOptions<TData, TVariables> {
  invalidateKeys?: QueryKey[]
  onSuccess?: (data: TData, variables: TVariables) => Promise<void> | void
}

export function useApiMutation<TData, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: ApiMutationOptions<TData, TVariables>,
) {
  const queryClient = useQueryClient()
  const { invalidateKeys = [], onSuccess, ...mutationOptions } = options || {}

  return useMutation({
    mutationFn,
    onSuccess: async (data, variables) => {
      if (invalidateKeys.length > 0) {
        await Promise.all(
          invalidateKeys.map((key) =>
            queryClient.invalidateQueries({ queryKey: key }),
          ),
        )
      }

      if (onSuccess) {
        await onSuccess(data, variables)
      }
    },
    ...mutationOptions,
  })
}
