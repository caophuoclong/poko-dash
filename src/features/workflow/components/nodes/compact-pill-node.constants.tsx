import type { ReactNode } from 'react'
import type { WorkflowNodeCategory } from '../../node-types'

export type PillNodeType = 'trigger' | 'action' | 'condition' | 'loop' | 'sub-flow' | 'output'

export const CATEGORY_TO_PILL_TYPE: Partial<Record<WorkflowNodeCategory, PillNodeType>> = {
  trigger: 'trigger',
  source: 'trigger',
  crawl: 'action',
  product: 'action',
  affiliate: 'action',
  content: 'action',
  publish: 'output',
  metric: 'output',
  logic: 'condition',
  utility: 'action',
}

export const PILL_TYPE_COLORS: Record<PillNodeType, string> = {
  trigger: 'oklch(58% 0.18 255)',
  action: 'oklch(50% 0.15 250)',
  condition: 'oklch(68% 0.13 80)',
  loop: 'oklch(60% 0.14 165)',
  'sub-flow': 'oklch(55% 0.12 300)',
  output: 'oklch(50% 0.01 250)',
}

export function pillIconSvg(type: PillNodeType): ReactNode {
  switch (type) {
    case 'trigger':
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M6 2.5l7 5.5-7 5.5V2.5z" fill="currentColor" />
        </svg>
      )
    case 'action':
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      )
    case 'condition':
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M8 2l6 6-6 6-6-6z" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      )
    case 'loop':
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M12.5 8a4.5 4.5 0 11-2.8-4.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M12.5 2v3.5H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'sub-flow':
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <rect x="1.5" y="4.5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" fill="none" />
          <rect x="5.5" y="2.5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" fill="white" />
        </svg>
      )
    case 'output':
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h8M9 4.5L12.5 8 9 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
  }
}

export type PillStatus = 'idle' | 'running' | 'error'

export const PILL_STATUS_DOT_COLORS: Record<PillStatus, string> = {
  idle: 'oklch(75% 0.02 250)',
  running: 'oklch(58% 0.18 255)',
  error: 'oklch(55% 0.22 25)',
}

export const PORT_CONFIG: Record<PillNodeType, { hasInput: boolean; hasOutput: boolean }> = {
  trigger: { hasInput: false, hasOutput: true },
  action: { hasInput: true, hasOutput: true },
  condition: { hasInput: true, hasOutput: true },
  loop: { hasInput: true, hasOutput: true },
  'sub-flow': { hasInput: true, hasOutput: true },
  output: { hasInput: true, hasOutput: false },
}
