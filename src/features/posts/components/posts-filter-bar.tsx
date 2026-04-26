import { Autocomplete } from '#/components/ui/autocomplete'
import type { AutocompleteOption } from '#/components/ui/autocomplete'

interface PostsFilterBarProps {
  platforms: AutocompleteOption[]
  statuses: AutocompleteOption[]
  selectedPlatform?: string
  selectedStatus?: string
  onPlatformChange: (value: string | undefined) => void
  onStatusChange: (value: string | undefined) => void
}

export default function PostsFilterBar({
  platforms,
  statuses,
  selectedPlatform,
  selectedStatus,
  onPlatformChange,
  onStatusChange,
}: PostsFilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <Autocomplete
        options={platforms}
        value={platforms.find((p) => p.value === selectedPlatform) || null}
        onChange={(option) => onPlatformChange(option?.value)}
        placeholder="Tất cả nền tảng"
        className="w-48"
      />
      <Autocomplete
        options={statuses}
        value={statuses.find((s) => s.value === selectedStatus) || null}
        onChange={(option) => onStatusChange(option?.value)}
        placeholder="Tất cả trạng thái"
        className="w-48"
      />
    </div>
  )
}
