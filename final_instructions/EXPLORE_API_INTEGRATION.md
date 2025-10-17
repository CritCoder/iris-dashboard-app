# Explore Module API Integration

This document describes the API integration for the Explore module (Entities and Locations pages).

## Overview

The Explore module has been updated to use the correct API endpoints as per the API documentation. Both the Entities and Locations pages now properly integrate with the backend APIs.

## Changes Made

### 1. API Hooks (`hooks/use-api.ts`)

Updated the following hooks to properly handle API responses and parameters:

#### Entity Hooks
- **`useEntities(params)`**: Fetches entities using search or analytics API based on parameters
- **`useEntityAnalytics(params)`**: Fetches entity analytics data
- **`useTopEntities(type, params)`**: Fetches top entities by type
- **`useEntityDetails(id, params)`**: Fetches detailed information about a specific entity

#### Location Hooks
- **`useLocationAnalytics(params)`**: Fetches location analytics data
- **`useTopLocations(params)`**: Fetches top locations using search or top API
- **`useLocationDetails(id, params)`**: Fetches detailed information about a specific location
- **`useMultipleLocationDetails(params)`**: Fetches posts for multiple locations

### 2. Locations Page (`app/locations/page.tsx`)

**API Integration:**
- Uses `useTopLocations()` hook with proper parameters
- Supports search functionality via `q` parameter
- Default time range: 7 days
- Default limit: 50 locations
- Added loading state with spinner
- Falls back to sample data if API fails

**API Endpoints Used:**
- `GET /api/social/locations/top` - Get top locations
- `GET /api/social/locations/search` - Search locations (when query provided)

**Query Parameters:**
```typescript
{
  limit: 50,           // Number of results
  timeRange: '7d',     // Time range (24h, 7d, 30d)
  q?: string          // Search query (optional)
}
```

**Response Structure:**
```typescript
{
  success: boolean,
  data: [
    {
      id: string,
      name: string,
      type: string,
      mentions: number,
      lastSeen: string,
      sentiment?: 'positive' | 'negative' | 'neutral',
      trend?: 'up' | 'down' | 'stable',
      incidents?: number,
      engagement?: number,
      riskLevel?: 'low' | 'medium' | 'high'
    }
  ]
}
```

### 3. Entities Page (`app/entities/page.tsx`)

**API Integration:**
- Uses `useEntities()` hook with proper parameters
- Supports search functionality via `q` parameter
- Supports type filtering (PERSON, ORGANIZATION, TOPIC, LOCATION)
- Supports category filtering (high_impact, trending)
- Default time range: 7 days
- Default limit: 50 entities
- Added loading state with spinner
- Falls back to sample data if API fails

**API Endpoints Used:**
- `GET /api/social/entities/analytics` - Get entity analytics
- `GET /api/social/entities/search` - Search entities (when query provided)

**Query Parameters:**
```typescript
{
  limit: 50,           // Number of results
  timeRange: '7d',     // Time range (24h, 7d, 30d)
  q?: string,         // Search query (optional)
  type?: string,      // Entity type (PERSON, ORGANIZATION, TOPIC, LOCATION)
  category?: string   // Category filter (high_impact, trending)
}
```

**Response Structure:**
```typescript
{
  success: boolean,
  data: [
    {
      id: string,
      name: string,
      type: 'TOPIC' | 'LOCATION' | 'ENTITY' | 'PERSON' | 'ORGANIZATION',
      mentions: number,
      lastSeen: string,
      icon: React.ElementType
    }
  ]
}
```

## API Endpoints Reference

### Entities APIs

#### 1. Get Entity Analytics
```
GET /api/social/entities/analytics
```

**Query Parameters:**
- `type` (optional): Filter by entity type (PERSON, ORGANIZATION, TOPIC)
- `category` (optional): Filter by entity category
- `timeRange` (optional): Filter by time range (24h, 7d, 30d)
- `minMentions` (optional): Minimum number of mentions
- `sortBy` (optional): Sort field (mentions, relevance, lastSeen)
- `sortOrder` (optional): Sort order (asc, desc)

#### 2. Get Top Entities
```
GET /api/social/entities/top/:type
```

**Path Parameters:**
- `type`: Entity type (person, organization, topic)

**Query Parameters:**
- `timeRange` (optional): Time range (24h, 7d, 30d) - Default: 7d
- `limit` (optional): Number of results - Default: 20

#### 3. Search Entities
```
GET /api/social/entities/search
```

**Query Parameters:**
- `q` (required): Search query string
- `type` (optional): Filter by entity type
- `category` (optional): Filter by category
- `limit` (optional): Number of results - Default: 20

#### 4. Get Entity Details
```
GET /api/social/entities/:id
```

**Path Parameters:**
- `id`: Entity ID

**Query Parameters:**
- `page` (optional): Page number - Default: 1
- `limit` (optional): Items per page - Default: 20
- `filter` (optional): Filter posts (latest, top, positive, negative) - Default: latest

### Locations APIs

#### 1. Get Location Analytics
```
GET /api/social/locations/analytics
```

