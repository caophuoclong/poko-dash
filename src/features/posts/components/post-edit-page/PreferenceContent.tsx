import type { Control } from 'react-hook-form'

import type { ContentPostEditFormData } from '#/features/posts/schemas/content-post.schema'
import CreatePreferenceContent from './CreatePreferenceContent'

interface PreferenceContentProps {
  control: Control<ContentPostEditFormData>
  onCancel: () => void
  isPublishing?: boolean
}

export default function PreferenceContent({
  control,
  onCancel,
  isPublishing = false,
}: PreferenceContentProps) {
  return (
    <CreatePreferenceContent
      control={control}
      onCancel={onCancel}
      onPublishLabel="Publish"
      isPublishing={isPublishing}
    />
  )
}
