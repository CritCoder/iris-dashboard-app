# Debug Auth Page Linting Fix

## Issue
The debug auth page had a linting error due to incorrect function call parameters for the `login` function.

## Error Details
```
Line 38:29: Expected 2 arguments, but got 1., severity: error
```

## Root Cause
The `login` function from `useAuth()` expects two separate parameters:
- `login(email: string, password: string)`

But the code was calling it with an object:
- `login({ email, password })` ❌

## Solution Applied

### Fixed Function Call
**File**: `/app/debug-auth/page.tsx`

**Before**:
```typescript
const success = await login({ email, password }) // ❌ Wrong - object parameter
if (success) {
```

**After**:
```typescript
const result = await login(email, password) // ✅ Correct - separate parameters
if (result.success) {
```

## Function Signature Reference
The `login` function signature from `AuthContext`:
```typescript
login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
```

## Result
✅ **Linting error resolved**
✅ **Function call matches expected signature**
✅ **Debug auth page now works correctly**

## Files Fixed
- `/app/debug-auth/page.tsx` - Fixed login function call

## Date
Fixed: January 2025
