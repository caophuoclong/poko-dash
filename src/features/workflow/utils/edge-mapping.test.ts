import { describe, it, expect } from 'vitest'
import { mapCanvasEdgeToDtoEdge, mapDtoEdgeToCanvasEdge } from './edge-mapping'
import type { Edge } from '@xyflow/react'
import type { WorkflowEdgeDto } from '#/api/model/workflowEdgeDto'

function makeEdge(overrides: Partial<Edge> = {}): Edge {
  return {
    id: 'e1',
    source: 'node-a',
    target: 'node-b',
    type: 'workflow-edge',
    ...overrides,
  }
}

function makeDtoEdge(overrides: Partial<WorkflowEdgeDto> = {}): WorkflowEdgeDto {
  return {
    id: 'e1',
    source_node_id: 'node-a',
    target_node_id: 'node-b',
    type: 'main',
    ...overrides,
  }
}

describe('mapCanvasEdgeToDtoEdge', () => {
  it('maps basic edge fields (source, target, handles, style)', () => {
    const edge = makeEdge({
      sourceHandle: 'output',
      targetHandle: 'input',
      style: { stroke: '#ff0000', strokeWidth: 2 },
    })
    const dto = mapCanvasEdgeToDtoEdge(edge)
    expect(dto.source_node_id).toBe('node-a')
    expect(dto.target_node_id).toBe('node-b')
    expect(dto.source_handle).toBe('output')
    expect(dto.target_handle).toBe('input')
    expect(dto.style).toEqual({ stroke: '#ff0000', strokeWidth: 2 })
  })

  it('defaults main type + edge_type for edges without route data', () => {
    const dto = mapCanvasEdgeToDtoEdge(makeEdge())
    expect(dto.type).toBe('main')
    expect(dto.edge_type).toBe('main')
  })

  it('maps condition_true edgeType to type=true and leaves edge_type undefined', () => {
    const dto = mapCanvasEdgeToDtoEdge(makeEdge({ data: { edgeType: 'condition_true' } }))
    expect(dto.type).toBe('true')
    expect(dto.edge_type).toBeUndefined()
  })

  it('maps condition_false edgeType to type=false and leaves edge_type undefined', () => {
    const dto = mapCanvasEdgeToDtoEdge(makeEdge({ data: { edgeType: 'condition_false' } }))
    expect(dto.type).toBe('false')
    expect(dto.edge_type).toBeUndefined()
  })

  it('maps error edgeType to type=error edge_type=error', () => {
    const dto = mapCanvasEdgeToDtoEdge(makeEdge({ data: { edgeType: 'error' } }))
    expect(dto.type).toBe('error')
    expect(dto.edge_type).toBe('error')
  })

  it('maps sourceHandle=default to type=switch_default', () => {
    const dto = mapCanvasEdgeToDtoEdge(makeEdge({ sourceHandle: 'default' }))
    expect(dto.type).toBe('switch_default')
  })

  it('maps sourceHandle=case_3 to type=switch_case', () => {
    const dto = mapCanvasEdgeToDtoEdge(makeEdge({ sourceHandle: 'case_3' }))
    expect(dto.type).toBe('switch_case')
  })

  it('maps sourceHandle=error to type=error edge_type=error', () => {
    const dto = mapCanvasEdgeToDtoEdge(makeEdge({ sourceHandle: 'error' }))
    expect(dto.type).toBe('error')
    expect(dto.edge_type).toBe('error')
  })

  it('maps missing sourceHandle/targetHandle to undefined', () => {
    const edge = makeEdge()
    delete edge.sourceHandle
    delete edge.targetHandle
    const dto = mapCanvasEdgeToDtoEdge(edge)
    expect(dto.source_handle).toBeUndefined()
    expect(dto.target_handle).toBeUndefined()
  })
})

describe('mapDtoEdgeToCanvasEdge', () => {
  it('maps basic fields back from DTO to canvas edge', () => {
    const dto = makeDtoEdge({
      source_node_id: 'node-a',
      target_node_id: 'node-b',
      source_handle: 'output',
      target_handle: 'input',
      style: { stroke: '#00ff00' },
    })
    const edge = mapDtoEdgeToCanvasEdge(dto)
    expect(edge.id).toBe('e1')
    expect(edge.source).toBe('node-a')
    expect(edge.target).toBe('node-b')
    expect(edge.sourceHandle).toBe('output')
    expect(edge.targetHandle).toBe('input')
    expect(edge.style).toEqual({ stroke: '#00ff00' })
  })

  it('preserves logical type in edge data', () => {
    const dto = makeDtoEdge({ type: 'switch_case' })
    const edge = mapDtoEdgeToCanvasEdge(dto)
    expect(edge.data?.logicalType).toBe('switch_case')
  })

  it('maps switch_case + case_1 to correct canvas edgeType', () => {
    const dto = makeDtoEdge({ type: 'switch_case', source_handle: 'case_1' })
    const edge = mapDtoEdgeToCanvasEdge(dto)
    expect(edge.sourceHandle).toBe('case_1')
  })

  it('sets visual type to workflow-edge always', () => {
    const dto = makeDtoEdge()
    const edge = mapDtoEdgeToCanvasEdge(dto)
    expect(edge.type).toBe('workflow-edge')
  })

  it('maps condition types to edgeType for UI coloring', () => {
    const trueDto = makeDtoEdge({ type: 'true' })
    const falseDto = makeDtoEdge({ type: 'false' })
    expect(mapDtoEdgeToCanvasEdge(trueDto).data?.edgeType).toBe('condition_true')
    expect(mapDtoEdgeToCanvasEdge(falseDto).data?.edgeType).toBe('condition_false')
  })

  it('maps error type to edgeType for UI coloring', () => {
    const dto = makeDtoEdge({ type: 'error', edge_type: 'error' })
    const edge = mapDtoEdgeToCanvasEdge(dto)
    expect(edge.data?.edgeType).toBe('error')
  })

  it('falls back to auto style and frost stroke when no style in DTO', () => {
    const dto = makeDtoEdge()
    const edge = mapDtoEdgeToCanvasEdge(dto)
    expect(edge.data?.style).toBe('auto')
    expect(edge.style).toEqual({ stroke: 'var(--t-frost)', strokeWidth: 1.5 })
  })
})
