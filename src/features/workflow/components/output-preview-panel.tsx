import { useMemo } from 'react'
import {
  ArrowRight,
  ArrowDown,
  AlertTriangle,
  Network,
  Info,
  Eye,
} from 'lucide-react'
import { cn } from '#/shared/utils'
import type { Node } from '@xyflow/react'
import type { WorkflowNodeData } from '../types'
import { resolveInputs, resolveOutputs } from '../node-registry.utils'
import type { VariableRef } from '../utils/variable-system-utils'
import { ICON_MAP } from './nodes/workflow-node.constants'
import { getNodeDefinition } from '../stores/node-registry/use-node-registry.store'
import type { NodeDefinition } from '../stores/node-registry/use-node-registry.store'
import { CATEGORY_CONFIG } from '../stores/node-registry/constants'

interface OutputPreviewPanelProps {
  nextNodes: Node<WorkflowNodeData>[]
  selectedDef?: NodeDefinition
  localProps: Record<string, unknown>
  variables: VariableRef[]
}

export function OutputPreviewPanel({
  nextNodes,
  selectedDef,
  localProps,
  variables,
}: OutputPreviewPanelProps) {
  const resolvedOutputs = useMemo(() => {
    if (!selectedDef) return {}
    const out: Record<string, string> = {}
    for (const port of resolveOutputs(selectedDef)) {
      out[port.label] = resolveSampleValue(
        port.type,
        port.label,
        localProps,
        variables,
      )
    }
    return out
  }, [selectedDef, localProps, variables])

  return (
    <div className="w-[300px] shrink-0 flex flex-col overflow-hidden border-l border-frost bg-void/50">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-frost shrink-0">
        <Eye size={13} className="text-muted-text" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-text">
          Output Preview
        </span>
        {nextNodes.length > 0 && (
          <span className="ml-auto text-[10px] text-muted-text">
            {nextNodes.length} downstream
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {selectedDef && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <ArrowRight size={11} className="text-muted-text" />
              <span className="text-[10px] font-medium text-muted-text uppercase tracking-wider">
                Outputs
              </span>
            </div>
            <div className="space-y-1.5">
              {resolveOutputs(selectedDef).map((port) => (
                <div
                  key={port.id}
                  className="p-2.5 rounded-lg bg-surface border border-frost"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        port.type === 'data'
                          ? 'bg-accent-blue'
                          : port.type === 'signal'
                            ? 'bg-accent-orange'
                            : 'bg-accent-red',
                      )}
                    />
                    <span className="text-[12px] font-medium text-near-white">
                      {port.label}
                    </span>
                    <span className="text-[10px] text-muted-text ml-auto">
                      {port.type}
                    </span>
                  </div>
                  {resolvedOutputs[port.label] && (
                    <code className="text-[11px] text-accent-green font-mono">
                      {resolvedOutputs[port.label]}
                    </code>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {nextNodes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Network size={20} className="text-muted-text mb-2" />
            <p className="text-[11px] text-muted-text leading-relaxed">
              No downstream nodes connected. This node terminates the branch.
            </p>
          </div>
        )}

        {nextNodes.map((next) => {
          const nextData = next.data
          const nextDef = nextData.nodeTypeId
            ? getNodeDefinition(nextData.nodeTypeId)
            : null
          const NextIcon = nextDef
            ? (ICON_MAP[nextDef.identity.icon || ''] ?? Info)
            : Info
          const outputMismatch = checkOutputMismatch(selectedDef, nextDef)

          return (
            <div key={next.id} className="space-y-2">
              <div className="flex items-center gap-1.5 mb-1">
                <ArrowDown size={11} className="text-muted-text" />
                <span className="text-[10px] font-medium text-muted-text uppercase tracking-wider">
                  Next Node
                </span>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface border border-frost">
                <div
                  className={cn(
                    'w-7 h-7 rounded-md flex items-center justify-center shrink-0',
                    nextDef && CATEGORY_CONFIG[nextDef.identity.category]
                      ? `${CATEGORY_CONFIG[nextDef.identity.category].bgColor} ${CATEGORY_CONFIG[nextDef.identity.category].color}`
                      : 'bg-surface-2 text-muted-text',
                  )}
                >
                  <NextIcon size={13} />
                </div>
                <div className="min-w-0">
                  <div className="text-[12px] font-medium text-near-white truncate">
                    {nextData.title || next.id}
                  </div>
                  <div className="text-[10px] text-muted-text">
                    {(nextData.nodeTypeId && nextDef?.identity.title) ||
                      'Unknown type'}
                  </div>
                </div>
              </div>

              {nextDef && resolveInputs(nextDef).length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-medium text-muted-text">
                    Expected Inputs
                  </span>
                  {resolveInputs(nextDef).map((port) => (
                    <div
                      key={port.id}
                      className="flex items-center gap-2 px-2 py-1.5 rounded bg-surface/50 border border-frost/50"
                    >
                      <span
                        className={cn(
                          'w-1.5 h-1.5 rounded-full',
                          port.type === 'data'
                            ? 'bg-accent-blue'
                            : port.type === 'signal'
                              ? 'bg-accent-orange'
                              : 'bg-accent-red',
                        )}
                      />
                      <span className="text-[11px] text-near-white">
                        {port.label}
                      </span>
                      <span className="text-[10px] text-muted-text ml-auto">
                        {port.type}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {outputMismatch && (
                <div className="flex gap-2 p-2 rounded-lg bg-accent-yellow/5 border border-accent-yellow/10">
                  <AlertTriangle
                    size={13}
                    className="text-accent-yellow shrink-0 mt-0.5"
                  />
                  <p className="text-[10px] text-accent-yellow leading-relaxed">
                    {outputMismatch}
                  </p>
                </div>
              )}
            </div>
          )
        })}

        {selectedDef &&
          resolveOutputs(selectedDef).length === 0 &&
          nextNodes.length > 0 && (
            <div className="flex gap-2 p-2 rounded-lg bg-accent-red/5 border border-accent-red/10">
              <AlertTriangle
                size={13}
                className="text-accent-red shrink-0 mt-0.5"
              />
              <p className="text-[10px] text-accent-red">
                This node declares no outputs but has downstream nodes
                connected.
              </p>
            </div>
          )}
      </div>
    </div>
  )
}

function resolveSampleValue(
  _type: string,
  label: string,
  localProps: Record<string, unknown>,
  variables: VariableRef[],
): string {
  for (const v of variables) {
    if (v.source === 'previous' && v.id.includes(label.toLowerCase())) {
      return v.sampleValue ?? `⟨ ${label} resolved from upstream ⟩`
    }
  }
  const key = label.toLowerCase().replace(/\s+/g, '')
  if (key in localProps) return String(localProps[key])
  return ''
}

function checkOutputMismatch(
  selectedDef: ReturnType<typeof getNodeDefinition>,
  nextDef: ReturnType<typeof getNodeDefinition> | null,
): string | null {
  if (!selectedDef || !nextDef) return null
  const selectOutputTypes = new Set(
    resolveOutputs(selectedDef).map((p) => p.type),
  )
  const nextInputTypes = new Set(resolveInputs(nextDef).map((p) => p.type))
  const missing = [...nextInputTypes].filter((t) => !selectOutputTypes.has(t))
  if (missing.length > 0) {
    return `Next node expects ${missing.join('/')} input but selected node does not provide it`
  }
  return null
}
