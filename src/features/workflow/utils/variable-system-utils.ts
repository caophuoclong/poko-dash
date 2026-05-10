import type { Node, Edge } from '@xyflow/react'
import type { WorkflowNodeData, WorkflowVariable } from '../types'
import { resolveOutputs } from '../node-registry.utils'
import { getNodeDefinition } from '../stores/node-registry/use-node-registry.store'
import { findLoopScope } from './loop-scope-utils'

// ─── Types ───────────────────────────────────────────────────────────────────

export type VariableNamespace =
  | 'json'
  | 'var'
  | 'trigger'
  | 'input'
  | 'secrets'
  | 'env'
  | 'workflow'
  | 'system'
  | 'loop'
  | 'previous'
  | 'node'

export interface VariableRef {
  id: string
  display: string
  description: string
  source:
    | 'workflow'
    | 'previous'
    | 'upstream'
    | 'loop'
    | 'system'
    | 'json'
    | 'var'
    | 'trigger'
    | 'input'
    | 'secrets'
    | 'env'
  namespace?: VariableNamespace
  sourceNodeId?: string
  sourceNodeName?: string
  sampleValue?: string
  /** Whether the value should be masked in preview (always true for secrets) */
  masked?: boolean
}

export interface NodeContext {
  nodeId: string
  title: string
  nodeTypeId?: string
  sampleOutput?: Record<string, unknown>
}

/** Token produced by parseTemplateTokens */
export interface TemplateToken {
  type: 'literal' | 'expression'
  raw: string
  /** Only present when type === 'expression' */
  ref?: string
  /** Derived namespace from the ref prefix */
  namespace?: VariableNamespace | null
  /** Whether the expression is syntactically valid (complete {{ … }}) */
  syntaxValid: boolean
  /** Position in original string */
  start: number
  end: number
}

export interface SuggestionContext {
  /** Variables already available to this node */
  availableVariables: VariableRef[]
  /** The namespace prefix being typed, if any (e.g. "var", "$json") */
  activeNamespace?: string | null
}

export interface TemplateValidationIssue {
  severity: 'error' | 'warning'
  message: string
  /** Character offset in original string */
  at?: number
  ref?: string
}

// ─── Constants ───────────────────────────────────────────────────────────────

// Matches well-formed {{ ref }} expressions
const VARIABLE_PATTERN = /\{\{([a-zA-Z_$][a-zA-Z0-9_.$]*)\}\}/g

const KNOWN_NAMESPACES: ReadonlySet<string> = new Set([
  '$json',
  'var',
  'trigger',
  'input',
  'secrets',
  'env',
  'workflow',
  'system',
  'loop',
  'previous',
  '$node',
])

// ─── Parser ──────────────────────────────────────────────────────────────────

/**
 * Parse a template string into typed tokens.
 * Detects both valid expressions and malformed / unclosed {{ patterns.
 */
export function parseTemplateTokens(text: string): TemplateToken[] {
  const tokens: TemplateToken[] = []
  let cursor = 0

  while (cursor < text.length) {
    const openIdx = text.indexOf('{{', cursor)
    if (openIdx === -1) {
      // Rest is literal
      tokens.push({
        type: 'literal',
        raw: text.slice(cursor),
        syntaxValid: true,
        start: cursor,
        end: text.length,
      })
      break
    }

    // Literal before this expression
    if (openIdx > cursor) {
      tokens.push({
        type: 'literal',
        raw: text.slice(cursor, openIdx),
        syntaxValid: true,
        start: cursor,
        end: openIdx,
      })
    }

    const closeIdx = text.indexOf('}}', openIdx + 2)
    if (closeIdx === -1) {
      // Unclosed expression — syntax error
      tokens.push({
        type: 'expression',
        raw: text.slice(openIdx),
        syntaxValid: false,
        start: openIdx,
        end: text.length,
      })
      break
    }

    const inner = text.slice(openIdx + 2, closeIdx).trim()
    const raw = text.slice(openIdx, closeIdx + 2)
    tokens.push({
      type: 'expression',
      raw,
      ref: inner,
      namespace: detectNamespace(inner),
      syntaxValid: inner.length > 0,
      start: openIdx,
      end: closeIdx + 2,
    })
    cursor = closeIdx + 2
  }

  return tokens
}

