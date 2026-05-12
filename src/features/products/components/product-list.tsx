import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useProducts, useAllAffiliateLinks } from '../hooks/use-products'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import { CommonTable } from '@/components/table'
import type { Product } from '../types/product'
import { cn, formatPriceNum, parsePrice, parsePriceRange } from '#/shared/utils'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { usePageHeader } from '@/components/ui/page-header-context'
import { getStatusMeta, PRODUCT_STATUS } from '#/shared/constants'
import { ArrowRight, Link2, PackagePlus, Plus, Sparkles } from 'lucide-react'

interface ProductRow extends Product {
  linkCount: number
}

export function ProductList() {
  const navigate = useNavigate()
  const { data: products, isLoading } = useProducts()
  const { data: links } = useAllAffiliateLinks()
  const [sorting, setSorting] = useState<SortingState>([])

  const rows = useMemo<ProductRow[]>(
    () =>
      (products ?? []).map((p) => ({
        ...p,
        linkCount: (links ?? []).filter(
          (l: { productId: string }) => l.productId === p.productId,
        ).length,
      })),
    [products, links],
  )

  const columns = useMemo<ColumnDef<ProductRow>[]>(
    () => [
      {
        accessorKey: 'canonicalTitle',
        header: 'Sản phẩm',
        cell: ({ row }) => {
          const p = row.original
          return (
            <div className="flex items-center gap-3">
              {p.imageCover ? (
                <img
                  src={p.imageCover}
                  alt=""
                  className="w-10 h-10 rounded-lg object-cover shrink-0 border border-frost"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-surface-2 border border-frost shrink-0" />
              )}
              <div className="min-w-0">
                <div
                  className="text-sm text-near-white truncate"
                  title={p.canonicalTitle}
                  style={{ maxWidth: 360 }}
                >
                  {p.canonicalTitle}
                </div>
                {p.brand && (
                  <div className="text-xs text-muted-text">{p.brand}</div>
                )}
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: 'category',
        header: 'Danh mục',
        cell: ({ row }) => (
          <span>
            {row.original.category}
            {row.original.subCategory && (
              <span className="text-dark-muted">
                {' '}
                / {row.original.subCategory}
              </span>
            )}
          </span>
        ),
      },
      {
        id: 'price',
        header: 'Giá (đ)',
        size: 200,
        accessorFn: (row) => parsePrice(row.priceSale || row.priceCurrent),
        sortingFn: (a, b) => {
          const va = parsePrice(a.original.priceSale || a.original.priceCurrent)
          const vb = parsePrice(b.original.priceSale || b.original.priceCurrent)
          return va - vb
        },
        cell: ({ row }) => {
          const p = row.original
          const currentRange = parsePriceRange(p.priceCurrent)
          return (
            <div className="text-sm text-near-white">
              {formatPriceNum(currentRange.min)}
              {currentRange.max > 0 && currentRange.max !== currentRange.min
                ? ` – ${formatPriceNum(currentRange.max)}`
                : ''}
            </div>
          )
        },
      },
      {
        accessorKey: 'dealScore',
        header: 'Score',
        size: 100,
        cell: ({ getValue }) => {
          const score = getValue<number>()
          return (
            <span
              className={cn(
                'text-xs font-bold',
                score >= 80
                  ? 'text-accent-green'
                  : score >= 50
                    ? 'text-accent-yellow'
                    : 'text-accent-red',
              )}
            >
              {score}
            </span>
          )
        },
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        size: 100,
        cell: ({ getValue }) => {
          const status = getValue<string>()
          const meta = getStatusMeta(PRODUCT_STATUS, status)
          return <Badge tone={meta.tone}>{meta.label}</Badge>
        },
      },
      {
        accessorKey: 'linkCount',
        header: 'Links',
        size: 100,
        cell: ({ getValue }) => {
          const count = getValue<number>()
          return (
            <span className="text-sm text-muted-text">
              {count > 0 ? `${count} link` : '—'}
            </span>
          )
        },
        enableSorting: false,
      },
    ],
    [],
  )

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  usePageHeader({
    title: 'Sản phẩm',
    subtitle: `${rows.length} sản phẩm`,
    actions: (
      <Button
        size="sm"
        onClick={() => {
          void navigate({ to: '/dash/products/manual-import' })
        }}
      >
        <Plus size={15} />
        Import product
      </Button>
    ),
  })

  if (!isLoading && rows.length === 0) {
    return <ProductsEmptyState navigate={navigate} />
  }

  return (
    <div>
      <CommonTable
        table={table}
        isLoading={isLoading}
        onRowClick={(row) => {
          void navigate({
            to: '/dash/products/$productId',
            params: { productId: row.productId },
          })
        }}
        className="w-full"
      />
    </div>
  )
}

const productStarterSteps = [
  {
    title: 'Import product',
    detail: 'Paste a product URL or add details manually.',
    icon: <PackagePlus size={16} />,
  },
  {
    title: 'Attach links',
    detail: 'Store affiliate URLs, coupons, and tracking status.',
    icon: <Link2 size={16} />,
  },
  {
    title: 'Generate angles',
    detail: 'Turn products into reviews, deals, and comparisons.',
    icon: <Sparkles size={16} />,
  },
]

function ProductsEmptyState({
  navigate,
}: {
  navigate: ReturnType<typeof useNavigate>
}) {
  return (
    <div className="grid min-h-[calc(100vh-8rem)] items-start gap-6 pt-6 md:pt-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(480px,1.15fr)] lg:pt-24">
      <section className="max-w-xl space-y-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent-orange-border bg-accent-orange-dim px-3 py-1 text-xs font-semibold text-accent-orange">
          <PackagePlus size={14} />
          Product source
        </div>
        <div className="space-y-3">
          <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-[var(--color-ink)] md:text-4xl">
            Add products before generating affiliate content.
          </h1>
          <p className="max-w-lg text-sm leading-6 text-[var(--color-muted)]">
            Products are the source material for hooks, comparisons, reviews,
            deal posts, and affiliate link tracking.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={() => {
              void navigate({ to: '/dash/products/manual-import' })
            }}
            className="h-11 px-4"
          >
            <Plus size={16} />
            Import first product
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              void navigate({ to: '/dash/content/new' })
            }}
            className="h-11 px-4"
          >
            Create seed
          </Button>
        </div>
      </section>

      <section className="rounded-[var(--radius-md)] border border-[var(--color-hairline)] bg-[var(--color-surface)] p-4 shadow-[0_20px_55px_color-mix(in_srgb,var(--color-void)_14%,transparent)]">
        <div className="border-b border-[var(--color-hairline)] pb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
            Setup path
          </p>
          <h2 className="mt-1 font-display text-xl font-semibold text-[var(--color-ink)]">
            From product to publishable idea
          </h2>
        </div>
        <div className="mt-4 grid gap-3">
          {productStarterSteps.map((step, index) => (
            <div
              key={step.title}
              className="flex items-center gap-4 rounded-[var(--radius-sm)] border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-4"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-xs)] bg-accent-orange-dim text-accent-orange">
                {step.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[var(--color-ink)]">
                  {step.title}
                </p>
                <p className="mt-1 text-xs leading-5 text-[var(--color-muted)]">
                  {step.detail}
                </p>
              </div>
              {index < productStarterSteps.length - 1 ? (
                <ArrowRight
                  size={16}
                  className="hidden shrink-0 text-[var(--color-muted)] sm:block"
                />
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
