import type { Prompt } from '../types'

const NAMES = [
  'Product Review Blog Post',
  'SEO Meta Description Generator',
  'Social Media Carousel Script',
  'Email Newsletter Template',
  'YouTube Video Script Outline',
  'Comparison Landing Page',
  'Instagram Story Ad Copy',
  'TikTok UGC Script',
  'Affiliate Roundup Post',
  'Buying Guide Introduction',
  'Product Feature Highlight',
  'Seasonal Deal Promotion',
  'Pain Point Hook Generator',
  'FAQ Content Block',
  'How-To Tutorial Outline',
  'Testimonial Story Builder',
  'Listicle Format Template',
  'Call-to-Action Swipe File',
  'Niche Market Analysis',
  'Trend Jacking Template',
  'Unboxing Script Structure',
  'Before-After Transformation',
  'Objection Handling Copy',
  'Creator Outreach DM',
]

const DESCRIPTIONS = [
  'Generates a structured review post with pros, cons, and a verdict section optimized for affiliate conversion.',
  'Creates SEO-optimized meta titles and descriptions that drive click-through rates from search results.',
  'Builds a multi-slide Instagram or LinkedIn carousel with hooks, value points, and a strong CTA.',
  'Craft personalized email sequences for nurturing leads and promoting affiliate offers.',
  'Structures a YouTube script with hook, body chapters, sponsorship integration, and end-screen CTA.',
  'Writes persuasive comparison copy highlighting key differentiators between two products.',
  'Short-form ad copy tailored for Instagram Story placements with swipe-up optimization.',
  'Natural-sounding UGC script template for TikTok videos that feels authentic and unscripted.',
  'Curated roundup of top products in a category with mini-reviews and affiliate links.',
  'Compelling buying guide intro that addresses reader pain points and sets up product recommendations.',
  'Showcases a single product feature in detail with use cases and benefits.',
  'Urgency-driven promotion copy for flash sales, holiday deals, and limited-time offers.',
  'Generates attention-grabbing hooks based on customer pain points for blog intros and social captions.',
  'Creates FAQ sections addressing common objections and questions to improve on-page conversion.',
  'Step-by-step tutorial structure with materials list, instructions, and affiliate product mentions.',
  'Turns customer testimonials into compelling narrative stories that build trust and drive sales.',
  'Formats listicle articles with numbered entries, subheadings, and affiliate link placements.',
  'Library of proven call-to-action phrases organized by goal: clicks, purchases, sign-ups.',
  'Analyzes niche market trends and generates content angles for first-mover advantage.',
  'Quick-response template for creating content around trending topics and news jacking.',
  'Skeleton for unboxing videos: first impressions, feature walkthrough, comparisons, verdict.',
  'Structures transformation stories with pain point, solution, and result sections.',
  'Pre-written responses to common objections with persuasive reframing techniques.',
  'DM outreach templates for creator collaborations, affiliate partnerships, and brand deals.',
]

const TAGS_POOL = [
  'seo',
  'conversion',
  'social-media',
  'video',
  'email',
  'review',
  'comparison',
  'tiktok',
  'instagram',
  'youtube',
  'blog',
  'affiliate',
  'holiday',
  'product-review',
  'tutorial',
  'sales',
  'outreach',
  'ugc',
  'listings',
  'hooks',
]

const mockPrompts: Prompt[] = NAMES.map((name, i) => {
  const promptTypes = [
    'content_generation',
    'analysis',
    'refinement',
    'custom',
  ] as const
  const categories = [
    'social_media',
    'blog',
    'video',
    'email',
    'general',
  ] as const
  const statuses = ['active', 'draft', 'archived'] as const
  const roles = ['user', 'system'] as const

  const tagCount = 2 + Math.floor(Math.random() * 4)
  const tags = [...TAGS_POOL].sort(() => Math.random() - 0.5).slice(0, tagCount)

  return {
    promptId: `mock-prompt-${String(i + 1).padStart(2, '0')}`,
    name,
    description: DESCRIPTIONS[i] ?? '',
    promptType: promptTypes[i % promptTypes.length],
    role: roles[i % 2],
    category: categories[i % categories.length],
    template: `You are an expert affiliate content writer. Write a ${name.toLowerCase()} based on the following product information:\n\nProduct: {{product_name}}\nKey Features: {{key_features}}\nTarget Audience: {{target_audience}}\nTone: {{tone}}`,
    variables: ['product_name', 'key_features', 'target_audience', 'tone'],
    tags,
    status: statuses[i % 3],
    version: 1 + Math.floor(Math.random() * 3),
    usageCount: Math.floor(Math.random() * 500),
    avgRating:
      Math.random() > 0.3 ? +(3.5 + Math.random() * 1.5).toFixed(1) : undefined,
    createdAt: new Date(
      Date.now() - Math.floor(Math.random() * 90) * 86400000,
    ).toISOString(),
    updatedAt: new Date(
      Date.now() - Math.floor(Math.random() * 7) * 86400000,
    ).toISOString(),
  }
})

export default mockPrompts
