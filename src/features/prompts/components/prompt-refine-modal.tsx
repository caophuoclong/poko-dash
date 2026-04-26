import * as React from 'react'
import { GitBranch, Loader2, X, Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import { Textarea } from '#/components/ui/textarea'
import { Input } from '#/components/ui/input'
import { useRefinePrompt } from '../hooks/use-prompts'
import type { Prompt, PromptRole } from '../types'

function extractVariables(template: string): string[] {
  const matches = template.match(/\{\{(\w+)\}\}/g) ?? []
  return [...new Set(matches.map((m) => m.slice(2, -2)))]
}

function decodeTemplate(raw: string): string {
  return raw.replace(/\\n/g, '\n').replace(/\\t/g, '\t')
}

interface PromptRefineModalProps {
  prompt: Prompt | null
  open: boolean
  onClose: () => void
}

export default function PromptRefineModal({
  prompt,
  open,
  onClose,
}: PromptRefineModalProps) {
  const [template, setTemplate] = React.useState('')
  const [name, setName] = React.useState('')
  const [role, setRole] = React.useState<PromptRole>('user')
  const [tags, setTags] = React.useState<string[]>([])
  const [tagInput, setTagInput] = React.useState('')
  const refinePrompt = useRefinePrompt()

  React.useEffect(() => {
    if (!prompt) return
    setTemplate(decodeTemplate(prompt.template))
    setName(prompt.name)
    setRole(prompt.role ?? 'user')
    setTags(prompt.tags ?? [])
  }, [prompt])

  const detectedVars = React.useMemo(
    () => extractVariables(template),
    [template],
  )

  function addTag() {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t])
    setTagInput('')
  }

  async function handleSubmit() {
    if (!prompt) return
    const changes: Record<string, unknown> = {}
    if (name !== prompt.name) changes.name = name
    if (template !== prompt.template) {
      changes.template = template
      changes.variables = detectedVars
    }
    if (role !== (prompt.role ?? 'user')) changes.role = role
    const tagsChanged =
      JSON.stringify([...tags].sort()) !==
      JSON.stringify([...(prompt.tags ?? [])].sort())
    if (tagsChanged) changes.tags = tags

    await refinePrompt.mutateAsync({
      promptId: prompt.promptId,
      data: { changes },
    })
    onClose()
  }

  if (!prompt) return null

  const selectClass =
    'w-full bg-surface-2 border border-frost rounded-md px-3 py-2 text-sm text-near-white focus:outline-none focus:ring-1 focus:ring-accent-blue'

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl bg-surface border-frost text-near-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-near-white">
            <GitBranch className="size-4 text-accent-blue" />
            Refine Prompt — creates v{prompt.version + 1}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-muted-text uppercase tracking-wider mb-1.5 block">
              Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-surface-2 border-frost text-near-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-text uppercase tracking-wider mb-1.5 block">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as PromptRole)}
              className={selectClass}
            >
              <option value="user">User — Task / instruction</option>
              <option value="system">System — Behavior / context</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-text uppercase tracking-wider mb-1.5 block">
              Template
            </label>
            <Textarea
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              rows={6}
              className="bg-surface-2 border-frost text-near-white font-mono text-sm resize-none"
            />
            {detectedVars.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="text-xs text-muted-text">Variables:</span>
                {detectedVars.map((v) => (
                  <span
                    key={v}
                    className="text-xs px-1.5 py-0.5 rounded bg-accent-blue-dim text-accent-blue font-mono border border-accent-blue/20"
                  >
                    {`{{${v}}}`}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-text uppercase tracking-wider mb-1.5 block">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addTag()
                  }
                }}
                placeholder="Add tag and press Enter"
                className="bg-surface-2 border-frost text-near-white placeholder:text-muted-text flex-1"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addTag}
                className="border-frost text-muted-text"
              >
                <Plus className="size-3.5" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-surface-2 text-muted-text border border-frost"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => setTags((p) => p.filter((t) => t !== tag))}
                      className="hover:text-accent-red transition-colors"
                    >
                      <X className="size-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
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
            disabled={refinePrompt.isPending}
          >
            {refinePrompt.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Creating version…
              </>
            ) : (
              <>
                <GitBranch className="size-4" /> Create v{prompt.version + 1}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
