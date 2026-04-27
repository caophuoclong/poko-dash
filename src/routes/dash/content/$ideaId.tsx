import { createFileRoute } from '@tanstack/react-router'
import { contentIdeaQueryOptions } from '#/features/contents/queries/content-idea-queries'
import { ContentSchemaEntity } from '#/features/contents/schemas/content.schema'
import { SeedWorkspacePageWrapper } from '#/features/contents/components/seed-workspace/SeedWorkspacePageWrapper.example'

export const Route = createFileRoute('/dash/content/$ideaId')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(contentIdeaQueryOptions(params.ideaId)),
  component: Component,
})

function Component() {
  const idea = ContentSchemaEntity.parse(Route.useLoaderData())
  return <SeedWorkspacePageWrapper idea={idea} />
}
