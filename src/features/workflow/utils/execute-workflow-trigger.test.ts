import { describe, it, expect } from 'vitest'
import type { ExecuteWorkflowDtoTriggeredBy } from '#/api/model/executeWorkflowDtoTriggeredBy'

describe('ExecuteWorkflowDtoTriggeredBy', () => {
  it('accepts webhook', () => {
    const triggeredBy: ExecuteWorkflowDtoTriggeredBy = 'webhook'
    expect(triggeredBy).toBe('webhook')
  })
})
