import * as React from 'react'
import { Star, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import { useRatePrompt } from '../hooks/use-prompts'
import type { Prompt } from '../types'
import { cn } from '#/shared/utils'

interface PromptRateModalProps {
  prompt: Prompt | null
  open: boolean
  onClose: () => void
}

export default function PromptRateModal({
  prompt,
  open,
  onClose,
}: PromptRateModalProps) {
  const [rating, setRating] = React.useState(0)
  const [hovered, setHovered] = React.useState(0)
  const ratePrompt = useRatePrompt()

  React.useEffect(() => {
    if (prompt?.avgRating) setRating(Math.round(prompt.avgRating))
  }, [prompt])

  async function handleSubmit() {
    if (!prompt || rating === 0) return
    await ratePrompt.mutateAsync({
      promptId: prompt.promptId,
      data: { rating },
    })
    onClose()
  }

  if (!prompt) return null

  const display = hovered || rating

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm bg-surface border-frost text-near-white">
        <DialogHeader>
          <DialogTitle className="text-near-white">Rate Prompt</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-2">
          <p className="text-sm text-muted-text text-center">
            How useful is{' '}
            <span className="text-near-white font-medium">{prompt.name}</span>?
          </p>

          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={cn(
                    'size-8 transition-colors',
                    star <= display
                      ? 'text-accent-yellow fill-accent-yellow'
                      : 'text-muted-text',
                  )}
                />
              </button>
            ))}
          </div>

          <p className="text-sm font-medium text-near-white h-5">
            {display === 1 && 'Poor'}
            {display === 2 && 'Fair'}
            {display === 3 && 'Good'}
            {display === 4 && 'Great'}
            {display === 5 && 'Excellent'}
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-frost text-muted-text"
          >
            Cancel
          </Button>
          <Button
            color="blue"
            onClick={handleSubmit}
            disabled={rating === 0 || ratePrompt.isPending}
          >
            {ratePrompt.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Submitting…
              </>
            ) : (
              'Submit Rating'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
