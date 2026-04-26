import type { Product } from '../types/product'
import {
  dash,
  formatPriceNum,
  parsePrice,
  parsePriceRange,
  parseDelimitedList,
} from '#/shared/utils'

interface ProductOverviewCardProps {
  product: Product
}

export default function ProductOverviewCard({
  product,
}: ProductOverviewCardProps) {
  const variantTags = parseDelimitedList(product.variants)

  return (
    <div className="bg-surface border border-frost rounded-2xl p-6">
      <h2 className="font-display text-lg font-bold text-near-white mb-4">
        Thông tin sản phẩm
      </h2>

      <div className="space-y-4">
        <div>
          <h3 className="font-display text-base font-semibold text-near-white leading-snug">
            {product.canonicalTitle}
          </h3>
          <div className="text-sm text-muted-text mt-1">
            {dash(product.brand)} · {product.category}
            {product.subCategory && ` · ${product.subCategory}`}
          </div>
        </div>

        <div className="flex items-baseline gap-3">
          {product.priceSale && (
            <span className="font-display text-xl font-bold text-accent-orange">
              {product.priceSale.includes('-')
                ? (() => {
                    const r = parsePriceRange(product.priceSale)
                    return `${formatPriceNum(r.min)}${r.max > 0 ? ` – ${formatPriceNum(r.max)}` : ''}`
                  })()
                : formatPriceNum(parsePrice(product.priceSale))}
            </span>
          )}
          <span
            className={
              product.priceSale
                ? 'text-sm text-muted-text line-through'
                : 'font-display text-xl font-bold text-near-white'
            }
          >
            {product.priceCurrent && product.priceCurrent.includes('-')
              ? (() => {
                  const r = parsePriceRange(product.priceCurrent)
                  return `${formatPriceNum(r.min)}${r.max > 0 ? ` – ${formatPriceNum(r.max)}` : ''}`
                })()
              : formatPriceNum(parsePrice(product.priceCurrent))}
          </span>
        </div>

        {(product.rating || product.reviewCount) && (
          <div className="flex items-center gap-3 text-sm">
            {product.rating && (
              <span className="flex items-center gap-1 text-accent-yellow">
                <StarIcon />
                {product.rating}
              </span>
            )}
            {product.reviewCount && (
              <span className="text-muted-text">
                {product.reviewCount.toLocaleString('vi-VN')} đánh giá
              </span>
            )}
          </div>
        )}

        {variantTags.length > 0 && (
          <div>
            <div className="text-xs text-muted-text mb-2">Phiên bản</div>
            <div className="flex flex-wrap gap-2">
              {variantTags.map((v) => (
                <span
                  key={v}
                  className="px-2.5 py-1 rounded-pill text-xs border border-frost text-near-white bg-surface-2"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        )}

        {product.specsKeyFacts && (
          <div>
            <div className="text-xs text-muted-text mb-2">Thông số chính</div>
            <p className="text-sm text-near-white leading-relaxed">
              {product.specsKeyFacts}
            </p>
          </div>
        )}

        {product.notes && (
          <div>
            <div className="text-xs text-muted-text mb-2">Ghi chú</div>
            <p className="text-sm text-muted-text leading-relaxed">
              {product.notes}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-frost">
          <Field label="Tình trạng" value={dash(product.availability)} />
          <Field label="Người bán" value={dash(product.sellerName)} />
          <Field
            label="Nguồn"
            value={
              <a
                href={product.sourceBestUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-blue no-underline hover:underline text-sm"
              >
                {product.sourceBestUrl.length > 40
                  ? product.sourceBestUrl.slice(0, 40) + '...'
                  : product.sourceBestUrl}
              </a>
            }
          />
        </div>
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs text-muted-text mb-0.5">{label}</div>
      {typeof value === 'string' ? (
        <div className="text-sm text-near-white">{value}</div>
      ) : (
        value
      )}
    </div>
  )
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
      <path d="M7 1l1.5 3.5L12 5.2l-2.5 2.4.6 3.4L7 9.5 3.9 11l.6-3.4L2 5.2l3.5-.7L7 1z" />
    </svg>
  )
}
