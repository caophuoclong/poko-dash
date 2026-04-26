import type {
  GetProductsResponse,
  PostProductsRequest,
  PostProductsResponse,
  PatchProductsByProductIdRequest,
  PatchProductsByProductIdResponse,
  GetProductsByProductIdResponse,
} from '../types/products.dto'
import type {
  GetAffiliateLinksResponse,
  PostAffiliateLinksRequest,
  PostAffiliateLinksResponse,
  PatchAffiliateLinksByLinkIdRequest,
  PatchAffiliateLinksByLinkIdResponse,
} from '#/dtos/affiliate-links'
import type {
  ManualImportRequest,
  ManualImportResponse,
} from '../types/manual-import'
import { apiRequest } from '#/shared/api'

export function fetchProducts(params?: {
  page?: number
  limit?: number
  category?: string
  status?: string
}): Promise<GetProductsResponse> {
  const query = new URLSearchParams()
  if (params?.page) query.set('page', params.page.toString())
  if (params?.limit) query.set('limit', params.limit.toString())
  if (params?.category) query.set('category', params.category)
  if (params?.status) query.set('status', params.status)

  const queryString = query.toString()
  return apiRequest<GetProductsResponse>(
    `/products${queryString ? `?${queryString}` : ''}`,
  )
}

export function fetchProductById(
  id: string,
): Promise<GetProductsByProductIdResponse> {
  return apiRequest<GetProductsByProductIdResponse>(`/products/${id}`)
}

export function createProduct(
  data: PostProductsRequest,
): Promise<PostProductsResponse> {
  return apiRequest<PostProductsResponse>('/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export function updateProduct(
  id: string,
  data: PatchProductsByProductIdRequest,
): Promise<PatchProductsByProductIdResponse> {
  return apiRequest<PatchProductsByProductIdResponse>(`/products/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export function deleteProduct(id: string): Promise<void> {
  return apiRequest<void>(`/products/${id}`, {
    method: 'DELETE',
  })
}

export function fetchAllAffiliateLinks(): Promise<GetAffiliateLinksResponse> {
  return apiRequest<GetAffiliateLinksResponse>('/affiliate-links')
}

export function fetchAffiliateLinksByProduct(
  productId: string,
): Promise<GetAffiliateLinksResponse> {
  return apiRequest<GetAffiliateLinksResponse>(
    `/affiliate-links?productId=${productId}`,
  )
}

export function createAffiliateLink(
  data: PostAffiliateLinksRequest,
): Promise<PostAffiliateLinksResponse> {
  return apiRequest<PostAffiliateLinksResponse>('/affiliate-links', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export function updateAffiliateLink(
  id: string,
  data: PatchAffiliateLinksByLinkIdRequest,
): Promise<PatchAffiliateLinksByLinkIdResponse> {
  return apiRequest<PatchAffiliateLinksByLinkIdResponse>(
    `/affiliate-links/${id}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
  )
}

export function deleteAffiliateLink(id: string): Promise<void> {
  return apiRequest<void>(`/affiliate-links/${id}`, {
    method: 'DELETE',
  })
}

export function manualImportProduct(
  data: ManualImportRequest,
): Promise<ManualImportResponse> {
  return apiRequest<ManualImportResponse>('/manual-import', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}
