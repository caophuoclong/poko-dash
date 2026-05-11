import { FormField } from '@/components/ui/form-field'
import { Select } from '@/components/ui/select'
import { Controller } from 'react-hook-form'
import { PlusIcon } from 'lucide-react'
import {
  Combobox,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxList,
  ComboboxCollection,
  ComboboxItem,
  ComboboxEmpty,
  useComboboxAnchor,
} from '@/components/ui/combobox'
import type { ComboboxOption, CreateCandidate } from '@/components/ui/combobox-utils'
import {
  filterOptionsByLabel,
  buildCreateCandidate,
  isCreateCandidate,
  CREATE_SENTINEL,
} from '@/components/ui/combobox-utils'
import type { IdeaType, TargetPlatform } from '../../schemas/content.schema'
import { cn } from '#/shared/utils'
import { useRef, useState } from 'react'

const IDEA_TYPE_OPTIONS = [
  { value: 'review' as IdeaType, label: 'Review' },
  { value: 'comparison' as IdeaType, label: 'Comparison' },
  { value: 'roundup' as IdeaType, label: 'Roundup' },
  { value: 'tutorial' as IdeaType, label: 'Tutorial' },
  { value: 'deal' as IdeaType, label: 'Deal' },
  { value: 'trending' as IdeaType, label: 'Trending' },
]

const PLATFORM_OPTIONS = [
  { value: 'facebook' as TargetPlatform, label: 'Facebook' },
  { value: 'tiktok' as TargetPlatform, label: 'TikTok' },
  { value: 'instagram' as TargetPlatform, label: 'Instagram' },
  { value: 'youtube' as TargetPlatform, label: 'YouTube' },
  { value: 'blog' as TargetPlatform, label: 'Blog' },
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

const ANGLE_OPTIONS: ComboboxOption[] = [
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
  angleOptions?: ComboboxOption[]
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
              <AngleMultiSelect
                options={angleOptions}
                value={field.value ? field.value.split(',') : []}
                onChange={(vals) => field.onChange(vals.join(','))}
                placeholder="Select angles for this seed..."
                allowCreate
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

function AngleMultiSelect({
  options,
  value,
  onChange,
  placeholder,
  allowCreate,
}: {
  options: ComboboxOption[]
  value: string[]
  onChange: (vals: string[]) => void
  placeholder: string
  allowCreate?: boolean
}) {
  const anchorRef = useComboboxAnchor()
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [allOptions, setAllOptions] = useState(options)
  const preventCloseRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const selectedOpts = value
    .map((v) => allOptions.find((o) => o.value === v))
    .filter(Boolean) as ComboboxOption[]

  const filtered = filterOptionsByLabel(allOptions, inputValue)
  const createCandidate = allowCreate ? buildCreateCandidate(inputValue, allOptions) : null
  const displayItems = createCandidate ? [createCandidate, ...filtered] : filtered

  return (
    <Combobox<ComboboxOption | CreateCandidate, true>
      multiple
      value={selectedOpts}
      onValueChange={(items) => {
        const nextItems = Array.isArray(items) ? items : []
        const createItem = nextItems.find((item) => isCreateCandidate(item))

        if (createItem) {
          const built: ComboboxOption = {
            label: createItem.__meta.input,
            value: createItem.__meta.input,
          }
          setAllOptions((prev) => {
            if (prev.some((o) => o.value === built.value)) return prev
            return [built, ...prev]
          })
          onChange([...value, built.value])
          setInputValue('')
          return
        }

        const raw = nextItems.map((o) => o.value)
        onChange(raw)

        if (preventCloseRef.current) clearTimeout(preventCloseRef.current)
        preventCloseRef.current = setTimeout(() => {
          preventCloseRef.current = null
        }, 50)
      }}
      inputValue={inputValue}
      onInputValueChange={setInputValue}
      open={open}
      onOpenChange={(next) => {
        if (!next && preventCloseRef.current) setOpen(true)
        else setOpen(next)
      }}
      items={displayItems}
      itemToStringLabel={(item) => item.label}
      isItemEqualToValue={(item, value) =>
        isCreateCandidate(item)
          ? item.__meta.input === value?.value
          : item?.value === value?.value
      }
    >
      <div ref={anchorRef}>
        <ComboboxChips>
          {selectedOpts.map((item) => (
            <ComboboxChip key={String(item.value)}>
              <span className="min-w-0 truncate" title={item.label}>{item.label}</span>
            </ComboboxChip>
          ))}
          <ComboboxChipsInput placeholder={placeholder} />
        </ComboboxChips>
      </div>
      <ComboboxContent anchor={anchorRef}>
        <ComboboxList>
          <ComboboxCollection>
            {(item) => (
              <ComboboxItem value={item}>
                {isCreateCandidate(item) ? (
                  <span className="inline-flex items-center gap-2">
                    <PlusIcon className="size-4" />
                    {item.label}
                  </span>
                ) : (
                  item.label
                )}
              </ComboboxItem>
            )}
          </ComboboxCollection>
          <ComboboxEmpty>No results found</ComboboxEmpty>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
