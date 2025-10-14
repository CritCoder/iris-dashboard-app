# Social Feed API Integration - Quick Start Guide

## 🚀 Quick Overview

The Social Feed page is now fully integrated with the backend API. Posts are fetched in real-time with advanced filtering capabilities.

---

## 📋 What Changed

### Files Modified
1. ✅ `app/social-feed/page.tsx` - Main page component
2. ✅ `hooks/use-api.ts` - Updated `useSocialPosts` hook

### Files Created
1. 📄 `SOCIAL_FEED_API_INTEGRATION.md` - Complete integration documentation
2. 📄 `SOCIAL_FEED_QUICK_START.md` - This quick reference guide

---

## 🔧 How It Works

### API Call Flow

```
User Action → Filter State → API Params → useSocialPosts Hook → API Request → Transform Data → Display
```

### Example Request

```bash
GET /api/social/posts?page=1&limit=20&platform=twitter&sentiment=NEGATIVE&timeRange=24h
```

### Example Response

```json
{
  "success": true,
  "data": [
    {
      "id": "123",
      "content": "Post content...",
      "platform": "twitter",
      "likesCount": 150,
      "social_profile": {
        "username": "john_doe"
      }
    }
  ],
  "pagination": {
    "total": 500,
    "page": 1,
    "totalPages": 25
  }
}
```

---

## 🎯 Key Features

### ✅ Real-time Filtering
- **Platform**: Twitter, Facebook, Instagram, News
- **Sentiment**: Positive, Neutral, Negative
- **Media**: Images, Videos, Text only
- **Time**: Last hour, 24h, 7d, 30d
- **Search**: Debounced text search (500ms)

### ✅ Smart Loading
- Skeleton UI while loading
- Graceful error handling
- Fallback to sample data if API fails
- Loading states for all actions

### ✅ Data Transformation
- API fields mapped to UI format
- ISO timestamps → relative time (2h, 3d)
- Author fallback handling
- Engagement metrics calculation

---

## 🔍 Testing

### Quick Test
1. Open `/social-feed`
2. Check browser console for API call
3. Try changing filters
4. Verify new API calls are made

### Test Filters
```
1. Select Platform: Twitter
   → Should see: ?platform=twitter

2. Click "Negative" button
   → Should see: ?sentiment=NEGATIVE

3. Type in search box
   → Should wait 500ms then search

4. Select "Last 24 Hours"
   → Should see: ?timeRange=24h
```

### Test Error Handling
```
1. Disable network in DevTools
2. Refresh page
3. Should see sample data
4. Should see "API unavailable" message
```

---

## 🛠️ Developer Reference

### Using the Hook

```typescript
import { useSocialPosts } from '@/hooks/use-api'

// In component
const { data, loading, error, pagination } = useSocialPosts({
  page: 1,
  limit: 20,
  platform: 'twitter',
  sentiment: 'NEGATIVE',
  timeRange: '24h'
})
```

### API Parameters

```typescript
interface SocialPostsParams {
  // Pagination
  page?: number
  limit?: number
  
  // Search
  search?: string
  
  // Filters
  platform?: 'twitter' | 'facebook' | 'instagram' | 'news'
  sentiment?: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'
  contentType?: 'text' | 'image' | 'video'
  timeRange?: '30m' | '1h' | '6h' | '12h' | '24h' | '1w' | '1m'
  
  // Media
  hasImages?: boolean
  hasVideos?: boolean
  
  // Engagement
  min_likesCount?: number
  min_commentsCount?: number
  min_sharesCount?: number
  
  // Status
  needsAttention?: boolean
  isFlagged?: boolean
  classification?: string
  
  // Sorting
  sortBy?: 'date' | 'priority' | 'engagement'
}
```

### Response Format

```typescript
interface SocialPostsResponse {
  data: Post[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
  loading: boolean
  error: string | null
  refetch: () => void
}
```

---

## 📊 Filter Mapping

| UI Element | API Parameter | Example Value |
|------------|---------------|---------------|
| Search input | `search` | `"traffic"` |
| Platform dropdown | `platform` | `"twitter"` |
| Sentiment button | `sentiment` | `"NEGATIVE"` |
| Media dropdown | `hasImages` or `hasVideos` | `true` |
| Time dropdown | `timeRange` | `"24h"` |
| High Impact filter | `classification` | `"CRITICAL,URGENT,HIGH"` |
| Trending filter | `isFlagged` | `true` |

---

## 🐛 Troubleshooting

### Problem: Posts not loading
**Solution:**
```
1. Check console for errors
2. Verify auth token in localStorage
3. Check network tab for API call
4. Verify NEXT_PUBLIC_API_URL is set
```

### Problem: Filters not working
**Solution:**
```
1. Check console logs for params
2. Verify param names match API docs
3. Check network tab request URL
```

