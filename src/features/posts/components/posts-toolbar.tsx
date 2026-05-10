import { Input } from '#/components/ui/input'

interface PostsToolbarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
}

export default function PostsToolbar({
  searchTerm,
  onSearchChange,
}: PostsToolbarProps) {
  return (
    <div className="w-full md:max-w-sm">
      <Input
        type="search"
        placeholder="Tìm kiếm bài viết..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full"
      />
    </div>
  )
}
