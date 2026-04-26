import type { Product } from '../types/product'
import StatusBadge, { productStatusVariant } from './status-badge'
import { formatDate, scoreBg, scoreColor } from '#/shared/product-utils'

interface MetadataCardProps {
  product: Product
}

export default function MetadataCard({ product }: MetadataCardProps) {
  return (
    <div className="bg-surface border border-frost rounded-2xl p-6">
      <h2 className="font-display text-lg font-bold text-near-white mb-4">
        Metadata
      </h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-text">Status</span>
          <StatusBadge
            label={product.status}
            variant={productStatusVariant(product.status)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ScoreField label="Deal Score" score={product.dealScore} />
          <ScoreField label="Publish Score" score={product.publishScore} />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-frost">
          <Field label="Fresh until" value={formatDate(product.freshUntil)} />
          <Field label="Product ID" value={product.productId} mono />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-frost">
          <Field label="Created" value={formatDate(product.createdAt)} />
          <Field label="Updated" value={formatDate(product.updatedAt)} />
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div>
      <div className="text-xs text-muted-text mb-0.5">{label}</div>
      <div
        className={
          mono ? 'text-xs text-muted-text font-mono' : 'text-sm text-near-white'
        }
      >
        {value}
      </div>
    </div>
  )
}

function ScoreField({ label, score }: { label: string; score: number }) {
  return (
    <div>
      <div className="text-xs text-muted-text mb-1.5">{label}</div>
      <div className="flex items-center gap-2">
        <div
          className={`w-8 h-8 rounded-lg ${scoreBg(score)} flex items-center justify-center`}
        >
          <span className={`text-xs font-bold ${scoreColor(score)}`}>
            {score}
          </span>
        </div>
        <div className="flex-1 h-1.5 rounded-full bg-surface-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${score >= 80 ? 'bg-accent-green' : score >= 50 ? 'bg-accent-yellow' : 'bg-accent-red'}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  )
}
