import { useState, useCallback } from 'react'
import { ChevronDown, GripVertical } from 'lucide-react'
import { cn } from '#/shared/utils'

/**
 * Builds a variable reference expression.
 *
 * When `baseRef` is provided (e.g. "previous.output") the expression is
 * `{{baseRef.path}}` — used by the left-side upstream panel so dragged
 * items produce paths like `{{previous.output.body.products}}`.
 *
 * Without `baseRef` it falls back to the legacy `$node.NodeName.path` form.
 */
export function buildVarRef(nodeName: string, path: string, baseRef?: string): string {
  if (baseRef) {
    return `{{${baseRef}${path ? `.${path}` : ''}}}`
  }
  const safe = (nodeName ?? 'node').replace(/\s+/g, '_')
  return `{{ $node.${safe}${path ? `.${path}` : ''} }}`
}

/**
 * Extracts the bare variable id from an expression like `{{previous.output.body.products}}`.
 * Returns the inner string without braces/spaces, or the original if it can't be parsed.
 */
function varIdFromExpr(expr: string): string {
  const m = expr.match(/^\{\{\s*([^\s}]+)\s*\}\}$/)
  return m ? m[1] : expr
}

/** Detects the type of a value for display purposes */
function detectType(v: unknown): string {
  if (v === null || v === undefined) return 'null'
  if (Array.isArray(v)) return 'array'
  return typeof v
}

function formatPreview(v: unknown, t: string): string {
  if (t === 'string') return `"${String(v).slice(0, 60)}${String(v).length > 60 ? '…' : ''}"`
  if (t === 'null') return 'null'
  if (t === 'array') return `[${(v as unknown[]).length}]`
  if (t === 'object') return `{${Object.keys(v as object).length}}`
  return String(v)
}

const TYPE_COLORS: Record<string, string> = {
  string: 'text-accent-blue',
  number: 'text-accent-purple',
  boolean: 'text-accent-yellow',
  null: 'text-muted-text',
  variable: 'text-accent-green',
}

interface DraggableFieldTagProps {
  label: string
  path: string
  value: unknown
  nodeName: string
  /** Optional base reference like "previous.output" — if provided, expr becomes {{baseRef.path}} */
  baseRef?: string
}

/** Single draggable field — can be dragged into a form input to insert variable expression */
export function DraggableFieldTag({ label, path, value, nodeName, baseRef }: DraggableFieldTagProps) {
  const expr = buildVarRef(nodeName, path, baseRef)
  const varId = varIdFromExpr(expr)
  const t = detectType(value)
  const preview = formatPreview(value, t)

  const onDragStart = useCallback(
    (e: React.DragEvent) => {
      e.dataTransfer.setData('text/plain', expr)
      e.dataTransfer.setData('application/variable-ref', varId)
      e.dataTransfer.setData(
        'application/x-forge-ref',
        JSON.stringify({ expr, path, nodeName, baseRef }),
      )
      e.dataTransfer.effectAllowed = 'copy'

      const ghost = document.createElement('div')
      ghost.style.cssText =
        'position:absolute;top:-9999px;padding:4px 8px;background:var(--t-void);color:var(--t-accent-blue);font-family:monospace;font-size:11px;font-weight:700;border:1px solid var(--t-frost);border-radius:4px;'
      ghost.textContent = expr
      document.body.appendChild(ghost)
      e.dataTransfer.setDragImage(ghost, 8, 8)
      setTimeout(() => ghost.remove(), 0)
    },
    [expr, varId, path, nodeName, baseRef],
  )

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className={cn(
        'group flex items-center gap-1.5 px-2 py-1 rounded-md',
        'border border-frost bg-surface cursor-grab active:cursor-grabbing',
        'hover:border-accent-blue/30 hover:bg-accent-blue-dim/20 transition-all',
      )}
      title={`Drag to insert ${expr}`}
    >
      <GripVertical size={10} className="text-muted-text/50 group-hover:text-muted-text shrink-0" />
      <span className="text-[11px] font-mono font-bold text-near-white shrink-0">{label}</span>
      <span className={cn('text-[9px] font-mono tracking-wider uppercase px-1 rounded border border-frost bg-surface-2 shrink-0', TYPE_COLORS[t] ?? 'text-muted-text')}>{t}</span>
      <span className="text-[11px] font-mono text-muted-text truncate min-w-0 flex-1">{preview}</span>
    </div>
  )
}

