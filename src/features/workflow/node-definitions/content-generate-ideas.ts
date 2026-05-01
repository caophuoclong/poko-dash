import type { WorkflowNodeDefinition } from '../node-types'

export interface GenerateContentIdeasProps {
  ideaSource: 'products' | 'keywords' | 'trending' | 'manual'
  contentType: 'review' | 'comparison' | 'listicle' | 'deal_alert' | 'guide' | 'social_post'
  aiModel: string
  promptTemplate: string
  maxIdeas: number
  language: string
  includeAffiliateContext: boolean
  toneStyle: string
}

export const GenerateContentIdeasDef: WorkflowNodeDefinition<GenerateContentIdeasProps> = {
  typeId: 'content.generate_ideas',
  category: 'content',
  title: 'Generate Content Ideas',
  description: 'Use AI to create content ideas from products, keywords, or trends',
  icon: 'Sparkles',
  purpose: 'Automatically generate content ideas with AI — turning products and keywords into ready-to-write drafts',
  inputs: [
    { id: 'products', label: 'Products', type: 'data' },
  ],
  outputs: [
    { id: 'ideas', label: 'Content Ideas', type: 'data' },
  ],
  defaultProps: {
    ideaSource: 'products',
    contentType: 'review',
    aiModel: 'gpt-4o-mini',
    promptTemplate: '',
    maxIdeas: 10,
    language: 'vi',
    includeAffiliateContext: true,
    toneStyle: 'casual',
  },
  propertySchema: [
    {
      key: 'ideaSource',
      label: 'Idea Source',
      type: 'select',
      required: true,
      defaultValue: 'products',
      options: [
        { value: 'products', label: 'Product Data', description: 'Generate from product attributes' },
        { value: 'keywords', label: 'Keywords', description: 'Generate from keyword groups' },
        { value: 'trending', label: 'Trending Topics', description: 'Generate from trending searches' },
        { value: 'manual', label: 'Manual Input', description: 'Use a custom prompt template' },
      ],
    },
    {
      key: 'contentType',
      label: 'Content Type',
      type: 'select',
      required: true,
      defaultValue: 'review',
      options: [
        { value: 'review', label: 'Product Review' },
        { value: 'comparison', label: 'Comparison' },
        { value: 'listicle', label: 'Top N Listicle' },
        { value: 'deal_alert', label: 'Deal Alert' },
        { value: 'guide', label: 'Buying Guide' },
        { value: 'social_post', label: 'Social Post' },
      ],
      helperText: 'Type of content to generate',
    },
    {
      key: 'aiModel',
      label: 'AI Model',
      type: 'select',
      defaultValue: 'gpt-4o-mini',
      options: [
        { value: 'gpt-4o', label: 'GPT-4o' },
        { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
        { value: 'claude-3.5', label: 'Claude 3.5 Sonnet' },
        { value: 'gemini-1.5', label: 'Gemini 1.5 Pro' },
      ],
    },
    {
      key: 'promptTemplate',
      label: 'Prompt Template',
      type: 'textarea',
      placeholder: 'Write a {{contentType}} about {{productTitle}} targeting {{keywords}}...',
      helperText: 'Override the default AI prompt. Use {{variables}} for dynamic fields.',
    },
    {
      key: 'maxIdeas',
      label: 'Max Ideas',
      type: 'number',
      defaultValue: 10,
      min: 1,
      max: 100,
      helperText: 'Maximum ideas to generate per run',
    },
    {
      key: 'language',
      label: 'Language',
      type: 'select',
      defaultValue: 'vi',
      options: [
        { value: 'vi', label: 'Tiếng Việt' },
        { value: 'en', label: 'English' },
        { value: 'both', label: 'Both (VI + EN)' },
      ],
    },
    {
      key: 'includeAffiliateContext',
      label: 'Include Affiliate Context',
      type: 'toggle',
      defaultValue: true,
      helperText: 'Add affiliate link and pricing context to ideas',
    },
    {
      key: 'toneStyle',
      label: 'Tone',
      type: 'select',
      defaultValue: 'casual',
      options: [
        { value: 'casual', label: 'Casual / Friendly' },
        { value: 'professional', label: 'Professional' },
        { value: 'urgent', label: 'Urgent / FOMO' },
        { value: 'educational', label: 'Educational' },
      ],
    },
  ],
  validate: (props) => {
    const errors: import('../node-types').ValidationError[] = []
    if (!props.contentType) {
      errors.push({ propertyKey: 'contentType', message: 'Content type is required', severity: 'error' })
    }
    if (props.maxIdeas !== undefined && Number(props.maxIdeas) < 1) {
      errors.push({ propertyKey: 'maxIdeas', message: 'Must generate at least 1 idea', severity: 'error' })
    }
    return errors
  },
  summaryFields: [
    { key: 'ideaSource', label: 'Source' },
    { key: 'contentType', label: 'Type' },
    { key: 'aiModel', label: 'Model' },
    { key: 'language', label: 'Language' },
  ],
}
