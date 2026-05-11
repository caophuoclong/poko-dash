import { Plus, X } from 'lucide-react'
import { FieldLabel } from './field-label'
import type { PropertyEditorProps } from './property-editor'

const OPERATORS = [
  { value: 'equals', label: '=' },
  { value: 'notEquals', label: '≠' },
  { value: 'contains', label: 'contains' },
  { value: 'notContains', label: '!contains' },
  { value: 'startsWith', label: 'starts with' },
  { value: 'endsWith', label: 'ends with' },
  { value: 'gt', label: '>' },
  { value: 'gte', label: '≥' },
  { value: 'lt', label: '<' },
  { value: 'lte', label: '≤' },
  { value: 'isEmpty', label: 'is empty' },
  { value: 'isNotEmpty', label: 'is not empty' },
  { value: 'regex', label: 'matches regex' },
]

interface Condition {
  left: string
  operator: string
  right: string
}

interface ConditionsValue {
  conditions: Condition[]
  combineWith: 'AND' | 'OR'
}

export function ConditionsFieldEditor({
  schema,
  value,
  onChange,
}: PropertyEditorProps) {
  const data: ConditionsValue =
    value && typeof value === 'object' && 'conditions' in value
      ? (value as ConditionsValue)
      : { conditions: [], combineWith: 'AND' }

  const handleAdd = () => {
    onChange(schema.key, {
      ...data,
      conditions: [
        ...data.conditions,
        { left: '', operator: 'equals', right: '' },
      ],
    })
  }

  const handleRemove = (index: number) => {
    onChange(schema.key, {
      ...data,
      conditions: data.conditions.filter((_, i) => i !== index),
    })
  }

  const handleChange = (index: number, field: keyof Condition, val: string) => {
    const updated = [...data.conditions]
    updated[index] = { ...updated[index], [field]: val }
    onChange(schema.key, { ...data, conditions: updated })
  }

  const handleCombineChange = (combine: 'AND' | 'OR') => {
    onChange(schema.key, { ...data, combineWith: combine })
  }

  const needsRightInput = (op: string) => {
    return op !== 'isEmpty' && op !== 'isNotEmpty'
  }

  return (
    <div className="space-y-1">
      <FieldLabel required={schema.required}>{schema.label}</FieldLabel>
      <div className="space-y-1.5">
        {data.conditions.map((cond, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <input
              type="text"
              value={cond.left}
              placeholder="Left expression"
              onChange={(e) => handleChange(i, 'left', e.target.value)}
              className="flex-1 h-7 px-2 rounded border border-frost bg-void text-[12px] font-mono text-near-white placeholder:text-muted-text/50 focus:outline-none focus:ring-1 focus:ring-accent-blue/20"
            />
            <select
              value={cond.operator}
              onChange={(e) => handleChange(i, 'operator', e.target.value)}
              className="h-7 px-1.5 rounded border border-frost bg-void text-[11px] text-near-white focus:outline-none focus:ring-1 focus:ring-accent-blue/20"
            >
              {OPERATORS.map((op) => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>
            {needsRightInput(cond.operator) && (
              <input
                type="text"
                value={cond.right}
                placeholder="Right expression"
                onChange={(e) => handleChange(i, 'right', e.target.value)}
                className="flex-1 h-7 px-2 rounded border border-frost bg-void text-[12px] font-mono text-near-white placeholder:text-muted-text/50 focus:outline-none focus:ring-1 focus:ring-accent-blue/20"
              />
            )}
            <button
              onClick={() => handleRemove(i)}
              className="w-6 h-6 flex items-center justify-center rounded text-muted-text hover:text-accent-red hover:bg-accent-red/10 transition-colors"
            >
              <X size={13} />
            </button>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-medium text-accent-blue hover:bg-accent-blue/10 transition-colors"
          >
            <Plus size={12} />
            Add condition
          </button>
          {data.conditions.length > 1 && (
            <div className="ml-auto flex items-center gap-1">
              <span className="text-[10px] text-muted-text">Combine:</span>
              <button
                onClick={() => handleCombineChange('AND')}
                className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                  data.combineWith === 'AND'
                    ? 'bg-accent-blue text-white'
                    : 'bg-surface-2 text-muted-text hover:text-near-white'
                }`}
              >
                AND
              </button>
              <button
                onClick={() => handleCombineChange('OR')}
                className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                  data.combineWith === 'OR'
                    ? 'bg-accent-blue text-white'
                    : 'bg-surface-2 text-muted-text hover:text-near-white'
                }`}
              >
                OR
              </button>
            </div>
          )}
        </div>
      </div>
      {schema.helperText && (
        <p className="text-[10px] text-muted-text/70 mt-1">
          {schema.helperText}
        </p>
      )}
    </div>
  )
}
