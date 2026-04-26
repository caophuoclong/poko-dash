import type { AffiliateLink } from '../types/product'
import StatusBadge, { deeplinkStatusVariant } from './status-badge'
import { dash, formatDate } from '#/shared/utils'

interface AffiliateLinkCardProps {
  link: AffiliateLink
}

export default function AffiliateLinkCard({ link }: AffiliateLinkCardProps) {
  return (
    <div className="bg-surface border border-frost rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-bold text-near-white">
          Affiliate Link
        </h2>
        <div className="flex items-center gap-2">
          <StatusBadge
            label={link.deeplinkStatus}
            variant={deeplinkStatusVariant(link.deeplinkStatus)}
          />
          {link.active ? (
            <span className="text-xs text-accent-green font-medium">
              Active
            </span>
          ) : (
            <span className="text-xs text-muted-text font-medium">
              Inactive
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <UrlField label="Affiliate URL" url={link.affiliateUrl} />
        <UrlField label="Original URL" url={link.originalUrl} />
        {link.shortUrl && <UrlField label="Short URL" url={link.shortUrl} />}

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-frost">
          <Field label="Merchant" value={dash(link.merchant)} />
          <Field label="Platform" value={dash(link.platform)} />
          <Field
            label="Commission"
            value={
              link.commissionRate != null ? `${link.commissionRate}%` : '—'
            }
          />
          <Field
            label="Coupon"
            value={
              link.couponCode ? (
                <code className="text-xs bg-surface-2 px-2 py-0.5 rounded text-accent-orange">
                  {link.couponCode}
                </code>
              ) : (
                '—'
              )
            }
          />
        </div>

        <div className="text-xs text-muted-text pt-2 border-t border-frost">
          <span>linkId: {link.linkId}</span>
          <span className="mx-2">·</span>
          <span>Tạo: {formatDate(link.createdAt)}</span>
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

function UrlField({ label, url }: { label: string; url: string }) {
  return (
    <div>
      <div className="text-xs text-muted-text mb-1">{label}</div>
      <div className="bg-surface-2 border border-frost rounded-lg px-3 py-2 flex items-center gap-2 group">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-accent-blue hover:underline flex-1 break-all leading-relaxed"
        >
          {url}
        </a>
        <button
          onClick={(e) => {
            e.preventDefault()
            navigator.clipboard.writeText(url)
          }}
          className="flex-shrink-0 text-muted-text hover:text-near-white transition-colors opacity-0 group-hover:opacity-100"
          title="Copy URL"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <rect x="4.5" y="4.5" width="7" height="7" rx="1" />
            <path d="M9.5 4.5V3a1 1 0 00-1-1H3a1 1 0 00-1 1v5.5a1 1 0 001 1h1.5" />
          </svg>
        </button>
      </div>
    </div>
  )
}
