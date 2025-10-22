# Location Map Implementation

## Overview
The locations page now features an interactive OpenStreetMap view that displays all locations as markers with detailed popups. Users can toggle between grid and map views for better data visualization.

## Features

### 🗺️ Interactive Map
- **OpenStreetMap Integration**: Uses Leaflet with OpenStreetMap tiles
- **Dynamic Markers**: Color-coded markers based on risk level
- **Size-based Volume**: Marker size indicates mention volume
- **Interactive Popups**: Detailed location information on marker click

### 🎛️ View Toggle
- **Grid View**: Traditional card-based layout
- **Map View**: Interactive map with location markers
- **Seamless Switching**: Toggle between views without losing filters

### 📍 Enhanced Location Data
- **Comprehensive Coordinates**: Extensive database of Indian and international locations
- **Smart Matching**: Partial name matching for compound location names
- **Fallback Handling**: Defaults to Bangalore center for unknown locations

## Technical Implementation

### Components
- `EnhancedLocationMap`: Main map component with advanced features
- `LocationMap`: Original map component (still available)
- Updated `LocationsPage`: Integrated view toggle functionality

### Dependencies
- `react-leaflet`: React wrapper for Leaflet
- `leaflet`: JavaScript map library
- `@types/leaflet`: TypeScript definitions

### Key Features

#### Marker System
```typescript
// Color coding by risk level
const getMarkerColor = (riskLevel?: string) => {
  switch (riskLevel) {
    case 'high': return '#ef4444' // red
    case 'medium': return '#f97316' // orange
    default: return '#3b82f6' // blue
  }
}

// Size based on mention volume
const getMarkerSize = (mentions: number) => {
  if (mentions > 300) return 25
  if (mentions > 200) return 20
  if (mentions > 100) return 16
  if (mentions > 50) return 12
  return 8
}
```

#### Coordinate Database
- **Karnataka**: 25+ locations including Bangalore areas
- **Other Indian States**: Major cities and regions
- **International**: Russia, Moscow
- **Highways**: Major road networks

#### Interactive Popups
- Location details with risk assessment
- Metrics display (incidents, engagement)
- Sentiment analysis
- Action buttons for navigation

### Map Controls
- **Zoom Controls**: Standard Leaflet zoom controls
- **Scroll Wheel**: Enabled for smooth navigation
- **Click Handlers**: Marker clicks trigger popups
- **Legend**: Visual guide for marker colors and sizes

## Usage

### URL Parameters
The map respects all existing URL parameters:
- `?activity=low` - Filters locations by activity level
- `?sentiment=NEGATIVE` - Filters by sentiment
- `?platform=twitter` - Filters by platform

### Filtering
All existing filters work with the map view:
- **Search**: Real-time location search
- **Platform**: Filter by social media platform
- **Sentiment**: Filter by sentiment analysis
- **Activity**: Filter by activity level
- **Police Divisions**: Geographic filtering

### Navigation
- **Marker Click**: Opens detailed popup
- **Popup Actions**: Navigate to detailed views
- **View Toggle**: Switch between grid and map views

## Styling

### Custom CSS
```css
/* Leaflet Map Custom Styles */
.leaflet-popup-content-wrapper {
  border-radius: 8px !important;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important;
}

.custom-popup .leaflet-popup-content-wrapper {
  background: hsl(var(--background)) !important;
  color: hsl(var(--foreground)) !important;
  border: 1px solid hsl(var(--border)) !important;
}
```

### Theme Support
- **Light Theme**: Clean white popups with subtle shadows
- **Dark Theme**: Dark popups with proper contrast
- **Border Radius**: Consistent with design system
- **Colors**: Uses CSS variables for theme consistency

## Performance Optimizations

### Dynamic Imports
```typescript
// SSR-safe dynamic imports
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })
```

### Client-Side Rendering
- Map only renders on client-side to avoid SSR issues
- Loading state while map initializes
- Optimized marker rendering

### Memory Management
- Efficient coordinate calculations
- Memoized map center calculations
- Optimized marker event handlers

## Browser Support

### Desktop
- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support

### Mobile
- **iOS Safari**: Touch-optimized interactions
- **Android Chrome**: Full feature support
- **Responsive Design**: Adapts to different screen sizes

## Future Enhancements

### Planned Features
1. **Cluster Markers**: Group nearby markers for better performance
2. **Heatmap Overlay**: Visualize location density
3. **Custom Icons**: Brand-specific marker icons
4. **Drawing Tools**: Allow users to draw areas of interest
5. **Export Functionality**: Export map views as images

### Performance Improvements
1. **Virtual Scrolling**: For large location datasets
2. **Lazy Loading**: Load markers as user pans
3. **Caching**: Cache tile data for offline support
4. **WebGL Rendering**: Hardware-accelerated rendering

## Troubleshooting

### Common Issues
1. **Map Not Loading**: Check if Leaflet CSS is imported
2. **Markers Not Showing**: Verify coordinate data
3. **SSR Errors**: Ensure dynamic imports are used
4. **Performance Issues**: Check marker count and complexity

### Debug Mode
Enable debug mode by adding `?debug=true` to the URL for additional logging and error information.

---

## 🎉 Results

The locations page now provides:
- ✅ **Interactive Map View** with OpenStreetMap integration
- ✅ **Toggle Between Grid and Map** views
- ✅ **Color-coded Markers** based on risk levels
- ✅ **Size-based Volume** indicators
- ✅ **Detailed Popups** with location information
- ✅ **Filter Integration** with all existing filters
- ✅ **Responsive Design** for all devices
- ✅ **Theme Support** for light and dark modes

Visit `/locations?activity=low` to see the map in action!

