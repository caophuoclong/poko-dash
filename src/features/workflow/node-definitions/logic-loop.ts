import type { WorkflowNodeDefinition } from '../node-types'

export type LoopMode = 'forEach' | 'forCount'

export interface LoopProps {
  label: string
  loopMode: LoopMode
  itemsPath: string
  count: number
  concurrency: number
  itemAlias: string
  indexAlias: string
  breakOnError: boolean
  collectResults: boolean
}

export const LoopDef: WorkflowNodeDefinition<LoopProps> = {
  typeId: 'logic.loop',
  category: 'logic',
  title: 'Loop',
  description: 'Iterate over items or repeat a fixed number of times',
  icon: 'GitBranch',
  purpose: 'Loop over a list of items (forEach) or repeat a fixed number of times (forCount). Outputs the current item to its loop handle and signals done when complete.',
  inputs: [
    { id: 'input', label: 'Input', type: 'data' },
  ],
  outputs: [
    { id: 'loop', label: 'Loop', type: 'data' },
    { id: 'done', label: 'Done', type: 'signal' },
  ],
  defaultProps: {
    label: 'Loop',
    loopMode: 'forEach',
    itemsPath: '',
    count: 10,
    concurrency: 1,
    itemAlias: 'item',
    indexAlias: 'index',
    breakOnError: false,
    collectResults: true,
  },
  propertySchema: [
    {
      key: 'label',
      label: 'Label',
      type: 'text',
      required: true,
      defaultValue: 'Loop',
      placeholder: 'Loop name',
      helperText: 'Display name for this loop node',
    },
    {
      key: 'loopMode',
      label: 'Loop Mode',
      type: 'select',
      required: true,
      defaultValue: 'forEach',
      options: [
        { value: 'forEach', label: 'For Each — iterate over a list' },
        { value: 'forCount', label: 'For Count — repeat N times' },
      ],
      helperText: 'How the loop iterates',
    },
    {
      key: 'itemsPath',
      label: 'Items Path',
      type: 'text',
      required: false,
      defaultValue: '',
      placeholder: 'e.g. previous.output.products',
      helperText: 'Path to the array to iterate. Required for forEach mode.',
      visibleWhen: (p) => p.loopMode === 'forEach',
    },
    {
      key: 'count',
      label: 'Count',
      type: 'number',
      required: false,
      defaultValue: 10,
      min: 1,
      max: 100000,
      helperText: 'Number of iterations. Required for forCount mode.',
      visibleWhen: (p) => p.loopMode === 'forCount',
    },
    {
      key: 'concurrency',
      label: 'Concurrency',
      type: 'number',
      defaultValue: 1,
      min: 1,
      max: 100,
      helperText: 'Maximum parallel iterations (1 = sequential)',
    },
    {
      key: 'itemAlias',
      label: 'Item Alias',
      type: 'text',
      defaultValue: 'item',
      placeholder: 'item',
      helperText: 'Variable name for current item: {{loop.item}}',
    },
    {
      key: 'indexAlias',
      label: 'Index Alias',
      type: 'text',
      defaultValue: 'index',
      placeholder: 'index',
      helperText: 'Variable name for current index: {{loop.index}}',
    },
    {
      key: 'breakOnError',
      label: 'Break on Error',
      type: 'toggle',
      defaultValue: false,
      helperText: 'Stop the loop entirely if any iteration fails',
    },
    {
      key: 'collectResults',
      label: 'Collect Results',
      type: 'toggle',
      defaultValue: true,
      helperText: 'Collect and pass all iteration results to the done output',
    },
  ],
  validate: (props) => {
    const errors: import('../node-types').ValidationError[] = []
    if (props.loopMode === 'forEach' && !props.itemsPath?.trim()) {
      errors.push({
        propertyKey: 'itemsPath',
        message: 'Items path is required for forEach loop mode',
        severity: 'error',
      })
    }
    if (props.loopMode === 'forCount' && (!props.count || props.count < 1)) {
      errors.push({
        propertyKey: 'count',
        message: 'Count must be at least 1 for forCount loop mode',
        severity: 'error',
      })
    }
    return errors
  },
  summaryFields: [
    { key: 'loopMode', label: 'Mode', format: 'badge' },
    { key: 'itemsPath', label: 'Items' },
    { key: 'count', label: 'Count', format: 'number' },
    { key: 'concurrency', label: 'Concurrency', format: 'number' },
  ],
}
