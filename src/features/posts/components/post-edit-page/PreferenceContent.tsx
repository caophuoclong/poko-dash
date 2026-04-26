import type { Control } from 'react-hook-form'
import { Button } from '#/components/ui/button'
import SelectField from './SelectField'
import SchedulePanel from './SchedulePanel'
import { statusOptions, platformOptions, contentTypeOptions } from './constants'
import type { useContentPost } from '@/features/posts/hooks/use-content-posts'
import type { ContentPostEditFormData } from '#/features/posts/schemas/content-post.schema'

interface PreferenceContentProps {
  control: Control<ContentPostEditFormData>
  post: ReturnType<typeof useContentPost>['data']
  postId: string
  platform: string
  onCancel: () => void
}

export default function PreferenceContent({
  control,
  post,
  postId,
  platform,
  onCancel,
}: PreferenceContentProps) {
  return (
    <div className="lg:col-span-1">
      <div className="bg-surface border border-frost rounded-2xl p-6 space-y-6">
        <h3 className="font-semibold text-near-white">Thông tin bài viết</h3>

        <SelectField
          control={control}
          name="status"
          label="Trạng thái"
          options={statusOptions}
        />

        <SelectField
          control={control}
          name="platform"
          label="Nền tảng"
          options={platformOptions}
        />

        <SelectField
          control={control}
          name="contentType"
          label="Loại nội dung"
          options={contentTypeOptions}
        />

        <div>
          <h4 className="text-sm font-medium text-near-white mb-3">
            Lịch đăng
          </h4>
          <SchedulePanel postId={postId} platform={platform} />
        </div>

        <div className="pt-4 border-t border-frost space-y-3">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onCancel}
          >
            Hủy bỏ
          </Button>
        </div>

        <div className="pt-4 border-t border-frost space-y-2 text-xs text-muted-text">
          <p>
            Đã tạo:{' '}
            {new Date(post?.createdAt || '').toLocaleDateString('vi-VN')}
          </p>
          <p>
            Cập nhật:{' '}
            {new Date(post?.updatedAt || '').toLocaleDateString('vi-VN')}
          </p>
        </div>
      </div>
    </div>
  )
}
