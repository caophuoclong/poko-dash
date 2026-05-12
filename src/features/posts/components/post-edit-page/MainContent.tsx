import { useState } from 'react'
import { Controller } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import {
  Sparkles,
  ChevronDown,
  Plus,
  X,
  Search,
  Paperclip,
  Image as ImageIcon,
} from 'lucide-react'

import type {
  ContentPostCreateFormData,
  ContentPostEditFormData,
} from '#/features/posts/schemas/content-post.schema'
import { Autocomplete } from '#/components/ui/autocomplete'
import type { AutocompleteOption } from '#/components/ui/autocomplete'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import TiptapEditorWrapper from '#/components/editor/tiptap-editor-wrapper'
import { useProducts } from '@/features/products/hooks/use-products'

interface MainContentProps {
  control: Control<ContentPostEditFormData | ContentPostCreateFormData>
  initialHashtags?: string[]
  setDefaultHashtags?: (hashtags: string[]) => void
  primaryProductId?: string
  supportingProductIds?: string[]
  onPrimaryProductChange?: (productId: string) => void
  onSupportingProductsChange?: (productIds: string[]) => void
}

export default function MainContent({
  control,
  initialHashtags = [],
  setDefaultHashtags,
  primaryProductId,
  supportingProductIds = [],
  onPrimaryProductChange,
  onSupportingProductsChange,
}: MainContentProps) {
  const [aiPanelOpen, setAiPanelOpen] = useState(false)
  const { data: products } = useProducts()

  const productOptions: AutocompleteOption[] =
    products?.map((p) => ({ value: p.productId, label: p.canonicalTitle })) ??
    []

  const linkedProducts =
    products?.filter(
      (p) =>
        p.productId === primaryProductId ||
        supportingProductIds.includes(p.productId),
    ) ?? []

  return (
    <div className="space-y-6">
      {/* ── Title ── */}
      <Controller
        control={control}
        name="title"
        render={({ field }) => (
          <input
            {...field}
            type="text"
            placeholder="Enter post title..."
            className="w-full bg-transparent border-b border-[var(--color-hairline)] pb-2 text-2xl font-display font-bold tracking-tight text-[var(--color-ink)] placeholder:text-[var(--color-muted)] outline-none focus:border-[var(--color-frost-hover)] transition-colors"
          />
        )}
      />

      {/* ── Editor ── */}
      <Controller
        control={control}
        name="body"
        render={({ field }) => (
          <TiptapEditorWrapper
            value={field.value ?? ''}
            onChange={field.onChange}
            placeholder="Start writing your post..."
            maxLength={10000}
          />
        )}
      />

      {/* ── Media attachment ── */}
      <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-hairline)] bg-[var(--color-surface)] px-4 py-5 hover:border-[var(--color-frost-hover)] transition-colors cursor-pointer">
        <div className="flex items-center gap-3 text-[var(--color-muted)]">
          <div className="size-8 rounded-[var(--radius-sm)] bg-[var(--color-surface-soft)] flex items-center justify-center">
            <Paperclip size={14} />
          </div>
          <span className="text-sm">Attach photos or videos</span>
        </div>
      </div>

      {/* ── Hashtags ── */}
      <Controller
        control={control}
        name="hashtags"
        render={({ field }) => {
          const options =
            initialHashtags?.map((item) => ({
              value: item,
              label: item.includes('#') ? item : `#${item}`,
            })) || []
          const values = (field.value || [])
            .map((item) => options.find((o) => o.value === item))
            .filter(Boolean) as AutocompleteOption[]
          return (
            <div>
              <label className="block text-sm font-medium text-[var(--color-muted)] mb-2">
                Hashtags
              </label>
              <Autocomplete
                placeholder="Add hashtags..."
                options={options}
                {...field}
                value={values}
                emitValue="raw"
                multiple
                limitTags={15}
                allowCreate
                onCreateOption={(option) =>
                  setDefaultHashtags?.([...initialHashtags, option.value])
                }
              />
            </div>
          )
        }}
      />

      {/* ── Linked Products ── */}
      <div className="rounded-[var(--radius-md)] border border-[var(--color-hairline)] bg-[var(--color-surface)] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--color-ink)]">
            Linked Products
          </h3>
          <ProductPicker
            options={productOptions}
            primaryProductId={primaryProductId}
            supportingProductIds={supportingProductIds}
            onPrimaryChange={onPrimaryProductChange}
            onSupportingChange={onSupportingProductsChange}
          />
        </div>

        {linkedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {linkedProducts.map((product) => {
              const isPrimary = product.productId === primaryProductId
              return (
                <div
                  key={product.productId}
                  className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] px-3 py-2.5 hover:border-[var(--color-frost-hover)] transition-colors"
                >
                  <div className="size-10 shrink-0 rounded-[var(--radius-xs)] bg-[var(--color-surface-strong)] flex items-center justify-center text-[var(--color-muted)] text-xs font-semibold">
                    {product.canonicalTitle?.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-[var(--color-ink)]">
                      {product.canonicalTitle}
                    </p>
                    {isPrimary && (
                      <span className="text-[11px] text-accent-orange font-medium">
                        Primary
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (isPrimary) onPrimaryProductChange?.('')
                      else
                        onSupportingProductsChange?.(
                          supportingProductIds.filter(
                            (id) => id !== product.productId,
                          ),
                        )
                    }}
                    className="shrink-0 text-[var(--color-muted)] hover:text-accent-red transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-dashed border-[var(--color-hairline)] bg-[var(--color-surface-soft)] px-4 py-5 text-center">
            <ImageIcon
              size={20}
              className="text-[var(--color-muted)] opacity-40"
            />
            <p className="text-xs text-[var(--color-muted)]">
              No products linked yet
            </p>
          </div>
        )}
      </div>

      {/* ── AI Assistant (collapsible) ── */}
      <div className="rounded-[var(--radius-md)] border border-[var(--color-hairline)] bg-[var(--color-surface)] overflow-hidden">
        <button
          type="button"
          onClick={() => setAiPanelOpen(!aiPanelOpen)}
          className="flex w-full items-center justify-between px-5 py-3 text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-surface-soft)] transition-colors"
        >
          <span className="flex items-center gap-2">
            <Sparkles size={15} className="text-accent-orange" />
            AI Assistant
          </span>
          <ChevronDown
            size={15}
            className={`text-[var(--color-muted)] transition-transform ${aiPanelOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {aiPanelOpen && (
          <div className="border-t border-[var(--color-hairline)] px-5 py-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--color-muted)] mb-2">
                Tone
              </label>
              <div className="flex flex-wrap gap-2">
                {['Professional', 'Casual', 'Urgent', 'Friendly'].map(
                  (tone) => (
                    <span
                      key={tone}
                      className="cursor-pointer rounded-[var(--radius-full)] border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] px-3 py-1 text-xs text-[var(--color-muted)] hover:border-accent-orange hover:text-accent-orange transition-colors"
                    >
                      {tone}
                    </span>
                  ),
                )}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-muted)] mb-2">
                Suggestions
              </label>
              <div className="space-y-2">
                <div className="rounded-[var(--radius-sm)] border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] px-3 py-2 text-xs text-[var(--color-muted)]">
                  Add a comparison table to highlight product differences
                </div>
                <div className="rounded-[var(--radius-sm)] border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] px-3 py-2 text-xs text-[var(--color-muted)]">
                  Include a call-to-action with your affiliate link
                </div>
              </div>
            </div>
            <Button color="orange" size="sm" className="w-full">
              <Sparkles size={14} />
              Generate
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function ProductPicker({
  options,
  primaryProductId,
  supportingProductIds,
  onPrimaryChange,
  onSupportingChange,
}: {
  options: AutocompleteOption[]
  primaryProductId?: string
  supportingProductIds?: string[]
  onPrimaryChange?: (id: string) => void
  onSupportingChange?: (ids: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const filtered = options.filter(
    (o) =>
      o.label.toLowerCase().includes(query.toLowerCase()) &&
      o.value !== primaryProductId &&
      !(supportingProductIds ?? []).includes(o.value),
  )

  return (
    <div className="relative">
      <Button variant="outline" size="xs" onClick={() => setOpen(!open)}>
        <Plus size={13} />
        Add Product
      </Button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-64 rounded-[var(--radius-md)] border border-[var(--color-hairline)] bg-[var(--color-canvas)] shadow-lg p-2 space-y-1">
          <div className="relative">
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)] pointer-events-none"
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="pl-8 h-8 text-xs"
              autoFocus
            />
          </div>
          <div className="max-h-40 overflow-y-auto space-y-0.5">
            {filtered.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  if (!primaryProductId) onPrimaryChange?.(opt.value)
                  else
                    onSupportingChange?.([
                      ...(supportingProductIds ?? []),
                      opt.value,
                    ])
                  setOpen(false)
                  setQuery('')
                }}
                className="w-full text-left rounded-[var(--radius-xs)] px-3 py-1.5 text-xs text-[var(--color-ink)] hover:bg-[var(--color-surface-soft)] transition-colors"
              >
                {opt.label}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-3 py-2 text-xs text-[var(--color-muted)]">
                No products found
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
