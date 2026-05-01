import type { WorkflowNodeDefinition } from '../node-types'

export interface NotificationProps {
  channel: 'email' | 'slack' | 'webhook' | 'in-app'
  recipients: string[]
  subject: string
  bodyTemplate: string
  includeData: boolean
  triggerOn: 'success' | 'failure' | 'always' | 'warning'
  priority: 'low' | 'normal' | 'high'
}

export const NotificationDef: WorkflowNodeDefinition<NotificationProps> = {
  typeId: 'utility.notification',
  category: 'utility',
  title: 'Notification',
  description: 'Send alerts, emails, or webhook notifications',
  icon: 'Bell',
  purpose: 'Notify the team when important events happen in the workflow',
  inputs: [
    { id: 'input', label: 'Input', type: 'data' },
  ],
  outputs: [
    { id: 'output', label: 'Continue', type: 'data' },
  ],
  defaultProps: {
    channel: 'email',
    recipients: [],
    subject: 'Workflow Update: {{workflow.name}}',
    bodyTemplate: '',
    includeData: false,
    triggerOn: 'always',
    priority: 'normal',
  },
  propertySchema: [
    {
      key: 'channel',
      label: 'Channel',
      type: 'select',
      required: true,
      defaultValue: 'email',
      options: [
        { value: 'email', label: 'Email' },
        { value: 'slack', label: 'Slack' },
        { value: 'webhook', label: 'Webhook' },
        { value: 'in-app', label: 'In-App Notification' },
      ],
    },
    {
      key: 'recipients',
      label: 'Recipients',
      type: 'tag-input',
      required: true,
      placeholder: 'Add email or Slack channel...',
      helperText: 'Email addresses or Slack channel names',
      exampleValue: 'team@example.com, #ops-channel',
      validate: (v) => {
        const arr = v as string[]
        if (!arr?.length) return 'At least one recipient is required'
        return null
      },
    },
    {
      key: 'subject',
      label: 'Subject / Title',
      type: 'text',
      required: true,
      defaultValue: 'Workflow Update: {{workflow.name}}',
      placeholder: 'Notification subject',
      helperText: 'Supports {{variables}} for dynamic content',
    },
    {
      key: 'bodyTemplate',
      label: 'Body Template',
      type: 'textarea',
      placeholder: 'Write your notification body here...\nUse {{variable}} for dynamic values.',
      helperText: 'Markdown supported. Leave empty for default template.',
    },
    {
      key: 'triggerOn',
      label: 'Trigger On',
      type: 'select',
      defaultValue: 'always',
      options: [
        { value: 'success', label: 'Success Only' },
        { value: 'failure', label: 'Failure Only' },
        { value: 'warning', label: 'Warning Only' },
        { value: 'always', label: 'Always' },
      ],
    },
    {
      key: 'includeData',
      label: 'Include Data',
      type: 'toggle',
      defaultValue: false,
      helperText: 'Attach workflow data to the notification',
    },
    {
      key: 'priority',
      label: 'Priority',
      type: 'select',
      defaultValue: 'normal',
      options: [
        { value: 'low', label: 'Low' },
        { value: 'normal', label: 'Normal' },
        { value: 'high', label: 'High' },
      ],
    },
  ],
  validate: (props) => {
    const errors: import('../node-types').ValidationError[] = []
    if (!props.recipients?.length) {
      errors.push({ propertyKey: 'recipients', message: 'At least one recipient is required', severity: 'error' })
    }
    if (!props.subject?.trim()) {
      errors.push({ propertyKey: 'subject', message: 'Subject is required', severity: 'error' })
    }
    return errors
  },
  summaryFields: [
    { key: 'channel', label: 'Channel' },
    { key: 'triggerOn', label: 'Trigger' },
    { key: 'priority', label: 'Priority' },
  ],
}
