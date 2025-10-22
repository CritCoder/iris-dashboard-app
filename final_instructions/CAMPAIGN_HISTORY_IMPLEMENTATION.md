# Campaign History Page - API Integration

## Overview

The Campaign History page has been fully integrated with the backend API. This document provides a complete guide to the implementation, features, and usage.

## Files Created/Modified

### 1. `/lib/api/campaigns.ts`
**Purpose**: API service layer for all campaign-related operations

**Exports**:
- `getCampaigns()` - Fetch paginated list of campaigns
- `searchCampaigns()` - Search campaigns by query
- `getSearchSuggestions()` - Get autocomplete suggestions
- `deleteCampaign()` - Delete a campaign
- `startMonitoring()` - Start monitoring a campaign
- `stopMonitoring()` - Stop monitoring a campaign

**TypeScript Interfaces**:
- `Campaign` - Campaign data structure
- `CampaignMetrics` - Campaign metrics (posts, engagement, etc.)
- `PaginationInfo` - Pagination metadata
- `CampaignsResponse` - API response structure
- `SearchSuggestion` - Search suggestion structure

### 2. `/app/analysis-history/page.tsx`
**Purpose**: Main Campaign History page component

**Features**:
- Real-time campaign listing with pagination
- Search functionality with debouncing (500ms)
- Filter by monitoring status (All/Active/Inactive)
- Delete campaigns with confirmation
- Start/Stop monitoring with loading states
- Loading and error states
- Responsive design for mobile and desktop

## Key Features

### 1. Search Functionality
- **Debounced Search**: 500ms delay to reduce API calls
- **Full-text Search**: Searches across campaign name, description, and keywords
- **Auto-reset Pagination**: Returns to page 1 when searching
- **Real-time Results**: Updates as you type (after debounce)

### 2. Filtering
- **All**: Shows all campaigns regardless of monitoring status
- **Active**: Shows only actively monitored campaigns
- **Inactive**: Shows only paused/stopped campaigns
- **Auto-refresh**: Refetches data when filter changes

### 3. Pagination
- **Smart Page Numbers**: Shows ellipsis for large page counts
- **Navigation Controls**: Previous/Next buttons with disabled states
- **Page Info**: Shows "Showing X to Y of Z campaigns"
- **Dynamic**: Adapts to total number of campaigns

### 4. Campaign Actions

#### View Campaign
- Click anywhere on a campaign row to view details
- Navigates to `/analysis-history/{campaignId}`

#### Delete Campaign
- Click the trash icon
- Confirmation dialog appears
- Shows loading spinner during deletion
- Refreshes list after successful deletion
- Shows error message if deletion fails

#### Toggle Monitoring
- **Active → Pause**: Stops monitoring
- **Inactive → Start**: Starts monitoring
- Shows loading spinner during operation
- Refreshes list after successful toggle
- Shows error message if operation fails

### 5. Loading States
- **Initial Load**: Shows spinner with "Loading campaigns..."
- **Action Loading**: Individual buttons show spinners
- **Skeleton**: Smooth transitions between states

### 6. Error Handling
- **Network Errors**: Shows error message with retry button
- **API Errors**: Displays specific error message
- **Action Errors**: Shows alert with error details
- **Graceful Degradation**: UI remains functional

## Data Display

### Campaign Metrics
Each campaign displays:
- **Posts**: Total number of posts collected
- **Engagement**: Total engagement (likes, comments, shares)
- **Reach**: Estimated reach
- **Engagement Rate**: Percentage engagement rate
- **Sentiment Score**: Calculated from sentiment distribution

### Sentiment Calculation
```typescript
sentimentScore = (positive * 100) + (neutral * 50) + (negative * 0)
```

### Sentiment Colors
- **Green (70+)**: Positive sentiment
- **Yellow (40-69)**: Neutral sentiment
- **Red (<40)**: Negative sentiment

## API Integration Details

### Authentication
All API requests include the JWT token from localStorage:
```typescript
Authorization: Bearer ${token}
```

### Base URL
Configured via environment variable:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Request Examples

#### Get All Campaigns
```typescript
GET /campaigns?page=1&limit=10&monitored=true
```

#### Search Campaigns
```typescript
GET /campaigns/search?q=brand%20awareness&page=1&limit=10
```

#### Delete Campaign
```typescript
DELETE /campaigns/{id}
```

#### Start Monitoring
```typescript
POST /campaigns/{id}/monitor
Body: { intervalMinutes: 5, notifications: { email: true } }
```

#### Stop Monitoring
```typescript
POST /campaigns/{id}/stop-monitoring
```

## State Management

### Component State
```typescript
const [campaigns, setCampaigns] = useState<Campaign[]>([])
const [pagination, setPagination] = useState<PaginationInfo>({...})
const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all')
const [currentPage, setCurrentPage] = useState(1)
const [searchQuery, setSearchQuery] = useState('')
const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
const [isLoading, setIsLoading] = useState(true)
const [error, setError] = useState<string | null>(null)
```

