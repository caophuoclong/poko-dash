import { EmptyState, emptyStatePresets } from '#/components/ui/empty-state'
import { contentIdeasQueryOptions } from '#/features/contents/queries/content-idea-queries'
import { contentIdeasSchema } from '#/features/contents/schemas/content.schema'
import { createFileRoute } from '@tanstack/react-router'
import ContentSeedsPage from '#/features/contents/components/ContentSeedsPage'
import { TooltipProvider } from '#/components/ui/tooltip'

export const Route = createFileRoute('/dash/content/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(contentIdeasQueryOptions()),
  component: Component,
})

function Component() {
  const data = Route.useLoaderData()

  if (!data.data)
    return <EmptyState variant="page" {...emptyStatePresets.contentIdeas} />
  const parsed = contentIdeasSchema.parse(data.data.data)
  return (
    <TooltipProvider>
      <ContentSeedsPage ideas={parsed} />
    </TooltipProvider>
  )
  // return <ContentPage ideas={parsed} />
}
