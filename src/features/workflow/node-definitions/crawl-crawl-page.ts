import type { WorkflowNodeDefinition } from '../node-types'

export interface CrawlPageProps {
  fetchMode: 'static' | 'headless' | 'api'
  userAgent: string
  timeoutMs: number
  retries: number
  respectRobotsTxt: boolean
  rateLimitPerSecond: number
  extractSelectors: string[]
  waitForSelector: string
}

export const CrawlPageDef: WorkflowNodeDefinition<CrawlPageProps> = {
  typeId: 'crawl.crawl_page',
  category: 'crawl',
  title: 'Crawl Page',
  description: 'Fetch and extract content from URLs in the queue',
  icon: 'Globe',
  purpose: 'Visit each URL and extract structured data using CSS selectors or headless rendering',
  inputs: [
    { id: 'queue', label: 'Fetch Queue', type: 'data' },
  ],
  outputs: [
    { id: 'pages', label: 'Raw Pages', type: 'data' },
    { id: 'errors', label: 'Failed URLs', type: 'error' },
  ],
  defaultProps: {
    fetchMode: 'static',
    userAgent: 'PokoDash/1.0',
    timeoutMs: 15000,
    retries: 2,
    respectRobotsTxt: true,
    rateLimitPerSecond: 2,
    extractSelectors: [],
    waitForSelector: '',
  },
  propertySchema: [
    {
      key: 'fetchMode',
      label: 'Fetch Mode',
      type: 'select',
      required: true,
      defaultValue: 'static',
      options: [
        { value: 'static', label: 'Static HTTP', description: 'Simple HTTP GET, no JS rendering' },
        { value: 'headless', label: 'Headless Browser', description: 'Full browser with JS execution' },
        { value: 'api', label: 'API Request', description: 'Structured API call with headers' },
      ],
      helperText: 'Headless mode is slower but renders JavaScript',
    },
    {
      key: 'timeoutMs',
      label: 'Timeout (ms)',
      type: 'number',
      defaultValue: 15000,
      min: 1000,
      max: 120000,
      step: 1000,
      helperText: 'Per-page fetch timeout',
    },
    {
      key: 'retries',
      label: 'Retries',
      type: 'number',
      defaultValue: 2,
      min: 0,
      max: 5,
      helperText: 'Retry failed fetches',
    },
    {
      key: 'rateLimitPerSecond',
      label: 'Rate Limit (/sec)',
      type: 'slider',
      defaultValue: 2,
      min: 1,
      max: 20,
      helperText: 'Max concurrent requests per second',
    },
    {
      key: 'respectRobotsTxt',
      label: 'Respect robots.txt',
      type: 'toggle',
      defaultValue: true,
      helperText: 'Skip URLs disallowed by robots.txt',
    },
    {
      key: 'waitForSelector',
      label: 'Wait for Selector',
      type: 'text',
      placeholder: '.product-title, #price',
      helperText: 'Wait for this element before extracting (headless only)',
      visibleWhen: (p) => p.fetchMode === 'headless',
    },
    {
      key: 'extractSelectors',
      label: 'Extract Selectors',
      type: 'tag-input',
      defaultValue: [],
      placeholder: 'Add CSS selector...',
      helperText: 'CSS selectors for content extraction',
      exampleValue: '.title, .price, .description',
    },
    {
      key: 'userAgent',
      label: 'User Agent',
      type: 'text',
      defaultValue: 'PokoDash/1.0',
      placeholder: 'Custom user agent string',
    },
  ],
  validate: (props) => {
    const errors: import('../node-types').ValidationError[] = []
    if (props.timeoutMs && Number(props.timeoutMs) < 1000) {
      errors.push({ propertyKey: 'timeoutMs', message: 'Timeout must be ≥ 1000ms', severity: 'error' })
    }
    if (props.retries !== undefined && Number(props.retries) > 5) {
      errors.push({ propertyKey: 'retries', message: 'Max 5 retries allowed', severity: 'warning' })
    }
    return errors
  },
  summaryFields: [
    { key: 'fetchMode', label: 'Mode' },
    { key: 'timeoutMs', label: 'Timeout', format: 'number' },
    { key: 'rateLimitPerSecond', label: 'Rate Limit' },
  ],
}
