import { Plus, X } from 'lucide-react'
import { FieldLabel } from './field-label'
import type { PropertyEditorProps } from './property-editor'

interface Assignment {
  key: string
  value: string
  type: 'string' | 'number' | 'boolean' | 'expression'
}

export function AssignmentsFieldEditor({
  schema,
  value,
  onChange,
}: PropertyEditorProps) {
  const assignments: Assignment[] = Array.isArray(value) ? value : []

  const handleAdd = () => {
    onChange(schema.key, [
      ...assignments,
      { key: '', value: '', type: 'string' },
    ])
  }

  const handleRemove = (index: number) => {
    onChange(
      schema.key,
      assignments.filter((_, i) => i !== index),
    )
  }

  const handleChange = (
    index: number,
    field: keyof Assignment,
    val: string,
  ) => {
    const updated = [...assignments]
    updated[index] = { ...updated[index], [field]: val }
    onChange(schema.key, updated)
  }

  return (
    <div className="space-y-1">
      <FieldLabel required={schema.required}>{schema.label}</FieldLabel>
      <div className="space-y-1.5">
        {assignments.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <input
              type="text"
              value={item.key}
              placeholder="Key"
              onChange={(e) => handleChange(i, 'key', e.target.value)}
              className="flex-1 h-7 px-2 rounded border border-frost bg-void text-[12px] text-near-white placeholder:text-muted-text/50 focus:outline-none focus:ring-1 focus:ring-accent-blue/20"
            />
            <span className="text-muted-text text-[12px]">=</span>
            <input
              type="text"
              value={item.value}
              placeholder="Value"
              onChange={(e) => handleChange(i, 'value', e.target.value)}
              className="flex-[2] h-7 px-2 rounded border border-frost bg-void text-[12px] text-near-white font-mono placeholder:text-muted-text/50 focus:outline-none focus:ring-1 focus:ring-accent-blue/20"
            />
            <select
              value={item.type}
              onChange={(e) => handleChange(i, 'type', e.target.value)}
              className="h-7 px-1.5 rounded border border-frost bg-void text-[11px] text-near-white focus:outline-none focus:ring-1 focus:ring-accent-blue/20"
            >
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
              <option value="expression">Expression</option>
            </select>
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
          Add field
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
