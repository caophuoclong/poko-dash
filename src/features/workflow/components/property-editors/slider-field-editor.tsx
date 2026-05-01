import { FieldLabel } from './field-label'
import type { PropertyEditorProps } from './property-editor'

export function SliderFieldEditor({ schema, value, onChange }: PropertyEditorProps) {
  const num = Number(value ?? schema.defaultValue ?? schema.min ?? 0)
  const min = schema.min ?? 0
  const max = schema.max ?? 100

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <FieldLabel required={schema.required}>{schema.label}</FieldLabel>
        <span className="text-[12px] font-medium text-near-white tabular-nums">{num}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={schema.step ?? 1}
        value={num}
        onChange={(e) => onChange(schema.key, Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-frost cursor-pointer accent-accent-blue"
      />
      {schema.helperText && (
        <p className="text-[10px] text-muted-text/70">{schema.helperText}</p>
      )}
    </div>
  )
}
