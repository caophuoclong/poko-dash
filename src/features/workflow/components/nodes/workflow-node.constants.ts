import type { LucideIcon } from 'lucide-react'
import {
  Play,
  Clock,
  ListPlus,
  Globe,
  Layers,
  Filter,
  Link2,
  Sparkles,
  ListTodo,
  Send,
  BarChart3,
  GitBranch,
  Timer,
  Bell,
} from 'lucide-react'
import type { NodeExecutionStatus } from '../../stores/execution-store/useExecutionStore'

export const ICON_MAP: Record<string, LucideIcon> = {
  play: Play,
  clock: Clock,
  'list-plus': ListPlus,
  globe: Globe,
  layers: Layers,
  filter: Filter,
  link: Link2,
  sparkles: Sparkles,
  'list-todo': ListTodo,
  send: Send,
  'bar-chart-3': BarChart3,
  'git-branch': GitBranch,
  timer: Timer,
  bell: Bell,
}

export const statusConfig: Record<string, { dot: string; ring: string; label: string }> = {
  completed: { dot: 'bg-accent-green', ring: 'ring-accent-green/20', label: 'Completed' },
  active: { dot: 'bg-accent-blue', ring: 'ring-accent-blue/20', label: 'Running' },
  pending: { dot: 'bg-accent-yellow', ring: 'ring-accent-yellow/20', label: 'Pending' },
  error: { dot: 'bg-accent-red', ring: 'ring-accent-red/20', label: 'Error' },
  paused: { dot: 'bg-muted-text', ring: 'ring-muted-text/20', label: 'Paused' },
}

export const PORT_KIND_COLOR: Record<string, string> = {
  data: 'bg-frost',
  signal: 'bg-accent-orange',
  error: 'bg-accent-red',
}

export const EDGE_TYPE_STYLES: Record<string, { stroke: string; dash?: string; label?: string }> = {
  main: { stroke: 'var(--t-frost)' },
  reference: { stroke: 'var(--t-accent-blue)', dash: '4 2' },
  error: { stroke: 'var(--t-accent-red)' },
  condition_true: { stroke: 'var(--t-accent-green)', label: 'true' },
  condition_false: { stroke: 'var(--t-accent-red)', label: 'false' },
}

export const NODE_COLOR_MAP: Record<string, { border: string; bg: string; text: string }> = {
  purple: { border: 'border-accent-purple/30', bg: 'bg-accent-purple/10', text: 'text-accent-purple' },
  teal: { border: 'border-accent-teal/30', bg: 'bg-accent-teal/10', text: 'text-accent-teal' },
  coral: { border: 'border-accent-orange/30', bg: 'bg-accent-orange/10', text: 'text-accent-orange' },
  pink: { border: 'border-accent-pink/30', bg: 'bg-accent-pink/10', text: 'text-accent-pink' },
  blue: { border: 'border-accent-blue/30', bg: 'bg-accent-blue/10', text: 'text-accent-blue' },
  green: { border: 'border-accent-green/30', bg: 'bg-accent-green/10', text: 'text-accent-green' },
  amber: { border: 'border-accent-yellow/30', bg: 'bg-accent-yellow/10', text: 'text-accent-yellow' },
  red: { border: 'border-accent-red/30', bg: 'bg-accent-red/10', text: 'text-accent-red' },
  gray: { border: 'border-frost', bg: 'bg-surface-2', text: 'text-muted-text' },
}

export const executionStatusStyles: Record<
  NodeExecutionStatus,
  { border: string; bg: string; overlay?: string }
> = {
  idle: { border: '', bg: '' },
  pending: {
    border: 'border-accent-yellow/40',
    bg: 'bg-accent-yellow/5',
  },
  running: {
    border: 'border-accent-blue shadow-md shadow-accent-blue/10',
    bg: 'bg-accent-blue/5',
  },
  completed: {
    border: 'border-accent-green/40',
    bg: 'bg-accent-green/5',
  },
  failed: {
    border: 'border-accent-red/40',
    bg: 'bg-accent-red/5',
  },
  skipped: {
    border: 'border-muted-text/20',
    bg: 'bg-muted-text/5',
  },
}
