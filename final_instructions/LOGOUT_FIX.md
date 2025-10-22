# 🔧 Logout Fix & Auth Debug Tools

## ✅ Solution Implemented

I've created tools to help you logout and debug authentication issues.

---

## 🚀 Quick Fix - Do This Now:

### Option 1: Use Debug Panel (Recommended)

1. **Go to:** http://localhost:3004/debug-auth
2. **Click "Clear Everything"** button
3. **Enter your credentials** in the login form
4. **Click "Login"**
5. **Click "Go to Social Feed"**

This will:
- ✅ Clear all auth data
- ✅ Let you login fresh
- ✅ Show token status
- ✅ Test the logout button

---

### Option 2: Auto-Clear Page

1. **Go to:** http://localhost:3004/clear-auth
2. **Wait 2 seconds** - it will automatically:
   - Clear all auth data
   - Redirect you to login page
3. **Login** with your credentials
4. **Go to** http://localhost:3004/social-feed

---

### Option 3: Manual Console Commands

Open browser console (F12) and run:

```javascript
// Clear everything
localStorage.clear();
sessionStorage.clear();
document.cookie.split(";").forEach((c) => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});

// Verify cleared
console.log('Token:', localStorage.getItem('auth_token')); // Should be null

// Then go to /login
window.location.href = '/login';
```

---

## 🛠️ Debug Panel Features

The debug panel at `/debug-auth` shows:

### 1. **Token Status**
- Shows if token exists
- Shows token length
- Shows token preview
- Click "Check Token" to refresh

### 2. **User Status**
- Shows current logged-in user
- Shows email and name

### 3. **Login Form**
- Enter email and password
- Click "Login" to authenticate
- Automatically redirects to social feed

### 4. **Action Buttons**
- **Logout** - Logs out current user
- **Clear Everything** - Clears all auth data
- **Go to Social Feed** - Navigate to feed page

---

## 🔍 Testing the Logout Button

After logging in through the debug panel:

1. **Go to any page** with a logout button
2. **Click the logout button**
3. **Check console** for these logs:
   ```
   Logout: Starting logout process...
   Logout: Cleared localStorage and AuthManager
   Logout: Cleared cookies
   Logout: User state cleared
   Logout: Redirecting to login...
   ```
4. **Should redirect** to `/login`

---

## 📋 Step-by-Step: Fresh Start

### 1. Clear Everything
```
Go to: http://localhost:3004/debug-auth
Click: "Clear Everything"
```

### 2. Login
```
Enter: Your email and password
Click: "Login"
```

### 3. Verify Token
```
Click: "Check Token"
Should see: ✅ Token exists (150+ chars)
```

### 4. Test Social Feed
```
Click: "Go to Social Feed"
Check console for: API Request: /api/social/posts { hasToken: true, ... }
Check Network tab: Should have Authorization header
```

### 5. Test Logout
```
Click: Logout button
Should redirect to: /login
```

---

## 🐛 Troubleshooting

### Logout Button Not Working

**Check:**
1. Is the logout button calling `logout()` from `useAuth()`?
2. Check console for errors
3. Try the debug panel logout button

**Fix:**
```typescript
import { useAuth } from '@/contexts/auth-context'

function MyComponent() {
  const { logout } = useAuth()
  
  return (
    <button onClick={logout}>
      Logout
    </button>
  )
}
```

### Still Getting 401 After Login

**Check:**
1. Go to `/debug-auth`
2. Click "Check Token"
3. If token exists but still 401:
   - Token might be expired
   - Clear everything and login again

### Token Not Saving

**Check:**
1. Login through `/debug-auth`
2. Click "Check Token"
3. If still null:
   - Check browser console for errors
   - Try different browser
   - Clear browser cache

---

## 📝 Quick Reference

### Pages Created

1. **`/debug-auth`** - Full auth debug panel
2. **`/clear-auth`** - Auto-clear and redirect

### Console Commands

```javascript
// Check token
localStorage.getItem('auth_token')

// Clear token
localStorage.removeItem('auth_token')

// Clear everything
localStorage.clear(); sessionStorage.clear();

// Test API
fetch('https://irisnet.wiredleap.com/api/social/posts?page=1&limit=5', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(console.log)
```

---

## ✅ What to Do Now

1. **Go to:** http://localhost:3004/debug-auth
2. **Click:** "Clear Everything"
3. **Enter:** Your login credentials
4. **Click:** "Login"
5. **Click:** "Go to Social Feed"
6. **Check:** Console logs and Network tab
7. **Verify:** API calls have Authorization header

---

## 🎯 Expected Result

After following the steps:

✅ Token exists in localStorage
✅ Token is attached to API requests
✅ API returns 200 OK (not 401)
✅ Posts load from API
✅ Logout button works
✅ Can logout and login again

---

**Status:** Ready to test! 🚀

