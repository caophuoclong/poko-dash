import type { GetAffiliateLinksResponse } from '#/dtos/affiliate-links'
import type { GetProductsResponse } from '#/dtos/products'

export type AffiliateLink = GetAffiliateLinksResponse[number]

export type Product = GetProductsResponse[number]
