import { useRef, useState } from 'react'
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from '#/components/ui/combobox'
import type { ComboboxOption } from '#/components/ui/combobox-utils'
import {
  filterOptionsByLabel,
  sortSelectedFirst,
} from '#/components/ui/combobox-utils'
import { useProducts } from '@/features/products/hooks/use-products'

interface ProductReferencePanelProps {
  primaryProductId?: string
  supportingProductIds?: string[]
  onPrimaryProductChange: (productId: string) => void
  onSupportingProductsChange: (productIds: string[]) => void
}

function SingleProductSelect({
  options,
  selectedValue,
  onChange,
  placeholder,
  disabled,
}: {
  options: ComboboxOption[]
  selectedValue?: string
  onChange: (value: string | undefined) => void
  placeholder: string
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const selectedOption = options.find((o) => o.value === selectedValue) ?? null
  const filtered = filterOptionsByLabel(options, inputValue)

  return (
    <Combobox
      multiple={false}
      value={selectedOption}
      onValueChange={(option) => onChange(option?.value)}
      inputValue={inputValue}
      onInputValueChange={setInputValue}
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setInputValue(selectedOption?.label ?? '')
      }}
      items={filtered}
      itemToStringLabel={(item) => item.label}
      isItemEqualToValue={(item, value) => item?.value === value?.value}
      disabled={disabled}
    >
      <ComboboxInput placeholder={placeholder} showClear disabled={disabled} />
      <ComboboxContent>
        <ComboboxList>
          <ComboboxCollection>
            {(item) => <ComboboxItem value={item}>{item.label}</ComboboxItem>}
          </ComboboxCollection>
          <ComboboxEmpty>No results found</ComboboxEmpty>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

export default function ProductReferencePanel({
  primaryProductId,
  supportingProductIds = [],
  onPrimaryProductChange,
  onSupportingProductsChange,
}: ProductReferencePanelProps) {
  const { data: products, isLoading } = useProducts()

  const availableProducts: ComboboxOption[] =
    products?.map((p) => ({
      value: p.productId,
      label: p.canonicalTitle,
    })) ?? []

  const anchorRef = useComboboxAnchor()
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const preventCloseRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const selectedSupporting = supportingProductIds
    .map((v) => availableProducts.find((o) => o.value === v))
    .filter(Boolean) as ComboboxOption[]
  const filteredSupporting = sortSelectedFirst(
    filterOptionsByLabel(availableProducts, inputValue),
    selectedSupporting,
  )

  const displayItems = selectedSupporting.slice(0, 2)
  const hiddenCount = Math.max(0, selectedSupporting.length - 2)

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm text-near-white mb-2 font-medium">
          Sản phẩm chính
        </label>
        <SingleProductSelect
          options={availableProducts}
          selectedValue={primaryProductId}
          onChange={(value) => value && onPrimaryProductChange(value)}
          placeholder="Chọn sản phẩm chính"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm text-near-white mb-2 font-medium">
          Sản phẩm hỗ trợ
        </label>
        <Combobox
          multiple
          value={selectedSupporting}
          onValueChange={(items) => {
            const raw = (items).map((o) => o.value)
            onSupportingProductsChange(raw)
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
          items={filteredSupporting}
          itemToStringLabel={(item) => item.label}
          isItemEqualToValue={(item, value) => item?.value === value?.value}
          disabled={isLoading}
        >
          <div ref={anchorRef}>
            <ComboboxChips>
              {displayItems.map((item) => (
                <ComboboxChip key={String(item.value)}>
                  <span className="min-w-0 truncate" title={item.label}>
                    {item.label}
                  </span>
                </ComboboxChip>
              ))}
              {hiddenCount > 0 && (
                <div className="inline-flex items-center justify-center gap-1 rounded-sm bg-muted px-1.5 text-xs font-medium text-foreground">
                  +{hiddenCount}
                </div>
              )}
              <ComboboxChipsInput placeholder="Chọn sản phẩm hỗ trợ" />
            </ComboboxChips>
          </div>
          <ComboboxContent anchor={anchorRef}>
            <ComboboxList>
              <ComboboxCollection>
                {(item) => (
                  <ComboboxItem value={item}>{item.label}</ComboboxItem>
                )}
              </ComboboxCollection>
              <ComboboxEmpty>No results found</ComboboxEmpty>
            </ComboboxList>
          </ComboboxContent>
        </Combobox>

        {supportingProductIds.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {supportingProductIds.map((productId) => {
              const product = availableProducts.find(
                (p) => p.value === productId,
              )
              return (
                <span
                  key={productId}
                  className="inline-flex items-center gap-1 bg-surface-2 text-xs text-near-white px-2 py-1 rounded-md"
                >
                  {product?.label || productId}
                  <button
                    type="button"
                    onClick={() =>
                      onSupportingProductsChange(
                        supportingProductIds.filter((id) => id !== productId),
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
    </div>
  )
}
