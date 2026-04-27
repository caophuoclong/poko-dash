import { Check } from 'lucide-react'
import { Button } from '../ui/button'

interface RowEditActionsProps {
  onCancel: () => void
  onSave: () => void
  saveLabel?: string
  cancelLabel?: string
  saveDisabled?: boolean
}

export function RowEditActions({
  onCancel,
  onSave,
  saveLabel = 'Save',
  cancelLabel = 'Cancel',
  saveDisabled = false,
}: RowEditActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      <Button
        onClick={onCancel}
        size="sm"
        variant="outline"
        // className="px-2.5 py-1 rounded-md text-xs font-medium text-muted-text hover:text-near-white hover:bg-surface-2 transition-colors"
      >
        {cancelLabel}
      </Button>
      <Button
        onClick={onSave}
        disabled={saveDisabled}
        size="sm"

        // className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-accent-blue text-near-white hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100"
      >
        <Check size={11} />
        {saveLabel}
      </Button>
    </div>
  )
}
