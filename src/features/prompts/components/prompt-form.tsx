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
} from '../types'
import { cn } from '#/shared/utils'

import {
  PROMPT_TYPES,
  PROMPT_CATEGORIES,
  PROMPT_STATUSES,
  PROMPT_ROLES,
} from '../types'

function extractVariables(template: string): string[] {
  const matches = template.match(/\{\{(\w+)\}\}/g) ?? []
  return [...new Set(matches.map((m) => m.slice(2, -2)))]
}

function decodeTemplate(raw: string): string {
  return raw.replace(/\\n/g, '\n').replace(/\\t/g, '\t')
}

const VARIABLE_DESCRIPTIONS: Record<string, string> = {
  product: 'Product name or title',
  audience: 'Target audience segment',
  tone: 'Writing tone or style',
  platform: 'Target platform (Facebook, TikTok, etc.)',
  keywords: 'SEO keywords to include',
  brand: 'Brand name',
  category: 'Product category',
  features: 'Key product features',
  benefits: 'Key product benefits',
  cta: 'Call to action text',
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

    if (prompt) {
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

  const labelClass =
    'text-xs font-semibold text-muted-text uppercase tracking-wider mb-1.5 block'

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto space-y-6 py-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-near-white">
                {isEdit ? 'Edit Prompt' : 'Create Prompt'}
              </h2>
              <p className="text-sm text-muted-text mt-0.5">
                {isEdit
                  ? 'Update this prompt template'
                  : 'Design a new AI prompt template for affiliate content'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onCancel}
              className="text-muted-text shrink-0"
            >
              <X />
            </Button>
          </div>

          {/* NAME */}
          <div>
            <label className={cn(labelClass)}>
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

          {/* DESCRIPTION */}
          <div>
            <label className={cn(labelClass)}>Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of what this prompt does and when to use it"
              rows={2}
              className="bg-surface-2 border-frost text-near-white placeholder:text-muted-text resize-none"
            />
          </div>

          {/* Inline row: TYPE | CATEGORY | STATUS */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={cn(labelClass)}>
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
              <label className={cn(labelClass)}>
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
              <label className={cn(labelClass)}>Status</label>
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

          {/* ROLE toggle — segmented cards, orange accent */}
          <div>
            <label className={cn(labelClass)}>Role</label>
            <div className="grid grid-cols-2 gap-3">
              {PROMPT_ROLES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={cn(
                    'flex flex-col items-start px-5 py-4 rounded-xl border text-left transition-all',
                    role === r.value
                      ? 'border-accent-orange bg-accent-orange-dim text-near-white shadow-sm'
                      : 'border-frost bg-surface-2 text-muted-text hover:border-accent-orange/40',
                  )}
                >
                  <span className="text-sm font-semibold">{r.label}</span>
                  <span className="text-xs mt-1 opacity-70">
                    {r.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* TEMPLATE */}
          <div>
            <label className={cn(labelClass)}>
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
                'bg-surface-2 border-frost text-near-white placeholder:text-muted-text font-mono text-sm resize-none min-h-[160px]',
                errors.template && 'border-accent-red',
              )}
            />
            {errors.template && (
              <p className="text-xs text-accent-red mt-1">{errors.template}</p>
            )}
            {detectedVars.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="text-xs text-muted-text">Detected:</span>
                {detectedVars.map((v) => (
                  <span
                    key={v}
                    className="text-xs px-2 py-0.5 rounded bg-accent-orange-dim text-accent-orange font-mono border border-accent-orange-border"
                  >
                    {`{{${v}}}`}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Variable preview section */}
          {detectedVars.length > 0 && (
            <div className="rounded-xl border border-frost bg-surface-2/60 p-5">
              <h4 className="text-sm font-semibold text-near-white mb-3">
                Template Variables
              </h4>
              <ul className="space-y-2.5">
                {detectedVars.map((v) => (
                  <li key={v} className="flex items-start gap-3">
                    <span className="text-xs px-1.5 py-0.5 rounded bg-accent-orange-dim text-accent-orange font-mono border border-accent-orange-border shrink-0 mt-0.5">
                      {`{{${v}}}`}
                    </span>
                    <span className="text-sm text-muted-text">
                      {VARIABLE_DESCRIPTIONS[v] ??
                        'Variable for dynamic content insertion'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* TAGS */}
          <div>
            <label className={cn(labelClass)}>Tags</label>
            <div className="flex gap-2">
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
                className="border-frost text-muted-text shrink-0"
              >
                <Plus className="size-3.5" />
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-surface-2 text-near-white border border-frost"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-accent-red transition-colors"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 border-t border-frost bg-[var(--color-canvas)] px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={onCancel}
            className="border-frost"
          >
            Cancel
          </Button>
          <div className="flex-1" />
          <Button
            variant="ghost"
            onClick={() => handleSubmit('draft')}
            disabled={isPending}
            className="border-frost"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              'Save as Draft'
            )}
          </Button>
          <Button
            color="orange"
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
