import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { Rows3, LayoutGrid } from 'lucide-react'

interface PostsToolbarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  compact: boolean
  onCompactChange: (value: boolean) => void
}

export default function PostsToolbar({
  searchTerm,
  onSearchChange,
  compact,
  onCompactChange,
}: PostsToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="w-full md:max-w-sm">
        <Input
          type="search"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 size-8 text-[var(--color-muted)] hover:text-[var(--color-ink)]"
        onClick={() => onCompactChange(!compact)}
        title={compact ? 'Default density' : 'Compact density'}
      >
        {compact ? <LayoutGrid size={15} /> : <Rows3 size={15} />}
      </Button>
    </div>
  )
}
