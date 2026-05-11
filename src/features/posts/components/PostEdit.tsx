import { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useNavigate } from '@tanstack/react-router'
import {
  useContentPost,
  useUpdateContentPost,
} from '@/features/posts/hooks/use-content-posts'
import MainContent from './post-edit-page/MainContent'
import PreferenceContent from './post-edit-page/PreferenceContent'
import PlatformTargetConfigPanel from './platform-target-config-panel'
import { postEditService } from '@/features/posts/services/post-edit.service'
import ProductReferencePanel from './product-reference-panel'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoadingState } from '@/components/ui/loading-state'
import { EmptyState } from '@/components/ui/empty-state'
import { ContentPostEditSchema } from '#/features/posts/schemas/content-post.schema'
import type { ContentPostEditFormData } from '#/features/posts/schemas/content-post.schema'
import type { PlatformTargetConfig } from '../types/publication'

interface PostEditPageProps {
  postId: string
}

export function PostEditPage({ postId }: PostEditPageProps) {
  const navigate = useNavigate()
  const { data: post, isLoading } = useContentPost(postId)
  const updatePost = useUpdateContentPost()
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [platformTargets, setPlatformTargets] = useState<
    PlatformTargetConfig[]
  >([])

  const methods = useForm<ContentPostEditFormData>({
    resolver: zodResolver(ContentPostEditSchema),
    defaultValues: {},
  })

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isDirty },
  } = methods
  useEffect(() => {
    if (post) {
      const formData = postEditService.transformPostToFormData(post)
      reset(formData)
    }
  }, [post, reset])

  const [initialHashTags, setInitialHashTags] = useState<string[]>([])
  useEffect(() => {
    if (post?.hashtags) {
      const tags = post.hashtags.map((tag: string) => tag.trim())
      setInitialHashTags(tags)
    }
  }, [post?.hashtags])
  useEffect(() => {
    setHasUnsavedChanges(isDirty || platformTargets.length > 0)
  }, [isDirty, platformTargets])

  const handleSave = async (data: ContentPostEditFormData) => {
    if (!post || !postId) return
    setIsSaving(true)
    try {
      const payload = postEditService.transformFormDataToPayload(data)
      await updatePost.mutateAsync({
        postId,
        data: payload,
      })
      setHasUnsavedChanges(false)
      void navigate({ to: '/dash/posts/$postId', params: { postId } })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (
        confirm('Bạn có chắc chắn muốn hủy? Các thay đổi chưa lưu sẽ bị mất.')
      ) {
        void navigate({ to: '/dash/posts/$postId', params: { postId } })
      }
    } else {
      void navigate({ to: '/dash/posts/$postId', params: { postId } })
    }
  }

  const status = watch('status')

  if (isLoading) {
    return <LoadingState variant="block" />
  }

  if (!post) {
    return (
      <EmptyState
        title="Không tìm thấy bài viết"
        description="Bài viết này không tồn tại hoặc đã bị xóa"
      />
    )
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleSave)}>
        <div className="max-w-full space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <MainContent
                control={methods.control}
                initialHashtags={initialHashTags}
                setDefaultHashtags={(ht) => setInitialHashTags(ht)}
              />
              <PlatformTargetConfigPanel
                control={methods.control}
                targets={platformTargets}
                onTargetsChange={setPlatformTargets}
              />
            </div>
            <div className="flex flex-col justify-between gap-6">
              <PreferenceContent
                control={methods.control}
                post={post}
                postId={postId}
                platform={watch('platform') || post.platform}
                onCancel={handleCancel}
              />
              <div className="bg-surface border border-frost rounded-2xl p-6 space-y-6">
                <h3 className="font-semibold text-near-white">
                  Tham chiếu sản phẩm & Affiliate
                </h3>

                <ProductReferencePanel
                  primaryProductId={watch('primaryProductId')}
                  supportingProductIds={watch('supportingProductIds')}
                  onPrimaryProductChange={(value) =>
                    setValue('primaryProductId', value)
                  }
                  onSupportingProductsChange={(values) =>
                    setValue('supportingProductIds', values)
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
