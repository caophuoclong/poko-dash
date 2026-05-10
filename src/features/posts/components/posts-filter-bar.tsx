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
    <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <Autocomplete
        options={platforms}
        value={platforms.find((p) => p.value === selectedPlatform) || null}
        onChange={(option) => onPlatformChange(option?.value)}
        placeholder="Tất cả nền tảng"
        className="w-full"
      />
      <Autocomplete
        options={statuses}
        value={statuses.find((s) => s.value === selectedStatus) || null}
        onChange={(option) => onStatusChange(option?.value)}
        placeholder="Tất cả trạng thái"
        className="w-full"
      />
      <Autocomplete
        options={ideas}
        value={ideas.find((i) => i.value === selectedIdea) || null}
        onChange={(option) => onIdeaChange(option?.value)}
        placeholder="Tất cả ý tưởng"
        className="w-full sm:col-span-2 lg:col-span-1"
      />
    </div>
  )
}
