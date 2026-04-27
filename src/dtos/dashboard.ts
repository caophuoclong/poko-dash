// Dashboard DTOs
// These will be auto-generated from openapi.json eventually
// For now, defining them manually

export type DashboardRange = '7d' | '30d' | '90d'

export interface DashboardSummaryCard {
  label: string
  value: number
  delta?: {
    value: number
    isPositive: boolean
  }
  helper?: string
}

export interface DashboardPipelineStatus {
  label: string
  count: number
  tone?: 'neutral' | 'orange' | 'blue' | 'green' | 'yellow' | 'red'
  action?: {
    label: string
    path: string
  }
}

export interface DashboardTrendPoint {
  date: string
  value: number
}

export interface DashboardTrendSeries {
  label: string
  data: DashboardTrendPoint[]
}

export interface DashboardAttentionItem {
  id: string
  title: string
  description: string
  severity: 'warning' | 'error'
  action: {
    label: string
    path: string
  }
}

export interface DashboardScheduledItem {
  id: string
  scheduledAt: string
  platform: string
  title: string
  status: 'pending' | 'queued' | 'failed'
}

export interface DashboardBreakdownItem {
  label: string
  value: number
  percentage: number
}

export interface DashboardOverviewResponse {
  summaryCards: DashboardSummaryCard[]
  pipelineSnapshot: DashboardPipelineStatus[]
  trendSeries: {
    postsGenerated: DashboardTrendSeries
    postsPublished: DashboardTrendSeries
    seedsApproved: DashboardTrendSeries
  }
  attentionItems: DashboardAttentionItem[]
  upcomingSchedule: DashboardScheduledItem[]
  topBreakdowns: {
    categories: DashboardBreakdownItem[]
    platforms: DashboardBreakdownItem[]
    topSeeds: DashboardBreakdownItem[]
  }
}
