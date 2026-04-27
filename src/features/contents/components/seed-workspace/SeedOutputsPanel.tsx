import { FileText, Eye, Calendar, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState, emptyStatePresets } from '@/components/ui/empty-state'
import { formatRelativeTime } from '#/shared/utils'

interface GeneratedPost {
  postId: string
  title: string
  productId: string
  productName: string
  status: 'draft' | 'scheduled' | 'published'
  createdAt: string
}

interface ProductOutputGroup {
  productId: string
  productName: string
  posts: GeneratedPost[]
}

interface SeedOutputsPanelProps {
  totalPosts: number
  posts: GeneratedPost[]
  groups?: ProductOutputGroup[]
  onViewPost: (postId: string) => void
  onViewAllPosts: () => void
}

const STATUS_CONFIG = {
  draft: { label: 'Draft', tone: 'blue' as const },
  scheduled: { label: 'Scheduled', tone: 'yellow' as const },
  published: { label: 'Published', tone: 'green' as const },
}

export function SeedOutputsPanel({
  totalPosts,
  posts,
  groups,
  onViewPost,
  onViewAllPosts,
}: SeedOutputsPanelProps) {
  const recentPosts = posts.slice(0, 5)

  const getStatusBadge = (status: GeneratedPost['status']) => {
    const config = STATUS_CONFIG[status]
    return (
      <Badge tone={config.tone} size="sm">
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-near-white">
            Generated Output
          </h2>
          <p className="text-sm text-muted-text mt-1">
            Posts created from this seed, organized by product.
          </p>
        </div>
        {totalPosts > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onViewAllPosts}
            className="text-accent-blue border-accent-blue/30 hover:bg-accent-blue/10"
          >
            <FileText size={16} className="mr-1.5" />
            View All ({totalPosts})
          </Button>
        )}
      </div>

      {totalPosts === 0 ? (
        <div className="bg-surface-2/30 border border-frost rounded-xl p-8">
          <EmptyState
            variant="card"
            {...emptyStatePresets.noGeneratedPosts}
            className="py-6"
          />
        </div>
      ) : (
        <>
          {groups && groups.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-near-white">
                Output by Product
              </h3>
              {groups.map((group) => (
                <div
                  key={group.productId}
                  className="bg-surface-2/50 border border-frost rounded-xl overflow-hidden"
                >
                  <div className="px-4 py-3 bg-surface-2 border-b border-frost flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-near-white">
                        {group.productName}
                      </span>
                      <Badge tone="neutral" size="sm" variant="outline">
                        {group.posts.length} post
                        {group.posts.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </div>
                  <div className="divide-y divide-frost">
                    {group.posts.map((post) => (
                      <div
                        key={post.postId}
                        className="p-4 hover:bg-surface-3 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-near-white mb-1 truncate">
                              {post.title}
                            </h4>
                            <div className="flex items-center gap-3 text-xs text-muted-text">
                              <div className="flex items-center gap-1">
                                <Calendar size={12} />
                                <span>
                                  {formatRelativeTime(post.createdAt)}
                                </span>
                              </div>
                              {getStatusBadge(post.status)}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewPost(post.postId)}
                            className="text-accent-blue hover:text-accent-blue-light shrink-0"
                          >
                            <Eye size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="bg-surface-2/50 border border-frost rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-surface-2 border-b border-frost">
              <h3 className="text-sm font-medium text-near-white">
                Latest Generated
              </h3>
            </div>
            <div className="divide-y divide-frost">
              {recentPosts.map((post) => (
                <div
                  key={post.postId}
                  className="p-4 hover:bg-surface-3 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-near-white mb-1 truncate">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-muted-text mb-1">
                        <span>{post.productName}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>{formatRelativeTime(post.createdAt)}</span>
                        </div>
                      </div>
                      {getStatusBadge(post.status)}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewPost(post.postId)}
                      className="text-accent-blue hover:text-accent-blue-light shrink-0"
                    >
                      <Eye size={14} className="mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {totalPosts > 5 && (
            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={onViewAllPosts}
                className="text-accent-blue hover:text-accent-blue-light"
              >
                View all {totalPosts} posts
                <ArrowRight size={14} className="ml-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
