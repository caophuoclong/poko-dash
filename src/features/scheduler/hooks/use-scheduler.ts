import { useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'
import {
  useSchedulerControllerList,
  getSchedulerControllerListQueryKey,
  useSchedulerControllerCreate,
  useSchedulerControllerFindById,
  useSchedulerControllerPatch,
  useSchedulerControllerCancel,
} from '#/api/client'
import type { ListScheduledJobsParams } from '../types/scheduler.dto'

export function useScheduledJobs(params?: ListScheduledJobsParams) {
  return useSchedulerControllerList({
    query: {
      select: (res: any) => res.data,
      placeholderData: [] as any,
    },
  })
}

export function useScheduledJobForPost(postId: string) {
  return useSchedulerControllerList({
    query: {
      enabled: !!postId,
      select: (res: any) => {
        const data = res.data as any[]
        return data?.[0] ?? null
      },
      placeholderData: null,
    },
  })
}

export function useCreateScheduledJob() {
  const queryClient = useQueryClient()
  const m = useSchedulerControllerCreate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getSchedulerControllerListQueryKey(),
        })
      },
    },
  })
  const { mutate: origMutate, mutateAsync: origMutateAsync, ...rest } = m
  return {
    ...rest,
    mutate: (variables: any, options?: any) => origMutate({ data: variables } as any, options),
    mutateAsync: (variables: any, options?: any) => origMutateAsync({ data: variables } as any, options),
  } as UseMutationResult<any, any, any>
}

export function useUpdateScheduledJob() {
  const queryClient = useQueryClient()
  const m = useSchedulerControllerPatch({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getSchedulerControllerListQueryKey(),
        })
      },
    },
  })
  const { mutate: origMutate, mutateAsync: origMutateAsync, ...rest } = m
  return {
    ...rest,
    mutate: (variables: any, options?: any) =>
      origMutate({ jobId: variables.jobId, data: variables.data } as any, options),
    mutateAsync: (variables: any, options?: any) =>
      origMutateAsync({ jobId: variables.jobId, data: variables.data } as any, options),
  } as UseMutationResult<any, any, any>
}

export function useCancelScheduledJob() {
  const queryClient = useQueryClient()
  const m = useSchedulerControllerCancel({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getSchedulerControllerListQueryKey(),
        })
      },
    },
  })
  const { mutate: origMutate, mutateAsync: origMutateAsync, ...rest } = m
  return {
    ...rest,
    mutate: (variables: any, options?: any) => origMutate({ jobId: variables } as any, options),
    mutateAsync: (variables: any, options?: any) => origMutateAsync({ jobId: variables } as any, options),
  } as UseMutationResult<any, any, any>
}
