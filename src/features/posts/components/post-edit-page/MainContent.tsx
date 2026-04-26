import { Controller, type Control } from 'react-hook-form'
import FormField from './FormField'

import type {
  ContentPostCreateFormData,
  ContentPostEditFormData,
} from '#/features/posts/schemas/content-post.schema'
import {
  Autocomplete,
  type AutocompleteOption,
} from '#/components/ui/autocomplete'

interface MainContentProps {
  control: Control<ContentPostEditFormData | ContentPostCreateFormData>
  initialHashtags?: string[]
  setDefaultHashtags?: (hashtags: string[]) => void
}

export default function MainContent({
  control,
  initialHashtags = [],
  setDefaultHashtags,
}: MainContentProps) {
  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="bg-surface border border-frost rounded-2xl p-6 space-y-6">
        <FormField
          control={control}
          name="title"
          label="Tiêu đề"
          placeholder="Nhập tiêu đề bài viết..."
          type="text"
        />

        <FormField
          control={control}
          name="body"
          label="Nội dung"
          placeholder="Nhập nội dung bài viết..."
          type="editor"
          maxLength={10000}
        />
        <Controller
          control={control}
          name="hashtags"
          render={({ field }) => {
            const options =
              initialHashtags?.map((item) => ({
                value: item,
                label: item.includes('#') ? item : `#${item}`,
              })) || []
            const values = (field.value || [])
              .map((item) => options.find((option) => option.value === item))
              .filter(Boolean) as AutocompleteOption[]
            return (
              <Autocomplete
                placeholder="Nhập hashtags"
                options={options}
                {...field}
                value={values}
                emitValue="raw"
                multiple
                limitTags={15}
                allowCreate
                onCreateOption={(option) =>
                  setDefaultHashtags?.([...initialHashtags, option.value])
                }
              />
            )
          }}
        />
      </div>
    </div>
  )
}
