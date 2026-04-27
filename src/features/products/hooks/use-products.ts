import type { GetProductsResponse } from '#/dtos/products'
import type { GetAffiliateLinksResponse } from '#/dtos/affiliate-links'
import type { ManualImportRequest } from '../types/manual-import'
import {
  fetchProducts,
  fetchProductById,
  fetchAllAffiliateLinks,
  fetchAffiliateLinksByProduct,
  manualImportProduct,
} from '../api/product-api'
import { useApiQuery, useApiMutation } from '#/shared/hooks'

export function useProducts() {
  return useApiQuery(['products'], () => fetchProducts(), {
    fallback: [] as unknown as GetProductsResponse,
  })
}

export function useProduct(productId: string) {
  return useApiQuery(
    ['products', productId],
    () => fetchProductById(productId),
    {
      enabled: !!productId,
    },
  )
}

export function useAllAffiliateLinks() {
  return useApiQuery(['affiliate-links'], () => fetchAllAffiliateLinks(), {
    fallback: [] as unknown as GetAffiliateLinksResponse,
  })
}

export function useAffiliateLinks(productId: string) {
  return useApiQuery(
    ['affiliate-links', productId],
    () => fetchAffiliateLinksByProduct(productId),
    {
      enabled: !!productId,
      fallback: [] as unknown as GetAffiliateLinksResponse,
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
