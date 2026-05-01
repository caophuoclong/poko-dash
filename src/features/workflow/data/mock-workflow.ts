import type { Node, Edge } from '@xyflow/react'

export interface WorkflowNodeData extends Record<string, unknown> {
  title: string
  subtitle?: string
  icon?: string
  status?: 'active' | 'pending' | 'completed' | 'error'
  metrics?: { label: string; value: string }[]
}

export const initialNodes: Node<WorkflowNodeData>[] = [
  {
    id: '1',
    type: 'workflow-node',
    position: { x: 400, y: 0 },
    data: {
      title: 'Content Source',
      subtitle: 'Fetch from API & RSS feeds',
      icon: 'Rss',
      status: 'completed',
      metrics: [
        { label: 'Sources', value: '12' },
        { label: 'Rate', value: '2/min' },
      ],
    },
  },
  {
    id: '2',
    type: 'workflow-node',
    position: { x: 400, y: 140 },
    data: {
      title: 'Content Validation',
      subtitle: 'Filter duplicates & quality check',
      icon: 'ShieldCheck',
      status: 'active',
      metrics: [
        { label: 'Passed', value: '87%' },
        { label: 'Queue', value: '24' },
      ],
    },
  },
  {
    id: '3',
    type: 'workflow-node',
    position: { x: 100, y: 290 },
    data: {
      title: 'AI Enrichment',
      subtitle: 'Generate tags & summaries',
      icon: 'Sparkles',
      status: 'active',
      metrics: [
        { label: 'Processed', value: '1.2k' },
        { label: 'Avg Time', value: '0.8s' },
      ],
    },
  },
  {
    id: '4',
    type: 'workflow-node',
    position: { x: 700, y: 290 },
    data: {
      title: 'Manual Review',
      subtitle: 'Editor approval queue',
      icon: 'UserCheck',
      status: 'pending',
      metrics: [
        { label: 'Pending', value: '8' },
        { label: 'Today', value: '42' },
      ],
    },
  },
  {
    id: '5',
    type: 'workflow-node',
    position: { x: 400, y: 440 },
    data: {
      title: 'Scheduling Engine',
      subtitle: 'Optimize time slots & platforms',
      icon: 'Calendar',
      status: 'active',
      metrics: [
        { label: 'Scheduled', value: '156' },
        { label: 'Platforms', value: '4' },
      ],
    },
  },
  {
    id: '6',
    type: 'workflow-node',
    position: { x: 400, y: 590 },
    data: {
      title: 'Distribution',
      subtitle: 'Publish to connected channels',
      icon: 'Send',
      status: 'completed',
      metrics: [
        { label: 'Published', value: '2.4k' },
        { label: 'Success', value: '99.2%' },
      ],
    },
  },
  {
    id: '7',
    type: 'workflow-node',
    position: { x: 400, y: 740 },
    data: {
      title: 'Analytics Sync',
      subtitle: 'Collect performance metrics',
      icon: 'BarChart3',
      status: 'active',
      metrics: [
        { label: 'Synced', value: '3.1k' },
        { label: 'Interval', value: '15m' },
      ],
    },
  },
]

export const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'smoothstep',
    animated: false,
    style: { stroke: 'var(--t-accent-green)', strokeWidth: 1.5 },
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    type: 'smoothstep',
    animated: true,
    style: { stroke: 'var(--t-accent-blue)', strokeWidth: 1.5 },
  },
  {
    id: 'e2-4',
    source: '2',
    target: '4',
    type: 'smoothstep',
    animated: false,
    style: { stroke: 'var(--t-accent-yellow)', strokeWidth: 1.5 },
  },
  {
    id: 'e3-5',
    source: '3',
    target: '5',
    type: 'smoothstep',
    animated: false,
    style: { stroke: 'var(--t-accent-blue)', strokeWidth: 1.5 },
  },
  {
    id: 'e4-5',
    source: '4',
    target: '5',
    type: 'smoothstep',
    animated: false,
    style: { stroke: 'var(--t-accent-yellow)', strokeWidth: 1.5 },
  },
  {
    id: 'e5-6',
    source: '5',
    target: '6',
    type: 'smoothstep',
    animated: true,
    style: { stroke: 'var(--t-accent-green)', strokeWidth: 1.5 },
  },
  {
    id: 'e6-7',
    source: '6',
    target: '7',
    type: 'smoothstep',
    animated: false,
    style: { stroke: 'var(--t-accent-purple)', strokeWidth: 1.5 },
  },
]
