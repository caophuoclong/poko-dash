'use client'

import * as React from 'react'
import { Loader2Icon, PlusIcon } from 'lucide-react'

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'

const CREATE_SENTINEL = '__autocomplete_create__'

type MaybePromise<T> = T | Promise<T>

export type AutocompleteOption<TValue = string> = {
  label: string
  value: TValue
  disabled?: boolean
}

type AutocompleteValueInput<TValue> = AutocompleteOption<TValue> | TValue

type AutocompleteGetData<TRaw> = (query: string) => MaybePromise<TRaw[]>
type AutocompleteGetOptions<TRaw, TValue> = (
  data: TRaw[],
  query: string,
) => AutocompleteOption<TValue>[]

type BaseAutocompleteProps<TRaw, TValue> = {
  options?: Array<AutocompleteOption<TValue> | TValue>
  getData?: AutocompleteGetData<TRaw>
  getOptions?: AutocompleteGetOptions<TRaw, TValue>
  filterOptions?: (
    options: AutocompleteOption<TValue>[],
    query: string,
  ) => AutocompleteOption<TValue>[]
  allowCreate?: boolean
  createLabel?: (input: string) => string
  createOption?: (
    input: string,
  ) => MaybePromise<AutocompleteOption<TValue> | null | undefined>
  onCreateOption?: (option: AutocompleteOption<TValue>) => void
  placeholder?: string
  emptyText?: string
  loadingText?: string
  disabled?: boolean
  className?: string
  contentClassName?: string
  limitTags?: number
  sortSelectedFirst?: boolean
  truncateChipLabel?: boolean
  emitValue?: 'auto' | 'raw' | 'option'
}

type SingleAutocompleteRawProps<TRaw, TValue> = BaseAutocompleteProps<
  TRaw,
  TValue
> & {
  multiple?: false
  value?: TValue | null
  defaultValue?: TValue | null
  onChange?: (value: TValue | null) => void
}

type SingleAutocompleteOptionProps<TRaw, TValue> = BaseAutocompleteProps<
  TRaw,
  TValue
> & {
  multiple?: false
  value?: AutocompleteOption<TValue> | null
  defaultValue?: AutocompleteOption<TValue> | null
  onChange?: (value: AutocompleteOption<TValue> | null) => void
}

type MultiAutocompleteRawProps<TRaw, TValue> = BaseAutocompleteProps<
  TRaw,
  TValue
> & {
  multiple: true
  value?: TValue[]
  defaultValue?: TValue[]
  onChange?: (value: TValue[]) => void
}

type MultiAutocompleteOptionProps<TRaw, TValue> = BaseAutocompleteProps<
  TRaw,
  TValue
> & {
  multiple: true
  value?: AutocompleteOption<TValue>[]
  defaultValue?: AutocompleteOption<TValue>[]
  onChange?: (value: AutocompleteOption<TValue>[]) => void
}

type SingleAutocompleteLooseProps<TRaw, TValue> = BaseAutocompleteProps<
  TRaw,
  TValue
> & {
  multiple?: false
  value?: AutocompleteValueInput<TValue> | null
  defaultValue?: AutocompleteValueInput<TValue> | null
  onChange?: (value: AutocompleteValueInput<TValue> | null) => void
}

type MultiAutocompleteLooseProps<TRaw, TValue> = BaseAutocompleteProps<
  TRaw,
  TValue
> & {
  multiple: true
  value?: AutocompleteValueInput<TValue>[]
  defaultValue?: AutocompleteValueInput<TValue>[]
  onChange?: (value: AutocompleteValueInput<TValue>[]) => void
}

export type AutocompleteProps<
  TRaw = AutocompleteOption<string>,
  TValue = string,
> =
  | SingleAutocompleteRawProps<TRaw, TValue>
  | SingleAutocompleteOptionProps<TRaw, TValue>
  | MultiAutocompleteRawProps<TRaw, TValue>
  | MultiAutocompleteOptionProps<TRaw, TValue>
  | SingleAutocompleteLooseProps<TRaw, TValue>
  | MultiAutocompleteLooseProps<TRaw, TValue>

type InternalOption<TValue> = AutocompleteOption<TValue> & {
  __meta?: {
    kind: 'create'
    input: string
  }
}

function isPromiseLike<T>(value: unknown): value is Promise<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'then' in value &&
    typeof (value as { then?: unknown }).then === 'function'
  )
}

