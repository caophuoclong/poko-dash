import type { WorkflowNodeDefinition } from '../node-types'

export interface ConditionProps {
  logic: 'all' | 'any'
  rules: Array<{
    field: string
    operator: 'equals' | 'not_equals' | 'contains' | 'gt' | 'lt' | 'gte' | 'lte' | 'empty' | 'not_empty'
    value: string
  }>
  defaultBranch: 'pass' | 'fail'
}

export const ConditionDef: WorkflowNodeDefinition<ConditionProps> = {
  typeId: 'logic.condition',
  category: 'logic',
  title: 'Condition',
  description: 'Branch the workflow based on rules',
  icon: 'GitBranch',
  purpose: 'Route data through different paths based on conditional logic',
  inputs: [
    { id: 'input', label: 'Input', type: 'data' },
  ],
  outputs: [
    { id: 'pass', label: 'Pass', type: 'data' },
    { id: 'fail', label: 'Fail', type: 'data' },
  ],
  defaultProps: {
    logic: 'all',
    rules: [],
    defaultBranch: 'fail',
  },
  propertySchema: [
    {
      key: 'logic',
      label: 'Logic',
      type: 'select',
      required: true,
      defaultValue: 'all',
      options: [
        { value: 'all', label: 'ALL conditions must match' },
        { value: 'any', label: 'ANY condition must match' },
      ],
    },
    {
      key: 'rules',
      label: 'Condition Rules',
      type: 'rule-builder',
      required: true,
      defaultValue: [],
      helperText: 'Define the conditions that determine branching',
    },
    {
      key: 'defaultBranch',
      label: 'Default Branch',
      type: 'select',
      defaultValue: 'fail',
      options: [
        { value: 'pass', label: 'Pass (if no rules defined)' },
        { value: 'fail', label: 'Fail (if no rules defined)' },
      ],
      helperText: 'Which branch to take when no rules are configured',
    },
  ],
  validate: (props) => {
    const errors: import('../node-types').ValidationError[] = []
    if (!props.rules?.length) {
      errors.push({ propertyKey: 'rules', message: 'At least one condition rule is recommended', severity: 'warning' })
    }
    return errors
  },
  summaryFields: [
    { key: 'logic', label: 'Logic' },
    { key: 'rules', label: 'Rules', format: 'number' },
    { key: 'defaultBranch', label: 'Default' },
  ],
}
