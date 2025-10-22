# API Routes Fix - 404 Campaign Search Issue

## Issue
When attempting to create a campaign via the Start Analysis page, the following error was encountered:

```
campaigns/campaign-search
Request Method: OPTIONS
Status Code: 404 Not Found
```

This was a CORS preflight request (OPTIONS) that was failing because the route didn't exist in the new-fe Next.js API routes.

## Root Cause
The new-fe application was attempting to make direct requests to the backend API, but Next.js API routes were not set up to proxy these requests. The application needed proxy routes to:

1. Handle CORS preflight requests (OPTIONS method)
2. Forward authenticated requests to the backend
3. Properly handle tokens and headers

## Solution
Created two new Next.js API route handlers to proxy requests to the backend:

### 1. Campaign Search Route
**File:** `/app/api/campaigns/campaign-search/route.ts`

This route handles:
- POST requests to create new campaigns (GENERAL, PERSON, POST types)
- OPTIONS requests for CORS preflight
- Token forwarding via Authorization header
- Request/response logging for debugging
- Proper error handling with JSON fallback

**Features:**
- Accepts campaign creation requests with topic, timeRange, platforms, and campaign type
- Forwards requests to `${API_BASE_URL}/campaigns/campaign-search`
- Returns campaign ID on success
- Handles authentication via Bearer token

### 2. Check Post Campaign Route
**File:** `/app/api/campaigns/check-post/route.ts`

This route handles:
- GET requests to check if a post campaign already exists
- OPTIONS requests for CORS preflight
- Query parameter forwarding (postId, platformPostId, platform)
- Token forwarding via Authorization header
- Request/response logging for debugging
- Proper error handling with JSON fallback

**Features:**
- Checks if a campaign exists for a specific post
- Prevents duplicate post campaigns
- Returns existing campaign data if found
- Forwards requests to `${API_BASE_URL}/campaigns/check-post`

## Code Changes

### Created Files

#### `/app/api/campaigns/campaign-search/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  // Proxy POST requests to backend
  // Forwards token, body, and handles errors
}

export async function OPTIONS(request: NextRequest) {
  // Handle CORS preflight
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
```

#### `/app/api/campaigns/check-post/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  // Proxy GET requests to backend
  // Forwards token, query params, and handles errors
}

export async function OPTIONS(request: NextRequest) {
  // Handle CORS preflight
}
```

### Modified Files

#### `/lib/api.ts`
Updated endpoint paths to use the new API proxy routes:

**Before:**
```typescript
createSearch: (data) => apiClient.post('/campaigns/campaign-search', data)
checkPostCampaign: (...) => apiClient.get('/campaigns/check-post', ...)
```

**After:**
```typescript
createSearch: (data) => apiClient.post('/api/campaigns/campaign-search', data)
checkPostCampaign: (...) => apiClient.get('/api/campaigns/check-post', ...)
```

## Benefits

1. **CORS Handling**: OPTIONS requests are now properly handled, preventing CORS errors
2. **Consistent Routing**: All API requests go through Next.js API routes
3. **Better Debugging**: Request/response logging in the proxy routes
4. **Error Handling**: Proper error formatting and status codes
5. **Token Management**: Centralized token forwarding to backend
6. **Type Safety**: Full TypeScript support throughout

## Request Flow

### Before (Direct Backend Call - Failed)
```
Browser → Backend API (/campaigns/campaign-search)
         ↓ 
       404 Not Found (CORS preflight failure)
```

### After (Proxied Through Next.js - Works)
```
Browser → Next.js API Route (/api/campaigns/campaign-search)
         ↓
      Next.js Proxy Route (handles CORS, forwards token)
         ↓
      Backend API (/campaigns/campaign-search)
         ↓
      Success Response
         ↓
      Browser
```

## Testing

### Test Campaign Creation
1. Navigate to `/start-analysis`
2. Select campaign type (Topic, POI, or Post)
3. Enter search criteria
4. Select platforms
5. Choose time range
6. Click "Analyze"

**Expected Result:**
- ✅ No CORS errors
- ✅ Campaign created successfully
- ✅ Redirected to campaign page
- ✅ Console shows proxy logs

### Test Post Campaign Check
1. Navigate to `/start-analysis`
2. Select "Post Analysis" tab
3. Enter a post URL (e.g., Instagram post)
4. Click "Analyze"

**Expected Result:**
- ✅ Check for existing campaign succeeds
- ✅ If campaign exists, redirected to existing campaign
- ✅ If not exists, new campaign created

## Console Logs

The proxy routes include comprehensive logging:

```
Campaign Search - Proxying request to: https://irisnet.wiredleap.com/campaigns/campaign-search
Token present: true
Request body: {
  "topic": "climate change",
  "timeRange": { ... },
  "platforms": ["twitter"],
  "campaignType": "NORMAL"
}
Campaign Search - Response status: 200
Campaign Search - Success: { success: true, data: { campaignId: "..." } }
```

## Environment Variables

Required:
```
NEXT_PUBLIC_API_URL=https://irisnet.wiredleap.com
```

## Related Files

- `/app/start-analysis/page.tsx` - Start Analysis page component
- `/lib/api.ts` - API client and type definitions
- `/app/api/campaigns/route.ts` - Campaigns list route
- `/app/api/campaigns/search/route.ts` - Campaign search route

## Future Enhancements

- [ ] Add rate limiting to proxy routes
- [ ] Implement request caching for check-post endpoint
- [ ] Add more detailed error messages
- [ ] Implement retry logic for failed requests
- [ ] Add request/response transformation if needed

## Conclusion

The 404 error has been resolved by creating proper Next.js API proxy routes that handle CORS preflight requests and forward authenticated requests to the backend API. All campaign creation flows now work correctly through the new-fe application.

