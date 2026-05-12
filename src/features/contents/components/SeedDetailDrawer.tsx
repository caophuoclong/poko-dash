import { useMemo } from 'react'
import {
  X,
  ExternalLink,
  Edit,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Package,
  Clock,
  Loader2,
  Eye,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn, formatRelativeTime } from '#/shared/utils'
import type { ContentIdeaEntity } from '../schemas/content.schema'
import { IdeaType, TargetPlatform, IdeaStatus } from '../schemas/content.schema'
import { useProducts } from '@/features/products/hooks/use-products'
import type { Product } from '@/features/products/types/product'
import type { IdeaGenerationSummary } from '../constants/seeds-columns'
import {
  computeGenerationState,
  isProductGenerated,
  isProductGenerating,
  generateActionTooltip,
} from '../utils/generation-state'
import { useGenerateContentPosts } from '#/features/posts'
import type { ContentPostParsed } from '#/features/posts'

const PRODUCT_COLORS = [
  'var(--color-primary)',
  'var(--color-legal-link)',
  'var(--color-primary-active)',
  'var(--color-primary-error)',
  'var(--color-ink)',
  'var(--color-muted)',
  'var(--color-muted-soft)',
]

function getProductColor(idx: number): string {
  return PRODUCT_COLORS[idx % PRODUCT_COLORS.length]
}

const TYPE_OPTIONS = [
  { value: IdeaType.Review, label: 'Review', tone: 'blue' as const },
  { value: IdeaType.Comparison, label: 'So sánh', tone: 'purple' as const },
  { value: IdeaType.Roundup, label: 'Tổng hợp', tone: 'orange' as const },
  { value: IdeaType.Tutorial, label: 'Hướng dẫn', tone: 'green' as const },
  { value: IdeaType.Deal, label: 'Deal', tone: 'red' as const },
  { value: IdeaType.Trending, label: 'Xu hướng', tone: 'yellow' as const },
]

const PLATFORM_OPTIONS = [
  { value: TargetPlatform.TikTok, label: 'TikTok' },
  { value: TargetPlatform.Facebook, label: 'Facebook' },
  { value: TargetPlatform.Instagram, label: 'Instagram' },
  { value: TargetPlatform.YouTube, label: 'YouTube' },
  { value: TargetPlatform.Blog, label: 'Blog' },
]

export interface SeedDetailDrawerProps {
  idea: ContentIdeaEntity | null
  isOpen: boolean
  onClose: () => void
  onGenerate?: (ideaId: string) => void
  onGenerateProduct?: (ideaId: string, productId: string) => void
  isGenerating?: string | null
  generatingProductIds?: string[]
  productsMap?: Record<string, Product>
  generationSummary?: IdeaGenerationSummary
  recentPosts?: ContentPostParsed[]
  onViewPosts?: (ideaId: string) => void
  onApprove?: (idea: ContentIdeaEntity) => void
}

