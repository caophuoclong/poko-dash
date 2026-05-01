export type WorkflowNodeCategory =
  | 'trigger'
  | 'source'
  | 'crawl'
  | 'product'
  | 'affiliate'
  | 'content'
  | 'publish'
  | 'metric'
  | 'logic'
  | 'utility'

export type PropertyEditorType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'multi-select'
  | 'toggle'
  | 'date'
  | 'datetime'
  | 'cron'
  | 'field-picker'
  | 'rule-builder'
  | 'tag-input'
  | 'slider'

export interface PropertyOption {
  value: string
  label: string
  description?: string
}

export interface PropertySchema {
  key: string
  label: string
  type: PropertyEditorType
  required?: boolean
  defaultValue?: unknown
  placeholder?: string
  helperText?: string
  exampleValue?: string
  options?: PropertyOption[]
  min?: number
  max?: number
  step?: number
  dependsOn?: string
  visibleWhen?: (props: Record<string, unknown>) => boolean
  validate?: (value: unknown) => string | null
}

export interface PortDefinition {
  id: string
  label: string
  type: 'data' | 'signal' | 'error'
}

export interface ValidationError {
  propertyKey: string
  message: string
  severity: 'error' | 'warning'
}

export interface SummaryField {
  key: string
  label: string
  format?: 'text' | 'number' | 'percent' | 'list' | 'badge' | 'cron'
}

export interface CategoryConfig {
  label: string
  color: string
  bgColor: string
  borderColor: string
}

export interface WorkflowNodeDefinition<TProps = Record<string, unknown>> {
  typeId: string
  category: WorkflowNodeCategory
  title: string
  description: string
  icon: string
  purpose: string
  inputs: PortDefinition[]
  outputs: PortDefinition[]
  defaultProps: TProps
  propertySchema: PropertySchema[]
  validate: (props: TProps) => ValidationError[]
  summaryFields: SummaryField[]
}
