import { useState } from 'react'
import { Controller, useWatch } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import { ChevronDown, Sparkles, Loader2 } from 'lucide-react'

import SelectField from './SelectField'
import { statusOptions, platformOptions, contentTypeOptions } from './constants'
import type {
  ContentPostCreateFormData,
  ContentPostEditFormData,
} from '#/features/posts/schemas/content-post.schema'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'

interface CreatePreferenceContentProps {
  control: Control<ContentPostEditFormData | ContentPostCreateFormData>
  onCancel: () => void
  onPublishLabel?: string
  isPublishing?: boolean
}

export default function CreatePreferenceContent({
  control,
  onCancel,
  onPublishLabel = 'Publish',
  isPublishing = false,
}: CreatePreferenceContentProps) {
  const publishMode = useWatch({ control, name: 'publishMode' })
  const [aiOpen, setAiOpen] = useState(false)

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-22 space-y-4">
        <div className="rounded-[var(--radius-md)] border border-accent-orange-border bg-[linear-gradient(180deg,rgba(234,115,23,0.12),rgba(234,115,23,0.04))] overflow-hidden">
          <button
            type="button"
            onClick={() => setAiOpen(!aiOpen)}
            className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-accent-orange/5 transition-colors"
          >
            <span className="flex items-center gap-2 text-sm font-medium text-accent-orange">
              <Sparkles size={14} />
              AI Assistant
            </span>
            <ChevronDown
              size={14}
              className={`text-accent-orange transition-transform ${aiOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {!aiOpen ? (
            <p className="px-4 pb-3 text-xs text-[var(--color-muted)]">
              ✨ Let AI write this post for you
            </p>
          ) : (
            <div className="border-t border-accent-orange-border/60 px-4 py-3 space-y-3">
              <Input
                placeholder="Describe what you want AI to generate..."
                className="bg-[var(--color-surface)] border-[var(--color-hairline)]"
              />
              <Button color="orange" size="sm" className="w-full">
                <Sparkles size={14} />
                Generate
              </Button>
            </div>
          )}
        </div>

        <div className="rounded-[var(--radius-md)] border border-[var(--color-hairline)] bg-[var(--color-surface)] p-5 space-y-5">
          <h3 className="text-sm font-semibold text-[var(--color-ink)]">
            Post Info
          </h3>

          <SelectField
            control={control}
            name="status"
            label="Status"
            options={statusOptions.filter((s) =>
              ['draft', 'published', 'queued'].includes(s.value),
            )}
          />
          <SelectField
            control={control}
            name="platform"
            label="Platform"
            options={platformOptions.filter((p) =>
              ['facebook', 'tiktok', 'instagram'].includes(p.value),
            )}
          />
          <SelectField
            control={control}
            name="contentType"
            label="Content Type"
            options={contentTypeOptions}
          />
          <SelectField
            control={control}
            name="publishMode"
            label="Post Style"
            options={[
              { value: 'now', label: 'Immediate' },
              { value: 'schedule', label: 'Scheduled' },
            ]}
          />

          {publishMode === 'schedule' && (
            <div>
              <label
                htmlFor="scheduled_at"
                className="block text-[11px] font-medium uppercase tracking-wider text-[var(--color-muted)] mb-1.5"
              >
                Scheduled date/time
              </label>
              <Controller
                name="scheduledAt"
                control={control}
                render={({ field }) => (
                  <input
                    id="scheduled_at"
                    type="datetime-local"
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    className="w-full bg-[var(--color-surface-2)] border border-[var(--color-hairline)] rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-ink)] hover:border-[var(--color-frost-hover)] focus:outline-none focus:border-[var(--color-frost-hover)] focus:ring-1 focus:ring-[var(--color-frost-hover)] transition-colors"
                  />
                )}
              />
            </div>
          )}

          <div className="border-t border-[var(--color-hairline)] pt-4 space-y-2">
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={onCancel}
            >
              Save Draft
            </Button>
            <Button
              color="orange"
              type="submit"
              className="w-full"
              disabled={isPublishing}
            >
              {isPublishing ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Publishing...
                </>
              ) : (
                onPublishLabel
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
