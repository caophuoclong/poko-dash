import { FieldLabel } from './field-label'
import type { PropertyEditorProps } from './property-editor'

export function FieldPickerEditor({ schema, value, onChange }: PropertyEditorProps) {
  if (schema.type === 'field-picker' && typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return (
      <div className="space-y-1">
        <FieldLabel required={schema.required}>{schema.label}</FieldLabel>
        <textarea
          value={JSON.stringify(value, null, 2)}
          placeholder={schema.placeholder ?? '{"sourceField": "targetField"}'}
          rows={3}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value)
              onChange(schema.key, parsed)
            } catch {
              // let user keep typing invalid JSON
            }
          }}
          className="w-full px-2.5 py-1.5 rounded-lg border border-frost bg-void text-[12px] font-mono text-near-white placeholder:text-muted-text/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue/30 resize-none"
        />
        {schema.helperText && (
          <p className="text-[10px] text-muted-text/70">{schema.helperText}</p>
        )}
        {schema.exampleValue && (
          <p className="text-[10px] text-muted-text/70">
            Example: <code className="text-accent-blue">{schema.exampleValue}</code>
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <FieldLabel required={schema.required}>{schema.label}</FieldLabel>
      <input
        type="text"
        value={typeof value === 'string' ? value : ''}
        placeholder={schema.placeholder ?? 'Select field...'}
        onChange={(e) => onChange(schema.key, e.target.value)}
        className="w-full h-8 px-2.5 rounded-lg border border-frost bg-void text-[13px] text-near-white placeholder:text-muted-text/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue/30"
      />
      {schema.helperText && (
        <p className="text-[10px] text-muted-text/70">{schema.helperText}</p>
      )}
    </div>
  )
}
