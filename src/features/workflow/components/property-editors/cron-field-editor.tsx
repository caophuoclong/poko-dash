import { useMemo } from 'react'
import cronstrue from 'cronstrue'
import cronParser from 'cron-parser'
import { FieldLabel } from './field-label'
import type { PropertyEditorProps } from './property-editor'

export function CronFieldEditor({
  schema,
  value,
  onChange,
}: PropertyEditorProps) {
  const cronValue = typeof value === 'string' ? value : ''

  const humanReadable = useMemo(() => {
    if (!cronValue.trim()) return ''
    try {
      return cronstrue.toString(cronValue)
    } catch {
      return 'Invalid cron expression'
    }
  }, [cronValue])

  const nextRuns = useMemo(() => {
    if (!cronValue.trim()) return []
    try {
      const interval = parser.parseExpression(cronValue)
      return Array.from({ length: 2 }, () => {
        const next = interval.next()
        return next.toDate()
      })
    } catch {
      return []
    }
  }, [cronValue])

  return (
    <div className="space-y-1">
      <FieldLabel required={schema.required}>{schema.label}</FieldLabel>
      <input
        type="text"
        value={cronValue}
        placeholder={schema.placeholder ?? '0 */6 * * *'}
        onChange={(e) => onChange(schema.key, e.target.value)}
        className="w-full h-8 px-2.5 rounded-lg border border-frost bg-void text-[13px] text-near-white font-mono placeholder:text-muted-text/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue/30"
      />
      {humanReadable && (
        <p className="text-[10px] text-muted-text/70">{humanReadable}</p>
      )}
      {nextRuns.length > 0 && (
        <p className="text-[10px] text-muted-text/50">
          Next:{' '}
          {nextRuns.map((d, i) => (
            <span key={i}>
              {i > 0 && ' · '}
              {d.toLocaleDateString('en-US', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
              })}{' '}
              {d.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })}
            </span>
          ))}
        </p>
      )}
      {schema.helperText && (
        <p className="text-[10px] text-muted-text/70">{schema.helperText}</p>
      )}
    </div>
  )
}
