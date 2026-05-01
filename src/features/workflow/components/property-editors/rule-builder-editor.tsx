import { Plus, Trash2 } from 'lucide-react'
import { FieldLabel } from './field-label'
import type { PropertyEditorProps } from './property-editor'

interface Rule {
  field: string
  operator: string
  value: string
}

const OPERATOR_OPTIONS = [
  { value: 'equals', label: 'equals' },
  { value: 'not_equals', label: 'not equals' },
  { value: 'contains', label: 'contains' },
  { value: 'gt', label: '>' },
  { value: 'lt', label: '<' },
  { value: 'gte', label: '>=' },
  { value: 'lte', label: '<=' },
  { value: 'empty', label: 'is empty' },
  { value: 'not_empty', label: 'is not empty' },
]

export function RuleBuilderEditor({ schema, value, onChange }: PropertyEditorProps) {
  const rules: Rule[] = Array.isArray(value) ? value : []

  const updateRule = (index: number, partial: Partial<Rule>) => {
    const next = rules.map((r, i) => (i === index ? { ...r, ...partial } : r))
    onChange(schema.key, next)
  }

  const addRule = () => {
    onChange(schema.key, [...rules, { field: '', operator: 'equals', value: '' }])
  }

  const removeRule = (index: number) => {
    onChange(schema.key, rules.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-1.5">
      <FieldLabel required={schema.required}>{schema.label}</FieldLabel>
      <div className="space-y-1.5">
        {rules.map((rule, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <input
              type="text"
              value={rule.field}
              placeholder="field"
              onChange={(e) => updateRule(i, { field: e.target.value })}
              className="flex-1 h-7 px-2 rounded-md border border-frost bg-void text-[12px] text-near-white placeholder:text-muted-text/50 focus:outline-none focus:ring-1 focus:ring-accent-blue/20"
            />
            <select
              value={rule.operator}
              onChange={(e) => updateRule(i, { operator: e.target.value })}
              className="h-7 px-1.5 rounded-md border border-frost bg-void text-[11px] text-near-white focus:outline-none"
            >
              {OPERATOR_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <input
              type="text"
              value={rule.value}
              placeholder="value"
              onChange={(e) => updateRule(i, { value: e.target.value })}
              className="flex-1 h-7 px-2 rounded-md border border-frost bg-void text-[12px] text-near-white placeholder:text-muted-text/50 focus:outline-none focus:ring-1 focus:ring-accent-blue/20"
            />
            <button
              type="button"
              onClick={() => removeRule(i)}
              className="shrink-0 w-6 h-6 flex items-center justify-center rounded text-muted-text hover:text-accent-red transition-colors"
            >
              <Trash2 size={11} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addRule}
        className="flex items-center gap-1 text-[11px] text-accent-blue hover:text-accent-blue/80 transition-colors"
      >
        <Plus size={11} />
        Add Rule
      </button>
      {schema.helperText && (
        <p className="text-[10px] text-muted-text/70">{schema.helperText}</p>
      )}
    </div>
  )
}
