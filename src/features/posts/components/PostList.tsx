import { useState, useMemo } from 'react'
import type { SortingState, RowSelectionState } from '@tanstack/react-table'
import { FileText, ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import PostsToolbar from './posts-toolbar'
import PostsFilterBar from './posts-filter-bar'
import { CommonTable } from '@/components/table'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { usePageHeader } from '@/components/ui/page-header-context'
import { EmptyState } from '@/components/ui/empty-state'
import { BulkActionsBar } from '@/components/patterns/bulk-actions-bar'
import { formatRelativeTime } from '@/shared/utils/date'
import { StatusCell } from './post-list/StatusCell'
import { statusOptions } from './post-edit-page/constants'
import { useContentIdeas } from '#/features/contents/hooks/use-content-ideas'
import type { ContentPostParsed } from '../schemas/content-post.schema'

const PAGE_SIZE = 20
const NO_IDEA_SENTINEL = '__none__'
type PostSummary = any[number]

interface Props {
  posts: ContentPostParsed[]
  ideaId?: string
}

export default function PostList(props: Props) {
  const { posts, ideaId } = props
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState<string>()
  const [selectedStatus, setSelectedStatus] = useState<string>()
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [compact, setCompact] = useState(false)
  const selectedIdea = ideaId
  const navigate = useNavigate()
  const { data } = useContentIdeas()
  const ideas = data?.data ?? []

  const setSelectedIdea = (value: string | undefined) => {
    void navigate({
      to: '/dash/posts',
      search: { ideaId: value },
      replace: true,
    })
  }

  const platforms = useMemo(() => {
    const uniquePlatforms = Array.from(
      new Set(posts.map((post) => post.platform)),
    )
    return uniquePlatforms.map((platform) => ({
      value: platform,
      label: platform.charAt(0).toUpperCase() + platform.slice(1),
    }))
  }, [posts])

  const postIdeaMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const idea of ideas) {
      for (const postId of idea.postIds ?? []) {
        map.set(postId, idea.ideaId)
      }
    }
    return map
  }, [ideas])

  const ideaOptions = useMemo(
    () => [
      { value: NO_IDEA_SENTINEL, label: 'Không có ý tưởng' },
      ...ideas
        .filter((idea) => (idea.postIds?.length ?? 0) > 0)
        .map((idea) => ({ value: idea.ideaId, label: idea.hook })),
    ],
    [ideas],
  )

  const selectedIdeaData = ideas.find((i) => i.ideaId === selectedIdea)

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        !searchTerm ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesPlatform =
        !selectedPlatform || post.platform === selectedPlatform
      const matchesStatus = !selectedStatus || post.status === selectedStatus
      const matchesIdea =
        !selectedIdea ||
        (selectedIdea === NO_IDEA_SENTINEL
          ? !postIdeaMap.has(post.postId)
          : postIdeaMap.get(post.postId) === selectedIdea)
      return matchesSearch && matchesPlatform && matchesStatus && matchesIdea
    })
  }, [posts, searchTerm, selectedPlatform, selectedStatus, selectedIdea, postIdeaMap])

  const formatDate = (dateString: string) => formatRelativeTime(dateString)

  const columns = useMemo<ColumnDef<PostSummary>[]>(
    () => [
      {
        id: 'select',
        size: 40,
        enableSorting: false,
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            onClick={(e) => e.stopPropagation()}
          />
        ),
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        size: 140,
        cell: ({ getValue, row }) => (
          <StatusCell
            postId={row.original.postId}
            status={getValue<string>()}
          />
        ),
      },
      {
        accessorKey: 'title',
        header: 'Tiêu đề',
        size: 350,
        cell: ({ getValue }) => (
          <div className="truncate text-sm text-[var(--color-ink)]">
            {getValue<string>()}
          </div>
        ),
      },
      {
        id: 'idea',
        header: 'Ý tưởng',
        size: 200,
        cell: ({ row }) => {
          const linkedIdeaId = postIdeaMap.get(row.original.postId)
          const linkedIdea = ideas.find((i) => i.ideaId === linkedIdeaId)
          if (!linkedIdea) {
            return <span className="text-sm text-[var(--color-muted)]">—</span>
          }
          return (
            <button
              type="button"
              className="text-sm text-accent-blue hover:underline truncate max-w-full text-left"
              onClick={(e) => {
                e.stopPropagation()
                void navigate({
                  to: '/dash/posts',
                  search: { ideaId: linkedIdea.ideaId },
                })
              }}
            >
              {linkedIdea.hook}
            </button>
          )
        },
      },
      {
        accessorKey: 'platform',
        header: 'Nền tảng',
        size: 120,
        cell: ({ getValue }) => (
          <span className="text-sm text-[var(--color-muted)] capitalize">
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'primaryProduct',
        header: 'Sản phẩm',
        size: 150,
        cell: ({ row }) => {
          if (!row.original.primaryProduct) {
            return <span className="text-sm text-[var(--color-muted)]">—</span>
          }
          return (
            <span className="text-sm line-clamp-1 text-[var(--color-ink)]">
              {row.original.primaryProduct.canonicalTitle}
            </span>
          )
        },
      },
      {
        accessorKey: 'updatedAt',
        header: 'Cập nhật',
        size: 120,
        cell: ({ getValue }) => (
          <span className="text-sm text-[var(--color-muted)]">
            {formatDate(getValue<string>())}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Hành động',
        size: 150,
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-accent-blue hover:underline h-auto p-0"
              onClick={() =>
                navigate({
                  to: '/dash/posts/$postId',
                  params: { postId: row.original.postId },
                })
              }
            >
              Xem
            </Button>
            <span className="text-[var(--color-muted)]">|</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-accent-blue hover:underline h-auto p-0"
              onClick={() =>
                navigate({
                  to: '/dash/posts/$postId/edit',
                  params: { postId: row.original.postId },
                })
              }
            >
              Sửa
            </Button>
          </div>
        ),
      },
    ],
    [postIdeaMap, ideas, navigate, formatDate],
  )

  const table = useReactTable({
    data: filteredPosts,
    columns,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: PAGE_SIZE } },
  })

  const selectedCount = Object.keys(rowSelection).length

  usePageHeader({
    title:
      selectedIdea && selectedIdea !== NO_IDEA_SENTINEL && selectedIdeaData
        ? `Bài viết từ ý tưởng: ${selectedIdeaData.hook}`
        : selectedIdea === NO_IDEA_SENTINEL
          ? 'Bài viết không có ý tưởng'
          : 'Bài viết',
    description: selectedIdea
      ? `Hiển thị ${filteredPosts.length} bài viết`
      : 'Quản lý toàn bộ bài viết của bạn',
    primaryAction: (
      <Button
        color="orange"
        size={'xs'}
        onClick={() => navigate({ to: '/dash/posts/new' })}
      >
        Tạo bài viết
      </Button>
    ),
  })

  return (
    <div className="max-w-full space-y-6">
      {/* Filter workspace */}
      <div className="bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[var(--radius-md)] p-4 md:p-5 space-y-4">
        <PostsToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          compact={compact}
          onCompactChange={setCompact}
        />
        <PostsFilterBar
          platforms={platforms}
          statuses={statusOptions}
          ideas={ideaOptions}
          selectedPlatform={selectedPlatform}
          selectedStatus={selectedStatus}
          selectedIdea={selectedIdea}
          onPlatformChange={setSelectedPlatform}
          onStatusChange={setSelectedStatus}
          onIdeaChange={setSelectedIdea}
        />
      </div>

      {/* Bulk actions */}
      <BulkActionsBar
        selectedCount={selectedCount}
        onClear={() => setRowSelection({})}
      />

      {/* Results workspace */}
      <div className="bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[var(--radius-md)] overflow-hidden">
        {filteredPosts.length === 0 ? (
          <div className="p-6 md:p-10">
            <EmptyState
              icon={<FileText />}
              title="Không tìm thấy bài viết nào"
              description={
                searchTerm || selectedPlatform || selectedStatus || selectedIdea
                  ? 'Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm'
                  : undefined
              }
              primaryAction={
                searchTerm ||
                selectedPlatform ||
                selectedStatus ||
                selectedIdea ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedPlatform(undefined)
                      setSelectedStatus(undefined)
                      setSelectedIdea(undefined)
                    }}
                  >
                    Xóa bộ lọc
                  </Button>
                ) : (
                  <Button
                    color="orange"
                    size="sm"
                    onClick={() => navigate({ to: '/dash/posts/new' })}
                  >
                    Tạo bài viết đầu tiên
                  </Button>
                )
              }
            />
          </div>
        ) : (
          <>
            <CommonTable
              table={table}
              onRowClick={(row) => {
                navigate({
                  to: '/dash/posts/$postId',
                  params: { postId: row.postId },
                })
              }}
              className="rounded-[var(--radius-md)]"
              compact={compact}
            />
            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--color-hairline)]">
              <span className="text-xs text-[var(--color-muted)]">
                Page {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeft size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
