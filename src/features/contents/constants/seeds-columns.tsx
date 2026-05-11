import {
  MoreHorizontal,
  Sparkles,
  Eye,
  CheckCircle,
  ExternalLink,
} from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '#/shared/utils'
import type { ContentIdeaEntity } from '../schemas/content.schema'
import { IdeaStatus } from '../schemas/content.schema'
import type { Product } from '@/features/products/types/product'
import { computeGenerationState } from '../utils/generation-state'

const SEED_STATUS_OPTIONS: {
  value: IdeaStatus
  label: string
  tone: 'neutral' | 'orange' | 'blue' | 'green' | 'red' | 'yellow' | 'purple'
}[] = [
  { value: IdeaStatus.Draft, label: 'Draft', tone: 'blue' },
  { value: IdeaStatus.Approved, label: 'Approved', tone: 'green' },
  { value: IdeaStatus.Queued, label: 'Queued', tone: 'yellow' },
  { value: IdeaStatus.Produced, label: 'Produced', tone: 'orange' },
  { value: IdeaStatus.Rejected, label: 'Archived', tone: 'neutral' },
]

const getSeedStatusOption = (status: IdeaStatus) =>
  SEED_STATUS_OPTIONS.find((s) => s.value === status)

/** Icon label map for each platform — reuse from existing constants */
const PLATFORM_LABELS: Record<string, string> = {
  tiktok: 'TikTok',
  facebook: 'Facebook',
  instagram: 'Instagram',
  youtube: 'YouTube',
  blog: 'Blog',
}

export interface IdeaGenerationSummary {
  totalProducts: number
  generatedProducts: number
  totalPosts: number
  productInfo: ProductGenerationInfo[]
}

export interface ProductGenerationInfo {
  productId: string
  hasPosts: boolean
  postCount: number
}

export interface SeedsColumnsProps {
  onGenerate: (ideaId: string) => void
  onGenerateProduct?: (ideaId: string, productId: string) => void
  isGenerating?: string | null
  generatingProductIds?: string[]
  onOpen?: (idea: ContentIdeaEntity) => void
  onApprove?: (idea: ContentIdeaEntity) => void
  onViewPosts?: (ideaId: string) => void
  onEdit?: (ideaId: string) => void
  onDelete?: (ideaId: string) => void
  onOpenFull?: (ideaId: string) => void
  productsMap?: Record<string, Product>
  generationSummaries?: Record<string, IdeaGenerationSummary>
  /** Selection state for checkbox column */
  selectedIds?: Set<string>
  onToggleSelect?: (ideaId: string) => void
  onToggleSelectAll?: () => void
  allSelected?: boolean
}

