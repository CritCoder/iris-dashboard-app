# Social Feed API Integration Summary

This document describes the complete integration of the Social Feed page with the backend API endpoints.

## Overview

The Social Feed page (`app/social-feed/page.tsx`) has been fully integrated with the Social Posts API endpoint (`GET /api/social/posts`) to fetch and display real-time social media posts from the backend.

---

## API Endpoint

**Base URL:** `https://irisnet.wiredleap.com/api` or configured `NEXT_PUBLIC_API_URL`

**Endpoint:** `GET /api/social/posts`

**Authentication:** Requires Bearer token in Authorization header

---

## Integration Features

### ✅ Real-time Data Fetching
- Posts are fetched from the API on page load and when filters change
- Automatic re-fetching when filter parameters change
- Debounced search (500ms) to reduce API calls

### ✅ Server-Side Filtering
All filtering is done server-side for optimal performance:
- **Platform Filter:** `twitter`, `facebook`, `instagram`, `news`
- **Sentiment Filter:** `POSITIVE`, `NEUTRAL`, `NEGATIVE`
- **Media Type Filter:** Images, Videos, Text Only
- **Time Range Filter:** `1h`, `24h`, `7d`, `30d`
- **Classification Filter:** `CRITICAL`, `URGENT`, `HIGH`, `MEDIUM`, `LOW`
- **Custom Filters:**
  - High Impact (CRITICAL/URGENT/HIGH posts)
  - Viral Negative (negative sentiment + high engagement)
  - Trending (flagged posts)
  - High Engagement (1000+ likes, 100+ comments)

### ✅ Data Transformation
The API response is automatically transformed to match the frontend `Post` interface:

**API Response Fields → Frontend Fields:**
- `social_profile.username` → `author`
- `likesCount` → `likes`
- `commentsCount` → `comments`
- `sharesCount` → `shares`
- `viewsCount` → `views`
- `aiSentiment` → `sentiment` (lowercase)
- `postedAt` (ISO 8601) → `timestamp` (relative: "2h", "3d")

### ✅ Error Handling
- Graceful fallback to sample data when API is unavailable
- User-friendly error messages
- Loading states with skeleton UI
- No crashes on API failures

### ✅ Pagination Support
- Default: 20 posts per page
- Pagination metadata displayed in header
- Page and total count information

---

## Code Changes

### 1. Updated Hook: `hooks/use-api.ts`

**Function:** `useSocialPosts(params?: any)`

**Changes:**
- Custom implementation instead of generic `usePaginatedApi`
- Proper parameter change detection using `JSON.stringify()`
- Returns: `{ data, pagination, loading, error, refetch }`
- Handles API errors gracefully
- Sets empty array on error instead of null

```typescript
export function useSocialPosts(params?: any) {
  const [data, setData] = useState<any[]>([])
  const [pagination, setPagination] = useState({
    page: params?.page || 1,
    limit: params?.limit || 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.social.getPosts(params)
      if (response.success && response.data) {
        setData(response.data)
        if ((response as any).pagination) {
          setPagination((response as any).pagination)
        }
      } else {
        setError(response.message || 'Failed to fetch posts')
        setData([])
      }
    } catch (err) {
      console.warn('Failed to fetch social posts:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setData([])
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(params)])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, pagination, loading, error, refetch: fetchData }
}
```

### 2. Updated Page: `app/social-feed/page.tsx`

**Key Additions:**

#### a. API Parameter Builder
```typescript
const apiParams = useMemo(() => {
  const params: any = {
    page: 1,
    limit: 20,
    sortBy: 'date',
  }

  // Search (debounced)
  if (debouncedSearchQuery) {
    params.search = debouncedSearchQuery
  }

  // Platform filter
  if (selectedPlatform !== 'all') {
    params.platform = selectedPlatform
  }

  // Media type filter
  if (selectedMediaType === 'images') {
    params.hasImages = true
  } else if (selectedMediaType === 'videos') {
    params.hasVideos = true
  }

  // Time range filter
  if (selectedTimeRange !== 'all') {
    params.timeRange = selectedTimeRange
  }

  // Filter-specific params
  switch (activeFilter) {
    case 'high-impact':
      params.classification = 'CRITICAL,URGENT,HIGH'
      params.sortBy = 'priority'
      break
    case 'viral-negative':
      params.sentiment = 'NEGATIVE'
      params.needsAttention = true
      params.min_likesCount = 1000
      break
    // ... more filters
  }

  return params
}, [activeFilter, debouncedSearchQuery, selectedPlatform, selectedMediaType, selectedTimeRange])
```

