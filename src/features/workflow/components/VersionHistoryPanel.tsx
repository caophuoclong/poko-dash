import { useCallback, useMemo } from 'react'
import { formatDistanceToNow, isToday, isYesterday, format } from 'date-fns'
import { History, RotateCcw, Loader2, X } from 'lucide-react'
import { cn } from '#/shared/utils'
import { Button } from '#/components/ui/button'
import { useWorkflowVersions } from '../hooks/use-workflows'

interface VersionItem {
  id: string
  versionNumber: number
  message: string
  versionType: 'auto' | 'manual'
  createdAt: string
}

interface VersionHistoryPanelProps {
  workflowId: string
  open: boolean
  onClose: () => void
  onRestore: (versionNumber: number) => void
  restoringVersion: number | null
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 animate-pulse">
      <div className="h-3 w-8 bg-surface-2 rounded" />
      <div className="flex-1">
        <div className="h-3 w-24 bg-surface-2 rounded mb-1.5" />
        <div className="h-2.5 w-16 bg-surface-2 rounded" />
      </div>
      <div className="h-6 w-16 bg-surface-2 rounded" />
    </div>
  )
}

function getGroupLabel(dateStr: string): string {
  const date = new Date(dateStr)
  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'
  return format(date, 'MMM dd')
}

export function VersionHistoryPanel({
  workflowId,
  open,
  onClose,
  onRestore,
  restoringVersion,
}: VersionHistoryPanelProps) {
  const { data: versions = [], isLoading } = useWorkflowVersions(workflowId)

  const formatTime = useCallback((dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
    } catch {
      return dateStr
    }
  }, [])

  const sorted = useMemo(
    () => [...versions].sort((a, b) => b.versionNumber - a.versionNumber),
    [versions],
  )

  const grouped = useMemo(() => {
    const groups: { label: string; items: VersionItem[] }[] = []
    for (const v of sorted) {
      const label = getGroupLabel(v.createdAt)
      const last = groups[groups.length - 1]
      if (last && last.label === label) {
        last.items.push(v)
      } else {
        groups.push({ label, items: [v] })
      }
    }
    return groups
  }, [sorted])

  if (!open) return null

  return (
    <div
      className={cn(
        'w-[300px] shrink-0 border-l border-frost bg-surface flex flex-col h-full',
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-frost shrink-0">
        <div className="flex items-center gap-2">
          <History size={14} className="text-muted-text" />
          <h3 className="text-xs font-semibold text-near-white">Versions</h3>
          {!isLoading && (
            <span className="text-[10px] text-muted-text">
              {versions.length}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded text-muted-text hover:text-near-white hover:bg-surface-2 transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="py-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        )}

        {!isLoading && sorted.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <p className="text-xs text-muted-text">No versions yet</p>
          </div>
        )}

        {!isLoading &&
          grouped.map((group) => (
            <div key={group.label}>
              <div className="px-4 py-2 bg-surface-2/50 border-b border-frost/30">
                <span className="text-[10px] font-medium text-muted-text">
                  {group.label}
                </span>
              </div>
              {group.items.map((version) => (
                <div
                  key={version.id}
                  className="flex items-center gap-3 px-4 py-2.5 border-b border-frost/50 hover:bg-surface-2 transition-colors"
                >
                  <div className="text-[10px] font-mono font-semibold text-accent-blue w-8 shrink-0">
                    v{version.versionNumber}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        'text-[11px] truncate',
                        version.versionType === 'manual'
                          ? 'text-near-white font-medium'
                          : 'text-muted-text',
                      )}
                    >
                      {version.versionType === 'auto'
                        ? 'Auto-save'
                        : version.message || 'Manual save'}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <p className="text-[10px] text-muted-text">
                        {formatTime(version.createdAt)}
                      </p>
                      {version.versionType === 'manual' && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-accent-purple/15 text-accent-purple font-medium">
                          Manual
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    size="xs"
                    variant="ghost"
                    className="text-[10px] h-6 text-accent-blue hover:text-accent-blue/80"
                    onClick={() => onRestore(version.versionNumber)}
                    disabled={restoringVersion === version.versionNumber}
                  >
                    {restoringVersion === version.versionNumber ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <RotateCcw size={12} />
                    )}
                    <span className="ml-1">Restore</span>
                  </Button>
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  )
}
