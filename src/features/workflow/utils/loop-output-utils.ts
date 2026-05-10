export interface LoopOutputShape {
  items: unknown[]
  length: number
  current: {
    item: unknown | null
    index: number
    isFirst: boolean
    isLast: boolean
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object'
}

export function isLoopOutputShape(value: unknown): value is LoopOutputShape {
  if (!isRecord(value)) return false
  if (!Array.isArray(value.items)) return false
  if (typeof value.length !== 'number') return false
  if (!isRecord(value.current)) return false

  const current = value.current as Record<string, unknown>
  return (
    'item' in current &&
    typeof current.index === 'number' &&
    typeof current.isFirst === 'boolean' &&
    typeof current.isLast === 'boolean'
  )
}

export function resolveLoopItems(outputData?: Record<string, unknown>): unknown[] | null {
  if (!outputData) return null
  if (Array.isArray(outputData.items)) return outputData.items
  if (Array.isArray(outputData.loopResults)) return outputData.loopResults

  for (const val of Object.values(outputData)) {
    if (Array.isArray(val)) return val
  }

  return null
}

export function resolveLoopLength(outputData?: Record<string, unknown>): number | null {
  if (!outputData) return null
  if (typeof outputData.length === 'number') return outputData.length
  if (typeof outputData.loopCount === 'number') return outputData.loopCount

  const items = resolveLoopItems(outputData)
  return items ? items.length : null
}

export function resolveLoopItem(outputData?: Record<string, unknown>): Record<string, unknown> | null {
  if (!outputData) return null

  if (isLoopOutputShape(outputData)) {
    const item = outputData.current.item
    if (item !== null && typeof item === 'object') return item as Record<string, unknown>
    if (item !== null && item !== undefined) return { value: item }
  }

  if ('item' in outputData) {
    const item = outputData.item
    if (item !== null && typeof item === 'object') return item as Record<string, unknown>
    if (item !== null && item !== undefined) return { value: item }
  }

  const items = resolveLoopItems(outputData)
  if (items && items.length > 0) {
    const first = items[0]
    if (first !== null && typeof first === 'object') return first as Record<string, unknown>
    return { value: first }
  }

  return null
}
