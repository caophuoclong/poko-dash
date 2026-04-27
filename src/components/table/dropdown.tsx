import type { ReactNode } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface DropdownOption<T extends string> {
  value: T
  label: string
  [key: string]: unknown
}

interface DropdownProps<T extends string> {
  value: T
  options: DropdownOption<T>[]
  onChange: (v: T) => void
  renderTrigger: (current: DropdownOption<T>) => ReactNode
  renderOption?: (opt: DropdownOption<T>, isSelected: boolean) => ReactNode
  disabled?: boolean
}

export function Dropdown<T extends string>({
  value,
  options,
  onChange,
  renderTrigger,
  renderOption,
  disabled = false,
}: DropdownProps<T>) {
  const current = options.find((o) => o.value === value)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <button type="button" className="focus:outline-none">
          {renderTrigger(current || { value, label: value })}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={4}
        className="z-9999 bg-surface border-frost rounded-lg py-1 shadow-2xl min-w-35 max-h-60"
      >
        {options.map((o) => {
          const isSelected = o.value === value

          return (
            <DropdownMenuItem
              key={o.value}
              onSelect={() => onChange(o.value)}
              className={
                isSelected
                  ? 'text-accent-orange bg-accent-orange-dim'
                  : 'text-near-white hover:bg-surface-2'
              }
            >
              {renderOption ? renderOption(o, isSelected) : o.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