**Query Parameters:**
- `category` (optional): Filter by location category (CITY, STATE, COUNTRY, LANDMARK)
- `timeRange` (optional): Filter by time range (24h, 7d, 30d)
- `minMentions` (optional): Minimum number of mentions
- `sortBy` (optional): Sort field (mentions, relevance, lastSeen)
- `sortOrder` (optional): Sort order (asc, desc)

#### 2. Get Top Locations
```
GET /api/social/locations/top
```

**Query Parameters:**
- `timeRange` (optional): Time range (24h, 7d, 30d) - Default: 7d
- `limit` (optional): Number of results - Default: 20

#### 3. Search Locations
```
GET /api/social/locations/search
```

**Query Parameters:**
- `q` (required): Search query string
- `limit` (optional): Number of results - Default: 20

#### 4. Get Location Details
```
GET /api/social/locations/:id
```

**Path Parameters:**
- `id`: Location ID

**Query Parameters:**
- `page` (optional): Page number - Default: 1
- `limit` (optional): Items per page - Default: 20
- `filter` (optional): Filter posts (latest, top, positive, negative) - Default: latest

#### 5. Get Multiple Location Details
```
GET /api/social/locations/multiple
```

**Query Parameters:**
- `locations` (required): Comma-separated list of location names
- `page` (optional): Page number - Default: 1
- `limit` (optional): Items per page - Default: 20
- `filter` (optional): Filter posts (latest, top, positive, negative) - Default: latest

## Usage Examples

### Example 1: Fetch Top Locations
```typescript
import { useTopLocations } from '@/hooks/use-api'

function LocationsComponent() {
  const { data, loading, error } = useTopLocations({
    limit: 50,
    timeRange: '7d'
  })

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {data?.map(location => (
        <div key={location.id}>{location.name}</div>
      ))}
    </div>
  )
}
```

### Example 2: Search Entities
```typescript
import { useEntities } from '@/hooks/use-api'

function EntitiesComponent() {
  const [searchQuery, setSearchQuery] = useState('')
  
  const { data, loading, error } = useEntities({
    q: searchQuery,
    limit: 50,
    type: 'PERSON'
  })

  return (
    <div>
      <input 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)} 
      />
      {data?.map(entity => (
        <div key={entity.id}>{entity.name}</div>
      ))}
    </div>
  )
}
```

### Example 3: Get Entity Details
```typescript
import { useEntityDetails } from '@/hooks/use-api'

function EntityDetailComponent({ entityId }: { entityId: string }) {
  const { data, loading, error } = useEntityDetails(entityId, {
    page: 1,
    limit: 20,
    filter: 'top'
  })

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1>{data?.entity.name}</h1>
      <p>Total Mentions: {data?.entity.totalMentions}</p>
      {/* Render posts */}
    </div>
  )
}
```

## Error Handling

All API hooks implement graceful error handling:

1. **Network Errors**: Caught and logged to console
2. **API Errors**: Returned in the `error` state
3. **Fallback Data**: Sample data is used when API fails
4. **Loading States**: Proper loading indicators shown

## Authentication

All API requests require authentication using a Bearer token:

```typescript
Authorization: Bearer YOUR_ACCESS_TOKEN
```

The token is automatically retrieved from `localStorage` by the API client.

## Pagination

Pagination is handled differently based on the endpoint:

- **Analytics/Top endpoints**: Return all matching results (no pagination)
- **Details endpoints**: Use offset-based pagination with `page` and `limit` parameters
- **Search endpoints**: Return top N results based on relevance (no pagination)

## Performance Considerations

1. **Debouncing**: Search queries should be debounced to avoid excessive API calls
2. **Caching**: API responses are not cached by default; implement caching if needed
3. **Loading States**: Always show loading indicators for better UX
4. **Error Boundaries**: Wrap components in error boundaries to handle errors gracefully

## Testing

To test the API integration:

1. **Check Network Tab**: Verify API calls are being made with correct parameters
2. **Test Search**: Try different search queries
3. **Test Filters**: Apply different filters and verify results
4. **Test Loading States**: Verify loading indicators appear
5. **Test Error Handling**: Simulate network errors and verify fallback behavior

## Future Enhancements

1. **Infinite Scroll**: Implement infinite scroll for large result sets
2. **Caching**: Add response caching to reduce API calls
3. **Optimistic Updates**: Update UI immediately before API confirmation
4. **Real-time Updates**: Add WebSocket support for real-time data
5. **Advanced Filtering**: Add more filter options (date range, sentiment, etc.)

## Troubleshooting

### Issue: API returns empty results
**Solution**: Check if the API endpoint is correct and parameters are properly formatted

### Issue: Loading state never ends
**Solution**: Check network tab for failed requests and verify API endpoint is accessible

### Issue: Sample data always shows
**Solution**: Check if API is returning data and if the response structure matches expectations

### Issue: Search not working
**Solution**: Verify the `q` parameter is being passed correctly and the search endpoint is implemented

## Support

For API support or questions, please refer to the main API documentation or contact the development team.