interface SyntheticVariableTagProps {
  /** Variable ID like "loop.item" */
  varId: string
  /** Display label */
  label: string
  /** Description for tooltip */
  description: string
  /** Optional type hint */
  typeHint?: string
}

/** Draggable tag for synthetic variables (loop context, system vars, etc.) that don't come from object keys */
export function SyntheticVariableTag({ varId, label, description, typeHint = 'variable' }: SyntheticVariableTagProps) {
  const expr = `{{${varId}}}`

  const onDragStart = useCallback(
    (e: React.DragEvent) => {
      e.dataTransfer.setData('text/plain', expr)
      e.dataTransfer.setData('application/variable-ref', varId)
      e.dataTransfer.setData(
        'application/x-forge-ref',
        JSON.stringify({ expr, varId }),
      )
      e.dataTransfer.effectAllowed = 'copy'

      const ghost = document.createElement('div')
      ghost.style.cssText =
        'position:absolute;top:-9999px;padding:4px 8px;background:var(--t-void);color:var(--t-accent-green);font-family:monospace;font-size:11px;font-weight:700;border:1px solid var(--t-frost);border-radius:4px;'
      ghost.textContent = expr
      document.body.appendChild(ghost)
      e.dataTransfer.setDragImage(ghost, 8, 8)
      setTimeout(() => ghost.remove(), 0)
    },
    [expr, varId],
  )

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className={cn(
        'group flex items-center gap-1.5 px-2 py-1 rounded-md',
        'border border-frost bg-surface cursor-grab active:cursor-grabbing',
        'hover:border-accent-green/30 hover:bg-accent-green-dim/20 transition-all',
      )}
      title={description}
    >
      <GripVertical size={10} className="text-muted-text/50 group-hover:text-muted-text shrink-0" />
      <span className="text-[11px] font-mono font-bold text-near-white shrink-0">{label}</span>
      <span className={cn('text-[9px] font-mono tracking-wider uppercase px-1 rounded border border-frost bg-surface-2 shrink-0', TYPE_COLORS[typeHint] ?? 'text-muted-text')}>{typeHint}</span>
      <span className="text-[11px] font-mono text-muted-text/70 truncate min-w-0 flex-1">{description}</span>
    </div>
  )
}

interface FieldGroupProps extends DraggableFieldTagProps {
  depth?: number
}

