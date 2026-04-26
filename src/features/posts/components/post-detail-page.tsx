import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { PageHeader } from '@/components/ui/page-header'
import { LoadingState } from '@/components/ui/loading-state'
import { EmptyState } from '@/components/ui/empty-state'
import PostMetadataSidebar from './post-metadata-sidebar'
import { useContentPost } from '@/features/posts/hooks/use-content-posts'
import { useScheduledJobForPost } from '@/features/scheduler/hooks/use-scheduler'
import TiptapViewer from '#/components/editor/tiptap-viewer'
import { TooltipProvider } from '@/components/ui/tooltip'
import { POST_STATUS, getStatusMeta } from '#/shared/constants'
import { Link } from '@tanstack/react-router'

interface PostDetailPageProps {
  postId: string
}

function PostDetailPageInner({ postId }: PostDetailPageProps) {
  const { data: post, isLoading } = useContentPost(postId)
  const { data: scheduledJob } = useScheduledJobForPost(postId)

  if (isLoading) {
    return <LoadingState variant="block" />
  }

  if (!post || !postId) {
    return (
      <EmptyState
        title="Không tìm thấy bài viết"
        description="Bài viết này không tồn tại hoặc đã bị xóa"
      />
    )
  }

  const { tone, label } = getStatusMeta(POST_STATUS, post.status)

  return (
    <div className="max-w-full">
      <PageHeader
        backHref="/dash/posts"
        backLabel="Quay lại"
        title={post.title}
        actions={
          <div className="flex items-center gap-3">
            <Badge tone={tone}>{label}</Badge>
            <Link
              to="/dash/posts/$postId/edit"
              params={{ postId: post.postId }}
            >
              <Button size="sm">Sửa bài viết</Button>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-surface border border-frost rounded-2xl p-6 space-y-6">
            <div>
              <h2 className="text-sm text-muted-text mb-2">Tiêu đề</h2>
              <p className="text-near-white">{post.title}</p>
            </div>

            <div>
              <h2 className="text-sm text-muted-text mb-2">Nội dung</h2>
              <div className="bg-surface-2 border border-frost rounded-lg p-4">
                <TiptapViewer content={post.body} />
              </div>
            </div>

            {post.hashtags && (
              <div>
                <h2 className="text-sm text-muted-text mb-2">Hashtags</h2>
                <div className="flex flex-wrap gap-2">
                  {post.hashtags.map((tag, index) => (
                    <span key={index} className="text-sm text-accent-blue">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(post.supportingProducts?.length ?? 0) > 0 && (
              <div>
                <h2 className="text-sm text-muted-text mb-2">Hình ảnh</h2>
                <div className="grid grid-cols-2 gap-4">
                  {post.supportingProducts?.map((product, index) => (
                    <img
                      key={index}
                      src={product.imageCover?.trim()}
                      alt={`Image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg border border-frost"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <PostMetadataSidebar post={post} scheduledJob={scheduledJob} />
        </div>
      </div>
    </div>
  )
}

export default function PostDetailPage({ postId }: PostDetailPageProps) {
  return (
    <TooltipProvider>
      <PostDetailPageInner postId={postId} />
    </TooltipProvider>
  )
}
