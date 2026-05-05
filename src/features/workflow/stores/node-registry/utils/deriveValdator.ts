import type { PropertyFieldDto } from '#/api/model'

import cronstrue from 'cronstrue'
import type { ValidationError } from '../use-node-registry.store'

export function deriveValidator(
  schema: PropertyFieldDto[],
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
    }

    return errors
  }
}
