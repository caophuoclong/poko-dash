import { useRef, useState } from 'react'
import {
  Combobox,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxList,
  ComboboxCollection,
  ComboboxItem,
  ComboboxEmpty,
  useComboboxAnchor,
} from '@/components/ui/combobox'
import type { ComboboxOption } from '@/components/ui/combobox-utils'
import { filterOptionsByLabel } from '@/components/ui/combobox-utils'

interface AffiliateReferencePanelProps {
  affiliateLinks?: string
  onAffiliateLinksChange: (links: string) => void
  availableLinks: ComboboxOption[]
}

export default function AffiliateReferencePanel({
  affiliateLinks = '',
  onAffiliateLinksChange,
  availableLinks = [],
}: AffiliateReferencePanelProps) {
  const anchorRef = useComboboxAnchor()
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const preventCloseRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const selectedLinks = affiliateLinks ? affiliateLinks.split('|') : []
  const selectedOptions = selectedLinks
    .map((id) => availableLinks.find((l) => l.value === id))
    .filter((x): x is ComboboxOption => x !== undefined)
  const filtered = filterOptionsByLabel(availableLinks, inputValue)

  return (
    <div>
      <label className="block text-sm text-near-white mb-2 font-medium">
        Link affiliate
      </label>
      <Combobox
        multiple
        value={selectedOptions}
        onValueChange={(items) => {
          const raw = (items).map((o) => o.value)
          onAffiliateLinksChange(raw.join('|'))
          if (preventCloseRef.current) clearTimeout(preventCloseRef.current)
          preventCloseRef.current = setTimeout(() => {
            preventCloseRef.current = null
          }, 50)
        }}
        inputValue={inputValue}
        onInputValueChange={setInputValue}
        open={open}
        onOpenChange={(next) => {
          if (!next && preventCloseRef.current) setOpen(true)
          else setOpen(next)
        }}
        items={filtered}
        itemToStringLabel={(item) => item.label}
        isItemEqualToValue={(item, value) => item?.value === value?.value}
      >
        <div ref={anchorRef}>
          <ComboboxChips>
            {selectedOptions.map((item) => (
              <ComboboxChip key={String(item.value)}>{item.label}</ComboboxChip>
            ))}
            <ComboboxChipsInput placeholder="Chọn link affiliate" />
          </ComboboxChips>
        </div>
        <ComboboxContent anchor={anchorRef}>
          <ComboboxList>
            <ComboboxCollection>
              {(item) => <ComboboxItem value={item}>{item.label}</ComboboxItem>}
            </ComboboxCollection>
            <ComboboxEmpty>No results found</ComboboxEmpty>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

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
