import type { PortDto } from '#/api/model'
import React from 'react'
import { PORT_KIND_COLOR } from './workflow-node.constants'
import { Handle, type Position } from '@xyflow/react'
import { cn } from '#/shared/utils'

export function PortDot({
  port,
  type,
  position,
  index,
  total,
}: {
  port: PortDto
  type: 'target' | 'source'
  position: Position
  index: number
  total: number
}) {
  const isInput = type === 'target'
  const color = PORT_KIND_COLOR.data
  const spacing = 100 / (total + 1)
  const top = spacing * (index + 1)

  return (
    <>
      <Handle
        id={port.id}
        type={type}
        position={position}
        style={{ top: `${top}%` }}
        className={cn(
          isInput
            ? '!w-[3px] !h-[14px] !rounded-[1px] !border-0'
            : '!w-[10px] !h-[10px] !rounded-full !border-0',
          'transition-transform hover:!scale-125',
          color,
        )}
        title={port.label || port.id}
      />
      {port.label && (
        <span
          className="absolute text-[9px] font-mono font-bold tracking-wider uppercase text-muted-text select-none pointer-events-none"
          style={{
            top: `calc(${top}% + 4px)`,

            left: isInput ? '0%' : '100%',

            transform: isInput
              ? 'translate(-120%, -50%)'
              : 'translate(20%, -50%)',
          }}
        >
          {port.label}
        </span>
      )}
    </>
  )
}
