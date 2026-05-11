import { useCallback, useRef, useState } from 'react'
import { Variable } from 'lucide-react'
import { FieldLabel } from './field-label'
import { VariablePicker } from '../variable-picker'
import { TemplateLint } from './template-lint'
import type { PropertyEditorProps } from './property-editor'

export function TextareaFieldEditor({
  schema,
  value,
  onChange,
  availableVars,
}: PropertyEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerAnchor, setPickerAnchor] = useState<
    { top: number; left: number } | undefined
  >()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (
      e.dataTransfer.types.includes('application/variable-ref') ||
      e.dataTransfer.types.includes('text/plain')
    ) {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      const varRef = e.dataTransfer.getData('application/variable-ref')
      const plainText = e.dataTransfer.getData('text/plain')
      const insertText = varRef ? `{{${varRef}}}` : plainText
      if (!insertText) return
      e.preventDefault()
      const textarea = textareaRef.current
      if (!textarea) return
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const currentVal = typeof value === 'string' ? value : ''
      const before = currentVal.slice(0, start)
      const after = currentVal.slice(end)
      const newVal = before + insertText + after
      onChange(schema.key, newVal)
      requestAnimationFrame(() => {
        textarea.focus()
        textarea.setSelectionRange(
          start + insertText.length,
          start + insertText.length,
        )
      })
    },
    [value, onChange, schema.key],
  )

  const handlePickerToggle = useCallback(() => {
    if (!textareaRef.current) return
    const rect = textareaRef.current.getBoundingClientRect()
    setPickerAnchor({ top: rect.bottom + 4, left: rect.left })
    setPickerOpen((v) => !v)
  }, [])

  const handleInsert = useCallback(
    (varRef: string) => {
      const textarea = textareaRef.current
      if (!textarea) return
      const start = textarea.selectionStart ?? 0
      const end = textarea.selectionEnd ?? 0
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
    },
    [value, onChange, schema.key],
  )

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <FieldLabel required={schema.required}>{schema.label}</FieldLabel>
        {availableVars && availableVars.length > 0 && (
          <button
            type="button"
            onClick={handlePickerToggle}
            className="w-5 h-5 flex items-center justify-center rounded text-muted-text hover:text-accent-blue hover:bg-accent-blue/10 transition-colors"
            title="Insert variable"
          >
            <Variable size={12} />
          </button>
        )}
      </div>
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
      {pickerOpen && availableVars && (
        <VariablePicker
          variables={availableVars}
          onInsert={handleInsert}
          onClose={() => setPickerOpen(false)}
          anchorRect={pickerAnchor}
        />
      )}
      {availableVars && value && typeof value === 'string' && (
        <TemplateLint value={value} availableVars={availableVars} />
      )}
    </div>
  )
}
