# API Setup & Authentication Guide

## Overview

This application uses a centralized API configuration with JWT-based authentication. All API calls automatically include authentication headers when a user is logged in.

## Environment Configuration

### Setting up Environment Variables

1. **Create `.env.local` file** (already created):
   ```bash
   # API Configuration
   NEXT_PUBLIC_API_URL=https://irisnet.wiredleap.com
   ```

2. **Important Notes**:
   - The `.env.local` file is NOT committed to git (it's in `.gitignore`)
   - Use `.env.example` as a template for new developers
   - All public environment variables must start with `NEXT_PUBLIC_` prefix in Next.js

### Available Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Base URL for all API endpoints | `https://irisnet.wiredleap.com` |

## Authentication Flow

### 1. Login Process

When a user logs in (email/password or OTP), the following happens:

1. **Credentials are sent** to the API via `authApi.login()` or `authApi.otpLogin()`
2. **JWT token is received** in the response
3. **Token is stored** in three places:
   - `localStorage` (persistent storage)
   - `AuthManager` (in-memory cache)
   - `cookies` (for middleware authentication)
4. **User data is saved** in auth context
5. **All subsequent API calls** automatically include the JWT token

### 2. Token Management

The `AuthManager` class (in `lib/api.ts`) handles token storage and retrieval:

```typescript
// Setting a token
AuthManager.setToken(token)

// Getting the current token
const token = AuthManager.getToken()

// Clearing the token
AuthManager.clearToken()
```

### 3. Automatic Token Injection

All API calls automatically include the JWT token in headers:

```typescript
// The ApiClient automatically adds this header to all requests:
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
  // ... other headers
}
```

## Using the API in Your Components

### Option 1: Using React Hooks (Recommended)

The easiest way to make API calls is using the pre-built hooks in `hooks/use-api.ts`:

```tsx
import { useCampaigns, usePoliticalStats } from '@/hooks/use-api'

function MyComponent() {
  const { data, loading, error, refetch } = usePoliticalStats({ timeRange: '7d' })
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return <div>{data?.totalPosts}</div>
}
```

**Available Hooks**:
- `useCampaigns()` - Get all campaigns
- `useCampaign(id)` - Get single campaign
- `useSocialPosts()` - Get social media posts
- `useProfiles()` - Get social profiles
- `usePoliticalStats()` - Get political dashboard stats
- `useInfluencerTracker()` - Get influencer data
- And many more...

### Option 2: Direct API Calls

For more control, use the API client directly:

```tsx
import { api } from '@/lib/api'

async function handleAction() {
  try {
    const response = await api.campaign.getStats()
    
    if (response.success) {
      console.log(response.data)
    } else {
      console.error(response.message)
    }
  } catch (error) {
    console.error('API call failed:', error)
  }
}
```

### Option 3: Using Auth Context

Access user data and authentication methods:

```tsx
import { useAuth } from '@/contexts/auth-context'

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()
  
  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user?.name}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={() => login({ email, password })}>Login</button>
      )}
    </div>
  )
}
```

## API Endpoints

### Authentication APIs
- `authApi.login()` - Login with email/password
- `authApi.otpLogin()` - Login with phone/OTP
- `authApi.getProfile()` - Get current user profile
- `authApi.logout()` - Logout

### Campaign APIs
- `campaignApi.getAll()` - Get all campaigns
- `campaignApi.getById(id)` - Get campaign details
- `campaignApi.getData(id)` - Get campaign data
- `campaignApi.create()` - Create new campaign
- `campaignApi.update(id)` - Update campaign
- `campaignApi.delete(id)` - Delete campaign

### Social Media APIs
- `socialApi.getPosts()` - Get social posts
- `socialApi.getPostById(id)` - Get single post
- `socialApi.updatePost(id)` - Update post
- `socialApi.getStats()` - Get social stats

### Profile APIs
- `profileApi.getAll()` - Get all profiles
- `profileApi.getById(id)` - Get profile details
- `profileApi.getPosts(id)` - Get profile posts

### Political Dashboard APIs
- `politicalApi.getQuickStats()` - Get quick stats
- `politicalApi.getInfluencerTracker()` - Get influencer data
- `politicalApi.getOpponentNarratives()` - Get opponent narratives
- `politicalApi.getSupportBaseEnergy()` - Get support base data

### OSINT APIs
- `osintApi.ironVeilSearch()` - Search IronVeil
- `osintApi.mobileToPAN()` - Mobile to PAN lookup
- `osintApi.mobileToAccount()` - Mobile to account lookup
- `osintApi.truecallerSearch()` - Truecaller search

## Error Handling

The API client includes built-in error handling:

1. **Authentication Errors (401)**: Automatically clears invalid tokens
2. **Not Found (404)**: Returns graceful error message
3. **Bad Request (400)**: Returns validation error details
4. **Network Errors**: Returns network error message

```tsx
const { data, loading, error } = useCampaigns()

if (error) {
  // Error is automatically handled and logged
  return <div>Error: {error}</div>
}
```

## Best Practices

1. **Always use environment variables** for API URLs - never hardcode
2. **Use hooks for data fetching** in components - they handle loading/error states
3. **Handle errors gracefully** - the API client returns error objects, display them to users
4. **Use TypeScript types** - all API responses are typed
5. **Avoid direct fetch calls** - use the centralized API client
6. **Token refresh** - if tokens expire, users are automatically redirected to login

## Security Considerations

1. **JWT tokens are stored in**:
   - `localStorage` - for persistence across sessions
   - Memory (`AuthManager`) - for runtime access
   - `cookies` - for middleware authentication

2. **Tokens are automatically cleared**:
   - On logout
   - On 401 authentication errors
   - When tokens expire

3. **HTTPS is enforced** - all API calls use HTTPS

## Troubleshooting

### Token not being sent in requests
- Check that user is logged in: `console.log(AuthManager.getToken())`
- Verify environment variable is set: `console.log(process.env.NEXT_PUBLIC_API_URL)`

### API calls failing with 401
- Token may have expired - try logging out and back in
- Check browser console for authentication errors

### Environment variables not updating
- Restart the Next.js development server after changing `.env.local`
- Clear browser cache and reload

## Migration from Hardcoded URLs

If you have old code with hardcoded API URLs:

**Before**:
```tsx
const response = await fetch('https://irisnet.wiredleap.com/api/campaigns', {
  headers: {
    'Authorization': `Bearer ${token}`,
  }
})
```

**After**:
```tsx
const response = await api.campaign.getAll()
// Token is automatically included
```

## Additional Resources

- **API Client**: `lib/api.ts`
- **Auth Context**: `contexts/auth-context.tsx`
- **API Hooks**: `hooks/use-api.ts`
- **Auth Manager**: `lib/api.ts` (AuthManager class)

