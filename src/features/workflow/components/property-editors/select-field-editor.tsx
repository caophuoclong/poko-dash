import { FieldLabel } from './field-label'
import type { PropertyEditorProps } from './property-editor'

export function SelectFieldEditor({ schema, value, onChange }: PropertyEditorProps) {
  return (
    <div className="space-y-1">
      <FieldLabel required={schema.required}>{schema.label}</FieldLabel>
      <select
        value={String(value ?? schema.defaultValue ?? '')}
        onChange={(e) => onChange(schema.key, e.target.value)}
        className="w-full h-8 px-2.5 rounded-lg border border-frost bg-void text-[13px] text-near-white focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue/30"
      >
        {schema.options?.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {schema.helperText && (
        <p className="text-[10px] text-muted-text/70">{schema.helperText}</p>
      )}
    </div>
  )
}
