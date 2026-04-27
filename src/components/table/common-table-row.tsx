import type { Row } from '@tanstack/react-table'
import type { PinnedOffsetMap } from './types'
import { CommonTableCell } from './common-table-cell'
import { cn } from '#/shared/utils'

interface CommonTableRowProps<TData> {
  row: Row<TData>
  pinnedOffsets: PinnedOffsetMap
  compact: boolean
  isDirty: boolean
  onRowClick?: (data: TData) => void
  onRowDoubleClick?: (data: TData) => void
  rowClassName?: string
}

export function CommonTableRow<TData>({
  row,
  pinnedOffsets,
  compact,
  isDirty,
  onRowClick,
  onRowDoubleClick,
  rowClassName,
}: CommonTableRowProps<TData>) {
  return (
    <tr
      onClick={() => onRowClick?.(row.original)}
      onDoubleClick={() => onRowDoubleClick?.(row.original)}
      className={cn(
        'border-b border-frost/30 transition-colors group',
        onRowClick && 'cursor-pointer',
        !isDirty && (compact ? 'hover:bg-frost/3' : 'hover:bg-surface-2'),
        isDirty && 'bg-(--dirty-bg) color-(--dirty-fg) border-(--dirty-border)',
        rowClassName,
      )}
    >
      {row.getVisibleCells().map((cell) => (
        <CommonTableCell
          key={cell.id}
          cell={cell}
          pinnedOffsets={pinnedOffsets}
          compact={compact}
        />
      ))}
    </tr>
  )
}
