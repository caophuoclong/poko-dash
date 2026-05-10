import { describe, expect, it } from 'vitest'
import {
  isLoopOutputShape,
  resolveLoopItem,
  resolveLoopItems,
  resolveLoopLength,
} from './loop-output-utils'

describe('loop-output-utils', () => {
  it('uses canonical loop shape fields when present', () => {
    const output = {
      items: [{ id: 1 }, { id: 2 }],
      length: 2,
      current: {
        item: { id: 1, name: 'A' },
        index: 0,
        isFirst: true,
        isLast: false,
      },
    }

    expect(isLoopOutputShape(output)).toBe(true)
    expect(resolveLoopItems(output)).toEqual([{ id: 1 }, { id: 2 }])
    expect(resolveLoopLength(output)).toBe(2)
    expect(resolveLoopItem(output)).toEqual({ id: 1, name: 'A' })
  })

  it('falls back to legacy shape fields', () => {
    const output = {
      loopResults: [{ id: 10 }, { id: 11 }],
      loopCount: 2,
      item: { id: 10 },
      index: 0,
      isFirst: true,
      isLast: false,
    }

    expect(isLoopOutputShape(output)).toBe(false)
    expect(resolveLoopItems(output)).toEqual([{ id: 10 }, { id: 11 }])
    expect(resolveLoopLength(output)).toBe(2)
    expect(resolveLoopItem(output)).toEqual({ id: 10 })
  })

  it('does not crash on malformed/random output and uses heuristic fallback', () => {
    const output = {
      foo: 'bar',
      data: [42, 43],
    }

    expect(isLoopOutputShape(output)).toBe(false)
    expect(resolveLoopItems(output)).toEqual([42, 43])
    expect(resolveLoopLength(output)).toBe(2)
    expect(resolveLoopItem(output)).toEqual({ value: 42 })
  })
})
