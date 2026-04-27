import type { GetContentPostsByPostIdResponse } from '#/dtos/content-posts'
import type { ScheduledJob } from '#/features/scheduler/types/scheduler.dto'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import {
  POST_STATUS,
  EXECUTION_STATUS,
  getStatusMeta,
} from '#/shared/constants'

interface PostMetadataSidebarProps {
  post: GetContentPostsByPostIdResponse
  scheduledJob?: ScheduledJob | null
}

export default function PostMetadataSidebar({
  post,
  scheduledJob,
}: PostMetadataSidebarProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '—'
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-4">
      <div className="bg-surface border border-frost rounded-2xl p-4 space-y-3">
        <h3 className="font-semibold text-near-white">Thông tin bài viết</h3>

        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-sm text-muted-text">Trạng thái</span>
            <Badge tone={getStatusMeta(POST_STATUS, post.status).tone}>
              {getStatusMeta(POST_STATUS, post.status).label}
            </Badge>
          </div>

          {post.idea && (
            <div className="flex justify-between items-start">
              <span className="text-sm text-muted-text">Ý tưởng gốc</span>
              <span className="text-sm text-near-white text-right max-w-45 line-clamp-3">
                {post.idea.hook}
              </span>
            </div>
          )}

          <div className="flex justify-between items-start">
            <span className="text-sm text-muted-text">Nền tảng</span>
            <span className="text-sm text-near-white capitalize">
              {post.platform}
            </span>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-sm text-muted-text">Loại nội dung</span>
            <span className="text-sm text-near-white capitalize">
              {post.contentType}
            </span>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-sm text-muted-text">Sản phẩm chính</span>
            <Tooltip>
              <TooltipTrigger className="text-sm text-near-white text-right max-w-45 truncate">
                {post.primaryProduct?.canonicalTitle || '—'}
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>{post.primaryProduct?.canonicalTitle || '—'}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {(post.supportingProducts?.length ?? 0) > 0 && (
            <div className="flex justify-between items-start">
              <span className="text-sm text-muted-text">Sản phẩm hỗ trợ</span>
              <span className="text-sm text-near-white text-right max-w-45">
                <Tooltip>
                  <TooltipTrigger className="text-sm text-near-white text-right max-w-45 truncate">
                    {post.supportingProducts?.length || 0} sản phẩm
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <ul>
                      {post.supportingProducts?.map(
                        (
                          product: NonNullable<
                            GetContentPostsByPostIdResponse['supportingProducts']
                          >[number],
                          index: number,
                        ) => (
                          <li key={product.productId}>
                            {index + 1}. {product.canonicalTitle}
                          </li>
                        ),
                      ) || '—'}
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-surface border border-frost rounded-2xl p-4 space-y-3">
        <h3 className="font-semibold text-near-white">Thời gian</h3>

        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-sm text-muted-text">Đã tạo</span>
            <span className="text-sm text-near-white">
              {formatDate(post.createdAt)}
            </span>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-sm text-muted-text">Cập nhật</span>
            <span className="text-sm text-near-white">
              {formatDate(post.updatedAt)}
            </span>
          </div>
        </div>
      </div>

      {scheduledJob && (
        <div className="bg-surface border border-frost rounded-2xl p-4 space-y-3">
          <h3 className="font-semibold text-near-white">Lịch đăng</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-sm text-muted-text">Trạng thái</span>
              <Badge
                tone={getStatusMeta(EXECUTION_STATUS, scheduledJob.status).tone}
              >
                {
                  getStatusMeta(EXECUTION_STATUS, scheduledJob.status, {
                    label: scheduledJob.status,
                    tone: 'neutral',
                  }).label
                }
              </Badge>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-muted-text">Thời gian đăng</span>
              <span className="text-sm text-near-white">
                {formatDate(scheduledJob.scheduledAt)}
              </span>
            </div>
            {scheduledJob.publishedAt && (
              <div className="flex justify-between items-start">
                <span className="text-sm text-muted-text">Đã đăng lúc</span>
                <span className="text-sm text-near-white">
                  {formatDate(scheduledJob.publishedAt)}
                </span>
              </div>
            )}
            {scheduledJob.postUrl && (
              <div className="flex justify-between items-start">
                <span className="text-sm text-muted-text">URL bài đăng</span>
                <a
                  href={scheduledJob.postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent-blue hover:underline truncate max-w-45"
                >
                  Xem bài
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