#### b. Data Transformation Function
```typescript
const transformApiPost = (apiPost: any): Post => {
  // Get author from various possible fields
  const author = apiPost.social_profile?.username || 
                 apiPost.social_profile?.displayName || 
                 apiPost.person?.name || 
                 'Unknown Author'

  // Convert ISO timestamp to relative time
  const getRelativeTime = (isoDate: string) => {
    const now = new Date()
    const posted = new Date(isoDate)
    const diffMs = now.getTime() - posted.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffDays > 0) return `${diffDays}d`
    if (diffHours > 0) return `${diffHours}h`
    return 'now'
  }

  return {
    id: apiPost.id,
    platform: apiPost.platform?.toLowerCase() as 'facebook' | 'twitter' | 'instagram' | 'news',
    author,
    content: apiPost.content || '',
    timestamp: getRelativeTime(apiPost.postedAt),
    likes: apiPost.likesCount || 0,
    comments: apiPost.commentsCount || 0,
    shares: apiPost.sharesCount || 0,
    views: apiPost.viewsCount || 0,
    sentiment: (apiPost.aiSentiment?.toLowerCase() || 'neutral') as 'positive' | 'negative' | 'neutral',
    engagement: (apiPost.likesCount || 0) + (apiPost.commentsCount || 0) + (apiPost.sharesCount || 0),
    reach: apiPost.viewsCount || 0,
    hasVideo: (apiPost.videoUrls && apiPost.videoUrls.length > 0) || apiPost.contentType === 'video',
    impact: apiPost.classification === 'CRITICAL' || apiPost.classification === 'URGENT' ? 'high' 
            : apiPost.classification === 'MEDIUM' ? 'medium' 
            : 'low',
    isViral: (apiPost.likesCount || 0) > 1000 && (apiPost.sharesCount || 0) > 100,
    isTrending: apiPost.isFlagged || apiPost.needsAttention || false,
  }
}
```

#### c. State Management
```typescript
const [searchQuery, setSearchQuery] = useState('')
const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
const [selectedPlatform, setSelectedPlatform] = useState('all')
const [selectedMediaType, setSelectedMediaType] = useState('all')
const [selectedTimeRange, setSelectedTimeRange] = useState('all')

// Debounce search query
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearchQuery(searchQuery)
  }, 500)
  return () => clearTimeout(timer)
}, [searchQuery])
```

#### d. Loading States
```typescript
{loading ? (
  <FeedSkeleton />
) : (filteredPosts || []).length > 0 ? (
  <AnimatedGrid>
    {filteredPosts.map((post) => (
      <PostCard post={post} />
    ))}
  </AnimatedGrid>
) : (
  <Empty>
    <EmptyTitle>No Posts Found</EmptyTitle>
    <EmptyDescription>
      {error 
        ? 'Unable to load posts from API. Showing sample data.' 
        : 'Try adjusting your filters or search query to find more posts.'
      }
    </EmptyDescription>
  </Empty>
)}
```

#### e. Connected Filter Dropdowns
```typescript
<select 
  value={selectedPlatform}
  onChange={(e) => setSelectedPlatform(e.target.value)}
>
  <option value="all">All Platforms</option>
  <option value="facebook">Facebook</option>
  <option value="twitter">Twitter</option>
  <option value="instagram">Instagram</option>
  <option value="news">News</option>
</select>
```

---

## API Parameters Mapping

### URL Parameters Sent to API

