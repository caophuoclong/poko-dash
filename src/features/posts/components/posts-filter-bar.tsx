import { Autocomplete } from '#/components/ui/autocomplete'
import type { AutocompleteOption } from '#/components/ui/autocomplete'

interface PostsFilterBarProps {
  platforms: AutocompleteOption[]
  statuses: AutocompleteOption[]
  ideas: AutocompleteOption[]
  selectedPlatform?: string
  selectedStatus?: string
  selectedIdea?: string
  onPlatformChange: (value: string | undefined) => void
  onStatusChange: (value: string | undefined) => void
  onIdeaChange: (value: string | undefined) => void
}

export default function PostsFilterBar({
  platforms,
  statuses,
  ideas,
  selectedPlatform,
  selectedStatus,
  selectedIdea,
  onPlatformChange,
  onStatusChange,
  onIdeaChange,
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
      <Autocomplete
        options={ideas}
        value={ideas.find((i) => i.value === selectedIdea) || null}
        onChange={(option) => onIdeaChange(option?.value)}
        placeholder="Tất cả ý tưởng"
        className="w-64"
      />
    </div>
  )
}
