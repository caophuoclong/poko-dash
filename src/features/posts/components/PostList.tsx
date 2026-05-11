import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel
  
  
  
} from '@tanstack/react-table'
import type {ColumnDef, RowSelectionState, SortingState} from '@tanstack/react-table';
import {
  Check,
  ChevronsUpDown,
  Edit,
  FileText,
  Grid3X3,
  LayoutList,
  Loader2,
  MoreHorizontal,
  Trash2,
  Copy,
  Facebook,
  Instagram,
  Youtube,
} from 'lucide-react'

import { CommonTable } from '@/components/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EmptyState } from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'
import { usePageHeader } from '@/components/ui/page-header-context'
import { BulkActionsBar } from '@/components/patterns/bulk-actions-bar'
import {
  Combobox, ComboboxInput, ComboboxContent, ComboboxList,
  ComboboxCollection, ComboboxItem, ComboboxEmpty,
} from '@/components/ui/combobox'
import type { ComboboxOption } from '@/components/ui/combobox-utils'
import { filterOptionsByLabel } from '@/components/ui/combobox-utils'
import type { ContentPostParsed } from '../schemas/content-post.schema'
import { contentTypeOptions, statusOptions } from './post-edit-page/constants'

const PAGE_SIZE = 20

interface Props {
  posts: ContentPostParsed[]
}

type PostRow = ContentPostParsed

type ViewMode = 'table' | 'grid'

const platformIconMap: Record<string, React.ReactNode> = {
  facebook: <Facebook size={14} />,
  instagram: <Instagram size={14} />,
  youtube: <Youtube size={14} />,
  tiktok: <span className="text-xs font-semibold">TT</span>,
  blog: <FileText size={14} />,
}

function getStatusTone(status: string): 'neutral' | 'green' | 'blue' {
  if (status === 'published') return 'green'
  if (status === 'queued' || status === 'scheduled') return 'blue'
  return 'neutral'
}

