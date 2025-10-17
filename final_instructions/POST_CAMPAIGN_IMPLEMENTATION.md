# Post Campaign Feature Implementation

## Overview
Implemented the post campaign feature in new-fe, allowing users to create and view detailed post analysis campaigns when clicking on posts in the social feed page. The functionality is copied from osint-fe but with the new-fe UI design system.

## Changes Made

### 1. Social Feed Page (`/app/social-feed/page.tsx`)

#### Updated Imports
- Added `campaignApi` from `@/lib/api`

#### Interface Updates
- Added `platformPostId` and `url` fields to the `Post` interface
- Created new `PostCardProps` interface with `onClick` and `isCreatingCampaign` props

#### New State
- Added `creatingCampaign` state to track which post is currently creating a campaign

#### Post Campaign Creation Function
```typescript
const createPostCampaign = useCallback(async (post: any, redirectToPostCampaignView = true, openInNewTab = false) => {
  // 1. Checks if campaign exists for the post using campaignApi.checkPostCampaign()
  // 2. If exists, redirects to existing campaign
  // 3. If not exists, creates new campaign using campaignApi.createSearch()
  // 4. Stores post data in sessionStorage for quick loading
  // 5. Redirects to /post-campaign/[campaignId]
}, [router])
```

#### Updated PostCard Component
- Changed from `Link` wrapper to clickable `div`
- Added `onClick` handler to trigger campaign creation
- Added loading overlay when campaign is being created
- Shows "Creating campaign..." message during creation

#### Updated Post Transformation
- Added `platformPostId` and `url` fields when transforming API posts

### 2. Post Campaign Page (`/app/post-campaign/[id]/page.tsx`)

Completely rewrote the page with actual API integration:

#### New Interfaces
```typescript
interface Post {
  id: string
  content: string
  platform: string
  platformPostId?: string
  url?: string
  postedAt?: string
  likesCount?: number
  commentsCount?: number
  sharesCount?: number
  viewsCount?: number
  aiSentiment?: string
  aiSummary?: string
  aiRelevanceScore?: number
  social_profile?: { ... }
  person?: { ... }
  aiAnalysis?: any
}

interface Comment {
  id: string
  content: string
  platform: string
  postedAt: string
  // ... engagement metrics
}

interface AIReply {
  policeResponse: string
  generatedAt: string
}
```

#### State Management
- `campaign`: Campaign details
- `originalPost`: The post being analyzed
- `comments`: Array of comments on the post
- `aiReply`: AI-generated response for the post
- Loading and error states for all data

#### Core Functions

**loadCampaignData()**
1. Tries to load post from sessionStorage (instant load)
2. Fetches campaign details from API
3. Fetches original post from campaign API
4. Updates state with loaded data

**loadComments()**
- Fetches comments for the post using `campaignApi.getComments()`
- Updates comments state

**generateAiReply()**
- Calls `socialApi.getPostAIReport()` to generate AI response
- Auto-generates when post loads
- Can be manually regenerated

**copyReplyToClipboard()**
- Copies AI response to clipboard
- Shows "Copied!" confirmation

#### UI Layout

**Left Panel - Post & Comments**
- Original post card with:
  - Author information
  - Platform badge
  - Post content
  - Engagement metrics (likes, comments, shares, views)
  - Sentiment badge
- Comments section with:
  - Comment count
  - Loading indicator
  - Scrollable list of comments
  - Each comment shows author, content, metrics, sentiment

**Right Panel - AI Analysis**
- AI Summary section (if available)
- Relevance score with progress bar
- AI Quick Reply section:
  - Regenerate button
  - AI-generated response display
  - Editable textarea for customization
  - Copy to clipboard button

#### Helper Functions
- `formatDate()`: Formats timestamps
- `formatNumber()`: Formats large numbers (1.2K, 3.5M)
- `getSentimentColor()`: Returns color classes for sentiment
- `getSentimentBadgeColor()`: Returns badge variant for sentiment

## User Flow

1. User browses posts in the social feed page
2. User clicks on a post
3. System checks if campaign exists for that post
4. If exists: redirects to existing campaign
5. If not: creates new campaign and redirects
6. Post campaign page loads showing:
   - Original post details
   - Comments (loading in real-time)
   - AI analysis and summary
   - AI-generated quick reply
