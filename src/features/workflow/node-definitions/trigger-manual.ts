import type { WorkflowNodeDefinition } from '../node-types'

export interface ManualTriggerProps {
  label: string
  description: string
  requireConfirmation: boolean
  allowedRoles: string[]
}

export const ManualTriggerDef: WorkflowNodeDefinition<ManualTriggerProps> = {
  typeId: 'trigger.manual',
  category: 'trigger',
  title: 'Manual Trigger',
  description: 'Start the workflow manually from the dashboard',
  icon: 'Play',
  purpose: 'Run a workflow on demand with optional confirmation step',
  inputs: [],
  outputs: [
    { id: 'trigger', label: 'Triggered', type: 'signal' },
  ],
  defaultProps: {
    label: 'Manual Run',
    description: '',
    requireConfirmation: false,
    allowedRoles: ['admin', 'editor'],
  },
  propertySchema: [
    {
      key: 'label',
      label: 'Button Label',
      type: 'text',
      required: true,
      defaultValue: 'Manual Run',
      placeholder: 'e.g. Run Pipeline',
      helperText: 'Text shown on the trigger button',
      validate: (v) => (!v || String(v).trim() === '' ? 'Label is required' : null),
    },
    {
      key: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'What this trigger does...',
      helperText: 'Shown to users before they confirm',
    },
    {
      key: 'requireConfirmation',
      label: 'Require Confirmation',
      type: 'toggle',
      defaultValue: false,
      helperText: 'Show a confirmation dialog before running',
    },
    {
      key: 'allowedRoles',
      label: 'Allowed Roles',
      type: 'multi-select',
      defaultValue: ['admin', 'editor'],
      options: [
        { value: 'admin', label: 'Admin' },
        { value: 'editor', label: 'Editor' },
        { value: 'viewer', label: 'Viewer' },
      ],
      helperText: 'Who can trigger this workflow',
    },
  ],
  validate: (props) => {
    const errors: import('../node-types').ValidationError[] = []
    if (!props.label?.trim()) {
      errors.push({ propertyKey: 'label', message: 'Trigger label is required', severity: 'error' })
    }
    return errors
  },
  summaryFields: [
    { key: 'label', label: 'Label' },
    { key: 'requireConfirmation', label: 'Confirm', format: 'badge' },
  ],
}