function detectNamespace(ref: string): VariableNamespace | null {
  if (ref.startsWith('$json')) return 'json'
  if (ref.startsWith('$node.')) return 'node'
  if (ref.startsWith('var.')) return 'var'
  if (ref.startsWith('trigger.')) return 'trigger'
  if (ref.startsWith('input.')) return 'input'
  if (ref.startsWith('secrets.')) return 'secrets'
  if (ref.startsWith('env.')) return 'env'
  if (ref.startsWith('workflow.')) return 'workflow'
  if (ref.startsWith('system.')) return 'system'
  if (ref.startsWith('loop.')) return 'loop'
  if (ref.startsWith('previous')) return 'previous'
  return null
}

// ─── Validator ───────────────────────────────────────────────────────────────

/**
 * Validate all template expressions in a string.
 * Returns non-blocking lint issues (warnings/errors) only — the caller decides
 * whether to block save (hard errors from schema validation are separate).
 */
export function validateTemplateExpression(
  text: string,
  availableVars: VariableRef[],
): TemplateValidationIssue[] {
  const issues: TemplateValidationIssue[] = []
  const tokens = parseTemplateTokens(text)
  const availableIds = new Set(availableVars.map((v) => v.id))

  for (const token of tokens) {
    if (token.type !== 'expression') continue

    if (!token.syntaxValid) {
      issues.push({
        severity: 'error',
        message: 'Unclosed template expression — missing closing "}}"',
        at: token.start,
      })
      continue
    }

    const ref = token.ref ?? ''

    if (ref.length === 0) {
      issues.push({
        severity: 'error',
        message: 'Empty template expression {{ }}',
        at: token.start,
      })
      continue
    }

    // Detect namespace-only references like {{ var. }} or {{ trigger. }}
    if (/\.$/.test(ref)) {
      issues.push({
        severity: 'warning',
        message: `Incomplete variable reference: "${token.raw}" — missing key after "."`,
        at: token.start,
        ref,
      })
      continue
    }

    // Check namespace is recognised
    const ns = detectNamespace(ref)
    if (ns === null) {
      // Check if it looks like an unknown prefix (has a dot)
      const firstPart = ref.split('.')[0]
      if (firstPart && !KNOWN_NAMESPACES.has(firstPart) && ref.includes('.')) {
        issues.push({
          severity: 'warning',
          message: `Unknown namespace "${firstPart}" in "${token.raw}"`,
          at: token.start,
          ref,
        })
      }
    }

    // Warn if reference is not in available variables (only for known non-secrets)
    if (ns !== 'secrets' && ns !== 'env' && !availableIds.has(ref)) {
      issues.push({
        severity: 'warning',
        message: `Unresolved variable "${token.raw}" — not found in current context`,
        at: token.start,
        ref,
      })
    }
  }

  return issues
}

// ─── Suggester ───────────────────────────────────────────────────────────────

/**
 * Return ordered variable suggestions for a given context.
 * If activeNamespace is provided, filters to that namespace only.
 */
export function listVariableSuggestions(
  context: SuggestionContext,
): VariableRef[] {
  const { availableVariables, activeNamespace } = context
  if (!activeNamespace) return availableVariables

  const normalized = activeNamespace.replace(/^\$/, '')
  return availableVariables.filter((v) => {
    if (activeNamespace === '$json' || activeNamespace === 'json') return v.namespace === 'json'
    return v.id.startsWith(`${normalized}.`) || v.namespace === normalized
  })
}

