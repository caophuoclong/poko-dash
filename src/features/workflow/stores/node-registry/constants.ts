export const CATEGORY_ORDER: string[] = [
  'trigger',
  'source',
  'data',
  'logic',
  'io',
  'content',
  'utility',
  'db',
  'crawl',
  'product',
  'affiliate',
  'publish',
  'resource',
  'agent',
]

export type WorkflowNodeCategory = (typeof CATEGORY_ORDER)[number]

export const CATEGORY_CONFIG: Record<
  WorkflowNodeCategory,
  {
    label: string
    color: string
    bgColor: string
    borderColor: string
  }
> = {
  trigger: {
    label: 'Triggers',
    color: 'text-accent-orange',
    bgColor: 'bg-accent-orange-dim',
    borderColor: 'border-accent-orange/20',
  },
  source: {
    label: 'Sources',
    color: 'text-accent-blue',
    bgColor: 'bg-accent-blue-dim',
    borderColor: 'border-accent-blue/20',
  },
  content: {
    label: 'Content',
    color: 'text-accent-yellow',
    bgColor: 'bg-accent-yellow/10',
    borderColor: 'border-accent-yellow/20',
  },
  utility: {
    label: 'Utility',
    color: 'text-muted-text',
    bgColor: 'bg-surface-2',
    borderColor: 'border-frost',
  },
  logic: {
    label: 'Logic',
    color: 'text-accent-purple',
    bgColor: 'bg-accent-purple/10',
    borderColor: 'border-accent-purple/20',
  },
  // Legacy categories kept in type union but not shown in palette
  crawl: {
    label: 'Crawl & Ingestion',
    color: 'text-accent-purple',
    bgColor: 'bg-accent-purple/10',
    borderColor: 'border-accent-purple/20',
  },
  product: {
    label: 'Product Processing',
    color: 'text-accent-blue',
    bgColor: 'bg-accent-blue-dim',
    borderColor: 'border-accent-blue/20',
  },
  affiliate: {
    label: 'Affiliate',
    color: 'text-accent-green',
    bgColor: 'bg-accent-green-dim',
    borderColor: 'border-accent-green/20',
  },
  publish: {
    label: 'Publish',
    color: 'text-accent-green',
    bgColor: 'bg-accent-green-dim',
    borderColor: 'border-accent-green/20',
  },
  metric: {
    label: 'Metrics',
    color: 'text-accent-purple',
    bgColor: 'bg-accent-purple/10',
    borderColor: 'border-accent-purple/20',
  },
}
