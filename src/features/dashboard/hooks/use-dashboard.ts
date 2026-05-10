import { useDashboardControllerGetOverview } from '#/api/client'
import type { DashboardOverviewResponseDtoRange } from '#/api/model'

export function useDashboardOverview(
  range: DashboardOverviewResponseDtoRange = '7d',
) {
  return useDashboardControllerGetOverview({
    query: {
      staleTime: 60_000,
      refetchOnWindowFocus: true,
      select: (res) => res.data,
      // placeholderData: generateMockDashboardData(range),
    },
  })
}
