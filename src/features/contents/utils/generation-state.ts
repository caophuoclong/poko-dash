import type { ContentIdeaEntity } from '../schemas/content.schema'
import { IdeaStatus } from '../schemas/content.schema'
import type {
  IdeaGenerationSummary,
  ProductGenerationInfo,
} from '../constants/seeds-columns'

export interface GenerationState {
  canGenerateSeed: boolean
  canGenerateAll: boolean
  canRegenerate: boolean

  eligibleProductIds: string[]
  generatedProductIds: string[]
  pendingProductIds: string[]
  erroredProductIds: string[]

  generationCoverage: {
    total: number
    generated: number
    pending: number
    percentage: number
  }

  blockedReason: string | null
  actionHint: string | null
}

export function computeGenerationState(
  idea: ContentIdeaEntity,
  summary?: IdeaGenerationSummary,
  errorProductIds?: string[],
): GenerationState {
  const productIds = idea.ideaProducts ?? []
  const productInfo: ProductGenerationInfo[] = summary?.productInfo ?? []

  const generatedIds = productInfo
    .filter((p) => p.hasPosts)
    .map((p) => p.productId)

  const erroredIds = errorProductIds ?? []

  const pendingIds = productIds.filter(
    (id) => !generatedIds.includes(id) && !erroredIds.includes(id),
  )

  const eligibleIds = productIds.filter((id) => !erroredIds.includes(id))

  const total = productIds.length
  const generated = generatedIds.length
  const pending = pendingIds.length
  const percentage = total > 0 ? Math.round((generated / total) * 100) : 0

  const isDraft = idea.status === IdeaStatus.Draft
  const isApproved = idea.status === IdeaStatus.Approved
  const isQueued = idea.status === IdeaStatus.Queued
  const isProduced = idea.status === IdeaStatus.Produced
  const isRejected = idea.status === IdeaStatus.Rejected
  const hasProducts = total > 0

  let blockedReason: string | null = null
  let actionHint: string | null = null
  let canGenerate = false
  let canRegenerate = false

  if (!hasProducts) {
    blockedReason = 'No products linked to this seed'
    actionHint = 'Link products to enable generation'
  } else if (isDraft) {
    blockedReason = 'Seed is in draft'
    actionHint = 'Approve the seed to enable generation'
  } else if (isRejected) {
    blockedReason = 'Seed is archived'
    actionHint = 'Archived seeds cannot generate posts'
  } else if (isQueued) {
    blockedReason = 'Seed is queued'
    actionHint = 'Generation is pending'
  } else if (isApproved) {
    canGenerate = true
    if (pending === 0 && generated > 0) {
      actionHint = `All ${total} product${total !== 1 ? 's' : ''} generated. Generate again to refresh.`
      canRegenerate = true
    } else if (pending > 0) {
      actionHint = `${pending} product${pending !== 1 ? 's' : ''} ready for generation`
    }
  } else if (isProduced) {
    canGenerate = true
    canRegenerate = true
    actionHint =
      pending > 0
        ? `${pending} product${pending !== 1 ? 's' : ''} ready for regeneration`
        : `All ${total} product${total !== 1 ? 's' : ''} produced. Regenerate available.`
  }

  return {
    canGenerateSeed: canGenerate,
    canGenerateAll: canGenerate && hasProducts,
    canRegenerate,

    eligibleProductIds: eligibleIds,
    generatedProductIds: generatedIds,
    pendingProductIds: pendingIds,
    erroredProductIds: erroredIds,

    generationCoverage: { total, generated, pending, percentage },

    blockedReason,
    actionHint,
  }
}

export function canGenerateProduct(
  productId: string,
  state: GenerationState,
): boolean {
  return state.canGenerateSeed && state.eligibleProductIds.includes(productId)
}

export function isProductGenerated(
  productId: string,
  state: GenerationState,
): boolean {
  return state.generatedProductIds.includes(productId)
}

export function isProductGenerating(
  productId: string,
  generatingProductIds: string[],
): boolean {
  return generatingProductIds.includes(productId)
}

export function getProductActionLabel(
  productId: string,
  state: GenerationState,
  generatingProductIds: string[],
): string {
  if (isProductGenerating(productId, generatingProductIds)) return 'Generating...'
  if (isProductGenerated(productId, state)) {
    return state.canRegenerate ? 'Regenerate' : 'View posts'
  }
  if (state.canGenerateSeed) return 'Generate'
  return 'Blocked'
}

export function getGenerationDisabledReason(
  state: GenerationState,
): string | null {
  return state.blockedReason
}

export function generateActionTooltip(
  productId: string,
  state: GenerationState,
  generatingProductIds: string[],
): string {
  if (isProductGenerating(productId, generatingProductIds)) {
    return 'Post generation in progress...'
  }
  if (isProductGenerated(productId, state)) {
    return state.canRegenerate
      ? 'Regenerate posts for this product'
      : `${state.generatedProductIds.length} post${state.generatedProductIds.length !== 1 ? 's' : ''} already generated`
  }
  if (state.canGenerateSeed) {
    return 'Generate post with this product'
  }
  return state.blockedReason ?? 'Generation not available'
}
