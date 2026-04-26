import * as React from 'react'
import { X, Plus, Loader2 } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'
import { useCreatePrompt, useUpdatePrompt } from '../hooks/use-prompts'
import type {
  Prompt,
  PromptType,
  PromptCategory,
  PromptStatus,
  PromptRole,
  CreatePromptRequest,
} from '../types/prompt'
import { cn } from '#/shared/utils'

const PROMPT_TYPES: { value: PromptType; label: string }[] = [
  { value: 'content_generation', label: 'Content Generation' },
  { value: 'analysis', label: 'Analysis' },
  { value: 'refinement', label: 'Refinement' },
  { value: 'custom', label: 'Custom' },
]

const PROMPT_CATEGORIES: { value: PromptCategory; label: string }[] = [
  { value: 'social_media', label: 'Social Media' },
  { value: 'blog', label: 'Blog' },
  { value: 'video', label: 'Video' },
  { value: 'email', label: 'Email' },
  { value: 'general', label: 'General' },
]

const PROMPT_STATUSES: { value: PromptStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
]

const PROMPT_ROLES: {
  value: PromptRole
  label: string
  description: string
}[] = [
  { value: 'user', label: 'User', description: 'Task / instruction prompt' },
  {
    value: 'system',
    label: 'System',
    description: 'Behavior / context prompt',
  },
]

function extractVariables(template: string): string[] {
  const matches = template.match(/\{\{(\w+)\}\}/g) ?? []
  return [...new Set(matches.map((m) => m.slice(2, -2)))]
}

function decodeTemplate(raw: string): string {
  return raw.replace(/\\n/g, '\n').replace(/\\t/g, '\t')
}

interface PromptFormProps {
  prompt?: Prompt
  onSuccess: () => void
  onCancel: () => void
}

export default function PromptForm({
  prompt,
  onSuccess,
  onCancel,
}: PromptFormProps) {
  const isEdit = !!prompt
  const createPrompt = useCreatePrompt()
  const updatePrompt = useUpdatePrompt()

  const [name, setName] = React.useState(prompt?.name ?? '')
  const [description, setDescription] = React.useState(
    prompt?.description ?? '',
  )
  const [promptType, setPromptType] = React.useState<PromptType>(
    prompt?.promptType ?? 'content_generation',
  )
  const [role, setRole] = React.useState<PromptRole>(prompt?.role ?? 'user')
  const [category, setCategory] = React.useState<PromptCategory>(
    prompt?.category ?? 'general',
  )
  const [status, setStatus] = React.useState<PromptStatus>(
    prompt?.status ?? 'active',
  )
  const [template, setTemplate] = React.useState(
    decodeTemplate(prompt?.template ?? ''),
  )
  const [tags, setTags] = React.useState<string[]>(prompt?.tags ?? [])
  const [tagInput, setTagInput] = React.useState('')
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const detectedVars = React.useMemo(
    () => extractVariables(template),
    [template],
  )

  function validate() {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Name is required'
    if (!template.trim()) errs.template = 'Template is required'
    return errs
  }

  async function handleSubmit(submitStatus: PromptStatus) {
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})

    const data: CreatePromptRequest = {
      name: name.trim(),
      description: description.trim() || undefined,
      promptType,
      role,
      category,
      template: template.trim(),
      variables: detectedVars,
      tags: tags.length > 0 ? tags : undefined,
      status: submitStatus,
    }

    if (isEdit && prompt) {
      await updatePrompt.mutateAsync({ promptId: prompt.promptId, data })
    } else {
      await createPrompt.mutateAsync(data)
    }
    onSuccess()
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t])
    setTagInput('')
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag))
  }

  const isPending = createPrompt.isPending || updatePrompt.isPending

  const selectClass =
    'w-full bg-surface-2 border border-frost rounded-md px-3 py-2 text-sm text-near-white focus:outline-none focus:ring-1 focus:ring-accent-blue'

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-near-white">
          {isEdit ? 'Edit Prompt' : 'Create New Prompt'}
        </h2>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onCancel}
          className="text-muted-text"
        >
          <X />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="text-xs font-semibold text-muted-text uppercase tracking-wider mb-1.5 block">
            Name <span className="text-accent-red">*</span>
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Instagram Product Review"
            className={cn(
              'bg-surface-2 border-frost text-near-white placeholder:text-muted-text',
              errors.name && 'border-accent-red',
            )}
          />
          {errors.name && (
            <p className="text-xs text-accent-red mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-text uppercase tracking-wider mb-1.5 block">
            Description
          </label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of what this prompt does"
            className="bg-surface-2 border-frost text-near-white placeholder:text-muted-text"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-muted-text uppercase tracking-wider mb-1.5 block">
              Type <span className="text-accent-red">*</span>
            </label>
            <select
              value={promptType}
              onChange={(e) => setPromptType(e.target.value as PromptType)}
              className={selectClass}
            >
              {PROMPT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-text uppercase tracking-wider mb-1.5 block">
              Category <span className="text-accent-red">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as PromptCategory)}
              className={selectClass}
            >
              {PROMPT_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-text uppercase tracking-wider mb-1.5 block">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as PromptStatus)}
              className={selectClass}
            >
              {PROMPT_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-text uppercase tracking-wider mb-1.5 block">
            Role
          </label>
          <div className="flex gap-3">
            {PROMPT_ROLES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={cn(
                  'flex-1 flex flex-col items-start px-4 py-3 rounded-xl border text-left transition-colors',
                  role === r.value
                    ? 'border-accent-blue bg-accent-blue-dim text-near-white'
                    : 'border-frost bg-surface-2 text-muted-text hover:border-accent-blue/40',
                )}
              >
                <span className="text-sm font-semibold">{r.label}</span>
                <span className="text-xs mt-0.5 opacity-70">
                  {r.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-text uppercase tracking-wider mb-1.5 block">
            Template <span className="text-accent-red">*</span>
          </label>
          <Textarea
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            placeholder={
              'Use {{variable_name}} for dynamic values.\n\nExample: Write a review for {{product}} targeting {{audience}}…'
            }
            rows={6}
            className={cn(
              'bg-surface-2 border-frost text-near-white placeholder:text-muted-text font-mono text-sm resize-none',
              errors.template && 'border-accent-red',
            )}
          />
          {errors.template && (
            <p className="text-xs text-accent-red mt-1">{errors.template}</p>
          )}
          {detectedVars.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-xs text-muted-text">Auto-detected:</span>
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
              placeholder="Add a tag and press Enter"
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
                    onClick={() => removeTag(tag)}
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

      <div className="flex items-center justify-between gap-3 pt-2 border-t border-frost">
        <Button
          variant="outline"
          onClick={onCancel}
          className="border-frost text-muted-text"
        >
          Cancel
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleSubmit('draft')}
            disabled={isPending}
            className="border-frost text-muted-text"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              'Save as Draft'
            )}
          </Button>
          <Button
            color="blue"
            onClick={() => handleSubmit('active')}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Saving…
              </>
            ) : isEdit ? (
              'Update Prompt'
            ) : (
              'Publish Prompt'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
