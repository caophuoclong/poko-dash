import { createFileRoute } from '@tanstack/react-router'
import { contentPostsQueryOptions } from '#/features/posts/queries/content-post-queries'
import PostListPage from '#/features/posts/components/PostList'

export const Route = createFileRoute('/dash/posts/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(contentPostsQueryOptions()),
  component: PostsPage,
})

function PostsPage() {
  const posts = Route.useLoaderData()
  return <PostListPage posts={posts} />
}
