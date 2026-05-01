import { FieldLabel } from './field-label'
import type { PropertyEditorProps } from './property-editor'

export function TextFieldEditor({ schema, value, onChange, errors }: PropertyEditorProps) {
  return (
    <div className="space-y-1">
      <FieldLabel required={schema.required}>{schema.label}</FieldLabel>
      <input
        type="text"
        value={typeof value === 'string' ? value : ''}
        placeholder={schema.placeholder}
        onChange={(e) => onChange(schema.key, e.target.value)}
        className="w-full h-8 px-2.5 rounded-lg border border-frost bg-void text-[13px] text-near-white placeholder:text-muted-text/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue/30"
      />
      {schema.helperText && !errors?.length && (
        <p className="text-[10px] text-muted-text/70">{schema.helperText}</p>
      )}
    </div>
  )
}