// ─── buildVariableList ───────────────────────────────────────────────────────

/**
 * Build the full variable list for a node, incorporating all supported namespaces.
 */
export function buildVariableList(
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[],
  selectedNodeId: string,
  sampleData?: Record<string, unknown>,
  workflowVariables?: WorkflowVariable[],
  triggerFields?: string[],
  secretNames?: string[],
  envNames?: string[],
): VariableRef[] {
  const vars: VariableRef[] = []

  // ── $json (upstream JSON context) ──────────────────────────────────────────
  vars.push({
    id: '$json',
    display: '{{$json}}',
    description: 'Full JSON output from the previous node',
    source: 'json',
    namespace: 'json',
  })
  if (sampleData) {
    for (const [key, val] of Object.entries(sampleData)) {
      if (key.startsWith('$json.')) {
        vars.push({
          id: key,
          display: `{{${key}}}`,
          description: `JSON field: ${key.replace('$json.', '')}`,
          source: 'json',
          namespace: 'json',
          sampleValue: val !== null && val !== undefined ? String(val) : undefined,
        })
      }
    }
  }

  // ── Workflow variables (var.*) ─────────────────────────────────────────────
  for (const wv of workflowVariables ?? []) {
    vars.push({
      id: `var.${wv.key}`,
      display: `{{var.${wv.key}}}`,
      description: wv.description ? wv.description : `Workflow variable: ${wv.key}`,
      source: 'var',
      namespace: 'var',
      sampleValue: wv.value || undefined,
    })
  }

  // ── Trigger / Input ────────────────────────────────────────────────────────
  const commonTriggerFields = triggerFields ?? [
    'id', 'body', 'headers', 'query', 'method', 'path',
  ]
  for (const field of commonTriggerFields) {
    vars.push({
      id: `trigger.${field}`,
      display: `{{trigger.${field}}}`,
      description: `Trigger field: ${field}`,
      source: 'trigger',
      namespace: 'trigger',
    })
    vars.push({
      id: `input.${field}`,
      display: `{{input.${field}}}`,
      description: `Input field: ${field}`,
      source: 'input',
      namespace: 'input',
    })
  }

  // ── Secrets (masked — names only) ─────────────────────────────────────────
  for (const name of secretNames ?? []) {
    vars.push({
      id: `secrets.${name}`,
      display: `{{secrets.${name}}}`,
      description: `Secret: ${name} (value masked)`,
      source: 'secrets',
      namespace: 'secrets',
      masked: true,
    })
  }

  // ── Env ────────────────────────────────────────────────────────────────────
  for (const name of envNames ?? []) {
    vars.push({
      id: `env.${name}`,
      display: `{{env.${name}}}`,
      description: `Environment variable: ${name}`,
      source: 'env',
      namespace: 'env',
    })
  }

  // ── Upstream / previous node outputs ──────────────────────────────────────
  const prevNodeIds = edges
    .filter((e) => e.target === selectedNodeId)
    .map((e) => e.source)

  nodes.forEach((n) => {
    if (n.id === selectedNodeId) return
    const nodeData = n.data as WorkflowNodeData
    const def = nodeData.nodeTypeId ? getNodeDefinition(nodeData.nodeTypeId) : null
    const source: VariableRef['source'] = prevNodeIds.includes(n.id) ? 'previous' : 'upstream'

    if (def) {
      resolveOutputs(def).forEach((port) => {
        const varId = `${sanitizeTitle(n.data?.title || n.id)}.output.${port.id}`
        vars.push({
          id: varId,
          display: `{{${varId}}}`,
          description: `${nodeData.title} — ${port.label} output`,
          source,
          namespace: 'node',
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
        namespace: 'previous',
        sourceNodeId: prev.id,
        sourceNodeName: (prev.data as WorkflowNodeData).title,
      })

      // Add nested previous.output.* paths from upstream execution output or suggested variables
      const prevDef = (prev.data as WorkflowNodeData).nodeTypeId
        ? getNodeDefinition((prev.data as WorkflowNodeData).nodeTypeId ?? '')
        : null
      if (prevDef?.config?.suggestedVariables) {
        for (const sv of prevDef.config.suggestedVariables) {
          const expr = sv.expression?.trim() ?? ''
          const match = expr.match(/^\{\{\s*(previous\.output(?:\.[^\s}]+)?)\s*\}\}$/)
          if (!match) continue
          const id = match[1]
          vars.push({
            id,
            display: `{{${id}}}`,
            description: sv.description || sv.label || 'Suggested previous output variable',
            source: 'previous',
            namespace: 'previous',
            sourceNodeId: prev.id,
            sourceNodeName: (prev.data as WorkflowNodeData).title,
          })
        }
      }
    }
  }

  // ── Loop context ───────────────────────────────────────────────────────────
  const loopContextVars = getLoopContextVariables(selectedNodeId, nodes, edges)
  vars.push(...loopContextVars)

  // ── Workflow meta (legacy workflow.*) ──────────────────────────────────────
  vars.push({
    id: 'workflow.runId',
    display: '{{workflow.runId}}',
    description: 'Current workflow run ID',
    source: 'workflow',
    namespace: 'workflow',
  })
  vars.push({
    id: 'workflow.triggeredAt',
    display: '{{workflow.triggeredAt}}',
    description: 'Time workflow was triggered',
    source: 'workflow',
    namespace: 'workflow',
  })
  vars.push({
    id: 'workflow.executionId',
    display: '{{workflow.executionId}}',
    description: 'Current execution ID',
    source: 'workflow',
    namespace: 'workflow',
  })

  // ── System ─────────────────────────────────────────────────────────────────
  vars.push({
    id: 'system.timestamp',
    display: '{{system.timestamp}}',
    description: 'Current UNIX timestamp',
    source: 'system',
    namespace: 'system',
  })
  vars.push({
    id: 'system.date',
    display: '{{system.date}}',
    description: 'Current date in ISO format',
    source: 'system',
    namespace: 'system',
  })
  vars.push({
    id: 'system.env',
    display: '{{system.env}}',
    description: 'Execution environment',
    source: 'system',
    namespace: 'system',
  })

  return vars
}

function getLoopContextVariables(
  selectedNodeId: string,
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[],
): VariableRef[] {
  const scope = findLoopScope(selectedNodeId, nodes, edges)
  if (!scope.inLoopScope || !scope.loopNodeId) return []

  const loopNodeName = scope.loopNodeName ?? 'loop'

  return [
    {
      id: 'loop.item',
      display: '{{loop.item}}',
      description: `Current array element in "${loopNodeName}" (the value at loop.index)`,
      source: 'loop',
      namespace: 'loop',
      sourceNodeId: scope.loopNodeId,
      sourceNodeName: loopNodeName,
    },
    {
      id: 'loop.index',
      display: '{{loop.index}}',
      description: 'Current iteration index (0-based)',
      source: 'loop',
      namespace: 'loop',
      sourceNodeId: scope.loopNodeId,
      sourceNodeName: loopNodeName,
    },
    {
      id: 'loop.items',
      display: '{{loop.items}}',
      description: `Full input array being iterated in "${loopNodeName}"`,
      source: 'loop',
      namespace: 'loop',
      sourceNodeId: scope.loopNodeId,
      sourceNodeName: loopNodeName,
    },
    {
      id: 'loop.length',
      display: '{{loop.length}}',
      description: 'Total number of items in the loop array',
      source: 'loop',
      namespace: 'loop',
      sourceNodeId: scope.loopNodeId,
      sourceNodeName: loopNodeName,
    },
    {
      id: 'loop.isFirst',
      display: '{{loop.isFirst}}',
      description: 'True when processing the first item (index === 0)',
      source: 'loop',
      namespace: 'loop',
      sourceNodeId: scope.loopNodeId,
      sourceNodeName: loopNodeName,
    },
    {
      id: 'loop.isLast',
      display: '{{loop.isLast}}',
      description: 'True when processing the last item',
      source: 'loop',
      namespace: 'loop',
      sourceNodeId: scope.loopNodeId,
      sourceNodeName: loopNodeName,
    },
  ]
}

function sanitizeTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
}

// ─── Extract ─────────────────────────────────────────────────────────────────

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

// ─── Preview ─────────────────────────────────────────────────────────────────

export interface PreviewOptions {
  sampleData?: Record<string, unknown>
  /** If true, secrets and masked vars render as "***" */
  maskSecrets?: boolean
  /** If true, env vars also render as "***" */
  maskEnv?: boolean
  availableVars?: VariableRef[]
}

export function renderVariablePreview(
  text: string,
  sampleData?: Record<string, unknown>,
  options?: PreviewOptions,
): string {
  const opts: PreviewOptions = { maskSecrets: true, ...options, sampleData }
  const availableVars = opts.availableVars ?? []

  return text.replace(VARIABLE_PATTERN, (_, ref: string) => {
    const varDef = availableVars.find((v) => v.id === ref)

    // Always mask secrets
    if (varDef?.masked || varDef?.namespace === 'secrets') return '***'
    // Optionally mask env
    if (opts.maskEnv && varDef?.namespace === 'env') return '***'

    if (opts.sampleData && ref in opts.sampleData) {
      return String(opts.sampleData[ref] ?? `{{${ref}}}`)
    }
    return `{{${ref}}}`
  })
}

// ─── Grouping ─────────────────────────────────────────────────────────────────

export function groupVariables(vars: VariableRef[]): Record<string, VariableRef[]> {
  const groups: Record<string, VariableRef[]> = {
    'Upstream JSON': [],
    'Workflow Vars': [],
    'Trigger / Input': [],
    Secrets: [],
    Env: [],
    'Previous Node': [],
    Upstream: [],
    Loop: [],
    Workflow: [],
    System: [],
  }

  for (const v of vars) {
    switch (v.source) {
      case 'json':
        groups['Upstream JSON'].push(v); break
      case 'var':
        groups['Workflow Vars'].push(v); break
      case 'trigger':
      case 'input':
        groups['Trigger / Input'].push(v); break
      case 'secrets':
        groups.Secrets.push(v); break
      case 'env':
        groups.Env.push(v); break
      case 'previous':
        groups['Previous Node'].push(v); break
      case 'upstream':
        groups.Upstream.push(v); break
      case 'loop':
        groups.Loop.push(v); break
      case 'workflow':
        groups.Workflow.push(v); break
      default:
        groups.System.push(v)
    }
  }

  const result: Record<string, VariableRef[]> = {}
  for (const [key, items] of Object.entries(groups)) {
    if (items.length > 0) result[key] = items
  }
  return result
}

// ─── Highlight ────────────────────────────────────────────────────────────────

export function highlightVariables(
  text: string,
  variables: VariableRef[],
): (string | { ref: string; valid: boolean; masked: boolean })[] {
  const parts: (string | { ref: string; valid: boolean; masked: boolean })[] = []
  let lastIdx = 0
  const matches = text.matchAll(VARIABLE_PATTERN)
  for (const match of matches) {
    if (match.index! > lastIdx) {
      parts.push(text.slice(lastIdx, match.index))
    }
    const ref = match[1]
    const varDef = variables.find((v) => v.id === ref)
    const valid = Boolean(varDef)
    const masked = Boolean(varDef?.masked)
    parts.push({ ref, valid, masked })
    lastIdx = match.index! + match[0].length
  }
  if (lastIdx < text.length) {
    parts.push(text.slice(lastIdx))
  }
  return parts
}
