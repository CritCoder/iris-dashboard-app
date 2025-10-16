# Start Analysis Page Implementation

This document describes the implementation of the Start Analysis page in the new-fe, following the flow and APIs from the old osint-turbo implementation.

## Overview

The Start Analysis page has been completely rewritten to match the functionality and API flow from the old osint-turbo implementation (`apps/osint-fe/src/app/analysis/page.js`). The new implementation supports three campaign types:

1. **Topic Analysis (GENERAL)** - Search for topics, keywords, and hashtags
2. **Person of Interest (POI)** - Search for specific individuals and their profiles
3. **Post Analysis** - Analyze specific social media posts

## Key Changes Made

### 1. File: `/app/start-analysis/page.tsx`

#### Complete Rewrite
- **Authentication Check**: Added automatic token validation on page load, redirecting to login if no token is found
- **Three Campaign Types**: Added support for Topic, POI, and Post analysis with proper tab navigation
- **Platform Support**: Extended platform list to include YouTube, Reddit, and Threads
- **Date Range Handling**: Implemented flexible date range selection with preset options (24h, 7d, 30d, 3m, 6m, 1y, custom)
- **Post URL Parsing**: Added comprehensive URL parsing for all supported platforms with regex patterns

#### Post ID Extraction
Implemented extraction logic for:
- **Instagram**: `/p/`, `/reel/`, `/tv/` formats
- **Twitter/X**: Both `twitter.com` and `x.com` domains
- **Facebook**: Multiple URL formats (posts, videos, photos, permalinks)
- **YouTube**: Both `youtube.com/watch?v=` and `youtu.be/` formats
- **Reddit**: `/r/subreddit/comments/` format
- **Threads**: `threads.net/t/` format

#### Campaign Creation Flow

##### For GENERAL Campaigns:
1. Validate search query (minimum 3 characters)
2. Validate platform selection
3. Calculate date range
4. Create campaign with `campaignType: 'NORMAL'`
5. Navigate to `/campaign/{campaignId}`

##### For POI Campaigns:
1. Validate username/handle
2. Remove '@' symbol if present
3. Set `campaignType: 'PERSON'`
4. Include personDetails with username, name, and profileId
5. Navigate to `/campaign/{campaignId}`

##### For POST Campaigns:
1. Validate post URL or ID
2. Extract post ID using platform-specific regex
3. Detect platform from URL or use selected platform
4. **Check if campaign already exists** using `checkPostCampaign` API
5. If exists, redirect to existing campaign
6. If not exists, create new campaign with `campaignType: 'POST'`
7. Include platform-specific post ID fields (tweetId, instagramPostId, etc.)
8. **Prefetch original post** to ensure it's available on campaign page
9. Navigate to `/post-campaign/{campaignId}`

### 2. File: `/lib/api.ts`

#### API Endpoint Corrections
Updated the following endpoints to remove `/api` prefix (to match backend expectations):
- **Campaign Search**: `/api/campaigns/campaign-search` → `/campaigns/campaign-search`
- **Check Post Campaign**: `/api/campaigns/check-post` → `/campaigns/check-post`

#### Enhanced Type Definitions
Added comprehensive type support for `createSearch` including:
- **personDetails**: username, name, profileId
- **postDetails**: All platform-specific fields (tweetId, instagramPostId, facebookPostId, youtubeVideoId, redditPostId)

## API Integration

### Endpoints Used

#### 1. Create Campaign Search
```typescript
POST /campaigns/campaign-search

// For GENERAL campaigns
{
  "topic": "climate change",
  "timeRange": {
    "startDate": "2025-01-01T00:00:00.000Z",
    "endDate": "2025-01-31T23:59:59.999Z"
  },
  "platforms": ["twitter", "facebook", "instagram"],
  "campaignType": "NORMAL"
}

// For PERSON campaigns
{
  "topic": "Person: elonmusk",
  "timeRange": { ... },
  "platforms": ["twitter"],
  "campaignType": "PERSON",
  "personDetails": {
    "username": "elonmusk",
    "name": "Elon Musk",
    "profileId": "elonmusk"
  }
}

// For POST campaigns
{
  "topic": "Post Analysis: https://www.instagram.com/p/DKnzCnmtepB/",
  "timeRange": { ... },
  "platforms": ["instagram"],
  "campaignType": "POST",
  "postDetails": {
    "url": "https://www.instagram.com/p/DKnzCnmtepB/",
    "postId": "DKnzCnmtepB",
    "platformPostId": "DKnzCnmtepB",
    "platform": "instagram",
    "instagramPostId": "DKnzCnmtepB"
  }
}
```

