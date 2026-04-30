import { createFileRoute } from '@tanstack/react-router'
import {
  contentPostsQueryOptions,
  contentIdeasQueryOptions,
} from '#/features/posts/queries/content-post-queries'
import PostListPage from '#/features/posts/components/PostList'
import { ContentPostSummarySchema } from '#/features/posts'

export const Route = createFileRoute('/dash/posts/')({
  validateSearch: (search: Record<string, unknown>) => ({
    ideaId: typeof search.ideaId === 'string' ? search.ideaId : undefined,
  }),
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(contentPostsQueryOptions()),
      context.queryClient.ensureQueryData(contentIdeasQueryOptions()),
    ]),
  component: PostsPage,
})

function PostsPage() {
  const [data] = Route.useLoaderData()
  
  const { ideaId } = Route.useSearch()
  return (
    <PostListPage
      posts={ContentPostSummarySchema.array().parse(data.data.data)}
      ideaId={ideaId}
    />
  )
}
