import TiptapEditorWrapper from '#/components/editor/tiptap-editor-wrapper'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'
import { Controller } from 'react-hook-form'
import type { Control } from 'react-hook-form'

interface FormFieldProps<T extends Record<string, any> = Record<string, any>> {
  control: Control<T>
  name: keyof T
  label: string
  placeholder?: string
  type?: 'text' | 'textarea' | 'editor'
  rows?: number
  maxLength?: number
}

export default function FormField<
  T extends Record<string, any> = Record<string, any>,
>({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  rows = 2,
  maxLength,
}: FormFieldProps<T>) {
  return (
    <div>
      <label
        htmlFor={name as string}
        className="block text-sm text-near-white mb-2 font-medium"
      >
        {label}
      </label>
      <Controller
        name={name as any}
        control={control}
        render={({ field }) => {
          if (type === 'textarea') {
            const textareaValue = Array.isArray(field.value)
              ? field.value.join('; ')
              : (field.value ?? '')

            return (
              <Textarea
                id={name as string}
                value={textareaValue}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
                onChange={(event) => {
                  const raw = event.target.value
                  const parsed = Array.isArray(field.value)
                    ? raw
                        .split(/[;,\n]/)
                        .map((item) => item.trim())
                        .filter(Boolean)
                    : raw
                  field.onChange(parsed)
                }}
                placeholder={placeholder}
                rows={rows}
              />
            )
          }

          if (type === 'editor') {
            return (
              <TiptapEditorWrapper
                value={field.value}
                onChange={field.onChange}
                placeholder={placeholder}
                maxLength={maxLength}
              />
            )
          }

          return (
            <Input id={name as string} {...field} placeholder={placeholder} />
          )
        }}
      />
    </div>
  )
}