#### 2. Check Post Campaign
```typescript
GET /campaigns/check-post?platformPostId=DKnzCnmtepB&platform=instagram

Response:
{
  "success": true,
  "data": {
    "exists": true,
    "campaign": {
      "id": "campaign-uuid-123",
      "name": "Campaign name",
      "status": "ACTIVE",
      "campaignType": "POST"
    }
  }
}
```

#### 3. Get Original Post
```typescript
GET /campaigns/{campaignId}/original-post

Response:
{
  "success": true,
  "data": {
    "id": "post-uuid",
    "content": "Post content...",
    "platform": "instagram",
    "platformPostId": "DKnzCnmtepB",
    ...
  }
}
```

## Platform Support Matrix

### Topic Analysis (GENERAL)
All platforms supported:
- ✅ Facebook
- ✅ Instagram
- ✅ Twitter
- ✅ YouTube
- ✅ Reddit
- ✅ Threads
- ✅ India News

### Person of Interest (POI)
Limited platform support:
- ✅ Facebook
- ✅ Instagram
- ✅ Twitter
- ✅ YouTube
- ✅ Reddit
- ✅ Threads
- ❌ India News

### Post Analysis
Limited platform support:
- ✅ Facebook
- ✅ Instagram
- ✅ Twitter
- ✅ YouTube
- ✅ Reddit
- ✅ Threads
- ❌ India News

## Date Range Handling

### Preset Time Ranges
- **24h**: Last 24 hours
- **7d**: Last 7 days
- **30d**: Last 30 days (default)
- **3m**: Last 3 months
- **6m**: Last 6 months
- **1y**: Last year
- **any**: Any time (defaults to 30 days)
- **custom**: User-selected date range

### Date Calculation
All preset ranges are calculated from the current date/time:
```typescript
const getDateRangeFromTimeOption = (option: string) => {
  const now = new Date()
  const endDate = new Date(now)
  let startDate = new Date(now)
  
  switch (option) {
    case '24h': startDate.setDate(now.getDate() - 1); break
    case '7d': startDate.setDate(now.getDate() - 7); break
    case '30d': startDate.setMonth(now.getMonth() - 1); break
    // ... etc
  }
  
  return { from: startDate, to: endDate }
}
```

## Error Handling

### Validation Errors
- Minimum 3 characters for search queries
- At least one platform must be selected
- Custom date range must have both start and end dates
- Post URL/ID required for post analysis

### API Errors
- Authentication failures redirect to login page
- Network errors show user-friendly messages
- Campaign creation failures display error messages via toast notifications

### Post Campaign Flow
- If `checkPostCampaign` fails, continues with campaign creation (non-blocking)
- If `getOriginalPost` fails during prefetch, continues with navigation (non-blocking)

## Navigation Flow

### After Successful Campaign Creation

#### GENERAL and POI Campaigns
```
Create Campaign → GET /campaigns/{id} → Navigate to /campaign/{id}
```

#### POST Campaigns
```
Check Existing → If exists → Navigate to /post-campaign/{id}
                ↓ If not exists
            Create Campaign → Prefetch Original Post → Navigate to /post-campaign/{id}
```

## UI/UX Features

### Tab Navigation
- Clean three-tab interface with visual indicators
- Dynamic input placeholder and help text based on selected tab
- Platform availability updates based on campaign type

### Platform Selection
- Visual selection with checkmarks
- Color-coded platform badges
- Disabled state for unsupported platforms
- Hover effects for better interactivity

