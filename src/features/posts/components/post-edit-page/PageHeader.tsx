import { Button } from '#/components/ui/button'
import { Link } from '@tanstack/react-router'
import { statusOptions } from './constants'

interface PageHeaderProps {
  postId: string
  status: string
  hasUnsavedChanges: boolean
  isSaving: boolean
}

export default function PageHeader({
  postId,
  status,
  hasUnsavedChanges,
  isSaving,
}: PageHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-surface -mx-4 -mt-4 pt-4 px-4 flex items-center justify-between mb-6">
      <Link
        to="/dash/posts/$postId"
        params={{ postId }}
        className="inline-flex items-center gap-2 text-sm text-muted-text hover:text-near-white transition-colors"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M10 12L6 8L10 4" />
        </svg>
        Quay lại
      </Link>

      <div className="flex items-center gap-3">
        {hasUnsavedChanges && (
          <span className="text-xs text-accent-orange">
            • Có thay đổi chưa lưu
          </span>
        )}
        <span className="text-sm text-muted-text">
          {statusOptions.find((s) => s.value === status)?.label}
        </span>
        <Button type="submit" disabled={isSaving || !hasUnsavedChanges}>
          {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </div>
    </div>
  )
}
