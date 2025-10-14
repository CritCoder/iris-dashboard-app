# API Quick Reference Guide

## Base URL
```
https://irisnet.wiredleap.com
```

## Authentication
All requests require Bearer token authentication:
```
Authorization: Bearer YOUR_TOKEN
```

---

## Entities APIs

### 1. Get Entity Analytics
```
GET /api/social/entities/analytics
```
**Query Parameters:**
- `type` - Filter by type (PERSON, ORGANIZATION, TOPIC)
- `category` - Filter by category
- `timeRange` - Time range (24h, 7d, 30d)
- `minMentions` - Minimum mentions
- `sortBy` - Sort field (mentions, relevance, lastSeen)
- `sortOrder` - Sort order (asc, desc)

### 2. Get Top Entities
```
GET /api/social/entities/top/:type
```
**Path Parameters:**
- `type` - Entity type (person, organization, topic)

**Query Parameters:**
- `timeRange` - Time range (24h, 7d, 30d)
- `limit` - Number of results

### 3. Search Entities
```
GET /api/social/entities/search
```
**Query Parameters:**
- `q` (required) - Search query
- `type` - Filter by type
- `category` - Filter by category
- `limit` - Number of results

### 4. Get Entity Details
```
GET /api/social/entities/:id
```
**Path Parameters:**
- `id` - Entity ID

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `filter` - Filter posts (latest, top, positive, negative)

---

## Locations APIs

### 1. Get Location Analytics
```
GET /api/social/locations/analytics
```
**Query Parameters:**
- `category` - Filter by category (CITY, STATE, COUNTRY, LANDMARK)
- `timeRange` - Time range (24h, 7d, 30d)
- `minMentions` - Minimum mentions
- `sortBy` - Sort field (mentions, relevance, lastSeen)
- `sortOrder` - Sort order (asc, desc)

### 2. Get Top Locations
```
GET /api/social/locations/top
```
**Query Parameters:**
- `timeRange` - Time range (24h, 7d, 30d)
- `limit` - Number of results

### 3. Search Locations
```
GET /api/social/locations/search
```
**Query Parameters:**
- `q` (required) - Search query
- `limit` - Number of results

### 4. Get Location Details
```
GET /api/social/locations/:id
```
**Path Parameters:**
- `id` - Location ID

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `filter` - Filter posts (latest, top, positive, negative)

### 5. Get Multiple Location Details
```
GET /api/social/locations/multiple
```
**Query Parameters:**
- `locations` (required) - Comma-separated location names
- `page` - Page number
- `limit` - Items per page
- `filter` - Filter posts (latest, top, positive, negative)

---

## Campaign APIs

### 1. Check Post Campaign
```
GET /api/campaigns/check-post
```
**Query Parameters:**
- `postId` - Internal post ID
- `platformPostId` (required) - Platform post ID
- `platform` (required) - Platform name

### 2. Create Campaign Search
```
POST /api/campaigns/campaign-search
```
**Request Body:**
```json
{
  "topic": "string",
  "timeRange": {
    "startDate": "YYYY-MM-DD",
    "endDate": "YYYY-MM-DD"
  },
  "platforms": ["twitter"],
  "campaignType": "POST",
  "postDetails": {
    "originalPostId": "string",
    "postId": "string",
    "platformPostId": "string",
    "url": "string"
  }
}
```

---

## Social Posts APIs

### 1. Get All Posts
```
GET /api/social/posts
```
**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `search` - Search query
- `platform` - Filter by platform
- `sentiment` - Filter by sentiment
- `campaignId` - Filter by campaign
- `timeRange` - Time range (24h, 1w, 1m)
- `startDate` - Start date (YYYY-MM-DD)
- `endDate` - End date (YYYY-MM-DD)
- `min_likesCount` - Minimum likes
- `max_likesCount` - Maximum likes
- `min_commentsCount` - Minimum comments
- `max_commentsCount` - Maximum comments
- `min_sharesCount` - Minimum shares
- `max_sharesCount` - Maximum shares
- `min_viewsCount` - Minimum views
- `max_viewsCount` - Maximum views
- `priority` - Filter by priority
- `reviewStatus` - Filter by review status
- `classification` - Filter by classification
- `relevance` - Filter by relevance
- `riskLevel` - Filter by risk level
- `isFlagged` - Filter flagged posts
- `isResolved` - Filter resolved posts
- `assignedTo` - Filter by assigned user
- `escalatedTo` - Filter by escalated user
- `needsAttention` - Filter posts needing attention

### 2. Get Hourly Posting Data
```
GET /api/social/posts/hourly-data
```

---

## Response Structure

### Success Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasMore": true
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional details"
  }
}
```

---

## HTTP Status Codes

- `200 OK` - Successful request
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Rate Limiting

Check response headers for rate limit information:
- `X-RateLimit-Limit` - Maximum number of requests
- `X-RateLimit-Remaining` - Number of requests remaining
- `X-RateLimit-Reset` - Time when rate limit resets

---

## Common Patterns

### Pagination
```typescript
const params = {
  page: 1,
  limit: 20
}
```

### Time Ranges
```typescript
const timeRanges = ['24h', '7d', '30d']
```

### Sentiment Values
```typescript
const sentiments = ['POSITIVE', 'NEGATIVE', 'NEUTRAL', 'MIXED']
```

### Platforms
```typescript
const platforms = ['twitter', 'facebook', 'instagram', 'youtube', 'reddit']
```

### Entity Types
```typescript
const entityTypes = ['PERSON', 'ORGANIZATION', 'TOPIC', 'LOCATION']
```

### Location Categories
```typescript
const locationCategories = ['CITY', 'STATE', 'COUNTRY', 'LANDMARK']
```

---

## Testing with cURL

### Example: Get Top Locations
```bash
curl -X GET 'https://irisnet.wiredleap.com/api/social/locations/top?timeRange=7d&limit=50' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json'
```

### Example: Search Entities
```bash
curl -X GET 'https://irisnet.wiredleap.com/api/social/entities/search?q=john&type=PERSON&limit=10' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json'
```

### Example: Get Entity Details
```bash
curl -X GET 'https://irisnet.wiredleap.com/api/social/entities/entity_123?page=1&limit=20&filter=top' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json'
```

---

## Notes

1. **Date Formats**: All dates are in ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)
2. **Time Zones**: All timestamps are in UTC
3. **Pagination**: Default page size is 10-20 items depending on the endpoint
4. **Filtering**: Multiple filters can be combined for more specific queries
5. **Search**: Search queries support partial matching and are case-insensitive
6. **Caching**: Response caching may be implemented for frequently accessed data

