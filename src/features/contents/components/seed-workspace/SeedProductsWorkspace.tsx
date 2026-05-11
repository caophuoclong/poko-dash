import {
  Plus,
  X,
  Sparkles,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { useRef, useState } from 'react'
import { Controller } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import {
  filterOptionsByLabel,
  sortSelectedFirst,
} from '@/components/ui/combobox-utils'
import { EmptyState, emptyStatePresets } from '@/components/ui/empty-state'
import { cn } from '#/shared/utils'
import type { ContentSchemaFormData } from '../../schemas/content.schema'

interface Product {
  productId: string
  canonicalTitle: string
  imageCover?: string
  brand?: string
  priceCurrent?: string
  priceSale?: string
}

interface LinkedProduct {
  productId: string
  product: Product
  generatedCount: number
  lastGenerated?: string
  status: 'none' | 'generating' | 'success' | 'error'
}

interface SeedProductsWorkspaceProps {
  control: Control<ContentSchemaFormData>
  allProducts: Product[]
  linkedProducts: LinkedProduct[]
  onGenerateProduct: (productId: string) => void
  onViewPosts: (productId: string) => void
  isGenerating?: string | null
  canGenerate?: boolean
  isApproved?: boolean
}

export function SeedProductsWorkspace({
  control,
  allProducts,
  linkedProducts,
  onGenerateProduct,
  onViewPosts,
  isGenerating = null,
  canGenerate = false,
  isApproved = false,
}: SeedProductsWorkspaceProps) {
  const productOptions: ComboboxOption[] = allProducts.map((p) => ({
    value: p.productId,
    label: p.canonicalTitle,
  }))

  const getStatusBadge = (status: LinkedProduct['status'], count: number) => {
    if (status === 'generating') {
      return (
        <Badge tone="yellow" size="sm">
          <Clock size={12} className="mr-1 animate-spin" />
          Generating
        </Badge>
      )
    }
    if (status === 'error') {
      return (
        <Badge tone="red" size="sm">
          <AlertCircle size={12} className="mr-1" />
          Failed
        </Badge>
      )
    }
    if (count > 0) {
      return (
        <Badge tone="green" size="sm">
          <CheckCircle size={12} className="mr-1" />
          {count} post{count !== 1 ? 's' : ''}
        </Badge>
      )
    }
    return (
      <Badge tone="neutral" size="sm" variant="outline">
        Not generated
      </Badge>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-near-white">
            Linked Products
          </h2>
          <p className="text-sm text-muted-text mt-1">
            Connect products to generate posts from this seed. Each product can
            generate unique content based on the seed's direction.
          </p>
        </div>
        {linkedProducts.length > 0 && isApproved && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-text">
              {linkedProducts.length} product
              {linkedProducts.length !== 1 && 's'} linked
            </span>
            {canGenerate && (
              <Badge tone="blue" size="sm">
                Ready to generate
              </Badge>
            )}
          </div>
        )}
      </div>

      {!isApproved && (
        <div className="bg-accent-yellow/10 border border-accent-yellow/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle
              size={20}
              className="text-accent-yellow shrink-0 mt-0.5"
            />
            <div>
              <p className="text-sm font-medium text-accent-yellow">
                Seed must be approved to generate posts
              </p>
              <p className="text-sm text-muted-text mt-1">
                Approve this seed to enable generation controls for all linked
                products.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-surface-2 border border-frost rounded-xl overflow-hidden">
        {productOptions.length > 0 && (
          <div className="flex items-center gap-3 px-4 py-3 border-b border-dashed border-frost">
            <Plus size={16} className="text-muted-text shrink-0" />
            <Controller
              control={control}
              name="ideaProducts"
              render={({ field }) => {
                const anchorRef = useComboboxAnchor()
                const [cbOpen, setCbOpen] = useState(false)
                const [inputValue, setInputValue] = useState('')
                const preventCloseRef = useRef<ReturnType<typeof setTimeout> | null>(null)

                const selectedOpts = (field.value ?? [])
                  .map((v: string) => productOptions.find((o) => o.value === v))
                  .filter(Boolean) as ComboboxOption[]
                const filtered = sortSelectedFirst(
                  filterOptionsByLabel(productOptions, inputValue),
                  selectedOpts,
                )

                // limitTags={1}
                const displayItems = selectedOpts.slice(0, 1)
                const hiddenCount = Math.max(0, selectedOpts.length - 1)

                return (
                  <Combobox
                    multiple
                    value={selectedOpts}
                    onValueChange={(items) => {
                      const raw = (items as ComboboxOption[]).map((o) => o.value)
                      field.onChange(raw)
                      if (preventCloseRef.current)
                        clearTimeout(preventCloseRef.current)
                      preventCloseRef.current = setTimeout(() => {
                        preventCloseRef.current = null
                      }, 50)
                    }}
                    inputValue={inputValue}
                    onInputValueChange={setInputValue}
                    open={cbOpen}
                    onOpenChange={(next) => {
                      if (!next && preventCloseRef.current) setCbOpen(true)
                      else setCbOpen(next)
                    }}
                    items={filtered}
                    itemToStringLabel={(item) => item.label}
                    isItemEqualToValue={(item, value) =>
                      item?.value === value?.value
                    }
                  >
                    <div ref={anchorRef}>
                      <ComboboxChips className="flex-1">
                        {displayItems.map((item) => (
                          <ComboboxChip key={String(item.value)}>
                            <span
                              className="min-w-0 truncate"
                              title={item.label}
                            >
                              {item.label}
                            </span>
                          </ComboboxChip>
                        ))}
                        {hiddenCount > 0 && (
                          <div className="inline-flex items-center justify-center gap-1 rounded-sm bg-muted px-1.5 text-xs font-medium text-foreground">
                            +{hiddenCount}
                          </div>
                        )}
                        <ComboboxChipsInput
                          placeholder={
                            linkedProducts.length === 0
                              ? 'Select products to link...'
                              : 'Add more products...'
                          }
                        />
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
                )
              }}
            />
          </div>
        )}

        {linkedProducts.length === 0 ? (
          <div className="p-8">
            <EmptyState
              variant="card"
              {...emptyStatePresets.noLinkedProducts}
              className="py-6"
            />
          </div>
        ) : (
          <div className="divide-y divide-frost">
            {linkedProducts.map((linked) => {
              const product = linked.product
              const isProductGenerating = isGenerating === linked.productId

              return (
                <div
                  key={linked.productId}
                  className="p-4 hover:bg-surface-3 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0">
                      {product.imageCover ? (
                        <img
                          src={product.imageCover}
                          alt=""
                          className="w-16 h-16 rounded-lg object-cover border border-frost"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-surface-2 border border-frost flex items-center justify-center">
                          <span className="text-2xl">📦</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-medium text-near-white truncate">
                          {product.canonicalTitle}
                        </h3>
                        {getStatusBadge(linked.status, linked.generatedCount)}
                      </div>
                      {product.brand && (
                        <p className="text-sm text-muted-text mb-2">
                          {product.brand}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-muted-text">
                        {product.priceSale && (
                          <span className="text-accent-orange font-medium">
                            {product.priceSale}
                          </span>
                        )}
                        {product.priceCurrent && !product.priceSale && (
                          <span>{product.priceCurrent}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {linked.generatedCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewPosts(linked.productId)}
                          className="text-accent-blue hover:text-accent-blue-light"
                        >
                          <Eye size={16} />
                        </Button>
                      )}

                      {isApproved && (
                        <Button
                          size="sm"
                          onClick={() => onGenerateProduct(linked.productId)}
                          disabled={isProductGenerating}
                          className={cn(
                            'bg-accent-orange hover:bg-accent-orange-light text-accent-on',
                            isProductGenerating && 'opacity-70',
                          )}
                        >
                          {isProductGenerating ? (
                            <Sparkles size={16} className="animate-spin" />
                          ) : (
                            <>
                              <Sparkles size={16} className="mr-1.5" />
                              Generate
                            </>
                          )}
                        </Button>
                      )}

                      <Controller
                        control={control}
                        name="ideaProducts"
                        render={({ field }) => (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              field.onChange(
                                (field.value ?? []).filter(
                                  (id) => id !== linked.productId,
                                ),
                              )
                            }
                            className="text-muted-text hover:text-accent-red"
                            title="Remove product"
                          >
                            <X size={16} />
                          </Button>
                        )}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
