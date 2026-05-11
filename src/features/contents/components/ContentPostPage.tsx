import { useState, useEffect, useCallback, useMemo } from 'react'
import { useUpdateContentIdea } from '../hooks/use-content-ideas'
import { useGenerateFromIdea } from '@/features/posts/hooks/use-content-posts'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'
import type { SortingState } from '@tanstack/react-table'
import { CommonTable } from '@/components/table'

import { FormProvider, useForm } from 'react-hook-form'
import Header from './Header'
import { getColumns } from '../constants/columns-defined'
import type { ComboboxOption } from '@/components/ui/combobox-utils'
import type {
  ContentIdeaEntity,
  ContentSchemaFormData,
} from '../schemas/content.schema'

export type ContentIdeaTableForm = {
  rows: Record<string, ContentSchemaFormData>
}

export default function ContentPage({
  ideas = [],
}: {
  ideas: ContentIdeaEntity[]
}) {
  const updateIdea = useUpdateContentIdea()
  const generateFromIdea = useGenerateFromIdea()
  const [, setGeneratingId] = useState<string | null>(null)
  const [sorting, setSorting] = useState<SortingState>([])

  const contentIdeaForm = useForm<ContentIdeaTableForm>({
    mode: 'onChange',
    defaultValues: {
      rows: {},
    },
  })

  const {
    getValues,
    clearErrors,
    resetField,
    trigger,
    formState: { dirtyFields },
    handleSubmit,
    reset,
  } = contentIdeaForm

  useEffect(() => {
    if (!ideas.length) return
    const rows: Record<string, ContentSchemaFormData> = {}
    ideas.forEach((idea) => {
      rows[idea.ideaId] = {
        ideaType: idea.ideaType,
        hook: idea.hook,
        angle: idea.angle,
        targetPlatform: idea.targetPlatform,
        category: idea.category,
        priority: idea.priority,
        ideaProducts: idea.ideaProducts ?? [],
      }
    })
    reset({ rows })
  }, [ideas])

  const handleGenerate = useCallback(
    async (ideaId: string) => {
      setGeneratingId(ideaId)
      try {
        await generateFromIdea.mutateAsync(ideaId)
      } finally {
        setGeneratingId(null)
      }
    },
    [generateFromIdea],
  )

  const handleCancelRow = useCallback(
    (ideaId: string) => {
      const rowPath = `rows.${ideaId}` as const
      resetField(rowPath)
      clearErrors(rowPath)
    },
    [resetField, clearErrors],
  )

  const saveEdit = useCallback(
    async (ideaId: string) => {
      const isValid = await trigger([
        `rows.${ideaId}.hook` as const,
        `rows.${ideaId}.angle` as const,
      ])
      if (!isValid) return

      const idea = ideas.find((i) => i.ideaId === ideaId)
      if (!idea) return

      const rowPath = `rows.${ideaId}` as const
      const row = getValues(rowPath)
      if (!row) return

      const data: ContentSchemaFormData = {
        ideaType: row.ideaType,
        hook: row.hook,
        angle: row.angle,
        targetPlatform: row.targetPlatform,
        category: row.category,
        priority: row.priority,
        ideaProducts: row.ideaProducts,
      }

      const payload: Record<string, unknown> = {
        ...data,
        ideaProducts: data.ideaProducts ?? [],
      }

      if (idea.status !== 'draft') {
        payload.status = 'draft'
      }

      await updateIdea.mutateAsync({ ideaId, data: payload })
      resetField(rowPath, { defaultValue: data })
      clearErrors(rowPath)
    },
    [ideas, getValues, updateIdea, resetField, clearErrors, trigger],
  )

  const approve = useCallback(
    (idea: ContentIdeaEntity) => {
      updateIdea.mutate({ ideaId: idea.ideaId, data: { status: 'approved' } })
    },
    [updateIdea],
  )
  const isRowDirty = useCallback(
    (rowId: string) => {
      return dirtyFields.rows?.[rowId] ? true : false
    },
    [dirtyFields],
  )
  const angels = useMemo(() => {
    return Array.from(new Set(ideas.map((idea) => idea.angle)))
      .filter(Boolean)
      .map((angle) => ({ value: angle, label: angle })) as ComboboxOption[]
  }, [ideas])
  const ideaTable = useReactTable({
    data: ideas,
    columns: getColumns(
      isRowDirty,
      handleCancelRow,
      saveEdit,
      approve,
      handleGenerate,
      contentIdeaForm,
      angels,
    ),
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row.ideaId,
  })
  return (
    <FormProvider {...contentIdeaForm}>
      <Header
        ideasLength={ideas.length}
        dirtyCount={Object.keys(dirtyFields.rows ?? {}).length}
        draftCount={ideas.filter((i) => i.status === 'draft').length}
        approvedCount={ideas.filter((i) => i.status === 'approved').length}
      />
      <form onSubmit={handleSubmit(() => undefined)}>
        <CommonTable
          table={ideaTable}
          minWidth={900}
          compact
          isRowDirty={isRowDirty}
          getRowClassName={(idea) => {
            const produced = idea.status === 'produced'
            const dirty = isRowDirty(idea.ideaId)
            if (produced && !dirty) return '[&>*:not(:last-child)]:opacity-40'
            return undefined
          }}
        />
      </form>
    </FormProvider>
  )
}
