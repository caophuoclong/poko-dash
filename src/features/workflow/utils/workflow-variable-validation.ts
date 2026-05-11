export interface VariableKeyValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

const SNAKE_CASE_UPPER_RE = /^[A-Z][A-Z0-9_]*$/
const VALID_KEY_RE = /^[A-Za-z_][A-Za-z0-9_]*$/
const RESERVED_NAMESPACES = new Set([
  '$json',
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

/**
 * Validates a workflow variable key.
 * Returns hard errors (block save) and advisory warnings (non-blocking).
 */
export function validateWorkflowVariableKey(
  key: string,
  existingKeys: string[],
  currentKey?: string,
): VariableKeyValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!key.trim()) {
    errors.push('Key is required')
    return { valid: false, errors, warnings }
  }

  if (!VALID_KEY_RE.test(key)) {
    errors.push(
      'Key must start with a letter or underscore, and contain only letters, digits, and underscores',
    )
  }

  // Check uniqueness — exclude the current key being edited
  const dupes = existingKeys.filter((k) => k === key && k !== currentKey)
  if (dupes.length > 0) {
    errors.push(`Key "${key}" already exists in this workflow`)
  }

  // Check against reserved namespaces
  if (RESERVED_NAMESPACES.has(key)) {
    errors.push(
      `"${key}" is a reserved namespace and cannot be used as a variable key`,
    )
  }

  // Non-blocking: recommend UPPER_SNAKE_CASE
  if (errors.length === 0 && !SNAKE_CASE_UPPER_RE.test(key)) {
    warnings.push(
      'Recommended: use UPPER_SNAKE_CASE (e.g. MY_KEY) for workflow variables',
    )
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Validates a variable value. Values can be empty (allowed).
 */
export function validateWorkflowVariableValue(_value: string): {
  valid: boolean
  errors: string[]
} {
  return { valid: true, errors: [] }
}