/** Recursive field group — expands nested objects/arrays */
export function FieldGroup({ label, path, value, nodeName, baseRef, depth = 0 }: FieldGroupProps) {
  const [open, setOpen] = useState(depth < 2)
  const t = detectType(value)

  const entries: [string, unknown][] =
    t === 'array' && Array.isArray(value)
      ? value.map((v, i) => [String(i), v])
      : t === 'object' && value !== null
        ? Object.entries(value as Record<string, unknown>)
        : []

  const expr = buildVarRef(nodeName, path, baseRef)
  const varId = varIdFromExpr(expr)

  const onDragGroup = useCallback(
    (e: React.DragEvent) => {
      e.dataTransfer.setData('text/plain', expr)
      e.dataTransfer.setData('application/variable-ref', varId)
      e.dataTransfer.setData('application/x-forge-ref', JSON.stringify({ expr, path, nodeName, baseRef }))
      e.dataTransfer.effectAllowed = 'copy'
    },
    [expr, varId, path, nodeName, baseRef],
  )

  return (
    <div className="border-l border-frost/30 pl-2 ml-1">
      <div className="flex items-center gap-1.5 my-0.5">
        <button
          onClick={() => setOpen(!open)}
          className="w-4 h-4 flex items-center justify-center rounded text-muted-text hover:text-near-white hover:bg-surface-2 shrink-0"
        >
          <ChevronDown size={10} className={cn('transition-transform', open ? '' : '-rotate-90')} />
        </button>
        <div
          draggable
          onDragStart={onDragGroup}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-frost/50 bg-surface-2 cursor-grab active:cursor-grabbing hover:border-accent-blue/30 hover:bg-accent-blue-dim/20"
          title={`Drag to insert ${expr}`}
        >
          <span className="text-[11px] font-mono font-bold text-near-white">{label || '(root)'}</span>
          <span className="text-[9px] font-mono text-muted-text">{t === 'array' ? `[${entries.length}]` : `{${entries.length}}`}</span>
        </div>
      </div>
      {open && (
        <div className="space-y-0.5 ml-2">
          {entries.map(([k, v]) => {
            const childPath = path
              ? t === 'array'
                ? `${path}[${k}]`
                : `${path}.${k}`
              : t === 'array'
                ? `[${k}]`
                : k
            const ct = detectType(v)
            if (ct === 'object' || ct === 'array') {
              return <FieldGroup key={k} label={k} path={childPath} value={v} nodeName={nodeName} baseRef={baseRef} depth={depth + 1} />
            }
            return <DraggableFieldTag key={k} label={k} path={childPath} value={v} nodeName={nodeName} baseRef={baseRef} />
          })}
        </div>
      )}
    </div>
  )
}

interface UpstreamDataViewProps {
  data: Record<string, unknown> | null | undefined
  nodeName: string
  /** Base reference prefix for variable expressions, e.g. "previous.output" */
  baseRef?: string
}

/** Renders upstream node output as a tree of draggable field tags */
export function UpstreamDataView({ data, nodeName, baseRef = 'previous.output' }: UpstreamDataViewProps) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-6 text-center">
        <p className="text-[11px] text-muted-text">No upstream data available</p>
      </div>
    )
  }

  return (
    <div className="p-3 space-y-0.5">
      <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-frost/30">
        <GripVertical size={11} className="text-muted-text" />
        <span className="text-[10px] font-mono tracking-wide uppercase text-muted-text">
          DRAG ANY TAG → INPUT
        </span>
      </div>
      {Object.entries(data).map(([k, v]) => {
        const t = detectType(v)
        if (t === 'object' || t === 'array') {
          return <FieldGroup key={k} label={k} path={k} value={v} nodeName={nodeName} baseRef={baseRef} />
        }
        return <DraggableFieldTag key={k} label={k} path={k} value={v} nodeName={nodeName} baseRef={baseRef} />
      })}
    </div>
  )
}

/** Drop zone hook — returns handlers for making an input a drop target for variable references */
export function useDropZone(onInsert: (expr: string) => void) {
  const [isOver, setIsOver] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (
      e.dataTransfer.types.includes('application/x-forge-ref') ||
      e.dataTransfer.types.includes('text/plain')
    ) {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
      setIsOver(true)
    }
  }, [])

  const handleDragLeave = useCallback(() => setIsOver(false), [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      if (
        !e.dataTransfer.types.includes('application/x-forge-ref') &&
        !e.dataTransfer.types.includes('text/plain')
      )
        return
      e.preventDefault()
      setIsOver(false)

      const expr =
        e.dataTransfer.getData('text/plain') ||
        (() => {
          try {
            return JSON.parse(e.dataTransfer.getData('application/x-forge-ref')).expr
          } catch {
            return ''
          }
        })()

      if (!expr) return
      onInsert(expr)
    },
    [onInsert],
  )

  return { isOver, handleDragOver, handleDragLeave, handleDrop }
}
