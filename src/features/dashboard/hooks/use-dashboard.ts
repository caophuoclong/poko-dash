import { useApiQuery } from '#/shared/hooks/use-api-query'
import type { DashboardRange } from '#/dtos/dashboard'
import { fetchDashboardOverview } from '../api/dashboard-api'
import { generateMockDashboardData } from '../utils/mock-dashboard-data'

export function useDashboardOverview(range: DashboardRange = '7d') {
  return useApiQuery(
    ['dashboard', 'overview', range],
    () => fetchDashboardOverview(range),
    {
      staleTime: 60_000, // 1 minute
      refetchOnWindowFocus: true,
      // Fallback to mock data during development
      fallback: generateMockDashboardData(range),
    },
  )
}
