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
import { usePageHeader } from '@/components/ui/page-header-context'
import { getStatusMeta, PRODUCT_STATUS } from '#/shared/constants'

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

  usePageHeader({ title: 'Sản phẩm', subtitle: `${rows.length} sản phẩm` })

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
        className="bg-surface border border-frost rounded-2xl w-full"
      />
    </div>
  )
}
