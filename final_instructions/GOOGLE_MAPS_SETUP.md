# Google Maps Setup Instructions

The locations page now uses Google Maps for better map visualization.

## Setup Steps

### 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API (optional, for enhanced features)
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy your API key

### 2. Configure API Key

1. Create a `.env.local` file in the project root (if it doesn't exist)
2. Add the following line:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```
3. Replace `your_api_key_here` with your actual API key

### 3. Restart Development Server

```bash
yarn dev
```

### 4. (Optional) Restrict API Key

For production, restrict your API key:
1. In Google Cloud Console → Credentials
2. Click on your API key
3. Under "Application restrictions":
   - Choose "HTTP referrers"
   - Add your domain (e.g., `yourdomain.com/*`)
4. Under "API restrictions":
   - Choose "Restrict key"
   - Select: Maps JavaScript API, Places API

## Features

- **Interactive Map**: Click on location markers to see details
- **Risk Level Indicators**: Color-coded markers (Red = High, Orange = Medium, Blue = Low)
- **Info Windows**: Click markers to view location statistics
- **Clustering**: Automatically groups nearby markers
- **Responsive**: Works on all screen sizes
- **Fallback Mode**: Shows a list view if Google Maps fails to load

## Fallback Behavior

If no API key is configured or if Google Maps fails to load:
- The map will show a loading indicator
- A fallback list view will display all locations
- Users can still click on locations to view details
- No functionality is lost

## Cost Considerations

Google Maps offers a generous free tier:
- $200 free credit per month
- ~28,000 map loads per month for free
- After that, $7 per 1,000 loads

For most applications, you won't exceed the free tier.

## Troubleshooting

### Map not loading?
1. Check browser console for errors
2. Verify API key is correct in `.env.local`
3. Ensure Maps JavaScript API is enabled in Google Cloud Console
4. Clear browser cache and restart dev server

### "This page can't load Google Maps correctly"?
- Your API key might be restricted
- Check billing is enabled in Google Cloud Console
- Verify the referring URL is allowed

## Alternative: Free Development Mode

For development without API key, the component will automatically fall back to a list view with all location data still accessible.

