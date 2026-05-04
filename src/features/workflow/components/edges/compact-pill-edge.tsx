import { BaseEdge, getBezierPath, Position } from '@xyflow/react'
import type { EdgeProps } from '@xyflow/react'

export function CompactPillEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  selected,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition: Position.Right,
    targetX,
    targetY,
    targetPosition: Position.Left,
  })

  return (
    <>
      <path
        d={edgePath}
        stroke="transparent"
        strokeWidth="12"
        fill="none"
      />
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: selected ? 'oklch(80% 0.02 250)' : 'oklch(92% 0.005 250)',
          strokeWidth: 1.5,
        }}
      />
      <circle
        cx={targetX}
        cy={targetY}
        r={2}
        fill="oklch(92% 0.005 250)"
      />
    </>
  )
}
