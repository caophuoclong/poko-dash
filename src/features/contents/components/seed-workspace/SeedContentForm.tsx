import { FormField } from '@/components/ui/form-field'
import { Select } from '@/components/ui/select'
import { Controller } from 'react-hook-form'
import type { AutocompleteOption } from '@/components/ui/autocomplete'
import { Autocomplete } from '@/components/ui/autocomplete'
import { IdeaType, TargetPlatform } from '../../schemas/content.schema'
import { cn } from '#/shared/utils'

const IDEA_TYPE_OPTIONS = [
  { value: IdeaType.Review, label: 'Review' },
  { value: IdeaType.Comparison, label: 'Comparison' },
  { value: IdeaType.Roundup, label: 'Roundup' },
  { value: IdeaType.Tutorial, label: 'Tutorial' },
  { value: IdeaType.Deal, label: 'Deal' },
  { value: IdeaType.Trending, label: 'Trending' },
]

const PLATFORM_OPTIONS = [
  { value: TargetPlatform.Facebook, label: 'Facebook' },
  { value: TargetPlatform.TikTok, label: 'TikTok' },
  { value: TargetPlatform.Instagram, label: 'Instagram' },
  { value: TargetPlatform.YouTube, label: 'YouTube' },
  { value: TargetPlatform.Blog, label: 'Blog' },
]

const CATEGORY_OPTIONS = [
  'Điện tử',
  'Phụ kiện',
  'Gia dụng',
  'Thời trang',
  'Làm đẹp',
  'Thể thao',
  'uncategorized',
]

const ANGLE_OPTIONS: AutocompleteOption[] = [
  { value: 'Product-focused', label: 'Product-focused' },
  { value: 'Problem-solution', label: 'Problem-solution' },
  { value: 'Storytelling', label: 'Storytelling' },
  { value: 'Educational', label: 'Educational' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Trend-jacking', label: 'Trend-jacking' },
  { value: 'Comparison', label: 'Comparison' },
  { value: 'Review', label: 'Review' },
]

interface SeedContentFormProps {
  control: any
  register: any
  errors: any
  angleOptions?: AutocompleteOption[]
}

export function SeedContentForm({
  control,
  register,
  errors,
  angleOptions = ANGLE_OPTIONS,
}: SeedContentFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-near-white uppercase tracking-wider mb-4">
          Seed Content
        </h2>

        <FormField
          label="Hook"
          required
          error={errors.hook?.message}
          placeholder="A compelling headline or hook that captures attention..."
          className="text-base font-medium"
          {...register('hook')}
        />

        <div className="mt-4">
          <label className="text-sm font-medium text-near-white mb-2 block">
            Angles
          </label>
          <Controller
            name="angle"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={angleOptions}
                value={
                  field.value
                    ? angleOptions.filter((a) =>
                        field.value.split(',').includes(a.value),
                      )
                    : []
                }
                onChange={(vals) =>
                  field.onChange(vals.map((v) => v.value).join(','))
                }
                placeholder="Select angles for this seed..."
                multiple
                allowCreate
                emitValue="raw"
                truncateChipLabel
              />
            )}
          />
          <p className="text-xs text-muted-text mt-1.5">
            Define the perspectives or approaches this seed can take. Add custom
            angles as needed.
          </p>
        </div>
      </div>

      <div className="border-t border-frost pt-6">
        <h2 className="text-sm font-semibold text-near-white uppercase tracking-wider mb-4">
          Classification
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted-text uppercase tracking-wider mb-1.5 block">
              Idea Type
            </label>
            <Controller
              name="ideaType"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  {IDEA_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              )}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-text uppercase tracking-wider mb-1.5 block">
              Platform
            </label>
            <Controller
              name="targetPlatform"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  {PLATFORM_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              )}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="text-xs font-semibold text-muted-text uppercase tracking-wider mb-1.5 block">
            Category
          </label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'uncategorized' ? 'Khác' : cat}
                  </option>
                ))}
              </Select>
            )}
          />
        </div>

        <div className="mt-4">
          <label className="text-xs font-semibold text-muted-text uppercase tracking-wider mb-1.5 block">
            Priority (0-100)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={0}
              max={100}
              className="flex h-9 w-full rounded-md border border-frost bg-surface-2 px-3 py-2 text-sm text-near-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
              {...register('priority', { valueAsNumber: true })}
            />
            <div className="flex-1 flex items-center gap-1">
              {[20, 40, 60, 80, 100].map((val) => (
                <div
                  key={val}
                  className={cn(
                    'h-1.5 flex-1 rounded-full transition-all',
                    (register('priority').value ?? 0) >= val
                      ? 'bg-accent-orange'
                      : 'bg-surface-2',
                  )}
                />
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-text mt-1">
            Higher priority seeds are generated first in batch operations
          </p>
        </div>
      </div>
    </div>
  )
}
