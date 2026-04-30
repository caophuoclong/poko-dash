import { useState, useCallback, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  Search,
  Plus,
  LayoutGrid,
  Table as TableIcon,
  MoreHorizontal,
  Filter,
} from 'lucide-react'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Autocomplete } from '@/components/ui/autocomplete'
import { useFilteredList } from '@/shared/hooks/use-filtered-list'
import { CommonTable } from '@/components/table'
import { EmptyState, emptyStatePresets } from '@/components/ui/empty-state'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'
import type { SortingState } from '@tanstack/react-table'
import { cn } from '#/shared/utils'
import type { ContentIdeaEntity } from '../schemas/content.schema'
import { getSeedsColumns } from '../constants/seeds-columns'
import type { IdeaGenerationSummary } from '../constants/seeds-columns'
import {
  useGenerateFromIdea,
  useContentPosts,
} from '@/features/posts/hooks/use-content-posts'
import { useUpdateContentIdea } from '../hooks/use-content-ideas'
import { useProducts } from '@/features/products/hooks/use-products'
import { SeedDetailDrawer } from './SeedDetailDrawer'
import type { AutocompleteOption } from '@/components/ui/autocomplete'
import type { Product } from '@/features/products/types/product'
import { contentPostsControllerGenerateFromProducts } from '#/api/client'

type SortOption = 'updated' | 'priority' | 'posts' | 'review'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'updated', label: 'Updated recently' },
  { value: 'priority', label: 'Priority' },
  { value: 'posts', label: 'Most posts generated' },
  { value: 'review', label: 'Needs review' },
]

const STATUS_OPTIONS: AutocompleteOption[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'approved', label: 'Approved' },
  { value: 'queued', label: 'Queued' },
  { value: 'produced', label: 'Produced' },
  { value: 'rejected', label: 'Rejected' },
]

const IDEA_TYPE_OPTIONS: AutocompleteOption[] = [
  { value: 'review', label: 'Review' },
  { value: 'comparison', label: 'Comparison' },
  { value: 'roundup', label: 'Roundup' },
  { value: 'tutorial', label: 'Tutorial' },
  { value: 'deal', label: 'Deal' },
  { value: 'trending', label: 'Trending' },
]

const PLATFORM_OPTIONS: AutocompleteOption[] = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'blog', label: 'Blog' },
]

const CATEGORY_OPTIONS: AutocompleteOption[] = [
  { value: 'Điện tử', label: 'Điện tử' },
  { value: 'Phụ kiện', label: 'Phụ kiện' },
  { value: 'Gia dụng', label: 'Gia dụng' },
  { value: 'Thời trang', label: 'Thời trang' },
  { value: 'Làm đẹp', label: 'Làm đẹp' },
  { value: 'Thể thao', label: 'Thể thao' },
  { value: 'uncategorized', label: 'Khác' },
]

const PRODUCT_COUNT_OPTIONS: AutocompleteOption[] = [
  { value: 'none', label: 'No products' },
  { value: 'single', label: '1 product' },
  { value: 'multiple', label: '2+ products' },
]

const OUTPUT_STATUS_OPTIONS: AutocompleteOption[] = [
  { value: 'produced', label: 'Produced' },
  { value: 'not-produced', label: 'Not produced' },
]

type ViewMode = 'table' | 'board'

