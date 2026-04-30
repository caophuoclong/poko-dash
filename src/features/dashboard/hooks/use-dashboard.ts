import type { DashboardRange } from '#/dtos/dashboard'
import { generateMockDashboardData } from '../utils/mock-dashboard-data'
import {
  useDashboardControllerGetOverview,
} from '#/api/client'

export function useDashboardOverview(range: DashboardRange = '7d') {
  return useDashboardControllerGetOverview({
    query: {
      staleTime: 60_000,
      refetchOnWindowFocus: true,
      select: (res: any) => res.data,
      placeholderData: generateMockDashboardData(range) as any,
    },
  })
}
