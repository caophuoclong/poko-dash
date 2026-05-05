import { AlertTriangle, Info, CheckCircle2, FileText } from 'lucide-react'
import {
  resolveSummaryFields,
  resolveDefaultProps,
} from '../node-registry.utils'
import type {
  NodeDefinition,
  ValidationError,
} from '../stores/node-registry/use-node-registry.store'

interface ValidationTabProps {
  errors: ValidationError[]
  def?: NodeDefinition
}

export function ValidationTab({ errors, def }: ValidationTabProps) {
  const errorItems = errors.filter((e) => e.severity === 'error')
  const warningItems = errors.filter((e) => e.severity === 'warning')

  if (errors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CheckCircle2 size={28} className="text-accent-green mb-3" />
        <h3 className="text-sm font-medium text-near-white mb-1">All Valid</h3>
        <p className="text-[12px] text-muted-text max-w-[300px]">
          This node configuration has no validation errors or warnings.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-5 max-w-[500px] mx-auto">
      {errorItems.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} className="text-accent-red" />
            <h3 className="text-[12px] font-semibold text-accent-red">
              {errorItems.length} Error{errorItems.length > 1 ? 's' : ''}
            </h3>
          </div>
          <div className="space-y-2">
            {errorItems.map((err, i) => (
              <div
                key={i}
                className="flex gap-2.5 px-3 py-2.5 rounded-lg bg-accent-red/5 border border-accent-red/10"
              >
                <AlertTriangle
                  size={14}
                  className="text-accent-red shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-[12px] text-near-white">{err.message}</p>
                  <p className="text-[10px] text-muted-text font-mono mt-0.5">
                    {err.propertyKey}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {warningItems.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Info size={14} className="text-accent-yellow" />
            <h3 className="text-[12px] font-semibold text-accent-yellow">
              {warningItems.length} Warning{warningItems.length > 1 ? 's' : ''}
            </h3>
          </div>
          <div className="space-y-2">
            {warningItems.map((err, i) => (
              <div
                key={i}
                className="flex gap-2.5 px-3 py-2.5 rounded-lg bg-accent-yellow/5 border border-accent-yellow/10"
              >
                <Info
                  size={14}
                  className="text-accent-yellow shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-[12px] text-near-white">{err.message}</p>
                  <p className="text-[10px] text-muted-text font-mono mt-0.5">
                    {err.propertyKey}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {def &&
        (() => {
          const summaryFields = resolveSummaryFields(def)
          const defaultProps = resolveDefaultProps(def)
          return (
            <div className="border-t border-frost pt-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={14} className="text-muted-text" />
                <h3 className="text-[12px] font-medium text-near-white">
                  Summary Preview
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {summaryFields.map((field) => (
                  <div
                    key={field.key}
                    className="flex items-baseline gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface border border-frost"
                  >
                    <span className="text-[12px] font-semibold text-near-white">
                      {getSummaryValue(defaultProps?.[field.key]) ?? '—'}
                    </span>
                    <span className="text-[10px] text-muted-text">
                      {field.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        })()}
    </div>
  )
}

function getSummaryValue(val: unknown): string {
  if (val === undefined || val === null) return '—'
  if (typeof val === 'boolean') return val ? 'Yes' : 'No'
  if (Array.isArray(val)) return val.length > 0 ? `${val.length} items` : 'None'
  return String(val)
}
