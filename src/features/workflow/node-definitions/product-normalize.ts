import type { WorkflowNodeDefinition } from '../node-types'

export interface NormalizeProductsProps {
  fieldMapping: Record<string, string>
  normalizeCurrency: boolean
  defaultCurrency: string
  extractBrand: boolean
  cleanHtml: boolean
  trimWhitespace: boolean
  fillMissingFromMeta: boolean
}

export const NormalizeProductsDef: WorkflowNodeDefinition<NormalizeProductsProps> = {
  typeId: 'product.normalize',
  category: 'product',
  title: 'Normalize Products',
  description: 'Clean and standardize raw product data into a consistent schema',
  icon: 'Layers',
  purpose: 'Transform raw crawl data into the normalized product schema with consistent field names and formats',
  inputs: [
    { id: 'rawProducts', label: 'Raw Products', type: 'data' },
  ],
  outputs: [
    { id: 'normalized', label: 'Normalized Products', type: 'data' },
  ],
  defaultProps: {
    fieldMapping: {},
    normalizeCurrency: true,
    defaultCurrency: 'VND',
    extractBrand: true,
    cleanHtml: true,
    trimWhitespace: true,
    fillMissingFromMeta: false,
  },
  propertySchema: [
    {
      key: 'normalizeCurrency',
      label: 'Normalize Currency',
      type: 'toggle',
      defaultValue: true,
      helperText: 'Convert all prices to a single currency',
    },
    {
      key: 'defaultCurrency',
      label: 'Target Currency',
      type: 'select',
      defaultValue: 'VND',
      options: [
        { value: 'VND', label: 'VND' },
        { value: 'USD', label: 'USD' },
        { value: 'EUR', label: 'EUR' },
      ],
      visibleWhen: (p) => p.normalizeCurrency === true,
    },
    {
      key: 'extractBrand',
      label: 'Extract Brand',
      type: 'toggle',
      defaultValue: true,
      helperText: 'Auto-detect brand from title if missing',
    },
    {
      key: 'cleanHtml',
      label: 'Strip HTML',
      type: 'toggle',
      defaultValue: true,
      helperText: 'Remove HTML tags from descriptions',
    },
    {
      key: 'trimWhitespace',
      label: 'Trim Whitespace',
      type: 'toggle',
      defaultValue: true,
      helperText: 'Clean leading/trailing whitespace from all text fields',
    },
    {
      key: 'fillMissingFromMeta',
      label: 'Fill from Meta',
      type: 'toggle',
      defaultValue: false,
      helperText: 'Use page meta tags to fill missing product fields',
    },
    {
      key: 'fieldMapping',
      label: 'Field Mapping',
      type: 'field-picker',
      defaultValue: {},
      helperText: 'Map source fields to product schema fields',
      exampleValue: '{"title": "name", "final_price": "price"}',
    },
  ],
  validate: () => [],
  summaryFields: [
    { key: 'normalizeCurrency', label: 'Currency Fix', format: 'badge' },
    { key: 'defaultCurrency', label: 'Currency' },
    { key: 'cleanHtml', label: 'Strip HTML', format: 'badge' },
  ],
}
