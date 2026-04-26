import { Autocomplete } from '#/components/ui/autocomplete'
import type { AutocompleteOption } from '#/components/ui/autocomplete'
import { useProducts } from '@/features/products/hooks/use-products'

interface ProductReferencePanelProps {
  primaryProductId?: string
  supportingProductIds?: string[]
  onPrimaryProductChange: (productId: string) => void
  onSupportingProductsChange: (productIds: string[]) => void
}

export default function ProductReferencePanel({
  primaryProductId,
  supportingProductIds = [],
  onPrimaryProductChange,
  onSupportingProductsChange,
}: ProductReferencePanelProps) {
  const { data: products, isLoading } = useProducts()

  const availableProducts: AutocompleteOption[] =
    products?.map((p) => ({
      value: p.productId,
      label: p.canonicalTitle,
    })) ?? []

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm text-near-white mb-2 font-medium">
          Sản phẩm chính
        </label>
        <Autocomplete
          options={availableProducts}
          value={primaryProductId ?? null}
          onChange={(value) => value && onPrimaryProductChange(value)}
          placeholder="Chọn sản phẩm chính"
          emitValue="raw"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm text-near-white mb-2 font-medium">
          Sản phẩm hỗ trợ
        </label>
        <Autocomplete
          options={availableProducts}
          value={supportingProductIds}
          onChange={(options) => onSupportingProductsChange(options)}
          placeholder="Chọn sản phẩm hỗ trợ"
          limitTags={2}
          multiple
          sortSelectedFirst={true}
          truncateChipLabel={true}
          emitValue="raw"
          disabled={isLoading}
        />

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
