# IRIS Dashboard - Visual Page Map

**Complete site structure with testing locations**

---

## 🎨 Visual Site Map

```
IRIS DASHBOARD
http://localhost:3000

┌─────────────────────────────────────────────────────────────────────┐
│                        PUBLIC PAGES (No Auth)                        │
└─────────────────────────────────────────────────────────────────────┘

📱 AUTHENTICATION FLOW
├── /login                                  [Login Page]
│   ├── Mobile Number Login (10 digits)
│   ├── Email Login
│   ├── Video Background
│   ├── Animated IRIS Logo
│   └── → /login/verify-otp                [OTP Verification]
│       ├── 6-Digit OTP Input
│       ├── Auto-Submit
│       ├── 120s Timer
│       ├── Resend Code
│       └── → / (Dashboard)                [Success]
│
├── /signup                                 [Registration Page]
│   ├── Mobile/Email Selection
│   ├── Full Name Input
│   ├── Password (with strength indicator)
│   ├── Confirm Password
│   ├── Terms Checkbox
│   └── → /signup/verify-otp               [OTP Verification]
│       └── → / (Dashboard)                [Success]
│
└── /forgot-password                        [Password Reset]
    ├── Email/Mobile Selection
    ├── Send Verification Code
    ├── → /forgot-password/verify-otp      [OTP Verification]
    │   └── → /forgot-password/reset       [New Password]
    │       ├── Password Requirements
    │       ├── Strength Indicators
    │       └── → /login                   [Success]
    │
    └── Back to Login Link

┌─────────────────────────────────────────────────────────────────────┐
│                   MAIN APPLICATION (Auth Required)                   │
└─────────────────────────────────────────────────────────────────────┘

🏠 DASHBOARD & NAVIGATION
└── /                                       [Main Dashboard]
    ├── 📊 Stats Grid
    │   ├── Total Analyses
    │   ├── Active Campaigns
    │   ├── Monitored Profiles
    │   └── Recent Activity
    │
    ├── 🎯 Quick Actions
    │   ├── Start New Analysis
    │   ├── Create Campaign
    │   ├── Search Profiles
    │   └── OSINT Tools
    │
    ├── 📈 Recent Activity Feed
    ├── 🔥 Trending Topics
    └── 🎨 Visual Analytics

🔍 ANALYSIS MODULE
├── /start-analysis                         [Create Analysis]
│   ├── Search Query Input
│   ├── Platform Selection
│   │   ├── ☑ Twitter/X
│   │   ├── ☑ Facebook
│   │   ├── ☑ Instagram
│   │   ├── ☑ LinkedIn
│   │   ├── ☑ Reddit
│   │   └── ☑ YouTube
│   ├── Time Range Picker
│   ├── Content Type Filters
│   ├── Advanced Filters
│   │   ├── Language
│   │   ├── Location
│   │   ├── Min Engagement
│   │   └── Verified Only
│   ├── Save as Campaign Toggle
│   └── → /analysis-history/[id]           [Results]
│
├── /analysis-history                       [Analysis List]
│   ├── Grid/List View Toggle
│   ├── Sort Options
│   │   ├── Date
│   │   ├── Status
│   │   └── Platform
│   ├── Filters
│   │   ├── Platform
│   │   ├── Status
│   │   └── Date Range
│   ├── Search Bar
│   ├── Pagination
│   └── → /analysis-history/[id]           [Analysis Detail]
│
└── /analysis-history/[id]                  [Analysis Results]
    ├── 📊 Analysis Overview
    │   ├── Search Query
    │   ├── Date Range
    │   ├── Platforms
    │   └── Total Posts Found
    │
    ├── 🎯 Quick Filters
    │   ├── All Posts
    │   ├── High Engagement
    │   ├── Recent
    │   ├── Viral Potential
    │   ├── Negative Sentiment
    │   └── Positive Sentiment
    │
    ├── 📱 Posts Grid (Infinite Scroll)
    │   ├── Post Cards
    │   │   ├── Author Info
    │   │   ├── Content Preview
    │   │   ├── Engagement Metrics
    │   │   ├── Platform Icon
    │   │   └── Timestamp
    │   └── → /analysis-history/[id]/post/[postId]  [Post Detail]
    │
    ├── 📈 Analytics Section
    │   ├── Sentiment Distribution (Pie)
    │   ├── Engagement Timeline (Line)
    │   ├── Top Influencers List
    │   ├── Keyword Cloud
    │   └── Platform Breakdown
    │
    ├── 💾 Export Options
    │   ├── Export as PDF
    │   ├── Export as CSV
    │   └── Share Link
    │
    └── /analysis-history/[id]/post/[postId]  [Individual Post]
        ├── Full Post Content
        ├── Author Profile
        ├── Engagement Breakdown
        ├── Sentiment Analysis
        ├── Comments/Replies
        └── Related Posts

📱 SOCIAL MEDIA MODULE
├── /social-feed                            [Social Feed]
│   ├── Platform Filter
│   ├── Sort Options
│   │   ├── Most Recent
│   │   ├── Most Popular
│   │   ├── Most Engaging
│   │   └── Trending
│   ├── Posts Stream (Infinite Scroll)
│   ├── Post Cards
│   └── Refresh Button
│
├── /social-inbox                           [Inbox/Messages]
│   ├── Message List
│   ├── Filters
│   │   ├── All
│   │   ├── Unread
│   │   ├── Mentions
│   │   ├── Direct Messages
│   │   └── Comments
│   ├── Mark as Read
│   ├── Mark All as Read
│   ├── Reply Functionality
│   └── Delete Messages
│
├── /profiles                               [Profiles List]
│   ├── Search Bar
│   ├── Platform Filter
│   ├── Sort Options
│   │   ├── Followers (High to Low)
│   │   ├── Engagement Rate
│   │   ├── Recently Added
│   │   └── Alphabetical
│   ├── Profile Cards Grid
│   │   ├── Profile Picture
│   │   ├── Username
│   │   ├── Bio
│   │   ├── Follower Count
│   │   └── Platform Icons
│   ├── Add to List
│   └── → /profiles/[id]                   [Profile Detail]
│
└── /profiles/[id]                          [Profile Details]
    ├── 👤 Profile Header
    │   ├── Cover Image
    │   ├── Profile Picture
    │   ├── Username & Handle
    │   ├── Bio
    │   ├── Follower/Following
    │   ├── Location
    │   ├── Website
    │   └── Join Date
    │
    ├── 📊 Profile Stats
    │   ├── Total Posts
    │   ├── Average Engagement
    │   ├── Posting Frequency
    │   ├── Peak Times
    │   └── Sentiment Distribution
    │
    ├── 📑 Tabs
    │   ├── [Posts Tab]
    │   │   ├── Posts List
    │   │   ├── Infinite Scroll
    │   │   └── Post Details
    │   │
    │   ├── [Media Tab]
    │   │   ├── Image Gallery
    │   │   ├── Video Gallery
    │   │   └── Lightbox View
    │   │
    │   ├── [Analytics Tab]
    │   │   ├── Engagement Over Time
    │   │   ├── Post Frequency Chart
    │   │   ├── Audience Growth
    │   │   └── Top Posts
    │   │
    │   └── [AI Analysis Tab]
    │       ├── Content Themes
    │       ├── Tone Analysis
    │       ├── Audience Insights
    │       └── Recommendations
    │
    ├── 🔘 Actions
    │   ├── Follow/Unfollow
    │   ├── Add to List
    │   ├── Export Profile Data
    │   └── Share Profile
    │
    └── 🔗 External Links

📍 LOCATION MODULE
├── /locations                              [Locations List]
│   ├── 🗺️ Map View
│   │   ├── Interactive Map (Leaflet)
│   │   ├── Location Markers
│   │   ├── Marker Clusters
│   │   ├── Zoom/Pan Controls
│   │   └── Marker Popup
│   │
│   ├── 📋 List View
│   │   ├── Location Cards
│   │   │   ├── Location Name
│   │   │   ├── Coordinates
│   │   │   ├── Post Count
│   │   │   └── Recent Activity
│   │   ├── Search Bar
│   │   └── Activity Filter
│   │
│   └── → /locations/[id]                  [Location Detail]
│
└── /locations/[id]                         [Location Details]
    ├── 📍 Location Overview
    │   ├── Location Name
    │   ├── Coordinates
    │   ├── Country/Region
    │   ├── Post Count
    │   └── Active Users
    │
    ├── 🗺️ Detailed Map
    │   ├── Centered Marker
    │   └── Nearby Locations
    │
    ├── 📱 Posts from Location
    │   ├── Date Range Filter
    │   ├── Sort Options
    │   └── Posts Grid
    │
    ├── 📊 Activity Heatmap
    │   └── Time-based Activity
    │
    └── 🔥 Trending Topics
        └── Location-specific Trends

🏢 ORGANIZATIONS MODULE
├── /organizations                          [Organizations List]
│   ├── Organizations Grid
│   │   ├── Logo
│   │   ├── Name
│   │   ├── Industry
│   │   ├── Location
│   │   └── Metrics
│   ├── Search Bar
│   ├── Industry Filter
│   ├── Sort Options
│   └── → /organizations/[id]              [Org Detail]
│
└── /organizations/[id]                     [Organization Details]
    ├── 🏢 Organization Profile
    │   ├── Logo
    │   ├── Name
    │   ├── Description
    │   ├── Industry
    │   ├── Location
    │   ├── Website
    │   └── Social Profiles
    │
    ├── 📱 Posts/Mentions Tab
    │   └── Related Posts
    │
    ├── 📊 Sentiment Analysis
    │   ├── Sentiment Breakdown
    │   └── Sentiment Over Time
    │
    └── 🔗 Related Entities
        └── Connected Organizations

🎯 ENTITIES MODULE
├── /entities                               [Entities List]
│   ├── Entity Types
│   │   ├── People
│   │   ├── Organizations
│   │   ├── Locations
│   │   └── Events
│   ├── Type Filter
│   ├── Search Bar
│   ├── Entities Grid
│   └── → Entity Detail View
│
└── /entity-search                          [Advanced Entity Search]
    ├── 🔍 Search Interface
    │   ├── Search Input
    │   ├── Autocomplete
    │   └── Suggestions
    │
    ├── ⚙️ Advanced Options
    │   ├── Entity Type
    │   ├── Date Range
    │   └── Custom Filters
    │
    ├── 📊 Search Results
    │   ├── Results Grid
    │   ├── Sort Options
    │   └── Result Details
    │
    ├── 💾 Save Search
    │   └── Named Searches
    │
    └── 🕸️ Network Graph
        └── Entity Connections

📢 CAMPAIGN MODULE
├── /campaign/[id]                          [Campaign Monitoring]
│   ├── 📊 Campaign Overview
│   │   ├── Campaign Name
│   │   ├── Status Badge
│   │   ├── Start/End Date
│   │   ├── Platforms
│   │   └── Search Queries
│   │
│   ├── 🎛️ Monitoring Controls
│   │   ├── Start Monitoring
│   │   ├── Stop Monitoring
│   │   └── Status Indicator
│   │
│   ├── 🔄 Real-time Updates
│   │   ├── New Posts Stream
│   │   └── Notification Badge
│   │
│   ├── ⚙️ Campaign Settings
│   │   ├── Edit Campaign
│   │   └── Notification Settings
│   │
│   └── 🗑️ Delete Campaign
│       └── Confirmation Dialog
│
└── /post-campaign/[id]                     [Post-Campaign Analysis]
    ├── 📊 Final Results
    │   ├── Total Reach
    │   ├── Total Engagement
    │   ├── Sentiment Breakdown
    │   └── Top Performers
    │
    ├── 📈 Performance Metrics
    │   ├── Campaign Timeline
    │   ├── Engagement Trends
    │   └── Platform Breakdown
    │
    └── 💾 Export Report
        ├── Comprehensive PDF
        └── Data Export

🔍 OSINT TOOLS
└── /osint-tools                            [OSINT Dashboard]
    ├── 🛠️ Tools Overview
    │
    ├── 🖼️ Reverse Image Search
    │   ├── Upload Image
    │   ├── Enter URL
    │   └── Search Results
    │
    ├── 👤 Username Search
    │   ├── Username Input
    │   ├── Platform Selection
    │   └── Cross-Platform Results
    │
    ├── 📧 Email Lookup
    │   ├── Email Input
    │   └── Associated Accounts
    │
    ├── 📱 Phone Lookup
    │   ├── Phone Number Input
    │   ├── Carrier Info
    │   └── Associated Accounts
    │
    ├── 🌐 Domain Investigation
    │   ├── Domain Input
    │   ├── WHOIS Data
    │   ├── DNS Records
    │   ├── SSL Certificate
    │   └── Related Domains
    │
    ├── 🔍 Cross-Platform Search
    │   ├── Search Term
    │   ├── Platform Selection
    │   └── Multi-Platform Results
    │
    ├── 💾 Export Results
    │   └── Download Reports
    │
    └── 📜 Search History
        └── Past Searches

🏘️ COMMUNITIES & GROUPS
└── /communities-groups                     [Communities Analysis]
    ├── Community List
    ├── Group Analysis
    ├── Member Insights
    └── Activity Tracking

┌─────────────────────────────────────────────────────────────────────┐
│                        DEBUG & TEST PAGES                            │
└─────────────────────────────────────────────────────────────────────┘

🔧 DEVELOPMENT TOOLS
├── /debug-auth                             [Auth Debugging]
│   ├── Token Inspector
│   ├── Session Info
│   └── Auth State
│
├── /clear-auth                             [Clear Auth Data]
│   └── Reset Authentication
│
├── /test-map                               [Map Testing]
│   └── Map Components
│
├── /test-osm                               [OpenStreetMap Testing]
│   └── OSM Integration
│
├── /test-animations                        [Animation Testing]
│   └── Framer Motion Tests
│
└── /optimized-components                   [Performance Testing]
    └── Component Optimization

┌─────────────────────────────────────────────────────────────────────┐
│                         LAYOUT COMPONENTS                            │
└─────────────────────────────────────────────────────────────────────┘

📐 PERSISTENT UI ELEMENTS (on all authenticated pages)

├── Icon Sidebar (Left - 64px)
│   ├── 🏠 Home
│   ├── 📊 Analysis
│   ├── 📢 Campaigns
│   ├── 📱 Social Feed
│   ├── 👤 Profiles
│   ├── 📍 Locations
│   ├── 🏢 Organizations
│   ├── 🎯 Entities
│   ├── 🔍 OSINT Tools
│   └── ⚙️ Settings
│
├── Main Sidebar (256px)
│   ├── User Profile Section
│   ├── Navigation Menu
│   ├── Quick Actions
│   ├── Recent Items
│   └── Collapse Toggle
│
├── Top Bar (Full Width)
│   ├── Breadcrumbs
│   ├── Global Search
│   ├── Notifications Bell
│   ├── Theme Toggle
│   └── User Menu
│       ├── Profile
│       ├── Settings
│       └── Logout
│
└── Main Content Area
    └── Page Content

┌─────────────────────────────────────────────────────────────────────┐
│                         GLOBAL UI FEATURES                           │
└─────────────────────────────────────────────────────────────────────┘

⌨️ KEYBOARD SHORTCUTS
├── Cmd/Ctrl + K         → Quick Actions (Command Palette)
├── ?                    → Show Shortcuts Dialog
├── Cmd/Ctrl + /         → Global Search
├── Esc                  → Close Modals/Dialogs
├── Tab                  → Navigate Focusable Elements
└── Shift + Tab          → Navigate Backwards

🔔 NOTIFICATIONS
├── Toast Notifications
│   ├── Success (Green)
│   ├── Error (Red)
│   ├── Warning (Orange)
│   └── Info (Blue)
│
└── In-App Notifications
    ├── Notification Bell
    ├── Notification List
    └── Mark as Read

🎨 THEME SYSTEM
├── Dark Mode (Default)
├── Light Mode
└── System Preference

📱 RESPONSIVE BREAKPOINTS
├── Desktop:  > 1024px   (Full Layout)
├── Tablet:   768-1024px (Adapted Layout)
└── Mobile:   < 768px    (Mobile Layout + Hamburger Menu)

```

