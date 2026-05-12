import { FieldLabel } from './field-label'
import type { PropertyEditorProps } from './property-editor'

export function ToggleFieldEditor({
  schema,
  value,
  onChange,
}: PropertyEditorProps) {
  const checked = Boolean(value ?? schema.defaultValue ?? false)

  return (
    <div className="flex items-center justify-between">
      <div>
        <FieldLabel required={schema.required}>{schema.label}</FieldLabel>
        {schema.helperText && (
          <p className="text-[10px] text-muted-text/70">{schema.helperText}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(schema.key, !checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
          checked ? 'bg-accent-blue' : 'bg-frost'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-near-white shadow-sm transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}