export function SeedDetailDrawer({
  idea,
  isOpen,
  onClose,
  onGenerate,
  onGenerateProduct,
  isGenerating,
  generatingProductIds = [],
  productsMap: externalProductsMap,
  generationSummary,
  recentPosts,
  onViewPosts,
  onApprove,
}: SeedDetailDrawerProps) {
  const { data: allProducts = [] } = useProducts()
  const generateContentPosts = useGenerateContentPosts()

  const productIds = idea?.ideaProducts ?? []

  const productsMap = useMemo<Record<string, Product>>(() => {
    if (externalProductsMap) return externalProductsMap
    return allProducts.reduce<Record<string, Product>>((acc, p) => {
      acc[p.productId] = p
      return acc
    }, {})
  }, [allProducts, externalProductsMap])

  if (!idea) return null

  const genState = computeGenerationState(idea, generationSummary)

  const typeOption = TYPE_OPTIONS.find((t) => t.value === idea.ideaType)
  const platformOption = PLATFORM_OPTIONS.find(
    (p) => p.value === idea.targetPlatform,
  )

  const isDraft = idea.status === IdeaStatus.Draft
  const isApproved = idea.status === IdeaStatus.Approved
  const postCount = idea.postIds?.length ?? 0

  const angles =
    idea.angle
      ?.split(',')
      .map((a) => a.trim())
      .filter(Boolean) ?? []

  const handleGenerateAll = () => {
    if (onGenerate) onGenerate(idea.ideaId)
  }

  const handleGenerateProduct = (productId: string) => {
    if (!onGenerateProduct) {
      const platform = idea.targetPlatform as
        | 'blog'
        | 'youtube'
        | 'tiktok'
        | 'instagram'
        | 'twitter'
        | undefined
      // generateConte({ productIds: productId, platform })
      return
    }
    onGenerateProduct(idea.ideaId, productId)
  }

  const totalProducts = generationSummary?.totalProducts ?? productIds.length
  const generatedProducts = generationSummary?.generatedProducts ?? 0
  const allProductsGenerated =
    totalProducts > 0 && generatedProducts >= totalProducts
  const someProductsGenerated = generatedProducts > 0 && !allProductsGenerated

  return (
    <div
      className={cn(
        'fixed inset-y-0 right-0 z-50 w-[520px] bg-[var(--color-canvas)] border-l border-[var(--color-hairline)] shadow-[var(--shadow-card)] transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : 'translate-x-full',
      )}
    >
      <div className="h-full flex flex-col">
        <DrawerHeader idea={idea} onClose={onClose} />

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <SeedSummarySection
            idea={idea}
            angles={angles}
            typeOption={typeOption}
            platformOption={platformOption}
          />

          <SeedProductsGenerationSection
            idea={idea}
            products={productsMap}
            productIds={productIds}
            generationSummary={generationSummary}
            genState={genState}
            onGenerateProduct={handleGenerateProduct}
            generatingProductIds={generatingProductIds}
          />

          <SeedBatchGenerationSection
            genState={genState}
            isGenerating={isGenerating === idea.ideaId}
            onGenerateAll={handleGenerateAll}
            totalProducts={totalProducts}
            allProductsGenerated={allProductsGenerated}
            someProductsGenerated={someProductsGenerated}
          />

          <SeedOutputSection
            idea={idea}
            postCount={postCount}
            totalProducts={totalProducts}
            generatedProducts={generatedProducts}
            recentPosts={recentPosts}
            onViewPosts={onViewPosts}
          />
        </div>

        <DrawerFooter
          idea={idea}
          isDraft={isDraft}
          isApproved={isApproved}
          postCount={postCount}
          productCount={productIds.length}
          isGenerating={isGenerating === idea.ideaId}
          onGenerate={handleGenerateAll}
          onApprove={onApprove}
          onViewPosts={onViewPosts}
        />
      </div>
    </div>
  )
}

const STATUS_ICONS: Record<IdeaStatus, typeof CheckCircle> = {
  [IdeaStatus.Draft]: Edit,
  [IdeaStatus.Approved]: CheckCircle,
  [IdeaStatus.Queued]: Clock,
  [IdeaStatus.Produced]: CheckCircle,
  [IdeaStatus.Rejected]: AlertCircle,
}

const STATUS_TONES: Record<
  IdeaStatus,
  'blue' | 'green' | 'yellow' | 'orange' | 'neutral'
> = {
  [IdeaStatus.Draft]: 'blue',
  [IdeaStatus.Approved]: 'green',
  [IdeaStatus.Queued]: 'yellow',
  [IdeaStatus.Produced]: 'orange',
  [IdeaStatus.Rejected]: 'neutral',
}

const STATUS_LABELS: Record<IdeaStatus, string> = {
  [IdeaStatus.Draft]: 'Draft',
  [IdeaStatus.Approved]: 'Approved',
  [IdeaStatus.Queued]: 'Queued',
  [IdeaStatus.Produced]: 'Produced',
  [IdeaStatus.Rejected]: 'Archived',
}

