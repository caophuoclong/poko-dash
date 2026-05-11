import { useState } from 'react'
import { X } from 'lucide-react'
import { FieldLabel } from './field-label'
import type { PropertyEditorProps } from './property-editor'

export function TagInputFieldEditor({
  schema,
  value,
  onChange,
}: PropertyEditorProps) {
  const tags: string[] = Array.isArray(value) ? value : []
  const [input, setInput] = useState('')

  const addTag = () => {
    const trimmed = input.trim()
    if (trimmed && !tags.includes(trimmed)) {
      onChange(schema.key, [...tags, trimmed])
    }
    setInput('')
  }

  const removeTag = (tag: string) => {
    onChange(
      schema.key,
      tags.filter((t) => t !== tag),
    )
  }

  return (
    <div className="space-y-1">
      <FieldLabel required={schema.required}>{schema.label}</FieldLabel>
      <div className="flex flex-wrap gap-1 p-1.5 rounded-lg border border-frost bg-void min-h-[32px]">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-accent-blue/10 text-[11px] text-accent-blue"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-accent-red transition-colors"
            >
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          placeholder={tags.length === 0 ? schema.placeholder : ''}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addTag()
            }
          }}
          className="flex-1 min-w-[60px] bg-transparent text-[12px] text-near-white placeholder:text-muted-text/50 focus:outline-none"
        />
      </div>
      {schema.helperText && (
        <p className="text-[10px] text-muted-text/70">{schema.helperText}</p>
      )}
    </div>
  )
}
