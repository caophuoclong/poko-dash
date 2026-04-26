import type {
  GetProductsResponse,
  GetProductsByProductIdResponse,
} from '../types/products.dto'
import type { GetAffiliateLinksResponse } from '#/dtos/affiliate-links'
import type { ManualImportRequest } from '../types/manual-import'
import {
  fetchProducts,
  fetchProductById,
  fetchAllAffiliateLinks,
  fetchAffiliateLinksByProduct,
  manualImportProduct,
} from '../api/product-api'
import { MOCK_PRODUCT, MOCK_AFFILIATE_LINK } from '../components/mock-data'
import { useApiQuery, useApiMutation } from '@/hooks/use-api-query'

export function useProducts() {
  return useApiQuery(
    ['products'],
    async () => {
      const products = await fetchProducts()
      return products.length > 0
        ? products
        : ([MOCK_PRODUCT] as GetProductsResponse)
    },
    { fallback: [MOCK_PRODUCT] as GetProductsResponse },
  )
}

export function useProduct(productId: string) {
  return useApiQuery(
    ['products', productId],
    async () => {
      const product = await fetchProductById(productId)
      return (product ?? MOCK_PRODUCT) as GetProductsByProductIdResponse
    },
    {
      enabled: !!productId,
      fallback: MOCK_PRODUCT as GetProductsByProductIdResponse,
    },
  )
}

export function useAllAffiliateLinks() {
  return useApiQuery(
    ['affiliate-links'],
    async () => {
      const links = await fetchAllAffiliateLinks()
      return links.length > 0
        ? links
        : ([MOCK_AFFILIATE_LINK] as GetAffiliateLinksResponse)
    },
    { fallback: [MOCK_AFFILIATE_LINK] as GetAffiliateLinksResponse },
  )
}

export function useAffiliateLinks(productId: string) {
  return useApiQuery(
    ['affiliate-links', productId],
    async () => {
      const links = await fetchAffiliateLinksByProduct(productId)
      return links.length > 0
        ? links
        : ([MOCK_AFFILIATE_LINK] as GetAffiliateLinksResponse)
    },
    {
      enabled: !!productId,
      fallback: [MOCK_AFFILIATE_LINK] as GetAffiliateLinksResponse,
    },
  )
}

export function useManualImport() {
  return useApiMutation(
    (data: ManualImportRequest) => manualImportProduct(data),
    {
      invalidateKeys: [['products']],
    },
  )
}
