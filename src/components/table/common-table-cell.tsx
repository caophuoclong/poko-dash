import { flexRender } from '@tanstack/react-table'
import type { Cell } from '@tanstack/react-table'
import type { PinnedOffsetMap } from './types'
import { getPinnedCellStyles } from './get-pinned-cell-styles'
import { cn } from '#/shared/utils'

interface CommonTableCellProps<TData> {
  cell: Cell<TData, unknown>
  pinnedOffsets: PinnedOffsetMap
  compact: boolean
}

export function CommonTableCell<TData>({
  cell,
  pinnedOffsets,
  compact,
}: CommonTableCellProps<TData>) {
  const pinned = pinnedOffsets.get(cell.column.id)
  const isPinned = pinned?.side ?? false
  const pinnedStyles = getPinnedCellStyles({
    isPinned,
    offset: pinned?.offset ?? 0,
  })

  return (
    <td
      className={cn(
        compact ? 'px-3 py-1.5' : 'px-5 py-4',
        isPinned && 'border-r border-frost/30',
      )}
      style={{
        width: cell.column.getSize(),
        minWidth: cell.column.getSize(),
        maxWidth: cell.column.getSize(),
        ...pinnedStyles,
      }}
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </td>
  )
}
