import type {
  DashboardOverviewResponse,
  DashboardRange,
} from '#/dtos/dashboard'
import { apiRequest } from '#/shared/api'

export function fetchDashboardOverview(
  range: DashboardRange = '7d',
): Promise<DashboardOverviewResponse> {
  return apiRequest<DashboardOverviewResponse>(
    `/dashboard/overview?range=${range}`,
  )
}
