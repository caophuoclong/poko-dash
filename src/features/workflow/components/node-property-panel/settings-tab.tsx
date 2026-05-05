import { FieldLabel } from '../property-editors/field-label'
import { ToggleRow } from './toggle-row'
import type { NodeMeta } from '../../types'

export function SettingsTab({
  meta,
  onMetaChange,
}: {
  meta: NodeMeta
  onMetaChange: (patch: Partial<NodeMeta>) => void
}) {
  return (
    <div className="space-y-4">
      <ToggleRow
        label="Disabled"
        description="When on, this node is skipped during execution"
        checked={Boolean(meta.disabled)}
        onChange={(v) => onMetaChange({ disabled: v })}
      />

      <div className="space-y-1">
        <FieldLabel>Notes</FieldLabel>
        <textarea
          value={meta.notes ?? ''}
          onChange={(e) => onMetaChange({ notes: e.target.value })}
          placeholder="Optional note visible on the canvas node"
          rows={3}
          className="w-full px-2.5 py-2 rounded-lg border border-frost bg-void text-[12px] text-near-white placeholder:text-muted-text/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue/30 resize-none"
        />
      </div>

      <div className="border-t border-frost" />

      <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-text">
        Error handling
      </h3>

      <ToggleRow
        label="Continue on fail"
        description="On error, route to error output instead of stopping"
        checked={Boolean(meta.continueOnFail)}
        onChange={(v) => onMetaChange({ continueOnFail: v })}
      />

      <ToggleRow
        label="Retry on fail"
        description="Retry this node if it fails"
        checked={Boolean(meta.retryOnFail)}
        onChange={(v) => onMetaChange({ retryOnFail: v })}
      />

      {meta.retryOnFail && (
        <div className="space-y-1 pl-2">
          <FieldLabel>Retry count</FieldLabel>
          <input
            type="number"
            min={1}
            max={5}
            value={meta.retryCount ?? 1}
            onChange={(e) =>
              onMetaChange({ retryCount: Number(e.target.value) })
            }
            className="w-24 h-8 px-2.5 rounded-lg border border-frost bg-void text-[13px] text-near-white focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue/30"
          />
        </div>
      )}
    </div>
  )
}
