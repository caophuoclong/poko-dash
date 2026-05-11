import * as React from 'react'

export type ComboboxOption<TValue = string> = {
  label: string
  value: TValue
  disabled?: boolean
}

export type CreateCandidate<TValue = string> = ComboboxOption<TValue> & {
  __meta: {
    kind: 'create'
    input: string
  }
}

export const CREATE_SENTINEL = '__combobox_create__'

export function normalizeOption<TValue>(
  item: ComboboxOption<TValue> | TValue,
): ComboboxOption<TValue> {
  if (
    typeof item === 'object' &&
    item !== null &&
    'label' in item &&
    'value' in item
  ) {
    return item
  }

  return {
    label: String(item),
    value: item,
  }
}

export function filterOptionsByLabel<TValue>(
  options: ComboboxOption<TValue>[],
  query: string,
): ComboboxOption<TValue>[] {
  const keyword = query.trim().toLowerCase()
  if (!keyword) return options

  return options.filter((option) =>
    option.label.toLowerCase().includes(keyword),
  )
}

export function sortSelectedFirst<TValue>(
  options: ComboboxOption<TValue>[],
  selected: ComboboxOption<TValue>[],
): ComboboxOption<TValue>[] {
  if (selected.length === 0) return options

  const selectedItems: ComboboxOption<TValue>[] = []
  const unselected: ComboboxOption<TValue>[] = []

  for (const option of options) {
    if (selected.some((item) => Object.is(item.value, option.value))) {
      selectedItems.push(option)
    } else {
      unselected.push(option)
    }
  }

  return [...selectedItems, ...unselected]
}

export function hasOptionLabel<TValue>(
  options: ComboboxOption<TValue>[],
  label: string,
): boolean {
  const normalized = label.trim().toLowerCase()
  return options.some(
    (option) => option.label.trim().toLowerCase() === normalized,
  )
}

export function buildCreateCandidate<TValue>(
  inputValue: string,
  options: ComboboxOption<TValue>[],
  createLabel?: (input: string) => string,
): CreateCandidate<TValue> | null {
  const trimmed = inputValue.trim()
  if (!trimmed || hasOptionLabel(options, trimmed)) return null

  return {
    label: createLabel ? createLabel(trimmed) : `Create "${trimmed}"`,
    value: CREATE_SENTINEL as TValue,
    disabled: false,
    __meta: { kind: 'create', input: trimmed },
  }
}

export function isCreateCandidate<TValue>(
  item: ComboboxOption<TValue> | CreateCandidate<TValue> | null,
): item is CreateCandidate<TValue> {
  return (
    item !== null &&
    '__meta' in item &&
    (item).__meta?.kind === 'create'
  )
}

export function toRawValues<TValue>(
  options: ComboboxOption<TValue>[],
): TValue[] {
  return options.map((o) => o.value)
}

export function findOptionByValue<TValue>(
  options: ComboboxOption<TValue>[],
  value: TValue,
): ComboboxOption<TValue> | undefined {
  return options.find((o) => Object.is(o.value, value))
}

export function useComboboxCreate<TValue>(
  options: ComboboxOption<TValue>[],
  setOptions: React.Dispatch<React.SetStateAction<ComboboxOption<TValue>[]>>,
  onCreateOption?: (option: ComboboxOption<TValue>) => void,
) {
  const finalizeCreate = React.useCallback(
    (input: string) => {
      const built: ComboboxOption<TValue> = {
        label: input,
        value: input as TValue,
      }

      setOptions((prev) => {
        if (prev.some((o) => Object.is(o.value, built.value))) return prev
        return [built, ...prev]
      })

      onCreateOption?.(built)
      return built
    },
    [setOptions, onCreateOption],
  )

  return finalizeCreate
}
