import { useEffect, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useNavigate } from '@tanstack/react-router'
import MainContent from './post-edit-page/MainContent'
import CreatePreferenceContent from './post-edit-page/CreatePreferenceContent'
import { statusOptions } from './post-edit-page/constants'
import { useCreateContentPost } from '@/features/posts/hooks/use-content-posts'
import { postCreationService } from '@/features/posts/services/post-creation.service'
import { ContentPostCreateSchema } from '#/features/posts/schemas/content-post.schema'
import type { ContentPostCreateFormData } from '#/features/posts/schemas/content-post.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '#/components/ui/button'
import { usePageHeader } from '#/components/ui/page-header-context'

export function PostCreatePage() {
  const navigate = useNavigate()
  const createPost = useCreateContentPost()
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const methods = useForm<ContentPostCreateFormData>({
    resolver: zodResolver(ContentPostCreateSchema),
    defaultValues: {
      title: '',
      body: '',
      hashtags: [],
      status: 'draft',
      platform: 'facebook',
      contentType: 'review',
      primaryProductId: undefined,
      supportingProductIds: [],
      publishMode: 'now',
      scheduledAt: '',
      platformTargets: [],
    },
  })

  const {
    handleSubmit,
    watch,
    formState: { isDirty },
  } = methods

  useEffect(() => {
    setHasUnsavedChanges(isDirty)
  }, [isDirty])

  const handleSave = async (data: ContentPostCreateFormData) => {
    setIsSaving(true)
    try {
      const payload = postCreationService.transformFormDataToPayload({
        ...data,
        platformTargets: [],
      })
      await createPost.mutateAsync(payload)
      void navigate({ to: '/dash/posts', search: { ideaId: undefined } })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (
        confirm('Bạn có chắc chắn muốn hủy? Các thay đổi chưa lưu sẽ bị mất.')
      ) {
        void navigate({ to: '/dash/posts', search: { ideaId: undefined } })
      }
      return
    }
    void navigate({ to: '/dash/posts', search: { ideaId: undefined } })
  }

  const status = watch('status')

  usePageHeader({
    title: 'Tạo bài viết mới',
    backHref: '/dash/posts',
    // backLabel: 'Quay lại',
    actions: (
      <div className="flex items-center gap-3">
        {hasUnsavedChanges && (
          <span className="text-xs text-accent-orange">
            • Có thay đổi chưa lưu
          </span>
        )}
        <span className="text-sm text-muted-text">
          {statusOptions.find((s) => s.value === status)?.label}
        </span>
        <Button
          size="xs"
          type="submit"
          disabled={isSaving || !hasUnsavedChanges}
        >
          {isSaving ? 'Đang tạo...' : 'Tạo bài viết'}
        </Button>
      </div>
    ),
  })

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleSave)}>
        <div className="max-w-full space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1.86fr_1fr] gap-6 items-start">
            <div className="space-y-6">
              <MainContent
                control={methods.control}
                primaryProductId={watch('primaryProductId')}
                supportingProductIds={watch('supportingProductIds') ?? []}
                onPrimaryProductChange={(value) =>
                  methods.setValue('primaryProductId', value)
                }
                onSupportingProductsChange={(values) =>
                  methods.setValue('supportingProductIds', values)
                }
              />
            </div>

            <CreatePreferenceContent
              control={methods.control}
              onCancel={handleCancel}
              isPublishing={isSaving}
            />
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

export default PostCreatePage
