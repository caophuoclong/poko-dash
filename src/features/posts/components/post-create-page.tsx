import { useEffect, useMemo, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useNavigate } from '@tanstack/react-router'
import MainContent from './post-edit-page/MainContent'
import CreatePreferenceContent from './post-edit-page/CreatePreferenceContent'
import { statusOptions } from './post-edit-page/constants'
import { useCreateContentPost } from '@/features/posts/hooks/use-content-posts'
import { useScheduledJobs } from '@/features/scheduler/hooks/use-scheduler'
import { transformScheduledJobsToEvents } from '@/features/scheduler/services/calendar.service'
import { postCreationService } from '@/features/posts/services/post-creation.service'
import { ContentPostCreateSchema } from '#/features/posts/schemas/content-post.schema'
import type { ContentPostCreateFormData } from '#/features/posts/schemas/content-post.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '#/components/ui/button'

export function PostCreatePage() {
  const navigate = useNavigate()
  const now = new Date()
  const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const to = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
  ).toISOString()
  const { data: scheduledJobs = [] } = useScheduledJobs({ from, to })
  const events = useMemo(
    () => transformScheduledJobsToEvents(scheduledJobs),
    [scheduledJobs],
  )

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
      const payload = postCreationService.transformFormDataToPayload(data)
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

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleSave)}>
        <div className="max-w-full">
          <div className="flex items-center justify-between mb-6">
            <a
              href="/dash/posts"
              className="inline-flex items-center gap-2 text-sm text-muted-text hover:text-near-white transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M10 12L6 8L10 4" />
              </svg>
              Quay lại
            </a>

            <div className="flex items-center gap-3">
              {hasUnsavedChanges && (
                <span className="text-xs text-accent-orange">
                  • Có thay đổi chưa lưu
                </span>
              )}
              <span className="text-sm text-muted-text">
                {statusOptions.find((s) => s.value === status)?.label}
              </span>
              <Button type="submit" disabled={isSaving || !hasUnsavedChanges}>
                {isSaving ? 'Đang tạo...' : 'Tạo bài viết'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <MainContent control={methods.control} />

            <CreatePreferenceContent
              control={methods.control}
              onCancel={handleCancel}
              events={events}
            />
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

export default PostCreatePage
