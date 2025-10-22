# Entity Posts Feature Implementation

## Overview
Implemented entity detail view functionality that shows related posts when clicking on entity cards, similar to the osint-turbo behavior.

## Changes Made

### 1. Created EntityDetailView Component
**File:** `/components/entities/entity-detail-view.tsx`

Features:
- Displays entity information (name, type, category, mentions, last seen)
- Shows related posts filtered by entity name
- Filter tabs for Latest, Positive, and Negative posts
- Back button to return to entity grid
- Responsive post cards with:
  - Author information
  - Platform indicator
  - Post content (truncated to 4 lines)
  - Engagement metrics (likes, comments, shares, views)
  - Sentiment badges
  - Links to full post analysis

### 2. Updated Entities Page
**File:** `/app/entities/page.tsx`

Changes:
- Modified `handleEntityClick` to show entity detail view instead of navigating away
- Added `selectedEntity` state to track which entity is being viewed
- Added `handleBackToGrid` function to return to entity grid
- Conditional rendering: shows EntityDetailView when entity is selected, otherwise shows grid

### 3. EntityCard Component
**File:** `/app/entities/page.tsx` (inline component)

- Already correctly implemented with onClick handler
- No routing logic, just calls the onClick prop
- Shows "Click to explore posts" hint

## User Flow

1. User browses entities in the grid view
2. User clicks on an entity card
3. Entity detail view appears showing:
   - Entity header with type, category, mentions, and risk level
   - Filter tabs (Latest, Positive, Negative)
   - Grid of related posts
4. User can click on posts to view full analysis
5. User clicks "Back" button to return to entity grid

## API Integration

The EntityDetailView component uses:
- `api.social.getPosts()` to fetch posts related to the entity
- Search parameter: entity name
- Optional sentiment filter based on selected tab
- Pagination support (20 posts per page)

## Benefits

1. **Better UX**: Users can explore entity-related posts without losing context
2. **Consistent with osint-turbo**: Maintains familiar behavior from the original app
3. **Efficient**: No page navigation, faster loading
4. **Flexible**: Easy to add more filters or features in the future

## Testing

To test the feature:
1. Navigate to `/entities` page
2. Click on any entity card
3. Verify entity detail view appears with posts
4. Try different filter tabs (Latest, Positive, Negative)
5. Click "Back" to return to grid
6. Click on a post to verify navigation to analysis page

