import { useState, useCallback, useRef, useEffect } from 'react'
import { Variable, ArrowRight } from 'lucide-react'
import { cn } from '#/shared/utils'
import { FieldLabel } from './field-label'
import {
  VariablePicker,
  extractVariables,
  highlightVariables,
} from '../variable-system'
import type { VariableRef } from '../variable-system'

interface VariableFieldEditorProps {
  label: string
  required?: boolean
  value: string
  onChange: (value: string) => void
  placeholder?: string
  helperText?: string
  availableVariables: VariableRef[]
  error?: string
}

export function VariableFieldEditor({
  label,
  required,
  value,
  onChange,
  placeholder,
  helperText,
  availableVariables,
  error,
}: VariableFieldEditorProps) {
  const [showPicker, setShowPicker] = useState(false)
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 })
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const vars = extractVariables(value)
  const hasInvalidVar = vars.some(
    (v) => !availableVariables.some((a) => a.id === v),
  )

  const handleInsertVar = useCallback(
    (varRef: string) => {
      const textarea = textareaRef.current
      if (!textarea) return
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const before = value.slice(0, start)
      const after = value.slice(end)
      const insert = `{{${varRef}}}`
      const newVal = before + insert + after
      onChange(newVal)
      requestAnimationFrame(() => {
        textarea.focus()
        const cursorPos = start + insert.length
        textarea.setSelectionRange(cursorPos, cursorPos)
      })
    },
    [value, onChange],
  )

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value)
    },
    [onChange],
  )

  const handleKeyDown = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    const cursorPos = textarea.selectionStart
    const textBefore = value.slice(0, cursorPos)

    if (textBefore.endsWith('{{')) {
      const rect = textarea.getBoundingClientRect()
      setPickerPosition({
        top: rect.bottom + 4,
        left: rect.left,
      })
      setShowPicker(true)
    }
  }, [value])

  const handleInsertClick = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setPickerPosition({
        top: rect.bottom + 4,
        left: rect.left,
      })
      setShowPicker(true)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = () => {
      if (showPicker) {
        setShowPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showPicker])

  const highlighted = highlightVariables(value, availableVariables)

  return (
    <div className="space-y-1" ref={containerRef}>
      <div className="flex items-center justify-between">
        <FieldLabel required={required}>{label}</FieldLabel>
        <button
          type="button"
          onClick={handleInsertClick}
          className="inline-flex items-center gap-1 text-[10px] text-accent-blue hover:text-accent-blue/80 transition-colors font-medium"
        >
          <Variable size={11} />
          Insert variable
        </button>
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        placeholder={placeholder}
        rows={4}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        className="w-full px-2.5 py-1.5 rounded-lg border border-frost bg-void text-[13px] text-near-white placeholder:text-muted-text/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue/30 resize-none font-mono"
      />

      {value.length > 0 && (
        <div className="px-2.5 py-2 rounded-lg bg-surface-2/50 border border-frost">
          <div className="flex items-center gap-1.5 mb-1">
            <ArrowRight size={11} className="text-muted-text" />
            <span className="text-[10px] font-medium text-muted-text uppercase tracking-wider">
              Preview
            </span>
          </div>
          <p className="text-[12px] text-near-white leading-relaxed">
            {highlighted.map((part, i) => {
              if (typeof part === 'string') return <span key={i}>{part}</span>
              return (
                <span
                  key={i}
                  className={cn(
                    'inline-block px-1 py-px rounded text-[11px] font-mono',
                    part.valid
                      ? 'bg-accent-green-dim text-accent-green'
                      : 'bg-accent-red/10 text-accent-red',
                  )}
                >
                  {`{{${part.ref}}}`}
                </span>
              )
            })}
          </p>
        </div>
      )}

      {hasInvalidVar && (
        <p className="text-[10px] text-accent-red flex items-center gap-1">
          Some variables could not be resolved
        </p>
      )}

      {helperText && !error && !hasInvalidVar && (
        <p className="text-[10px] text-muted-text/70">{helperText}</p>
      )}

      {error && <p className="text-[10px] text-accent-red">{error}</p>}

      {showPicker && (
        <div onClick={(e) => e.stopPropagation()}>
          <VariablePicker
            variables={availableVariables}
            onInsert={handleInsertVar}
            onClose={() => setShowPicker(false)}
            anchorRect={pickerPosition}
          />
        </div>
      )}
    </div>
  )
}

interface VariableTextInputProps {
  label: string
  required?: boolean
  value: string
  onChange: (value: string) => void
  placeholder?: string
  helperText?: string
  availableVariables: VariableRef[]
  error?: string
}

export function VariableTextInput({
  label,
  required,
  value,
  onChange,
  placeholder,
  helperText,
  availableVariables,
  error,
}: VariableTextInputProps) {
  const [showPicker, setShowPicker] = useState(false)
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 })
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const vars = extractVariables(value)
  const hasInvalidVar = vars.some(
    (v) => !availableVariables.some((a) => a.id === v),
  )

  const handleInsertVar = useCallback(
    (varRef: string) => {
      const input = inputRef.current
      if (!input) return
      const start = input.selectionStart ?? value.length
      const end = input.selectionEnd ?? value.length
      const before = value.slice(0, start)
      const after = value.slice(end)
      const insert = `{{${varRef}}}`
      const newVal = before + insert + after
      onChange(newVal)
      requestAnimationFrame(() => {
        input.focus()
        const cursorPos = start + insert.length
        input.setSelectionRange(cursorPos, cursorPos)
      })
    },
    [value, onChange],
  )

  const handleKeyDown = useCallback(() => {
    const input = inputRef.current
    if (!input) return
    const cursorPos = input.selectionStart ?? 0
    const textBefore = value.slice(0, cursorPos)

    if (textBefore.endsWith('{{')) {
      const rect = input.getBoundingClientRect()
      setPickerPosition({ top: rect.bottom + 4, left: rect.left })
      setShowPicker(true)
    }
  }, [value])

  const handleInsertClick = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setPickerPosition({ top: rect.bottom + 4, left: rect.left })
      setShowPicker(true)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = () => {
      if (showPicker) setShowPicker(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showPicker])

  return (
    <div className="space-y-1" ref={containerRef}>
      <div className="flex items-center justify-between">
        <FieldLabel required={required}>{label}</FieldLabel>
        <button
          type="button"
          onClick={handleInsertClick}
          className="inline-flex items-center gap-1 text-[10px] text-accent-blue hover:text-accent-blue/80 transition-colors font-medium"
        >
          <Variable size={11} />
          Insert variable
        </button>
      </div>

      <input
        ref={inputRef}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full h-8 px-2.5 rounded-lg border border-frost bg-void text-[13px] font-mono text-near-white placeholder:text-muted-text/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue/30"
      />

      {hasInvalidVar && (
        <p className="text-[10px] text-accent-red flex items-center gap-1">
          Some variables could not be resolved
        </p>
      )}

      {helperText && !error && !hasInvalidVar && (
        <p className="text-[10px] text-muted-text/70">{helperText}</p>
      )}

      {error && <p className="text-[10px] text-accent-red">{error}</p>}

      {showPicker && (
        <div onClick={(e) => e.stopPropagation()}>
          <VariablePicker
            variables={availableVariables}
            onInsert={handleInsertVar}
            onClose={() => setShowPicker(false)}
            anchorRect={pickerPosition}
          />
        </div>
      )}
    </div>
  )
}
