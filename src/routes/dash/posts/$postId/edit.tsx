import { createFileRoute } from '@tanstack/react-router'
import { contentPostQueryOptions } from '#/features/posts/queries/content-post-queries'
import { PostEditPage } from '#/features/posts/components/PostEdit'

export const Route = createFileRoute('/dash/posts/$postId/edit')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(contentPostQueryOptions(params.postId)),
  component: RouteComponent,
})

function RouteComponent() {
  const { postId } = Route.useParams()
  return <PostEditPage postId={postId} />
}
