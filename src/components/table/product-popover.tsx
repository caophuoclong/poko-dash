import { useState, useMemo } from 'react'
import { X, Plus } from 'lucide-react'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useProducts } from '@/features/products/hooks/use-products'
import type { Product } from '@/features/products/types/product'

interface ProductPopoverProps {
  productIds: string[]
  onProductsChange: (ids: string[]) => void
  disabled?: boolean
}

export function ProductPopover({
  productIds,
  onProductsChange,
  disabled = false,
}: ProductPopoverProps) {
  const { data: allProducts = [] } = useProducts()
  const [searchQuery, setSearchQuery] = useState('')
  const [open, setOpen] = useState(false)

  // Get selected products
  const selectedProducts = useMemo(
    () =>
      allProducts
        .filter((p) => productIds.includes(p.productId))
        .sort(
          (a, b) =>
            productIds.indexOf(a.productId) - productIds.indexOf(b.productId),
        ),
    [allProducts, productIds],
  )

  // Get unselected products matching search
  const searchResults = useMemo(() => {
    const query = searchQuery.toLowerCase()
    const unselectedProducts = allProducts.filter(
      (p) => !productIds.includes(p.productId),
    )

    return unselectedProducts
      .filter(
        (p) =>
          p.canonicalTitle?.toLowerCase().includes(query) ||
          p.brand?.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query),
      )
      .slice(0, 10) // Limit to 10 results
  }, [allProducts, productIds, searchQuery])

  const handleAddProduct = (productId: string) => {
    onProductsChange([...productIds, productId])
  }

  const handleRemoveProduct = (productId: string) => {
    onProductsChange(productIds.filter((id) => id !== productId))
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs text-muted-text"
        >
          {productIds.length > 0
            ? `${productIds.length} sản phẩm`
            : 'Chọn sản phẩm'}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        className="w-96 p-0 border-frost bg-surface-2"
      >
        <div className="flex flex-col max-h-[500px]">
          {/* Search */}
          <div className="p-3 border-b border-frost sticky top-0 bg-surface-2">
            <Input
              placeholder="Tìm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 text-xs"
              autoFocus
            />
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-1">
            {/* Selected Products */}
            {selectedProducts.length > 0 && (
              <div className="border-b border-frost/50">
                <div className="px-3 py-2 text-xs font-medium text-muted-text bg-surface/50">
                  Đã chọn ({selectedProducts.length})
                </div>
                {selectedProducts.map((product) => (
                  <ProductItem
                    key={product.productId}
                    product={product}
                    isSelected={true}
                    onRemove={() => handleRemoveProduct(product.productId)}
                    truncateText={truncateText}
                  />
                ))}
              </div>
            )}

            {/* Search Results */}
            {searchQuery && (
              <div>
                <div className="px-3 py-2 text-xs font-medium text-muted-text bg-surface/50">
                  Kết quả tìm kiếm
                </div>
                {searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <ProductItem
                      key={product.productId}
                      product={product}
                      isSelected={false}
                      onAdd={() => handleAddProduct(product.productId)}
                      truncateText={truncateText}
                    />
                  ))
                ) : (
                  <div className="px-3 py-4 text-xs text-muted-text text-center">
                    Không tìm thấy sản phẩm
                  </div>
                )}
              </div>
            )}

            {/* All Products (when no search) */}
            {!searchQuery && selectedProducts.length === 0 && (
              <div>
                <div className="px-3 py-2 text-xs font-medium text-muted-text bg-surface/50">
                  Tất cả sản phẩm
                </div>
                {allProducts.slice(0, 10).map((product) => (
                  <ProductItem
                    key={product.productId}
                    product={product}
                    isSelected={false}
                    onAdd={() => handleAddProduct(product.productId)}
                    truncateText={truncateText}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface ProductItemProps {
  product: Product
  isSelected: boolean
  onRemove?: () => void
  onAdd?: () => void
  truncateText: (text: string, maxLength: number) => string
}

function ProductItem({
  product,
  isSelected,
  onRemove,
  onAdd,
  truncateText,
}: ProductItemProps) {
  return (
    <div className="px-3 py-2.5 hover:bg-surface/60 transition-colors flex gap-2.5">
      {/* Image */}
      <div className="flex-shrink-0">
        {product.imageCover ? (
          <img
            src={product.imageCover}
            alt={product.canonicalTitle}
            className="w-12 h-12 rounded object-cover border border-frost/30"
          />
        ) : (
          <div className="w-12 h-12 rounded bg-surface border border-frost/30 flex items-center justify-center text-xs text-muted-text" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-near-white truncate">
          {product.notes}
        </div>
        <div className="text-[11px] text-muted-text mt-0.5 line-clamp-2">
          {truncateText(product.descriptionImages || '', 200) ||
            truncateText(product.specsKeyFacts || '', 200) ||
            'Không có mô tả'}
        </div>
      </div>

      {/* Action Button */}
      <div className="flex-shrink-0 flex items-center">
        {isSelected ? (
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={onRemove}
            className="text-accent-red hover:bg-accent-red/10 hover:text-accent-red"
          >
            <X size={14} />
          </Button>
        ) : (
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={onAdd}
            className="text-accent-green hover:bg-accent-green/10 hover:text-accent-green"
          >
            <Plus size={14} />
          </Button>
        )}
      </div>
    </div>
  )
}
