import { createFileRoute } from '@tanstack/react-router'
import { productQueryOptions } from '#/features/products/queries/product-queries'
import ProductDetailPage from '#/features/products/components/product-detail-page'

export const Route = createFileRoute('/dash/products/$productId')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(productQueryOptions(params.productId)),
  component: Component,
})

function Component() {
  const { productId } = Route.useParams()
  return <ProductDetailPage productId={productId} />
}
