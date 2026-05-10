import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { usePageHeader } from '@/components/ui/page-header-context'
import { LoadingState } from '@/components/ui/loading-state'
import { EmptyState } from '@/components/ui/empty-state'
import PostMetadataSidebar from './post-metadata-sidebar'
import { PublicationsList } from './publications-list'
import { useContentPost } from '@/features/posts/hooks/use-content-posts'
import { usePublications } from '@/features/posts/hooks/use-publications'
import { useScheduledJobForPost } from '@/features/scheduler/hooks/use-scheduler'
import TiptapViewer from '#/components/editor/tiptap-viewer'
import { TooltipProvider } from '@/components/ui/tooltip'
import { POST_STATUS, getStatusMeta } from '#/shared/constants'
import { Link } from '@tanstack/react-router'
import { getCompositeStatus, COMPOSITE_STATUS_META } from '../types/publication'
import { FileText, Send } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'

interface PostDetailPageProps {
  postId: string
}

type DetailTab = 'content' | 'publications'

function PostDetailPageInner({ postId }: PostDetailPageProps) {
  const { data: post, isLoading } = useContentPost(postId)
  const { data: scheduledJob } = useScheduledJobForPost(postId)
  const { data: publications = [], isLoading: pubLoading } =
    usePublications(postId)
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
  const compositeStatus = getCompositeStatus(publications)
  const compositeMeta = COMPOSITE_STATUS_META[compositeStatus]

  const tabs: {
    id: DetailTab
    label: string
    icon: React.ReactNode
    count?: number
  }[] = [
    {
      id: 'content',
      label: 'Nội dung',
      icon: <FileText className="size-3.5" />,
    },
    {
      id: 'publications',
      label: 'Bản đăng',
      icon: <Send className="size-3.5" />,
      count: publications.length,
    },
  ]

  usePageHeader({
    backHref: '/dash/posts',
    backLabel: 'Quay lại',
    title: post.title,
    actions: (
      <div className="flex items-center gap-3">
        {publications.length > 0 && (
          <Badge tone={compositeMeta.tone}>{compositeMeta.label}</Badge>
        )}
        <Badge tone={tone}>{label}</Badge>
        <Link to="/dash/posts/$postId/edit" params={{ postId: post.postId }}>
          <Button size="sm">Sửa bài viết</Button>
        </Link>
      </div>
    ),
  })

  return (
    <div className="max-w-full space-y-6">
      <div className="bg-surface border border-frost rounded-2xl overflow-hidden">
        <Tabs defaultValue="content" className="w-full">
          <div className="border-b border-frost px-4 pt-4">
            <TabsList className="gap-0 rounded-none bg-transparent p-0 h-auto w-full justify-start border-b-0">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-accent-blue data-[state=active]:text-accent-blue data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-text hover:text-near-white transition-colors"
                >
                  {tab.icon}
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="ml-1 text-xs bg-surface-2 px-1.5 py-0.5 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="content" className="mt-0 p-6">
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

                  {post.hashtags && post.hashtags.length > 0 && (
                    <div>
                      <h2 className="text-sm text-muted-text mb-2">Hashtags</h2>
                      <div className="flex flex-wrap gap-2">
                        {post.hashtags.map((tag: string, index: number) => (
                          <span
                            key={index}
                            className="text-sm text-accent-blue"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {(post.supportingProducts?.length ?? 0) > 0 && (
                    <div>
                      <h2 className="text-sm text-muted-text mb-2">
                        Sản phẩm hỗ trợ
                      </h2>
                      <div className="grid grid-cols-2 gap-4">
                        {post.supportingProducts?.map((product: { imageCover?: string | null }, index: number) => (
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
          </TabsContent>

          <TabsContent value="publications" className="mt-0 p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-near-white">
                    Lịch sử đăng bài
                  </h2>
                  <p className="text-sm text-muted-text mt-1">
                    Các lần đăng bài lên nền tảng và kết quả tương ứng
                  </p>
                </div>
                <Link
                  to="/dash/posts/$postId/edit"
                  params={{ postId: post.postId }}
                >
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Send className="size-3.5" />
                    Thêm nền tảng
                  </Button>
                </Link>
              </div>

              <PublicationsList
                publications={publications}
                isLoading={pubLoading}
              />
            </div>
          </TabsContent>
        </Tabs>
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
