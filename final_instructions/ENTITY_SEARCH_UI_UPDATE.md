# Entity Search UI Update - Matching Old FE

## Summary
Updated the entity search page in new-fe to match the old-fe (osint-turbo) design and removed features for which APIs are not available.

## Changes Made

### 1. Entity Card Component (EntityCard)
**Updated Design:**
- Changed to dark cyberpunk theme matching old-fe
- Background: `bg-gray-800/50 backdrop-blur-sm`
- Border: `border-gray-700/50` with cyan glow on hover
- Hover effect: `hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10`
- Icons in cyan color (`text-cyan-400`)
- Better stats display with BarChart and Clock icons
- Time formatting using relative time (e.g., "2h ago", "5d ago")
- Category icons added (Political Party, Politician, News Outlet, Government Agency)
- Risk level indicator with color coding (red/yellow/orange)

**Visual Elements:**
- Entity name: Large white text (`text-lg font-semibold text-white`)
- Type badge: Gray background (`bg-gray-700/50`)
- Category badge: Blue background (`bg-blue-900/30`)
- Stats: Gray text with icons
- Description: Truncated to 2 lines with gray text

### 2. Sidebar Filters
**Updated Styling:**
- Background: `bg-black/80 backdrop-blur-xl`
- Border: `border-gray-700/50`
- Title: Larger, white text (`text-xl font-bold text-white`)
- Section headers: Small, uppercase, gray (`text-[11px] text-gray-400 uppercase tracking-wider`)

**Filter Items:**
- Active state: White background with black text (`bg-white text-black`)
- Inactive state: Gray text with hover effects (`text-gray-300 hover:bg-gray-800/60`)
- Smaller font size (`text-xs`) for compact display
- Rounded corners (`rounded-md`)

### 3. Removed Features
**Sentiment-Based Filters:**
- Removed "Negative Entities" filter
- Removed "Positive Entities" filter  
- Removed "Controversial" filter
- Removed all sentiment-based filtering logic

**Reason:** The API does not support sentiment-based filtering for entities. The sentiment parameter is documented but not functional in the current backend implementation.

**Export Functionality:**
- Removed the Export button
- No PDF export API endpoint available for entities

### 4. Search Bar
**Updated Styling:**
- Background: `bg-gray-800/50`
- Border: `border-gray-700/50`
- Text: White with gray placeholder
- Focus state: Cyan border (`focus:border-cyan-500/50`)
- Icon: Gray color (`text-gray-400`)

### 5. Main Content Area
**Grid Layout:**
- Simplified grid: Removed AnimatedGrid wrapper
- Grid columns: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- Gap: Increased to 6 units for better spacing
- Padding: Increased to `p-6`

**Empty State:**
- White heading (`text-white`)
- Gray description (`text-gray-400`)
- Gray icon (`text-gray-600`)

### 6. Top Bar
**Updated Styling:**
- Background: `bg-gray-900/50`
- Border: `border-gray-700/50`
- Entity count text: Gray color (`text-gray-400`)

### 7. Data Type Updates
**Entity Interface:**
- Changed `sentiment` from object to string
- Updated both in `page.tsx` and `entity-detail-view.tsx`
- Reason: API returns sentiment as a string, not an object

### 8. Filter Thresholds Adjusted
- High Impact Entities: Changed from 1000+ to 100+ mentions
- Frequently Mentioned: Changed from 500+ to 50+ mentions
- Reason: More realistic thresholds for current data volume

## API Parameters Supported
The following filters are supported by the `/api/social/entities/analytics` endpoint:

✅ **Working Filters:**
- `type` - Entity type (PERSON, ORGANIZATION, TOPIC, LOCATION, THREAT, KEYWORD)
- `category` - Entity category (POLITICAL_PARTY, POLITICIAN, NEWS_OUTLET, GOVERNMENT_AGENCY)
- `timeRange` - Time range (24h, 7d, 30d, 90d, all)
- `platform` - Filter by platform
- `socialProfileId` - Filter by specific profile
- `campaignId` - Filter by campaign
- `limit` - Maximum results to return
- `minMentions` - Minimum mention threshold
- `sortBy` - Sort field (mentions, relevance, lastSeen)
- `sortOrder` - Sort order (asc, desc)

❌ **Not Working/Removed:**
- `sentiment` - Sentiment filtering (parameter exists but not functional)
- PDF Export - No API endpoint available

## Visual Comparison

### Old FE (osint-turbo)
- Dark cyberpunk theme
- Cyan/blue accent colors
- White active filters
- Compact sidebar with small text
- Grid layout with detailed cards
- Time displayed as relative (e.g., "2h ago")

### New FE (Updated)
- ✅ Matches dark cyberpunk theme
- ✅ Cyan/blue accent colors
- ✅ White active filters
- ✅ Compact sidebar with small text
- ✅ Grid layout with detailed cards
- ✅ Time displayed as relative

## Files Modified
1. `/Users/layan/Desktop/combined/new-fe/app/entities/page.tsx` - Main entity search page
2. `/Users/layan/Desktop/combined/new-fe/components/entities/entity-detail-view.tsx` - Entity interface update

## Testing Recommendations
1. Verify all entity types display correctly (TOPIC, PERSON, ORGANIZATION, LOCATION, THREAT, KEYWORD)
2. Test all filter options work as expected
3. Verify entity cards show all information (mentions, last seen, category, risk level)
4. Check responsive design on mobile devices
5. Verify entity detail view opens correctly when clicking on cards
6. Test search functionality
7. Verify the sidebar filter states (active/inactive) work correctly