function DrawerHeader({
  idea,
  onClose,
}: {
  idea: ContentIdeaEntity
  onClose: () => void
}) {
  const StatusIcon = STATUS_ICONS[idea.status]
  const tone = STATUS_TONES[idea.status]
  const label = STATUS_LABELS[idea.status]

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-hairline)] bg-[var(--color-canvas)]">
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <h2 className="text-title-md text-[var(--color-ink)] truncate">
          {idea.hook}
        </h2>
        <Badge tone={tone} size="sm" className="shrink-0">
          <StatusIcon size={10} className="mr-1" />
          {label}
        </Badge>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Link
          to="/dash/content/$ideaId"
          params={{ ideaId: idea.ideaId }}
          className="inline-flex items-center gap-1 px-2 py-1.5 text-caption-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-soft)] rounded-[var(--radius-sm)] transition-colors"
        >
          <ExternalLink size={13} />
          Open
        </Link>
        <Link
          to="/dash/content/$ideaId/edit"
          params={{ ideaId: idea.ideaId }}
          className="inline-flex items-center gap-1 px-2 py-1.5 text-caption-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-soft)] rounded-[var(--radius-sm)] transition-colors"
        >
          <Edit size={13} />
          Edit
        </Link>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-[var(--color-surface-soft)] rounded-lg transition-colors ml-1"
        >
          <X size={18} className="text-[var(--color-muted)]" />
        </button>
      </div>
    </div>
  )
}