function normalizeOption<TValue>(item: AutocompleteOption<TValue> | TValue) {
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

function isOptionObject<TValue>(
  item: AutocompleteValueInput<TValue> | null | undefined,
): item is AutocompleteOption<TValue> {
  return (
    typeof item === 'object' &&
    item !== null &&
    'label' in item &&
    'value' in item
  )
}

function normalizeSelectionItem<TValue>(
  item: AutocompleteValueInput<TValue>,
  options: AutocompleteOption<TValue>[],
): AutocompleteOption<TValue> {
  if (
    typeof item === 'object' &&
    item !== null &&
    'label' in item &&
    'value' in item
  ) {
    return item
  }

  const matched = options.find((option) => Object.is(option.value, item))
  if (matched) {
    return matched
  }

  return {
    label: String(item),
    value: item,
  }
}

function defaultFilter<TValue>(
  options: AutocompleteOption<TValue>[],
  query: string,
) {
  const keyword = query.trim().toLowerCase()
  if (!keyword) {
    return options
  }

  return options.filter((option) =>
    option.label.toLowerCase().includes(keyword),
  )
}

function sameOptionValue<TValue>(
  a: AutocompleteOption<TValue>,
  b: AutocompleteOption<TValue>,
) {
  return Object.is(a.value, b.value)
}

function hasOptionLabel<TValue>(
  options: AutocompleteOption<TValue>[],
  label: string,
) {
  const normalized = label.trim().toLowerCase()
  return options.some(
    (option) => option.label.trim().toLowerCase() === normalized,
  )
}

function useControllableSelection<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void,
) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const isControlled = value !== undefined
  const current = isControlled ? (value as T) : internalValue

  const setValue = React.useCallback(
    (next: T) => {
      if (!isControlled) {
        setInternalValue(next)
      }
      onChange?.(next)
    },
    [isControlled, onChange],
  )

  return [current, setValue] as const
}

export function Autocomplete<TRaw, TValue>(
  props: SingleAutocompleteRawProps<TRaw, TValue>,
): React.JSX.Element
export function Autocomplete<TRaw, TValue>(
  props: SingleAutocompleteOptionProps<TRaw, TValue>,
): React.JSX.Element
export function Autocomplete<TRaw, TValue>(
  props: MultiAutocompleteRawProps<TRaw, TValue>,
): React.JSX.Element
export function Autocomplete<TRaw, TValue>(
  props: MultiAutocompleteOptionProps<TRaw, TValue>,
): React.JSX.Element
export function Autocomplete<
  TRaw = AutocompleteOption<string>,
  TValue = string,
