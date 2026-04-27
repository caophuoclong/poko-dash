import {
  TextCell,
  Dropdown,
  RowEditActions,
  RowStatusCell,
  ProductPopover,
} from '@/components/table'
import { Sparkles, Loader2, CheckCircle } from 'lucide-react'
import { Controller, type UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'

import type { ColumnDef } from '@tanstack/react-table'
import { PriorityDot } from '../components/PriorityDot'
import {
  Autocomplete,
  type AutocompleteOption,
} from '@/components/ui/autocomplete'
import { useEffect, useState } from 'react'
import { cn } from '#/shared/utils'
import { formatDate } from '#/shared/utils'
import type { ContentIdeaTableForm } from '../components/ContentPostPage'
import {
  IdeaType,
  TargetPlatform,
  type ContentIdeaEntity,
} from '../schemas/content.schema'
const PLATFORM_OPTIONS: {
  value: TargetPlatform
  label: string
  icon: string
}[] = [
  { value: TargetPlatform.TikTok, label: 'TikTok', icon: 'TT' },
  { value: TargetPlatform.Facebook, label: 'Facebook', icon: 'FB' },
  { value: TargetPlatform.Instagram, label: 'Instagram', icon: 'IG' },
  { value: TargetPlatform.YouTube, label: 'YouTube', icon: 'YT' },
  { value: TargetPlatform.Blog, label: 'Blog', icon: 'BG' },
]

const CATEGORY_OPTIONS: { value: string; label: string; color: string }[] = [
  {
    value: 'Điện tử',
    label: 'Điện tử',
    color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  {
    value: 'Phụ kiện',
    label: 'Phụ kiện',
    color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  {
    value: 'Gia dụng',
    label: 'Gia dụng',
    color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  {
    value: 'Thời trang',
    label: 'Thời trang',
    color: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  },
  {
    value: 'Làm đẹp',
    label: 'Làm đẹp',
    color: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  },
  {
    value: 'Thể thao',
    label: 'Thể thao',
    color: 'bg-green-500/10 text-green-400 border-green-500/20',
  },
  {
    value: 'uncategorized',
    label: 'Khác',
    color: 'bg-surface-2 text-muted-text border-frost',
  },
]

const STATUS_DISPLAY: Record<
  string,
  { label: string; dot: string; bg: string }
> = {
  draft: {
    label: 'Nháp',
    dot: 'bg-accent-blue',
    bg: 'bg-accent-blue-dim text-accent-blue',
  },
  approved: {
    label: 'Đã duyệt',
    dot: 'bg-accent-green',
    bg: 'bg-accent-green-dim text-accent-green',
  },
  produced: {
    label: 'Generated',
    dot: 'bg-accent-orange',
    bg: 'bg-accent-orange-dim text-accent-orange',
  },
  producing: {
    label: 'Generating',
    dot: 'bg-accent-orange',
    bg: 'bg-accent-orange-dim text-accent-orange',
  },
  failed: {
    label: 'Failed',
    dot: 'bg-accent-red',
    bg: 'bg-accent-red/10 text-accent-red',
  },
}

const COMPLETE_STATUS: keyof typeof STATUS_DISPLAY = 'produced'
const TYPE_OPTIONS: { value: IdeaType; label: string; color: string }[] = [
  {
    value: IdeaType.Review,
    label: 'Review',
    color: 'bg-accent-blue-dim text-accent-blue border-accent-blue/20',
  },
  {
    value: IdeaType.Comparison,
    label: 'So sánh',
    color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
  {
    value: IdeaType.Roundup,
    label: 'Tổng hợp',
    color:
      'bg-accent-orange-dim text-accent-orange border-accent-orange-border',
  },
  {
    value: IdeaType.Tutorial,
    label: 'Hướng dẫn',
    color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  {
    value: IdeaType.Deal,
    label: 'Deal',
    color: 'bg-accent-red/10 text-accent-red border-accent-red/20',
  },
  {
    value: IdeaType.Trending,
    label: 'Xu hướng',
    color: 'bg-accent-yellow/10 text-accent-yellow border-accent-yellow/20',
  },
]
const TYPE_MAP = Object.fromEntries(TYPE_OPTIONS.map((o) => [o.value, o]))
const PLATFORM_MAP = Object.fromEntries(
  PLATFORM_OPTIONS.map((o) => [o.value, o]),
)
const CATEGORY_MAP = Object.fromEntries(
  CATEGORY_OPTIONS.map((o) => [o.value, o]),
)

export const getColumns: (
  isRowDirty: (id: string) => boolean,
  handleCancelRow: (id: string) => void,
  saveEdit: (id: string) => void,
  approve: (idea: ContentIdeaEntity) => void,
  handleGenerate: (id: string) => void,
  form: UseFormReturn<ContentIdeaTableForm>,
  angle?: AutocompleteOption[],
) => ColumnDef<ContentIdeaEntity>[] = (
  isRowDirty,
  handleCancelRow,
  saveEdit,
  approve,
  handleGenerate,
  form,
  defaultAngle = [],
) => {
  const [angle, setAngle] = useState<AutocompleteOption[]>([])

  useEffect(() => {
    if (defaultAngle.length > 0) setAngle(defaultAngle)
  }, [defaultAngle])
  const {
    control,
    formState: { errors },
  } = form
  return [
    {
      accessorKey: 'ideaType',
      header: 'Loại',
      size: 150,
      cell: ({ row }) => {
        const idea = row.original
        return (
          <Controller
            name={`rows.${idea.ideaId}.ideaType` as const}
            control={control}
            render={({ field }) => (
              <Dropdown
                {...field}
                disabled={idea.status === COMPLETE_STATUS}
                value={field.value || idea.ideaType}
                options={TYPE_OPTIONS}
                renderTrigger={(cur) => {
                  const opt = TYPE_MAP[cur.value as IdeaType]
                  return opt ? (
                    <span
                      className={cn(
                        'text-[11px] px-2 py-0.5 rounded-md border font-medium',
                        opt.color,
                      )}
                    >
                      {opt.label}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-text">{cur.label}</span>
                  )
                }}
              />
            )}
          />
        )
      },
      enableSorting: true,
    },
    {
      accessorKey: 'hook',
      header: 'Hook',
      size: 280,
      cell: ({ row }) => {
        const idea = row.original
        return (
          <Controller
            control={control}
            name={`rows.${idea.ideaId}.hook` as const}
            render={({ field, fieldState }) => {
              const val = (field.value as string | undefined) ?? idea.hook
              const error = fieldState.error?.message || null
              return (
                <div className="flex items-center gap-1.5 min-w-0">
                  <TextCell
                    {...field}
                    value={val}
                    disabled={idea.status === COMPLETE_STATUS}
                    placeholder="Nhập hook..."
                    width="240px"
                    error={error}
                  />
                  <Link
                    to="/dash/content/$ideaId"
                    params={{ ideaId: idea.ideaId }}
                    className="shrink-0 text-muted-text hover:text-accent-blue transition-colors"
                    title="Xem chi tiết"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M10 6H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-4M14 2h-4m4 0v4m0-4L8 8" />
                    </svg>
                  </Link>
                </div>
              )
            }}
          />
        )
      },
    },
    {
      accessorKey: 'angle',
      header: 'Góc nhìn',
      size: 200,
      cell: ({ row }) => {
        const idea = row.original
        return (
          <Controller
            control={control}
            name={`rows.${idea.ideaId}.angle` as const}
            render={({ field }) => {
              const val =
                ((field.value as string | undefined) ?? idea.angle) || ''
              const angel = angle || []
              const values = val.split(',').map((v) => v.trim())
              return (
                <Autocomplete
                  {...field}
                  getData={() => angel}
                  value={angel.filter((o) => values.includes(o.value))}
                  onChange={(value) =>
                    field.onChange(value.map((v) => v.value).join(','))
                  }
                  multiple
                  disabled={idea.status === COMPLETE_STATUS}
                  placeholder="Nhập góc nhìn..."
                  allowCreate
                  limitTags={2}
                  onCreateOption={(option) => {
                    setAngle((prev) => [...(prev || []), option.value])
                  }}
                />
              )
            }}
          />
        )
      },
    },
    {
      accessorKey: 'ideaProducts',
      header: 'Sản phẩm',
      size: 120,
      cell: ({ row }) => {
        const idea = row.original
        return (
          <Controller
            name={`rows.${idea.ideaId}.ideaProducts` as const}
            control={control}
            render={({ field }) => (
              <ProductPopover
                productIds={field.value || []}
                onProductsChange={(ids) => field.onChange(ids)}
                disabled={idea.status === COMPLETE_STATUS}
              />
            )}
          />
        )
      },
    },
    {
      accessorKey: 'targetPlatform',
      header: 'Nền tảng',
      size: 120,
      cell: ({ row }) => {
        const idea = row.original

        return (
          <Controller
            name={`rows.${idea.ideaId}.targetPlatform` as const}
            control={control}
            render={({ field }) => (
              <Dropdown
                {...field}
                disabled={idea.status === COMPLETE_STATUS}
                value={field.value || idea.targetPlatform}
                options={PLATFORM_OPTIONS}
                renderTrigger={(cur) => {
                  const p = PLATFORM_MAP[cur.value as TargetPlatform]
                  return p ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-text">
                      <span className="w-5 h-5 rounded bg-surface-2 flex items-center justify-center text-[9px] font-bold text-near-white">
                        {p.icon}
                      </span>
                      {p.label}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-text">{cur.label}</span>
                  )
                }}
              />
            )}
          />
        )
      },
      enableSorting: true,
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      size: 120,
      cell: ({ row }) => (
        <RowStatusCell status={row.original.status} config={STATUS_DISPLAY} />
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'priority',
      header: 'Ưu tiên',
      size: 70,
      cell: ({ row }) => {
        const idea = row.original
        return (
          <Controller
            name={`rows.${idea.ideaId}.priority` as const}
            control={control}
            render={({ field }) => (
              <PriorityDot
                {...field}
                disabled={idea.status === COMPLETE_STATUS}
                value={field.value || idea.priority}
              />
            )}
          />
        )
      },
      enableSorting: true,
    },
    {
      accessorKey: 'category',
      header: 'Danh mục',
      size: 120,
      cell: ({ row }) => {
        const idea = row.original

        return (
          <Controller
            name={`rows.${idea.ideaId}.category` as const}
            control={control}
            render={({ field }) => (
              <Dropdown
                {...field}
                disabled={idea.status === COMPLETE_STATUS}
                value={field.value || idea.category}
                options={CATEGORY_OPTIONS}
                renderTrigger={(cur) => {
                  const opt = CATEGORY_MAP[cur.value]
                  return opt ? (
                    <span
                      className={cn(
                        'text-[11px] px-2 py-0.5 rounded-md border font-medium',
                        opt.color,
                      )}
                    >
                      {opt.label}
                    </span>
                  ) : (
                    <span className="text-sm text-near-white">{cur.value}</span>
                  )
                }}
              />
            )}
          />
        )
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Tạo lúc',
      size: 150,
      cell: ({ getValue }) => (
        <span className="text-xs text-muted-text">
          {formatDate(getValue<string>())}
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'updatedAt',
      header: 'Cập nhật lúc',
      size: 150,
      cell: ({ getValue }) => (
        <span className="text-xs text-muted-text">
          {formatDate(getValue<string>())}
        </span>
      ),
      enableSorting: true,
    },
    {
      id: 'actions',
      header: '',
      size: 200,
      cell: ({ row }) => {
        const idea = row.original
        const id = idea.ideaId
        const dirty = isRowDirty(id)
        const hasErrors = errors.rows?.[id] ? true : false
        if (dirty || hasErrors) {
          return (
            <RowEditActions
              onCancel={() => handleCancelRow(id)}
              saveDisabled={hasErrors}
              onSave={() => {
                void saveEdit(id)
              }}
            />
          )
        }

        const isDraft = idea.status === 'draft'
        const isApproved = idea.status === 'approved'
        const isProduced = idea.status === COMPLETE_STATUS

        if (isDraft) {
          return (
            <div className="flex justify-center">
              <Button
                size="sm"
                color="green-dim"
                onClick={() => approve(idea)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all active:scale-[0.97]"
              >
                Approve
              </Button>
            </div>
          )
        }

        if (isApproved) {
          const isGenerating = '' === id
          return (
            <div className="flex justify-center">
              <Button
                size="sm"
                onClick={() => handleGenerate(id)}
                disabled={isGenerating}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all',
                  isGenerating
                    ? 'bg-accent-orange/30 text-accent-orange/70'
                    : 'bg-accent-orange text-accent-on hover:brightness-110 active:scale-[0.97]',
                )}
              >
                {isGenerating ? (
                  <Loader2 size={11} className="animate-spin" />
                ) : (
                  <Sparkles size={11} />
                )}
                Generate
              </Button>
            </div>
          )
        }

        if (isProduced) {
          const postCount = idea.postIds?.length ?? 0
          return (
            <div className="flex justify-center">
              {postCount > 0 ? (
                <Button
                  variant={'link'}
                  color="blue"
                  size={'sm'}
                  className="inline-flex items-center gap-1 text-[11px] text-muted-text cursor-pointer select-none"
                  asChild
                >
                  <Link to="/dash/posts" search={{ ideaId: idea.ideaId }}>
                    <CheckCircle size={11} />
                    View {postCount} post{postCount !== 1 ? 's' : ''}
                  </Link>
                </Button>
              ) : (
                <Button
                  variant={'link'}
                  color="blue"
                  size={'sm'}
                  className="inline-flex items-center gap-1 text-[11px] text-muted-text cursor-pointer select-none"
                  disabled
                >
                  <CheckCircle size={11} />
                  View 0 posts
                </Button>
              )}
            </div>
          )
        }

        return null
      },
      enableSorting: false,
    },
  ]
}
