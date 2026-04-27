export interface ShopeeProductInfo {
  name?: string
  price?: string
  rating?: string
  sold?: string
  stock?: string
  variants?: string[]
  shipping?: string[]
}

export interface ShopeeProductPreview {
  video?: string
  images?: string[]
}

export interface ShopeeProductData {
  info?: ShopeeProductInfo
  preview?: ShopeeProductPreview
  details?: Record<string, string | string[]>
  descriptions?: { text?: string; images?: string[] }
  url: string
}

export interface ManualImportRequest {
  affiliate_url: string
  product_data: ShopeeProductData
}

export interface ManualImportResponse {
  product: {
    product_id: string
    canonical_title: string
  }
}
