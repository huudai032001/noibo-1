# Error Target Progress Report Module

This module provides a comprehensive report for tracking errors and progress in target achievement across the organization.

## Structure

```
error-target-progress/
├── models/                          # TypeScript interfaces and types
│   └── error-target-progress.model.ts
├── services/                        # API service functions
│   └── error-target-progress.service.ts
├── composables/                     # Vue composition API composables
│   ├── use-error-target-progress-filters.ts   # Filter state management
│   ├── use-error-target-progress-data.ts      # Data fetching and management
│   ├── use-error-target-progress-ui.ts        # UI state management
│   ├── use-error-target-progress-page.ts      # Main page orchestration
│   └── index.ts                              # Composables exports
├── components/                      # Vue components
│   ├── ErrorTargetProgressTable.vue # Main table display
│   └── ErrorCard.vue               # Error summary card
├── constants/                       # Constants and enums
│   └── index.ts
├── ErrorTargetProgressReport.vue    # Main page component
└── index.ts                         # Module exports
```

## Key Features

### Filters
- **Area Selection**: Filter by region (for BOD/Regional Account)
- **Branch Selection**: Filter by office/branch
- **Sale/Staff Selection**: Filter by specific staff member
- **View As**: Choose perspective (Team or Individual)
- **Position Filter**: Filter by job position
- **Error Type Filter**: Filter by error type
- **Goal Type Filter**: Filter by goal type (Day/Week/Month)
- **Date Range Filter**: Filter by date range

### Data Display
- **Error Summary Cards**: Show count of each error type
- **Table View**: Detailed list of errors with all relevant information
- **Pagination**: Navigate through large datasets

### Export
- Export data to Excel/CSV format with current filters applied

## Composables Overview

### useErrorTargetProgressFilters
Manages all filter states and computed properties for filter visibility.

```typescript
const {
  form,                    // Filter form data
  areas, branches,        // Dropdown data
  errorTypes, goalTypes,  // Filter options
  filteredPositions,      // Positions based on user type
  canSelectArea,          // Whether user can select area
  canSelectBranch,        // Whether user can select branch
} = useErrorTargetProgressFilters(currentUserAccountType)
```

### useErrorTargetProgressData
Handles all API calls and data fetching.

```typescript
const {
  loading,
  tableData,
  errorCards,
  pagination,
  fetchReport,            // Fetch error list
  fetchErrorCardsSummary, // Fetch error summary cards
  fetchBranchesList,      // Fetch branches
  fetchAreasList,         // Fetch areas
  goToPage,               // Go to specific page
  refreshData,            // Refresh all data
} = useErrorTargetProgressData(filterForm)
```

### useErrorTargetProgressUI
Manages UI states like modals and fullscreen modes.

### useErrorTargetProgressPage
Main orchestrator that coordinates all other composables.

```typescript
const page = useErrorTargetProgressPage()

// Call on component mount
await page.initializePage()

// Handle user actions
await page.handleAreaChange()
await page.handleBranchChange()
await page.handleFilter()
page.handleExport()
```

## API Endpoints

- `GET /error-target-progress-list` - Fetch error list
- `GET /error-target-progress-total` - Fetch error summary
- `GET /regions-by-user` - Fetch regions
- `GET /branches` - Fetch branches
- `GET /child-users` - Fetch child users
- `GET /export-error-target-progress` - Export data

## Parameter Notes

### API Calls
- Parameters are sent in **snake_case** to backend
- Service automatically converts camelCase to snake_case

### Response Data
- Backend returns data in **camelCase** format
- Models use camelCase for consistency with frontend conventions

## Filter Logic

Visibility of filter controls depends on user's account type:
- **BOD (7)**: Can see area and branch filters
- **Regional Director (6)**: Can see area and branch filters
- **Area Director (5)**: Can see branch filter
- **Branch Director (4)**: Limited to own branch
- **Sales Leader (3)**: Limited to own team

Date range defaults to current month when page loads.

## Date Format

- All date filters use format: `YYYY-MM-DD`
- Date ranges are returned as `[startDate, endDate]` arrays

## Export Functionality

The export function builds a URL with query parameters and opens it in a new window. Parameters are URL-encoded and arrays are converted to `key[]=value` format.
