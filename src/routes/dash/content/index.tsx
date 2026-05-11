import { useMemo } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { EmptyState, emptyStatePresets } from '#/components/ui/empty-state'
import { usePageHeader } from '#/components/ui/page-header-context'
import { TooltipProvider } from '#/components/ui/tooltip'
import ContentSeedsPage from '#/features/contents/components/ContentSeedsPage'
import { MOCK_CONTENT_IDEAS } from '#/features/contents/data/mock-content-ideas'
import { contentIdeasSchema } from '#/features/contents/schemas/content.schema'

export const Route = createFileRoute('/dash/content/')({
  component: Component,
})

function Component() {
  const navigate = useNavigate()

  const ideas = useMemo(() => {
    try {
      return contentIdeasSchema.parse(MOCK_CONTENT_IDEAS)
    } catch {
      return []
    }
  }, [])

  const handleCreateSeed = () => {
    navigate({ to: '/dash/content/new' })
  }

  usePageHeader({
    title: 'Content Seeds',
    subtitle: 'Reusable content directions linked to products',
    actions: (
      <Button
        size="sm"
        className="inline-flex items-center gap-1.5"
        onClick={handleCreateSeed}
      >
        <Plus size={16} />
        Create Seed
      </Button>
    ),
  })

  if (ideas.length === 0) {
    return (
      <EmptyState
        variant="page"
        {...emptyStatePresets.contentSeeds}
        primaryAction={
          <Button onClick={handleCreateSeed}>
            <Plus size={16} className="mr-1.5" />
            Create seed
          </Button>
        }
      />
    )
  }

  return (
    <TooltipProvider>
      <ContentSeedsPage ideas={ideas} />
    </TooltipProvider>
  )
}
