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
  | 'url'
  | 'json'
  | 'code'
  | 'keyValue'
  | 'assignments'
  | 'conditions'

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
  enum?: string[]
  visibleWhen?: (props: Record<string, unknown>) => boolean
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

export interface SummaryFieldConfig {
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

export interface NodeDefinitionRecord {
  typeId: string
  category: WorkflowNodeCategory
  title: string
  description: string
  icon: string
  purpose: string
  inputs: PortDefinition[]
  outputs: PortDefinition[]
  defaultProps: Record<string, unknown>
  propertySchema: PropertySchema[]
  summaryFields: SummaryFieldConfig[]
  builtIn: boolean
  version: number
}

export interface NodeDefinition extends NodeDefinitionRecord {
  validate: (props: Record<string, unknown>) => ValidationError[]
}
