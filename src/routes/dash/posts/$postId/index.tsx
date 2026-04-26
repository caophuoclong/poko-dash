import { createFileRoute } from '@tanstack/react-router'
import { contentPostQueryOptions } from '#/features/posts/queries/content-post-queries'
import PostDetailPage from '#/features/posts/components/post-detail-page'

export const Route = createFileRoute('/dash/posts/$postId/')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(contentPostQueryOptions(params.postId)),
  component: RouteComponent,
})

function RouteComponent() {
  const { postId } = Route.useParams()
  return <PostDetailPage postId={postId} />
}