---

## 📊 Testing Priority by Module

### Priority 0 - Critical (Test First)
- [ ] Authentication (Login/Signup/Logout)
- [ ] Dashboard Display
- [ ] Start Analysis
- [ ] View Analysis Results
- [ ] Basic Navigation

### Priority 1 - High (Test Second)
- [ ] Analysis History
- [ ] Social Feed
- [ ] Profile Views
- [ ] Campaign Monitoring
- [ ] Export Features

### Priority 2 - Medium (Test Third)
- [ ] Locations & Maps
- [ ] Organizations
- [ ] Entities
- [ ] Advanced Filters
- [ ] Search Functionality

### Priority 3 - Low (Test Last)
- [ ] OSINT Tools
- [ ] Communities
- [ ] Debug Pages
- [ ] Animation Tests
- [ ] Edge Cases

---

## 🎯 Quick Test Paths

### Path 1: Complete Analysis Flow (5 min)
```
/login → / → /start-analysis → /analysis-history/[id] → logout
```

### Path 2: Social Media Flow (5 min)
```
/login → /social-feed → /profiles → /profiles/[id] → logout
```

### Path 3: Campaign Flow (5 min)
```
/login → /start-analysis (save as campaign) → /campaign/[id] → logout
```

### Path 4: Location Flow (3 min)
```
/login → /locations → /locations/[id] → logout
```

### Path 5: OSINT Flow (3 min)
```
/login → /osint-tools → [test tool] → logout
```

---

## 📝 Notes for Testers

1. **Video Backgrounds**: Auth pages have animated video backgrounds - verify they play and don't impact performance

2. **Infinite Scroll**: Many pages use infinite scroll - test by scrolling to bottom and verifying more items load

3. **Real-time Updates**: Campaign pages should show real-time updates - test with monitoring active

4. **Glassmorphism**: Auth pages use glassmorphism effects - verify backdrop blur and transparency work across browsers

5. **Responsive**: Test ALL pages at mobile, tablet, and desktop sizes

6. **API Calls**: Check browser Network tab to verify API calls are successful (200 status)

7. **Console Errors**: Keep browser console open - report any errors or warnings

8. **Session Persistence**: After login, refresh page - should stay logged in

9. **Protected Routes**: Try accessing protected routes without login - should redirect to `/login`

10. **Loading States**: Verify loading skeletons appear before data loads

---

**Last Updated**: May 9, 2025

