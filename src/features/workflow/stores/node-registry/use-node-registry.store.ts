import { create } from 'zustand'
import type { NodeDefinitionDto } from '#/api/model'
import { useNodeDefinitionControllerList } from '#/api/client'

import { useEffect } from 'react'
import { useShallow } from 'zustand/shallow'
import { CATEGORY_ORDER } from './constants'
import { deriveValidator } from './utils/deriveValdator'

export interface ValidationError {
  propertyKey: string
  message: string
  severity: 'error' | 'warning'
}
export interface NodeDefinition extends NodeDefinitionDto {
  validate: (props: Record<string, unknown>) => ValidationError[]
}

interface NodeRegistryState {
  definitions: Record<NodeDefinition['identity']['typeId'], NodeDefinition>
  status: 'idle' | 'loading' | 'ready' | 'error'
  error: string | null
}
const store = create<NodeRegistryState>(() => ({
  definitions: {},
  status: 'idle',
  error: null,
}))

function formatSummaryValue(value: unknown, format?: string): string {
  if (value === undefined || value === null) return '—'
  switch (format) {
    case 'number':
      return typeof value === 'number' ? value.toLocaleString() : String(value)
    case 'percent':
      return typeof value === 'number' ? `${value}%` : String(value)
    case 'list':
      return Array.isArray(value) ? value.join(', ') : String(value)
    case 'badge':
      return String(value)
    case 'cron':
      return String(value)
    default:
      return String(value)
  }
}

export const getNodeDefinition = (
  typeId: string,
): NodeDefinition | undefined => {
  return store.getState().definitions[typeId]
}

export function useNodeRegistryStore() {
  const query = useNodeDefinitionControllerList()
  const definitions = store((s) => s.definitions)
  useEffect(() => {
    store.setState((state) => ({
      ...state,
      definitions: query.data
        ? Object.fromEntries(
            (query.data.data ?? []).map((def) => [
              def.identity.typeId,
              {
                ...def,
                validate: deriveValidator(def.config?.propertySchema ?? []),
              },
            ]),
          )
        : {},
    }))
  }, [query.data])

  const validateNodeProps = (
    typeId: string,
    props: Record<string, unknown>,
  ): {
    valid: boolean
    errors: ValidationError[]
  } => {
    const def = getNodeDefinition(typeId)
    if (!def) {
      return {
        valid: false,
        errors: [
          {
            propertyKey: 'typeId',
            message: `Unknown node type: ${typeId}`,
            severity: 'error',
          },
        ],
      }
    }
    const errors = def.validate(props)
    return {
      valid: errors.filter((e) => e.severity === 'error').length === 0,
      errors,
    }
  }
  const getNodeSummaryData = (
    typeId: string,
    props: Record<string, unknown>,
  ): { label: string; value: string }[] => {
    const def = getNodeDefinition(typeId)
    if (!def) return []
    return def.ui.summaryFields.map((field) => ({
      label: field.label,
      value: formatSummaryValue(props[field.key], ''),
    }))
  }

  const registerNodeDefinition = (def: NodeDefinition): void => {
    store.setState((state) => {
      const next = { ...state.definitions }
      next[def.identity.typeId] = def
      return { definitions: next }
    })
  }

  // const categories = store(
  //   useShallow((s) => {
  //     const grouped: Record<string, NodeDefinition[]> = {}
  //     const categorySet = new Set(CATEGORY_ORDER)
  //     for (const cat of CATEGORY_ORDER) {
  //       const nodes = Object.values(s.definitions).filter(
  //         (d) => d.identity.category === cat,
  //       )
  //       if (nodes.length > 0) grouped[cat] = nodes
  //     }
  //     const uncategorized = Object.values(s.definitions).filter(
  //       (d) => !categorySet.has(d.identity.category),
  //     )
  //     if (uncategorized.length > 0) grouped['other'] = uncategorized
  //     return grouped
  //   }),
  // )

  return {
    getNodeDefinition,
    allNodeDefinitions: Object.values(definitions),
    validateNodeProps,
    getNodeSummaryData,
    registerNodeDefinition,
    status: query.status,
    error: query.error,
    categories: {},
  }
}
