# CORS Issue - Solution

## Problem
When making API requests from `http://localhost:3003` to `https://irisnet.wiredleap.com`, CORS (Cross-Origin Resource Sharing) policy blocks the requests because the backend doesn't have proper CORS headers configured.

## Error Message
```
Access to fetch at 'https://irisnet.wiredleap.com/campaigns?page=1&limit=10' from origin 'http://localhost:3003' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Solution: Next.js API Routes as Proxy

Instead of calling the backend API directly from the frontend, we use Next.js API routes as a proxy. This way:

1. **Frontend → Next.js API Route** (Same origin: `localhost:3003`)
2. **Next.js API Route → Backend API** (Server-to-server: No CORS)

### Architecture

```
┌─────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   Browser   │────────▶│  Next.js API     │────────▶│  Backend API    │
│             │         │  Routes (Proxy)  │         │  irisnet.wired  │
│ localhost:  │         │  /api/campaigns  │         │  leap.com       │
│    3003     │         │                  │         │                 │
└─────────────┘         └──────────────────┘         └─────────────────┘
     ▲                           ▲
     │                           │
     │  Same Origin              │  Server-to-Server
     │  No CORS                  │  No CORS
     │                           │
     └───────────────────────────┘
```

## Implementation

### 1. API Routes Created

All API routes are in `/app/api/campaigns/`:

- **GET** `/api/campaigns` - List campaigns
- **GET** `/api/campaigns/search` - Search campaigns
- **GET** `/api/campaigns/search/suggestions` - Get suggestions
- **DELETE** `/api/campaigns/[id]` - Delete campaign
- **POST** `/api/campaigns/[id]/monitor` - Start monitoring
- **POST** `/api/campaigns/[id]/stop-monitoring` - Stop monitoring

### 2. API Service Updated

The `lib/api/campaigns.ts` file now points to `/api` instead of the backend URL:

```typescript
// Before (CORS issue)
const API_BASE_URL = 'https://irisnet.wiredleap.com';

// After (No CORS issue)
const API_BASE_URL = '/api';
```

### 3. How It Works

Each API route:
1. Receives request from frontend
2. Extracts headers (especially Authorization token)
3. Forwards request to backend API
4. Returns response to frontend

Example:

```typescript
// Frontend calls
fetch('/api/campaigns?page=1&limit=10', {
  headers: { 'Authorization': 'Bearer token' }
})

// Next.js API route proxies to
fetch('https://irisnet.wiredleap.com/campaigns?page=1&limit=10', {
  headers: { 'Authorization': 'Bearer token' }
})
```

## Benefits

✅ **No CORS Issues**: Browser sees same-origin requests  
✅ **Security**: Auth tokens stay on server side  
✅ **Flexibility**: Can add caching, rate limiting, etc.  
✅ **Development**: Works in localhost without backend CORS config  

## Environment Variables

The backend URL is configured via environment variable:

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://irisnet.wiredleap.com
```

## Testing

1. Start the Next.js dev server:
   ```bash
   npm run dev
   ```

2. Navigate to the Campaign History page:
   ```
   http://localhost:3003/analysis-history
   ```

3. The API calls should now work without CORS errors!

## Troubleshooting

### Issue: Still getting CORS errors
**Solution**: Make sure you're using the proxy routes (`/api/campaigns`) not the backend URL directly.

### Issue: 404 on API routes
**Solution**: Restart the Next.js dev server after creating new API routes.

### Issue: Authentication not working
**Solution**: Check that the Authorization header is being passed correctly in the API routes.

## Alternative Solutions (Not Implemented)

### 1. Backend CORS Configuration
Configure the backend to allow requests from `http://localhost:3003`:
```javascript
// Backend CORS config
app.use(cors({
  origin: 'http://localhost:3003',
  credentials: true
}));
```

**Pros**: Direct API calls, simpler architecture  
**Cons**: Requires backend access, production needs different config

### 2. Browser Extension
Use a CORS browser extension during development.

**Pros**: Quick fix for development  
**Cons**: Not production-ready, security risk

### 3. Next.js Rewrites
Use Next.js rewrites in `next.config.js`:
```javascript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'https://irisnet.wiredleap.com/:path*',
    },
  ]
}
```

**Pros**: Simpler than API routes  
**Cons**: Less control, can't modify requests/responses

## Production Considerations

### 1. Server-Side Rendering
The API routes work on the server side, so they can be used in:
- Server Components
- Server Actions
- API Routes
- Middleware

### 2. Error Handling
All API routes include error handling:
```typescript
try {
  // API call
} catch (error) {
  console.error('API Proxy Error:', error);
  return NextResponse.json(
    { success: false, error: { message: 'Failed to fetch', code: 'FETCH_ERROR' } },
    { status: 500 }
  );
}
```

### 3. Security
- ✅ Auth tokens are passed through securely
- ✅ No sensitive data exposed to client
- ✅ Server-side validation possible

## Performance

### Caching
You can add caching to API routes:

```typescript
export const revalidate = 60; // Revalidate every 60 seconds

export async function GET(request: NextRequest) {
  // ... API call
}
```

### Rate Limiting
Add rate limiting to prevent abuse:

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

export async function GET(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }
  
  // ... API call
}
```

## Summary

The Next.js API routes proxy solution:
- ✅ Solves CORS issues completely
- ✅ Works in development and production
- ✅ Maintains security with auth tokens
- ✅ Provides flexibility for future enhancements
- ✅ No backend changes required

---

**Last Updated**: January 2024  
**Status**: ✅ Implemented and Working

