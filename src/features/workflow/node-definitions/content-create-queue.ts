import type { WorkflowNodeDefinition } from '../node-types'

export interface CreateContentQueueProps {
  queueStrategy: 'fifo' | 'priority' | 'scheduled'
  maxQueueSize: number
  autoApprove: boolean
  requireReview: boolean
  reviewerGroup: string
  deduplicateByTitle: boolean
  minQualityScore: number
  tagFilteredQueues: string[]
}

export const CreateContentQueueDef: WorkflowNodeDefinition<CreateContentQueueProps> = {
  typeId: 'content.create_queue',
  category: 'content',
  title: 'Create Content Queue',
  description: 'Organize approved content ideas into a publishable queue',
  icon: 'ListTodo',
  purpose: 'Build a structured queue of content items ready for writing, review, and scheduling',
  inputs: [
    { id: 'ideas', label: 'Content Ideas', type: 'data' },
  ],
  outputs: [
    { id: 'queue', label: 'Content Queue', type: 'data' },
    { id: 'rejected', label: 'Rejected Ideas', type: 'data' },
  ],
  defaultProps: {
    queueStrategy: 'priority',
    maxQueueSize: 50,
    autoApprove: false,
    requireReview: true,
    reviewerGroup: 'editors',
    deduplicateByTitle: true,
    minQualityScore: 60,
    tagFilteredQueues: [],
  },
  propertySchema: [
    {
      key: 'queueStrategy',
      label: 'Queue Strategy',
      type: 'select',
      required: true,
      defaultValue: 'priority',
      options: [
        { value: 'fifo', label: 'FIFO', description: 'First in, first out' },
        { value: 'priority', label: 'Priority', description: 'Higher quality score = higher priority' },
        { value: 'scheduled', label: 'Scheduled', description: 'Respect scheduled publish times' },
      ],
    },
    {
      key: 'maxQueueSize',
      label: 'Max Queue Size',
      type: 'number',
      defaultValue: 50,
      min: 1,
      max: 500,
      helperText: 'Maximum items in the active queue',
    },
    {
      key: 'autoApprove',
      label: 'Auto-Approve',
      type: 'toggle',
      defaultValue: false,
      helperText: 'Skip manual review and queue directly',
    },
    {
      key: 'requireReview',
      label: 'Require Review',
      type: 'toggle',
      defaultValue: true,
      helperText: 'Ideas must be reviewed before entering the queue',
    },
    {
      key: 'reviewerGroup',
      label: 'Reviewer Group',
      type: 'text',
      defaultValue: 'editors',
      placeholder: 'editors',
      visibleWhen: (p) => p.requireReview === true,
    },
    {
      key: 'minQualityScore',
      label: 'Min Quality Score',
      type: 'number',
      defaultValue: 60,
      min: 0,
      max: 100,
      helperText: 'Ideas below this score are rejected (0-100)',
    },
    {
      key: 'deduplicateByTitle',
      label: 'Deduplicate by Title',
      type: 'toggle',
      defaultValue: true,
      helperText: 'Remove ideas with similar titles',
    },
    {
      key: 'tagFilteredQueues',
      label: 'Tag Filters',
      type: 'tag-input',
      defaultValue: [],
      placeholder: 'e.g. deals, reviews, guides',
      helperText: 'Create sub-queues by tag',
    },
  ],
  validate: (props) => {
    const errors: import('../node-types').ValidationError[] = []
    if (props.maxQueueSize && Number(props.maxQueueSize) < 1) {
      errors.push({ propertyKey: 'maxQueueSize', message: 'Queue size must be ≥ 1', severity: 'error' })
    }
    if (props.minQualityScore !== undefined && (Number(props.minQualityScore) < 0 || Number(props.minQualityScore) > 100)) {
      errors.push({ propertyKey: 'minQualityScore', message: 'Quality score must be 0-100', severity: 'error' })
    }
    if (props.autoApprove && props.requireReview) {
      errors.push({ propertyKey: 'autoApprove', message: 'Cannot auto-approve and require review simultaneously', severity: 'warning' })
    }
    return errors
  },
  summaryFields: [
    { key: 'queueStrategy', label: 'Strategy' },
    { key: 'maxQueueSize', label: 'Max Size', format: 'number' },
    { key: 'requireReview', label: 'Review', format: 'badge' },
  ],
}
