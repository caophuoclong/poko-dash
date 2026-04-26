import type { CreatePromptRequest, UpdatePromptRequest, RefinePromptRequest, RatePromptRequest, CompilePromptRequest } from "../types/prompt";
import {
  fetchPrompts,
  fetchPromptById,
  createPrompt,
  updatePrompt,
  deletePrompt,
  refinePrompt,
  ratePrompt,
  compilePrompt,
  recordPromptUsage,
  fetchPromptVersions,
  searchPrompts,
  fetchMostUsedPrompts,
  fetchHighestRatedPrompts,
  fetchPromptsByType,
  fetchPromptsByCategory,
  fetchPromptsByRole,
  fetchPromptsByTags,
} from "../api/prompt-api";
import { useApiQuery, useApiMutation } from "@/hooks/use-api-query";

export function usePrompts(params?: { status?: string }) {
  return useApiQuery(
    ["prompts", params],
    () => fetchPrompts(params),
    { fallback: [] },
  );
}

export function usePrompt(promptId: string) {
  return useApiQuery(
    ["prompts", promptId],
    () => fetchPromptById(promptId),
    { enabled: !!promptId, silentError: false },
  );
}

export function useMostUsedPrompts(limit = 10) {
  return useApiQuery(
    ["prompts", "trending", "most-used", limit],
    () => fetchMostUsedPrompts(limit),
    { fallback: [] },
  );
}

export function useHighestRatedPrompts(limit = 10) {
  return useApiQuery(
    ["prompts", "trending", "highest-rated", limit],
    () => fetchHighestRatedPrompts(limit),
    { fallback: [] },
  );
}

export function usePromptVersions(promptId: string) {
  return useApiQuery(
    ["prompts", promptId, "versions"],
    () => fetchPromptVersions(promptId),
    { enabled: !!promptId, fallback: { versions: [] } },
  );
}

export function useSearchPrompts(query: string) {
  return useApiQuery(
    ["prompts", "search", query],
    () => searchPrompts(query),
    { enabled: query.length > 1, fallback: [] },
  );
}

export function useCreatePrompt() {
  return useApiMutation((data: CreatePromptRequest) => createPrompt(data), {
    invalidateKeys: [["prompts"]],
  });
}

export function useUpdatePrompt() {
  return useApiMutation(
    ({ promptId, data }: { promptId: string; data: UpdatePromptRequest }) =>
      updatePrompt(promptId, data),
    { invalidateKeys: [["prompts"]] },
  );
}

export function useDeletePrompt() {
  return useApiMutation((promptId: string) => deletePrompt(promptId), {
    invalidateKeys: [["prompts"]],
  });
}

export function useCompilePrompt() {
  return useApiMutation(
    ({ promptId, data }: { promptId: string; data: CompilePromptRequest }) =>
      compilePrompt(promptId, data),
  );
}

export function useRecordPromptUsage() {
  return useApiMutation((promptId: string) => recordPromptUsage(promptId), {
    invalidateKeys: [["prompts"]],
  });
}

export function useRefinePrompt() {
  return useApiMutation(
    ({ promptId, data }: { promptId: string; data: RefinePromptRequest }) =>
      refinePrompt(promptId, data),
    { invalidateKeys: [["prompts"]] },
  );
}

export function useRatePrompt() {
  return useApiMutation(
    ({ promptId, data }: { promptId: string; data: RatePromptRequest }) =>
      ratePrompt(promptId, data),
    { invalidateKeys: [["prompts"]] },
  );
}

export function useFetchPromptsByRole() {
  return useApiMutation((role: string) => fetchPromptsByRole(role));
}

export function useFetchPromptsByType() {
  return useApiMutation((type: string) => fetchPromptsByType(type));
}

export function useFetchPromptsByCategory() {
  return useApiMutation((category: string) => fetchPromptsByCategory(category));
}

export function useFetchPromptsByTags() {
  return useApiMutation((tags: string[]) => fetchPromptsByTags(tags));
}
