import type { Table } from '@tanstack/react-table'
import type { ReactNode } from 'react'

export interface PinnedOffsetInfo {
  side: 'left' | 'right' | false
  offset: number
}

export type PinnedOffsetMap = Map<string, PinnedOffsetInfo>

export interface CommonTableProps<TData> {
  table: Table<TData>
  isLoading?: boolean
  loadingMessage?: string
  minWidth?: number
  onRowClick?: (data: TData) => void
  onRowDoubleClick?: (data: TData) => void
  isRowDirty?: (rowId: string) => boolean
  getRowClassName?: (data: TData) => string | undefined
  footerRow?: ReactNode
  className?: string
  compact?: boolean
}
