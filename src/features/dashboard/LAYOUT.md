# Dashboard Layout Structure

```
┌──────────────────────────────────────────────────────────────────┐
│  DASHBOARD                              [7d] [30d] [90d]  [↻]    │
│  Content pipeline overview and operational metrics               │
└──────────────────────────────────────────────────────────────────┘

┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│  Approved   │   Posts     │  Scheduled  │  Published  │ Generation  │   Failed    │
│   Seeds     │  Generated  │  Upcoming   │    Posts    │  Coverage   │    Jobs     │
│             │             │             │             │             │             │
│    45 ↑12% │   128 ↑8%   │     24      │   98 ↑5%    │   87% ↑3%   │   3 ↓2%     │
│vs previous  │vs previous  │ next 7 days │vs previous  │% of approved│   requires  │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  Pipeline status                                                  │
├─────────────┬─────────────┬─────────────┬─────────────┬──────────┤
│ Draft seeds │  Approved,  │Seeds w/     │  Scheduled  │  Failed  │
│             │not generated│  products   │    posts    │generation│
│     12      │      8      │     45      │     24      │    2     │
│             │   [orange]  │   [blue]    │   [green]   │  [red]   │
├─────────────┼─────────────┼─────────────┼─────────────┼──────────┤
│   Failed    │No products  │  No output  │             │          │
│   publish   │   linked    │     yet     │             │          │
│      1      │      5      │     15      │             │          │
│    [red]    │  [yellow]   │             │             │          │
└─────────────┴─────────────┴─────────────┴─────────────┴──────────┘

┌─────────────────────┬─────────────────────┬─────────────────────┐
│  Posts generated    │  Posts published    │  Seeds approved     │
│  Total: 128         │  Total: 98          │  Total: 45          │
│  Avg: 18.3          │  Avg: 14.0          │  Avg: 6.4           │
│                     │                     │                     │
│  ╱╲    ╱╲           │     ╱╲   ╱╲        │    ╱╲               │
│ ╱  ╲  ╱  ╲╱╲        │    ╱  ╲ ╱  ╲       │   ╱  ╲  ╱╲          │
│╱    ╲╱      ╲       │   ╱    ╲    ╲      │  ╱    ╲╱  ╲         │
│              ╲      │  ╱          ╲      │ ╱          ╲        │
└─────────────────────┴─────────────────────┴─────────────────────┘

┌──────────────────────────────────┬──────────────────────────────────┐
│  Attention needed            [3] │  Upcoming schedule               │
├──────────────────────────────────┼──────────────────────────────────┤
│ ⚠ 8 approved seeds w/o products  │ 📅 May 27, 2:00 PM  [Facebook]   │
│   Link products to enable gen    │   Top 5 wireless earbuds...      │
│                              →   │   [pending]                      │
│                                  │                                  │
│ ✕ 2 generation jobs failed       │ 📅 May 27, 5:00 PM  [TikTok]     │
│   Review errors and retry        │   Best budget smartphones...     │
│                              →   │   [queued]                       │
│                                  │                                  │
│ ⚠ 5 seeds with no output (7d)    │ 📅 May 28, 2:00 PM  [Instagram]  │
│   These approved seeds haven't   │   Gaming laptop buying guide     │
│   generated posts                │   [pending]                      │
│                              →   │                                  │
└──────────────────────────────────┴──────────────────────────────────┘

┌─────────────────────┬─────────────────────┬─────────────────────┐
│  Top categories     │  Top platforms      │  Top seeds          │
├─────────────────────┼─────────────────────┼─────────────────────┤
│ Điện tử        45   │ Facebook       58   │ Budget phones   12  │
│ ████████████████    │ ████████████████    │ ████████████████    │
│                     │                     │                     │
│ Phụ kiện       32   │ TikTok         42   │ Earbuds comp    10  │
│ ████████████        │ ████████████        │ █████████████       │
│                     │                     │                     │
│ Gia dụng       28   │ Instagram      28   │ Gaming acc       8  │
│ ███████████         │ ████████            │ ███████████         │
│                     │                     │                     │
│ Thời trang     15   │ Blog           10   │ Smart home       6  │
│ █████               │ ███                 │ ████████            │
│                     │                     │                     │
│ Làm đẹp         8   │ YouTube         2   │ Fitness track    5  │
│ ███                 │ █                   │ ███████             │
└─────────────────────┴─────────────────────┴─────────────────────┘
```

## Section Breakdown

### 1. Header (DashboardHeader)

- Title + subtitle
- Range selector (7d/30d/90d)
- Refresh button

### 2. Summary Cards (SummaryCardGrid)

- 6 cards in responsive grid (2→3→6 columns)
- Each: label, value, delta, helper text
- Minimal, metric-focused

### 3. Pipeline Snapshot (PipelineSnapshot)

- 8 status cards in grid (2→3→4 columns)
- Clickable, color-coded
- Shows current workflow state

### 4. Trend Charts (TrendChartsSection)

- 3 sparkline charts (1→3 columns)
- SVG-based, lightweight
- Shows total + average

### 5. Attention + Schedule (Two-column)

- **Left**: Actionable issues (warnings/errors)
- **Right**: Next 5 scheduled posts
- Side-by-side on desktop, stacked on mobile

### 6. Top Breakdowns (TopBreakdownsSection)

- 3 breakdown widgets (1→3 columns)
- Horizontal bar charts
- Top 5 items per category

## Responsive Breakpoints

- **< 768px (mobile)**: Single column, stacked
- **768px - 1024px (tablet)**: 2-3 columns
- **> 1024px (desktop)**: Full grid (up to 6 columns)

## Color Coding

- **Orange**: Primary accent, approved items
- **Blue**: Secondary accent, scheduled items
- **Green**: Success, published items
- **Red**: Errors, failed items
- **Yellow**: Warnings, attention needed
- **Neutral**: Informational, draft items

## Interactive Elements

- Range selector buttons
- Refresh button
- Pipeline status cards → navigate
- Attention items → navigate
- All use hover states & transitions
