import { createFileRoute } from '@tanstack/react-router'
import {
  contentPostsQueryOptions,
  contentIdeasQueryOptions,
} from '#/features/posts/queries/content-post-queries'
import PostListPage from '#/features/posts/components/PostList'

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
  const [posts] = Route.useLoaderData()
  const { ideaId } = Route.useSearch()
  return <PostListPage posts={posts} ideaId={ideaId} />
}
