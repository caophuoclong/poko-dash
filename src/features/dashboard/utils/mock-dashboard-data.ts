import type { DashboardOverviewResponse } from '#/dtos/dashboard'
import { subDays, format } from 'date-fns'

/**
 * Mock dashboard data for development/testing
 * Remove this once the backend API is implemented
 */
export function generateMockDashboardData(
  range: '7d' | '30d' | '90d',
): DashboardOverviewResponse {
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90

  // Generate trend data
  const generateTrendData = (baseValue: number, variance: number) => {
    return Array.from({ length: days }, (_, i) => ({
      date: format(subDays(new Date(), days - i - 1), 'yyyy-MM-dd'),
      value: Math.max(
        0,
        Math.floor(baseValue + Math.random() * variance - variance / 2),
      ),
    }))
  }

  const postsGeneratedData = generateTrendData(15, 10)
  const postsPublishedData = generateTrendData(10, 8)
  const seedsApprovedData = generateTrendData(5, 4)

  const totalPostsGenerated = postsGeneratedData.reduce(
    (sum, d) => sum + d.value,
    0,
  )
  const totalPostsPublished = postsPublishedData.reduce(
    (sum, d) => sum + d.value,
    0,
  )
  const totalSeedsApproved = seedsApprovedData.reduce(
    (sum, d) => sum + d.value,
    0,
  )

  return {
    summaryCards: [
      {
        label: 'Approved seeds',
        value: totalSeedsApproved,
        delta: { value: 12, isPositive: true },
        helper: 'vs previous period',
      },
      {
        label: 'Posts generated',
        value: totalPostsGenerated,
        delta: { value: 8, isPositive: true },
        helper: 'vs previous period',
      },
      {
        label: 'Scheduled upcoming',
        value: 24,
        helper: 'next 7 days',
      },
      {
        label: 'Published posts',
        value: totalPostsPublished,
        delta: { value: 5, isPositive: true },
        helper: 'vs previous period',
      },
      {
        label: 'Generation coverage',
        value: 87,
        delta: { value: 3, isPositive: true },
        helper: '% of approved seeds',
      },
      {
        label: 'Failed jobs',
        value: 3,
        delta: { value: 2, isPositive: false },
        helper: 'requires attention',
      },
    ],
    pipelineSnapshot: [
      {
        label: 'Draft seeds',
        count: 12,
        tone: 'neutral',
        action: { label: 'View', path: '/dash/content' },
      },
      {
        label: 'Approved, not generated',
        count: 8,
        tone: 'orange',
        action: { label: 'Generate', path: '/dash/content' },
      },
      {
        label: 'Seeds with products',
        count: 45,
        tone: 'blue',
      },
      {
        label: 'Scheduled posts',
        count: 24,
        tone: 'green',
        action: { label: 'View', path: '/dash/schedule' },
      },
      {
        label: 'Failed generation',
        count: 2,
        tone: 'red',
        action: { label: 'Review', path: '/dash/content' },
      },
      {
        label: 'Failed publish',
        count: 1,
        tone: 'red',
        action: { label: 'Review', path: '/dash/schedule' },
      },
      {
        label: 'No products linked',
        count: 5,
        tone: 'yellow',
        action: { label: 'Link', path: '/dash/content' },
      },
      {
        label: 'No output yet',
        count: 15,
        tone: 'neutral',
      },
    ],
    trendSeries: {
      postsGenerated: {
        label: 'Posts generated',
        data: postsGeneratedData,
      },
      postsPublished: {
        label: 'Posts published',
        data: postsPublishedData,
      },
      seedsApproved: {
        label: 'Seeds approved',
        data: seedsApprovedData,
      },
    },
    attentionItems: [
      {
        id: '1',
        title: '8 approved seeds without products',
        description: 'Link products to enable content generation',
        severity: 'warning',
        action: {
          label: 'Link products',
          path: '/dash/content',
        },
      },
      {
        id: '2',
        title: '2 generation jobs failed',
        description: 'Review errors and retry generation',
        severity: 'error',
        action: {
          label: 'View errors',
          path: '/dash/content',
        },
      },
      {
        id: '3',
        title: '5 seeds with no output after 7 days',
        description: "These approved seeds haven't generated any posts",
        severity: 'warning',
        action: {
          label: 'Review seeds',
          path: '/dash/content',
        },
      },
    ],
    upcomingSchedule: [
      {
        id: '1',
        scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        platform: 'Facebook',
        title: 'Top 5 wireless earbuds under $50',
        status: 'pending',
      },
      {
        id: '2',
        scheduledAt: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
        platform: 'TikTok',
        title: 'Best budget smartphones 2024',
        status: 'queued',
      },
      {
        id: '3',
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        platform: 'Instagram',
        title: 'Gaming laptop buying guide',
        status: 'pending',
      },
      {
        id: '4',
        scheduledAt: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(),
        platform: 'Facebook',
        title: 'Smart home devices comparison',
        status: 'pending',
      },
      {
        id: '5',
        scheduledAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        platform: 'Blog',
        title: 'Fitness tracker roundup',
        status: 'pending',
      },
    ],
    topBreakdowns: {
      categories: [
        { label: 'Điện tử', value: 45, percentage: 35 },
        { label: 'Phụ kiện', value: 32, percentage: 25 },
        { label: 'Gia dụng', value: 28, percentage: 22 },
        { label: 'Thời trang', value: 15, percentage: 12 },
        { label: 'Làm đẹp', value: 8, percentage: 6 },
      ],
      platforms: [
        { label: 'Facebook', value: 58, percentage: 42 },
        { label: 'TikTok', value: 42, percentage: 30 },
        { label: 'Instagram', value: 28, percentage: 20 },
        { label: 'Blog', value: 10, percentage: 7 },
        { label: 'YouTube', value: 2, percentage: 1 },
      ],
      topSeeds: [
        { label: 'Best budget smartphones', value: 12, percentage: 15 },
        { label: 'Wireless earbuds comparison', value: 10, percentage: 12 },
        { label: 'Gaming accessories roundup', value: 8, percentage: 10 },
        { label: 'Smart home deals', value: 6, percentage: 8 },
        { label: 'Fitness tracker review', value: 5, percentage: 6 },
      ],
    },
  }
}