### Time Range Selection
- Grid layout for preset options
- Visual indication of selected range
- Custom date picker integration
- Clear formatting of selected range

### Loading States
- Disabled analyze button during processing
- Animated loading spinner
- Loading text feedback

### Toast Notifications
- Success messages on campaign creation
- Error messages for validation and API failures
- Auto-dismiss with appropriate timing

## Authentication

### Token Management
- Automatic token check on component mount
- Redirect to login if no token found
- Token included in all API requests via `apiClient`
- Token cleared on 401 responses

### Security
- All requests include `Authorization: Bearer {token}` header
- Token stored in localStorage with key `'token'`
- Automatic session cleanup on authentication failures

## Testing Recommendations

### Test Cases to Verify

1. **Topic Analysis**
   - Create campaign with single keyword
   - Create campaign with multiple comma-separated keywords
   - Create campaign with hashtags
   - Verify all platforms can be selected
   - Test various time ranges

2. **POI Analysis**
   - Search with username (with and without @ symbol)
   - Verify India News is disabled
   - Test with various platforms

3. **Post Analysis**
   - Test Instagram post URL (p/, reel/, tv/)
   - Test Twitter URL (twitter.com and x.com)
   - Test Facebook URL (various formats)
   - Test YouTube URL (both formats)
   - Test Reddit URL
   - Test Threads URL
   - Test with just post ID (no URL)
   - Verify existing campaign detection
   - Verify navigation to post-campaign page

4. **Date Range**
   - Test all preset ranges
   - Test custom date range selection
   - Verify date calculations are correct

5. **Error Handling**
   - Test without token (should redirect to login)
   - Test with invalid inputs
   - Test with no platforms selected
   - Test API failures

6. **Platform Filtering**
   - Verify platforms disabled correctly for POI
   - Verify platforms disabled correctly for POST
   - Verify all platforms enabled for GENERAL

## Comparison with Old Implementation

### Similarities
✅ Three campaign types (GENERAL, PERSON, POST)  
✅ Same API endpoints  
✅ Same data structures  
✅ Same post ID extraction logic  
✅ Same platform support matrix  
✅ Check for existing post campaigns  
✅ Prefetch original post for POST campaigns  

### Improvements
🎉 TypeScript implementation with full type safety  
🎉 Modern React hooks and patterns  
🎉 Better error handling with toast notifications  
🎉 Cleaner UI with improved accessibility  
🎉 More intuitive tab-based navigation  
🎉 Better loading states and user feedback  
🎉 Integrated with new-fe component library  

## Dependencies

### External Libraries
- `next/navigation` - Router and navigation
- `@/lib/api` - API client and campaign API
- `@/components/ui/*` - UI component library
- `@/hooks/use-toast` - Toast notification system
- `lucide-react` - Icons
- `react-day-picker` - Date range picker

### Internal Dependencies
- PageLayout component
- PageHeader component
- DateRangePicker component
- Platform icon components (FacebookIcon, InstagramIcon, etc.)

## Environment Variables

Required environment variable:
```
NEXT_PUBLIC_API_URL=https://irisnet.wiredleap.com
```

## Known Limitations

1. **India News Platform**: Only supported for GENERAL campaigns
2. **Single Platform for POST**: While UI allows multiple selections, POST campaigns only use first valid platform
3. **Date Validation**: No validation for future dates (handled by date picker component)
4. **URL Validation**: Basic regex matching, may not catch all edge cases

## Future Enhancements

- [ ] Add support for multiple posts in a single campaign
- [ ] Implement campaign templates for quick setup
- [ ] Add recent search history
- [ ] Implement advanced filters for each campaign type
- [ ] Add campaign scheduling for future execution
- [ ] Implement bulk campaign creation from CSV/file upload

## Conclusion

The Start Analysis page has been successfully implemented to match the functionality and flow of the old osint-turbo implementation while leveraging modern React patterns, TypeScript type safety, and the new-fe component library. The implementation is production-ready and includes comprehensive error handling, authentication, and user feedback mechanisms.

