import { useCallback, useRef } from 'react'
import { FieldLabel } from './field-label'
import type { PropertyEditorProps } from './property-editor'

export function TextFieldEditor({ schema, value, onChange, errors }: PropertyEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('application/variable-ref')) {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    const varRef = e.dataTransfer.getData('application/variable-ref')
    if (!varRef) return
    e.preventDefault()
    const input = inputRef.current
    if (!input) return
    const start = input.selectionStart ?? 0
    const end = input.selectionEnd ?? 0
    const currentVal = typeof value === 'string' ? value : ''
    const before = currentVal.slice(0, start)
    const after = currentVal.slice(end)
    const insert = `{{${varRef}}}`
    const newVal = before + insert + after
    onChange(schema.key, newVal)
    requestAnimationFrame(() => {
      input.focus()
      input.setSelectionRange(start + insert.length, start + insert.length)
    })
  }, [value, onChange, schema.key])

  return (
    <div className="space-y-1">
      <FieldLabel required={schema.required}>{schema.label}</FieldLabel>
      <input
        ref={inputRef}
        type="text"
        value={typeof value === 'string' ? value : ''}
        placeholder={schema.placeholder}
        onChange={(e) => onChange(schema.key, e.target.value)}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="w-full h-8 px-2.5 rounded-lg border border-frost bg-void text-[13px] text-near-white placeholder:text-muted-text/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue/30"
      />
      {schema.helperText && !errors?.length && (
        <p className="text-[10px] text-muted-text/70">{schema.helperText}</p>
      )}
    </div>
  )
}
