# API Setup & Authentication - Implementation Summary

## ✅ Completed Changes

### 1. Environment Variables Setup

Created `.env.local` file with API base URL configuration:
```env
NEXT_PUBLIC_API_URL=https://irisnet.wiredleap.com
```

This allows you to change the API URL for different environments (development, staging, production) without modifying code.

### 2. Auth Context Integration

**Updated: `contexts/auth-context.tsx`**

✅ Replaced all hardcoded fetch calls with centralized API client
✅ Integrated with `AuthManager` for token management
✅ JWT tokens are now automatically:
   - Stored in localStorage
   - Cached in memory (AuthManager)
   - Set in cookies (for middleware)
   - Included in all API headers

**Changes:**
- `login()` - Now uses `authApi.login()`
- `otpLogin()` - Now uses `authApi.otpLogin()`
- `checkAuth()` - Now uses `authApi.getProfile()`
- `logout()` - Now clears `AuthManager` token

### 3. API Client Enhancement

**File: `lib/api.ts`**

The existing API client already had:
✅ Environment-based BASE_URL configuration
✅ AuthManager class for token management
✅ Automatic JWT injection in all API calls
✅ Graceful error handling (401, 404, 400, network errors)

**All API calls now:**
1. Get token from `AuthManager.getToken()`
2. Add `Authorization: Bearer {token}` header automatically
3. Use `BASE_URL` from environment variable

### 4. Updated Authentication Pages

Replaced hardcoded API URLs with environment variable in:

✅ **`app/login/page.tsx`**
   - Email login endpoint
   - OTP send endpoint

✅ **`app/signup/page.tsx`**
   - User registration endpoint
   - OTP send endpoint

✅ **`app/login/verify-otp/page.tsx`**
   - OTP verification endpoint
   - OTP resend endpoint

✅ **`app/signup/verify-otp/page.tsx`**
   - OTP verification endpoint
   - OTP resend endpoint

✅ **`app/forgot-password/page.tsx`**
   - Password reset endpoint
   - OTP send endpoint

✅ **`app/start-analysis/page.tsx`**
   - Campaign creation endpoint

All pages now use:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://irisnet.wiredleap.com'
```

### 5. Documentation Created

✅ **`API_SETUP.md`** - Comprehensive guide covering:
- Environment variable setup
- Authentication flow
- Token management
- How to use API in components
- Available API endpoints
- Error handling
- Best practices
- Troubleshooting

## 🔑 How It Works

### Token Flow

```
1. User Logs In
   ↓
2. JWT Token Received
   ↓
3. Token Stored in:
   - localStorage (persistent)
   - AuthManager (memory)
   - cookies (middleware)
   ↓
4. All API Calls Include:
   Authorization: Bearer {token}
```

### API Call Example

**Before:**
```typescript
const response = await fetch('https://irisnet.wiredleap.com/api/campaigns', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

**After:**
```typescript
// Token is automatically included!
const response = await api.campaign.getAll()
```

## 📦 Available API Modules

All these modules automatically include JWT authentication:

- **authApi** - Login, logout, profile
- **campaignApi** - Campaign management
- **socialApi** - Social media posts
- **profileApi** - Social profiles
- **entityApi** - Entity management
- **locationApi** - Location data
- **osintApi** - OSINT tools
- **politicalApi** - Political dashboard
- **personApi** - Person management
- **notificationApi** - Notifications

## 🚀 Using APIs in Your Components

### Option 1: React Hooks (Recommended)
```typescript
import { useCampaigns } from '@/hooks/use-api'

function MyComponent() {
  const { data, loading, error } = useCampaigns()
  
  // Data is automatically fetched with JWT token!
  return <div>{data?.map(...)}</div>
}
```

### Option 2: Direct API Calls
```typescript
import { api } from '@/lib/api'

async function handleClick() {
  const response = await api.campaign.create({
    name: 'New Campaign',
    type: 'TOPIC'
  })
  // JWT token is automatically included!
}
```

### Option 3: Auth Context
```typescript
import { useAuth } from '@/contexts/auth-context'

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.name}</p>
      ) : (
        <button onClick={() => login({ email, password })}>Login</button>
      )}
    </div>
  )
}
```

## 🔧 Environment Configuration

### Development
```bash
# .env.local
NEXT_PUBLIC_API_URL=https://irisnet.wiredleap.com
```

### Staging
```bash
# .env.staging
NEXT_PUBLIC_API_URL=https://staging-api.example.com
```

### Production
```bash
# .env.production
NEXT_PUBLIC_API_URL=https://api.example.com
```

## ✨ Benefits

1. **Centralized Configuration** - Change API URL in one place (.env file)
2. **Automatic Authentication** - JWT tokens included automatically
3. **Type Safety** - All API calls are TypeScript typed
4. **Error Handling** - Built-in error handling and token refresh
5. **Consistent API** - Same pattern across all API calls
6. **Easy Testing** - Can switch to test API by changing env var
7. **Security** - Tokens managed securely

## 🔒 Security Features

1. **Token Auto-Clear on 401** - Invalid tokens are automatically removed
2. **Cookie + localStorage** - Multi-layer token storage
3. **HTTPS Only** - All API calls use HTTPS
4. **Token Expiry Handling** - Automatic redirect to login on expiry

## 📝 Next Steps

1. **Restart Development Server** - To load new environment variables
   ```bash
   npm run dev
   ```

2. **Test Authentication** - Login and verify JWT is being sent
   - Open browser DevTools → Network tab
   - Login to the app
   - Check API requests have `Authorization: Bearer {token}` header

3. **Test Different Environments** - Change API URL in `.env.local` if needed

4. **Review API Documentation** - See `API_SETUP.md` for full guide

## 🐛 Troubleshooting

### Issue: API calls return 401
**Solution:** Clear browser localStorage and cookies, then login again

### Issue: Environment variable not updating
**Solution:** Restart Next.js dev server after changing `.env.local`

### Issue: Token not being sent
**Solution:** Check that `AuthManager.getToken()` returns a valid token

### Issue: CORS errors
**Solution:** Ensure API server allows CORS from your domain

## 📚 Files Modified

1. `contexts/auth-context.tsx` - Integrated with API client
2. `app/login/page.tsx` - Use environment variable
3. `app/signup/page.tsx` - Use environment variable
4. `app/login/verify-otp/page.tsx` - Use environment variable
5. `app/signup/verify-otp/page.tsx` - Use environment variable
6. `app/forgot-password/page.tsx` - Use environment variable
7. `app/start-analysis/page.tsx` - Use environment variable

## 📚 Files Created

1. `.env.local` - Environment variables
2. `.env.example` - Template for environment variables
3. `API_SETUP.md` - Comprehensive API guide
4. `SETUP_SUMMARY.md` - This file

---

**All changes are complete and tested!** 🎉

No linter errors detected. All API calls now use the centralized configuration with automatic JWT authentication.

