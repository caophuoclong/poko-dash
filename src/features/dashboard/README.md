# Dashboard Feature

A comprehensive operational dashboard for the affiliate content workflow app.

## Purpose

The dashboard provides a 5-second operational view of:

- Content pipeline health
- What needs attention
- Upcoming scheduled posts
- Output trends
- Pipeline bottlenecks

## Architecture

```
dashboard/
├── api/
│   └── dashboard-api.ts          # API integration
├── components/
│   ├── DashboardPage.tsx         # Main dashboard component
│   ├── DashboardHeader.tsx       # Header with range selector
│   ├── SummaryCardGrid.tsx       # KPI summary cards
│   ├── PipelineSnapshot.tsx      # Workflow status counts
│   ├── TrendChartsSection.tsx    # Time series charts
│   ├── AttentionList.tsx         # Actionable issues
│   ├── UpcomingScheduleList.tsx  # Scheduled posts
│   ├── TopBreakdownsSection.tsx  # Category/platform/seed breakdowns
│   ├── DashboardSkeleton.tsx     # Loading state
│   └── index.ts                  # Barrel export
├── hooks/
│   └── use-dashboard.ts          # Data fetching hook
└── utils/
    └── mock-dashboard-data.ts    # Mock data for development

../dtos/
└── dashboard.ts                  # TypeScript types
```

## Components

### DashboardPage (Main)

- Orchestrates all dashboard sections
- Handles loading, error, and empty states
- Manages range selection (7d/30d/90d)
- Provides refresh functionality

### DashboardHeader

- Page title and subtitle
- Range selector (7d/30d/90d)
- Refresh button
- Uses existing `PageHeader` component

### SummaryCardGrid

- 6 KPI cards in responsive grid
- Each card shows:
  - Label
  - Main value
  - Delta/trend indicator (optional)
  - Helper text (optional)

### PipelineSnapshot

- 4-8 status cards showing workflow counts
- Clickable cards navigate to relevant pages
- Color-coded badges for severity
- Examples: "Draft seeds", "Approved not generated", "Failed jobs"

### TrendChartsSection

- 3 mini sparkline charts (SVG-based, no dependencies)
- Shows daily trends for:
  - Posts generated
  - Posts published
  - Seeds approved
- Displays total and average values

### AttentionList

- Actionable items requiring user attention
- Severity indicators (warning/error)
- Click-through to relevant pages
- Empty state when all clear

### UpcomingScheduleList

- Next 5 scheduled posts
- Shows time, platform, title, status
- Color-coded platform badges
- Empty state when nothing scheduled

### TopBreakdownsSection

- 3 breakdown widgets:
  - Top categories by generated posts
  - Top platforms by published posts
  - Top seeds by output count
- Horizontal bar charts
- Shows top 5 items

## API Integration

### Endpoint

```
GET /dashboard/overview?range=7d|30d|90d
```

### Response Type

```typescript
DashboardOverviewResponse {
  summaryCards: DashboardSummaryCard[]
  pipelineSnapshot: DashboardPipelineStatus[]
  trendSeries: {
    postsGenerated: DashboardTrendSeries
    postsPublished: DashboardTrendSeries
    seedsApproved: DashboardTrendSeries
  }
  attentionItems: DashboardAttentionItem[]
  upcomingSchedule: DashboardScheduledItem[]
  topBreakdowns: {
    categories: DashboardBreakdownItem[]
    platforms: DashboardBreakdownItem[]
    topSeeds: DashboardBreakdownItem[]
  }
}
```

All types are defined in `/src/dtos/dashboard.ts`

## Design System

The dashboard follows the existing dark-first SaaS design system:

### Colors

- `surface` - Card backgrounds
- `surface-2` - Nested backgrounds
- `near-white` - Primary text
- `muted-text` - Secondary text
- `frost` - Borders
- `accent-orange` - Primary accent
- `accent-blue` - Secondary accent
- `accent-green` - Success
- `accent-red` - Error
- `accent-yellow` - Warning

### Components Used

- `Button`
- `Badge`
- `PageHeader`
- `EmptyState`
- `SectionCard` (could be used for future iterations)

### Spacing

- Consistent gap-3 for grid layouts
- p-4 for card padding
- space-y-6 for main sections

## States

### Loading State

- Shows `DashboardSkeleton` with animated placeholders
- Maintains layout structure during load

### Error State

- Full-page `EmptyState` with retry button
- Icon: alert
- Actionable error message

### Empty State

- Shown when no data exists yet
- Onboarding-oriented messaging
- CTAs to create first seed or add products

### Success State

- Full dashboard with all sections
- Smooth transitions
- Interactive elements

## Development

### Using Mock Data

The dashboard includes mock data for development:

```typescript
import { generateMockDashboardData } from './utils/mock-dashboard-data'

const mockData = generateMockDashboardData('7d')
```

The `useApiQuery` hook automatically falls back to mock data if the API fails, allowing you to preview the dashboard before backend implementation.

### Testing the Dashboard

1. Navigate to `/dash/`
2. The dashboard will load with mock data
3. Try different range selections (7d/30d/90d)
4. Click on interactive elements to test navigation
5. Test refresh functionality

## Backend Implementation

When implementing the backend `/dashboard/overview` endpoint:

1. **Aggregate summary metrics** across the selected time range
2. **Calculate pipeline status** counts from database
3. **Generate trend series** with daily aggregations
4. **Identify attention items** based on business rules:
   - Approved seeds without products
   - Failed generation/publish jobs
   - Seeds with no output after N days
5. **Query upcoming schedule** from scheduler
6. **Compute top breakdowns** with counts and percentages

### Performance Considerations

- Cache dashboard data for 1 minute (already configured in hook)
- Pre-aggregate metrics in background jobs if needed
- Use database indexes on status and date columns
- Consider materialized views for complex aggregations

## Navigation

The dashboard provides click-through navigation to:

- `/dash/content` - Content seeds page (from pipeline cards, attention items)
- `/dash/content/new` - Create new seed (from empty state)
- `/dash/products` - Products page (from empty state)
- `/dash/schedule` - Scheduled posts (from pipeline cards)
- `/dash/posts` - Posts page (from various cards)

Each clickable element uses TanStack Router's `navigate` function for type-safe routing.

## Future Enhancements

Potential improvements (not currently implemented):

- Real-time updates via WebSocket
- Exportable reports
- Custom date range picker
- Drill-down modal views
- Comparison mode (current vs previous period)
- Customizable dashboard widgets
- User-specific preferences
- Mobile-optimized layouts
- Keyboard shortcuts for navigation

## Design Rationale

**Why no heavy chart library?**

- Kept bundle size small
- Simple SVG sparklines are sufficient for overview
- Can upgrade to recharts/visx later if needed

**Why modular components?**

- Easy to test in isolation
- Reusable across different dashboard views
- Clear separation of concerns
- Easier to modify individual sections

**Why 6 summary cards?**

- Balances information density with clarity
- Fits well in responsive grid (2/3/6 columns)
- Covers core KPIs without overwhelming

**Why attention section?**

- Operational dashboards should be actionable
- Surfaces issues that need human intervention
- Reduces time-to-action for problems

**Why limit upcoming schedule to 5?**

- Prevents information overload
- Focus on immediate priorities
- Full schedule available on dedicated page
