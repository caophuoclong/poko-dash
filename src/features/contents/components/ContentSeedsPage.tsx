import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Search, Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxCollection,
  ComboboxItem,
  ComboboxEmpty,
} from '@/components/ui/combobox'
import { filterOptionsByLabel } from '@/components/ui/combobox-utils'
import type { ComboboxOption as ComboboxOptionType } from '@/components/ui/combobox-utils'
import { useFilteredList } from '@/shared/hooks/use-filtered-list'
import { CommonTable } from '@/components/table'
import { EmptyState, emptyStatePresets } from '@/components/ui/empty-state'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'
import type { SortingState } from '@tanstack/react-table'
import type { ContentIdeaEntity } from '../schemas/content.schema'
import { getSeedsColumns } from '../constants/seeds-columns'
import type { IdeaGenerationSummary } from '../constants/seeds-columns'
import {
  useGenerateFromIdea,
  useContentPosts,
} from '@/features/posts/hooks/use-content-posts'
import {
  useUpdateContentIdea,
  useDeleteContentIdea,
} from '../hooks/use-content-ideas'
import { useProducts } from '@/features/products/hooks/use-products'
import type { Product } from '@/features/products/types/product'
import { contentPostsControllerGenerateFromProducts } from '#/api/client'

const STATUS_OPTIONS: ComboboxOptionType[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'approved', label: 'Approved' },
  { value: 'queued', label: 'Queued' },
  { value: 'produced', label: 'Produced' },
  { value: 'rejected', label: 'Rejected' },
]

const PLATFORM_OPTIONS: ComboboxOptionType[] = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'blog', label: 'Blog' },
]

const CATEGORY_OPTIONS: ComboboxOptionType[] = [
  { value: 'Điện tử', label: 'Điện tử' },
  { value: 'Phụ kiện', label: 'Phụ kiện' },
  { value: 'Gia dụng', label: 'Gia dụng' },
  { value: 'Thời trang', label: 'Thời trang' },
  { value: 'Làm đẹp', label: 'Làm đẹp' },
  { value: 'Thể thao', label: 'Thể thao' },
  { value: 'uncategorized', label: 'Khác' },
]

