import { createFileRoute } from '@tanstack/react-router'
import { contentPostsQueryOptions } from '#/features/posts/queries/content-post-queries'
import PostListPage from '#/features/posts/components/PostList'
import { ContentPostSummarySchema } from '#/features/posts'
import { MOCK_POSTS } from '#/features/posts/data/mock-posts'

export const Route = createFileRoute('/dash/posts/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(contentPostsQueryOptions()),
  component: PostsPage,
})

function PostsPage() {
  const data = Route.useLoaderData()

  let posts: any[]
  try {
    const parsed = ContentPostSummarySchema.array().parse(data.data.data)
    posts = parsed
  } catch {
    posts = []
  }

  // Fallback to mock data when API returns empty (e.g. backend not running)
  const displayPosts = posts.length > 0 ? posts : MOCK_POSTS

  return <PostListPage posts={displayPosts} />
}
