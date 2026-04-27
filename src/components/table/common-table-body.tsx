import type { Row } from '@tanstack/react-table'
import type { PinnedOffsetMap, CommonTableProps } from './types'
import { CommonTableRow } from './common-table-row'
import type { ReactNode } from 'react'

interface CommonTableBodyProps<TData> {
  rows: Row<TData>[]
  pinnedOffsets: PinnedOffsetMap
  compact: boolean
  isRowDirty?: CommonTableProps<TData>['isRowDirty']
  onRowClick?: CommonTableProps<TData>['onRowClick']
  onRowDoubleClick?: CommonTableProps<TData>['onRowDoubleClick']
  getRowClassName?: CommonTableProps<TData>['getRowClassName']
  footerRow?: ReactNode
}

export function CommonTableBody<TData>({
  rows,
  pinnedOffsets,
  compact,
  isRowDirty,
  onRowClick,
  onRowDoubleClick,
  getRowClassName,
  footerRow,
}: CommonTableBodyProps<TData>) {
  return (
    <tbody>
      {rows.map((row) => {
        const dirty = isRowDirty?.(row.id) ?? false
        const customClass = getRowClassName?.(row.original)

        return (
          <CommonTableRow
            key={row.id}
            row={row}
            pinnedOffsets={pinnedOffsets}
            compact={compact}
            isDirty={dirty}
            onRowClick={onRowClick}
            onRowDoubleClick={onRowDoubleClick}
            rowClassName={customClass}
          />
        )
      })}
      {footerRow}
    </tbody>
  )
}
