import { Calendar, Clock, User, Hash, FileText } from 'lucide-react'

interface SeedMetadataPanelProps {
  ideaId: string
  createdAt: string
  updatedAt: string
  owner?: string
  sourceRefs?: string[]
  postCount?: number
}

export function SeedMetadataPanel({
  ideaId,
  createdAt,
  updatedAt,
  owner,
  sourceRefs,
  postCount = 0,
}: SeedMetadataPanelProps) {
  const formatId = (id: string) => `${id.slice(0, 8)}…${id.slice(-4)}`
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 8640000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return formatDate(dateString)
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-near-white uppercase tracking-wider mb-4">
          Metadata
        </h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-frost/50">
            <div className="flex items-center gap-2 text-sm text-muted-text">
              <Hash size={14} />
              <span>ID</span>
            </div>
            <code className="text-xs text-near-white font-mono bg-surface-2 px-2 py-1 rounded">
              {formatId(ideaId)}
            </code>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-frost/50">
            <div className="flex items-center gap-2 text-sm text-muted-text">
              <Clock size={14} />
              <span>Created</span>
            </div>
            <div className="text-right">
              <div className="text-xs text-near-white">
                {getRelativeTime(createdAt)}
              </div>
              <div className="text-[11px] text-muted-text">
                {formatDate(createdAt)}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-frost/50">
            <div className="flex items-center gap-2 text-sm text-muted-text">
              <Calendar size={14} />
              <span>Updated</span>
            </div>
            <div className="text-right">
              <div className="text-xs text-near-white">
                {getRelativeTime(updatedAt)}
              </div>
              <div className="text-[11px] text-muted-text">
                {formatDate(updatedAt)}
              </div>
            </div>
          </div>

          {postCount > 0 && (
            <div className="flex items-center justify-between py-2 border-b border-frost/50">
              <div className="flex items-center gap-2 text-sm text-muted-text">
                <FileText size={14} />
                <span>Posts Generated</span>
              </div>
              <span className="text-sm text-near-white font-medium">
                {postCount}
              </span>
            </div>
          )}

          {owner && (
            <div className="flex items-center justify-between py-2 border-b border-frost/50">
              <div className="flex items-center gap-2 text-sm text-muted-text">
                <User size={14} />
                <span>Owner</span>
              </div>
              <span className="text-sm text-near-white">{owner}</span>
            </div>
          )}
        </div>
      </div>

      {sourceRefs && sourceRefs.length > 0 && (
        <div className="pt-4 border-t border-frost/50">
          <h3 className="text-xs font-semibold text-near-white uppercase tracking-wider mb-3">
            Source References
          </h3>
          <div className="space-y-2">
            {sourceRefs.map((ref, idx) => (
              <div
                key={idx}
                className="text-xs text-muted-text bg-surface-2 px-3 py-2 rounded-lg break-all"
              >
                {ref}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
