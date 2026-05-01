import type { WorkflowNodeDefinition } from '../node-types'

export interface ValidateAffiliateLinkProps {
  network: 'shopee' | 'lazada' | 'tiki' | 'amazon' | 'custom'
  validateUrlFormat: boolean
  checkLinkAlive: boolean
  extractTrackingId: boolean
  replaceBrokenLinks: boolean
  fallbackUrl: string
  customAffiliatePattern: string
}

export const ValidateAffiliateLinkDef: WorkflowNodeDefinition<ValidateAffiliateLinkProps> = {
  typeId: 'affiliate.validate_link',
  category: 'affiliate',
  title: 'Validate Affiliate Link',
  description: 'Check, normalize, and repair affiliate tracking links',
  icon: 'LinkCheck',
  purpose: 'Ensure all affiliate links are valid, trackable, and not broken before publishing',
  inputs: [
    { id: 'products', label: 'Products', type: 'data' },
  ],
  outputs: [
    { id: 'validated', label: 'Validated', type: 'data' },
    { id: 'invalid', label: 'Invalid Links', type: 'error' },
  ],
  defaultProps: {
    network: 'shopee',
    validateUrlFormat: true,
    checkLinkAlive: true,
    extractTrackingId: true,
    replaceBrokenLinks: false,
    fallbackUrl: '',
    customAffiliatePattern: '',
  },
  propertySchema: [
    {
      key: 'network',
      label: 'Affiliate Network',
      type: 'select',
      required: true,
      defaultValue: 'shopee',
      options: [
        { value: 'shopee', label: 'Shopee' },
        { value: 'lazada', label: 'Lazada' },
        { value: 'tiki', label: 'Tiki' },
        { value: 'amazon', label: 'Amazon' },
        { value: 'custom', label: 'Custom Network' },
      ],
    },
    {
      key: 'validateUrlFormat',
      label: 'Validate URL Format',
      type: 'toggle',
      defaultValue: true,
      helperText: 'Check that URLs are well-formed',
    },
    {
      key: 'checkLinkAlive',
      label: 'Check Link Alive',
      type: 'toggle',
      defaultValue: true,
      helperText: 'HTTP HEAD request to verify link is reachable',
    },
    {
      key: 'extractTrackingId',
      label: 'Extract Tracking ID',
      type: 'toggle',
      defaultValue: true,
      helperText: 'Parse and validate affiliate tracking parameters',
    },
    {
      key: 'replaceBrokenLinks',
      label: 'Replace Broken Links',
      type: 'toggle',
      defaultValue: false,
      helperText: 'Auto-replace broken links with fallback URL',
    },
    {
      key: 'fallbackUrl',
      label: 'Fallback URL',
      type: 'text',
      placeholder: 'https://example.com/search?q={{keyword}}',
      helperText: 'Used when a link is broken and auto-replace is on',
      visibleWhen: (p) => p.replaceBrokenLinks === true,
    },
    {
      key: 'customAffiliatePattern',
      label: 'Custom URL Pattern',
      type: 'text',
      placeholder: 'https://network.com/track?id={{aff_id}}&url={{url}}',
      helperText: 'Regex or template for custom network links',
      visibleWhen: (p) => p.network === 'custom',
    },
  ],
  validate: (props) => {
    const errors: import('../node-types').ValidationError[] = []
    if (props.replaceBrokenLinks && !props.fallbackUrl?.trim()) {
      errors.push({ propertyKey: 'fallbackUrl', message: 'Fallback URL is required when auto-replace is enabled', severity: 'error' })
    }
    return errors
  },
  summaryFields: [
    { key: 'network', label: 'Network' },
    { key: 'checkLinkAlive', label: 'Alive Check', format: 'badge' },
    { key: 'replaceBrokenLinks', label: 'Auto-Fix', format: 'badge' },
  ],
}
