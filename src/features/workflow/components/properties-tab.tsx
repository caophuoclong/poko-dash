import { Info, Trash2 } from 'lucide-react'
import { cn } from '#/shared/utils'
import { Button } from '#/components/ui/button'
import {
  resolvePropertySchema,
  resolveInputs,
  resolveOutputs,
} from '../node-registry.utils'
import { PropertyEditor } from './property-editors/property-editor'
import type { VariableRef } from '../utils/variable-system-utils'
import type {
  NodeDefinition,
  ValidationError,
} from '../stores/node-registry/use-node-registry.store'
import { CATEGORY_CONFIG } from '../stores/node-registry/constants'

interface PropertiesTabProps {
  def?: NodeDefinition
  title: string
  subtitle: string
  localProps: Record<string, unknown>
  errors: ValidationError[]
  position: { x: number; y: number }
  nodeId: string
  nodeTypeId: string
  availableVars?: VariableRef[]
  onTitleChange: (v: string) => void
  onSubtitleChange: (v: string) => void
  onTitleBlur: () => void
  onSubtitleBlur: () => void
  onPropChange: (key: string, value: unknown) => void
  onDelete: () => void
}

export function PropertiesTab({
  def,
  title,
  subtitle,
  localProps,
  errors,
  position,
  nodeId,
  nodeTypeId,
  availableVars,
  onTitleChange,
  onSubtitleChange,
  onTitleBlur,
  onSubtitleBlur,
  onPropChange,
  onDelete,
}: PropertiesTabProps) {
  return (
    <div className="space-y-4 max-w-[500px] mx-auto">
      <div>
        <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-text mb-2">
          Node Identity
        </h3>
        <div className="space-y-2.5">
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-text">
              Label <span className="text-accent-red ml-0.5">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              onBlur={onTitleBlur}
              className="w-full h-8 px-2.5 rounded-lg border border-frost bg-void text-[13px] text-near-white placeholder:text-muted-text/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue/30"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-text">
              Description
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => onSubtitleChange(e.target.value)}
              onBlur={onSubtitleBlur}
              placeholder="Optional node description"
              className="w-full h-8 px-2.5 rounded-lg border border-frost bg-void text-[13px] text-near-white placeholder:text-muted-text/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue/30"
            />
          </div>
        </div>
      </div>

      {def
        ? (() => {
            const propertySchema = resolvePropertySchema(def)
            const inputs = resolveInputs(def)
            const outputs = resolveOutputs(def)
            return (
              <>
                <div className="border-t border-frost" />
                <div>
                  <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-text mb-2">
                    Configuration
                  </h3>
                  <div className="space-y-3">
                    {propertySchema
                      .filter((s) => {
                        if (
                          s.showWhen &&
                          localProps[s.showWhen.field] !== s.showWhen.equals
                        )
                          return false
                        if (s.visibleWhen && !s.visibleWhen(localProps))
                          return false
                        return true
                      })
                      .map((schema) => (
                        <PropertyEditor
                          key={schema.key}
                          schema={schema}
                          value={localProps[schema.key] ?? schema.defaultValue}
                          onChange={onPropChange}
                          allProps={localProps}
                          errors={errors}
                          availableVars={availableVars}
                        />
                      ))}
                  </div>
                </div>
                {(inputs.length > 0 || outputs.length > 0) && (
                  <>
                    <div className="border-t border-frost" />
                    <div>
                      <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-text mb-2">
                        Ports
                      </h3>
                      <div className="space-y-2">
                        {inputs.length > 0 && (
                          <div>
                            <span className="text-[10px] font-medium text-muted-text">
                              Inputs
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {inputs.map((port) => (
                                <span
                                  key={port.id}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-accent-blue/10 text-accent-blue"
                                >
                                  {port.label}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {outputs.length > 0 && (
                          <div>
                            <span className="text-[10px] font-medium text-muted-text">
                              Outputs
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {outputs.map((port) => (
                                <span
                                  key={port.id}
                                  className={cn(
                                    'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium',
                                    port.type === 'data'
                                      ? 'bg-accent-blue/10 text-accent-blue'
                                      : port.type === 'signal'
                                        ? 'bg-accent-orange/10 text-accent-orange'
                                        : 'bg-accent-red/10 text-accent-red',
                                  )}
                                >
                                  {port.label}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </>
            )
          })()
        : nodeTypeId && (
            <div className="flex gap-2 p-2 rounded-lg bg-accent-yellow/5 border border-accent-yellow/10">
              <Info size={13} className="text-accent-yellow shrink-0 mt-0.5" />
              <p className="text-[11px] text-accent-yellow leading-relaxed">
                Unknown node type{' '}
                <code className="font-mono">{nodeTypeId}</code>
              </p>
            </div>
          )}

      <div className="border-t border-frost pt-3">
        <div className="space-y-1 mb-4">
          <DetailRow label="Node ID" value={nodeId} mono />
          <DetailRow
            label="Type"
            value={def ? def.identity?.typeId : 'unknown'}
          />
          <DetailRow
            label="Category"
            value={
              def
                ? (CATEGORY_CONFIG[def.identity?.category]?.label ??
                  def.identity?.category)
                : '—'
            }
          />
          <DetailRow
            label="Position"
            value={`${position.x.toFixed(0)}, ${position.y.toFixed(0)}`}
          />
        </div>
        <Button
          variant="ghost"
          size="xs"
          className="w-full text-accent-red hover:bg-accent-red/10"
          onClick={onDelete}
        >
          <Trash2 size={13} />
          Delete Node
        </Button>
      </div>
    </div>
  )
}

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex justify-between text-xs py-0.5">
      <span className="text-muted-text">{label}</span>
      <span
        className={cn(
          'text-near-white',
          mono ? 'font-mono text-[11px]' : 'text-[11px]',
        )}
      >
        {value}
      </span>
    </div>
  )
}
