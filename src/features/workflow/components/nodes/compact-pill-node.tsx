import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'
import { cn } from '#/shared/utils'
import { getNodeDefinition } from '../../node-registry'
import type { WorkflowNodeData } from '../../types'
import { useNodeExecutionStatus } from '../../hooks/use-node-execution-status'
import type { NodeExecutionStatus } from '../../utils/execution-engine'
import {
  CATEGORY_TO_PILL_TYPE,
  PILL_TYPE_COLORS,
  PILL_STATUS_DOT_COLORS,
  PORT_CONFIG,
  pillIconSvg,
} from './compact-pill-node.constants'
import type { PillNodeType, PillStatus } from './compact-pill-node.constants'

function execStatusToPillStatus(s: NodeExecutionStatus): PillStatus {
  if (s === 'running') return 'running'
  if (s === 'error') return 'error'
  return 'idle'
}

function PillPort({ type, hovered }: { type: 'target' | 'source'; hovered: boolean }) {
  return (
    <Handle
      type={type}
      position={type === 'target' ? Position.Left : Position.Right}
      className={cn(
        '!w-[10px] !h-[10px] !rounded-full !border-[2px] !absolute !top-1/2 !-translate-y-1/2',
        type === 'target' ? '!-left-[5px]' : '!-right-[5px]',
        '!transition-colors !duration-150',
        hovered
          ? '!border-[oklch(55%_0.12_250)]'
          : '!border-[oklch(92%_0.005_250)]',
        '!bg-white',
      )}
    />
  )
}

function CompactPillNode({ data, selected, id }: NodeProps) {
  const nodeData = data as unknown as WorkflowNodeData
  const def = nodeData.nodeTypeId ? getNodeDefinition(String(nodeData.nodeTypeId)) : null

  const pillType: PillNodeType = def
    ? (CATEGORY_TO_PILL_TYPE[def.category] ?? 'action')
    : 'action'

  const iconColor = PILL_TYPE_COLORS[pillType]
  const icon = pillIconSvg(pillType)
  const ports = PORT_CONFIG[pillType]

  const executionStatus = useNodeExecutionStatus(id)
  const pillStatus = execStatusToPillStatus(executionStatus)
  const dotColor = PILL_STATUS_DOT_COLORS[pillStatus]

  return (
    <div className="group relative">
      <div
        className={cn(
          'relative flex items-center gap-[7px]',
          'h-[38px] rounded-lg',
          'bg-white border',
          'pl-[10px] pr-[14px]',
          'shadow-[0_1px_2px_rgba(0,0,0,0.04)]',
          'transition-shadow duration-150',
          selected
            ? 'border-[oklch(80%_0.02_250)] shadow-[0_0_0_1px_oklch(80%_0.04_250),0_1px_2px_rgba(0,0,0,0.04)]'
            : 'border-[oklch(92%_0.005_250)]',
        )}
        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
      >
        {ports.hasInput && <PillPort type="target" hovered={false} />}

        <span className="shrink-0 flex items-center" style={{ color: iconColor, width: 14, height: 14 }}>
          {icon}
        </span>

        <span
          className="truncate select-none"
          style={{
            fontSize: '12.5px',
            fontWeight: 500,
            letterSpacing: '-0.01em',
            color: 'oklch(18% 0.012 250)',
          }}
        >
          {nodeData.title}
        </span>

        <span
          className={cn(
            'shrink-0 rounded-full',
            pillStatus === 'running' && 'animate-[pill-pulse_1.5s_ease-in-out_infinite]',
          )}
          style={{
            width: 6,
            height: 6,
            backgroundColor: dotColor,
          }}
        />

        {ports.hasOutput && <PillPort type="source" hovered={false} />}
      </div>
    </div>
  )
}

export default memo(CompactPillNode)
