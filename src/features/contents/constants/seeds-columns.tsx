import { useState } from 'react'
import {
  ExternalLink,
  ChevronRight,
  Sparkles,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Eye,
  Package,
  ChevronDown,
  Loader2,
} from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn, formatRelativeTime } from '#/shared/utils'
import type { ContentIdeaEntity } from '../schemas/content.schema'
import { IdeaType, TargetPlatform, IdeaStatus } from '../schemas/content.schema'
import type { Product } from '@/features/products/types/product'
import {
  computeGenerationState,
  isProductGenerated,
  isProductGenerating,
  generateActionTooltip,
} from '../utils/generation-state'
import type { GenerationState } from '../utils/generation-state'

const TYPE_OPTIONS: {
  value: IdeaType
  label: string
  tone: 'neutral' | 'orange' | 'blue' | 'green' | 'red' | 'yellow' | 'purple'
}[] = [
  { value: IdeaType.Review, label: 'Review', tone: 'blue' },
  { value: IdeaType.Comparison, label: 'So sánh', tone: 'purple' },
  { value: IdeaType.Roundup, label: 'Tổng hợp', tone: 'orange' },
  { value: IdeaType.Tutorial, label: 'Hướng dẫn', tone: 'green' },
  { value: IdeaType.Deal, label: 'Deal', tone: 'red' },
  { value: IdeaType.Trending, label: 'Xu hướng', tone: 'yellow' },
]

const PLATFORM_OPTIONS: { value: TargetPlatform; label: string }[] = [
  { value: TargetPlatform.TikTok, label: 'TikTok' },
  { value: TargetPlatform.Facebook, label: 'Facebook' },
  { value: TargetPlatform.Instagram, label: 'Instagram' },
  { value: TargetPlatform.YouTube, label: 'YouTube' },
  { value: TargetPlatform.Blog, label: 'Blog' },
]

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

const GENERATION_STATUS_OPTIONS: {
  value: string
  label: string
  tone: 'neutral' | 'orange' | 'blue' | 'green' | 'red' | 'yellow' | 'purple'
}[] = [
  { value: 'never', label: 'Never generated', tone: 'neutral' },
  { value: 'recent', label: 'Generated recently', tone: 'green' },
  { value: 'partial', label: 'Partially generated', tone: 'yellow' },
  { value: 'review', label: 'Needs review', tone: 'red' },
]

const getGenerationStatus = (idea: ContentIdeaEntity): string => {
  const postCount = idea.postIds?.length ?? 0
  if (postCount === 0) return 'never'
  if (idea.status === 'produced') return 'recent'
  if (idea.status === 'approved') return 'partial'
  return 'review'
}

const getTypeOption = (type: IdeaType) =>
  TYPE_OPTIONS.find((t) => t.value === type)
const getPlatformOption = (platform: TargetPlatform) =>
  PLATFORM_OPTIONS.find((p) => p.value === platform)
const getSeedStatusOption = (status: IdeaStatus) =>
  SEED_STATUS_OPTIONS.find((s) => s.value === status)
const getGenerationStatusOption = (idea: ContentIdeaEntity) =>
  GENERATION_STATUS_OPTIONS.find((s) => s.value === getGenerationStatus(idea))

export interface ProductGenerationInfo {
  productId: string
  hasPosts: boolean
  postCount: number
}

export interface IdeaGenerationSummary {
  totalProducts: number
  generatedProducts: number
  totalPosts: number
  productInfo: ProductGenerationInfo[]
}

export interface SeedsColumnsProps {
  onGenerate: (ideaId: string) => void
  onGenerateProduct: (ideaId: string, productId: string) => void
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
}

