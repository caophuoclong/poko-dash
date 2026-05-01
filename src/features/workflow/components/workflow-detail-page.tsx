import { useCallback, useState } from 'react'
import {
  Save,
  Undo2,
  Redo2,
  Play,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowLeft,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { WorkflowCanvas } from './workflow-canvas'
import { InspectorPanel } from './inspector-panel'
import { NodePalette } from './node-palette'
import type { WorkflowDetail } from '../types'

interface WorkflowDetailPageProps {
  workflow: WorkflowDetail
}

export function WorkflowDetailPage({ workflow }: WorkflowDetailPageProps) {
  const [paletteCollapsed, setPaletteCollapsed] = useState(false)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  const handleNodeSelect = useCallback((nodeId: string | null) => {
    setSelectedNodeId(nodeId)
  }, [])

  return (
    <div className="h-screen flex flex-col bg-void">
      <header className="flex items-center gap-3 px-4 py-2.5 border-b border-frost bg-surface shrink-0">
        <Link
          to="/dash/workflows"
          className="flex items-center gap-1.5 text-xs text-muted-text hover:text-near-white transition-colors no-underline mr-2"
        >
          <ArrowLeft size={14} />
          <span className="hidden sm:inline">Back</span>
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold text-near-white truncate">
              {workflow.name}
            </h1>
            <Badge
              tone={
                workflow.status === 'active'
                  ? 'green'
                  : workflow.status === 'paused'
                    ? 'yellow'
                    : 'neutral'
              }
              size="sm"
            >
              {workflow.status}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon-xs"
            title="Undo"
            className="text-muted-text hover:text-near-white"
          >
            <Undo2 size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            title="Redo"
            className="text-muted-text hover:text-near-white"
          >
            <Redo2 size={14} />
          </Button>

          <div className="w-px h-5 bg-frost mx-1" />

          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setPaletteCollapsed((v) => !v)}
            title={paletteCollapsed ? 'Show node palette' : 'Hide node palette'}
            className={!paletteCollapsed ? 'text-accent-blue bg-accent-blue-dim' : 'text-muted-text hover:text-near-white'}
          >
            {paletteCollapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
          </Button>

          <div className="w-px h-5 bg-frost mx-1" />

          <Button size="xs" color="green-dim">
            <Save size={14} />
            Save
          </Button>

          {workflow.status !== 'active' && (
            <Button size="xs" color="blue-dim">
              <Play size={14} />
              Run
            </Button>
          )}

          <Button variant="ghost" size="icon-xs" className="text-muted-text hover:text-near-white">
            <MoreHorizontal size={14} />
          </Button>
        </div>
      </header>

      <div className="flex-1 flex min-h-0">
        <NodePalette
          collapsed={paletteCollapsed}
          onToggle={() => setPaletteCollapsed((v) => !v)}
        />

        <div className="flex-1 flex min-w-0 relative">
          <WorkflowCanvas
            workflow={workflow}
            onNodeSelect={handleNodeSelect}
          />
        </div>

        <InspectorPanel
          workflow={workflow}
          selectedNodeId={selectedNodeId}
          onNodeDeselect={() => setSelectedNodeId(null)}
        />
      </div>
    </div>
  )
}
