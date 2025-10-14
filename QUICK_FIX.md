# 🚨 URGENT: 401 Unauthorized - Authorization Header Missing

## The Problem

The `Authorization` header is **NOT** being sent with the API request. This means the token is either:
1. Not in localStorage
2. Not being retrieved
3. Not being attached to the request

## Immediate Fix Steps

### Step 1: Check if you're logged in

Open browser console (F12) and run:

```javascript
localStorage.getItem('auth_token')
```

**If this returns `null`** → You're not logged in! Go to `/login` and login first.

**If this returns a token** → Continue to Step 2.

---

### Step 2: Check console logs

Look for this log in the console:

```
API Request: /api/social/posts {
  hasToken: ???,
  tokenLength: ???,
  ...
}
```

**What does `hasToken` show?**

- **If `false`** → Token is not being retrieved from localStorage
- **If `true`** → Token exists but not being attached (code bug)

---

### Step 3: Hard Refresh

1. Clear browser cache: `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
2. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. Check console logs again

---

### Step 4: Restart Dev Server

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

---

## Most Likely Cause

**You're not logged in!**

The token is not in localStorage, which means:
1. You haven't logged in yet, OR
2. The token was cleared/expired

## Solution

1. **Go to:** http://localhost:3004/login (note: port 3004, not 3003!)
2. **Login** with your credentials
3. **Check console** for: `"AuthManager: Token saved to localStorage"`
4. **Then go to:** http://localhost:3004/social-feed
5. **Check console** for: `"API Request: /api/social/posts { hasToken: true, ... }"`

---

## Quick Test

Run this in browser console:

```javascript
// Check if token exists
const token = localStorage.getItem('auth_token');
console.log('Token exists:', !!token);
console.log('Token length:', token?.length || 0);

// Test API call manually
if (token) {
  fetch('https://irisnet.wiredleap.com/api/social/posts?page=1&limit=5', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(r => r.json())
  .then(data => {
    console.log('✅ API works!', data);
  })
  .catch(err => {
    console.error('❌ API failed:', err);
  });
} else {
  console.error('❌ No token! Please login first.');
}
```

---

## What to Report Back

Please tell me:

1. **Are you logged in?** (Did you login to the app?)
2. **Console log for `API Request:`** - What does it show?
3. **localStorage check** - Does `localStorage.getItem('auth_token')` return a token?

This will help me identify the exact issue!

