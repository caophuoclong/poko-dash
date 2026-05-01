import type { WorkflowNodeDefinition } from '../node-types'

export interface ScheduleTriggerProps {
  scheduleType: 'cron' | 'interval'
  cronExpression: string
  intervalMinutes: number
  timezone: string
  enabled: boolean
}

export const ScheduleTriggerDef: WorkflowNodeDefinition<ScheduleTriggerProps> = {
  typeId: 'trigger.schedule',
  category: 'trigger',
  title: 'Schedule Trigger',
  description: 'Run the workflow on a recurring schedule',
  icon: 'Clock',
  purpose: 'Automate workflow execution on a time-based schedule using cron or interval',
  inputs: [],
  outputs: [
    { id: 'trigger', label: 'Triggered', type: 'signal' },
  ],
  defaultProps: {
    scheduleType: 'cron',
    cronExpression: '0 */6 * * *',
    intervalMinutes: 60,
    timezone: 'Asia/Ho_Chi_Minh',
    enabled: true,
  },
  propertySchema: [
    {
      key: 'scheduleType',
      label: 'Schedule Type',
      type: 'select',
      required: true,
      defaultValue: 'cron',
      options: [
        { value: 'cron', label: 'Cron Expression', description: 'Advanced scheduling with cron syntax' },
        { value: 'interval', label: 'Fixed Interval', description: 'Run every N minutes' },
      ],
    },
    {
      key: 'cronExpression',
      label: 'Cron Expression',
      type: 'cron',
      required: true,
      defaultValue: '0 */6 * * *',
      placeholder: '0 */6 * * *',
      helperText: 'Every 6 hours by default',
      exampleValue: '0 9 * * 1-5',
      visibleWhen: (p) => p.scheduleType === 'cron',
      validate: (v) => {
        const val = String(v ?? '').trim()
        if (!val) return 'Cron expression is required'
        const parts = val.split(/\s+/)
        if (parts.length < 5) return 'Invalid cron: expected 5 fields (min hour day month weekday)'
        return null
      },
    },
    {
      key: 'intervalMinutes',
      label: 'Interval (minutes)',
      type: 'number',
      required: true,
      defaultValue: 60,
      min: 1,
      max: 10080,
      helperText: 'How often to run (1 min – 7 days)',
      visibleWhen: (p) => p.scheduleType === 'interval',
      validate: (v) => {
        const n = Number(v)
        if (isNaN(n) || n < 1) return 'Interval must be at least 1 minute'
        if (n > 10080) return 'Interval cannot exceed 7 days (10080 min)'
        return null
      },
    },
    {
      key: 'timezone',
      label: 'Timezone',
      type: 'select',
      required: true,
      defaultValue: 'Asia/Ho_Chi_Minh',
      options: [
        { value: 'Asia/Ho_Chi_Minh', label: 'Asia/Ho Chi Minh (UTC+7)' },
        { value: 'UTC', label: 'UTC' },
        { value: 'America/New_York', label: 'America/New York' },
        { value: 'Europe/London', label: 'Europe/London' },
        { value: 'Asia/Tokyo', label: 'Asia/Tokyo' },
      ],
    },
    {
      key: 'enabled',
      label: 'Enabled',
      type: 'toggle',
      defaultValue: true,
      helperText: 'Pause or resume the schedule',
    },
  ],
  validate: (props) => {
    const errors: import('../node-types').ValidationError[] = []
    if (props.scheduleType === 'cron') {
      if (!props.cronExpression?.trim()) {
        errors.push({ propertyKey: 'cronExpression', message: 'Cron expression is required', severity: 'error' })
      }
    }
    if (props.scheduleType === 'interval') {
      const n = Number(props.intervalMinutes)
      if (isNaN(n) || n < 1) {
        errors.push({ propertyKey: 'intervalMinutes', message: 'Interval must be ≥ 1 min', severity: 'error' })
      }
    }
    return errors
  },
  summaryFields: [
    { key: 'scheduleType', label: 'Type' },
    { key: 'cronExpression', label: 'Schedule', format: 'cron' },
    { key: 'timezone', label: 'TZ' },
  ],
}
