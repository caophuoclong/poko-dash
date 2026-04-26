// layer: logic
import { useState, useMemo } from 'react'

export function useFilteredList<TItem>(
  items: TItem[],
  filters: {
    search?: (item: TItem, term: string) => boolean
    filterMap?: Record<string, (item: TItem, value: unknown) => boolean>
  },
) {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, unknown>>({})

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (searchTerm && filters.search) {
        if (!filters.search(item, searchTerm)) return false
      }

      for (const [key, value] of Object.entries(activeFilters)) {
        if (value && filters.filterMap?.[key]) {
          if (!filters.filterMap[key](item, value)) return false
        }
      }

      return true
    })
  }, [items, searchTerm, activeFilters, filters])

  const clearFilters = () => setActiveFilters({})

  return {
    filteredItems,
    searchTerm,
    setSearchTerm,
    activeFilters,
    setActiveFilters,
    clearFilters,
    hasActiveFilters: Object.values(activeFilters).some((v) => v !== undefined && v !== ''),
  }
}
