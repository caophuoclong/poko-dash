import { useCallback, useState } from 'react'
import { useUpdateContentPost } from '../../hooks/use-content-posts'
import { statusOptions } from '../post-edit-page/constants'
import { getStatusMeta, POST_STATUS } from '#/shared/constants'
import { Badge } from '#/components/ui/badge'

export function StatusCell({
  postId,
  status,
}: {
  postId: string
  status: string
}) {
  const [open, setOpen] = useState(false)
  const updatePost = useUpdateContentPost()

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
      e.stopPropagation()
      const newStatus = e.target.value
      await updatePost.mutateAsync({ postId, data: { status: newStatus } })
      setOpen(false)
    },
    [postId, updatePost],
  )

  if (open) {
    return (
      <select
        autoFocus
        value={status}
        onChange={handleChange}
        onBlur={() => setOpen(false)}
        onClick={(e) => e.stopPropagation()}
        className="text-xs bg-surface-2 border border-frost rounded-full px-2.5 py-1 text-near-white focus:outline-none focus:ring-1 focus:ring-accent-blue cursor-pointer"
      >
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    )
  }

  const meta = getStatusMeta(POST_STATUS, status)
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        setOpen(true)
      }}
      title="Nhấn để thay đổi trạng thái"
      className="cursor-pointer hover:opacity-80 transition-opacity"
    >
      <Badge tone={meta.tone}>{meta.label}</Badge>
    </button>
  )
}
