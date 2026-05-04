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
import type { NodeExecutionStatus } from '../../utils/execution-engine'

export const ICON_MAP: Record<string, LucideIcon> = {
  Play, Clock, ListPlus, Globe, Layers, Filter,
  LinkCheck: Link2, Sparkles, ListTodo, Send, BarChart3, GitBranch, Timer, Bell,
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
  success: {
    border: 'border-accent-green/40',
    bg: 'bg-accent-green/5',
  },
  error: {
    border: 'border-accent-red/40',
    bg: 'bg-accent-red/5',
  },
  skipped: {
    border: 'border-muted-text/20',
    bg: 'bg-muted-text/5',
  },
  'out-of-scope': {
    border: 'border-frost/50',
    bg: 'bg-void/60',
    overlay: 'opacity-40',
  },
}