export default function PostList({ posts }: Props) {
  const navigate = useNavigate()
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const tableScrollRef = useRef<HTMLDivElement | null>(null)

  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState<string>()
  const [selectedStatus, setSelectedStatus] = useState<string>()
  const [selectedContentType, setSelectedContentType] = useState<string>()
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'createdAt', desc: true },
  ])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const platformOptions = useMemo<ComboboxOption[]>(() => {
    const unique = Array.from(new Set(posts.map((post) => post.platform)))
    return unique.map((value) => ({
      label: value[0].toUpperCase() + value.slice(1),
      value,
    }))
  }, [posts])

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        !searchTerm ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesPlatform =
        !selectedPlatform || post.platform === selectedPlatform
      const matchesStatus = !selectedStatus || post.status === selectedStatus
      const matchesType =
        !selectedContentType || post.contentType === selectedContentType
      return matchesSearch && matchesPlatform && matchesStatus && matchesType
    })
  }, [posts, searchTerm, selectedPlatform, selectedStatus, selectedContentType])

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [searchTerm, selectedPlatform, selectedStatus, selectedContentType])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (!first?.isIntersecting) return
        if (isLoadingMore) return
        if (visibleCount >= filteredPosts.length) return

        setIsLoadingMore(true)
        window.setTimeout(() => {
          setVisibleCount((prev) =>
            Math.min(prev + PAGE_SIZE, filteredPosts.length),
          )
          setIsLoadingMore(false)
        }, 300)
      },
      { root: tableScrollRef.current, rootMargin: '120px 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [visibleCount, filteredPosts.length, isLoadingMore])

  const visiblePosts = useMemo(
    () => filteredPosts.slice(0, visibleCount),
    [filteredPosts, visibleCount],
  )

  const columns = useMemo<ColumnDef<PostRow>[]>(
    () => [
      {
        id: 'select',
        size: 44,
        enableSorting: false,
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(value)}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(value)}
          />
        ),
      },
      {
        accessorKey: 'title',
        header: 'Title',
        size: 320,
        cell: ({ getValue }) => (
          <div className="group/title flex items-center justify-between gap-2">
            <span className="truncate text-sm text-[var(--color-ink)]">
              {getValue<string>()}
            </span>
            <div className="hidden items-center gap-1 group-hover/title:flex">
              <Button variant="ghost" size="icon" className="size-6">
                <Edit size={12} />
              </Button>
              <Button variant="ghost" size="icon" className="size-6">
                <Copy size={12} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-6 text-accent-red"
              >
                <Trash2 size={12} />
              </Button>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'platform',
        header: 'Platform',
        size: 150,
        cell: ({ getValue }) => {
          const platform = getValue<string>()
          return (
            <div className="flex items-center gap-2 text-sm text-[var(--color-muted)] capitalize">
              <span className="inline-flex size-5 items-center justify-center rounded-[var(--radius-xs)] bg-[var(--color-surface-soft)]">
                {platformIconMap[platform] ?? <FileText size={14} />}
              </span>
              <span>{platform}</span>
            </div>
          )
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 150,
        cell: ({ getValue }) => {
          const status = getValue<string>()
          const label =
            statusOptions.find((item) => item.value === status)?.label ?? status
          return <Badge tone={getStatusTone(status)}>{label}</Badge>
        },
      },
      {
        accessorKey: 'contentType',
        header: 'Content Type',
        size: 150,
        cell: ({ getValue }) => (
          <span className="text-sm text-[var(--color-muted)] capitalize">
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Created At',
        size: 180,
        cell: ({ getValue }) => (
          <span className="text-sm text-[var(--color-muted)]">
            {new Date(getValue<string>()).toLocaleDateString()}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        size: 80,
        enableSorting: false,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  navigate({
                    to: '/dash/posts/$postId',
                    params: { postId: row.original.postId },
                  })
                }
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem className="text-accent-red">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [navigate],
  )

  const table = useReactTable({
    data: visiblePosts,
    columns,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  usePageHeader({
    title: 'Posts',
    description: `Manage ${filteredPosts.length} posts`,
    actions: (
      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-[var(--radius-sm)] border border-[var(--color-hairline)] p-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => setViewMode('table')}
          >
            <LayoutList
              size={14}
              className={
                viewMode === 'table'
                  ? 'text-[var(--color-ink)]'
                  : 'text-[var(--color-muted)]'
              }
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3
              size={14}
              className={
                viewMode === 'grid'
                  ? 'text-[var(--color-ink)]'
                  : 'text-[var(--color-muted)]'
              }
            />
          </Button>
        </div>
        <Button
          color="orange"
          size="xs"
          onClick={() => navigate({ to: '/dash/posts/new' })}
        >
          + New Post
        </Button>
      </div>
    ),
  })

  const selectedCount = Object.keys(rowSelection).length

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-4">
        <div className="min-w-64 flex-1">
          <Input
            type="search"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-[var(--color-hairline)] focus-visible:border-[var(--color-frost-hover)] focus-visible:ring-0"
          />
        </div>
        <FilterCombobox
          options={platformOptions}
          selectedValue={selectedPlatform}
          onChange={setSelectedPlatform}
          placeholder="Platform"
          className="w-44 border-[var(--color-hairline)] focus-within:border-[var(--color-frost-hover)] focus-within:ring-0"
        />
        <FilterCombobox
          options={statusOptions}
          selectedValue={selectedStatus}
          onChange={setSelectedStatus}
          placeholder="Status"
          className="w-44 border-[var(--color-hairline)] focus-within:border-[var(--color-frost-hover)] focus-within:ring-0"
        />
        <FilterCombobox
          options={contentTypeOptions}
          selectedValue={selectedContentType}
          onChange={setSelectedContentType}
          placeholder="Content Type"
          className="w-44 border-[var(--color-hairline)] focus-within:border-[var(--color-frost-hover)] focus-within:ring-0"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto">
              Sort <ChevronsUpDown size={14} className="ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => setSorting([{ id: 'createdAt', desc: true }])}
            >
              Newest first
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setSorting([{ id: 'createdAt', desc: false }])}
            >
              Oldest first
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setSorting([{ id: 'title', desc: false }])}
            >
              Title A-Z
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <BulkActionsBar
        selectedCount={selectedCount}
        onClear={() => setRowSelection({})}
      />

      {filteredPosts.length === 0 ? (
        <div className="rounded-[var(--radius-md)] border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-10">
          <EmptyState
            icon={<FileText />}
            title="No posts yet"
            description="Create content and manage all affiliate posts in one place."
            primaryAction={
              <Button
                color="orange"
                size="sm"
                onClick={() => navigate({ to: '/dash/posts/new' })}
              >
                Create your first post
              </Button>
            }
          />
        </div>
      ) : (
        <div
          className="rounded-[var(--radius-md)] border border-[var(--color-hairline)] bg-[var(--color-canvas)] flex min-h-0 flex-col"
          style={{ height: 'calc(100vh - 280px)' }}
        >
          {viewMode === 'table' ? (
            <CommonTable
              table={table}
              className="border-0 rounded-none flex-1 min-h-0"
              onRowClick={(row) =>
                navigate({
                  to: '/dash/posts/$postId',
                  params: { postId: row.postId },
                })
              }
              getRowClassName={() =>
                'hover:bg-[var(--color-surface-soft)] transition-colors'
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2 lg:grid-cols-3">
              {visiblePosts.map((post) => (
                <div
                  key={post.postId}
                  className="rounded-[var(--radius-md)] border border-[var(--color-hairline)] bg-[var(--color-surface)] p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <Badge tone={getStatusTone(post.status)}>
                      {statusOptions.find((item) => item.value === post.status)
                        ?.label ?? post.status}
                    </Badge>
                    <span className="text-xs text-[var(--color-muted)] capitalize">
                      {post.platform}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-sm text-[var(--color-ink)]">
                    {post.title}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div
            ref={sentinelRef}
            className="flex h-12 items-center justify-center border-t border-[var(--color-hairline)]"
          >
            {isLoadingMore ? (
              <Loader2 className="size-4 animate-spin text-[var(--color-muted)]" />
            ) : visibleCount < filteredPosts.length ? (
              <span className="text-xs text-[var(--color-muted)]">
                Scroll to load more
              </span>
            ) : (
              <Check className="size-4 text-[var(--color-muted)]" />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function FilterCombobox({
  options,
  selectedValue,
  onChange,
  placeholder,
  className,
}: {
  options: ComboboxOption[]
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
      isItemEqualToValue={(item, value) => item?.value === value?.value}
    >
      <ComboboxInput className={className} placeholder={placeholder} showClear />
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
