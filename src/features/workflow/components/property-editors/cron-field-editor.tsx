import { FieldLabel } from './field-label'
import type { PropertyEditorProps } from './property-editor'

export function CronFieldEditor({ schema, value, onChange }: PropertyEditorProps) {
  return (
    <div className="space-y-1">
      <FieldLabel required={schema.required}>{schema.label}</FieldLabel>
      <input
        type="text"
        value={typeof value === 'string' ? value : ''}
        placeholder={schema.placeholder ?? '0 */6 * * *'}
        onChange={(e) => onChange(schema.key, e.target.value)}
        className="w-full h-8 px-2.5 rounded-lg border border-frost bg-void text-[13px] text-near-white font-mono placeholder:text-muted-text/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue/30"
      />
      {schema.exampleValue && (
        <p className="text-[10px] text-muted-text/70">
          Example: <code className="text-accent-blue">{schema.exampleValue}</code>
        </p>
      )}
      {schema.helperText && (
        <p className="text-[10px] text-muted-text/70">{schema.helperText}</p>
      )}
    </div>
  )
}
