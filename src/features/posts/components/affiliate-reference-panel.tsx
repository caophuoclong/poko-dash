import {
  Autocomplete
  
} from '@/components/ui/autocomplete'
import type {AutocompleteOption} from '@/components/ui/autocomplete';

interface AffiliateReferencePanelProps {
  affiliateLinks?: string
  onAffiliateLinksChange: (links: string) => void
  availableLinks: AutocompleteOption[]
}

export default function AffiliateReferencePanel({
  affiliateLinks = '',
  onAffiliateLinksChange,
  availableLinks = [],
}: AffiliateReferencePanelProps) {
  const selectedLinks = affiliateLinks ? affiliateLinks.split('|') : []

  return (
    <div>
      <label className="block text-sm text-near-white mb-2 font-medium">
        Link affiliate
      </label>
      <Autocomplete
        options={availableLinks}
        value={selectedLinks
          .map((id) => availableLinks.find((l) => l.value === id))
          .filter((x): x is AutocompleteOption => x !== undefined)}
        onChange={(options) =>
          onAffiliateLinksChange(options.map((o) => o.value).join('|'))
        }
        placeholder="Chọn link affiliate"
        multiple
      />

      {selectedLinks.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedLinks.map((linkId) => {
            const link = availableLinks.find((l) => l.value === linkId)
            return (
              <span
                key={linkId}
                className="inline-flex items-center gap-1 bg-surface-2 text-xs text-near-white px-2 py-1 rounded-md"
              >
                {link?.label || linkId}
                <button
                  type="button"
                  onClick={() =>
                    onAffiliateLinksChange(
                      selectedLinks.filter((id) => id !== linkId).join('|'),
                    )
                  }
                  className="text-muted-text hover:text-near-white"
                >
                  ×
                </button>
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}
