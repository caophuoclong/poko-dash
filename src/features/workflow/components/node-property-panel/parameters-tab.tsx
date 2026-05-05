import { cn } from '#/shared/utils'
import { PropertyEditor } from '../property-editors/property-editor'
import type {
  NodeDefinition,
  ValidationError,
} from '../../stores/node-registry/use-node-registry.store'

export function ParametersTab({
  def,
  config,
  onConfigChange,
}: {
  def: NodeDefinition
  config: Record<string, unknown>
  onConfigChange: (key: string, value: unknown) => void
}) {
  const errors: ValidationError[] = def.validate ? def.validate(config) : []
  const propertySchema = def.config.propertySchema
  const inputs = def.io.inputs
  const outputs = def.io.outputs

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-text mb-3">
          Configuration
        </h3>
        <div className="space-y-3">
          {propertySchema.map((schema) => (
            <PropertyEditor
              key={schema.key}
              schema={schema}
              value={config[schema.key] ?? schema.default}
              onChange={onConfigChange}
              allProps={config}
              errors={errors.filter((e) => e.propertyKey === schema.key)}
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
                        className={cn(
                          'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-accent-blue/10 text-accent-blue',
                        )}
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
                          'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-accent-blue/10 text-accent-blue',
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
    </div>
  )
}
