import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { FieldLabel } from './field-label'
import type { PropertyEditorProps } from './property-editor'

export function UrlFieldEditor({
  schema,
  value,
  onChange,
}: PropertyEditorProps) {
  const [error, setError] = useState<string | null>(null)

  const handleChange = (val: string) => {
    onChange(schema.key, val)

    if (!val) {
      setError(null)
      return
    }

    try {
      new URL(val)
      setError(null)
    } catch {
      setError('Invalid URL format')
    }
  }

  return (
    <div className="space-y-1">
      <FieldLabel required={schema.required}>{schema.label}</FieldLabel>
      <input
        type="url"
        value={typeof value === 'string' ? value : ''}
        placeholder={schema.placeholder ?? 'https://example.com'}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full h-8 px-2.5 rounded-lg border border-frost bg-void text-[13px] text-near-white placeholder:text-muted-text/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue/30"
      />
      {error && (
        <div className="flex items-center gap-1 text-accent-red">
          <AlertCircle size={11} />
          <span className="text-[10px]">{error}</span>
        </div>
      )}
      {schema.helperText && !error && (
        <p className="text-[10px] text-muted-text/70">{schema.helperText}</p>
      )}
    </div>
  )
}
