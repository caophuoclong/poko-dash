import { flexRender } from '@tanstack/react-table'
import type { HeaderGroup } from '@tanstack/react-table'
import type { PinnedOffsetMap } from './types'
import { getPinnedCellStyles } from './get-pinned-cell-styles'
import { SortIndicator } from './sort-indicator'
import { cn } from '#/shared/utils'

interface CommonTableHeaderProps<TData> {
  headerGroups: HeaderGroup<TData>[]
  pinnedOffsets: PinnedOffsetMap
  compact: boolean
}

export function CommonTableHeader<TData>({
  headerGroups,
  pinnedOffsets,
  compact,
}: CommonTableHeaderProps<TData>) {
  return (
    <thead>
      {headerGroups.map((hg) => (
        <tr key={hg.id} className="border-b border-frost/50 bg-surface/50">
          {hg.headers.map((header) => {
            const pinned = pinnedOffsets.get(header.column.id)
            const isPinned = pinned?.side ?? false
            const pinnedStyles = getPinnedCellStyles({
              isPinned,
              offset: pinned?.offset ?? 0,
            })

            return (
              <th
                key={header.id}
                className={cn(
                  'text-left text-[11px] font-medium uppercase tracking-wider text-dark-muted whitespace-nowrap',
                  compact ? 'px-3 py-2' : 'px-5 py-3',
                  header.column.getCanSort() &&
                    'cursor-pointer select-none hover:text-muted-text transition-colors',
                  isPinned && 'border-r border-frost/30',
                )}
                style={{
                  width: header.getSize(),
                  minWidth: header.getSize(),
                  maxWidth: header.getSize(),
                  ...pinnedStyles,
                }}
                onClick={header.column.getToggleSortingHandler()}
              >
                <div className="flex items-center gap-1 select-none">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  {header.column.getCanSort() && (
                    <SortIndicator sorted={header.column.getIsSorted()} />
                  )}
                </div>
              </th>
            )
          })}
        </tr>
      ))}
    </thead>
  )
}
