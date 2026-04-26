import { Link } from '@tanstack/react-router'
import { parseDelimitedList } from '#/shared/product-utils'
import { useProduct } from '../hooks/use-products'
import MediaGallery from './media-gallery'
import ProductOverviewCard from './product-overview-card'
import AffiliateLinkCard from './affiliate-link-card'
import MetadataCard from './metadata-card'

interface ProductDetailPageProps {
  productId: string
}

export default function ProductDetailPage({
  productId,
}: ProductDetailPageProps) {
  const { data: product, isLoading } = useProduct(productId)

  if (!productId || isLoading) {
    return <LoadingSpinner />
  }

  if (!product) {
    return <NotFoundState />
  }

  const variantImages = parseDelimitedList(product.imageVariants)
  const primaryLink = product.affiliateProduct
  const hasIdMismatch =
    primaryLink && primaryLink.productId !== product.productId

  return (
    <div className="max-w-full mx-auto">
      <div className="mb-6">
        <Link
          to="/dash/products"
          className="text-sm text-muted-text hover:text-near-white transition-colors no-underline inline-flex items-center gap-1"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 3L5 8l5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Quay lại
        </Link>
      </div>

      {hasIdMismatch && (
        <div className="mb-6 p-4 rounded-xl border border-accent-red/30 bg-accent-red/5 text-sm text-accent-red flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 4v5M8 11.5v1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle
              cx="8"
              cy="8"
              r="7"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          productId không khớp giữa Product và AffiliateLink
        </div>
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-3 grid-rows-1 gap-6">
          <MediaGallery
            coverImage={product.imageCover}
            variantImages={variantImages}
            videoUrl={product.videoUrl}
          />
          <div className="col-span-2 space-y-4">
            <MetadataCard product={product} />
            {primaryLink ? (
              <AffiliateLinkCard link={primaryLink} />
            ) : (
              <div className="bg-surface border border-frost rounded-2xl p-6 text-center">
                <p className="text-sm text-muted-text">
                  Chưa có affiliate link cho sản phẩm này
                </p>
              </div>
            )}
          </div>
        </div>

        <ProductOverviewCard product={product} />
      </div>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-3 text-muted-text">
        <svg
          className="animate-spin"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.25"
          />
          <path
            d="M12 2a10 10 0 019.5 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span className="text-sm">Đang tải...</span>
      </div>
    </div>
  )
}

function NotFoundState() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <p className="text-accent-red text-sm mb-2">Không tìm thấy sản phẩm</p>
        <Link
          to="/dash/products"
          className="text-sm text-accent-blue hover:underline"
        >
          ← Quay lại
        </Link>
      </div>
    </div>
  )
}
