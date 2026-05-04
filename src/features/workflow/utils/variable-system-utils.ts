import type { Node, Edge } from '@xyflow/react'
import type { WorkflowNodeData } from '../types'
import { getNodeDefinition } from '../node-registry'

export interface VariableRef {
  id: string
  display: string
  description: string
  source: 'workflow' | 'previous' | 'upstream' | 'loop' | 'system'
  sourceNodeId?: string
  sourceNodeName?: string
  sampleValue?: string
}

export interface NodeContext {
  nodeId: string
  title: string
  nodeTypeId?: string
  sampleOutput?: Record<string, unknown>
}

export function buildVariableList(
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[],
  selectedNodeId: string,
  sampleData?: Record<string, unknown>,
): VariableRef[] {
  const vars: VariableRef[] = []

  vars.push({ id: 'workflow.runId', display: '{{workflow.runId}}', description: 'Current workflow run ID', source: 'workflow' })
  vars.push({ id: 'workflow.triggeredAt', display: '{{workflow.triggeredAt}}', description: 'Time workflow was triggered', source: 'workflow' })
  vars.push({ id: 'workflow.executionId', display: '{{workflow.executionId}}', description: 'Current execution ID', source: 'workflow' })

  const prevNodeIds = edges
    .filter((e) => e.target === selectedNodeId)
    .map((e) => e.source)

  nodes.forEach((n) => {
    if (n.id === selectedNodeId) return
    const nodeData = n.data as WorkflowNodeData
    const def = nodeData.nodeTypeId ? getNodeDefinition(nodeData.nodeTypeId) : null
    const source: VariableRef['source'] = prevNodeIds.includes(n.id) ? 'previous' : 'upstream'

    if (def) {
      def.outputs.forEach((port) => {
        const varId = `${sanitizeTitle(n.data?.title || n.id)}.output.${port.id}`
        vars.push({
          id: varId,
          display: `{{${varId}}}`,
          description: `${nodeData.title} — ${port.label} output`,
          source,
          sourceNodeId: n.id,
          sourceNodeName: nodeData.title,
          sampleValue: sampleData?.[varId] as string | undefined,
        })
      })
    }
  })

  if (prevNodeIds.length > 0) {
    const prev = nodes.find((n) => n.id === prevNodeIds[0])
    if (prev) {
      vars.push({
        id: 'previous.output',
        display: '{{previous.output}}',
        description: `Full output from: ${(prev.data as WorkflowNodeData).title || prev.id}`,
        source: 'previous',
        sourceNodeId: prev.id,
        sourceNodeName: (prev.data as WorkflowNodeData).title,
      })
    }
  }

  const loopContextVars = getLoopContextVariables(selectedNodeId, nodes, edges)
  vars.push(...loopContextVars)

  vars.push({ id: 'system.timestamp', display: '{{system.timestamp}}', description: 'Current UNIX timestamp', source: 'system' })
  vars.push({ id: 'system.date', display: '{{system.date}}', description: 'Current date in ISO format', source: 'system' })
  vars.push({ id: 'system.env', display: '{{system.env}}', description: 'Execution environment', source: 'system' })

  return vars
}

function getLoopContextVariables(
  selectedNodeId: string,
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[],
): VariableRef[] {
  const upstreamIds = findAllUpstreamNodes(selectedNodeId, nodes, edges)

  for (const nid of upstreamIds) {
    const node = nodes.find((n) => n.id === nid)
    if (!node) continue
    const nd = node.data as WorkflowNodeData
    if (nd.nodeTypeId === 'logic.loop') {
      const nodeName = sanitizeTitle(nd.title || nid)
      return [
        { id: 'loop.item', display: '{{loop.item}}', description: `Current item in ${nodeName} loop`, source: 'loop', sourceNodeId: nid, sourceNodeName: nodeName },
        { id: 'loop.index', display: '{{loop.index}}', description: `Current iteration index (0-based)`, source: 'loop', sourceNodeId: nid, sourceNodeName: nodeName },
        { id: 'loop.count', display: '{{loop.count}}', description: `Total iterations in ${nodeName}`, source: 'loop', sourceNodeId: nid, sourceNodeName: nodeName },
        { id: 'loop.isLast', display: '{{loop.isLast}}', description: `True if last iteration in ${nodeName}`, source: 'loop', sourceNodeId: nid, sourceNodeName: nodeName },
      ]
    }
  }
  return []
}

function findAllUpstreamNodes(
  nodeId: string,
  _nodes: Node<WorkflowNodeData>[],
  edges: Edge[],
): string[] {
  const visited = new Set<string>()
  const queue = [nodeId]
  const result: string[] = []
  visited.add(nodeId)

  while (queue.length > 0) {
    const current = queue.shift()!
    const incoming = edges.filter((e) => e.target === current).map((e) => e.source)
    for (const src of incoming) {
      if (!visited.has(src)) {
        visited.add(src)
        result.push(src)
        queue.push(src)
      }
    }
  }
  return result
}

function sanitizeTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
}

const VARIABLE_PATTERN = /\{\{([a-zA-Z_][a-zA-Z0-9_.]*)\}\}/g

export function extractVariables(text: string): string[] {
  const matches = text.matchAll(VARIABLE_PATTERN)
  return [...new Set(Array.from(matches, (m) => m[1]))]
}

export function validateVariableRef(
  ref: string,
  availableVars: VariableRef[],
): { valid: boolean; message?: string } {
  if (!ref) return { valid: false, message: 'Empty variable reference' }
  const found = availableVars.find((v) => v.id === ref)
  if (found) return { valid: true }
  return {
    valid: false,
    message: `Unknown variable: {{${ref}}}. Available variables are listed in the palette.`,
  }
}

export function renderVariablePreview(text: string, sampleData?: Record<string, unknown>): string {
  return text.replace(VARIABLE_PATTERN, (_, ref: string) => {
    if (sampleData && ref in sampleData) {
      return String(sampleData[ref] ?? `{{${ref}}}`)
    }
    return `{{${ref}}}`
  })
}

export function groupVariables(vars: VariableRef[]): Record<string, VariableRef[]> {
  const groups: Record<string, VariableRef[]> = {
    Previous: [],
    Upstream: [],
    Workflow: [],
    Loop: [],
    System: [],
  }
  for (const v of vars) {
    if (v.source === 'previous') groups.Previous.push(v)
    else if (v.source === 'upstream') groups.Upstream.push(v)
    else if (v.source === 'workflow') groups.Workflow.push(v)
    else if (v.source === 'loop') groups.Loop.push(v)
    else groups.System.push(v)
  }
  const result: Record<string, VariableRef[]> = {}
  for (const [key, items] of Object.entries(groups)) {
    if (items.length > 0) result[key] = items
  }
  return result
}

export function highlightVariables(text: string, variables: VariableRef[]): (string | { ref: string; valid: boolean })[] {
  const parts: (string | { ref: string; valid: boolean })[] = []
  let lastIdx = 0
  const matches = text.matchAll(VARIABLE_PATTERN)
  for (const match of matches) {
    if (match.index! > lastIdx) {
      parts.push(text.slice(lastIdx, match.index))
    }
    const ref = match[1]
    const valid = variables.some((v) => v.id === ref)
    parts.push({ ref, valid })
    lastIdx = match.index! + match[0].length
  }
  if (lastIdx < text.length) {
    parts.push(text.slice(lastIdx))
  }
  return parts
}
