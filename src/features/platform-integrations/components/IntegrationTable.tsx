import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel
  
  
} from '@tanstack/react-table'
import type {ColumnDef, SortingState} from '@tanstack/react-table';
import { Button } from '#/components/ui/button'
import { CommonTable } from '#/components/table/common-table'
import { IntegrationStatusBadge } from './IntegrationStatusBadge'
import { formatTokenExpiry } from '../constants'
import { RefreshCw, Unlink } from 'lucide-react'

interface IntegrationTableProps {
  integrations: import('../types').Integration[]
  isLoading: boolean
  isRefetching: boolean
  onReconnect: (id: string) => void
  onDisconnect: (id: string) => void
  onRefresh: () => void
}

export function IntegrationTable({
  integrations,
  isLoading,
  isRefetching,
  onReconnect,
  onDisconnect,
  onRefresh,
}: IntegrationTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])

  const columns: ColumnDef<import('../types').Integration>[] = useMemo(
    () => [
      {
        accessorKey: 'provider',
        header: 'Provider',
        cell: ({ getValue }) => {
          const value = getValue<string>()
          return (
            <span className="font-medium text-near-white capitalize">
              {value}
            </span>
          )
        },
        size: 120,
      },
      {
        accessorKey: 'targetName',
        header: 'Target',
        cell: ({ row }) => {
          const integration = row.original
          return (
            <div className="flex items-center gap-2 min-w-0">
              {integration.targetAvatar ? (
                <img
                  src={integration.targetAvatar}
                  alt={integration.targetName}
                  className="size-6 shrink-0 rounded-full"
                />
              ) : null}
              <div className="min-w-0">
                <p className="truncate text-sm text-near-white">
                  {integration.targetName}
                </p>
                <p className="text-xs text-muted-text capitalize">
                  {integration.targetType}
                </p>
              </div>
            </div>
          )
        },
        size: 220,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => (
          <IntegrationStatusBadge
            status={getValue<import('../types').Integration['status']>()}
          />
        ),
        size: 100,
      },
      {
        accessorKey: 'tokenExpiresAt',
        header: 'Token expiry',
        cell: ({ getValue }) => {
          const value = getValue<string | undefined>()
          return (
            <span className="text-xs text-muted-text">
              {formatTokenExpiry(value)}
            </span>
          )
        },
        size: 140,
      },
      {
        accessorKey: 'lastCheckedAt',
        header: 'Last checked',
        cell: ({ getValue }) => {
          const value = getValue<string | undefined>()
          if (!value) return <span className="text-xs text-muted-text">—</span>
          return (
            <span className="text-xs text-muted-text">
              {new Date(value).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          )
        },
        size: 140,
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const integration = row.original
          const needsReconnect =
            integration.status === 'expired' || integration.status === 'error'
          return (
            <div className="flex items-center justify-end gap-1">
              {needsReconnect ? (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  color="blue"
                  title="Reconnect"
                  onClick={(e) => {
                    e.stopPropagation()
                    onReconnect(integration.integrationId)
                  }}
                >
                  <RefreshCw size={14} />
                </Button>
              ) : null}
              <Button
                variant="ghost"
                size="icon-xs"
                color="red"
                title="Disconnect"
                onClick={(e) => {
                  e.stopPropagation()
                  onDisconnect(integration.integrationId)
                }}
              >
                <Unlink size={14} />
              </Button>
            </div>
          )
        },
        size: 80,
      },
    ],
    [onReconnect, onDisconnect],
  )

  const data = useMemo(() => integrations, [integrations])

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-text">
          {integrations.length} integration
          {integrations.length !== 1 ? 's' : ''}
        </span>
        <Button
          variant="ghost"
          size="xs"
          color="blue"
          disabled={isRefetching}
          onClick={onRefresh}
        >
          {isRefetching ? (
            <RefreshCw className="size-3.5 animate-spin" />
          ) : (
            <RefreshCw size={14} />
          )}
          Refresh
        </Button>
      </div>
      <CommonTable table={table} isLoading={isLoading} />
    </div>
  )
}
