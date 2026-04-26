// layer: types
export interface AffiliateProduct {
  linkId: string
  productId: string
  merchant: string
  originalUrl: string
  affiliateUrl: string
  shortUrl?: string
  platform: string
  commissionRate?: number
  couponCode?: string
  deeplinkStatus: 'valid' | 'broken' | 'pending' | 'expired'
  active: boolean
  createdAt: string
}
