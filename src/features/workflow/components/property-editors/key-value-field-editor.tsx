import { Plus, X } from 'lucide-react'
import { FieldLabel } from './field-label'
import type { PropertyEditorProps } from './property-editor'

interface KeyValuePair {
  key: string
  value: string
}

export function KeyValueFieldEditor({
  schema,
  value,
  onChange,
}: PropertyEditorProps) {
  const pairs: KeyValuePair[] = Array.isArray(value)
    ? value
    : value && typeof value === 'object'
      ? Object.entries(value).map(([k, v]) => ({ key: k, value: String(v) }))
      : []

  const handleAdd = () => {
    onChange(schema.key, [...pairs, { key: '', value: '' }])
  }

  const handleRemove = (index: number) => {
    onChange(
      schema.key,
      pairs.filter((_, i) => i !== index),
    )
  }

  const handleChange = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...pairs]
    updated[index] = { ...updated[index], [field]: val }
    onChange(schema.key, updated)
  }

  return (
    <div className="space-y-1">
      <FieldLabel required={schema.required}>{schema.label}</FieldLabel>
      <div className="space-y-1.5">
        {pairs.map((pair, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <input
              type="text"
              value={pair.key}
              placeholder="Key"
              onChange={(e) => handleChange(i, 'key', e.target.value)}
              className="flex-1 h-7 px-2 rounded border border-frost bg-void text-[12px] text-near-white placeholder:text-muted-text/50 focus:outline-none focus:ring-1 focus:ring-accent-blue/20"
            />
            <input
              type="text"
              value={pair.value}
              placeholder="Value"
              onChange={(e) => handleChange(i, 'value', e.target.value)}
              className="flex-[2] h-7 px-2 rounded border border-frost bg-void text-[12px] text-near-white placeholder:text-muted-text/50 focus:outline-none focus:ring-1 focus:ring-accent-blue/20"
            />
            <button
              onClick={() => handleRemove(i)}
              className="w-6 h-6 flex items-center justify-center rounded text-muted-text hover:text-accent-red hover:bg-accent-red/10 transition-colors"
            >
              <X size={13} />
            </button>
          </div>
        ))}
        <button
          onClick={handleAdd}
          className="flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-medium text-accent-blue hover:bg-accent-blue/10 transition-colors"
        >
          <Plus size={12} />
          Add pair
        </button>
      </div>
      {schema.helperText && (
        <p className="text-[10px] text-muted-text/70 mt-1">
          {schema.helperText}
        </p>
      )}
    </div>
  )
}
