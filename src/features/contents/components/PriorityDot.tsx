import { cn } from '#/shared/utils'
import { Button } from '@/components/ui/button'
import { useEffect, useRef, useState } from 'react'

export function PriorityDot({
  value = 0,
  onChange,
  disabled = false,
}: {
  value?: number
  onChange: (v: number) => void
  disabled?: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setDraft(value)
  }, [value])
  useEffect(() => {
    if (editing && ref.current) ref.current.focus()
  }, [editing])

  const color =
    value >= 8
      ? 'bg-accent-red'
      : value >= 5
        ? 'bg-accent-yellow'
        : 'bg-accent-green'
  const commit = () => {
    setEditing(false)
    const n = parseInt(String(draft), 10)
    if (!isNaN(n) && n !== value) onChange(n)
  }

  if (editing) {
    return (
      <input
        ref={ref}
        type="number"
        min={1}
        max={10}
        value={draft}
        onChange={(e) => setDraft(Number(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') {
            setDraft(value)
            setEditing(false)
          }
        }}
        className="w-10 bg-void/50 text-sm text-near-white text-center rounded-md px-1 py-0.5 focus:outline-none border border-accent-blue/30"
      />
    )
  }

  return (
    <Button
      variant={'ghost'}
      size="sm"
      disabled={disabled}
      onClick={() => setEditing(true)}
      className="flex items-center gap-1.5 focus:outline-none group disabled:opacity-60"
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', color)} />
      <span className="text-sm text-near-white group-hover:text-accent-orange transition-colors">
        {value}
      </span>
    </Button>
  )
}
