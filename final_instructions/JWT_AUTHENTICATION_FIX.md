# JWT Authentication Fix for API Calls

## Problem
The Analysis History page (and other pages using the campaigns API) were failing with `401 Unauthorized` errors because the API calls were not including the JWT token in the Authorization header.

## Root Cause
The campaigns API was using the wrong localStorage key to retrieve the authentication token:
- **Wrong**: `localStorage.getItem('auth_token')`
- **Correct**: `localStorage.getItem('token')`

## Solution Applied

### 1. Fixed Token Retrieval in Campaigns API
**File**: `/lib/api/campaigns.ts`

**Before**:
```typescript
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token'); // ❌ Wrong key
};
```

**After**:
```typescript
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token'); // ✅ Correct key
};
```

### 2. Fixed Debug Auth Page
**File**: `/app/debug-auth/page.tsx`

Updated token checking to use the correct key:
```typescript
const checkToken = () => {
  const t = localStorage.getItem('token') // ✅ Fixed
  setToken(t)
}
```

### 3. Fixed Clear Auth Page
**File**: `/app/clear-auth/page.tsx`

Updated to clear the correct localStorage keys:
```typescript
localStorage.removeItem('token') // ✅ Fixed
localStorage.removeItem('user')
localStorage.removeItem('organization')
```

## How JWT Authentication Works

### Token Storage
- **Key**: `token` in localStorage
- **Format**: JWT token string
- **Set by**: AuthProvider after successful login/OTP verification

### API Request Flow
1. **Token Retrieval**: `getAuthToken()` gets token from localStorage
2. **Header Addition**: Token added to Authorization header as `Bearer ${token}`
3. **API Call**: Request sent with proper authentication

### Example API Request
```typescript
const response = await fetch(`${API_BASE_URL}${endpoint}`, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '', // ✅ JWT included
    ...options.headers,
  },
});
```

## Files Fixed
1. `/lib/api/campaigns.ts` - Main fix for campaigns API
2. `/app/debug-auth/page.tsx` - Debug page token checking
3. `/app/clear-auth/page.tsx` - Auth clearing functionality

## Result
✅ **Analysis History page now works correctly**
✅ **All campaign API calls include JWT authentication**
✅ **401 Unauthorized errors resolved**
✅ **Consistent token management across the app**

## Testing
To verify the fix:
1. Login successfully
2. Navigate to Analysis History page
3. Check DevTools Network tab - Authorization header should now be present
4. API calls should return 200 status instead of 401

## Date
Fixed: January 2025
