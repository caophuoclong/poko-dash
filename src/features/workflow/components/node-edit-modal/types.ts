import type { LucideIcon } from 'lucide-react'

export interface PaneHeaderProps {
  side: string
  idx: number
  total: number
  title: string
  subtitle?: string
  color?: string
  icon?: LucideIcon
}

export type TabId = 'properties' | 'validation'
