import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PageHeader } from '#/components/ui/page-header'
import {
  SectionCard,
  SectionCardHeader,
  SectionCardBody,
} from '#/components/ui/section-card'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { FormField } from '#/components/ui/form-field'
import { Select } from '#/components/ui/select'
import { Autocomplete } from '#/components/ui/autocomplete'
import type { AutocompleteOption } from '#/components/ui/autocomplete'
import { LoadingState } from '#/components/ui/loading-state'
import { EmptyState } from '#/components/ui/empty-state'
import {
  useContentIdea,
  useUpdateContentIdea,
} from '../hooks/use-content-ideas'
import { useProducts } from '#/features/products/hooks/use-products'
import {
  ContentSchema,
  IdeaType,
  IdeaStatus,
  TargetPlatform
  
} from '../schemas/content.schema'
import type {ContentSchemaFormData} from '../schemas/content.schema';
import { Link } from '@tanstack/react-router'

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

const STATUS_TONE: Record<
  IdeaStatus,
  'neutral' | 'blue' | 'green' | 'orange' | 'yellow' | 'red'
> = {
  [IdeaStatus.Draft]: 'neutral',
  [IdeaStatus.Approved]: 'green',
  [IdeaStatus.Queued]: 'blue',
  [IdeaStatus.Produced]: 'orange',
  [IdeaStatus.Rejected]: 'red',
}

interface ContentIdeaDetailPageProps {
  ideaId: string
}

function ContentIdeaDetailPageInner({ ideaId }: ContentIdeaDetailPageProps) {
  const { data: idea, isLoading } = useContentIdea(ideaId)
  const updateIdea = useUpdateContentIdea()
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
    reset,
  } = useForm<ContentSchemaFormData>({
    resolver: zodResolver(ContentSchema),
    values: idea
      ? {
          ideaType: idea.ideaType as IdeaType,
          category: idea.category,
          targetPlatform: idea.targetPlatform as TargetPlatform,
          hook: idea.hook,
          angle: idea.angle ?? '',
          priority: idea.priority,
          status: idea.status as IdeaStatus,
          productIds: idea.productIds ?? [],
        }
      : undefined,
  })

  const onSubmit = async (data: ContentSchemaFormData) => {
    setIsSaving(true)
    try {
      await updateIdea.mutateAsync({ ideaId, data })
      reset(data)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <LoadingState variant="block" />

  if (!idea) {
    return (
      <EmptyState
        title="Không tìm thấy ý tưởng"
        description="Ý tưởng này không tồn tại hoặc đã bị xóa"
      />
    )
  }

  const statusLabel =
    STATUS_OPTIONS.find((s) => s.value === idea.status)?.label ?? idea.status
  const statusTone = STATUS_TONE[idea.status as IdeaStatus] ?? 'neutral'

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PageHeader
        backHref="/dash/content"
        backLabel="Quay lại"
        title={idea.hook}
        subtitle={`Tạo lúc ${new Date(idea.createdAt).toLocaleDateString('vi-VN')}`}
        actions={
          <div className="flex items-center gap-3">
            <Badge tone={statusTone}>{statusLabel}</Badge>
            {isDirty && (
              <span className="text-xs text-accent-orange">• Chưa lưu</span>
            )}
            <Button
              type="button"
              variant="ghost"
              onClick={() => reset()}
              disabled={!isDirty || isSaving}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSaving || !isDirty}>
              {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
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
                placeholder="Tiêu đề / hook hấp dẫn..."
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
                name="productIds"
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
                    {(field.value?.length ?? 0) > 0 ? (
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
                              <Link
                                to="/dash/products/$productId"
                                params={{ productId }}
                                className="text-near-white hover:text-accent-blue transition-colors truncate"
                              >
                                {product?.label ?? productId}
                              </Link>
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
                    ) : (
                      <p className="text-xs text-muted-text">
                        Chưa có sản phẩm nào được gán.
                      </p>
                    )}
                  </div>
                )}
              />
            </SectionCardBody>
          </SectionCard>

          {/* Linked posts */}
          {(idea.postIds?.length ?? 0) > 0 && (
            <SectionCard>
              <SectionCardHeader
                title="Bài viết từ ý tưởng này"
                description={`${idea.postIds?.length} bài viết`}
              />
              <SectionCardBody className="p-5">
                <ul className="space-y-1.5">
                  {idea.postIds?.map((postId) => (
                    <li key={postId}>
                      <Link
                        to="/dash/posts/$postId"
                        params={{ postId }}
                        className="text-sm text-accent-blue hover:underline"
                      >
                        {postId}
                      </Link>
                    </li>
                  ))}
                </ul>
              </SectionCardBody>
            </SectionCard>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <SectionCard>
            <SectionCardHeader title="Phân loại" />
            <SectionCardBody className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-text uppercase tracking-wider mb-1.5 block">
                  Loại ý tưởng
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
                  Nền tảng
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
                  Danh mục
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
                  className="flex h-9 w-full rounded-md border border-frost bg-surface-2 px-3 py-2 text-sm text-near-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
                  {...register('priority', { valueAsNumber: true })}
                />
              </div>
            </SectionCardBody>
          </SectionCard>

          <SectionCard>
            <SectionCardHeader title="Metadata" />
            <SectionCardBody className="p-5 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-muted-text">ID</span>
                <span className="text-near-white font-mono">
                  {idea.ideaId.slice(0, 8)}…
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-text">Tạo lúc</span>
                <span className="text-near-white">
                  {new Date(idea.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-text">Cập nhật</span>
                <span className="text-near-white">
                  {new Date(idea.updatedAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
              {(idea.postIds?.length ?? 0) > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-text">Bài viết</span>
                  <span className="text-near-white">
                    {idea.postIds?.length}
                  </span>
                </div>
              )}
            </SectionCardBody>
          </SectionCard>
        </div>
      </div>
    </form>
  )
}

export function ContentIdeaDetailPage({ ideaId }: ContentIdeaDetailPageProps) {
  return <ContentIdeaDetailPageInner ideaId={ideaId} />
}
