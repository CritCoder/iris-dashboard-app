# Quick Start Guide - Enhanced Frontend

## 🎉 What's New
Your beautiful frontend now has **full functionality** from the working osint-fe, while maintaining its stunning design!

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd /Users/layan/Desktop/combined/new-fe
npm install
# or
yarn install
```

### 2. Environment Setup
Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://irisnet.wiredleap.com
```

### 3. Run the Application
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000`

## 📱 Key Features Now Available

### Dashboard (`/`)
- Real-time campaign statistics
- Sentiment analysis
- Trending topics
- Influencer tracking
- Support base analysis
- Customizable widgets

### Start Analysis (`/start-analysis`)
- Create new campaigns
- Multiple campaign types (Person, Post, Keyword)
- Platform selection
- Date range configuration

### Analysis History (`/analysis-history`)
- View all campaigns
- Search and filter
- Monitor active campaigns
- Campaign detail views with:
  - Post analytics
  - Sentiment charts  
  - Platform distribution
  - Timeline analysis

### Social Feed (`/social-feed`)
- Real-time posts from all platforms
- Advanced filtering (platform, sentiment, time range)
- Search functionality
- Export to PDF

### Profiles (`/profiles`)
- Browse all social profiles
- Filter by platform, followers, verification status
- Profile detail views with:
  - Post history
  - AI analysis
  - Engagement metrics

### Entities (`/entities`)
- Explore mentioned entities
- Trending entities
- Entity detail views with posts
- Sentiment analysis per entity

### Locations (`/locations`)
- Geographic analysis
- Location-based posts
- Activity heatmaps

### Social Inbox (`/social-inbox`)
- Priority inbox for important posts
- Workflow management
- Classification and tagging
- Notes and actions

### OSINT Tools (`/osint-tools`)
- Mobile number lookup
- Vehicle registration search
- Truecaller integration
- Unified search interface

### Groups (`/communities-groups`)
- Facebook groups monitoring
- Instagram community tracking
- Group post analysis

## 🔑 Key Files

### API Integration
- `/lib/apiService.ts` - Main API service (NEW - comprehensive)
- `/lib/api.ts` - Secondary API layer (updated)
- `/contexts/auth-context.tsx` - Authentication (NEW)

### Utilities
- `/lib/pdfExport.ts` - PDF export functionality (NEW)
- `/lib/auth-utils.ts` - Auth helpers (updated)

### Pages
All pages in `/app` directory are functional:
- `/` - Dashboard
- `/start-analysis` - Campaign creation
- `/analysis-history` - Campaign list
- `/analysis-history/[id]` - Campaign details
- `/social-feed` - Posts feed
- `/profiles` - Profile list
- `/profiles/[id]` - Profile details
- `/entities` - Entity exploration
- `/locations` - Location analysis  
- `/social-inbox` - Priority inbox
- `/osint-tools` - Intelligence tools
- `/communities-groups` - Groups

## 💡 Usage Examples

### Fetch Campaigns
```typescript
import { campaignApi } from '@/lib/apiService'

// Get all campaigns
const response = await campaignApi.getAll(1, 10)
const campaigns = response.data

// Search campaigns
const results = await campaignApi.search('search term')
```

### Get Profile Data
```typescript
import { socialApi } from '@/lib/apiService'

// Get all profiles
const profiles = await socialApi.profiles.getAll(1, 50)

// Get profile details
const profile = await socialApi.profiles.getById(profileId)

// Get profile posts
const posts = await socialApi.profiles.getPosts(profileId)

// Get AI analysis
const analysis = await socialApi.profiles.getAiAnalysis(profileId)
```

### Export to PDF
```typescript
import { exportPostsToPDF } from '@/lib/pdfExport'

// Export current posts
await exportPostsToPDF(posts, filters, searchQuery)
```

### Use Authentication
```typescript
import { useAuth } from '@/contexts/auth-context'

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()
  
  if (!isAuthenticated) {
    return <Login />
  }
  
  return <Dashboard user={user} />
}
```

## 🎨 Design Features

All original design features are preserved:
- ✅ Framer Motion animations
- ✅ Smooth page transitions
- ✅ Hover effects and interactions
- ✅ Responsive design
- ✅ Dark/Light mode support
- ✅ Skeleton loaders
- ✅ Toast notifications
- ✅ Rich tooltips

## 🔧 Development

### Project Structure
```
new-fe/
├── app/                    # Next.js 15 app directory
│   ├── page.tsx           # Dashboard
│   ├── analysis-history/  # Campaign pages
│   ├── social-feed/       # Feed page
│   ├── profiles/          # Profile pages
│   └── ...
├── components/            # Reusable components
│   ├── ui/               # Design system components
│   ├── dashboard/        # Dashboard widgets
│   ├── layout/           # Layout components
│   └── ...
├── contexts/             # React contexts
│   ├── auth-context.tsx  # Authentication (NEW)
│   └── theme-context.tsx # Theme provider
├── lib/                  # Utilities and services
│   ├── apiService.ts    # Unified API (NEW)
│   ├── api.ts           # Secondary API
│   ├── pdfExport.ts     # PDF export (NEW)
│   └── ...
└── hooks/               # Custom React hooks
```

### Adding New Features
1. Create page in `/app` directory
2. Use existing components from `/components/ui`
3. Import API methods from `/lib/apiService.ts`
4. Add route to `/components/dashboard/nav-config.ts`

## 📊 API Reference

### Campaign APIs
```typescript
campaignApi.getAll(page, limit, filters)
campaignApi.getById(id)
campaignApi.create(data)
campaignApi.getData(id, page, limit, platforms, cursor, sentimentParams)
campaignApi.startMonitoring(id)
campaignApi.stopMonitoring(id)
```

### Social APIs
```typescript
socialApi.profiles.getAll(page, limit, filters, cursor)
socialApi.profiles.getById(id)
socialApi.profiles.getDetails(id)
socialApi.profiles.getPosts(id)
socialApi.profiles.getAiAnalysis(id)

socialApi.posts.getAll(page, limit, filters)
socialApi.posts.getHourlyData()

socialApi.entities.getAnalytics(filters)
socialApi.entities.search(query)

socialApi.locations.getAnalytics(filters)
socialApi.locations.search(query)
```

### OSINT APIs
```typescript
osintApi.ironveilSearch(data)
osintApi.mobileToPAN(data)
osintApi.truecallerSearch(data)
osintApi.vehicleUnified(data)
```

## 🐛 Troubleshooting

### API Not Connecting
- Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
- Verify backend is running
- Check browser console for errors

### Authentication Issues
- Clear localStorage: `localStorage.clear()`
- Check token is being stored: `localStorage.getItem('token')`
- Verify backend auth endpoint is working

### Styling Issues
- Run `npm run dev` to ensure Tailwind is compiling
- Check browser dev tools for CSS errors
- Verify no conflicting class names

## 🎯 Next Steps
1. Customize dashboard widgets
2. Add new OSINT tool integrations
3. Enhance export functionality
4. Add more chart types
5. Implement real-time updates

## 📚 Resources
- Next.js 15 Docs: https://nextjs.org/docs
- Radix UI: https://www.radix-ui.com
- Framer Motion: https://www.framer.com/motion
- Tailwind CSS: https://tailwindcss.com

## ✅ Complete!
Your frontend is now **fully functional** with beautiful design intact. All features from osint-fe are now available with a superior user experience!