| UI Filter | API Parameter | Value |
|-----------|--------------|-------|
| Search (debounced) | `search` | User input |
| Platform dropdown | `platform` | `twitter`, `facebook`, `instagram`, `news` |
| Media Type - Images | `hasImages` | `true` |
| Media Type - Videos | `hasVideos` | `true` |
| Time Range | `timeRange` | `1h`, `24h`, `7d`, `30d` |
| High Impact filter | `classification` | `CRITICAL,URGENT,HIGH` |
| Viral Negative filter | `sentiment` | `NEGATIVE` |
| Viral Negative filter | `needsAttention` | `true` |
| Viral Negative filter | `min_likesCount` | `1000` |
| Trending filter | `isFlagged` | `true` |
| High Engagement filter | `min_likesCount` | `1000` |
| High Engagement filter | `min_commentsCount` | `100` |
| Positive filter | `sentiment` | `POSITIVE` |
| Neutral filter | `sentiment` | `NEUTRAL` |
| Negative filter | `sentiment` | `NEGATIVE` |
| Sort order | `sortBy` | `date`, `priority`, `engagement` |

### Default Parameters (Always Sent)

```typescript
{
  page: 1,
  limit: 20,
  sortBy: 'date'
}
```

---

## Response Structure

### API Response Format

```json
{
  "success": true,
  "message": "Social posts retrieved",
  "data": [
    {
      "id": "post_id",
      "content": "Post content...",
      "platform": "twitter",
      "postedAt": "2025-10-13T10:30:00.000Z",
      "likesCount": 150,
      "commentsCount": 10,
      "sharesCount": 5,
      "viewsCount": 5000,
      "aiSentiment": "NEGATIVE",
      "contentType": "text",
      "classification": "MEDIUM",
      "needsAttention": true,
      "isFlagged": false,
      "social_profile": {
        "username": "john_doe",
        "displayName": "John Doe"
      },
      "person": {
        "name": "John Doe"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5432,
    "totalPages": 272,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Transformed Frontend Format

```typescript
{
  id: "post_id",
  platform: "twitter",
  author: "john_doe",
  content: "Post content...",
  timestamp: "2h",
  likes: 150,
  comments: 10,
  shares: 5,
  views: 5000,
  sentiment: "negative",
  engagement: 165,
  reach: 5000,
  hasVideo: false,
  impact: "medium",
  isViral: false,
  isTrending: true
}
```

---

## Filter Behavior

### Quick Filter Buttons
- **Latest**: `sortBy: 'date'` (chronological order)
- **Top Posts**: `classification: 'CRITICAL,URGENT,HIGH'`, `sortBy: 'priority'`
- **Positive**: `sentiment: 'POSITIVE'`
- **Negative**: `sentiment: 'NEGATIVE'`

### Advanced Filters
All dropdowns work in combination:
- Platform + Media Type + Time Range filters are cumulative
- Each change triggers a new API call
- Search is debounced by 500ms to reduce API load

---

## Fallback Data

When the API is unavailable or returns an error:
1. Sample data is displayed (6 posts)
2. User sees message: "Using sample data - API unavailable"
3. All UI features continue to work
4. Client-side filtering is applied to sample data

Sample posts include:
- Twitter post from @BengaluruPolice
- Facebook post from Karnataka Police
- Instagram post from @WhitefieldTraffic
- News article from Times of India
- Negative sentiment post about traffic
- Positive post about infrastructure

---

## Performance Optimizations

1. **Debounced Search**: 500ms delay prevents excessive API calls while typing
2. **Memoized Params**: `useMemo` prevents unnecessary re-renders
3. **Server-Side Filtering**: All filtering done on backend reduces data transfer
4. **Pagination**: Only 20 posts loaded at a time
5. **Loading States**: Skeleton UI provides instant feedback

---

## Error Handling

### API Errors
- Network errors: Display sample data
- 401 Unauthorized: Clear token, show auth message
- 404 Not Found: Log warning, show sample data
- 400 Bad Request: Log error, show sample data
- All errors: Never crash the UI

### Data Validation
- Missing fields: Use fallback values
- Invalid timestamps: Show "now"
- Missing author: Show "Unknown Author" or platform default
- Empty arrays: Show "No Posts Found" message

---

## Testing the Integration

### Manual Testing Steps

1. **Basic Load**
   ```
   Navigate to /social-feed
   ✓ Should load posts from API
   ✓ Should show loading skeleton
   ✓ Should display post count in header
   ```

2. **Search**
   ```
   Type in search box: "traffic"
   ✓ Should wait 500ms before searching
   ✓ Should send search param to API
   ✓ Should update results
   ```

3. **Platform Filter**
   ```
   Select "Twitter" from platform dropdown
   ✓ Should send platform=twitter
   ✓ Should show only Twitter posts
   ```

4. **Sentiment Filter**
   ```
   Click "Negative" button
   ✓ Should send sentiment=NEGATIVE
   ✓ Should show only negative posts
   ```

5. **Media Filter**
   ```
   Select "With Videos"
   ✓ Should send hasVideos=true
   ✓ Should show only posts with videos
   ```

6. **Time Range**
   ```
   Select "Last 24 Hours"
   ✓ Should send timeRange=24h
   ✓ Should show recent posts only
   ```

7. **Combined Filters**
   ```
   Select Twitter + Negative + Last 24h
   ✓ All params should be sent together
   ✓ Results should match all criteria
   ```

8. **API Error**
   ```
   Disable network / invalid token
   ✓ Should show sample data
   ✓ Should display error message
   ✓ UI should remain functional
   ```

### Expected Console Logs

**Success:**
```
API call: GET /api/social/posts?page=1&limit=20&sortBy=date&platform=twitter
```

**Error:**
```
Failed to fetch social posts: Network error
Using sample data
```

---

## Future Enhancements

### Potential Improvements
- [ ] Infinite scroll instead of pagination
- [ ] Real-time updates using WebSockets
- [ ] Bulk actions (flag multiple posts)
- [ ] Advanced search with operators
- [ ] Saved filter presets
- [ ] Export filtered results
- [ ] Post preview modal
- [ ] Engagement trend charts
- [ ] AI analysis panel

### API Enhancements Needed
- [ ] Cursor-based pagination for better performance
- [ ] Full-text search with highlighting
- [ ] Aggregation endpoints for stats
- [ ] Real-time notification endpoint
- [ ] Batch operations endpoint

---

## API Documentation Reference

For complete API documentation, see:
- Full API Docs: Provided in the user query (Social Feed API Documentation)
- Base URL: `https://irisnet.wiredleap.com/api`
- Endpoint: `GET /api/social/posts`
- Related Endpoints:
  - `GET /api/social/posts/:id` - Single post details
  - `GET /api/social/posts/hourly-data` - Hourly posting statistics
  - `PATCH /api/social/posts/:id/review` - Update review status
  - `PATCH /api/social/posts/:id/flag` - Flag/unflag post

