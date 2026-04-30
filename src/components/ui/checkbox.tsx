import { cn } from '#/shared/utils'

interface CheckboxProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

function Checkbox({
  checked,
  onCheckedChange,
  disabled,
  className,
}: CheckboxProps) {
  return (
    <button
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'flex size-4 shrink-0 items-center justify-center rounded border transition-colors',
        checked
          ? 'border-accent-blue bg-accent-blue text-white'
          : 'border-frost bg-surface hover:border-accent-blue/30',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      {checked ? (
        <svg
          viewBox="0 0 12 12"
          fill="none"
          className="size-3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M10 3L4.5 8.5L2 6" />
        </svg>
      ) : null}
    </button>
  )
}

export { Checkbox }
