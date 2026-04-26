import { EmptyState, emptyStatePresets } from '#/components/ui/empty-state'
import { contentIdeasQueryOptions } from '#/features/contents/queries/content-idea-queries'
import ContentPage from '#/features/contents/components/ContentPostPage'
import { contentIdeasSchema } from '#/features/contents/schemas/content.schema'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dash/content')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(contentIdeasQueryOptions()),
  component: Component,
})

function Component() {
  const data = contentIdeasSchema.parse(Route.useLoaderData())
  if (!data || data.length === 0)
    return <EmptyState variant="page" {...emptyStatePresets.contentIdeas} />
  return <ContentPage ideas={data} />
}
