import { createFileRoute } from '@tanstack/react-router'
import { contentIdeaQueryOptions } from '#/features/contents/queries/content-idea-queries'
import { ContentIdeaDetailPage } from '#/features/contents/components/content-idea-detail-page'

export const Route = createFileRoute('/dash/content/$ideaId')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(contentIdeaQueryOptions(params.ideaId)),
  component: Component,
})

function Component() {
  const { ideaId } = Route.useParams()
  return <ContentIdeaDetailPage ideaId={ideaId} />
}