### Effects
1. **Debounce Search**: 500ms delay before updating search query
2. **Fetch Data**: Triggers when page, search, or filter changes
3. **Reset Page**: Returns to page 1 when searching or filtering

## Performance Optimizations

### 1. Debouncing
- Search input debounced by 500ms
- Reduces API calls while typing

### 2. useCallback
- `fetchCampaigns` wrapped in useCallback
- Prevents unnecessary re-renders

### 3. Conditional Rendering
- Only renders pagination when data exists
- Lazy loads campaign rows

### 4. Optimistic UI
- Shows loading states immediately
- Updates UI after API response

## Responsive Design

### Mobile (< 640px)
- Single column layout
- Horizontal scrolling for metrics
- Stacked buttons
- Compact pagination

### Desktop (≥ 640px)
- Multi-column layout
- Inline metrics
- Side-by-side buttons
- Full pagination controls

## Error Messages

### User-Friendly Messages
- **Network Error**: "Failed to fetch campaigns"
- **Delete Error**: "Failed to delete campaign"
- **Monitoring Error**: "Failed to update monitoring status"
- **Not Found**: "Campaign not found"

### Developer Console
- Full error stack traces logged
- API response details
- Request/response timing

## Testing

### Manual Testing Checklist
- [ ] Load campaigns on page load
- [ ] Search campaigns by name
- [ ] Filter by Active/Inactive
- [ ] Navigate pages
- [ ] Delete campaign
- [ ] Start monitoring
- [ ] Stop monitoring
- [ ] Handle network errors
- [ ] Test on mobile devices
- [ ] Test with slow network

### Test Scenarios

#### Scenario 1: Search and Filter
1. Type "brand" in search box
2. Wait 500ms for debounce
3. Verify results filtered
4. Click "Active" filter
5. Verify only active campaigns shown

#### Scenario 2: Delete Campaign
1. Click trash icon on a campaign
2. Confirm deletion in dialog
3. Verify loading spinner appears
4. Verify campaign removed from list
5. Verify pagination updated

#### Scenario 3: Toggle Monitoring
1. Click "Pause" on active campaign
2. Verify loading spinner appears
3. Verify button changes to "Start"
4. Click "Start" to resume
5. Verify button changes to "Pause"

## Environment Setup

### Required Environment Variables
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## API Response Format

### Successful Response
```json
{
  "data": [
    {
      "id": "camp_123456789",
      "name": "Brand Monitoring Campaign",
      "description": "Monitoring social media mentions",
      "campaignType": "KEYWORD",
      "status": "ACTIVE",
      "monitoringStatus": "ACTIVE",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-20T14:45:00.000Z",
      "metrics": {
        "totalPosts": 1250,
        "totalEngagement": 45000,
        "sentimentDistribution": {
          "positive": 65,
          "neutral": 25,
          "negative": 10
        },
        "topPlatforms": [
          {
            "platform": "TWITTER",
            "count": 750
          }
        ],
        "engagementRate": 3.6,
        "reach": 125000
      }
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Campaign not found",
    "code": "NOT_FOUND"
  }
}
```

## Troubleshooting

### Issue: Campaigns not loading
**Solution**: 
1. Check API URL in environment variables
2. Verify backend server is running
3. Check browser console for errors
4. Verify JWT token in localStorage

### Issue: Search not working
**Solution**:
1. Wait 500ms after typing (debounce delay)
2. Check network tab for API calls
3. Verify search endpoint is accessible

### Issue: Delete not working
**Solution**:
1. Check if campaign is actively monitoring
2. Stop monitoring before deleting
3. Check API response for error details

### Issue: Monitoring toggle not working
**Solution**:
1. Check if campaign exists
2. Verify monitoring endpoint is accessible
3. Check API response for error details

## Future Enhancements

### Planned Features
- [ ] Bulk delete campaigns
- [ ] Export campaign data
- [ ] Advanced filtering (by date, type, etc.)
- [ ] Campaign analytics dashboard
- [ ] Real-time updates via WebSocket
- [ ] Campaign templates
- [ ] Scheduled monitoring

### Performance Improvements
- [ ] Implement virtual scrolling for large lists
- [ ] Add request caching
- [ ] Implement optimistic updates
- [ ] Add service worker for offline support

## Support

For issues or questions:
1. Check this documentation
2. Review API documentation
3. Check browser console for errors
4. Contact development team

## Changelog

### Version 1.0.0 (Current)
- Initial API integration
- Search functionality
- Filter by monitoring status
- Pagination
- Delete campaigns
- Start/Stop monitoring
- Loading and error states
- Responsive design

---

**Last Updated**: January 2024
**Maintained By**: Development Team

