import { useState, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
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
import type { AutocompleteOption } from '@/components/ui/autocomplete'
import { useFilteredList } from '@/shared/hooks/use-filtered-list'
import { CommonTable } from '@/components/table'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'
import type { SortingState } from '@tanstack/react-table'
import { cn } from '#/shared/utils'
import type { ContentIdeaEntity } from '../schemas/content.schema'
import { getColumns } from '../constants/columns-defined'
import { FormProvider, useForm } from 'react-hook-form'
import { useUpdateContentIdea } from '../hooks/use-content-ideas'
import { useGenerateFromIdea } from '@/features/posts/hooks/use-content-posts'
import type { ContentIdeaTableForm } from './ContentPostPage'

type SortOption = 'updated' | 'priority' | 'posts' | 'review'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'updated', label: 'Updated recently' },
  { value: 'priority', label: 'Priority' },
  { value: 'posts', label: 'Most posts generated' },
  { value: 'review', label: 'Needs review' },
]

type ViewMode = 'table' | 'board'

export default function ContentSeedsPage({
  ideas = [],
}: {
  ideas: ContentIdeaEntity[]
}) {
  const updateIdea = useUpdateContentIdea()
  const generateFromIdea = useGenerateFromIdea()
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [sorting, setSorting] = useState<SortingState>([])
  const [sortOption, setSortOption] = useState<SortOption>('updated')

  const contentIdeaForm = useForm<ContentIdeaTableForm>({
    mode: 'onChange',
    defaultValues: {
      rows: {},
    },
  })

  const {
    getValues,
    clearErrors,
    resetField,
    trigger,
    reset,
    formState: { dirtyFields },
    handleSubmit,
  } = contentIdeaForm

  const filteredIdeas = useFilteredList(ideas, {
    search: (item, term) => {
      const searchLower = term.toLowerCase()
      return (
        item.hook.toLowerCase().includes(searchLower) ||
        (item.angle && item.angle.toLowerCase().includes(searchLower)) ||
        item.category.toLowerCase().includes(searchLower) ||
        item.ideaProducts.some((p) => p.toLowerCase().includes(searchLower))
      )
    },
    filterMap: {
      status: (item, value) => item.status === value,
      ideaType: (item, value) => item.ideaType === value,
      targetPlatform: (item, value) => item.targetPlatform === value,
      category: (item, value) => item.category === value,
      productCount: (item, value) => {
        const count = item.ideaProducts?.length ?? 0
        if (value === 'none') return count === 0
        if (value === 'single') return count === 1
        if (value === 'multiple') return count > 1
        return true
      },
      outputStatus: (item, value) => {
        if (value === 'produced') return item.status === 'produced'
        if (value === 'not-produced') return item.status !== 'produced'
        return true
      },
    },
  })

  const statusOptions: AutocompleteOption[] = [
    { value: 'draft', label: 'Draft' },
    { value: 'approved', label: 'Approved' },
    { value: 'queued', label: 'Queued' },
    { value: 'produced', label: 'Produced' },
    { value: 'rejected', label: 'Rejected' },
  ]

  const ideaTypeOptions: AutocompleteOption[] = [
    { value: 'review', label: 'Review' },
    { value: 'comparison', label: 'Comparison' },
    { value: 'roundup', label: 'Roundup' },
    { value: 'tutorial', label: 'Tutorial' },
    { value: 'deal', label: 'Deal' },
    { value: 'trending', label: 'Trending' },
  ]

  const platformOptions: AutocompleteOption[] = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'blog', label: 'Blog' },
  ]

  const categoryOptions: AutocompleteOption[] = [
    { value: 'Điện tử', label: 'Điện tử' },
    { value: 'Phụ kiện', label: 'Phụ kiện' },
    { value: 'Gia dụng', label: 'Gia dụng' },
    { value: 'Thời trang', label: 'Thời trang' },
    { value: 'Làm đẹp', label: 'Làm đẹp' },
    { value: 'Thể thao', label: 'Thể thao' },
    { value: 'uncategorized', label: 'Khác' },
  ]

  const productCountOptions: AutocompleteOption[] = [
    { value: 'none', label: 'No products' },
    { value: 'single', label: '1 product' },
    { value: 'multiple', label: '2+ products' },
  ]

  const outputStatusOptions: AutocompleteOption[] = [
    { value: 'produced', label: 'Produced' },
    { value: 'not-produced', label: 'Not produced' },
  ]

  const handleGenerate = async (ideaId: string) => {
    try {
      await generateFromIdea.mutateAsync(ideaId)
    } catch (error) {
      console.error('Failed to generate:', error)
    }
  }

  const handleCancelRow = (ideaId: string) => {
    const rowPath = `rows.${ideaId}` as const
    resetField(rowPath)
    clearErrors(rowPath)
  }

  const saveEdit = async (ideaId: string) => {
    const isValid = await trigger([
      `rows.${ideaId}.hook` as const,
      `rows.${ideaId}.angle` as const,
    ])
    if (!isValid) return

    const idea = ideas.find((i) => i.ideaId === ideaId)
    if (!idea) return

    const rowPath = `rows.${ideaId}` as const
    const row = getValues(rowPath)

    const data = {
      ideaType: row.ideaType,
      hook: row.hook,
      angle: row.angle,
      targetPlatform: row.targetPlatform,
      category: row.category,
      priority: row.priority,
      ideaProducts: row.ideaProducts,
    }

    const payload = {
      ...data,
      ideaProducts: data.ideaProducts ?? [],
    }

    if (idea.status !== 'draft') {
      ;(payload as any).status = 'draft'
    }

    await updateIdea.mutateAsync({ ideaId, data: payload })
    resetField(rowPath, { defaultValue: data })
    clearErrors(rowPath)
  }

  const approve = (idea: ContentIdeaEntity) => {
    updateIdea.mutate({ ideaId: idea.ideaId, data: { status: 'approved' } })
  }

  const isRowDirty = (rowId: string) => {
    return dirtyFields.rows?.[rowId] ? true : false
  }

  const angels = useMemo(() => {
    return Array.from(new Set(ideas.map((idea) => idea.angle)))
      .filter(Boolean)
      .map((angle) => ({ value: angle, label: angle })) as AutocompleteOption[]
  }, [ideas])

  const ideaTable = useReactTable({
    data: filteredIdeas.filteredItems,
    columns: getColumns(
      isRowDirty,
      handleCancelRow,
      saveEdit,
      approve,
      handleGenerate,
      contentIdeaForm,
      angels,
    ),
    state: { sorting },
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
            <Link to="/dash/content/new">
              <Button size="sm" className="inline-flex items-center gap-1.5">
                <Plus size={16} />
                New seed
              </Button>
            </Link>
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
            options={statusOptions}
            value={
              statusOptions.find(
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
            options={ideaTypeOptions}
            value={
              ideaTypeOptions.find(
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
            options={platformOptions}
            value={
              platformOptions.find(
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
            options={categoryOptions}
            value={
              categoryOptions.find(
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
            options={productCountOptions}
            value={
              productCountOptions.find(
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
            options={outputStatusOptions}
            value={
              outputStatusOptions.find(
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
              onClick={filteredIdeas.clearFilters}
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
          <FormProvider {...contentIdeaForm}>
            <form onSubmit={handleSubmit(() => undefined)}>
              <CommonTable
                table={ideaTable}
                minWidth={900}
                compact
                isRowDirty={isRowDirty}
                getRowClassName={(idea) => {
                  const produced = idea.status === 'produced'
                  const dirty = isRowDirty(idea.ideaId)
                  if (produced && !dirty)
                    return '[&>*:not(:last-child)]:opacity-40'
                  return undefined
                }}
              />
            </form>
          </FormProvider>
        )}

        {viewMode === 'board' && (
          <div className="p-8 text-center text-muted-text border border-dashed rounded-lg">
            <LayoutGrid size={48} className="mx-auto mb-4 opacity-50" />
            <p>Board view coming soon...</p>
          </div>
        )}
      </div>
    </div>
  )
}
