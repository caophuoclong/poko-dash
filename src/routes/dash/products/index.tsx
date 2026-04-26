import { createFileRoute } from '@tanstack/react-router'
import { productsQueryOptions } from '#/features/products/queries/product-queries'
import { ProductList } from '#/features/products/components/product-list'

export const Route = createFileRoute('/dash/products/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(productsQueryOptions()),
  component: ProductList,
})
