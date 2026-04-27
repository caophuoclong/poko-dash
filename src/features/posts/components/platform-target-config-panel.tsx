import type { Control } from 'react-hook-form'
import { PLATFORM_META } from '../types/publication'
import type {
  PlatformTargetConfig,
  PublicationPlatform,
} from '../types/publication'
import { Button } from '#/components/ui/button'
import { Plus, X, GripVertical } from 'lucide-react'
import type {
  ContentPostCreateFormData,
  ContentPostEditFormData,
} from '#/features/posts/schemas/content-post.schema'

const AVAILABLE_PLATFORMS = Object.keys(PLATFORM_META) as PublicationPlatform[]

interface PlatformTargetRowProps {
  config: PlatformTargetConfig
  index: number
  onUpdate: (index: number, config: PlatformTargetConfig) => void
  onRemove: (index: number) => void
}

function PlatformTargetRow({
  config,
  index,
  onUpdate,
  onRemove,
}: PlatformTargetRowProps) {
  const meta = PLATFORM_META[config.platform]

  return (
    <div className="flex items-center gap-3 p-3 bg-surface-2/50 rounded-xl border border-frost/50">
      <GripVertical className="size-4 text-muted-text shrink-0 cursor-grab" />

      <span
        className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border shrink-0 ${meta.colorClass}`}
      >
        {meta.label}
      </span>

      <input
        type="text"
        placeholder="ID trang / tài khoản"
        value={config.targetId}
        onChange={(e) =>
          onUpdate(index, { ...config, targetId: e.target.value })
        }
        className="flex-1 min-w-0 bg-surface border border-frost rounded-lg px-3 py-1.5 text-sm text-near-white placeholder:text-muted-text focus:outline-none focus:ring-1 focus:ring-accent-blue"
      />

      <input
        type="text"
        placeholder="Tên hiển thị"
        value={config.targetName}
        onChange={(e) =>
          onUpdate(index, { ...config, targetName: e.target.value })
        }
        className="flex-1 min-w-0 bg-surface border border-frost rounded-lg px-3 py-1.5 text-sm text-near-white placeholder:text-muted-text focus:outline-none focus:ring-1 focus:ring-accent-blue"
      />

      <label className="flex items-center gap-1.5 shrink-0 cursor-pointer">
        <input
          type="checkbox"
          checked={config.enabled}
          onChange={(e) =>
            onUpdate(index, { ...config, enabled: e.target.checked })
          }
          className="rounded border-frost bg-surface text-accent-blue focus:ring-accent-blue"
        />
        <span className="text-xs text-muted-text">Bật</span>
      </label>

      <button
        type="button"
        onClick={() => onRemove(index)}
        className="shrink-0 text-muted-text hover:text-accent-red transition-colors"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}

interface PlatformTargetConfigPanelProps {
  control: Control<ContentPostEditFormData | ContentPostCreateFormData>
  targets: PlatformTargetConfig[]
  onTargetsChange: (targets: PlatformTargetConfig[]) => void
}

export default function PlatformTargetConfigPanel({
  targets,
  onTargetsChange,
}: PlatformTargetConfigPanelProps) {
  const usedPlatforms = new Set(targets.map((t) => t.platform))

  const handleAdd = () => {
    const nextPlatform = AVAILABLE_PLATFORMS.find(
      (p) => !usedPlatforms.has(p),
    )
    if (!nextPlatform) return

    onTargetsChange([
      ...targets,
      {
        platform: nextPlatform,
        targetId: '',
        targetName: '',
        enabled: true,
      },
    ])
  }

  const handleUpdate = (index: number, config: PlatformTargetConfig) => {
    const next = [...targets]
    next[index] = config
    onTargetsChange(next)
  }

  const handleRemove = (index: number) => {
    onTargetsChange(targets.filter((_, i) => i !== index))
  }

  const allUsed = usedPlatforms.size >= AVAILABLE_PLATFORMS.length

  return (
    <div className="bg-surface border border-frost rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-near-white">
          Nền tảng mục tiêu
        </h3>
        {!allUsed && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAdd}
            className="h-7 gap-1.5 text-xs"
          >
            <Plus className="size-3" />
            Thêm
          </Button>
        )}
      </div>

      {targets.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-frost rounded-xl">
          <p className="text-sm text-muted-text mb-3">
            Chưa thêm nền tảng nào
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAdd}
            className="gap-1.5"
          >
            <Plus className="size-3.5" />
            Thêm nền tảng đầu tiên
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {targets.map((config, index) => (
            <PlatformTargetRow
              key={`${config.platform}-${index}`}
              config={config}
              index={index}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  )
}
