import { useCallback, useRef } from 'react'
import { FieldLabel } from './field-label'
import type { PropertyEditorProps } from './property-editor'

export function TextareaFieldEditor({ schema, value, onChange }: PropertyEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const currentVal = typeof value === 'string' ? value : ''
    const before = currentVal.slice(0, start)
    const after = currentVal.slice(end)
    const insert = `{{${varRef}}}`
    const newVal = before + insert + after
    onChange(schema.key, newVal)
    requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(start + insert.length, start + insert.length)
    })
  }, [value, onChange, schema.key])

  return (
    <div className="space-y-1">
      <FieldLabel required={schema.required}>{schema.label}</FieldLabel>
      <textarea
        ref={textareaRef}
        value={typeof value === 'string' ? value : ''}
        placeholder={schema.placeholder}
        rows={3}
        onChange={(e) => onChange(schema.key, e.target.value)}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="w-full px-2.5 py-1.5 rounded-lg border border-frost bg-void text-[13px] text-near-white placeholder:text-muted-text/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue/30 resize-none"
      />
      {schema.helperText && (
        <p className="text-[10px] text-muted-text/70">{schema.helperText}</p>
      )}
    </div>
  )
}
