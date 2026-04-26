import { useState, useMemo } from 'react'
import { FileText } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import PostsToolbar from './posts-toolbar'
import PostsFilterBar from './posts-filter-bar'
import { CommonTable } from '@/components/table'
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import { EmptyState } from '@/components/ui/empty-state'
import { StatusCell } from './post-list/StatusCell'
import { statusOptions } from './post-edit-page/constants'
import type { GetContentPostsResponse } from '#/dtos/content-posts'

type PostSummary = GetContentPostsResponse[number]

interface Props {
  posts: GetContentPostsResponse
}
export default function PostList(props: Props) {
  const { posts } = props
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState<string>()
  const [selectedStatus, setSelectedStatus] = useState<string>()

  const platforms = useMemo(() => {
    const uniquePlatforms = Array.from(
      new Set(posts.map((post) => post.platform)),
    )
    return uniquePlatforms.map((platform) => ({
      value: platform,
      label: platform.charAt(0).toUpperCase() + platform.slice(1),
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

      return matchesSearch && matchesPlatform && matchesStatus
    })
  }, [posts, searchTerm, selectedPlatform, selectedStatus])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Vừa xong'
    if (diffMins < 60) return `${diffMins} phút trước`
    if (diffHours < 24) return `${diffHours} giờ trước`
    if (diffDays < 7) return `${diffDays} ngày trước`
    return date.toLocaleDateString('vi-VN')
  }

  const columns = useMemo<ColumnDef<PostSummary>[]>(
    () => [
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
          <div className="truncate text-sm text-near-white">
            {getValue<string>()}
          </div>
        ),
      },
      {
        accessorKey: 'platform',
        header: 'Nền tảng',
        size: 120,
        cell: ({ getValue }) => (
          <span className="text-sm text-muted-text capitalize">
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
            return <span className="text-sm text-muted-text">—</span>
          }
          return (
            <span className="text-sm truncate text-near-white">
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
          <span className="text-sm text-muted-text">
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
            <Link
              to="/dash/posts/$postId"
              params={{ postId: row.original.postId }}
              className="text-xs text-accent-blue hover:underline"
            >
              Xem
            </Link>
            <span className="text-muted-text">|</span>
            <Link
              to="/dash/posts/$postId/edit"
              params={{ postId: row.original.postId }}
              className="text-xs text-accent-blue hover:underline"
            >
              Sửa
            </Link>
          </div>
        ),
      },
    ],
    [],
  )

  const table = useReactTable({
    data: filteredPosts,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="max-w-full">
      <PageHeader
        title="Bài viết"
        subtitle="Quản lý toàn bộ bài viết của bạn"
        actions={
          <Link to="/dash/posts/new">
            <Button color="orange">Tạo bài viết</Button>
          </Link>
        }
      />

      <PostsToolbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <PostsFilterBar
        platforms={platforms}
        statuses={statusOptions}
        selectedPlatform={selectedPlatform}
        selectedStatus={selectedStatus}
        onPlatformChange={setSelectedPlatform}
        onStatusChange={setSelectedStatus}
      />

      {filteredPosts.length === 0 ? (
        <EmptyState
          icon={<FileText />}
          title="Không tìm thấy bài viết nào"
          description={
            searchTerm || selectedPlatform || selectedStatus
              ? 'Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm'
              : undefined
          }
          action={
            searchTerm || selectedPlatform || selectedStatus ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedPlatform(undefined)
                  setSelectedStatus(undefined)
                }}
              >
                Xóa bộ lọc
              </Button>
            ) : (
              <Button
                color="orange"
                size="sm"
                onClick={() => {
                  window.location.href = '/dash/posts/new'
                }}
              >
                Tạo bài viết đầu tiên
              </Button>
            )
          }
        />
      ) : (
        <CommonTable
          table={table}
          onRowClick={(row) => {
            window.location.href = `/dash/posts/${row.postId}`
          }}
          className="bg-surface"
        />
      )}
    </div>
  )
}
