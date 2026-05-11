import {
  Save,
  Variable,
  Undo2,
  Redo2,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowLeft,
  Plus,
  Trash2,
  Loader2,
  History,
  GitCommit,
  Info,
  AlertTriangle,
  RotateCcw,
  Download,
  Upload,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { WorkflowCanvas } from './workflow-canvas'
import { NodePalette } from './node-palette'
import { NodeEditModal } from './node-edit-modal/index'
import { ExecutionDock } from './execution-dock'
import { ExecutionDrawer } from './execution-drawer'
import { VersionHistoryPanel } from './VersionHistoryPanel'
import { WorkflowVariablesPanel } from './workflow-variables-panel'
import { exportWorkflow } from '../workflow-transfer'
import type { WorkflowDetail, WorkflowNodeData } from '../types'
import { useWorkflowDetailPage } from '../hooks/use-workflow-detail-page/useWorkflowDetailPage'

interface WorkflowDetailPageProps {
  workflow: WorkflowDetail
}

export function WorkflowDetailPage({ workflow }: WorkflowDetailPageProps) {
  const {
    paletteCollapsed,
    setPaletteCollapsed,
    selectedNodeId,
    editingNodeId,
    editingNode,
    drawerOpen,
    setDrawerOpen,
    versionPanelOpen,
    setVersionPanelOpen,
    variablesPanelOpen,
    setVariablesPanelOpen,
    workflowVariables,
    handleVariablesChange,
    previewVersion,
    restoringVersion,
    saveVersionPopoverOpen,
    setSaveVersionPopoverOpen,
    versionMessage,
    setVersionMessage,
    autoSaveVisible,
    fileInputRef,
    editor,
    rfInstance,
    saveMutation,
    deleteMutation,
    createVersionMutation,
    connectSSE,
    canUndo,
    canRedo,
    navigate,
    handleExecute,
    handleRestoreClick,
    handleConfirmRestore,
    handleCancelRestore,
    handleSaveVersion,
    handleAddNode,
    handlePaneClick,
    handleNodeSelect,
    handleNodeDoubleClick,
    handleCloseModal,
    handleNodeDataUpdate,
    handleDeleteNode,
    handleImportChange,
  } = useWorkflowDetailPage(workflow)

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col bg-void">
        {editingNode && (
          <NodeEditModal
            key={editingNodeId}
            open={true}
            nodeId={editingNode.id}
            data={editingNode.data}
            position={editingNode.position}
            nodes={editor.nodes}
            edges={editor.edges}
            workflowVariables={workflowVariables}
            onClose={handleCloseModal}
            onNodeDataUpdate={handleNodeDataUpdate}
            onDeleteNode={handleDeleteNode}
            onExecute={handleExecute}
          />
        )}

        {previewVersion !== null && (
          <div className="flex items-center justify-between px-4 py-2 bg-accent-yellow/10 border-b border-accent-yellow/20 shrink-0">
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-accent-yellow" />
              <span className="text-xs text-accent-yellow">
                Previewing v{previewVersion} — Save to apply or Cancel to
                discard
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="xs"
                color="green-dim"
                onClick={handleConfirmRestore}
                disabled={saveMutation.isPending}
              >
                {saveMutation.isPending ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Save size={12} />
                )}
                Save this version
              </Button>
              <Button size="xs" variant="ghost" onClick={handleCancelRestore}>
                Cancel
              </Button>
            </div>
          </div>
        )}

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
              size="xs"
              color="blue-dim"
              onClick={() =>
                paletteCollapsed
                  ? setPaletteCollapsed(false)
                  : editor.setNodes((prev) => [...prev])
              }
              title={
                paletteCollapsed
                  ? 'Open node palette'
                  : 'Palette is open — drag nodes to canvas'
              }
            >
              <Plus size={14} />
              Add Node
            </Button>

            <Button
              variant="ghost"
              size="icon-xs"
              title="Import workflow"
              onClick={() => fileInputRef.current?.click()}
              className="text-muted-text hover:text-near-white"
            >
              <Upload size={14} />
            </Button>

            <Button
              variant="ghost"
              size="icon-xs"
              title="Export workflow"
              onClick={() => {
                exportWorkflow(workflow.id).catch((err) =>
                  console.error('Export failed:', err),
                )
              }}
              className="text-muted-text hover:text-near-white"
            >
              <Download size={14} />
            </Button>

            <div className="w-px h-5 bg-frost mx-1" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setVariablesPanelOpen((v) => !v)}
                  className={
                    variablesPanelOpen
                      ? 'text-accent-blue bg-accent-blue-dim'
                      : 'text-muted-text hover:text-near-white'
                  }
                >
                  <Variable size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Workflow variables</TooltipContent>
            </Tooltip>

            <div className="w-px h-5 bg-frost mx-1" />

            <Button
              variant="ghost"
              size="icon-xs"
              title="Undo"
              onClick={editor.undo}
              disabled={!canUndo}
              className="text-muted-text hover:text-near-white disabled:opacity-30"
            >
              <Undo2 size={14} />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              title="Redo"
              onClick={editor.redo}
              disabled={!canRedo}
              className="text-muted-text hover:text-near-white disabled:opacity-30"
            >
              <Redo2 size={14} />
            </Button>

            <div className="w-px h-5 bg-frost mx-1" />

            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setPaletteCollapsed((v) => !v)}
              title={
                paletteCollapsed ? 'Show node palette' : 'Hide node palette'
              }
              className={
                !paletteCollapsed
                  ? 'text-accent-blue bg-accent-blue-dim'
                  : 'text-muted-text hover:text-near-white'
              }
            >
              {paletteCollapsed ? (
                <PanelLeftOpen size={14} />
              ) : (
                <PanelLeftClose size={14} />
              )}
            </Button>

            <div className="w-px h-5 bg-frost mx-1" />

            <div className="relative">
              {saveVersionPopoverOpen && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[280px] bg-surface border border-frost rounded-xl shadow-lg p-3 z-50">
                  <div className="flex items-center gap-2 mb-3">
                    <GitCommit size={14} className="text-accent-blue" />
                    <span className="text-xs font-semibold text-near-white">
                      Save Version
                    </span>
                  </div>
                  <input
                    type="text"
                    value={versionMessage}
                    onChange={(e) => setVersionMessage(e.target.value)}
                    placeholder="What changed in this version?"
                    className="w-full h-8 px-3 rounded-lg border border-frost bg-surface-2 text-xs text-near-white placeholder:text-muted-text focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue/30 mb-3"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveVersion()
                      if (e.key === 'Escape') {
                        setSaveVersionPopoverOpen(false)
                        setVersionMessage('')
                      }
                    }}
                  />
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => {
                        setSaveVersionPopoverOpen(false)
                        setVersionMessage('')
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="xs"
                      color="blue"
                      onClick={handleSaveVersion}
                      disabled={createVersionMutation.isPending}
                    >
                      {createVersionMutation.isPending ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <GitCommit size={12} />
                      )}
                      Save Version
                    </Button>
                  </div>
                </div>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setSaveVersionPopoverOpen(true)}
                    className="text-muted-text hover:text-near-white"
                  >
                    <GitCommit size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Save a version snapshot
                </TooltipContent>
              </Tooltip>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setVersionPanelOpen((v) => !v)}
                  className={
                    versionPanelOpen
                      ? 'text-accent-blue bg-accent-blue-dim'
                      : 'text-muted-text hover:text-near-white'
                  }
                >
                  <History size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Version history</TooltipContent>
            </Tooltip>

            <div className="w-px h-5 bg-frost mx-1" />

            <div className="flex items-center gap-2">
              <Button
                size="xs"
                color="green-dim"
                onClick={() => editor.triggerSave('manual')}
                disabled={
                  saveMutation.isPending || editor.saveStatus === 'saving'
                }
              >
                {editor.saveStatus === 'saving' ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                Save
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="text-muted-text hover:text-near-white"
                  >
                    <MoreHorizontal size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="bottom">
                  <DropdownMenuItem onClick={() => editor.revertToSaved()}>
                    <RotateCcw size={14} />
                    <span>Revert to last saved</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-accent-red"
                    onClick={() => {
                      deleteMutation.mutate(workflow.id, {
                        onSuccess: () => {
                          navigate({ to: '/dash/workflows' })
                        },
                      })
                    }}
                  >
                    <Trash2 size={14} />
                    <span>Delete Workflow</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {editor.saveStatus === 'saving' && (
                <span className="text-[10px] text-accent-blue animate-pulse">
                  Saving…
                </span>
              )}
              {editor.saveStatus === 'dirty' && (
                <span className="text-[10px] text-accent-yellow">
                  <Info size={10} className="inline mr-0.5" />
                  Unsaved changes
                </span>
              )}
              {editor.saveStatus === 'saved' && (
                <span className="text-[10px] text-accent-green fade-out">
                  All changes saved
                </span>
              )}
              {editor.saveStatus === 'error' && (
                <span className="text-[10px] text-accent-red">Save failed</span>
              )}
              {autoSaveVisible && editor.saveStatus === 'idle' && (
                <span className="text-[10px] text-muted-text">
                  Version auto-saved
                </span>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 flex min-h-0">
          <NodePalette
            collapsed={paletteCollapsed}
            onToggle={() => setPaletteCollapsed((v) => !v)}
            onAddNode={handleAddNode}
          />

          <div className="flex-1 flex min-w-0 relative">
            <WorkflowCanvas
              nodes={editor.nodes}
              edges={editor.edges}
              onNodesChange={editor.handleNodesChange}
              onEdgesChange={editor.handleEdgesChange}
              onNodeSelect={handleNodeSelect}
              onNodeDoubleClick={handleNodeDoubleClick}
              onPaneClick={handlePaneClick}
              workflowId={workflow.id}
              rfInstanceRef={rfInstance}
            />

            <ExecutionDrawer
              nodes={editor.nodes}
              edges={editor.edges}
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            />

            <ExecutionDock
              selectedNodeId={selectedNodeId}
              nodes={editor.nodes}
              edges={editor.edges}
              onToggleDrawer={() => setDrawerOpen((v) => !v)}
              drawerOpen={drawerOpen}
              workflowId={workflow.id}
              onStartSSE={connectSSE}
            />
          </div>

          <VersionHistoryPanel
            workflowId={workflow.id}
            open={versionPanelOpen}
            onClose={() => setVersionPanelOpen(false)}
            onRestore={handleRestoreClick}
            restoringVersion={restoringVersion}
          />

          {variablesPanelOpen && (
            <WorkflowVariablesPanel
              variables={workflowVariables}
              onChange={handleVariablesChange}
              onClose={() => setVariablesPanelOpen(false)}
            />
          )}
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleImportChange}
      />
    </TooltipProvider>
  )
}
