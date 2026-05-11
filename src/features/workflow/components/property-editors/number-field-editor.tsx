import { FieldLabel } from './field-label'
import type { PropertyEditorProps } from './property-editor'

export function NumberFieldEditor({
  schema,
  value,
  onChange,
}: PropertyEditorProps) {
  return (
    <div className="space-y-1">
      <FieldLabel required={schema.required}>{schema.label}</FieldLabel>
      <input
        type="number"
        value={value !== undefined && value !== null ? String(value) : ''}
        min={schema.min}
        max={schema.max}
        step={schema.step ?? 1}
        placeholder={schema.placeholder}
        onChange={(e) =>
          onChange(
            schema.key,
            e.target.value === '' ? undefined : Number(e.target.value),
          )
        }
        className="w-full h-8 px-2.5 rounded-lg border border-frost bg-void text-[13px] text-near-white placeholder:text-muted-text/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue/30"
      />
      {schema.helperText && (
        <p className="text-[10px] text-muted-text/70">{schema.helperText}</p>
      )}
    </div>
  )
}
