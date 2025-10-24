# Browser Cache Clearing Guide

## 🚨 IMPORTANT: Clear Browser Cache to Load Fresh Code

The application has been updated to disable all caching, but your browser may still have cached JavaScript files. Follow these steps to ensure you're running the latest code:

### Method 1: Hard Refresh (Recommended)
- **Windows/Linux**: Press `Ctrl + Shift + R`
- **Mac**: Press `Cmd + Shift + R`
- **Alternative**: Press `F12` → Right-click refresh button → "Empty Cache and Hard Reload"

### Method 2: Clear Browser Cache Completely
- **Chrome/Edge**: 
  1. Press `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
  2. Select "All time" as time range
  3. Check "Cached images and files"
  4. Click "Clear data"

- **Firefox**:
  1. Press `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
  2. Select "Everything" as time range
  3. Check "Cache"
  4. Click "Clear Now"

### Method 3: Incognito/Private Mode (Alternative)
- Open a new incognito/private window
- Navigate to `http://localhost:3000/start-analysis`
- Test the functionality

### Method 4: Developer Tools Cache Clear
1. Press `F12` to open Developer Tools
2. Right-click on the refresh button
3. Select "Empty Cache and Hard Reload"

## What to Expect After Cache Clear

The API request should now use the correct structure:
```javascript
// NEW (correct) request:
POST https://irisnet.wiredleap.com/api/campaigns/campaign-search
{
  "topic": "your search query",
  "timeRange": "any",
  "platforms": ["facebook", "twitter"],
  "campaignType": "NORMAL"
}
```

Instead of the old structure:
```javascript
// OLD (cached) request:
POST https://irisnet.wiredleap.com/api/campaigns
{
  "name": "Topic Analysis: ...",
  "type": "TOPIC",  // ← Wrong field
  // ... old structure
}
```

## Troubleshooting

If you still see the old API calls after clearing cache:
1. Try a different browser
2. Clear cookies and site data
3. Restart your browser completely
4. Check if you have any browser extensions that might be caching

## Server-Side Caching Disabled

The following caching has been disabled on the server:
- ✅ Next.js build cache
- ✅ Webpack cache
- ✅ Node modules cache
- ✅ SWC cache
- ✅ Turbo cache
- ✅ HTTP cache headers
- ✅ Browser cache headers

The server will now always serve fresh JavaScript files.
