import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { PageHeader } from '#/components/ui/page-header'
import {
  SectionCard,
  SectionCardHeader,
  SectionCardBody,
} from '#/components/ui/section-card'
import { Button } from '#/components/ui/button'
import { FormField } from '#/components/ui/form-field'
import { Select } from '#/components/ui/select'
import { Autocomplete } from '#/components/ui/autocomplete'
import type { AutocompleteOption } from '#/components/ui/autocomplete'
import { useCreateContentIdea } from '../hooks/use-content-ideas'
import { useProducts } from '#/features/products/hooks/use-products'
import {
  ContentSchema,
  IdeaType,
  IdeaStatus,
  TargetPlatform
  
} from '../schemas/content.schema'
import type {ContentSchemaFormData} from '../schemas/content.schema';

const IDEA_TYPE_OPTIONS = [
  { value: IdeaType.Review, label: 'Review' },
  { value: IdeaType.Comparison, label: 'So sánh' },
  { value: IdeaType.Roundup, label: 'Tổng hợp' },
  { value: IdeaType.Tutorial, label: 'Hướng dẫn' },
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
  { value: IdeaStatus.Draft, label: 'Nháp' },
  { value: IdeaStatus.Approved, label: 'Đã duyệt' },
  { value: IdeaStatus.Queued, label: 'Đã xếp hàng' },
  { value: IdeaStatus.Produced, label: 'Đã sản xuất' },
  { value: IdeaStatus.Rejected, label: 'Từ chối' },
]

export function ContentIdeaCreatePage() {
  const navigate = useNavigate()
  const createIdea = useCreateContentIdea()
  const { data: products = [], isLoading: productsLoading } = useProducts()
  const [isSaving, setIsSaving] = useState(false)

  const productOptions: AutocompleteOption[] = products.map((p) => ({
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PageHeader
        backHref="/dash/content"
        backLabel="Quay lại"
        title="Tạo ý tưởng mới"
        actions={
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => void navigate({ to: '/dash/content' })}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSaving || !isDirty}>
              {isSaving ? 'Đang tạo...' : 'Tạo ý tưởng'}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          <SectionCard>
            <SectionCardHeader title="Nội dung chính" />
            <SectionCardBody className="p-5 space-y-4">
              <FormField
                label="Hook"
                required
                error={errors.hook?.message}
                placeholder="Tiêu đề / hook hấp dẫn cho ý tưởng..."
                {...register('hook')}
              />
              <FormField
                label="Góc nhìn (Angle)"
                as="textarea"
                textareaRows={3}
                error={errors.angle?.message}
                placeholder="Mô tả góc nhìn, cách khai thác ý tưởng này..."
                {...register('angle')}
              />
            </SectionCardBody>
          </SectionCard>

          {/* Product assignment */}
          <SectionCard>
            <SectionCardHeader
              title="Sản phẩm liên kết"
              description="Gán một hoặc nhiều sản phẩm cho ý tưởng này"
            />
            <SectionCardBody className="p-5">
              <Controller
                name="ideaProducts"
                control={control}
                render={({ field }) => (
                  <div className="space-y-3">
                    <Autocomplete
                      options={productOptions}
                      value={field.value ?? []}
                      onChange={(vals) => field.onChange(vals)}
                      placeholder="Tìm và chọn sản phẩm..."
                      multiple
                      emitValue="raw"
                      sortSelectedFirst
                      truncateChipLabel
                      disabled={productsLoading}
                    />
                    {(field.value?.length ?? 0) > 0 && (
                      <ul className="space-y-1.5">
                        {field.value?.map((productId) => {
                          const product = productOptions.find(
                            (p) => p.value === productId,
                          )
                          return (
                            <li
                              key={productId}
                              className="flex items-center justify-between rounded-lg bg-surface-2 border border-frost px-3 py-2 text-sm"
                            >
                              <span className="text-near-white truncate">
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
                                className="ml-3 shrink-0 text-muted-text hover:text-accent-red transition-colors"
                              >
                                ×
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                    {(field.value?.length ?? 0) === 0 && (
                      <p className="text-xs text-muted-text">
                        Chưa có sản phẩm nào được gán.
                      </p>
                    )}
                  </div>
                )}
              />
            </SectionCardBody>
          </SectionCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <SectionCard>
            <SectionCardHeader title="Phân loại" />
            <SectionCardBody className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-text uppercase tracking-wider mb-1.5 block">
                  Loại ý tưởng <span className="text-accent-red">*</span>
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
                  Nền tảng <span className="text-accent-red">*</span>
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
                  Danh mục <span className="text-accent-red">*</span>
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
                {errors.category && (
                  <p className="text-xs text-accent-red mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-text uppercase tracking-wider mb-1.5 block">
                  Trạng thái
                </label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? IdeaStatus.Draft}
                      onValueChange={field.onChange}
                    >
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
                  Độ ưu tiên (0–100)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  className="flex h-9 w-full rounded-md border border-frost bg-surface-2 px-3 py-2 text-sm text-near-white placeholder:text-muted-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
                  {...register('priority', { valueAsNumber: true })}
                />
                {errors.priority && (
                  <p className="text-xs text-accent-red mt-1">
                    {errors.priority.message}
                  </p>
                )}
              </div>
            </SectionCardBody>
          </SectionCard>
        </div>
      </div>
    </form>
  )
}
