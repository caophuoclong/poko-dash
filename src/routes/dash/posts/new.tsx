import { createFileRoute } from '@tanstack/react-router'
import { PostCreatePage } from '#/features/posts/components/post-create-page'

export const Route = createFileRoute('/dash/posts/new')({
  component: PostCreatePage,
})
