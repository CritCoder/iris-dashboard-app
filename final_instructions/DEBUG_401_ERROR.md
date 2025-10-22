# 🔍 Debugging 401 Unauthorized Error

## Quick Diagnostic Steps

### Step 1: Check Browser Console

Open your browser console (F12) and look for these logs:

```
✅ GOOD - Token is present:
API Request: /api/social/posts {
  hasToken: true,
  tokenLength: 150,
  tokenPreview: "eyJhbGciOiJIUzI1NiIs...",
  localStorageCheck: "eyJhbGciOiJIUzI1NiIs..."
}

❌ BAD - Token is missing:
API Request: /api/social/posts {
  hasToken: false,
  tokenLength: 0,
  tokenPreview: "none",
  localStorageCheck: null
}
```

### Step 2: Check localStorage

In browser console, run:
```javascript
localStorage.getItem('auth_token')
```

**Expected:** A long JWT token string starting with `eyJ...`
**If null:** You're not logged in - need to login first

### Step 3: Use Diagnostic Tool

1. Open: `http://localhost:3003/check-auth.html`
2. Click "🔄 Refresh Check"
3. This will show:
   - ✅ If token exists
   - 📋 Decoded token payload
   - ⏰ When token expires
   - 🔌 API test result

---

## Common Issues & Solutions

### Issue 1: Token is null

**Symptom:** Console shows `hasToken: false`

**Cause:** Not logged in or token was cleared

**Solution:**
1. Go to `/login`
2. Enter credentials
3. Check console for: `"AuthManager: Token saved to localStorage"`
4. Check localStorage has token
5. Go back to `/social-feed`

---

### Issue 2: Token exists but still 401

**Symptom:** Console shows `hasToken: true` but still getting 401

**Possible Causes:**

#### A. Token is expired
```javascript
// Check in console:
const token = localStorage.getItem('auth_token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Expires:', new Date(payload.exp * 1000));
```

**Solution:** Log out and log in again

#### B. Token is invalid
**Solution:** Clear token and login again:
```javascript
localStorage.removeItem('auth_token');
// Then go to /login
```

#### C. Wrong API endpoint
**Check:** Network tab → Request URL
- Should be: `https://irisnet.wiredleap.com/api/social/posts`
- Not: `http://localhost:3003/api/social/posts`

---

### Issue 3: Authorization header missing

**Symptom:** Network tab shows no `Authorization` header

**Cause:** Token not being attached to request

**Check:**
1. Console should show: `hasToken: true`
2. If `hasToken: false`, token is not in localStorage
3. If `hasToken: true` but no header, there's a bug in the code

**Solution:** 
- Clear browser cache
- Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
- Restart dev server

---

## Step-by-Step Debugging

### 1. First, verify you're logged in:

```javascript
// In browser console:
localStorage.getItem('auth_token')
```

**If null → Login first**
**If token exists → Continue to step 2**

---

### 2. Check if token is being used:

Refresh the page and watch console for:
```
API Request: /api/social/posts { hasToken: true, ... }
```

**If `hasToken: false` → Token not in localStorage**
**If `hasToken: true` → Continue to step 3**

---

### 3. Check Network tab:

1. Open DevTools → Network tab
2. Refresh page
3. Find the `/api/social/posts` request
4. Click on it
5. Go to "Headers" tab
6. Scroll to "Request Headers"
7. Look for: `Authorization: Bearer eyJ...`

**If missing → Bug in code (shouldn't happen now)**
**If present → Token might be expired or invalid**

---

### 4. Test token manually:

```javascript
// In browser console:
const token = localStorage.getItem('auth_token');

fetch('https://irisnet.wiredleap.com/api/social/posts?page=1&limit=5', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(data => console.log('API Response:', data))
.catch(err => console.error('Error:', err));
```

**If 200 OK → Token is valid, issue is in the app**
**If 401 → Token is invalid/expired, need to login again**

---

## Quick Fixes

### Fix 1: Clear and Re-login

```javascript
// In console:
localStorage.clear();
// Then go to /login
```

### Fix 2: Hard Refresh

- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

### Fix 3: Clear Cache

1. DevTools → Application tab
2. Storage → Clear site data
3. Refresh page

### Fix 4: Restart Dev Server

```bash
# Stop server (Ctrl+C)
# Then:
npm run dev
```

---

## Expected Flow

### ✅ Correct Flow:

1. **Login:**
   ```
   User enters credentials
   → POST /api/auth/login
   → Response: { token: "eyJ..." }
   → localStorage.setItem('auth_token', token)
   → Redirect to dashboard
   ```

2. **Navigate to Social Feed:**
   ```
   Page loads
   → useEffect runs ensureAuthToken()
   → localStorage.getItem('auth_token') returns token
   → AuthManager.setToken(token)
   → API call to /api/social/posts
   → Request includes: Authorization: Bearer eyJ...
   → Response: 200 OK with data
   ```

3. **Console Logs:**
   ```
   AuthContext: Checking auth, token exists: true
   AuthContext: Token set in AuthManager
   AuthManager: Token loaded from localStorage
   API Request: /api/social/posts { hasToken: true, tokenLength: 150, ... }
   ```

---

## What to Check Right Now

### 1. Are you logged in?
```javascript
// Run in console:
console.log('Token:', localStorage.getItem('auth_token') ? 'EXISTS' : 'MISSING');
```

### 2. What does console show?
Look for the `API Request:` log - what does `hasToken` show?

### 3. What does Network tab show?
- Request URL: `https://irisnet.wiredleap.com/api/social/posts?...`
- Status: `401 Unauthorized`
- Request Headers: Does it have `Authorization: Bearer ...`?

---

## Report Back

Please check and tell me:

1. **Console log for `API Request:`** - What does `hasToken` show?
2. **localStorage check** - Does `localStorage.getItem('auth_token')` return a token?
3. **Network tab** - Does the request have an `Authorization` header?
4. **Did you login?** - Are you logged in to the app?

This will help me identify exactly where the issue is!

