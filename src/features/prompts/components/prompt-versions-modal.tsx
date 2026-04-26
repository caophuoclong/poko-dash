import { History, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import { usePromptVersions } from '../hooks/use-prompts'
import type { Prompt } from '../types/prompt'

interface PromptVersionsModalProps {
  prompt: Prompt | null
  open: boolean
  onClose: () => void
  onUseVersion: (prompt: Prompt) => void
}

export default function PromptVersionsModal({
  prompt,
  open,
  onClose,
  onUseVersion,
}: PromptVersionsModalProps) {
  const { data, isLoading } = usePromptVersions(prompt?.promptId ?? '')
  const versions = data?.versions ?? []

  if (!prompt) return null

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-xl bg-surface border-frost text-near-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-near-white">
            <History className="size-4 text-accent-blue" />
            Version History: {prompt.name}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="size-5 animate-spin text-accent-blue" />
          </div>
        ) : versions.length === 0 ? (
          <p className="text-muted-text text-sm text-center py-8">
            No version history available
          </p>
        ) : (
          <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
            {versions.map((v) => (
              <div
                key={v.promptId}
                className="bg-surface-2 border border-frost rounded-xl px-4 py-3 flex items-start gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-accent-blue">
                      v{v.version}
                    </span>
                    <span className="text-xs text-muted-text">
                      {new Date(v.createdAt).toLocaleDateString()}
                    </span>
                    {v.promptId === prompt.promptId && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-accent-green-dim text-accent-green border border-accent-green-border">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-mono text-muted-text line-clamp-2">
                    {v.template}
                  </p>
                </div>
                <Button
                  size="xs"
                  color="blue-dim"
                  onClick={() => {
                    onUseVersion(v)
                    onClose()
                  }}
                >
                  Use
                </Button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
