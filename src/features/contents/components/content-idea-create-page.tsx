import { useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Sparkles } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { usePageHeader } from '#/components/ui/page-header-context'
import {
  SectionCard,
  SectionCardHeader,
  SectionCardBody,
} from '#/components/ui/section-card'
import { Button } from '#/components/ui/button'
import { FormField } from '#/components/ui/form-field'
import { Select } from '#/components/ui/select'
import { Separator } from '#/components/ui/separator'
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
} from '#/components/ui/combobox'
import type { ComboboxOption } from '#/components/ui/combobox-utils'
import {
  filterOptionsByLabel,
  sortSelectedFirst,
} from '#/components/ui/combobox-utils'
import { useCreateContentIdea } from '../hooks/use-content-ideas'
import { useProducts } from '#/features/products/hooks/use-products'
import {
  ContentSchema,
  IdeaType,
  IdeaStatus,
  TargetPlatform,
} from '../schemas/content.schema'
import type { ContentSchemaFormData } from '../schemas/content.schema'

const CONTENT_TYPE_OPTIONS = [
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

const STATUS_OPTIONS = [
  { value: IdeaStatus.Draft, label: 'Draft' },
  { value: IdeaStatus.Approved, label: 'Active' },
]

export function ContentIdeaCreatePage() {
  const navigate = useNavigate()
  const createIdea = useCreateContentIdea()
  const { data: products = [], isLoading: productsLoading } = useProducts()
  const [isSaving, setIsSaving] = useState(false)

  const productOptions: ComboboxOption[] = products.map((p) => ({
    value: p.productId,
    label: p.canonicalTitle,
  }))

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ContentSchemaFormData>({
    resolver: zodResolver(ContentSchema),
    defaultValues: {
      ideaType: IdeaType.Review,
      category: 'uncategorized',
      targetPlatform: TargetPlatform.Facebook,
      hook: '',
      angle: '',
      priority: 50,
      status: IdeaStatus.Draft,
      ideaProducts: [],
    },
  })

  const onSubmit = async (data: ContentSchemaFormData) => {
    setIsSaving(true)
    try {
      await createIdea.mutateAsync(data)
      void navigate({ to: '/dash/content' })
    } finally {
      setIsSaving(false)
    }
  }

  usePageHeader({
    backHref: '/dash/content',
    backLabel: 'Back',
    title: 'Create Content Seed',
  })

  return (
    <form id="content-idea-create-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-6 items-start">
        {/* Left column */}
        <div className="space-y-4">
          <SectionCard>
            <SectionCardHeader title="Main Content" />
            <SectionCardBody className="p-5 space-y-4">
              <FormField
                label="HOOK"
                required
                error={errors.hook?.message}
                placeholder="Enter a compelling hook or headline..."
                {...register('hook')}
              />
              <FormField
                label="ANGLE"
                as="textarea"
                textareaRows={3}
                error={errors.angle?.message}
                placeholder="Describe the angle or approach for this content..."
                {...register('angle')}
              />
            </SectionCardBody>
          </SectionCard>

          <SectionCard>
            <SectionCardHeader
              title="Linked Products"
              description="Attach one or more products to this seed"
              actions={
                <Button type="button" variant="ghost" color="orange" size="sm">
                  <Sparkles size={14} className="mr-1.5" />
                  Suggest hook &amp; angle
                </Button>
              }
            />
            <SectionCardBody className="p-5">
              <Controller
                name="ideaProducts"
                control={control}
                render={({ field }) => {
                  const anchorRef = useComboboxAnchor()
                  const [cbOpen, setCbOpen] = useState(false)
                  const [inputValue, setInputValue] = useState('')
                  const preventCloseRef = useRef<ReturnType<
                    typeof setTimeout
                  > | null>(null)

                  const selectedOpts = (field.value ?? [])
                    .map((v: string) =>
                      productOptions.find((o) => o.value === v),
                    )
                    .filter(Boolean) as ComboboxOption[]
                  const filtered = sortSelectedFirst(
                    filterOptionsByLabel(productOptions, inputValue),
                    selectedOpts,
                  )

                  return (
                    <div className="space-y-3">
                      <Combobox
                        multiple
                        value={selectedOpts}
                        onValueChange={(items) => {
                          const raw = items.map((o) => o.value)
                          field.onChange(raw)
                          if (preventCloseRef.current)
                            clearTimeout(preventCloseRef.current)
                          preventCloseRef.current = setTimeout(() => {
                            preventCloseRef.current = null
                          }, 50)
                        }}
                        inputValue={inputValue}
                        onInputValueChange={setInputValue}
                        open={cbOpen}
                        onOpenChange={(next) => {
                          if (!next && preventCloseRef.current) setCbOpen(true)
                          else setCbOpen(next)
                        }}
                        items={filtered}
                        itemToStringLabel={(item) => item.label}
                        isItemEqualToValue={(item, value) =>
                          item.value === value.value
                        }
                        disabled={productsLoading}
                      >
                        <div ref={anchorRef}>
                          <ComboboxChips>
                            {selectedOpts.map((item) => (
                              <ComboboxChip key={String(item.value)}>
                                <span
                                  className="min-w-0 truncate"
                                  title={item.label}
                                >
                                  {item.label}
                                </span>
                              </ComboboxChip>
                            ))}
                            <ComboboxChipsInput placeholder="Search products..." />
                          </ComboboxChips>
                        </div>
                        <ComboboxContent anchor={anchorRef}>
                          <ComboboxList>
                            <ComboboxCollection>
                              {(item) => (
                                <ComboboxItem value={item}>
                                  {item.label}
                                </ComboboxItem>
                              )}
                            </ComboboxCollection>
                            <ComboboxEmpty>No products found</ComboboxEmpty>
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                      {(field.value?.length ?? 0) > 0 && (
                        <ul className="space-y-1.5">
                          {field.value?.map((productId) => {
                            const product = productOptions.find(
                              (p) => p.value === productId,
                            )
                            const matchedProduct = products.find(
                              (p) => p.productId === productId,
                            )
                            const thumbnail =
                              (matchedProduct as any)?.imageCover ??
                              (matchedProduct as any)?.thumbnail
                            return (
                              <li
                                key={productId}
                                className="flex items-center gap-3 rounded-lg bg-surface-2 border border-frost px-3 py-2 text-sm"
                              >
                                {thumbnail ? (
                                  <img
                                    src={thumbnail}
                                    alt=""
                                    className="size-8 rounded object-cover shrink-0"
                                  />
                                ) : (
                                  <div className="size-8 rounded bg-accent-orange-dim shrink-0 flex items-center justify-center">
                                    <span className="text-[10px] font-semibold text-accent-orange">
                                      {(product?.label ?? '?')[0].toUpperCase()}
                                    </span>
                                  </div>
                                )}
                                <span className="flex-1 min-w-0 truncate text-near-white">
                                  {product?.label ?? productId}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    field.onChange(
                                      (field.value ?? []).filter(
                                        (id) => id !== productId,
                                      ),
                                    )
                                  }
                                  className="shrink-0 text-muted-text hover:text-accent-red transition-colors"
                                >
                                  &times;
                                </button>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                      {(field.value?.length ?? 0) === 0 && (
                        <p className="text-xs text-muted-text">
                          No products attached.
                        </p>
                      )}
                    </div>
                  )
                }}
              />
            </SectionCardBody>
          </SectionCard>
        </div>

        {/* Right column — sticky sidebar */}
        <div className="sticky top-6">
          <SectionCard>
            <SectionCardHeader title="Classification" />
            <SectionCardBody className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-text uppercase tracking-wider mb-1.5 block">
                  Content Type <span className="text-accent-red">*</span>
                </label>
                <Controller
                  name="ideaType"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      {CONTENT_TYPE_OPTIONS.map((opt) => (
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
                  Platform <span className="text-accent-red">*</span>
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

              <div>
                <label className="text-xs font-semibold text-muted-text uppercase tracking-wider mb-1.5 block">
                  Category <span className="text-accent-red">*</span>
                </label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      {CATEGORY_OPTIONS.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="text-xs text-accent-red mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-text uppercase tracking-wider mb-1.5 block">
                  Status
                </label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      {STATUS_OPTIONS.map((opt) => (
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
                  Priority
                </label>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="w-full h-1.5 rounded-full appearance-none bg-surface-strong cursor-pointer
                          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-orange [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer
                          [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-accent-orange [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-text">0</span>
                        <span className="text-sm font-semibold text-near-white tabular-nums">
                          {field.value}
                        </span>
                        <span className="text-xs text-muted-text">100</span>
                      </div>
                    </div>
                  )}
                />
                {errors.priority && (
                  <p className="text-xs text-accent-red mt-1">
                    {errors.priority.message}
                  </p>
                )}
              </div>
            </SectionCardBody>

            <Separator />

            <div className="p-5 flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                className="flex-1"
                onClick={() => void navigate({ to: '/dash/content' })}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="orange"
                className="flex-1"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Seed'}
              </Button>
            </div>
          </SectionCard>
        </div>
      </div>
    </form>
  )
}
