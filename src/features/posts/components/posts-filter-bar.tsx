import { useState } from 'react'
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '#/components/ui/combobox'
import type { ComboboxOption } from '#/components/ui/combobox-utils'
import { filterOptionsByLabel } from '#/components/ui/combobox-utils'

interface PostsFilterBarProps {
  platforms: ComboboxOption[]
  statuses: ComboboxOption[]
  ideas: ComboboxOption[]
  selectedPlatform?: string
  selectedStatus?: string
  selectedIdea?: string
  onPlatformChange: (value: string | undefined) => void
  onStatusChange: (value: string | undefined) => void
  onIdeaChange: (value: string | undefined) => void
}

function FilterCombobox({
  options,
  selectedValue,
  onChange,
  placeholder,
  className,
}: {
  options: ComboboxOption[]
  selectedValue?: string
  onChange: (value: string | undefined) => void
  placeholder: string
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const selectedOption = options.find((o) => o.value === selectedValue) ?? null
  const filtered = filterOptionsByLabel(options, inputValue)

  return (
    <Combobox
      multiple={false}
      value={selectedOption}
      onValueChange={(option) => onChange(option?.value)}
      inputValue={inputValue}
      onInputValueChange={setInputValue}
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) {
          setInputValue(selectedOption?.label ?? '')
        }
      }}
      items={filtered}
      itemToStringLabel={(item) => item.label}
      isItemEqualToValue={(item, value) => item?.value === value?.value}
    >
      <ComboboxInput
        className={className}
        placeholder={placeholder}
        showClear
      />
      <ComboboxContent>
        <ComboboxList>
          <ComboboxCollection>
            {(item) => <ComboboxItem value={item}>{item.label}</ComboboxItem>}
          </ComboboxCollection>
          <ComboboxEmpty>No results found</ComboboxEmpty>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

export default function PostsFilterBar({
  platforms,
  statuses,
  ideas,
  selectedPlatform,
  selectedStatus,
  selectedIdea,
  onPlatformChange,
  onStatusChange,
  onIdeaChange,
}: PostsFilterBarProps) {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <FilterCombobox
        options={platforms}
        selectedValue={selectedPlatform}
        onChange={onPlatformChange}
        placeholder="Tất cả nền tảng"
        className="w-full"
      />
      <FilterCombobox
        options={statuses}
        selectedValue={selectedStatus}
        onChange={onStatusChange}
        placeholder="Tất cả trạng thái"
        className="w-full"
      />
      <FilterCombobox
        options={ideas}
        selectedValue={selectedIdea}
        onChange={onIdeaChange}
        placeholder="Tất cả ý tưởng"
        className="w-full sm:col-span-2 lg:col-span-1"
      />
    </div>
  )
}
