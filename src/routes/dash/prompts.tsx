import { createFileRoute } from '@tanstack/react-router'
import { promptsQueryOptions } from '#/features/prompts/queries/prompt-queries'
import PromptGeneratorPage from '#/features/prompts/components/prompt-generator-page'

export const Route = createFileRoute('/dash/prompts')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(promptsQueryOptions()),
  component: PromptGeneratorPage,
})
