import { Controller } from 'react-hook-form'
import type { Control, Path } from 'react-hook-form'
import { ChevronDown } from 'lucide-react'

interface SelectOption {
  value: string
  label: string
}

interface SelectFieldProps<
  T extends Record<string, any> = Record<string, any>,
> {
  control: Control<T>
  name: keyof T
  label: string
  options: SelectOption[]
}

export default function SelectField<
  T extends Record<string, any> = Record<string, any>,
>({ control, name, label, options }: SelectFieldProps<T>) {
  return (
    <div>
      <label
        htmlFor={name as string}
        className="block text-[11px] font-medium uppercase tracking-wider text-[var(--color-muted)] mb-1.5"
      >
        {label}
      </label>
      <Controller
        name={name as Path<T>}
        control={control}
        render={({ field }) => (
          <div className="relative">
            <select
              id={name as string}
              {...field}
              className="w-full appearance-none bg-[var(--color-surface-2)] border border-[var(--color-hairline)] rounded-[var(--radius-sm)] px-3 py-2 pr-8 text-sm text-[var(--color-ink)] hover:border-[var(--color-frost-hover)] focus:outline-none focus:border-[var(--color-frost-hover)] focus:ring-1 focus:ring-[var(--color-frost-hover)] transition-colors cursor-pointer"
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
            />
          </div>
        )}
      />
    </div>
  )
}
