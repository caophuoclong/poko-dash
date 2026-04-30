import {
  ArrowLeft,
  Save,
  Sparkles,
  CheckCircle,
  MoreHorizontal,
  X,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { IdeaStatus } from '../../schemas/content.schema'
import type { ContentIdeaEntity } from '../../schemas/content.schema'

const STATUS_TONE: Record<
  IdeaStatus,
  'neutral' | 'blue' | 'green' | 'orange' | 'yellow' | 'red'
> = {
  [IdeaStatus.Draft]: 'blue',
  [IdeaStatus.Approved]: 'green',
  [IdeaStatus.Queued]: 'yellow',
  [IdeaStatus.Produced]: 'orange',
  [IdeaStatus.Rejected]: 'neutral',
}

const STATUS_LABEL: Record<IdeaStatus, string> = {
  [IdeaStatus.Draft]: 'Draft',
  [IdeaStatus.Approved]: 'Approved',
  [IdeaStatus.Queued]: 'Queued',
  [IdeaStatus.Produced]: 'Produced',
  [IdeaStatus.Rejected]: 'Archived',
}

interface SeedHeaderProps {
  idea: ContentIdeaEntity
  isDirty?: boolean
  isSaving?: boolean
  onSave: () => void
  onBack: () => void
  onApprove?: () => void
  onUnapprove?: () => void
  onGenerateAll?: () => void
  onDelete?: () => void
  isGenerating?: boolean
}

export function SeedHeader({
  idea,
  isDirty = false,
  isSaving = false,
  onSave,
  onBack,
  onApprove,
  onUnapprove,
  onGenerateAll,
  onDelete,
  isGenerating = false,
}: SeedHeaderProps) {
  const status = idea.status
  const statusTone = STATUS_TONE[status]
  const statusLabel = STATUS_LABEL[status]
  const isApproved = status === IdeaStatus.Approved
  const canGenerate = isApproved && (idea.ideaProducts?.length ?? 0) > 0

  return (
    <div className="sticky top-0 z-10 border-b border-frost bg-surface -mx-4 -mt-4 px-6 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <button
            onClick={onBack}
            className="shrink-0 p-2 hover:bg-surface-2 rounded-lg transition-colors"
            title="Back to seeds"
          >
            <ArrowLeft size={20} className="text-muted-text" />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-semibold text-near-white truncate">
                {idea.hook}
              </h1>
              <Badge tone={statusTone} size="sm">
                {statusLabel}
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-text">
              <span>
                Created {new Date(idea.createdAt).toLocaleDateString('vi-VN')}
              </span>
              <span>•</span>
              <span>
                {idea.ideaProducts?.length ?? 0} linked product
                {(idea.ideaProducts?.length ?? 0) !== 1 && 's'}
              </span>
              <span>•</span>
              <span>
                {idea.postIds?.length ?? 0} post
                {(idea.postIds?.length ?? 0) !== 1 && 's'} generated
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isDirty && (
            <span className="text-xs text-accent-orange font-medium px-2">
              Unsaved changes
            </span>
          )}

          {isApproved && onUnapprove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onUnapprove}
              className="text-accent-orange hover:text-accent-orange-light"
            >
              <X size={16} className="mr-1.5" />
              Unapprove
            </Button>
          )}

          {!isApproved && onApprove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onApprove}
              className="text-accent-green hover:text-accent-green-light"
            >
              <CheckCircle size={16} className="mr-1.5" />
              Approve
            </Button>
          )}

          {canGenerate && onGenerateAll && (
            <Button
              size="sm"
              onClick={onGenerateAll}
              disabled={isGenerating}
              className="bg-accent-orange hover:bg-accent-orange-light text-accent-on"
            >
              {isGenerating ? (
                <>
                  <Sparkles size={16} className="mr-1.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={16} className="mr-1.5" />
                  Generate All
                </>
              )}
            </Button>
          )}

          <Button size="sm" onClick={onSave} disabled={isSaving || !isDirty}>
            {isSaving ? (
              'Saving...'
            ) : (
              <>
                <Save size={16} className="mr-1.5" />
                Save
              </>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Duplicate seed</DropdownMenuItem>
              <DropdownMenuItem>Export settings</DropdownMenuItem>
              <DropdownMenuItem
                onClick={onDelete}
                className="text-accent-red"
              >
                Delete seed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
