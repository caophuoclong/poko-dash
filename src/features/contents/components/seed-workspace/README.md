# Seed Workspace Design

## Overview

The Seed Workspace transforms the Content Seed detail page from a generic form-driven admin interface into a true operational workspace for content generation.

## Core Mental Model

- **Seed**: A reusable content direction (hook, angles, approach)
- **Products**: Multiple products can be linked to a single seed
- **Generation**: Each product generates unique posts based on the seed
- **Output**: Generated posts are organized and accessible per product

## Components

### 1. SeedHeader

**Purpose**: Navigation, quick actions, and status display

**Features**:

- Back button to return to seeds list
- Seed title (hook) as primary title
- Status badge with color coding
- Quick stats: created date, linked products count, generated posts count
- Quick actions:
  - Approve/Unapprove toggle
  - Generate All button (when approved and products are linked)
  - Save button (with unsaved changes indicator)
  - More menu (duplicate, export, delete)

**States**:

- Draft: Show "Approve" button
- Approved: Show "Unapprove" button, enable generation controls
- Unsaved changes: Show unsaved indicator, enable Save button

### 2. SeedContentForm

**Purpose**: Edit seed content and classification

**Sections**:

- **Seed Content**:
  - Hook (required, primary field)
  - Angles (multi-select autocomplete with custom angle creation)
- **Classification**:
  - Idea Type (dropdown)
  - Platform (dropdown)
  - Category (dropdown)
  - Priority (0-100 slider with visual indicator)

**Design Notes**:

- Clean, form-focused layout
- Visual priority indicator for priority field
- Angles support both predefined and custom values
- Validates on save, not on blur

### 3. SeedProductsWorkspace

**Purpose**: Operational workspace for managing linked products and generating per-product content

**Key Features**:

- Product search and add functionality
- Linked products list with rich product cards
- Per-product actions:
  - View posts (if generated)
  - Generate button (product-level generation)
  - Remove product
- Product card displays:
  - Thumbnail
  - Product name and brand
  - Price information
  - Generation status badge
  - Action buttons

**States**:

- Empty: Show "No products linked" empty state
- Has products: Show product list with actions
- Not approved: Show warning banner explaining approval requirement
- Approved: Enable all generation controls

**Visual Design**:

- Card-based layout for each product
- Status badges with icons
- Hover states for interactive elements
- Disabled states with clear visual feedback

### 4. SeedGenerationWorkspace

**Purpose**: Configure and execute batch generation

**Features**:

- Eligibility status checker (approved + has products)
- Generation mode selector:
  - Standard: Balanced approach
  - Creative: More experimental
  - Performance: Optimized for engagement
- Generate All button
- Explanation of what will happen

**States**:

- Not eligible: Show requirements, disable generation
- Eligible: Show generation modes, enable Generate All
- Generating: Disable controls, show loading state

### 5. SeedOutputsPanel

**Purpose**: Display generated posts organized by product

**Features**:

- Total posts count
- "Output by Product" section (grouped view)
- "Latest Generated" section (chronological view)
- Post cards with:
  - Title
  - Product name
  - Created date (relative + absolute)
  - Status badge
  - View button
- "View All" link to posts page

**States**:

- Empty: Show "No posts generated yet" empty state
- Has posts: Show grouped and latest sections

### 6. SeedMetadataPanel

**Purpose**: Display seed metadata and audit information

**Features**:

- Seed ID (truncated)
- Created date (relative + absolute)
- Updated date (relative + absolute)
- Posts generated count
- Owner (if available)
- Source references (if available)

**Design**:

- Compact, informative layout
- Relative time for human readability
- Absolute time for precision
- Monospace font for IDs

## Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Seed Header (sticky)                                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────┐  ┌──────────────────────┐   │
│  │ Seed Content Form       │  │ Generated Output    │   │
│  │                         │  │                      │   │
│  │ - Hook                 │  │ - By Product         │   │
│  │ - Angles               │  │ - Latest             │   │
│  │ - Classification        │  │ - View All           │   │
│  └─────────────────────────┘  └──────────────────────┘   │
│                                                             │
│  ┌─────────────────────────┐  ┌──────────────────────┐   │
│  │ Linked Products        │  │ Metadata             │   │
│  │ (High Importance)       │  │                      │   │
│  │                         │  │ - ID                 │   │
│  │ - Product Picker       │  │ - Created            │   │
│  │ - Product List         │  │ - Updated            │   │
│  │ - Per-product actions  │  │ - Owner              │   │
│  └─────────────────────────┘  └──────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Generation Workspace                                │   │
│  │                                                     │   │
│  │ - Eligibility status                                │   │
│  │ - Generation modes                                  │   │
│  │ - Generate All                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Interaction Flow

### Adding a Product

1. User searches for products in SeedProductsWorkspace
2. Selects product from autocomplete
3. Product appears in linked products list
4. User can immediately generate posts for that product

### Generating Posts

**Per-product generation**:

1. User clicks "Generate" on a product card
2. Product shows "Generating" status
3. Post is created and appears in SeedOutputsPanel
4. User can view/edit the post

**Batch generation**:

1. User approves seed (if not already)
2. User selects generation mode in SeedGenerationWorkspace
3. User clicks "Generate All"
4. All products show "Generating" status
5. Posts are created for all products
6. Outputs panel updates with new posts

### Editing Seed

1. User modifies hook, angles, or classification
2. Header shows "Unsaved changes" indicator
3. User clicks "Save" or "Generate All" (triggers save first)
4. Changes are saved, indicator disappears

## Design Principles

1. **Operational Feel**: Products workspace and generation controls feel like a dashboard, not a form
2. **Clear Hierarchy**: Seed content → Products → Generation → Outputs
3. **Visual Feedback**: All actions have loading states, disabled states, and success indicators
4. **Progressive Disclosure**: Advanced options (generation modes) appear when relevant
5. **Empty States**: Clear guidance when sections are empty
6. **Accessibility**: Keyboard navigation, clear focus states, semantic HTML

## Color Usage

- **Accent Orange**: Primary actions (Generate, Save)
- **Accent Green**: Approved status, success states
- **Accent Blue**: Draft status, informational elements
- **Accent Yellow**: Queued status, warnings
- **Accent Red**: Error states, destructive actions
- **Muted Text**: Secondary information, metadata
- **Near White**: Primary text, headings

## Responsive Design

- **Desktop**: 3-column layout (content/products/generation | outputs | metadata)
- **Tablet**: 2-column layout (main content | sidebar)
- **Mobile**: Single column stack with collapsible sections

## Future Enhancements

1. **Product Grouping**: Group products by category for easier management
2. **Generation Preview**: Show what content will be generated before confirming
3. **Batch Actions**: Approve multiple products at once
4. **Output Analytics**: Show engagement metrics for generated posts
5. **A/B Testing**: Compare different generation modes
6. **Template System**: Save and reuse seed templates
7. **Collaboration**: Share seeds with team members
