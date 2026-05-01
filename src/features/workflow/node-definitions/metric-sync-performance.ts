import type { WorkflowNodeDefinition } from '../node-types'

export interface SyncPerformanceProps {
  platforms: string[]
  metrics: string[]
  syncInterval: number
  lookbackDays: number
  aggregateBy: 'hour' | 'day' | 'week'
  updateAffiliateStats: boolean
}

export const SyncPerformanceDef: WorkflowNodeDefinition<SyncPerformanceProps> = {
  typeId: 'metric.sync_performance',
  category: 'metric',
  title: 'Sync Performance',
  description: 'Pull and aggregate performance metrics from connected platforms',
  icon: 'BarChart3',
  purpose: 'Collect engagement, click, and conversion data from platforms and affiliate networks',
  inputs: [
    { id: 'trigger', label: 'Trigger', type: 'signal' },
  ],
  outputs: [
    { id: 'metrics', label: 'Performance Data', type: 'data' },
  ],
  defaultProps: {
    platforms: ['facebook', 'twitter'],
    metrics: ['impressions', 'clicks', 'conversions', 'revenue'],
    syncInterval: 15,
    lookbackDays: 7,
    aggregateBy: 'day',
    updateAffiliateStats: true,
  },
  propertySchema: [
    {
      key: 'platforms',
      label: 'Platforms',
      type: 'multi-select',
      required: true,
      defaultValue: ['facebook', 'twitter'],
      options: [
        { value: 'facebook', label: 'Facebook' },
        { value: 'twitter', label: 'Twitter / X' },
        { value: 'linkedin', label: 'LinkedIn' },
        { value: 'tiktok', label: 'TikTok' },
        { value: 'instagram', label: 'Instagram' },
        { value: 'shopee', label: 'Shopee Affiliate' },
        { value: 'lazada', label: 'Lazada Affiliate' },
        { value: 'tiki', label: 'Tiki Affiliate' },
      ],
    },
    {
      key: 'metrics',
      label: 'Metrics',
      type: 'multi-select',
      required: true,
      defaultValue: ['impressions', 'clicks', 'conversions', 'revenue'],
      options: [
        { value: 'impressions', label: 'Impressions' },
        { value: 'clicks', label: 'Link Clicks' },
        { value: 'ctr', label: 'CTR' },
        { value: 'conversions', label: 'Conversions' },
        { value: 'revenue', label: 'Revenue' },
        { value: 'roas', label: 'ROAS' },
        { value: 'engagement', label: 'Engagement Rate' },
      ],
      helperText: 'Select which metrics to sync',
    },
    {
      key: 'syncInterval',
      label: 'Sync Interval (min)',
      type: 'number',
      defaultValue: 15,
      min: 5,
      max: 1440,
      helperText: 'How often to pull data (5 min – 24 hours)',
    },
    {
      key: 'lookbackDays',
      label: 'Lookback (days)',
      type: 'number',
      defaultValue: 7,
      min: 1,
      max: 90,
      helperText: 'How many days of historical data to sync',
    },
    {
      key: 'aggregateBy',
      label: 'Aggregate By',
      type: 'select',
      defaultValue: 'day',
      options: [
        { value: 'hour', label: 'Hourly' },
        { value: 'day', label: 'Daily' },
        { value: 'week', label: 'Weekly' },
      ],
    },
    {
      key: 'updateAffiliateStats',
      label: 'Update Affiliate Stats',
      type: 'toggle',
      defaultValue: true,
      helperText: 'Also sync affiliate commission and conversion data',
    },
  ],
  validate: (props) => {
    const errors: import('../node-types').ValidationError[] = []
    if (!props.platforms?.length) {
      errors.push({ propertyKey: 'platforms', message: 'Select at least one platform', severity: 'error' })
    }
    if (!props.metrics?.length) {
      errors.push({ propertyKey: 'metrics', message: 'Select at least one metric', severity: 'error' })
    }
    return errors
  },
  summaryFields: [
    { key: 'platforms', label: 'Platforms', format: 'list' },
    { key: 'syncInterval', label: 'Interval', format: 'number' },
    { key: 'aggregateBy', label: 'Aggregate' },
  ],
}
