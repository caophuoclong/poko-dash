import type { GetAffiliateLinksResponse } from '#/dtos/affiliate-links'

export type AffiliateLink = GetAffiliateLinksResponse[number]

export type ProductStatus = 'active' | 'processing' | 'done' | 'failed'

export interface Product {
  productId: string
  canonicalTitle: string
  brand?: string
  category: string
  subCategory?: string
  specsKeyFacts?: string
  priceCurrent?: string
  priceSale?: string
  currency?: string
  rating?: number
  reviewCount?: number
  sourceBestUrl: string
  imageCover?: string
  imageVariants?: string
  videoUrl?: string
  descriptionImages?: string
  notes?: string
  variants?: string
  availability?: string
  sellerName?: string
  dealScore: number
  publishScore: number
  freshUntil?: string
  status: ProductStatus
  createdAt: string
  updatedAt: string
  affiliateProduct?: AffiliateLink
}