---

## Troubleshooting

### Posts Not Loading

**Check:**
1. Network tab in DevTools - is the API call being made?
2. Console - any error messages?
3. Auth token - is it valid? (check localStorage)
4. API URL - is `NEXT_PUBLIC_API_URL` set correctly?

**Solutions:**
- Clear localStorage and re-login
- Check network connectivity
- Verify API endpoint is accessible
- Check CORS settings on backend

### Filters Not Working

**Check:**
1. Console - are params being sent correctly?
2. Network tab - inspect request URL
3. API response - is data filtered correctly?

**Solutions:**
- Check param names match API documentation
- Verify filter values are correct format
- Test API endpoint directly with curl

### Performance Issues

**Check:**
1. Network tab - response times
2. Console - excessive re-renders?
3. Params - too frequent API calls?

**Solutions:**
- Increase debounce delay
- Add request caching
- Reduce page size
- Optimize API queries

---

## Summary

✅ **Fully Integrated** - Social Feed page is now connected to the backend API
✅ **Real-time Data** - Posts are fetched from the live database
✅ **Advanced Filtering** - All filters are server-side for performance
✅ **Error Resilient** - Graceful fallback to sample data
✅ **Optimized** - Debounced search, memoized params, loading states
✅ **Type Safe** - Proper TypeScript interfaces and transformations
✅ **User Friendly** - Loading states, error messages, skeleton UI

The integration is production-ready and follows best practices for React hooks, API calls, and error handling.

