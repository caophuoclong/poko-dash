import { queryOptions } from '@tanstack/react-query'
import {
  fetchProducts,
  fetchProductById,
  fetchAllAffiliateLinks,
  fetchAffiliateLinksByProduct,
} from '../api/product-api'
import type {
  GetProductsResponse,
  GetProductsByProductIdResponse,
} from '../types/products.dto'
import type { GetAffiliateLinksResponse } from '#/dtos/affiliate-links'

export const productsQueryOptions = (params?: {
  page?: number
  limit?: number
  category?: string
  status?: string
}) =>
  queryOptions<GetProductsResponse>({
    queryKey: ['products', params ?? {}],
    queryFn: () => fetchProducts(params),
    staleTime: 30_000,
  })

export const productQueryOptions = (productId: string) =>
  queryOptions<GetProductsByProductIdResponse>({
    queryKey: ['products', productId],
    queryFn: () => fetchProductById(productId),
    enabled: !!productId,
    staleTime: 30_000,
  })

export const allAffiliateLinksQueryOptions = () =>
  queryOptions<GetAffiliateLinksResponse>({
    queryKey: ['affiliate-links'],
    queryFn: fetchAllAffiliateLinks,
    staleTime: 60_000,
  })

export const affiliateLinksByProductQueryOptions = (productId: string) =>
  queryOptions<GetAffiliateLinksResponse>({
    queryKey: ['affiliate-links', productId],
    queryFn: () => fetchAffiliateLinksByProduct(productId),
    enabled: !!productId,
    staleTime: 30_000,
  })
