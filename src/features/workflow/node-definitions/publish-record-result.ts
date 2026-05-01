import type { WorkflowNodeDefinition } from '../node-types'

export interface RecordPublishResultProps {
  platform: 'facebook' | 'twitter' | 'linkedin' | 'tiktok' | 'instagram' | 'web' | 'all'
  trackEngagement: boolean
  retryOnFailure: boolean
  maxRetries: number
  logErrors: boolean
  notifyOnFailure: boolean
  failureChannel: string
}

export const RecordPublishResultDef: WorkflowNodeDefinition<RecordPublishResultProps> = {
  typeId: 'publish.record_result',
  category: 'publish',
  title: 'Record Publish Result',
  description: 'Log the outcome of a publish action and track engagement',
  icon: 'Send',
  purpose: 'Record whether content was published successfully, track post IDs, and capture any errors',
  inputs: [
    { id: 'publishAction', label: 'Publish Action', type: 'signal' },
  ],
  outputs: [
    { id: 'result', label: 'Publish Result', type: 'data' },
    { id: 'failure', label: 'Failed', type: 'error' },
  ],
  defaultProps: {
    platform: 'all',
    trackEngagement: true,
    retryOnFailure: true,
    maxRetries: 3,
    logErrors: true,
    notifyOnFailure: true,
    failureChannel: 'slack',
  },
  propertySchema: [
    {
      key: 'platform',
      label: 'Platform',
      type: 'select',
      required: true,
      defaultValue: 'all',
      options: [
        { value: 'all', label: 'All Connected Platforms' },
        { value: 'facebook', label: 'Facebook' },
        { value: 'twitter', label: 'Twitter / X' },
        { value: 'linkedin', label: 'LinkedIn' },
        { value: 'tiktok', label: 'TikTok' },
        { value: 'instagram', label: 'Instagram' },
        { value: 'web', label: 'Website / Blog' },
      ],
    },
    {
      key: 'trackEngagement',
      label: 'Track Engagement',
      type: 'toggle',
      defaultValue: true,
      helperText: 'Start tracking likes, shares, and clicks after publish',
    },
    {
      key: 'retryOnFailure',
      label: 'Retry on Failure',
      type: 'toggle',
      defaultValue: true,
      helperText: 'Automatically retry failed publishes',
    },
    {
      key: 'maxRetries',
      label: 'Max Retries',
      type: 'number',
      defaultValue: 3,
      min: 0,
      max: 10,
      visibleWhen: (p) => p.retryOnFailure === true,
    },
    {
      key: 'logErrors',
      label: 'Log Errors',
      type: 'toggle',
      defaultValue: true,
      helperText: 'Write error details to publish log',
    },
    {
      key: 'notifyOnFailure',
      label: 'Notify on Failure',
      type: 'toggle',
      defaultValue: true,
      helperText: 'Send alert when publish fails',
    },
    {
      key: 'failureChannel',
      label: 'Alert Channel',
      type: 'select',
      defaultValue: 'slack',
      options: [
        { value: 'slack', label: 'Slack' },
        { value: 'email', label: 'Email' },
        { value: 'in-app', label: 'In-App Notification' },
      ],
      visibleWhen: (p) => p.notifyOnFailure === true,
    },
  ],
  validate: () => [],
  summaryFields: [
    { key: 'platform', label: 'Platform' },
    { key: 'trackEngagement', label: 'Engagement', format: 'badge' },
    { key: 'retryOnFailure', label: 'Retry', format: 'badge' },
  ],
}
