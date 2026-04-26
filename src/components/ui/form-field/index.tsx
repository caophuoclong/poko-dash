// layer: component
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'
import { cn } from '#/shared/utils'

interface FormFieldProps {
  label: string
  required?: boolean
  error?: string
  as?: 'input' | 'textarea'
  textareaRows?: number
  className?: string
  [key: string]: unknown
}

export function FormField({
  label,
  required = false,
  error,
  as = 'input',
  textareaRows = 3,
  className,
  ...props
}: FormFieldProps) {
  const Component = as === 'textarea' ? Textarea : Input

  return (
    <div>
      <label className="text-xs font-semibold text-muted-text uppercase tracking-wider mb-1.5 block">
        {label} {required && <span className="text-accent-red">*</span>}
      </label>
      <Component
        className={cn(
          'bg-surface-2 border-frost text-near-white placeholder:text-muted-text',
          error && 'border-accent-red',
          as === 'textarea' && 'resize-none',
          className,
        )}
        rows={textareaRows}
        {...props}
      />
      {error && <p className="text-xs text-accent-red mt-1">{error}</p>}
    </div>
  )
}
