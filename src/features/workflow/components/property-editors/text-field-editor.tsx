import { useCallback, useRef, useState } from 'react'
import { Variable } from 'lucide-react'
import { FieldLabel } from './field-label'
import { VariablePicker } from '../variable-picker'
import { TemplateLint } from './template-lint'
import type { PropertyEditorProps } from './property-editor'

export function TextFieldEditor({
  schema,
  value,
  onChange,
  errors,
  availableVars,
}: PropertyEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null)
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
      const input = inputRef.current
      if (!input) return
      const start = input.selectionStart ?? 0
      const end = input.selectionEnd ?? 0
      const currentVal = typeof value === 'string' ? value : ''
      const before = currentVal.slice(0, start)
      const after = currentVal.slice(end)
      const newVal = before + insertText + after
      onChange(schema.key, newVal)
      requestAnimationFrame(() => {
        input.focus()
        input.setSelectionRange(
          start + insertText.length,
          start + insertText.length,
        )
      })
    },
    [value, onChange, schema.key],
  )

  const handlePickerToggle = useCallback(() => {
    if (!inputRef.current) return
    const rect = inputRef.current.getBoundingClientRect()
    setPickerAnchor({ top: rect.bottom + 4, left: rect.left })
    setPickerOpen((v) => !v)
  }, [])

  const handleInsert = useCallback(
    (varRef: string) => {
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
    },
    [value, onChange, schema.key],
  )

  return (
    <div className="space-y-1">
      <FieldLabel required={schema.required}>{schema.label}</FieldLabel>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={typeof value === 'string' ? value : ''}
          placeholder={schema.placeholder}
          onChange={(e) => onChange(schema.key, e.target.value)}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="w-full h-8 px-2.5 pr-9 rounded-lg border border-frost bg-void text-[13px] text-near-white placeholder:text-muted-text/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue/30"
        />
        {availableVars && availableVars.length > 0 && (
          <button
            type="button"
            onClick={handlePickerToggle}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded text-muted-text hover:text-accent-blue hover:bg-accent-blue/10 transition-colors"
            title="Insert variable"
          >
            <Variable size={13} />
          </button>
        )}
      </div>
      {schema.helperText && !errors?.length && (
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