export function getSeedsColumns({
  onGenerate,
  onGenerateProduct,
  isGenerating,
  generatingProductIds = [],
  onOpen,
  onApprove,
  onViewPosts,
  onEdit,
  onDelete,
  onOpenFull,
  productsMap = {},
  generationSummaries = {},
}: SeedsColumnsProps): ColumnDef<ContentIdeaEntity>[] {
  return [
    {
      accessorKey: 'seed',
      header: 'Seed',
      size: 320,
      cell: ({ row }) => {
        const idea = row.original
        const typeOption = getTypeOption(idea.ideaType)
        const platformOption = getPlatformOption(idea.targetPlatform)

        return (
          <div className="min-w-0">
            <div className="flex items-start gap-2">
              <button
                onClick={() => onOpenFull?.(idea.ideaId)}
                className="font-medium text-sm text-near-white hover:text-accent-blue transition-colors line-clamp-2 flex-1 text-left"
              >
                {idea.hook}
              </button>
              <ExternalLink
                size={14}
                className="shrink-0 text-muted-text hover:text-near-white"
              />
            </div>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              {typeOption && (
                <Badge tone={typeOption.tone} size="sm">
                  {typeOption.label}
                </Badge>
              )}
              <span className="text-xs text-muted-text">{idea.category}</span>
              {platformOption && (
                <>
                  <span className="text-xs text-muted-text">•</span>
                  <span className="text-xs text-muted-text">
                    {platformOption.label}
                  </span>
                </>
              )}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'angle',
      header: 'Angles',
      size: 180,
      cell: ({ row }) => {
        const idea = row.original
        const angles =
          idea.angle
            ?.split(',')
            .map((a) => a.trim())
            .filter(Boolean) ?? []
        const displayedAngles = angles.slice(0, 2)
        const remainingCount = angles.length - 2

        return (
          <div className="flex flex-wrap gap-1">
            {displayedAngles.map((angle, idx) => (
              <Badge key={idx} tone="neutral" size="sm" variant="soft">
                {angle}
              </Badge>
            ))}
            {remainingCount > 0 && (
              <span className="text-xs text-muted-text">
                +{remainingCount} more
              </span>
            )}
            {angles.length === 0 && (
              <span className="text-xs text-muted-text">—</span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'ideaProducts',
      header: 'Products',
      size: 320,
      cell: ({ row }) => {
        const idea = row.original
        const productIds = idea.ideaProducts ?? []
        const summary = generationSummaries[idea.ideaId]
        const generationState = computeGenerationState(idea, summary)

        return (
          <ProductsCell
            productIds={productIds}
            productsMap={productsMap}
            ideaId={idea.ideaId}
            generationState={generationState}
            summary={summary}
            onGenerateProduct={onGenerateProduct}
            generatingProductIds={generatingProductIds}
          />
        )
      },
    },
    {
      accessorKey: 'output',
      header: 'Output',
      size: 160,
      cell: ({ row }) => {
        const idea = row.original
        const summary = generationSummaries[idea.ideaId]
        const totalPosts = idea.postIds?.length ?? 0

        if (totalPosts === 0) {
          return (
            <div>
              <span className="text-xs text-muted-text">No posts yet</span>
              {summary.totalProducts > 0 && (
                <div className="text-[10px] text-muted-text mt-0.5">
                  {summary.totalProducts} product
                  {summary.totalProducts !== 1 && 's'} linked
                </div>
              )}
            </div>
          )
        }

        const { totalProducts, generatedProducts } = summary
        const allGenerated = generatedProducts >= totalProducts

        return (
          <div>
            <div className="flex items-center gap-1.5">
              <Badge tone={allGenerated ? 'green' : 'yellow'} size="sm">
                {summary.totalPosts} post{summary.totalPosts !== 1 && 's'}
              </Badge>
            </div>
            <div className="text-xs text-muted-text mt-0.5">
              {generatedProducts}/{totalProducts} product
              {totalProducts !== 1 && 's'} generated
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'Seed Status',
      size: 120,
      cell: ({ row }) => {
        const idea = row.original
        const statusOption = getSeedStatusOption(idea.status)

        if (!statusOption)
          return <span className="text-xs text-muted-text">—</span>

        return (
          <Badge tone={statusOption.tone} size="sm">
            {statusOption.label}
          </Badge>
        )
      },
      enableSorting: true,
    },
    {
      accessorKey: 'generationStatus',
      header: 'Generation Status',
      size: 140,
      cell: ({ row }) => {
        const idea = row.original
        const generationStatus = getGenerationStatusOption(idea)

        if (!generationStatus)
          return <span className="text-xs text-muted-text">—</span>

        return (
          <div className="flex items-center gap-1.5">
            {generationStatus.value === 'never' && (
              <Clock size={14} className="text-muted-text" />
            )}
            {generationStatus.value === 'recent' && (
              <CheckCircle size={14} className="text-accent-green" />
            )}
            {generationStatus.value === 'partial' && (
              <Clock size={14} className="text-accent-yellow" />
            )}
            {generationStatus.value === 'review' && (
              <AlertCircle size={14} className="text-accent-red" />
            )}
            <Badge tone={generationStatus.tone} size="sm">
              {generationStatus.label}
            </Badge>
          </div>
        )
      },
      enableSorting: true,
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      size: 80,
      cell: ({ row }) => {
        const priority = row.original.priority

        return (
          <div className="flex items-center gap-1">
            <div
              className={cn(
                'w-2 h-2 rounded-full',
                priority >= 80
                  ? 'bg-accent-red'
                  : priority >= 50
                    ? 'bg-accent-yellow'
                    : 'bg-accent-blue',
              )}
            />
            <span className="text-xs text-muted-text">{priority}</span>
          </div>
        )
      },
      enableSorting: true,
    },
    {
      accessorKey: 'updatedAt',
      header: 'Updated',
      size: 120,
      cell: ({ getValue }) => (
        <span className="text-xs text-muted-text">
          {formatRelativeTime(getValue<string>())}
        </span>
      ),
      enableSorting: true,
    },
    {
      id: 'actions',
      header: '',
      size: 200,
      cell: ({ row }) => {
        const idea = row.original
        const generating = isGenerating === idea.ideaId
        const postCount = idea.postIds?.length ?? 0
        const productCount = idea.ideaProducts?.length ?? 0
        const summary = generationSummaries[idea.ideaId]
        const genState = computeGenerationState(idea, summary)

        return (
          <div className="flex items-center gap-0.5 group/actions">
            {genState.canGenerateAll && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-2 text-accent-orange hover:text-accent-orange-light"
                    onClick={() => onGenerate(idea.ideaId)}
                    disabled={generating}
                  >
                    {generating ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Sparkles size={14} />
                    )}
                    <span className="ml-1.5 text-xs font-medium hidden group-hover/actions:inline">
                      Generate All
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {generating
                    ? 'Generating posts for all linked products...'
                    : (genState.actionHint ??
                      `Generate posts for ${productCount} linked product${productCount !== 1 ? 's' : ''}`)}
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

            {onOpen && (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-2 opacity-0 group-hover/actions:opacity-100 transition-opacity"
                onClick={() => onOpen(idea)}
              >
                <ArrowRight size={14} />
              </Button>
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

const PRODUCT_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
]

function getProductColor(idx: number): string {
  return PRODUCT_COLORS[idx % PRODUCT_COLORS.length]
}

interface ProductsCellProps {
  productIds: string[]
  productsMap: Record<string, Product>
  ideaId: string
  generationState: GenerationState
  summary?: IdeaGenerationSummary
  onGenerateProduct: (ideaId: string, productId: string) => void
  generatingProductIds: string[]
}

function ProductsCell({
  productIds,
  productsMap,
  ideaId,
  generationState,
  summary,
  onGenerateProduct,
  generatingProductIds,
}: ProductsCellProps) {
  const [expanded, setExpanded] = useState(false)

  if (productIds.length === 0) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-text">
        <Package size={14} />
        <span>No products</span>
      </div>
    )
  }

  const displayCount = expanded ? productIds.length : 3
  const remainingCount = productIds.length - 3

  return (
    <div className="space-y-1.5">
      {productIds.slice(0, displayCount).map((productId, idx) => {
        const product = productsMap[productId]
        const productSummary = summary?.productInfo.find(
          (p) => p.productId === productId,
        )
        const generating = isProductGenerating(productId, generatingProductIds)
        const generated = isProductGenerated(productId, generationState)
        const canGen = generationState.canGenerateSeed && !generated
        const canReGen = generated && generationState.canRegenerate
        const tooltip = generateActionTooltip(
          productId,
          generationState,
          generatingProductIds,
        )
        const color = getProductColor(idx)
        if (!product) return null
        return (
          <div
            key={productId}
            className="flex items-center gap-2 min-w-0 group/product"
          >
            <div
              className="w-6 h-6 rounded shrink-0 flex items-center justify-center text-[10px] font-bold text-white"
              style={{ backgroundColor: color }}
            >
              {product.canonicalTitle.charAt(0).toUpperCase()}
            </div>

            <span className="text-xs text-muted-text truncate flex-1 min-w-0">
              {product.canonicalTitle}
            </span>

            {generating ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center shrink-0 text-accent-orange">
                    <Loader2 size={12} className="animate-spin" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>{tooltip}</TooltipContent>
              </Tooltip>
            ) : generated ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center gap-1 shrink-0 text-[10px] text-accent-green">
                    <CheckCircle size={12} />
                    {productSummary!.postCount}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {productSummary!.postCount} post
                  {productSummary!.postCount !== 1 && 's'} generated
                </TooltipContent>
              </Tooltip>
            ) : canGen || canReGen ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 opacity-0 group-hover/product:opacity-100 transition-opacity text-accent-orange hover:text-accent-orange-light shrink-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      onGenerateProduct(ideaId, productId)
                    }}
                  >
                    <Sparkles size={12} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{tooltip}</TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center shrink-0 opacity-30">
                    <Sparkles size={12} className="text-muted-text" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {generationState.blockedReason ?? 'Generation not available'}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        )
      })}

      {remainingCount > 0 && !expanded && (
        <button
          className="flex items-center gap-1 text-xs text-accent-blue hover:text-accent-blue-light transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            setExpanded(true)
          }}
        >
          <ChevronDown size={12} />+{remainingCount} more
        </button>
      )}

      {expanded && remainingCount > 0 && (
        <button
          className="flex items-center gap-1 text-xs text-muted-text hover:text-near-white transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            setExpanded(false)
          }}
        >
          <ChevronRight size={12} />
          Show less
        </button>
      )}
    </div>
  )
}
