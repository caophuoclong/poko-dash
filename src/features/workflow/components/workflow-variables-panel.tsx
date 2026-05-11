import { useState, useCallback } from 'react'
import { X, Plus, Trash2, Variable, AlertCircle } from 'lucide-react'
import { cn } from '#/shared/utils'
import { Button } from '#/components/ui/button'
import type { WorkflowVariable } from '../types'
import { validateWorkflowVariableKey } from '../utils/workflow-variable-validation'

interface WorkflowVariablesPanelProps {
  variables: WorkflowVariable[]
  onChange: (variables: WorkflowVariable[]) => void
  onClose: () => void
}

interface EditingRow {
  index: number
  key: string
  value: string
  description: string
}

export function WorkflowVariablesPanel({
  variables,
  onChange,
  onClose,
}: WorkflowVariablesPanelProps) {
  const [editingRow, setEditingRow] = useState<EditingRow | null>(null)
  const [newRow, setNewRow] = useState<
    (Omit<WorkflowVariable, 'key'> & { key: string }) | null
  >(null)

  const existingKeys = variables.map((v) => v.key)

  const handleAdd = useCallback(() => {
    setNewRow({ key: '', value: '', description: '' })
    setEditingRow(null)
  }, [])

  const handleSaveNew = useCallback(() => {
    if (!newRow) return
    const validation = validateWorkflowVariableKey(newRow.key, existingKeys)
    if (!validation.valid) return

    onChange([
      ...variables,
      { key: newRow.key, value: newRow.value, description: newRow.description },
    ])
    setNewRow(null)
  }, [newRow, existingKeys, variables, onChange])

  const handleCancelNew = useCallback(() => {
    setNewRow(null)
  }, [])

  const handleEdit = useCallback(
    (index: number) => {
      const v = variables[index]
      setEditingRow({
        index,
        key: v.key,
        value: v.value,
        description: v.description || '',
      })
      setNewRow(null)
    },
    [variables],
  )

  const handleSaveEdit = useCallback(() => {
    if (!editingRow) return
    const currentKey = variables[editingRow.index].key
    const validation = validateWorkflowVariableKey(
      editingRow.key,
      existingKeys,
      currentKey,
    )
    if (!validation.valid) return

    const updated = [...variables]
    updated[editingRow.index] = {
      key: editingRow.key,
      value: editingRow.value,
      description: editingRow.description,
    }
    onChange(updated)
    setEditingRow(null)
  }, [editingRow, existingKeys, variables, onChange])

  const handleCancelEdit = useCallback(() => {
    setEditingRow(null)
  }, [])

  const handleDelete = useCallback(
    (index: number) => {
      onChange(variables.filter((_, i) => i !== index))
    },
    [variables, onChange],
  )

  const newRowValidation = newRow
    ? validateWorkflowVariableKey(newRow.key, existingKeys)
    : null
  const editRowValidation = editingRow
    ? validateWorkflowVariableKey(
        editingRow.key,
        existingKeys,
        variables[editingRow.index].key,
      )
    : null

  return (
    <div className="fixed right-0 top-0 bottom-0 w-[480px] z-50 bg-surface border-l border-frost flex flex-col shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-frost shrink-0">
        <div className="flex items-center gap-2">
          <Variable size={16} className="text-accent-blue" />
          <h2 className="text-[13px] font-semibold text-near-white">
            Workflow Variables
          </h2>
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded text-muted-text hover:text-near-white hover:bg-surface-2 transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* Usage hint */}
      <div className="px-4 py-2 bg-accent-blue/5 border-b border-accent-blue/10 shrink-0">
        <p className="text-[11px] text-accent-blue leading-relaxed">
          Variables defined here are available in all nodes as{' '}
          <code className="px-1 py-0.5 rounded bg-accent-blue/10 font-mono">
            {'{{var.KEY}}'}
          </code>
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {/* Existing variables */}
          {variables.map((v, i) => {
            const isEditing = editingRow?.index === i
            if (isEditing) {
              return (
                <div
                  key={i}
                  className="p-3 rounded-lg border border-accent-blue bg-accent-blue/5"
                >
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[10px] font-medium text-muted-text mb-1">
                        Key <span className="text-accent-red">*</span>
                      </label>
                      <input
                        type="text"
                        value={editingRow.key}
                        onChange={(e) =>
                          setEditingRow({ ...editingRow, key: e.target.value })
                        }
                        placeholder="MY_VARIABLE"
                        className="w-full h-7 px-2 rounded border border-frost bg-void text-[12px] font-mono text-near-white placeholder:text-muted-text/50 focus:outline-none focus:ring-1 focus:ring-accent-blue/30"
                      />
                      {editRowValidation &&
                        editRowValidation.errors.length > 0 && (
                          <div className="mt-1 space-y-0.5">
                            {editRowValidation.errors.map((err, idx) => (
                              <p
                                key={idx}
                                className="text-[10px] text-accent-red flex items-center gap-1"
                              >
                                <AlertCircle size={10} />
                                {err}
                              </p>
                            ))}
                          </div>
                        )}
                      {editRowValidation &&
                        editRowValidation.warnings.length > 0 && (
                          <div className="mt-1 space-y-0.5">
                            {editRowValidation.warnings.map((warn, idx) => (
                              <p
                                key={idx}
                                className="text-[10px] text-accent-yellow flex items-center gap-1"
                              >
                                <AlertCircle size={10} />
                                {warn}
                              </p>
                            ))}
                          </div>
                        )}
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-muted-text mb-1">
                        Value
                      </label>
                      <input
                        type="text"
                        value={editingRow.value}
                        onChange={(e) =>
                          setEditingRow({
                            ...editingRow,
                            value: e.target.value,
                          })
                        }
                        placeholder="Value"
                        className="w-full h-7 px-2 rounded border border-frost bg-void text-[12px] text-near-white placeholder:text-muted-text/50 focus:outline-none focus:ring-1 focus:ring-accent-blue/30"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-muted-text mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={editingRow.description}
                        onChange={(e) =>
                          setEditingRow({
                            ...editingRow,
                            description: e.target.value,
                          })
                        }
                        placeholder="Optional description"
                        className="w-full h-7 px-2 rounded border border-frost bg-void text-[12px] text-near-white placeholder:text-muted-text/50 focus:outline-none focus:ring-1 focus:ring-accent-blue/30"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        size="xs"
                        color="blue"
                        onClick={handleSaveEdit}
                        disabled={!editRowValidation?.valid}
                      >
                        Save
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )
            }

            return (
              <div
                key={i}
                className="p-3 rounded-lg border border-frost bg-surface-2 hover:border-frost-hover transition-colors group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-[12px] font-mono font-semibold text-accent-blue">
                        {v.key}
                      </code>
                    </div>
                    <p className="text-[11px] text-near-white truncate mb-1">
                      {v.value || (
                        <span className="text-muted-text italic">(empty)</span>
                      )}
                    </p>
                    {v.description && (
                      <p className="text-[10px] text-muted-text">
                        {v.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(i)}
                      className="w-6 h-6 flex items-center justify-center rounded text-muted-text hover:text-accent-blue hover:bg-accent-blue-dim transition-colors"
                      title="Edit"
                    >
                      <Variable size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(i)}
                      className="w-6 h-6 flex items-center justify-center rounded text-muted-text hover:text-accent-red hover:bg-accent-red/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          {/* New row form */}
          {newRow && (
            <div className="p-3 rounded-lg border border-accent-green bg-accent-green/5">
              <div className="space-y-2">
                <div>
                  <label className="block text-[10px] font-medium text-muted-text mb-1">
                    Key <span className="text-accent-red">*</span>
                  </label>
                  <input
                    type="text"
                    value={newRow.key}
                    onChange={(e) =>
                      setNewRow({ ...newRow, key: e.target.value })
                    }
                    placeholder="MY_VARIABLE"
                    autoFocus
                    className="w-full h-7 px-2 rounded border border-frost bg-void text-[12px] font-mono text-near-white placeholder:text-muted-text/50 focus:outline-none focus:ring-1 focus:ring-accent-green/30"
                  />
                  {newRowValidation && newRowValidation.errors.length > 0 && (
                    <div className="mt-1 space-y-0.5">
                      {newRowValidation.errors.map((err, idx) => (
                        <p
                          key={idx}
                          className="text-[10px] text-accent-red flex items-center gap-1"
                        >
                          <AlertCircle size={10} />
                          {err}
                        </p>
                      ))}
                    </div>
                  )}
                  {newRowValidation && newRowValidation.warnings.length > 0 && (
                    <div className="mt-1 space-y-0.5">
                      {newRowValidation.warnings.map((warn, idx) => (
                        <p
                          key={idx}
                          className="text-[10px] text-accent-yellow flex items-center gap-1"
                        >
                          <AlertCircle size={10} />
                          {warn}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-muted-text mb-1">
                    Value
                  </label>
                  <input
                    type="text"
                    value={newRow.value}
                    onChange={(e) =>
                      setNewRow({ ...newRow, value: e.target.value })
                    }
                    placeholder="Value"
                    className="w-full h-7 px-2 rounded border border-frost bg-void text-[12px] text-near-white placeholder:text-muted-text/50 focus:outline-none focus:ring-1 focus:ring-accent-green/30"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-muted-text mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newRow.description}
                    onChange={(e) =>
                      setNewRow({ ...newRow, description: e.target.value })
                    }
                    placeholder="Optional description"
                    className="w-full h-7 px-2 rounded border border-frost bg-void text-[12px] text-near-white placeholder:text-muted-text/50 focus:outline-none focus:ring-1 focus:ring-accent-green/30"
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    size="xs"
                    color="green"
                    onClick={handleSaveNew}
                    disabled={!newRowValidation?.valid}
                  >
                    Add Variable
                  </Button>
                  <Button size="xs" variant="ghost" onClick={handleCancelNew}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Add button */}
          {!newRow && !editingRow && (
            <button
              onClick={handleAdd}
              className={cn(
                'w-full h-10 flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-frost',
                'text-[12px] font-medium text-muted-text hover:text-accent-blue hover:border-accent-blue/30 hover:bg-accent-blue/5',
                'transition-colors',
              )}
            >
              <Plus size={14} />
              Add Variable
            </button>
          )}

          {variables.length === 0 && !newRow && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Variable size={32} className="text-muted-text/30 mb-3" />
              <p className="text-[12px] text-muted-text mb-1">
                No variables defined yet
              </p>
              <p className="text-[11px] text-muted-text/70 max-w-[280px]">
                Add workflow-level variables to reuse values across all nodes
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
