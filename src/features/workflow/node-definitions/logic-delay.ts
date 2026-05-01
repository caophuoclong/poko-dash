import type { WorkflowNodeDefinition } from '../node-types'

export interface DelayWaitUntilProps {
  delayType: 'fixed' | 'until_time' | 'until_condition'
  delayMinutes: number
  waitUntilTime: string
  waitConditionField: string
  waitConditionValue: string
  maxWaitHours: number
}

export const DelayWaitUntilDef: WorkflowNodeDefinition<DelayWaitUntilProps> = {
  typeId: 'logic.delay',
  category: 'logic',
  title: 'Delay / Wait Until',
  description: 'Pause the workflow for a duration or until a condition is met',
  icon: 'Timer',
  purpose: 'Add time delays or wait for external conditions before proceeding',
  inputs: [
    { id: 'input', label: 'Input', type: 'data' },
  ],
  outputs: [
    { id: 'output', label: 'Continue', type: 'data' },
  ],
  defaultProps: {
    delayType: 'fixed',
    delayMinutes: 30,
    waitUntilTime: '09:00',
    waitConditionField: '',
    waitConditionValue: '',
    maxWaitHours: 48,
  },
  propertySchema: [
    {
      key: 'delayType',
      label: 'Delay Type',
      type: 'select',
      required: true,
      defaultValue: 'fixed',
      options: [
        { value: 'fixed', label: 'Fixed Delay', description: 'Wait a specific amount of time' },
        { value: 'until_time', label: 'Wait Until Time', description: 'Wait until a specific time of day' },
        { value: 'until_condition', label: 'Wait Until Condition', description: 'Wait until a field meets a value' },
      ],
    },
    {
      key: 'delayMinutes',
      label: 'Delay (minutes)',
      type: 'number',
      defaultValue: 30,
      min: 1,
      max: 10080,
      helperText: '1 min – 7 days',
      visibleWhen: (p) => p.delayType === 'fixed',
    },
    {
      key: 'waitUntilTime',
      label: 'Wait Until',
      type: 'text',
      defaultValue: '09:00',
      placeholder: '09:00',
      helperText: 'Time of day in HH:mm format (uses workflow timezone)',
      visibleWhen: (p) => p.delayType === 'until_time',
      validate: (v) => {
        const val = String(v ?? '').trim()
        if (val && !/^\d{2}:\d{2}$/.test(val)) return 'Use HH:mm format (e.g. 09:00)'
        return null
      },
    },
    {
      key: 'waitConditionField',
      label: 'Condition Field',
      type: 'field-picker',
      placeholder: 'Select field to watch...',
      helperText: 'The data field to check',
      visibleWhen: (p) => p.delayType === 'until_condition',
    },
    {
      key: 'waitConditionValue',
      label: 'Expected Value',
      type: 'text',
      placeholder: 'Expected value',
      helperText: 'Continue when field equals this value',
      visibleWhen: (p) => p.delayType === 'until_condition',
    },
    {
      key: 'maxWaitHours',
      label: 'Max Wait (hours)',
      type: 'number',
      defaultValue: 48,
      min: 1,
      max: 720,
      helperText: 'Timeout if condition is never met',
    },
  ],
  validate: (props) => {
    const errors: import('../node-types').ValidationError[] = []
    if (props.delayType === 'fixed' && Number(props.delayMinutes) < 1) {
      errors.push({ propertyKey: 'delayMinutes', message: 'Delay must be at least 1 minute', severity: 'error' })
    }
    if (props.delayType === 'until_condition' && !props.waitConditionField?.trim()) {
      errors.push({ propertyKey: 'waitConditionField', message: 'Condition field is required', severity: 'error' })
    }
    return errors
  },
  summaryFields: [
    { key: 'delayType', label: 'Type' },
    { key: 'delayMinutes', label: 'Delay', format: 'number' },
    { key: 'waitUntilTime', label: 'Until' },
  ],
}
