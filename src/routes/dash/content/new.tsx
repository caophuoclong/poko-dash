import { createFileRoute } from '@tanstack/react-router'
import { ContentIdeaCreatePage } from '#/features/contents/components/content-idea-create-page'

export const Route = createFileRoute('/dash/content/new')({
  component: ContentIdeaCreatePage,
})
