import { FieldLabel } from './field-label'
import type { PropertyEditorProps } from './property-editor'

export function MultiSelectFieldEditor({ schema, value, onChange }: PropertyEditorProps) {
  const selected: string[] = Array.isArray(value) ? value : (Array.isArray(schema.defaultValue) ? schema.defaultValue as string[] : [])

  const toggle = (optionValue: string) => {
    const next = selected.includes(optionValue)
      ? selected.filter((v) => v !== optionValue)
      : [...selected, optionValue]
    onChange(schema.key, next)
  }

  return (
    <div className="space-y-1">
      <FieldLabel required={schema.required}>{schema.label}</FieldLabel>
      <div className="space-y-1">
        {schema.options?.map((o) => (
          <label
            key={o.value}
            className="flex items-center gap-2 py-1 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selected.includes(o.value)}
              onChange={() => toggle(o.value)}
              className="rounded border-frost bg-void text-accent-blue focus:ring-accent-blue/20 h-3.5 w-3.5"
            />
            <div>
              <span className="text-[12px] text-near-white">{o.label}</span>
              {o.description && (
                <span className="text-[10px] text-muted-text ml-1.5">{o.description}</span>
              )}
            </div>
          </label>
        ))}
      </div>
      {schema.helperText && (
        <p className="text-[10px] text-muted-text/70">{schema.helperText}</p>
      )}
    </div>
  )
}
