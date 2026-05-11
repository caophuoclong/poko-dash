import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import { Checkbox } from '#/components/ui/checkbox'
import { Loader2, AlertCircle, CheckCircle2  } from 'lucide-react'
import { LoadingState } from '#/components/ui/loading-state'
import { cn } from '#/shared/utils'
import type { AvailableTarget, Provider  } from '../types'

interface AvailableTargetsDialogProps {
  open: boolean
  provider: Provider | null
  providerName: string
  targetLabelPlural: string
  targets: AvailableTarget[] | null
  isLoading: boolean
  isError: boolean
  isSubmitting: boolean
  errorMessage?: string
  onConfirm: (selectedIds: string[]) => void
  onCancel: () => void
  onRetry: () => void
}

export function AvailableTargetsDialog({
  open,
  providerName,
  targetLabelPlural,
  targets,
  isLoading,
  isError,
  isSubmitting,
  errorMessage,
  onConfirm,
  onCancel,
  onRetry,
}: AvailableTargetsDialogProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const toggleTarget = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleConfirm = () => {
    if (selectedIds.size === 0) return
    onConfirm(Array.from(selectedIds))
    setSelectedIds(new Set())
  }

  const handleCancel = () => {
    setSelectedIds(new Set())
    onCancel()
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="max-w-lg" showCloseButton={!isSubmitting}>
        <DialogHeader>
          <DialogTitle>
            {isLoading
              ? `Loading ${targetLabelPlural}...`
              : isError
                ? 'Connection Error'
                : `Select ${targetLabelPlural} to Add`}
          </DialogTitle>
          <DialogDescription>
            {isLoading
              ? `Fetching available ${targetLabelPlural.toLowerCase()} from ${providerName}...`
              : isError
                ? (errorMessage ??
                  `Failed to load ${targetLabelPlural.toLowerCase()}. Please try again.`)
                : `Connected to ${providerName}, now choose the ${targetLabelPlural.toLowerCase()} you want to publish from Poko.`}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-12">
            <LoadingState
              variant="block"
              label={`Loading ${targetLabelPlural.toLowerCase()}...`}
            />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-accent-red/10">
              <AlertCircle className="size-6 text-accent-red" />
            </div>
            <p className="text-sm text-muted-text">
              Something went wrong while fetching your{' '}
              {targetLabelPlural.toLowerCase()}.
            </p>
            <Button color="blue" onClick={onRetry}>
              Try Again
            </Button>
          </div>
        ) : targets && targets.length > 0 ? (
          <div className="max-h-80 space-y-2 overflow-y-auto py-2">
            {targets.map((target) => (
              <label
                key={target.targetId}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors hover:border-accent-blue/30',
                  selectedIds.has(target.targetId)
                    ? 'border-accent-blue/40 bg-accent-blue-dim/10'
                    : 'border-frost bg-surface',
                )}
              >
                <Checkbox
                  checked={selectedIds.has(target.targetId)}
                  onCheckedChange={() => toggleTarget(target.targetId)}
                  disabled={isSubmitting}
                />
                {target.avatar ? (
                  <img
                    src={target.avatar}
                    alt={target.name}
                    className="size-9 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-2 text-xs font-medium text-muted-text uppercase">
                    {target.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-near-white">
                    {target.name}
                  </p>
                  <p className="text-xs capitalize text-muted-text">
                    {target.type}
                  </p>
                </div>
                {selectedIds.has(target.targetId) ? (
                  <CheckCircle2 className="size-4 shrink-0 text-accent-green" />
                ) : null}
              </label>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-sm text-muted-text">
              No {targetLabelPlural.toLowerCase()} found for this {providerName}{' '}
              account.
            </p>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        )}

        {targets && targets.length > 0 && !isError ? (
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                disabled={isSubmitting}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              color="blue"
              disabled={selectedIds.size === 0 || isSubmitting}
              onClick={handleConfirm}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Adding...
                </>
              ) : (
                <>Add{selectedIds.size > 0 ? ` (${selectedIds.size})` : ''}</>
              )}
            </Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