### Problem: Search not working
**Solution:**
```
1. Wait 500ms after typing (debounce)
2. Check console for search param
3. Verify search query is not empty
```

### Problem: Showing sample data
**Solution:**
```
This is expected when:
- API is unavailable
- Auth token is invalid
- Network error occurs

Check error message in UI for details
```

---

## 🎨 UI Components

### Filter States
```typescript
const [searchQuery, setSearchQuery] = useState('')
const [selectedPlatform, setSelectedPlatform] = useState('all')
const [selectedMediaType, setSelectedMediaType] = useState('all')
const [selectedTimeRange, setSelectedTimeRange] = useState('all')
```

### API Params Builder
```typescript
const apiParams = useMemo(() => {
  const params = {
    page: 1,
    limit: 20,
    sortBy: 'date'
  }
  
  if (debouncedSearchQuery) params.search = debouncedSearchQuery
  if (selectedPlatform !== 'all') params.platform = selectedPlatform
  // ... more filters
  
  return params
}, [debouncedSearchQuery, selectedPlatform, ...])
```

### Data Fetching
```typescript
const { data: apiPosts, loading, error, pagination } = useSocialPosts(apiParams)
```

### Display Logic
```typescript
{loading ? (
  <FeedSkeleton />
) : posts.length > 0 ? (
  <PostGrid posts={posts} />
) : (
  <EmptyState />
)}
```

---

## 📝 Code Examples

### Adding a New Filter

1. **Add state:**
```typescript
const [myFilter, setMyFilter] = useState('all')
```

2. **Add to params:**
```typescript
const apiParams = useMemo(() => {
  const params = { ... }
  
  if (myFilter !== 'all') {
    params.myParam = myFilter
  }
  
  return params
}, [..., myFilter])
```

3. **Add UI control:**
```typescript
<select value={myFilter} onChange={(e) => setMyFilter(e.target.value)}>
  <option value="all">All</option>
  <option value="value1">Option 1</option>
</select>
```

### Custom API Call

```typescript
import { api } from '@/lib/api'

const fetchCustomPosts = async () => {
  const response = await api.social.getPosts({
    platform: 'twitter',
    sentiment: 'NEGATIVE',
    min_likesCount: 1000
  })
  
  if (response.success) {
    console.log('Posts:', response.data)
  }
}
```

---

## 🔐 Authentication

All API calls require authentication:

```typescript
// Token is automatically added by ApiClient
// Stored in localStorage as 'auth_token'

// Manual API call example:
fetch('/api/social/posts', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
  }
})
```

---

## 📚 Related Documentation

- **Complete Integration Guide**: `SOCIAL_FEED_API_INTEGRATION.md`
- **API Documentation**: Provided in initial request
- **API Base URL**: `https://irisnet.wiredleap.com/api`

---

## ✅ Checklist

Use this checklist when working with the Social Feed:

- [ ] API endpoint is accessible
- [ ] Auth token is valid
- [ ] Filter params match API documentation
- [ ] Loading states are visible
- [ ] Error handling works (test by disabling network)
- [ ] Sample data fallback works
- [ ] Search is debounced (not instant)
- [ ] Filters combine correctly
- [ ] Pagination info displays
- [ ] Posts transform correctly

---

## 🚨 Important Notes

1. **Debounced Search**: Search has a 500ms delay - this is intentional
2. **Sample Data**: Always shown when API fails - this is expected behavior
3. **Server-Side Filtering**: All filtering happens on backend, not client
4. **Case Sensitivity**: Sentiment values are UPPERCASE in API (POSITIVE, NEGATIVE, NEUTRAL)
5. **Platform Values**: Lowercase in API (twitter, facebook, instagram, news)

---

## 💡 Pro Tips

1. **Check Network Tab**: Always verify API calls in browser DevTools
2. **Use Console Logs**: Helpful for debugging param changes
3. **Test Error States**: Disable network to see error handling
4. **Monitor Performance**: Check API response times
5. **Sample Data**: Great for development when API is down

---

## 🎓 Learning Resources

### Understanding the Flow
```
User clicks filter
  ↓
State updates (setSelectedPlatform)
  ↓
apiParams memo recalculates
  ↓
useSocialPosts detects param change
  ↓
API request sent
  ↓
Response received
  ↓
Data transformed
  ↓
UI updates
```

### Key React Concepts Used
- `useState` - Filter state management
- `useEffect` - Search debouncing
- `useMemo` - Param optimization
- `useCallback` - API call memoization
- `Suspense` - Loading boundaries

---

## 📞 Need Help?

1. Check `SOCIAL_FEED_API_INTEGRATION.md` for detailed docs
2. Review API documentation from initial request
3. Test with sample data first
4. Verify auth token is valid
5. Check browser console for errors

---

**Last Updated:** October 13, 2025  
**Status:** ✅ Production Ready  
**API Version:** v1  
**Endpoint:** `/api/social/posts`

