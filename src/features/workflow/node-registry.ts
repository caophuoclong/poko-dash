import { create } from 'zustand'
import { useShallow } from 'zustand/shallow'
import type {
  CategoryConfig,
  WorkflowNodeCategory,
  WorkflowNodeDefinition,
} from './node-types'

export const CATEGORY_CONFIG: Record<WorkflowNodeCategory, CategoryConfig> = {
  trigger: {
    label: 'Triggers',
    color: 'text-accent-orange',
    bgColor: 'bg-accent-orange-dim',
    borderColor: 'border-accent-orange/20',
  },
  source: {
    label: 'Sources',
    color: 'text-accent-orange',
    bgColor: 'bg-accent-orange-dim',
    borderColor: 'border-accent-orange/20',
  },
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
  content: {
    label: 'Content',
    color: 'text-accent-yellow',
    bgColor: 'bg-accent-yellow/10',
    borderColor: 'border-accent-yellow/20',
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
  logic: {
    label: 'Logic',
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
}

export const CATEGORY_ORDER: WorkflowNodeCategory[] = [
  'trigger',
  'crawl',
  'product',
  'affiliate',
  'content',
  'publish',
  'metric',
  'logic',
  'utility',
]

type NodeDef = WorkflowNodeDefinition<Record<string, unknown>>

interface NodeRegistryState {
  definitions: Record<string, NodeDef>
}

export const useNodeRegistryStore = create<NodeRegistryState>(() => ({
  definitions: {},
}))

export function registerNodeDefinition(def: NodeDef): void {
  useNodeRegistryStore.setState((state) => {
    const next = { ...state.definitions }
    next[def.typeId] = def
    return { definitions: next }
  })
}

export function registerNodeDefinitions(defs: NodeDef[]): void {
  useNodeRegistryStore.setState((state) => {
    const next = { ...state.definitions }
    for (const def of defs) {
      next[def.typeId] = def
    }
    return { definitions: next }
  })
}

export function getNodeDefinition(typeId: string): NodeDef | undefined {
  return useNodeRegistryStore.getState().definitions[typeId]
}

export function getAllNodeDefinitions(): NodeDef[] {
  return Object.values(useNodeRegistryStore.getState().definitions)
}

export function useAllNodeDefinitions(): NodeDef[] {
  return useNodeRegistryStore(
    useShallow((s) => Object.values(s.definitions)),
  )
}

export function useGroupedNodes(): Record<string, NodeDef[]> {
  return useNodeRegistryStore(
    useShallow((s) => {
      const all = Object.values(s.definitions)
      const grouped: Record<string, NodeDef[]> = {}
      for (const cat of CATEGORY_ORDER) {
        const nodes = all.filter((d) => d.category === cat)
        if (nodes.length > 0) grouped[cat] = nodes
      }
      return grouped
    }),
  )
}

export function validateNodeProps(
  typeId: string,
  props: Record<string, unknown>,
): { valid: boolean; errors: import('./node-types').ValidationError[] } {
  const def = getNodeDefinition(typeId)
  if (!def) {
    return {
      valid: false,
      errors: [
        { propertyKey: 'typeId', message: `Unknown node type: ${typeId}`, severity: 'error' },
      ],
    }
  }
  const errors = def.validate(props)
  return {
    valid: errors.filter((e) => e.severity === 'error').length === 0,
    errors,
  }
}

export function getNodeSummaryData(
  typeId: string,
  props: Record<string, unknown>,
): { label: string; value: string }[] {
  const def = getNodeDefinition(typeId)
  if (!def) return []
  return def.summaryFields.map((field) => ({
    label: field.label,
    value: formatSummaryValue(props[field.key], field.format),
  }))
}

function formatSummaryValue(value: unknown, format?: string): string {
  if (value === undefined || value === null) return '—'
  switch (format) {
    case 'number':
      return typeof value === 'number' ? value.toLocaleString() : String(value)
    case 'percent':
      return typeof value === 'number' ? `${value}%` : String(value)
    case 'list':
      return Array.isArray(value) ? value.join(', ') : String(value)
    case 'badge':
      return String(value)
    case 'cron':
      return String(value)
    default:
      return String(value)
  }
}

