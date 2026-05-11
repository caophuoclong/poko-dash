import cronstrue from 'cronstrue'
import type {
  PropertySchema,
  ValidationError,
  PortDefinition,
  SummaryFieldConfig,
  NodeDefinitionRecord,
} from './node-types'

export function deriveValidator(
  schema: PropertySchema[],
): (props: Record<string, unknown>) => ValidationError[] {
  return (props: Record<string, unknown>): ValidationError[] => {
    const errors: ValidationError[] = []

    for (const field of schema) {
      const value = props[field.key]
      const isEmpty =
        value === undefined ||
        value === null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0)

      if (field.required && isEmpty) {
        errors.push({
          propertyKey: field.key,
          message: `${field.label} is required`,
          severity: 'error',
        })
        continue
      }

      if (isEmpty) continue

      if (field.type === 'url' && typeof value === 'string') {
        try {
          new URL(value)
        } catch {
          errors.push({
            propertyKey: field.key,
            message: `${field.label} must be a valid URL`,
            severity: 'error',
          })
          continue
        }
      }

      if (field.type === 'cron' && typeof value === 'string') {
        try {
          cronstrue.toString(value)
        } catch {
          errors.push({
            propertyKey: field.key,
            message: `${field.label} must be a valid cron expression`,
            severity: 'warning',
          })
          continue
        }
      }

      if (
        field.min !== undefined &&
        typeof value === 'number' &&
        value < field.min
      ) {
        errors.push({
          propertyKey: field.key,
          message: `${field.label} must be at least ${field.min}`,
          severity: 'error',
        })
        continue
      }

      if (
        field.max !== undefined &&
        typeof value === 'number' &&
        value > field.max
      ) {
        errors.push({
          propertyKey: field.key,
          message: `${field.label} must be at most ${field.max}`,
          severity: 'error',
        })
        continue
      }

      if (field.enum && field.enum.length > 0) {
        const strValue = String(value)
        if (!field.enum.includes(strValue)) {
          errors.push({
            propertyKey: field.key,
            message: `${field.label} must be one of: ${field.enum.join(', ')}`,
            severity: 'error',
          })
        }
      }
    }

    return errors
  }
}

export function resolveInputs(def: NodeDefinitionRecord): PortDefinition[] {
  return def.io?.inputs ?? def.inputs ?? []
}

export function resolveOutputs(def: NodeDefinitionRecord): PortDefinition[] {
  return def.io?.outputs ?? def.outputs ?? []
}

export function resolvePropertySchema(
  def: NodeDefinitionRecord,
): PropertySchema[] {
  return def.config?.propertySchema ?? def.propertySchema ?? []
}

export function resolveDefaultProps(
  def: NodeDefinitionRecord,
): Record<string, unknown> {
  return def.config?.defaultProps ?? def.defaultProps ?? {}
}

export function resolveSummaryFields(
  def: NodeDefinitionRecord,
): SummaryFieldConfig[] {
  return def.ui?.summaryFields ?? def.summaryFields ?? []
}

export function resolveColor(def: NodeDefinitionRecord): string | undefined {
  return def.ui?.color
}

export function isNodeHidden(def: NodeDefinitionRecord): boolean {
  return Boolean(def.identity?.supportingOnly || def.identity?.deprecated)
}
