import type { WorkflowNodeDefinition } from '../node-types'

export interface FilterProductsProps {
  mode: 'include' | 'exclude'
  rules: Array<{
    field: string
    operator: 'equals' | 'not_equals' | 'contains' | 'gt' | 'lt' | 'gte' | 'lte' | 'regex' | 'empty' | 'not_empty'
    value: string
  }>
  minPrice: number | null
  maxPrice: number | null
  requireImage: boolean
  requireInStock: boolean
  removeDuplicates: boolean
  duplicateKey: string
}

export const FilterProductsDef: WorkflowNodeDefinition<FilterProductsProps> = {
  typeId: 'product.filter',
  category: 'product',
  title: 'Filter Products',
  description: 'Remove or keep products based on rules and conditions',
  icon: 'Filter',
  purpose: 'Apply quality gates — remove out-of-stock, low-price, or duplicate products',
  inputs: [
    { id: 'products', label: 'Products', type: 'data' },
  ],
  outputs: [
    { id: 'passed', label: 'Passed', type: 'data' },
    { id: 'rejected', label: 'Rejected', type: 'data' },
  ],
  defaultProps: {
    mode: 'include',
    rules: [],
    minPrice: null,
    maxPrice: null,
    requireImage: true,
    requireInStock: true,
    removeDuplicates: true,
    duplicateKey: 'url',
  },
  propertySchema: [
    {
      key: 'mode',
      label: 'Filter Mode',
      type: 'select',
      defaultValue: 'include',
      options: [
        { value: 'include', label: 'Keep Matching', description: 'Only products matching rules pass through' },
        { value: 'exclude', label: 'Remove Matching', description: 'Products matching rules are rejected' },
      ],
    },
    {
      key: 'rules',
      label: 'Filter Rules',
      type: 'rule-builder',
      defaultValue: [],
      helperText: 'Define conditions for filtering products',
    },
    {
      key: 'minPrice',
      label: 'Min Price',
      type: 'number',
      min: 0,
      helperText: 'Exclude products below this price',
      placeholder: '0',
    },
    {
      key: 'maxPrice',
      label: 'Max Price',
      type: 'number',
      min: 0,
      helperText: 'Exclude products above this price',
      placeholder: 'No limit',
    },
    {
      key: 'requireImage',
      label: 'Require Image',
      type: 'toggle',
      defaultValue: true,
      helperText: 'Products must have at least one image',
    },
    {
      key: 'requireInStock',
      label: 'Require In-Stock',
      type: 'toggle',
      defaultValue: true,
      helperText: 'Out-of-stock products are filtered out',
    },
    {
      key: 'removeDuplicates',
      label: 'Remove Duplicates',
      type: 'toggle',
      defaultValue: true,
      helperText: 'Deduplicate products by key field',
    },
    {
      key: 'duplicateKey',
      label: 'Dedupe Key',
      type: 'select',
      defaultValue: 'url',
      options: [
        { value: 'url', label: 'Product URL' },
        { value: 'sku', label: 'SKU' },
        { value: 'title', label: 'Title' },
      ],
      visibleWhen: (p) => p.removeDuplicates === true,
    },
  ],
  validate: (props) => {
    const errors: import('../node-types').ValidationError[] = []
    if (props.minPrice !== null && props.maxPrice !== null && Number(props.minPrice) > Number(props.maxPrice)) {
      errors.push({ propertyKey: 'minPrice', message: 'Min price cannot exceed max price', severity: 'error' })
    }
    return errors
  },
  summaryFields: [
    { key: 'mode', label: 'Mode' },
    { key: 'requireInStock', label: 'In-Stock Only', format: 'badge' },
    { key: 'removeDuplicates', label: 'Deduplicate', format: 'badge' },
  ],
}