function SeedSummarySection({
  idea,
  angles,
  typeOption,
  platformOption,
}: {
  idea: ContentIdeaEntity
  angles: string[]
  typeOption?: (typeof TYPE_OPTIONS)[number]
  platformOption?: (typeof PLATFORM_OPTIONS)[number]
}) {
  return (
    <div className="bg-[var(--color-surface-soft)] rounded-lg p-4 space-y-3">
      <div>
        <p className="text-body-sm text-[var(--color-ink)] leading-relaxed">
          {idea.hook}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {typeOption && (
          <Badge tone={typeOption.tone} size="sm">
            {typeOption.label}
          </Badge>
        )}
        {platformOption && (
          <Badge tone="neutral" size="sm" variant="outline">
            {platformOption.label}
          </Badge>
        )}
        <Badge tone="neutral" size="sm" variant="outline">
          {idea.category}
        </Badge>
      </div>

      {angles.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {angles.map((angle, idx) => (
            <span
              key={idx}
              className="text-caption-sm text-[var(--color-muted)] bg-[var(--color-canvas)] px-2 py-0.5 rounded border border-[var(--color-hairline-soft)]"
            >
              {angle}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 text-xs text-[var(--color-muted)] pt-1 border-t border-frost/30">
        <div className="flex items-center gap-1.5">
          <div
            className={cn(
              'w-1.5 h-1.5 rounded-full',
              (idea.priority || 0) >= 80
                ? 'bg-accent-red'
                : (idea.priority || 0) >= 50
                  ? 'bg-accent-yellow'
                  : 'bg-accent-blue',
            )}
          />
          <span>Priority {idea.priority || 0}</span>
        </div>
        <span>•</span>
        <span>Updated {formatRelativeTime(idea.updatedAt)}</span>
        <span>•</span>
        <span>
          {(idea.ideaProducts || []).length} product
          {(idea.ideaProducts || []).length !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  )
}

function SeedProductsGenerationSection({
  idea,
  products,
  productIds,
  generationSummary,
  genState,
  onGenerateProduct,
  generatingProductIds,
}: {
  idea: ContentIdeaEntity
  products: Record<string, Product>
  productIds: string[]
  generationSummary?: IdeaGenerationSummary
  genState: ReturnType<typeof computeGenerationState>
  onGenerateProduct: (productId: string) => void
  generatingProductIds: string[]
}) {
  if (productIds.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-frost/50 p-6 text-center">
        <Package
          size={28}
          className="mx-auto mb-3 text-[var(--color-muted)] opacity-40"
        />
        <p className="text-sm text-[var(--color-ink)] font-medium mb-1">
          No products linked
        </p>
        <p className="text-xs text-[var(--color-muted)] mb-4">
          Link products to start generating posts
        </p>
        <Link
          to="/dash/content/$ideaId/edit"
          params={{ ideaId: idea.ideaId }}
          className="inline-block"
        >
          <Button size="sm" variant="outline">
            <Package size={14} className="mr-1.5" />
            Link products
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-0.5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">
          Products ({productIds.length})
        </h3>
        {generationSummary && (
          <span className="text-[10px] text-[var(--color-muted)]">
            {generationSummary.generatedProducts}/
            {generationSummary.totalProducts} generated
          </span>
        )}
      </div>

      <div className="rounded-lg border border-frost/40 overflow-hidden divide-y divide-frost/20">
        {productIds.map((productId, idx) => {
          const product = products[productId]
          const productSummary = generationSummary?.productInfo.find(
            (p) => p.productId === productId,
          )
          const hasPosts = productSummary?.hasPosts ?? false
          const generating = isProductGenerating(
            productId,
            generatingProductIds,
          )
          const generated = isProductGenerated(productId, genState)
          const canGen = genState.canGenerateSeed
          const tooltip = generateActionTooltip(
            productId,
            genState,
            generatingProductIds,
          )

          return (
            <div
              key={productId}
              className="flex items-center gap-3 px-3 py-2.5 bg-surface/30 hover:bg-surface-2/60 transition-colors group"
            >
              {product.imageCover ? (
                <img
                  src={product.imageCover}
                  alt={product.canonicalTitle}
                  className="w-8 h-8 rounded object-cover border border-frost/30 shrink-0"
                />
              ) : (
                <div
                  className="w-8 h-8 rounded shrink-0 flex items-center justify-center text-[10px] font-bold text-white border border-frost/20"
                  style={{ backgroundColor: getProductColor(idx) }}
                >
                  {product.canonicalTitle.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[var(--color-ink)] truncate">
                    {product.canonicalTitle}
                  </span>
                  {hasPosts && (
                    <Badge tone="green" size="sm">
                      <CheckCircle size={10} />
                      {productSummary!.postCount}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {product.brand && (
                    <span className="text-[10px] text-[var(--color-muted)]">
                      {product.brand}
                    </span>
                  )}
                  {product.priceCurrent && (
                    <>
                      {product.brand && (
                        <span className="text-[10px] text-[var(--color-muted)]">
                          •
                        </span>
                      )}
                      <span className="text-[10px] font-medium text-accent-green">
                        {product.priceCurrent}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {generating ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex items-center text-accent-orange px-2 py-1">
                        <Loader2 size={12} className="animate-spin" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="left">{tooltip}</TooltipContent>
                  </Tooltip>
                ) : generated ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to="/dash/posts"
                        search={{ ideaId: idea.ideaId }}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs text-accent-blue hover:bg-accent-blue/10 rounded transition-colors"
                      >
                        <Eye size={12} />
                        View
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      {productSummary!.postCount} post
                      {productSummary!.postCount !== 1 && 's'}
                    </TooltipContent>
                  </Tooltip>
                ) : canGen ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-accent-orange hover:text-accent-orange-light"
                        onClick={() => onGenerateProduct(productId)}
                      >
                        <Sparkles size={12} />
                        <span className="text-[10px] ml-1 hidden group-hover:inline">
                          Generate
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">{tooltip}</TooltipContent>
                  </Tooltip>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex items-center text-xs text-[var(--color-muted)] opacity-30 px-2 py-1">
                        <Sparkles size={12} />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      {genState.blockedReason ?? 'Generation not available'}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SeedBatchGenerationSection({
  genState,
  isGenerating,
  onGenerateAll,
  totalProducts,
  allProductsGenerated,
  someProductsGenerated,
}: {
  genState: ReturnType<typeof computeGenerationState>
  isGenerating: boolean
  onGenerateAll: () => void
  totalProducts: number
  allProductsGenerated: boolean
  someProductsGenerated: boolean
}) {
  if (totalProducts === 0) return null

  return (
    <div className="rounded-lg border border-accent-orange/20 bg-accent-orange/5 p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">
            Batch Generation
          </h3>
        </div>
        <Button
          size="sm"
          className="bg-accent-orange hover:bg-accent-orange-light text-accent-on"
          onClick={onGenerateAll}
          disabled={!genState.canGenerateAll || isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 size={14} className="mr-1.5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={14} className="mr-1.5" />
              Generate All
            </>
          )}
        </Button>
      </div>

      {genState.canGenerateAll ? (
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center bg-surface/60 rounded-md p-2">
            <div className="text-lg font-semibold text-[var(--color-ink)]">
              {totalProducts}
            </div>
            <div className="text-[10px] text-[var(--color-muted)] mt-0.5">
              Total products
            </div>
          </div>
          <div className="text-center bg-surface/60 rounded-md p-2">
            <div className="text-lg font-semibold text-accent-orange">
              {genState.pendingProductIds.length}
            </div>
            <div className="text-[10px] text-[var(--color-muted)] mt-0.5">
              Eligible
            </div>
          </div>
          <div className="text-center bg-surface/60 rounded-md p-2">
            <div className="text-lg font-semibold text-accent-green">
              {genState.generatedProductIds.length}
            </div>
            <div className="text-[10px] text-[var(--color-muted)] mt-0.5">
              Generated
            </div>
          </div>
        </div>
      ) : (
        <div className="text-xs text-[var(--color-muted)] bg-surface/40 rounded p-2.5 text-center">
          {genState.blockedReason ?? 'Batch generation not available'}
        </div>
      )}

      {someProductsGenerated && genState.canGenerateAll && (
        <p className="text-[10px] text-[var(--color-muted)] mt-2.5">
          Generation will skip {genState.generatedProductIds.length}{' '}
          already-generated product
          {genState.generatedProductIds.length !== 1 ? 's' : ''}
        </p>
      )}
      {allProductsGenerated && genState.canGenerateAll && (
        <p className="text-[10px] text-accent-green mt-2.5">
          All products have been generated. Generate again to refresh.
        </p>
      )}
    </div>
  )
}

function SeedOutputSection({
  idea,
  postCount,
  totalProducts,
  generatedProducts,
  recentPosts,
  onViewPosts,
}: {
  idea: ContentIdeaEntity
  postCount: number
  totalProducts: number
  generatedProducts: number
  recentPosts?: ContentPostParsed[]
  onViewPosts?: (ideaId: string) => void
}) {
  if (postCount === 0 && !recentPosts?.length) {
    return (
      <div className="rounded-lg border border-frost/40 p-4">
        <h3 className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-3">
          Output
        </h3>
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-surface-2 mb-2">
            <Sparkles
              size={18}
              className="text-[var(--color-muted)] opacity-40"
            />
          </div>
          <p className="text-sm text-[var(--color-muted)]">
            No posts generated yet
          </p>
          {totalProducts > 0 && (
            <p className="text-xs text-[var(--color-muted)] mt-1">
              {totalProducts} product{totalProducts !== 1 && 's'} ready for
              generation
            </p>
          )}
        </div>
      </div>
    )
  }

  const displayPosts = recentPosts?.slice(0, 3) ?? []

  return (
    <div className="rounded-lg border border-frost/40 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">
          Output
        </h3>
        <button
          className="text-xs text-accent-blue hover:text-accent-blue-light transition-colors"
          onClick={() => onViewPosts?.(idea.ideaId)}
        >
          View all
        </button>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-1.5">
          <Badge tone="blue" size="sm">
            {postCount} post{postCount !== 1 && 's'}
          </Badge>
        </div>
        {totalProducts > 0 && (
          <span className="text-xs text-[var(--color-muted)]">
            {generatedProducts}/{totalProducts} product
            {totalProducts !== 1 && 's'} covered
          </span>
        )}
      </div>

      {displayPosts.length > 0 && (
        <div className="space-y-1.5">
          {displayPosts.map((post) => (
            <Link
              key={post.postId}
              to="/dash/posts/$postId"
              params={{ postId: post.postId }}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-surface-2 transition-colors group"
            >
              <div className="w-5 h-5 rounded bg-surface-2 border border-frost/30 shrink-0 flex items-center justify-center">
                <FileTextIcon size={10} className="text-[var(--color-muted)]" />
              </div>
              <span className="text-xs text-[var(--color-muted)] truncate flex-1 group-hover:text-[var(--color-ink)] transition-colors">
                {post.title}
              </span>
              {post.primaryProduct && (
                <span className="text-[10px] text-[var(--color-muted)] shrink-0 truncate max-w-[100px]">
                  {post.primaryProduct.canonicalTitle}
                </span>
              )}
              <ExternalLink
                size={10}
                className="shrink-0 text-[var(--color-muted)] opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </Link>
          ))}
          {(recentPosts?.length ?? 0) > 3 && (
            <p className="text-[10px] text-[var(--color-muted)] pl-2">
              +{(recentPosts?.length ?? 0) - 3} more posts
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function FileTextIcon({
  size,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size ?? 16}
      height={size ?? 16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  )
}

function DrawerFooter({
  idea,
  isDraft,
  isApproved,
  postCount,
  productCount,
  isGenerating,
  onGenerate,
  onApprove,
  onViewPosts,
}: {
  idea: ContentIdeaEntity
  isDraft: boolean
  isApproved: boolean
  postCount: number
  productCount: number
  isGenerating: boolean
  onGenerate: () => void
  onApprove?: (idea: ContentIdeaEntity) => void
  onViewPosts?: (ideaId: string) => void
}) {
  const renderPrimaryAction = () => {
    if (isApproved && productCount > 0) {
      return (
        <Button className="w-full" onClick={onGenerate} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={16} className="mr-2" />
              Generate All {productCount} Product{productCount !== 1 && 's'}
            </>
          )}
        </Button>
      )
    }

    if (isDraft && onApprove) {
      return (
        <Button
          className="w-full bg-accent-green hover:bg-accent-green-light text-accent-on"
          onClick={() => onApprove(idea)}
        >
          <CheckCircle size={16} className="mr-2" />
          Approve Seed
        </Button>
      )
    }

    if (productCount === 0) {
      return (
        <Button className="w-full" asChild>
          <Link
            to="/dash/content/$ideaId/edit"
            params={{ ideaId: idea.ideaId }}
            className="inline-flex items-center justify-center"
          >
            <Package size={16} className="mr-2" />
            Add Products
          </Link>
        </Button>
      )
    }

    return null
  }

  const renderSecondaryAction = () => {
    if (postCount > 0) {
      return (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onViewPosts?.(idea.ideaId)}
        >
          <Eye size={16} className="mr-2" />
          View {postCount} Generated Post{postCount !== 1 && 's'}
        </Button>
      )
    }

    return (
      <Button variant="ghost" className="w-full" asChild>
        <Link
          to="/dash/content/$ideaId/edit"
          params={{ ideaId: idea.ideaId }}
          className="inline-flex items-center justify-center"
        >
          <Edit size={16} className="mr-2" />
          Edit Seed
        </Link>
      </Button>
    )
  }

  return (
    <div className="px-6 py-4 border-t border-frost space-y-2 bg-surface/80 backdrop-blur-sm">
      {renderPrimaryAction()}
      {renderSecondaryAction()}
    </div>
  )
}
