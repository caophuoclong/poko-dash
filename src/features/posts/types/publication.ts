export type PublicationStatus =
  | 'pending'
  | 'scheduled'
  | 'publishing'
  | 'published'
  | 'failed'
  | 'cancelled'

export type PublicationPlatform =
  | 'facebook'
  | 'tiktok'
  | 'instagram'
  | 'youtube'
  | 'twitter'
  | 'blog'

export interface PublicationRecord {
  publicationId: string
  postId: string
  platform: PublicationPlatform
  targetId: string
  targetName: string
  status: PublicationStatus
  externalPostId?: string
  externalUrl?: string
  publishedAt?: string
  scheduledAt?: string
  errorMessage?: string
  errorCode?: string
  retryCount: number
  canRetry: boolean
  createdAt: string
  updatedAt: string
}

export type PostCompositeStatus =
  | 'draft'
  | 'scheduled'
  | 'publishing'
  | 'published'
  | 'partially_published'
  | 'failed'

export interface PlatformTargetConfig {
  platform: PublicationPlatform
  targetId: string
  targetName: string
  enabled: boolean
}

export const PUBLICATION_STATUS_META: Record<
  PublicationStatus,
  { label: string; tone: 'neutral' | 'blue' | 'green' | 'red' | 'orange' | 'yellow' }
> = {
  pending: { label: 'Chờ xử lý', tone: 'neutral' },
  scheduled: { label: 'Đã lên lịch', tone: 'blue' },
  publishing: { label: 'Đang đăng', tone: 'yellow' },
  published: { label: 'Đã đăng', tone: 'green' },
  failed: { label: 'Thất bại', tone: 'red' },
  cancelled: { label: 'Đã hủy', tone: 'neutral' },
}

export const PLATFORM_META: Record<
  PublicationPlatform,
  { label: string; colorClass: string }
> = {
  facebook: { label: 'Facebook', colorClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  tiktok: { label: 'TikTok', colorClass: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
  instagram: { label: 'Instagram', colorClass: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  youtube: { label: 'YouTube', colorClass: 'bg-red-500/10 text-red-400 border-red-500/20' },
  twitter: { label: 'Twitter', colorClass: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  blog: { label: 'Blog', colorClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
}

export function getCompositeStatus(
  publications: PublicationRecord[],
): PostCompositeStatus {
  if (publications.length === 0) return 'draft'

  const statuses = new Set(publications.map((p) => p.status))
  const nonCancelled = publications.filter((p) => p.status !== 'cancelled')

  if (nonCancelled.length === 0) return 'draft'
  if (statuses.has('publishing')) return 'publishing'
  if (statuses.has('failed') && statuses.has('published'))
    return 'partially_published'
  if (statuses.has('failed')) return 'failed'
  if (nonCancelled.every((p) => p.status === 'published')) return 'published'
  if (statuses.has('scheduled') || statuses.has('pending')) return 'scheduled'

  return 'draft'
}

export const COMPOSITE_STATUS_META: Record<
  PostCompositeStatus,
  { label: string; tone: 'neutral' | 'blue' | 'green' | 'red' | 'orange' | 'yellow' }
> = {
  draft: { label: 'Nháp', tone: 'neutral' },
  scheduled: { label: 'Đã lên lịch', tone: 'blue' },
  publishing: { label: 'Đang đăng', tone: 'yellow' },
  published: { label: 'Đã đăng', tone: 'green' },
  partially_published: { label: 'Đăng một phần', tone: 'orange' },
  failed: { label: 'Thất bại', tone: 'red' },
}
