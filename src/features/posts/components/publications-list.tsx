import type { PublicationRecord } from '../types/publication'
import {
  PUBLICATION_STATUS_META,
  PLATFORM_META,
} from '../types/publication'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { useRetryPublication } from '../hooks/use-publications'
import { EmptyState } from '#/components/ui/empty-state'
import { LoadingState } from '#/components/ui/loading-state'
import { ExternalLink, AlertTriangle, RefreshCw, Send } from 'lucide-react'

function formatDateTime(dateString?: string) {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

interface PublicationRowProps {
  record: PublicationRecord
}

function PublicationRow({ record }: PublicationRowProps) {
  const retry = useRetryPublication()
  const statusMeta = PUBLICATION_STATUS_META[record.status]
  const platformMeta = PLATFORM_META[record.platform]

  return (
    <tr className="border-b border-frost/50 hover:bg-surface-2/40 transition-colors">
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full border ${platformMeta.colorClass}`}
        >
          {platformMeta.label}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-near-white max-w-40 truncate">
        {record.targetName || record.targetId}
      </td>
      <td className="px-4 py-3">
        <Badge tone={statusMeta.tone} size="sm">
          {record.status === 'publishing' && (
            <span className="animate-pulse">●</span>
          )}
          {statusMeta.label}
        </Badge>
      </td>
      <td className="px-4 py-3 text-xs text-muted-text font-mono max-w-32 truncate">
        {record.externalPostId || '—'}
      </td>
      <td className="px-4 py-3 text-xs max-w-40">
        {record.externalUrl ? (
          <a
            href={record.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-accent-blue hover:underline"
          >
            <span className="truncate">{record.externalUrl}</span>
            <ExternalLink className="size-3 shrink-0" />
          </a>
        ) : (
          <span className="text-muted-text">—</span>
        )}
      </td>
      <td className="px-4 py-3 text-xs text-muted-text whitespace-nowrap">
        {formatDateTime(record.publishedAt)}
      </td>
      <td className="px-4 py-3">
        {record.status === 'failed' && record.errorMessage ? (
          <div className="flex items-start gap-1.5 max-w-48">
            <AlertTriangle className="size-3.5 text-accent-red shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs text-accent-red truncate">
                {record.errorCode ? `[${record.errorCode}] ` : ''}
                {record.errorMessage}
              </p>
            </div>
          </div>
        ) : (
          <span className="text-muted-text text-xs">—</span>
        )}
      </td>
      <td className="px-4 py-3">
        {record.canRetry &&
          (record.status === 'failed' || record.status === 'cancelled') && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={retry.isPending}
              onClick={() => retry.mutate(record.publicationId)}
              className="h-7 gap-1.5 text-xs"
            >
              <RefreshCw
                className={`size-3 ${retry.isPending ? 'animate-spin' : ''}`}
              />
              Thử lại
            </Button>
          )}
      </td>
    </tr>
  )
}

interface PublicationsListProps {
  publications: PublicationRecord[]
  isLoading: boolean
}

export function PublicationsList({
  publications,
  isLoading,
}: PublicationsListProps) {
  if (isLoading) {
    return <LoadingState variant="card" label="Đang tải lịch sử đăng..." />
  }

  if (publications.length === 0) {
    return (
      <EmptyState
        variant="card"
        icon={<Send />}
        title="Chưa có bản đăng nào"
        description="Bài viết này chưa được đăng lên nền tảng nào. Thêm nền tảng mục tiêu để bắt đầu."
      />
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-frost">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-surface-2/60 border-b border-frost">
            <th className="px-4 py-2.5 text-xs font-medium text-muted-text">
              Nền tảng
            </th>
            <th className="px-4 py-2.5 text-xs font-medium text-muted-text">
              Trang / Tài khoản
            </th>
            <th className="px-4 py-2.5 text-xs font-medium text-muted-text">
              Trạng thái
            </th>
            <th className="px-4 py-2.5 text-xs font-medium text-muted-text">
              External ID
            </th>
            <th className="px-4 py-2.5 text-xs font-medium text-muted-text">
              URL
            </th>
            <th className="px-4 py-2.5 text-xs font-medium text-muted-text">
              Đăng lúc
            </th>
            <th className="px-4 py-2.5 text-xs font-medium text-muted-text">
              Lỗi
            </th>
            <th className="px-4 py-2.5 text-xs font-medium text-muted-text" />
          </tr>
        </thead>
        <tbody>
          {publications.map((record) => (
            <PublicationRow key={record.publicationId} record={record} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