export function getSeedsColumns({
  onGenerate,
  onViewPosts,
  onApprove,
  onEdit,
  onDelete,
  onOpenFull,
  isGenerating,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  allSelected,
  generationSummaries = {},
}: SeedsColumnsProps): ColumnDef<ContentIdeaEntity>[] {
  return [
    {
      id: 'select',
      header: () => (
        <Checkbox
          checked={allSelected ?? false}
          onCheckedChange={() => onToggleSelectAll?.()}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedIds?.has(row.original.ideaId) ?? false}
          onCheckedChange={() => onToggleSelect?.(row.original.ideaId)}
          aria-label={`Select ${row.original.hook}`}
        />
      ),
      size: 48,
      enableSorting: false,
    },
    {
      accessorKey: 'hook',
      header: 'Hook',
      size: 280,
      cell: ({ row }) => {
        const idea = row.original
        return (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onOpenFull?.(idea.ideaId)
            }}
            className="font-medium text-sm text-near-white hover:text-accent-blue transition-colors line-clamp-2 text-left min-w-0"
          >
            {idea.hook || '—'}
          </button>
        )
      },
    },
    {
      accessorKey: 'angle',
      header: 'Angle',
      size: 180,
      cell: ({ row }) => (
        <span className="text-sm text-[var(--color-muted)] truncate block max-w-full">
          {row.original.angle || '—'}
        </span>
      ),
    },
    {
      accessorKey: 'targetPlatform',
      header: 'Platform',
      size: 100,
      cell: ({ row }) => {
        const platform = row.original.targetPlatform
        const label = PLATFORM_LABELS[platform]
        return (
          <span className="text-sm text-[var(--color-muted)]">
            {label || '—'}
          </span>
        )
      },
    },
    {
      accessorKey: 'category',
      header: 'Category',
      size: 120,
      cell: ({ row }) => (
        <span className="text-sm text-[var(--color-muted)]">
          {row.original.category || '—'}
        </span>
      ),
    },
    {
      accessorKey: 'ideaProducts',
      header: 'Linked Products',
      size: 130,
      cell: ({ row }) => {
        const count = row.original.ideaProducts?.length ?? 0
        return (
          <Badge tone="blue" size="sm">
            {count}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      size: 140,
      cell: ({ row }) => {
        const priority = row.original.priority
        const pct = Math.min(100, Math.max(0, priority * 10))
        return (
          <div className="flex items-center gap-2">
            <div className="h-1.5 flex-1 rounded-full bg-[var(--color-surface-strong)] overflow-hidden min-w-[60px]">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  pct >= 80
                    ? 'bg-accent-red'
                    : pct >= 50
                      ? 'bg-accent-orange'
                      : 'bg-accent-blue',
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-[var(--color-muted)] tabular-nums w-7 text-right">
              {pct}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      size: 110,
      cell: ({ row }) => {
        const statusOption = getSeedStatusOption(row.original.status)
        if (!statusOption)
          return <span className="text-sm text-[var(--color-muted)]">—</span>
        return (
          <Badge tone={statusOption.tone} size="sm">
            {statusOption.label}
          </Badge>
        )
      },
      enableSorting: true,
    },
    {
      id: 'actions',
      header: '',
      size: 140,
      cell: ({ row }) => {
        const idea = row.original
        const generating = isGenerating === idea.ideaId
        const postCount = idea.postIds?.length ?? 0
        const productCount = idea.ideaProducts?.length ?? 0
        const summary = generationSummaries[idea.ideaId]
        const genState = computeGenerationState(idea, summary)

        return (
          <div
            className="flex items-center gap-0.5 group/actions"
            onClick={(e) => e.stopPropagation()}
          >
            {genState.canGenerateAll && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-2 opacity-0 group-hover/actions:opacity-100 transition-opacity text-accent-orange hover:text-accent-orange-light"
                    onClick={() => onGenerate(idea.ideaId)}
                    disabled={generating}
                  >
                    <Sparkles size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {genState.actionHint ??
                    `Generate posts for ${productCount} linked product${productCount !== 1 ? 's' : ''}`}
                </TooltipContent>
              </Tooltip>
            )}

            {postCount > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-2 opacity-0 group-hover/actions:opacity-100 transition-opacity"
                    onClick={() => onViewPosts?.(idea.ideaId)}
                  >
                    <Eye size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {`${summary.totalPosts} post${summary.totalPosts !== 1 ? 's' : ''} across ${summary.generatedProducts} product${summary.generatedProducts !== 1 ? 's' : ''}`}
                </TooltipContent>
              </Tooltip>
            )}

            {idea.status === 'draft' && onApprove && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-2 opacity-0 group-hover/actions:opacity-100 transition-opacity text-accent-green hover:text-accent-green-light"
                    onClick={() => onApprove(idea)}
                  >
                    <CheckCircle size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {genState.blockedReason ??
                    'Approve seed to enable generation'}
                </TooltipContent>
              </Tooltip>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className="h-8 px-2">
                  <MoreHorizontal size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {genState.canGenerateAll && (
                  <DropdownMenuItem onClick={() => onGenerate(idea.ideaId)}>
                    <Sparkles size={14} className="mr-2" />
                    Generate All ({productCount} products)
                  </DropdownMenuItem>
                )}
                {postCount > 0 && (
                  <DropdownMenuItem onClick={() => onViewPosts?.(idea.ideaId)}>
                    <Eye size={14} className="mr-2" />
                    View posts
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onOpenFull?.(idea.ideaId)}>
                  <ExternalLink size={14} className="mr-2" />
                  Open full details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onEdit?.(idea.ideaId)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-accent-red"
                  onClick={() => onDelete?.(idea.ideaId)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      enableSorting: false,
    },
  ]
}
