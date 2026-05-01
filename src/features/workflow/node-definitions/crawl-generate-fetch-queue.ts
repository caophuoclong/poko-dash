import type { WorkflowNodeDefinition } from '../node-types'

export interface GenerateFetchQueueProps {
  sourceType: 'keyword' | 'url_list' | 'rss' | 'sitemap' | 'api'
  keywordGroup: string
  maxUrls: number
  priority: 'low' | 'normal' | 'high'
  deduplicateBy: string[]
}

export const GenerateFetchQueueDef: WorkflowNodeDefinition<GenerateFetchQueueProps> = {
  typeId: 'crawl.generate_fetch_queue',
  category: 'crawl',
  title: 'Generate Fetch Queue',
  description: 'Build a URL queue from keywords, RSS feeds, or sitemaps',
  icon: 'ListPlus',
  purpose: 'Create a prioritized list of URLs to crawl based on source configuration',
  inputs: [
    { id: 'trigger', label: 'Trigger', type: 'signal' },
  ],
  outputs: [
    { id: 'queue', label: 'Fetch Queue', type: 'data' },
  ],
  defaultProps: {
    sourceType: 'keyword',
    keywordGroup: '',
    maxUrls: 100,
    priority: 'normal',
    deduplicateBy: ['url', 'domain'],
  },
  propertySchema: [
    {
      key: 'sourceType',
      label: 'Source Type',
      type: 'select',
      required: true,
      defaultValue: 'keyword',
      options: [
        { value: 'keyword', label: 'Keyword Search', description: 'Generate URLs from keyword groups' },
        { value: 'url_list', label: 'URL List', description: 'Static list of URLs' },
        { value: 'rss', label: 'RSS Feed', description: 'Parse RSS/Atom feeds' },
        { value: 'sitemap', label: 'Sitemap', description: 'Parse XML sitemaps' },
        { value: 'api', label: 'API Endpoint', description: 'Fetch from custom API' },
      ],
    },
    {
      key: 'keywordGroup',
      label: 'Keyword Group',
      type: 'field-picker',
      required: true,
      placeholder: 'Select keyword group...',
      helperText: 'Group of keywords to generate search URLs from',
      exampleValue: 'laptop-deals',
      visibleWhen: (p) => p.sourceType === 'keyword',
    },
    {
      key: 'maxUrls',
      label: 'Max URLs',
      type: 'number',
      defaultValue: 100,
      min: 1,
      max: 10000,
      helperText: 'Maximum URLs to add to the queue',
    },
    {
      key: 'priority',
      label: 'Priority',
      type: 'select',
      defaultValue: 'normal',
      options: [
        { value: 'low', label: 'Low' },
        { value: 'normal', label: 'Normal' },
        { value: 'high', label: 'High' },
      ],
    },
    {
      key: 'deduplicateBy',
      label: 'Deduplicate By',
      type: 'multi-select',
      defaultValue: ['url', 'domain'],
      options: [
        { value: 'url', label: 'Exact URL' },
        { value: 'domain', label: 'Domain' },
        { value: 'path', label: 'URL Path' },
      ],
      helperText: 'Remove duplicates before queuing',
    },
  ],
  validate: (props) => {
    const errors: import('../node-types').ValidationError[] = []
    if (props.sourceType === 'keyword' && !props.keywordGroup?.trim()) {
      errors.push({ propertyKey: 'keywordGroup', message: 'Keyword group is required for keyword source', severity: 'error' })
    }
    if (props.maxUrls !== undefined && Number(props.maxUrls) < 1) {
      errors.push({ propertyKey: 'maxUrls', message: 'Max URLs must be ≥ 1', severity: 'error' })
    }
    return errors
  },
  summaryFields: [
    { key: 'sourceType', label: 'Source' },
    { key: 'maxUrls', label: 'Max URLs', format: 'number' },
    { key: 'priority', label: 'Priority' },
  ],
}
