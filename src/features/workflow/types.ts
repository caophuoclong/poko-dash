import type { Node, Edge } from '@xyflow/react'

export interface WorkflowNodeData extends Record<string, unknown> {
  title: string
  subtitle?: string
  icon?: string
  status?: 'active' | 'pending' | 'completed' | 'error' | 'paused'
  metrics?: { label: string; value: string }[]
  /** Custom config for this node type (e.g. API endpoint, cron expression) */
  config?: Record<string, unknown>
}

export interface NodeTypeDefinition {
  type: string
  label: string
  description: string
  icon: string
  category: 'trigger' | 'action' | 'condition' | 'output'
  defaultData: WorkflowNodeData
}

export interface WorkflowSummary {
  id: string
  name: string
  description: string
  status: 'draft' | 'active' | 'paused' | 'archived'
  nodeCount: number
  lastRunAt?: string
  createdAt: string
  updatedAt: string
}

export interface WorkflowDetail {
  id: string
  name: string
  description: string
  status: 'draft' | 'active' | 'paused' | 'archived'
  nodes: Node<WorkflowNodeData>[]
  edges: Edge[]
  createdAt: string
  updatedAt: string
}

export const NODE_TYPE_CATALOG: NodeTypeDefinition[] = [
  {
    type: 'workflow-node',
    label: 'Content Source',
    description: 'Fetch content from API, RSS, or webhook',
    icon: 'Rss',
    category: 'trigger',
    defaultData: {
      title: 'Content Source',
      subtitle: 'Fetch from external source',
      icon: 'Rss',
      status: 'active',
      metrics: [
        { label: 'Sources', value: '0' },
        { label: 'Rate', value: '0/min' },
      ],
    },
  },
  {
    type: 'workflow-node',
    label: 'AI Enrichment',
    description: 'Generate tags, summaries, and translations',
    icon: 'Sparkles',
    category: 'action',
    defaultData: {
      title: 'AI Enrichment',
      subtitle: 'Process with AI model',
      icon: 'Sparkles',
      status: 'active',
      metrics: [
        { label: 'Processed', value: '0' },
        { label: 'Avg Time', value: '0s' },
      ],
    },
  },
  {
    type: 'workflow-node',
    label: 'Validation',
    description: 'Filter, deduplicate, and quality check',
    icon: 'ShieldCheck',
    category: 'condition',
    defaultData: {
      title: 'Validation',
      subtitle: 'Quality check & filter',
      icon: 'ShieldCheck',
      status: 'active',
      metrics: [
        { label: 'Passed', value: '0%' },
        { label: 'Queue', value: '0' },
      ],
    },
  },
  {
    type: 'workflow-node',
    label: 'Manual Review',
    description: 'Require human approval before proceeding',
    icon: 'UserCheck',
    category: 'condition',
    defaultData: {
      title: 'Manual Review',
      subtitle: 'Editor approval required',
      icon: 'UserCheck',
      status: 'pending',
      metrics: [
        { label: 'Pending', value: '0' },
        { label: 'Today', value: '0' },
      ],
    },
  },
  {
    type: 'workflow-node',
    label: 'Scheduler',
    description: 'Optimize time slots and platform distribution',
    icon: 'Calendar',
    category: 'action',
    defaultData: {
      title: 'Scheduler',
      subtitle: 'Time-optimized scheduling',
      icon: 'Calendar',
      status: 'active',
      metrics: [
        { label: 'Scheduled', value: '0' },
        { label: 'Platforms', value: '0' },
      ],
    },
  },
  {
    type: 'workflow-node',
    label: 'Distribution',
    description: 'Publish to connected social platforms',
    icon: 'Send',
    category: 'output',
    defaultData: {
      title: 'Distribution',
      subtitle: 'Publish to channels',
      icon: 'Send',
      status: 'completed',
      metrics: [
        { label: 'Published', value: '0' },
        { label: 'Success', value: '0%' },
      ],
    },
  },
  {
    type: 'workflow-node',
    label: 'Analytics',
    description: 'Collect and sync performance metrics',
    icon: 'BarChart3',
    category: 'output',
    defaultData: {
      title: 'Analytics',
      subtitle: 'Performance data collection',
      icon: 'BarChart3',
      status: 'active',
      metrics: [
        { label: 'Synced', value: '0' },
        { label: 'Interval', value: '15m' },
      ],
    },
  },
  {
    type: 'workflow-node',
    label: 'Webhook',
    description: 'Trigger on incoming webhook events',
    icon: 'Webhook',
    category: 'trigger',
    defaultData: {
      title: 'Webhook',
      subtitle: 'Incoming event trigger',
      icon: 'Webhook',
      status: 'active',
      metrics: [
        { label: 'Events', value: '0' },
        { label: 'Rate', value: '0/min' },
      ],
    },
  },
  {
    type: 'workflow-node',
    label: 'Email',
    description: 'Send notification or digest emails',
    icon: 'Mail',
    category: 'output',
    defaultData: {
      title: 'Email',
      subtitle: 'Notification delivery',
      icon: 'Mail',
      status: 'active',
      metrics: [
        { label: 'Sent', value: '0' },
        { label: 'Opens', value: '0%' },
      ],
    },
  },
  {
    type: 'workflow-node',
    label: 'Transform',
    description: 'Map, format, or restructure data',
    icon: 'Replace',
    category: 'action',
    defaultData: {
      title: 'Transform',
      subtitle: 'Data mapping & formatting',
      icon: 'Replace',
      status: 'active',
      metrics: [
        { label: 'Records', value: '0' },
        { label: 'Errors', value: '0' },
      ],
    },
  },
]
