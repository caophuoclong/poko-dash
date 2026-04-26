import {
  fetchScheduledJobs,
  fetchScheduledJobForPost,
  createScheduledJob,
  updateScheduledJob,
  cancelScheduledJob,
} from "../api/scheduler-api";
import type { ListScheduledJobsParams } from "../types/scheduler.dto";
import { useApiQuery, useApiMutation } from "@/hooks/use-api-query";

export function useScheduledJobs(params?: ListScheduledJobsParams) {
  return useApiQuery(
    ["scheduled-jobs", params ?? {}],
    () => fetchScheduledJobs(params),
    { fallback: [] },
  );
}

export function useScheduledJobForPost(postId: string) {
  return useApiQuery(
    ["scheduled-job", postId],
    () => fetchScheduledJobForPost(postId),
    { enabled: !!postId, fallback: null },
  );
}

export function useCreateScheduledJob() {
  return useApiMutation(createScheduledJob, {
    invalidateKeys: [["scheduled-job"]],
  });
}

export function useUpdateScheduledJob() {
  return useApiMutation(
    ({ jobId, data }: { jobId: string; data: Parameters<typeof updateScheduledJob>[1] }) =>
      updateScheduledJob(jobId, data),
    { invalidateKeys: [["scheduled-job"]] },
  );
}

export function useCancelScheduledJob() {
  return useApiMutation(cancelScheduledJob, {
    invalidateKeys: [["scheduled-job"]],
  });
}