>(props: AutocompleteProps<TRaw, TValue>) {
  const {
    multiple,
    options,
    getData,
    getOptions,
    filterOptions,
    allowCreate = false,
    createLabel,
    createOption,
    onCreateOption,
    placeholder = 'Search...',
    emptyText = 'No options found',
    loadingText = 'Loading...',
    disabled,
    className,
    contentClassName,
    limitTags,
    sortSelectedFirst = true,
    truncateChipLabel = true,
    emitValue = 'auto',
  } = props

  const [inputValue, setInputValue] = React.useState('')
  const [loadedOptions, setLoadedOptions] = React.useState<
    AutocompleteOption<TValue>[]
  >([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const preventCloseRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  )
  const requestIdRef = React.useRef(0)
  const anchorRef = React.useRef<HTMLDivElement>(null)

  const defaultSelection = (multiple ? [] : null) as
    | AutocompleteOption<TValue>[]
    | AutocompleteOption<TValue>
    | null

  const [selection, setSelection] = useControllableSelection(
    props.value,
    props.defaultValue ?? defaultSelection,
    props.onChange as (
      next:
        | AutocompleteValueInput<TValue>[]
        | AutocompleteValueInput<TValue>
        | null,
    ) => void,
  )

  const emitsRawValue = React.useMemo(() => {
    if (emitValue === 'raw') {
      return true
    }

    if (emitValue === 'option') {
      return false
    }

    if (multiple) {
      const source = props.value ?? props.defaultValue
      if (!Array.isArray(source) || source.length === 0) {
        return false
      }

      return !isOptionObject(source[0])
    }

    const source = props.value ?? props.defaultValue
    if (source === null || source === undefined) {
      return false
    }

    return !isOptionObject(source)
  }, [emitValue, multiple, props.defaultValue, props.value])

  const mapOptionForOutput = React.useCallback(
    (option: AutocompleteOption<TValue> | null) => {
      if (!option) {
        return null
      }

      return emitsRawValue ? option.value : option
    },
    [emitsRawValue],
  )

  const mapOptionsForOutput = React.useCallback(
    (items: AutocompleteOption<TValue>[]) => {
      return emitsRawValue ? items.map((option) => option.value) : items
    },
    [emitsRawValue],
  )

  const fallbackOptions = React.useMemo(
    () => (options ?? []).map((item) => normalizeOption(item)),
    [options],
  )

  const applyClientFilter = React.useCallback(
    (items: AutocompleteOption<TValue>[], query: string) => {
      return (filterOptions ?? defaultFilter)(items, query)
    },
    [filterOptions],
  )

  React.useEffect(() => {
    if (!getData) {
      setLoadedOptions(applyClientFilter(fallbackOptions, inputValue))
      return
    }

    let active = true
    const currentRequestId = ++requestIdRef.current
    const query = inputValue

    setIsLoading(true)

    const result = getData(query)
    const resolveData = isPromiseLike<TRaw[]>(result)
      ? result
      : Promise.resolve(result)

    void resolveData
      .then((data) => {
        if (!active || currentRequestId !== requestIdRef.current) {
          return
        }

        const next = getOptions
          ? getOptions(data, query)
          : (data as unknown as Array<AutocompleteOption<TValue> | TValue>).map(
              (item) => normalizeOption(item),
            )

        setLoadedOptions(next)
      })
      .catch(() => {
        if (!active || currentRequestId !== requestIdRef.current) {
          return
        }

        setLoadedOptions([])
      })
      .finally(() => {
        if (!active || currentRequestId !== requestIdRef.current) {
          return
        }

        setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [applyClientFilter, fallbackOptions, getData, getOptions, inputValue])

  React.useEffect(() => {
    return () => {
      if (preventCloseRef.current) {
        clearTimeout(preventCloseRef.current)
      }
    }
  }, [])

  const normalizedSelection = React.useMemo(() => {
    const availableSelectionOptions = [...loadedOptions, ...fallbackOptions]

    if (Array.isArray(selection)) {
      return selection.map((item) =>
        normalizeSelectionItem(item, availableSelectionOptions),
      )
    }

    if (!selection) {
      return null
    }

    return normalizeSelectionItem(selection, availableSelectionOptions)
  }, [fallbackOptions, loadedOptions, selection])

  // Sync the visible input text with the selected item's label when the
  // dropdown is closed. This handles both initial render with a pre-selected
  // value and controlled-value changes from outside the component.
  React.useEffect(() => {
    if (isOpen || multiple) return
    setInputValue(
      normalizedSelection
        ? (normalizedSelection as AutocompleteOption<TValue>).label
        : '',
    )
  }, [normalizedSelection, isOpen, multiple])

  const createCandidate = React.useMemo<InternalOption<TValue> | null>(() => {
    const next = inputValue.trim()
    if (!allowCreate || !next || hasOptionLabel(loadedOptions, next)) {
      return null
    }

    return {
      label: createLabel ? createLabel(next) : `Create "${next}"`,
      value: CREATE_SENTINEL as TValue,
      __meta: {
        kind: 'create',
        input: next,
      },
    }
  }, [allowCreate, createLabel, inputValue, loadedOptions])

  const sortedOptions = React.useMemo(() => {
    if (!sortSelectedFirst) {
      return loadedOptions
    }

    const availableSelectionOptions = [...loadedOptions, ...fallbackOptions]

    const selectedItems = Array.isArray(selection)
      ? selection.map((item) =>
          normalizeSelectionItem(item, availableSelectionOptions),
        )
      : selection
        ? [normalizeSelectionItem(selection, availableSelectionOptions)]
        : []

    if (selectedItems.length === 0) {
      return loadedOptions
    }

    const selected: AutocompleteOption<TValue>[] = []
    const unselected: AutocompleteOption<TValue>[] = []

    for (const option of loadedOptions) {
      if (selectedItems.some((item) => sameOptionValue(item, option))) {
        selected.push(option)
      } else {
        unselected.push(option)
      }
    }

    return [...selected, ...unselected]
  }, [fallbackOptions, loadedOptions, selection, sortSelectedFirst])

  const renderedOptions = React.useMemo(() => {
    if (!createCandidate) {
      return sortedOptions
    }

    return [createCandidate, ...sortedOptions]
  }, [createCandidate, sortedOptions])

  const finalizeCreate = React.useCallback(
    async (input: string) => {
      const built = createOption
        ? await createOption(input)
        : ({
            label: input,
            value: input as TValue,
          } satisfies AutocompleteOption<TValue>)

      if (!built) {
        return
      }

      setLoadedOptions((prev) => {
        if (prev.some((option) => sameOptionValue(option, built))) {
          return prev
        }

        return [built, ...prev]
      })

      onCreateOption?.(built)

      if (multiple) {
        const current =
          (normalizedSelection as AutocompleteOption<TValue>[]) ?? []
        if (current.some((option) => sameOptionValue(option, built))) {
          return
        }

        setSelection(mapOptionsForOutput([...current, built]))
      } else {
        setSelection(mapOptionForOutput(built))
      }

      setInputValue('')
    },
    [createOption, multiple, normalizedSelection, onCreateOption, setSelection],
  )

  const handleSelectionChange = React.useCallback(
    (
      next:
        | InternalOption<TValue>
        | InternalOption<TValue>[]
        | AutocompleteOption<TValue>
        | AutocompleteOption<TValue>[]
        | null,
    ) => {
      if (multiple) {
        const nextList = (
          Array.isArray(next) ? next : []
        ) as InternalOption<TValue>[]
        const createOptionItem = nextList.find(
          (item) => item.__meta?.kind === 'create',
        )

        if (createOptionItem?.__meta?.input) {
          const withoutCreate = nextList.filter(
            (item) => item.__meta?.kind !== 'create',
          )
          setSelection(mapOptionsForOutput(withoutCreate))
          void finalizeCreate(createOptionItem.__meta.input)
          return
        }

        setSelection(mapOptionsForOutput(nextList))

        // Prevent dropdown from closing for 50ms after selection to handle
        // the onOpenChange callback timing
        if (preventCloseRef.current) {
          clearTimeout(preventCloseRef.current)
        }
        preventCloseRef.current = setTimeout(() => {
          preventCloseRef.current = null
        }, 50)

        return
      }

      const single = next as InternalOption<TValue> | null
      if (single?.__meta?.kind === 'create') {
        setSelection(null)
        void finalizeCreate(single.__meta.input)
        return
      }

      setSelection(mapOptionForOutput(single))
    },
    [
      finalizeCreate,
      mapOptionForOutput,
      mapOptionsForOutput,
      multiple,
      setSelection,
      options,
    ],
  )

  return (
    <Combobox<InternalOption<TValue>, boolean>
      multiple={multiple}
      value={normalizedSelection}
      onValueChange={handleSelectionChange}
      inputValue={inputValue}
      onInputValueChange={setInputValue}
      open={isOpen}
      onOpenChange={(nextOpen) => {
        // In multiple mode, prevent closing immediately after selection
        if (multiple && !nextOpen && preventCloseRef.current) {
          setIsOpen(true)
        } else {
          setIsOpen(nextOpen)
        }
      }}
      items={renderedOptions}
      itemToStringLabel={(item) => item.label}
      isItemEqualToValue={(item, value) => Object.is(item?.value, value?.value)}
      disabled={disabled}
    >
      <div ref={anchorRef}>
        {multiple ? (
          <ComboboxChips className={className}>
            {(() => {
              const items =
                (normalizedSelection as AutocompleteOption<TValue>[]) ?? []
              const displayItems = limitTags ? items.slice(0, limitTags) : items
              const hiddenCount =
                limitTags && items.length > limitTags
                  ? items.length - limitTags
                  : 0

              return (
                <>
                  {displayItems.map((item) => (
                    <ComboboxChip
                      key={`${String(item.value)}-${item.label}`}
                      className="max-w-full"
                    >
                      {truncateChipLabel ? (
                        <span className="min-w-0 truncate" title={item.label}>
                          {item.label}
                        </span>
                      ) : (
                        item.label
                      )}
                    </ComboboxChip>
                  ))}
                  {hiddenCount > 0 && (
                    <div className="inline-flex items-center justify-center gap-1 rounded-sm bg-muted px-1.5 text-xs font-medium text-foreground">
                      +{hiddenCount}
                    </div>
                  )}
                </>
              )
            })()}
            <ComboboxChipsInput placeholder={placeholder} />
          </ComboboxChips>
        ) : (
          <ComboboxInput
            className={className}
            placeholder={placeholder}
            showClear
            disabled={disabled}
          />
        )}
      </div>

      <ComboboxContent className={contentClassName} anchor={anchorRef}>
        <ComboboxList>
          <ComboboxCollection>
            {(item) => (
              <ComboboxItem value={item} disabled={isLoading || item.disabled}>
                {item.__meta?.kind === 'create' ? (
                  <span className="inline-flex items-center gap-2">
                    <PlusIcon className="size-4" />
                    {item.label}
                  </span>
                ) : (
                  item.label
                )}
              </ComboboxItem>
            )}
          </ComboboxCollection>

          {isLoading && (
            <div className="flex items-center gap-2 px-2 py-2 text-sm text-muted-foreground">
              <Loader2Icon className="size-4 animate-spin" />
              {loadingText}
            </div>
          )}

          {!isLoading && <ComboboxEmpty>{emptyText}</ComboboxEmpty>}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