export default function ContentSeedsPage({
  ideas = [],
}: {
  ideas: ContentIdeaEntity[]
}) {
  const navigate = useNavigate()
  const generateFromIdea = useGenerateFromIdea()
  const updateContentIdea = useUpdateContentIdea()
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [sorting, setSorting] = useState<SortingState>([])
  const [sortOption, setSortOption] = useState<SortOption>('updated')
  const [generatingId, setGeneratingId] = useState<string | null>(null)
  const [selectedIdea, setSelectedIdea] = useState<ContentIdeaEntity | null>(
    null,
  )
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [generatingProductIds, setGeneratingProductIds] = useState<string[]>([])

  const { data: dataProducts } = useProducts()
  const { data } = useContentPosts()
  const allPosts = data?.data ?? []
  const allProducts = dataProducts ?? []

  const productsMap = useMemo<Record<string, Product>>(
    () =>
      allProducts.reduce<Record<string, Product>>((acc, p) => {
        acc[p.productId] = p
        return acc
      }, {}),
    [allProducts],
  )

  const generationSummaries = useMemo<
    Record<string, IdeaGenerationSummary>
  >(() => {
    const map: Record<string, IdeaGenerationSummary> = {}
    for (const idea of ideas) {
      const productIds = idea.ideaProducts ?? []
      const ideaPosts = allPosts.filter(
        (post) =>
          idea.postIds?.includes(post.postId) &&
          post.primaryProduct &&
          productIds.includes(post.primaryProduct.productId),
      )

      const productPostCount: Record<string, number> = {}
      for (const post of ideaPosts) {
        if (post.primaryProduct) {
          productPostCount[post.primaryProduct.productId] =
            (productPostCount[post.primaryProduct.productId] ?? 0) + 1
        }
      }

      const productInfo = productIds.map((pid) => ({
        productId: pid,
        hasPosts: productPostCount[pid] ? productPostCount[pid] > 0 : false,
        postCount: productPostCount[pid] ?? 0,
      }))

      map[idea.ideaId] = {
        totalProducts: productIds.length,
        generatedProducts: productInfo.filter((p) => p.hasPosts).length,
        totalPosts: ideaPosts.length,
        productInfo,
      }
    }
    return map
  }, [ideas, allPosts])

  const filterConfig = useMemo(
    () => ({
      search: (item: ContentIdeaEntity, term: string) => {
        const searchLower = term.toLowerCase()
        return (
          item.hook.toLowerCase().includes(searchLower) ||
          (item.angle && item.angle.toLowerCase().includes(searchLower)) ||
          item.category.toLowerCase().includes(searchLower) ||
          item.ideaProducts?.some((p) =>
            p.toLowerCase().includes(searchLower),
          ) ||
          false
        )
      },
      filterMap: {
        status: (item: ContentIdeaEntity, value: unknown) =>
          item.status === value,
        ideaType: (item: ContentIdeaEntity, value: unknown) =>
          item.ideaType === value,
        targetPlatform: (item: ContentIdeaEntity, value: unknown) =>
          item.targetPlatform === value,
        category: (item: ContentIdeaEntity, value: unknown) =>
          item.category === value,
        productCount: (item: ContentIdeaEntity, value: unknown) => {
          const count = item.ideaProducts?.length ?? 0
          if (value === 'none') return count === 0
          if (value === 'single') return count === 1
          if (value === 'multiple') return count > 1
          return true
        },
        outputStatus: (item: ContentIdeaEntity, value: unknown) => {
          if (value === 'produced') return item.status === 'produced'
          if (value === 'not-produced') return item.status !== 'produced'
          return true
        },
      },
    }),
    [],
  )

  const filteredIdeas = useFilteredList(ideas, filterConfig)

  const handleGenerate = useCallback(
    async (ideaId: string) => {
      setGeneratingId(ideaId)
      try {
        await generateFromIdea.mutateAsync(ideaId)
      } catch (error) {
        console.error('Failed to generate:', error)
      } finally {
        setGeneratingId(null)
      }
    },
    [generateFromIdea],
  )

  const handleGenerateProduct = useCallback(
    async (ideaId: string, productId: string) => {
      setGeneratingProductIds((prev) => [...prev, productId])
      try {
        const idea = ideas.find((i) => i.ideaId === ideaId)
        const platform = idea?.targetPlatform as
          | 'blog'
          | 'youtube'
          | 'tiktok'
          | 'instagram'
          | 'twitter'
          | undefined
        await contentPostsControllerGenerateFromProducts({
          productIds: productId,
          platform,
        } as any)
      } catch (error) {
        console.error('Failed to generate for product:', error)
      } finally {
        setGeneratingProductIds((prev) => prev.filter((id) => id !== productId))
      }
    },
    [ideas],
  )

  const handleRowClick = useCallback((idea: ContentIdeaEntity) => {
    setSelectedIdea(idea)
    setIsDrawerOpen(true)
  }, [])

  const handleRowDoubleClick = useCallback(
    (idea: ContentIdeaEntity) => {
      navigate({ to: '/dash/content/$ideaId', params: { ideaId: idea.ideaId } })
    },
    [navigate],
  )

  const handleQuickOpen = useCallback(
    (idea: ContentIdeaEntity) => {
      navigate({ to: '/dash/content/$ideaId', params: { ideaId: idea.ideaId } })
    },
    [navigate],
  )

  const handleQuickViewPosts = useCallback(
    (ideaId: string) => {
      navigate({ to: '/dash/posts', search: { ideaId } })
    },
    [navigate],
  )

  const handleQuickApprove = useCallback(
    (idea: ContentIdeaEntity) => {
      updateContentIdea.mutate({
        ideaId: idea.ideaId,
        data: { status: 'approved' },
      })
    },
    [updateContentIdea],
  )

  const handleCreateSeed = useCallback(() => {
    navigate({ to: '/dash/content/new' })
  }, [navigate])

  const handleClearFilters = useCallback(() => {
    filteredIdeas.clearFilters()
  }, [])

  const getRowClassName = useCallback((idea: ContentIdeaEntity) => {
    const produced = idea.status === 'produced'
    if (produced) return '[&>*:not(:last-child)]:opacity-40'
    return undefined
  }, [])

  const columns = useMemo(
    () =>
      getSeedsColumns({
        onGenerate: handleGenerate,
        onGenerateProduct: handleGenerateProduct,
        isGenerating: generatingId,
        generatingProductIds,
        onOpen: handleQuickOpen,
        onApprove: handleQuickApprove,
        onViewPosts: handleQuickViewPosts,
        onEdit: (ideaId: string) => {
          navigate({ to: '/dash/content/$ideaId/edit', params: { ideaId } })
        },
        onOpenFull: (ideaId: string) => {
          navigate({ to: '/dash/content/$ideaId', params: { ideaId } })
        },
        onDelete: (ideaId: string) => console.log('Delete:', ideaId),
        productsMap,
        generationSummaries,
      }),
    [
      handleGenerate,
      handleGenerateProduct,
      generatingId,
      generatingProductIds,
      handleQuickOpen,
      handleQuickApprove,
      handleQuickViewPosts,
      navigate,
      productsMap,
      generationSummaries,
    ],
  )

  const tableState = useMemo(() => ({ sorting }), [sorting])

  const ideaTable = useReactTable({
    data: filteredIdeas.filteredItems,
    columns,
    state: tableState,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row.ideaId,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Content Seeds"
        subtitle="Reusable content directions that can generate multiple posts from selected products"
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="inline-flex items-center gap-1.5"
              onClick={handleCreateSeed}
            >
              <Plus size={16} />
              New seed
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="inline-flex items-center gap-1.5"
                >
                  <MoreHorizontal size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <span>Import ideas</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Bulk actions</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />

      {ideas.length === 0 ? (
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
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-text"
                strokeWidth={2}
              />
              <Input
                placeholder="Search by hook / angle / category / product..."
                value={filteredIdeas.searchTerm}
                onChange={(e) => filteredIdeas.setSearchTerm(e.target.value)}
                className="pl-9 h-9"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-text">Filters:</span>
            </div>

            <Autocomplete
              options={STATUS_OPTIONS}
              value={
                STATUS_OPTIONS.find(
                  (s) => s.value === filteredIdeas.activeFilters.status,
                ) || null
              }
              onChange={(option) =>
                filteredIdeas.setActiveFilters({
                  ...filteredIdeas.activeFilters,
                  status: option?.value,
                })
              }
              placeholder="Status"
              className="w-40"
            />

            <Autocomplete
              options={IDEA_TYPE_OPTIONS}
              value={
                IDEA_TYPE_OPTIONS.find(
                  (t) => t.value === filteredIdeas.activeFilters.ideaType,
                ) || null
              }
              onChange={(option) =>
                filteredIdeas.setActiveFilters({
                  ...filteredIdeas.activeFilters,
                  ideaType: option?.value,
                })
              }
              placeholder="Idea type"
              className="w-40"
            />

            <Autocomplete
              options={PLATFORM_OPTIONS}
              value={
                PLATFORM_OPTIONS.find(
                  (p) => p.value === filteredIdeas.activeFilters.targetPlatform,
                ) || null
              }
              onChange={(option) =>
                filteredIdeas.setActiveFilters({
                  ...filteredIdeas.activeFilters,
                  targetPlatform: option?.value,
                })
              }
              placeholder="Platform"
              className="w-40"
            />

            <Autocomplete
              options={CATEGORY_OPTIONS}
              value={
                CATEGORY_OPTIONS.find(
                  (c) => c.value === filteredIdeas.activeFilters.category,
                ) || null
              }
              onChange={(option) =>
                filteredIdeas.setActiveFilters({
                  ...filteredIdeas.activeFilters,
                  category: option?.value,
                })
              }
              placeholder="Category"
              className="w-40"
            />

            <Autocomplete
              options={PRODUCT_COUNT_OPTIONS}
              value={
                PRODUCT_COUNT_OPTIONS.find(
                  (p) => p.value === filteredIdeas.activeFilters.productCount,
                ) || null
              }
              onChange={(option) =>
                filteredIdeas.setActiveFilters({
                  ...filteredIdeas.activeFilters,
                  productCount: option?.value,
                })
              }
              placeholder="Product count"
              className="w-40"
            />

            <Autocomplete
              options={OUTPUT_STATUS_OPTIONS}
              value={
                OUTPUT_STATUS_OPTIONS.find(
                  (o) => o.value === filteredIdeas.activeFilters.outputStatus,
                ) || null
              }
              onChange={(option) =>
                filteredIdeas.setActiveFilters({
                  ...filteredIdeas.activeFilters,
                  outputStatus: option?.value,
                })
              }
              placeholder="Output status"
              className="w-40"
            />

            {filteredIdeas.hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-xs"
              >
                Clear filters
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center border rounded-md p-1">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className={cn(
                    'h-8 px-2',
                    viewMode === 'table'
                      ? 'bg-accent-orange text-accent-on'
                      : 'text-muted-text',
                  )}
                >
                  <TableIcon size={16} />
                </Button>
                <Button
                  variant={viewMode === 'board' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('board')}
                  className={cn(
                    'h-8 px-2',
                    viewMode === 'board'
                      ? 'bg-accent-orange text-accent-on'
                      : 'text-muted-text',
                  )}
                >
                  <LayoutGrid size={16} />
                </Button>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="inline-flex items-center gap-1.5 h-9"
                  >
                    <Filter size={14} />
                    Sort:{' '}
                    {SORT_OPTIONS.find((o) => o.value === sortOption)?.label}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {SORT_OPTIONS.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setSortOption(option.value)}
                      className={cn(
                        sortOption === option.value &&
                          'bg-accent-blue/10 text-accent-blue',
                      )}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="text-sm text-muted-text">
              {filteredIdeas.filteredItems.length} of {ideas.length} seeds
            </div>
          </div>

          {viewMode === 'table' && (
            <CommonTable
              table={ideaTable}
              minWidth={1200}
              compact
              onRowClick={handleRowClick}
              onRowDoubleClick={handleRowDoubleClick}
              getRowClassName={getRowClassName}
            />
          )}

          {viewMode === 'board' && (
            <div className="p-8 text-center text-muted-text border border-dashed rounded-lg">
              <LayoutGrid size={48} className="mx-auto mb-4 opacity-50" />
              <p>Board view coming soon...</p>
            </div>
          )}
        </div>
      )}

      <SeedDetailDrawer
        idea={selectedIdea}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onGenerate={handleGenerate}
        onGenerateProduct={handleGenerateProduct}
        isGenerating={generatingId}
        generatingProductIds={generatingProductIds}
        productsMap={productsMap}
        generationSummary={
          selectedIdea
            ? generationSummaries[selectedIdea.ideaId]
            : undefined
        }
        onViewPosts={handleQuickViewPosts}
        onApprove={handleQuickApprove}
      />

      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}
    </div>
  )
}
