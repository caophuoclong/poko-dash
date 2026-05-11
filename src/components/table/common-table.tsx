import { useMemo } from 'react'
import type { CommonTableProps } from './types'
import { calculatePinnedOffsets } from './get-pinned-cell-styles'
import { CommonTableHeader } from './common-table-header'
import { CommonTableBody } from './common-table-body'
import { TableLoadingState } from './loading-state'
import { cn } from '#/shared/utils'

export function CommonTable<TData>({
  table,
  isLoading,
  loadingMessage,
  minWidth,
  onRowClick,
  onRowDoubleClick,
  isRowDirty,
  getRowClassName,
  footerRow,
  className,
  compact = false,
}: CommonTableProps<TData>) {
  const pinnedOffsets = useMemo(() => calculatePinnedOffsets(table), [table])
  const resolvedTableWidth = useMemo(
    () => Math.max(minWidth ?? 0, table.getTotalSize()),
    [minWidth, table],
  )
  if (isLoading) {
    return <TableLoadingState message={loadingMessage} />
  }

  return (
    <div
      className={cn(
        'border border-[var(--color-hairline)] rounded-[var(--radius-md)] overflow-hidden bg-[var(--color-canvas)]',
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table
          className="w-full table-auto"
          style={{
            width: '100%',
            minWidth: resolvedTableWidth,
          }}
        >
          <CommonTableHeader
            headerGroups={table.getHeaderGroups()}
            pinnedOffsets={pinnedOffsets}
            compact={compact}
          />
          <CommonTableBody
            rows={table.getRowModel().rows}
            pinnedOffsets={pinnedOffsets}
            compact={compact}
            isRowDirty={isRowDirty}
            onRowClick={onRowClick}
            onRowDoubleClick={onRowDoubleClick}
            getRowClassName={getRowClassName}
            footerRow={footerRow}
          />
        </table>
      </div>
    </div>
  )
}