function FilterCombobox({
  options,
  selectedValue,
  onChange,
  placeholder,
  className,
}: {
  options: ComboboxOptionType[]
  selectedValue?: string
  onChange: (value: string | undefined) => void
  placeholder: string
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const selectedOption = options.find((o) => o.value === selectedValue) ?? null
  const filtered = filterOptionsByLabel(options, inputValue)

  return (
    <Combobox
      multiple={false}
      value={selectedOption}
      onValueChange={(option) => onChange(option?.value)}
      inputValue={inputValue}
      onInputValueChange={setInputValue}
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setInputValue(selectedOption?.label ?? '')
      }}
      items={filtered}
      itemToStringLabel={(item) => item.label}
      isItemEqualToValue={(item, value) => item.value === value.value}
    >
      <ComboboxInput
        className={className}
        placeholder={placeholder}
        showClear
      />
      <ComboboxContent>
        <ComboboxList>
          <ComboboxCollection>
            {(item) => <ComboboxItem value={item}>{item.label}</ComboboxItem>}
          </ComboboxCollection>
          <ComboboxEmpty>No results found</ComboboxEmpty>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

export default function ContentSeedsPage({
  ideas = [],
  hasNextPage = false,
  isFetchingNextPage = false,
  onFetchNextPage,
}: {
  ideas: ContentIdeaEntity[]
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  onFetchNextPage?: () => void
}) {
  const navigate = useNavigate()
  const generateFromIdea = useGenerateFromIdea()
  const updateContentIdea = useUpdateContentIdea()
  const deleteContentIdea = useDeleteContentIdea()
  const [sorting, setSorting] = useState<SortingState>([])
  const [generatingId, setGeneratingId] = useState<string | null>(null)
  const [generatingProductIds, setGeneratingProductIds] = useState<string[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const sentinelRef = useRef<HTMLDivElement | null>(null)

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
        targetPlatform: (item: ContentIdeaEntity, value: unknown) =>
          item.targetPlatform === value,
        category: (item: ContentIdeaEntity, value: unknown) =>
          item.category === value,
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

  const handleRowClick = useCallback(
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
  }, [filteredIdeas])

  const handleDelete = useCallback(
    async (ideaId: string) => {
      if (!confirm('Are you sure you want to delete this seed?')) return
      try {
        await deleteContentIdea.mutateAsync({ ideaId })
      } catch (error) {
        console.error('Failed to delete seed:', error)
      }
    },
    [deleteContentIdea],
  )

  const allVisibleSelected =
    filteredIdeas.filteredItems.length > 0 &&
    filteredIdeas.filteredItems.every((idea) => selectedIds.has(idea.ideaId))

  const toggleSelect = useCallback((ideaId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(ideaId)) next.delete(ideaId)
      else next.add(ideaId)
      return next
    })
  }, [])

  const toggleSelectAllVisible = useCallback(() => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (allVisibleSelected) {
        filteredIdeas.filteredItems.forEach((idea) => next.delete(idea.ideaId))
      } else {
        filteredIdeas.filteredItems.forEach((idea) => next.add(idea.ideaId))
      }
      return next
    })
  }, [allVisibleSelected, filteredIdeas.filteredItems])

  const columns = useMemo(
    () =>
      getSeedsColumns({
        onGenerate: handleGenerate,
        onGenerateProduct: handleGenerateProduct,
        isGenerating: generatingId,
        generatingProductIds,
        onOpen: handleRowClick,
        onApprove: handleQuickApprove,
        onViewPosts: handleQuickViewPosts,
        onEdit: (ideaId: string) => {
          navigate({ to: '/dash/content/$ideaId/edit', params: { ideaId } })
        },
        onOpenFull: (ideaId: string) => {
          navigate({ to: '/dash/content/$ideaId', params: { ideaId } })
        },
        onDelete: handleDelete,
        productsMap,
        generationSummaries,
        selectedIds,
        allSelected: allVisibleSelected,
        onToggleSelect: toggleSelect,
        onToggleSelectAll: toggleSelectAllVisible,
      }),
    [
      handleGenerate,
      handleGenerateProduct,
      generatingId,
      generatingProductIds,
      handleRowClick,
      handleQuickApprove,
      handleQuickViewPosts,
      handleDelete,
      navigate,
      productsMap,
      generationSummaries,
      selectedIds,
      allVisibleSelected,
      toggleSelect,
      toggleSelectAllVisible,
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

  useEffect(() => {
    if (!sentinelRef.current || !onFetchNextPage) return
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          onFetchNextPage()
        }
      },
      { rootMargin: '120px' },
    )

    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, onFetchNextPage])

  return (
    <div className="space-y-6">
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
            <div className="relative flex-1 min-w-[220px] max-w-sm">
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

            <FilterCombobox
              options={PLATFORM_OPTIONS}
              selectedValue={filteredIdeas.activeFilters.targetPlatform as string | undefined}
              onChange={(value) =>
                filteredIdeas.setActiveFilters({
                  ...filteredIdeas.activeFilters,
                  targetPlatform: value,
                })
              }
              placeholder="Platform"
              className="w-40"
            />

            <FilterCombobox
              options={CATEGORY_OPTIONS}
              selectedValue={filteredIdeas.activeFilters.category as string | undefined}
              onChange={(value) =>
                filteredIdeas.setActiveFilters({
                  ...filteredIdeas.activeFilters,
                  category: value,
                })
              }
              placeholder="Category"
              className="w-40"
            />

            <FilterCombobox
              options={STATUS_OPTIONS}
              selectedValue={filteredIdeas.activeFilters.status as string | undefined}
              onChange={(value) =>
                filteredIdeas.setActiveFilters({
                  ...filteredIdeas.activeFilters,
                  status: value,
                })
              }
              placeholder="Status"
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

          <div className="flex items-center justify-end">
            <div className="text-sm text-muted-text">
              {filteredIdeas.filteredItems.length} of {ideas.length} seeds
            </div>
          </div>

          <div className="h-[calc(100vh-18rem)] min-h-[420px]">
            <CommonTable
              table={ideaTable}
              minWidth={1200}
              compact
              onRowClick={handleRowClick}
              className="h-full"
            />
          </div>

          <div ref={sentinelRef} className="h-2" aria-hidden />

          {isFetchingNextPage && (
            <div className="flex items-center justify-center py-4 text-muted-text">
              <Loader2 size={18} className="animate-spin" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
