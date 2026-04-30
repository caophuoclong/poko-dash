import {
  getProductsControllerListAllQueryOptions,
  getProductsControllerGetByIdQueryOptions,
  getAffiliateLinksControllerListQueryOptions,
} from '#/api/client'

export const productsQueryOptions = (params?: {
  page?: number
  limit?: number
  category?: string
  status?: string
}) => ({
  ...getProductsControllerListAllQueryOptions(),
  staleTime: 30_000,
  select: (res: any) => res.data,
})

export const productQueryOptions = (productId: string) => ({
  ...getProductsControllerGetByIdQueryOptions(productId),
  staleTime: 30_000,
  select: (res: any) => res.data,
})

export const allAffiliateLinksQueryOptions = () => ({
  ...getAffiliateLinksControllerListQueryOptions(),
  staleTime: 60_000,
  select: (res: any) => res.data,
})

export const affiliateLinksByProductQueryOptions = (productId: string) => ({
  ...getAffiliateLinksControllerListQueryOptions(),
  staleTime: 30_000,
  select: (res: any) => res.data,
})