7. User can:
   - View all comments
   - Generate/regenerate AI replies
   - Edit the AI response
   - Copy the response to clipboard
   - Navigate back to social feed

## API Integration

### Endpoints Used

**Campaign API:**
- `campaignApi.checkPostCampaign(postId, platformPostId, platform)` - Check if campaign exists
- `campaignApi.createSearch({ topic, timeRange, platforms, campaignType: 'POST', postDetails })` - Create new campaign
- `campaignApi.getById(campaignId)` - Get campaign details
- `campaignApi.getOriginalPost(campaignId)` - Get original post
- `campaignApi.getComments(postId)` - Get post comments

**Social API:**
- `socialApi.getPostAIReport(postId)` - Generate AI report/reply

## Data Flow

### Creating a Campaign
```
1. User clicks post
2. Check existing campaign (API call)
3. If not exists, create campaign (API call)
4. Store post in sessionStorage
5. Redirect to /post-campaign/[campaignId]
```

### Loading Campaign Page
```
1. Load post from sessionStorage (instant)
2. Load campaign from API (background)
3. Load original post from API (background)
4. Load comments from API (background)
5. Generate AI reply (background)
```

## Features

### Social Feed Enhancements
- ✅ Click-to-create campaign on posts
- ✅ Loading state during campaign creation
- ✅ Automatic campaign detection (reuses existing)
- ✅ SessionStorage caching for instant loading

### Post Campaign Page
- ✅ Complete post details display
- ✅ Comments tracking and display
- ✅ AI-powered post analysis
- ✅ AI-generated quick replies
- ✅ Editable response text
- ✅ Copy to clipboard functionality
- ✅ Real-time comment loading
- ✅ Sentiment analysis display
- ✅ Engagement metrics
- ✅ Back navigation

## UI/UX Improvements

1. **Loading States**: Clear loading indicators for all async operations
2. **Error Handling**: Graceful error messages with retry options
3. **Instant Feedback**: SessionStorage caching for fast initial load
4. **Clean Layout**: Two-panel design separating content from analysis
5. **Responsive Design**: Adapts to different screen sizes
6. **Accessibility**: Proper semantic HTML and ARIA labels

## Technical Details

### SessionStorage Usage
```typescript
// Store on campaign creation
sessionStorage.setItem(`originalPost_${campaignId}`, JSON.stringify(post))

// Retrieve on page load
const cachedPost = sessionStorage.getItem(`originalPost_${campaignId}`)
```

### Campaign Type
All post campaigns are created with `campaignType: 'POST'` and include:
```typescript
{
  topic: `Post Analysis: ${post.content?.substring(0, 50)}...`,
  timeRange: { startDate, endDate }, // Last 7 days
  platforms: [platform],
  campaignType: 'POST',
  postDetails: {
    originalPostId: post.id,
    postId: post.id,
    platformPostId: post.platformPostId || post.id,
    url: post.url || '',
    tweetId: post.platformPostId // Twitter specific
  }
}
```

## Benefits

1. **Seamless Integration**: Natural flow from browsing to analysis
2. **No Duplicate Campaigns**: Reuses existing campaigns for same posts
3. **Fast Loading**: SessionStorage caching provides instant initial load
4. **Complete Analysis**: Full post details, comments, and AI insights
5. **Action Ready**: AI-generated responses ready to copy and use
6. **Consistent UX**: Maintains new-fe design system throughout

## Future Enhancements

Potential improvements:
- Auto-refresh comments at intervals
- Comment filtering by sentiment
- Export campaign data
- Share campaign link
- Email notifications for new comments
- Comment reply functionality
- Sentiment trend over time

## Testing

To test the feature:
1. Navigate to `/social-feed`
2. Click on any post
3. Verify campaign is created (or existing one is loaded)
4. Check post details are displayed correctly
5. Verify comments load (if available)
6. Generate AI reply
7. Copy and paste to verify clipboard functionality
8. Click back to return to social feed
9. Click same post again to verify existing campaign is reused

## Dependencies

No new dependencies added. Uses existing:
- `@/lib/api` - API client
- `@/components/ui/*` - UI components
- `next/navigation` - Routing
- React hooks - State management

