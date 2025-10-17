# IRIS Dashboard - Comprehensive Test Plan

**Project**: IRIS Intelligence Platform  
**Date**: May 9, 2025  
**Version**: 1.0  
**Environment**: http://localhost:3000

---

## Table of Contents
1. [Authentication & Authorization](#1-authentication--authorization)
2. [Dashboard & Navigation](#2-dashboard--navigation)
3. [Analysis & Campaigns](#3-analysis--campaigns)
4. [Social Feed & Profiles](#4-social-feed--profiles)
5. [Locations & Maps](#5-locations--maps)
6. [Organizations & Entities](#6-organizations--entities)
7. [OSINT Tools](#7-osint-tools)
8. [UI Components & Interactions](#8-ui-components--interactions)
9. [API Integration](#9-api-integration)
10. [Performance & Responsiveness](#10-performance--responsiveness)

---

## 1. Authentication & Authorization

### 1.1 Login Page
**Location**: `/login` (`app/login/page.tsx`)

#### Test Cases:

**TC-AUTH-001: Mobile Number Login**
- [ ] Navigate to `/login`
- [ ] Verify page displays full-screen with video background
- [ ] Verify IRIS logo is animated (3D rotation)
- [ ] Select "Mobile" tab
- [ ] Enter valid 10-digit mobile number: `9876543210`
- [ ] Click "Send OTP"
- [ ] Verify OTP sent success message appears
- [ ] Verify redirect to `/login/verify-otp`
- [ ] **Expected**: OTP sent successfully, redirected to verification page

**TC-AUTH-002: Email Login**
- [ ] Navigate to `/login`
- [ ] Select "Email" tab
- [ ] Verify smooth transition animation between tabs
- [ ] Enter valid email: `test@example.com`
- [ ] Click "Send OTP"
- [ ] Verify OTP sent success message
- [ ] Verify redirect to `/login/verify-otp`
- [ ] **Expected**: OTP sent successfully, redirected to verification page

**TC-AUTH-003: Invalid Mobile Number**
- [ ] Navigate to `/login`
- [ ] Select "Mobile" tab
- [ ] Enter invalid numbers: `123`, `abcd`, `12345678901`
- [ ] Click "Send OTP"
- [ ] Verify error message: "Invalid phone number format"
- [ ] **Expected**: Error message displayed, no API call made

**TC-AUTH-004: Invalid Email Format**
- [ ] Navigate to `/login`
- [ ] Select "Email" tab
- [ ] Enter invalid email: `notanemail`, `test@`, `@example.com`
- [ ] Click "Send OTP"
- [ ] Verify error message displayed
- [ ] **Expected**: Validation error before submission

**TC-AUTH-005: Empty Form Submission**
- [ ] Navigate to `/login`
- [ ] Leave all fields empty
- [ ] Verify "Send OTP" button is disabled
- [ ] **Expected**: Button remains disabled

**TC-AUTH-006: Loading State**
- [ ] Navigate to `/login`
- [ ] Enter valid mobile number
- [ ] Click "Send OTP"
- [ ] Verify button shows loading spinner
- [ ] Verify button text changes to "Sending OTP..."
- [ ] Verify button is disabled during loading
- [ ] **Expected**: Loading state visible, button disabled

**TC-AUTH-007: Terms and Privacy Links**
- [ ] Navigate to `/login`
- [ ] Scroll to footer
- [ ] Click "Terms of Service"
- [ ] Verify modal opens with terms content
- [ ] Close modal
- [ ] Click "Privacy Policy"
- [ ] Verify modal opens with privacy content
- [ ] **Expected**: Modals open and close correctly

**TC-AUTH-008: India Flag Display**
- [ ] Navigate to `/login`
- [ ] Select "Mobile" tab
- [ ] Verify India flag SVG is displayed
- [ ] Verify country code "+91" is shown
- [ ] **Expected**: Flag and country code visible

---

### 1.2 OTP Verification (Login)
**Location**: `/login/verify-otp` (`app/login/verify-otp/page.tsx`)

#### Test Cases:

**TC-AUTH-009: OTP Input Auto-Focus**
- [ ] Complete login flow to reach OTP page
- [ ] Verify first OTP input is auto-focused
- [ ] **Expected**: Cursor in first input field

**TC-AUTH-010: Valid OTP Entry**
- [ ] Enter 6-digit OTP: `123456`
- [ ] Verify auto-advance to next input after each digit
- [ ] Verify auto-submit after 6th digit
- [ ] Verify loading state
- [ ] Verify redirect to dashboard on success
- [ ] **Expected**: Successfully logged in, redirected to `/`

**TC-AUTH-011: Invalid OTP**
- [ ] Enter incorrect OTP: `000000`
- [ ] Verify error message: "Invalid OTP"
- [ ] Verify inputs are not cleared
- [ ] **Expected**: Error displayed, can retry

**TC-AUTH-012: OTP Timer**
- [ ] Wait for timer countdown (120 seconds)
- [ ] Verify timer displays correctly: "120s", "119s", etc.
- [ ] Wait until timer reaches 0
- [ ] Verify "Resend code" button appears
- [ ] **Expected**: Timer counts down, resend option appears

**TC-AUTH-013: Resend OTP**
- [ ] Wait for timer to expire
- [ ] Click "Resend code"
- [ ] Verify success message
- [ ] Verify timer resets to 120s
- [ ] Verify OTP inputs are cleared
- [ ] **Expected**: New OTP sent, timer restarted

**TC-AUTH-014: Backspace Navigation**
- [ ] Enter 3 digits
- [ ] Press backspace in 4th input
- [ ] Verify cursor moves to 3rd input
- [ ] **Expected**: Backspace navigates to previous input

**TC-AUTH-015: Edit Phone Number**
- [ ] Click edit icon next to phone number
- [ ] Verify redirect to `/login`
- [ ] **Expected**: Returned to login page

**TC-AUTH-016: Back Button**
- [ ] Click "Back to login" button (top-left)
- [ ] Verify redirect to `/login`
- [ ] **Expected**: Returned to login page

---

### 1.3 Signup Page
**Location**: `/signup` (`app/signup/page.tsx`)

#### Test Cases:

**TC-AUTH-017: Mobile Signup - Full Flow**
- [ ] Navigate to `/signup`
- [ ] Verify full-screen design with video background
- [ ] Select "Mobile" tab
- [ ] Enter full name: `John Doe`
- [ ] Enter mobile: `9876543210`
- [ ] Enter password: `Test@1234`
- [ ] Enter confirm password: `Test@1234`
- [ ] Check terms checkbox
- [ ] Click "Create Account"
- [ ] Verify redirect to `/signup/verify-otp`
- [ ] **Expected**: Account creation initiated

**TC-AUTH-018: Email Signup - Full Flow**
- [ ] Navigate to `/signup`
- [ ] Select "Email" tab
- [ ] Enter full name: `Jane Smith`
- [ ] Enter email: `jane@example.com`
- [ ] Enter password: `Test@1234`
- [ ] Enter confirm password: `Test@1234`
- [ ] Check terms checkbox
- [ ] Click "Create Account"
- [ ] **Expected**: Account creation initiated

**TC-AUTH-019: Password Strength Validation**
- [ ] Navigate to `/signup`
- [ ] Enter passwords of varying strength:
  - `123` - Should show weak/no indicators
  - `test1234` - Should show partial indicators
  - `Test@1234` - Should show strong indicators
- [ ] **Expected**: Password strength indicators update dynamically

**TC-AUTH-020: Password Mismatch**
- [ ] Enter password: `Test@1234`
- [ ] Enter confirm password: `Test@5678`
- [ ] Verify error message
- [ ] Verify submit button is disabled
- [ ] **Expected**: Error shown, cannot submit

**TC-AUTH-021: Show/Hide Password**
- [ ] Enter password
- [ ] Click eye icon
- [ ] Verify password is visible
- [ ] Click eye icon again
- [ ] Verify password is hidden
- [ ] **Expected**: Password visibility toggles correctly

**TC-AUTH-022: Terms Checkbox Required**
- [ ] Fill all fields correctly
- [ ] Leave terms checkbox unchecked
- [ ] Try to submit
- [ ] Verify submit button is disabled
- [ ] **Expected**: Cannot submit without accepting terms

**TC-AUTH-023: Form Persistence**
- [ ] Enter data in form fields
- [ ] Refresh page (or navigate away and back)
- [ ] Verify form data is restored from localStorage
- [ ] **Expected**: Form data persists across page loads

**TC-AUTH-024: Sign In Link**
- [ ] Click "Sign in" link at bottom
- [ ] Verify redirect to `/login`
- [ ] **Expected**: Redirected to login page

---

### 1.4 Forgot Password
**Location**: `/forgot-password` (`app/forgot-password/page.tsx`)

#### Test Cases:

**TC-AUTH-025: Email Reset Request**
- [ ] Navigate to `/forgot-password`
- [ ] Select "Email" tab
- [ ] Enter email: `test@example.com`
- [ ] Click "Send Verification Code"
- [ ] Verify success message
- [ ] Verify redirect to `/forgot-password/verify-otp`
- [ ] **Expected**: Reset code sent

**TC-AUTH-026: Mobile Reset Request**
- [ ] Navigate to `/forgot-password`
- [ ] Select "Mobile" tab
- [ ] Enter mobile: `9876543210`
- [ ] Click "Send Verification Code"
- [ ] Verify success message
- [ ] **Expected**: Reset code sent to mobile

**TC-AUTH-027: Back to Login**
- [ ] Click "Back to login" button
- [ ] Verify redirect to `/login`
- [ ] **Expected**: Returned to login page

**TC-AUTH-028: Invalid Input Handling**
- [ ] Enter invalid email/mobile
- [ ] Verify error message
- [ ] **Expected**: Validation error shown

---

### 1.5 Reset Password
**Location**: `/forgot-password/reset` (`app/forgot-password/reset/page.tsx`)

#### Test Cases:

**TC-AUTH-029: Password Requirements Display**
- [ ] Navigate to reset page (after OTP verification)
- [ ] Verify password requirements list is visible
- [ ] Requirements should include:
  - At least 8 characters
  - Contains uppercase letter
  - Contains lowercase letter
  - Contains number
  - Contains special character
- [ ] **Expected**: All requirements listed

**TC-AUTH-030: Password Requirements Validation**
- [ ] Enter password: `test`
- [ ] Verify no requirements are met (red/gray indicators)
- [ ] Enter password: `Test1234!`
- [ ] Verify all requirements are met (green indicators)
- [ ] **Expected**: Requirements update dynamically

**TC-AUTH-031: Successful Password Reset**
- [ ] Enter new password: `NewTest@1234`
- [ ] Enter confirm password: `NewTest@1234`
- [ ] Verify all requirements are met
- [ ] Click "Reset Password"
- [ ] Verify success message
- [ ] Verify redirect to `/login`
- [ ] **Expected**: Password reset successfully

**TC-AUTH-032: Show/Hide Password Toggles**
- [ ] Enter password in both fields
- [ ] Toggle visibility on password field
- [ ] Toggle visibility on confirm password field
- [ ] Verify both work independently
- [ ] **Expected**: Password visibility toggles independently

---

## 2. Dashboard & Navigation

### 2.1 Main Dashboard
**Location**: `/` (`app/page.tsx`)

#### Test Cases:

**TC-DASH-001: Dashboard Load**
- [ ] Login successfully
- [ ] Verify redirect to main dashboard
- [ ] Verify dual sidebar is visible
- [ ] Verify icon sidebar (left, 64px)
- [ ] Verify main sidebar (256px)
- [ ] Verify main content area
- [ ] **Expected**: Dashboard loads with all components

**TC-DASH-002: Icon Sidebar Navigation**
- [ ] Verify all icon buttons are visible:
  - Home
  - Analysis
  - Campaigns
  - Social Feed
  - Profiles
  - Locations
  - Organizations
  - Entities
  - OSINT Tools
  - Settings
- [ ] Click each icon
- [ ] Verify corresponding route loads
- [ ] **Expected**: Navigation works for all icons

**TC-DASH-003: Main Sidebar**
- [ ] Verify main sidebar shows:
  - User profile section
  - Navigation menu
  - Quick actions
  - Recent items
- [ ] Click navigation items
- [ ] Verify routes change correctly
- [ ] **Expected**: Sidebar navigation functional

**TC-DASH-004: Active Route Highlighting**
- [ ] Navigate to different pages
- [ ] Verify active route is highlighted in sidebar
- [ ] Verify icon sidebar shows active icon
- [ ] **Expected**: Active state shows correctly

**TC-DASH-005: Responsive Sidebar Behavior**
- [ ] Resize browser window
- [ ] Test at breakpoints: 1920px, 1440px, 1024px, 768px, 375px
- [ ] Verify sidebar adapts correctly
- [ ] **Expected**: Responsive behavior works

**TC-DASH-006: Dashboard Stats Grid**
- [ ] Verify stats cards are displayed
- [ ] Check data loads correctly
- [ ] Verify numbers are formatted
- [ ] Verify trend indicators work
- [ ] **Expected**: Stats display correctly

**TC-DASH-007: Quick Actions (Cmd+K)**
- [ ] Press `Cmd+K` (Mac) or `Ctrl+K` (Windows)
- [ ] Verify command palette opens
- [ ] Type search query
- [ ] Verify results appear
- [ ] Select a result
- [ ] Verify navigation works
- [ ] **Expected**: Quick actions functional

**TC-DASH-008: Keyboard Shortcuts Dialog**
- [ ] Press `?` key
- [ ] Verify shortcuts dialog opens
- [ ] Verify all shortcuts are listed
- [ ] Close dialog
- [ ] Test listed shortcuts
- [ ] **Expected**: Shortcuts work as documented

**TC-DASH-009: Theme Toggle**
- [ ] Locate theme toggle button
- [ ] Click to switch theme
- [ ] Verify theme changes (dark/light)
- [ ] Refresh page
- [ ] Verify theme persists
- [ ] **Expected**: Theme toggles and persists

**TC-DASH-010: User Profile Menu**
- [ ] Click user profile/avatar
- [ ] Verify dropdown menu appears
- [ ] Options should include:
  - Profile
  - Settings
  - Logout
- [ ] **Expected**: Profile menu accessible

**TC-DASH-011: Logout Functionality**
- [ ] Click user profile
- [ ] Click "Logout"
- [ ] Verify redirect to `/login`
- [ ] Try accessing protected route
- [ ] Verify redirect back to login
- [ ] **Expected**: Logged out successfully

---

### 2.2 Page Transitions
**Location**: All pages (uses `components/layout/page-transition.tsx`)

#### Test Cases:

**TC-NAV-001: Route Change Animation**
- [ ] Navigate between pages
- [ ] Verify smooth fade/slide transition
- [ ] Verify no layout shift
- [ ] **Expected**: Smooth animations

**TC-NAV-002: Loading Progress Bar**
- [ ] Navigate to a page
- [ ] Verify progress bar appears at top
- [ ] Verify it completes on page load
- [ ] **Expected**: Progress indicator works

---

## 3. Analysis & Campaigns

### 3.1 Start Analysis
**Location**: `/start-analysis` (`app/start-analysis/page.tsx`)

#### Test Cases:

**TC-ANALYSIS-001: Search Input**
- [ ] Navigate to `/start-analysis`
- [ ] Verify search input is visible
- [ ] Enter search query: `climate change`
- [ ] Verify character count updates
- [ ] **Expected**: Input accepts text

**TC-ANALYSIS-002: Platform Selection**
- [ ] Verify platform checkboxes are visible:
  - Twitter/X
  - Facebook
  - Instagram
  - LinkedIn
  - Reddit
  - YouTube
- [ ] Select multiple platforms
- [ ] Verify selection state updates
- [ ] **Expected**: Multiple platforms selectable

**TC-ANALYSIS-003: Time Range Selection**
- [ ] Verify time range options:
  - Last 24 hours
  - Last 7 days
  - Last 30 days
  - Custom range
- [ ] Select each option
- [ ] For custom, select date range
- [ ] **Expected**: Time range selectable

**TC-ANALYSIS-004: Content Type Filter**
- [ ] Verify content type options:
  - Posts
  - Images
  - Videos
  - Links
- [ ] Select multiple types
- [ ] **Expected**: Content types selectable

**TC-ANALYSIS-005: Advanced Filters**
- [ ] Expand advanced filters section
- [ ] Verify options:
  - Language
  - Location
  - Minimum engagement
  - Verified accounts only
- [ ] Set various filters
- [ ] **Expected**: Filters apply correctly

**TC-ANALYSIS-006: Start Analysis**
- [ ] Fill required fields
- [ ] Click "Start Analysis"
- [ ] Verify loading state
- [ ] Verify redirect to analysis results
- [ ] **Expected**: Analysis starts successfully

**TC-ANALYSIS-007: Save as Campaign**
- [ ] Fill analysis form
- [ ] Enable "Save as campaign" toggle
- [ ] Enter campaign name
- [ ] Start analysis
- [ ] Verify campaign is created
- [ ] **Expected**: Campaign saved

**TC-ANALYSIS-008: Validation Messages**
- [ ] Try submitting empty form
- [ ] Verify validation messages appear
- [ ] Enter minimum required data
- [ ] Verify button enables
- [ ] **Expected**: Validation works

---

### 3.2 Analysis History
**Location**: `/analysis-history` (`app/analysis-history/page.tsx`)

#### Test Cases:

**TC-ANALYSIS-009: History List Display**
- [ ] Navigate to `/analysis-history`
- [ ] Verify list of past analyses
- [ ] Check each item shows:
  - Search query
  - Platforms
  - Date/time
  - Status
  - Quick actions
- [ ] **Expected**: History displays correctly

**TC-ANALYSIS-010: Sort and Filter**
- [ ] Use sort dropdown
- [ ] Sort by: Date, Status, Platform
- [ ] Use filter options
- [ ] Filter by platform, status
- [ ] **Expected**: Sorting and filtering work

**TC-ANALYSIS-011: Search History**
- [ ] Use search bar in history
- [ ] Search for specific analysis
- [ ] Verify results filter correctly
- [ ] **Expected**: Search works

**TC-ANALYSIS-012: View Analysis Details**
- [ ] Click on an analysis item
- [ ] Verify redirect to `/analysis-history/[id]`
- [ ] **Expected**: Details page loads

**TC-ANALYSIS-013: Delete Analysis**
- [ ] Click delete button on an item
- [ ] Verify confirmation dialog
- [ ] Confirm deletion
- [ ] Verify item removed from list
- [ ] **Expected**: Deletion works

**TC-ANALYSIS-014: Export Analysis**
- [ ] Click export button
- [ ] Select format (PDF/CSV)
- [ ] Verify download starts
- [ ] **Expected**: Export functionality works

**TC-ANALYSIS-015: Pagination**
- [ ] Scroll to bottom
- [ ] Verify pagination controls
- [ ] Navigate to next page
- [ ] Verify page number updates
- [ ] **Expected**: Pagination works

---

### 3.3 Analysis Detail View
**Location**: `/analysis-history/[id]` (`app/analysis-history/[id]/page.tsx`)

#### Test Cases:

**TC-ANALYSIS-016: Analysis Overview**
- [ ] Navigate to specific analysis
- [ ] Verify header shows:
  - Search query
  - Date range
  - Platforms analyzed
  - Total posts found
- [ ] **Expected**: Overview data displays

**TC-ANALYSIS-017: Quick Filter Buttons**
- [ ] Verify quick filter buttons:
  - All Posts
  - High Engagement
  - Recent
  - Viral Potential
  - Negative Sentiment
  - Positive Sentiment
- [ ] Click each filter
- [ ] Verify results update
- [ ] **Expected**: Filters work

**TC-ANALYSIS-018: Posts Grid Display**
- [ ] Verify posts are displayed in grid
- [ ] Each post should show:
  - Author info
  - Post content
  - Engagement metrics
  - Platform icon
  - Timestamp
- [ ] **Expected**: Posts display correctly

**TC-ANALYSIS-019: Post Card Interactions**
- [ ] Hover over post card
- [ ] Verify hover effects
- [ ] Click "View Details"
- [ ] Verify post detail opens
- [ ] **Expected**: Interactions work

**TC-ANALYSIS-020: Sentiment Distribution**
- [ ] Scroll to sentiment section
- [ ] Verify chart displays
- [ ] Check data:
  - Positive percentage
  - Negative percentage
  - Neutral percentage
- [ ] **Expected**: Sentiment chart displays

**TC-ANALYSIS-021: Engagement Timeline**
- [ ] Verify timeline chart
- [ ] Check x-axis (time)
- [ ] Check y-axis (engagement)
- [ ] Hover over data points
- [ ] Verify tooltip shows details
- [ ] **Expected**: Timeline chart functional

**TC-ANALYSIS-022: Top Influencers**
- [ ] Verify top influencers list
- [ ] Each should show:
  - Profile picture
  - Username
  - Follower count
  - Engagement rate
- [ ] Click on influencer
- [ ] Verify profile opens
- [ ] **Expected**: Influencers list works

**TC-ANALYSIS-023: Keyword Cloud**
- [ ] Verify keyword/hashtag cloud
- [ ] Check word sizes vary by frequency
- [ ] Click on a keyword
- [ ] Verify filter applies
- [ ] **Expected**: Keyword cloud interactive

**TC-ANALYSIS-024: Export Report**
- [ ] Click "Export Report" button
- [ ] Select format
- [ ] Verify download
- [ ] Open downloaded file
- [ ] Verify content is complete
- [ ] **Expected**: Export works

**TC-ANALYSIS-025: Share Analysis**
- [ ] Click "Share" button
- [ ] Verify share options
- [ ] Copy share link
- [ ] **Expected**: Share functionality works

**TC-ANALYSIS-026: Infinite Scroll**
- [ ] Scroll down posts list
- [ ] Verify more posts load automatically
- [ ] Continue scrolling
- [ ] Verify loading indicator shows
- [ ] **Expected**: Infinite scroll works

**TC-ANALYSIS-027: Back Navigation**
- [ ] Click back button
- [ ] Verify return to history list
- [ ] **Expected**: Navigation works

---

### 3.4 Post Detail View
**Location**: `/analysis-history/[id]/post/[postId]` (`app/analysis-history/[id]/post/[postId]/page.tsx`)

#### Test Cases:

**TC-POST-001: Post Detail Display**
- [ ] Click on a post from analysis
- [ ] Verify full post content loads
- [ ] Verify all metadata displays:
  - Author info
  - Post timestamp
  - Platform
  - Engagement metrics
  - Sentiment score
- [ ] **Expected**: Post details complete

**TC-POST-002: Engagement Breakdown**
- [ ] Verify engagement metrics:
  - Likes
  - Comments
  - Shares
  - Views
  - Click-through rate
- [ ] **Expected**: All metrics visible

**TC-POST-003: Comments/Replies**
- [ ] Scroll to comments section
- [ ] Verify comments are loaded
- [ ] Verify nested replies
- [ ] **Expected**: Comment thread displays

**TC-POST-004: Sentiment Analysis**
- [ ] Check sentiment indicator
- [ ] Verify sentiment score
- [ ] Check sentiment reasoning
- [ ] **Expected**: Sentiment info clear

**TC-POST-005: Related Posts**
- [ ] Scroll to related posts
- [ ] Verify similar posts are shown
- [ ] Click on related post
- [ ] Verify navigation works
- [ ] **Expected**: Related posts functional

---

### 3.5 Campaign Management
**Location**: `/campaign/[id]` (`app/campaign/[id]/page.tsx`)

#### Test Cases:

**TC-CAMPAIGN-001: Campaign Overview**
- [ ] Navigate to a campaign
- [ ] Verify campaign details:
  - Name
  - Status
  - Start/End date
  - Platforms
  - Search queries
- [ ] **Expected**: Overview displays

**TC-CAMPAIGN-002: Monitoring Status**
- [ ] Check monitoring status indicator
- [ ] If active, verify "Stop Monitoring" button
- [ ] If inactive, verify "Start Monitoring" button
- [ ] **Expected**: Status is clear

**TC-CAMPAIGN-003: Start Monitoring**
- [ ] Click "Start Monitoring"
- [ ] Verify confirmation dialog
- [ ] Confirm
- [ ] Verify status updates
- [ ] Verify success message
- [ ] **Expected**: Monitoring starts

**TC-CAMPAIGN-004: Stop Monitoring**
- [ ] Click "Stop Monitoring"
- [ ] Verify confirmation dialog
- [ ] Confirm
- [ ] Verify status updates
- [ ] **Expected**: Monitoring stops

**TC-CAMPAIGN-005: Real-time Updates**
- [ ] With monitoring active
- [ ] Wait for new posts
- [ ] Verify posts appear automatically
- [ ] Verify notification badge updates
- [ ] **Expected**: Real-time updates work

**TC-CAMPAIGN-006: Campaign Settings**
- [ ] Click "Edit Campaign"
- [ ] Modify settings
- [ ] Save changes
- [ ] Verify changes applied
- [ ] **Expected**: Settings update

**TC-CAMPAIGN-007: Delete Campaign**
- [ ] Click "Delete Campaign"
- [ ] Verify confirmation dialog
- [ ] Confirm deletion
- [ ] Verify redirect to campaigns list
- [ ] **Expected**: Campaign deleted

---

### 3.6 Post Campaign
**Location**: `/post-campaign/[id]` (`app/post-campaign/[id]/page.tsx`)

#### Test Cases:

**TC-POSTCAMPAIGN-001: Campaign Results**
- [ ] Navigate to post-campaign page
- [ ] Verify final results display
- [ ] Check summary metrics
- [ ] **Expected**: Results show correctly

**TC-POSTCAMPAIGN-002: Performance Metrics**
- [ ] Verify metrics:
  - Total reach
  - Total engagement
  - Sentiment breakdown
  - Top performers
- [ ] **Expected**: All metrics visible

**TC-POSTCAMPAIGN-003: Export Final Report**
- [ ] Click "Export Report"
- [ ] Select format
- [ ] Verify comprehensive report downloads
- [ ] **Expected**: Export works

---

## 4. Social Feed & Profiles

### 4.1 Social Feed
**Location**: `/social-feed` (`app/social-feed/page.tsx`)

#### Test Cases:

**TC-FEED-001: Feed Display**
- [ ] Navigate to `/social-feed`
- [ ] Verify posts load
- [ ] Verify mixed platform posts
- [ ] **Expected**: Feed displays

**TC-FEED-002: Platform Filter**
- [ ] Use platform filter dropdown
- [ ] Select specific platform
- [ ] Verify only posts from that platform show
- [ ] **Expected**: Filter works

**TC-FEED-003: Sort Options**
- [ ] Use sort dropdown
- [ ] Sort by:
  - Most Recent
  - Most Popular
  - Most Engaging
  - Trending
- [ ] Verify order changes
- [ ] **Expected**: Sorting works

**TC-FEED-004: Infinite Scroll**
- [ ] Scroll down feed
- [ ] Verify automatic loading
- [ ] Verify loading skeleton
- [ ] **Expected**: Infinite scroll works

**TC-FEED-005: Post Interactions**
- [ ] Click on a post
- [ ] Verify detail modal/page opens
- [ ] Click external link
- [ ] Verify opens in new tab
- [ ] **Expected**: Interactions work

**TC-FEED-006: Refresh Feed**
- [ ] Click refresh button
- [ ] Verify feed reloads
- [ ] Verify new posts appear
- [ ] **Expected**: Refresh works

**TC-FEED-007: Empty State**
- [ ] Apply filters with no results
- [ ] Verify empty state message
- [ ] Verify helpful suggestions
- [ ] **Expected**: Empty state clear

**TC-FEED-008: Error State**
- [ ] Simulate network error
- [ ] Verify error message
- [ ] Click retry button
- [ ] Verify retry works
- [ ] **Expected**: Error handling works

---

### 4.2 Social Inbox
**Location**: `/social-inbox` (`app/social-inbox/page.tsx`)

#### Test Cases:

**TC-INBOX-001: Inbox Display**
- [ ] Navigate to `/social-inbox`
- [ ] Verify messages/notifications list
- [ ] Check grouping by platform
- [ ] **Expected**: Inbox displays

**TC-INBOX-002: Message Filtering**
- [ ] Use filter options:
  - All
  - Unread
  - Mentions
  - Direct Messages
  - Comments
- [ ] Verify filtering works
- [ ] **Expected**: Filters work

**TC-INBOX-003: Mark as Read**
- [ ] Click on unread message
- [ ] Verify marks as read
- [ ] Verify unread count decreases
- [ ] **Expected**: Read status updates

**TC-INBOX-004: Mark All as Read**
- [ ] Click "Mark all as read"
- [ ] Verify all messages marked
- [ ] Verify unread count resets
- [ ] **Expected**: Bulk action works

**TC-INBOX-005: Reply to Message**
- [ ] Open a message
- [ ] Type reply
- [ ] Send
- [ ] Verify sent successfully
- [ ] **Expected**: Reply works

**TC-INBOX-006: Delete Message**
- [ ] Select message
- [ ] Click delete
- [ ] Confirm
- [ ] Verify removed
- [ ] **Expected**: Delete works

---

### 4.3 Profiles List
**Location**: `/profiles` (`app/profiles/page.tsx`)

#### Test Cases:

**TC-PROFILE-001: Profiles Grid**
- [ ] Navigate to `/profiles`
- [ ] Verify profiles display in grid
- [ ] Each card should show:
  - Profile picture
  - Username
  - Bio
  - Follower count
  - Platform icons
- [ ] **Expected**: Grid displays correctly

**TC-PROFILE-002: Search Profiles**
- [ ] Use search bar
- [ ] Enter username
- [ ] Verify results filter
- [ ] **Expected**: Search works

**TC-PROFILE-003: Filter by Platform**
- [ ] Use platform filter
- [ ] Select platform
- [ ] Verify only profiles from that platform
- [ ] **Expected**: Filter works

**TC-PROFILE-004: Sort Profiles**
- [ ] Sort by:
  - Followers (high to low)
  - Engagement rate
  - Recently added
  - Alphabetical
- [ ] **Expected**: Sorting works

**TC-PROFILE-005: View Profile Details**
- [ ] Click on profile card
- [ ] Verify redirect to `/profiles/[id]`
- [ ] **Expected**: Navigation works

**TC-PROFILE-006: Add to List/Tag**
- [ ] Click "Add to List" on profile
- [ ] Select/create list
- [ ] Verify added
- [ ] **Expected**: List management works

---

### 4.4 Profile Detail View
**Location**: `/profiles/[id]` (`app/profiles/[id]/page.tsx`)

#### Test Cases:

**TC-PROFILE-007: Profile Header**
- [ ] Navigate to profile detail
- [ ] Verify header shows:
  - Profile picture
  - Cover image
  - Username
  - Handle
  - Bio
  - Follower/Following counts
  - Location
  - Website
  - Join date
- [ ] **Expected**: All info displays

**TC-PROFILE-008: Profile Stats**
- [ ] Verify stats section:
  - Total posts
  - Average engagement
  - Posting frequency
  - Peak posting times
  - Sentiment distribution
- [ ] **Expected**: Stats display

**TC-PROFILE-009: Tab Navigation**
- [ ] Verify tabs:
  - Posts
  - Media
  - Analytics
  - AI Analysis
- [ ] Click each tab
- [ ] Verify content loads
- [ ] **Expected**: Tabs work

**TC-PROFILE-010: Posts Tab**
- [ ] On Posts tab
- [ ] Verify posts list
- [ ] Scroll for more posts
- [ ] Click on post
- [ ] Verify detail opens
- [ ] **Expected**: Posts tab functional

**TC-PROFILE-011: Media Tab**
- [ ] Switch to Media tab
- [ ] Verify images/videos display
- [ ] Click on media item
- [ ] Verify lightbox opens
- [ ] **Expected**: Media gallery works

**TC-PROFILE-012: Analytics Tab**
- [ ] Switch to Analytics tab
- [ ] Verify charts:
  - Engagement over time
  - Post frequency
  - Audience growth
  - Top posts
- [ ] **Expected**: Analytics display

**TC-PROFILE-013: AI Analysis Tab**
- [ ] Switch to AI Analysis tab
- [ ] Verify AI-generated insights:
  - Content themes
  - Tone analysis
  - Audience insights
  - Recommendations
- [ ] **Expected**: AI analysis displays

**TC-PROFILE-014: Follow/Unfollow**
- [ ] Click "Follow" button
- [ ] Verify status updates
- [ ] Click "Unfollow"
- [ ] Verify status updates
- [ ] **Expected**: Follow actions work

**TC-PROFILE-015: Export Profile Data**
- [ ] Click "Export" button
- [ ] Select format
- [ ] Verify download
- [ ] **Expected**: Export works

---

## 5. Locations & Maps

### 5.1 Locations List
**Location**: `/locations` (`app/locations/page.tsx`)

#### Test Cases:

**TC-LOC-001: Locations Display**
- [ ] Navigate to `/locations`
- [ ] Verify locations list
- [ ] Verify map view
- [ ] **Expected**: Both views available

**TC-LOC-002: Map View**
- [ ] Switch to map view
- [ ] Verify map loads (using Leaflet)
- [ ] Verify location markers
- [ ] Click marker
- [ ] Verify popup shows location info
- [ ] **Expected**: Map functional

**TC-LOC-003: List View**
- [ ] Switch to list view
- [ ] Verify locations list
- [ ] Each item should show:
  - Location name
  - Coordinates
  - Post count
  - Recent activity
- [ ] **Expected**: List displays

**TC-LOC-004: Search Locations**
- [ ] Use search bar
- [ ] Enter location name
- [ ] Verify results filter
- [ ] **Expected**: Search works

**TC-LOC-005: Filter by Activity**
- [ ] Filter by activity level
- [ ] Options: High, Medium, Low
- [ ] Verify filtering works
- [ ] **Expected**: Filter works

**TC-LOC-006: Map Zoom and Pan**
- [ ] Zoom in/out on map
- [ ] Pan around
- [ ] Verify markers update
- [ ] **Expected**: Map navigation works

**TC-LOC-007: Cluster Markers**
- [ ] Zoom out to see clusters
- [ ] Verify markers cluster
- [ ] Click cluster
- [ ] Verify expands
- [ ] **Expected**: Clustering works

---

### 5.2 Location Detail
**Location**: `/locations/[id]` (`app/locations/[id]/page.tsx`)

#### Test Cases:

**TC-LOC-008: Location Overview**
- [ ] Click on location
- [ ] Verify detail page loads
- [ ] Check information:
  - Location name
  - Coordinates
  - Country/Region
  - Post count
  - Active users
- [ ] **Expected**: Overview displays

**TC-LOC-009: Location Map**
- [ ] Verify detailed map shows
- [ ] Verify marker is centered
- [ ] Check nearby locations
- [ ] **Expected**: Map displays

**TC-LOC-010: Posts from Location**
- [ ] Scroll to posts section
- [ ] Verify posts from this location
- [ ] Filter by date range
- [ ] Sort by engagement
- [ ] **Expected**: Location posts show

**TC-LOC-011: Activity Heatmap**
- [ ] Check activity heatmap
- [ ] Verify time-based activity
- [ ] Hover over cells
- [ ] Verify tooltip shows details
- [ ] **Expected**: Heatmap works

**TC-LOC-012: Trending Topics**
- [ ] Check trending topics for location
- [ ] Verify topics list
- [ ] Click on topic
- [ ] Verify filter applies
- [ ] **Expected**: Trending topics work

---

## 6. Organizations & Entities

### 6.1 Organizations List
**Location**: `/organizations` (`app/organizations/page.tsx`)

#### Test Cases:

**TC-ORG-001: Organizations Display**
- [ ] Navigate to `/organizations`
- [ ] Verify organizations grid
- [ ] Each card shows:
  - Logo
  - Name
  - Industry
  - Location
  - Metrics
- [ ] **Expected**: Grid displays

**TC-ORG-002: Search Organizations**
- [ ] Use search bar
- [ ] Enter organization name
- [ ] Verify results filter
- [ ] **Expected**: Search works

**TC-ORG-003: Filter by Industry**
- [ ] Use industry filter
- [ ] Select industry
- [ ] Verify filtering
- [ ] **Expected**: Filter works

**TC-ORG-004: Sort Organizations**
- [ ] Sort by various criteria
- [ ] Verify order changes
- [ ] **Expected**: Sorting works

---

### 6.2 Organization Detail
**Location**: `/organizations/[id]` (`app/organizations/[id]/page.tsx`)

#### Test Cases:

**TC-ORG-005: Organization Profile**
- [ ] Click on organization
- [ ] Verify detail page
- [ ] Check information:
  - Logo
  - Name
  - Description
  - Industry
  - Location
  - Website
  - Social profiles
- [ ] **Expected**: Profile complete

**TC-ORG-006: Organization Posts**
- [ ] Verify posts/mentions tab
- [ ] Check posts related to org
- [ ] **Expected**: Posts display

**TC-ORG-007: Sentiment Analysis**
- [ ] Check sentiment section
- [ ] Verify sentiment breakdown
- [ ] Check sentiment over time chart
- [ ] **Expected**: Sentiment displays

**TC-ORG-008: Related Entities**
- [ ] Check related entities
- [ ] Verify connections shown
- [ ] Click on related entity
- [ ] **Expected**: Relations work

---

### 6.3 Entities
**Location**: `/entities` (`app/entities/page.tsx`)

#### Test Cases:

**TC-ENTITY-001: Entities List**
- [ ] Navigate to `/entities`
- [ ] Verify entities display
- [ ] Types should include:
  - People
  - Organizations
  - Locations
  - Events
- [ ] **Expected**: All types shown

**TC-ENTITY-002: Entity Type Filter**
- [ ] Filter by entity type
- [ ] Verify filtering works
- [ ] **Expected**: Type filter works

**TC-ENTITY-003: Entity Search**
- [ ] Search for entity
- [ ] Verify autocomplete
- [ ] Select result
- [ ] **Expected**: Search works

**TC-ENTITY-004: Entity Detail View**
- [ ] Click on entity
- [ ] Verify detail modal/page opens
- [ ] Check entity information
- [ ] Check related posts
- [ ] **Expected**: Detail view complete

**TC-ENTITY-005: Entity Network Graph**
- [ ] If available, check network graph
- [ ] Verify connections shown
- [ ] Interact with graph
- [ ] **Expected**: Graph interactive

---

### 6.4 Entity Search
**Location**: `/entity-search` (`app/entity-search/page.tsx`)

#### Test Cases:

**TC-ENTITY-006: Search Interface**
- [ ] Navigate to `/entity-search`
- [ ] Verify search input
- [ ] Enter query
- [ ] Verify suggestions appear
- [ ] **Expected**: Search interface works

**TC-ENTITY-007: Advanced Search**
- [ ] Use advanced search options
- [ ] Set entity type
- [ ] Set date range
- [ ] Set filters
- [ ] Search
- [ ] **Expected**: Advanced search works

**TC-ENTITY-008: Search Results**
- [ ] Submit search
- [ ] Verify results display
- [ ] Check result details
- [ ] Sort results
- [ ] **Expected**: Results display correctly

**TC-ENTITY-009: Save Search**
- [ ] Perform search
- [ ] Click "Save Search"
- [ ] Name the search
- [ ] Verify saved
- [ ] **Expected**: Search saved

---

## 7. OSINT Tools

### 7.1 OSINT Tools Dashboard
**Location**: `/osint-tools` (`app/osint-tools/page.tsx`)

#### Test Cases:

**TC-OSINT-001: Tools Overview**
- [ ] Navigate to `/osint-tools`
- [ ] Verify tools list:
  - Reverse Image Search
  - Username Search
  - Email Lookup
  - Phone Lookup
  - Domain Investigation
  - Social Media Cross-Platform Search
- [ ] **Expected**: All tools listed

**TC-OSINT-002: Reverse Image Search**
- [ ] Select Reverse Image Search
- [ ] Upload image or enter URL
- [ ] Click search
- [ ] Verify results
- [ ] Check sources found
- [ ] **Expected**: Image search works

**TC-OSINT-003: Username Search**
- [ ] Select Username Search
- [ ] Enter username
- [ ] Select platforms to search
- [ ] Click search
- [ ] Verify results across platforms
- [ ] **Expected**: Username search works

**TC-OSINT-004: Email Lookup**
- [ ] Select Email Lookup
- [ ] Enter email address
- [ ] Click search
- [ ] Verify associated accounts found
- [ ] **Expected**: Email lookup works

**TC-OSINT-005: Phone Lookup**
- [ ] Select Phone Lookup
- [ ] Enter phone number
- [ ] Click search
- [ ] Verify results
- [ ] Check carrier info
- [ ] **Expected**: Phone lookup works

**TC-OSINT-006: Domain Investigation**
- [ ] Select Domain Investigation
- [ ] Enter domain
- [ ] Click investigate
- [ ] Verify results:
  - WHOIS data
  - DNS records
  - SSL certificate info
  - Related domains
- [ ] **Expected**: Domain investigation works

**TC-OSINT-007: Cross-Platform Search**
- [ ] Select Cross-Platform Search
- [ ] Enter search term
- [ ] Select platforms
- [ ] Search
- [ ] Verify results from multiple platforms
- [ ] **Expected**: Cross-platform search works

**TC-OSINT-008: Export Results**
- [ ] Perform any OSINT search
- [ ] Click export
- [ ] Select format
- [ ] Verify download
- [ ] **Expected**: Export works

**TC-OSINT-009: Search History**
- [ ] Check OSINT search history
- [ ] Verify past searches listed
- [ ] Re-run past search
- [ ] **Expected**: History functional

---

## 8. UI Components & Interactions

### 8.1 Toast Notifications
**Location**: Throughout app (uses `components/ui/toast-provider.tsx`)

#### Test Cases:

**TC-UI-001: Success Toast**
- [ ] Trigger success action
- [ ] Verify green toast appears
- [ ] Check message content
- [ ] Verify auto-dismiss after 5s
- [ ] **Expected**: Success toast works

**TC-UI-002: Error Toast**
- [ ] Trigger error condition
- [ ] Verify red toast appears
- [ ] Check error message
- [ ] Verify action button if provided
- [ ] **Expected**: Error toast works

**TC-UI-003: Info Toast**
- [ ] Trigger info notification
- [ ] Verify blue toast appears
- [ ] **Expected**: Info toast works

**TC-UI-004: Warning Toast**
- [ ] Trigger warning
- [ ] Verify yellow/orange toast
- [ ] **Expected**: Warning toast works

**TC-UI-005: Toast Positioning**
- [ ] Trigger multiple toasts
- [ ] Verify stacking
- [ ] Verify positioning (top-right)
- [ ] **Expected**: Toasts stack correctly

**TC-UI-006: Toast Dismissal**
- [ ] Trigger toast
- [ ] Click close button
- [ ] Verify immediate dismissal
- [ ] **Expected**: Manual dismiss works

**TC-UI-007: Toast Actions**
- [ ] Trigger toast with action button
- [ ] Click action button
- [ ] Verify action executes
- [ ] **Expected**: Action buttons work

---

### 8.2 Modals and Dialogs
**Location**: Various (uses `components/ui/dialog.tsx`, `components/ui/alert-dialog.tsx`)

#### Test Cases:

**TC-UI-008: Modal Opening**
- [ ] Trigger modal (any feature)
- [ ] Verify modal opens
- [ ] Verify backdrop appears
- [ ] Verify body scroll is locked
- [ ] **Expected**: Modal opens correctly

**TC-UI-009: Modal Closing**
- [ ] Open modal
- [ ] Click X button
- [ ] Verify modal closes
- [ ] Open modal
- [ ] Click backdrop
- [ ] Verify modal closes
- [ ] Open modal
- [ ] Press ESC key
- [ ] Verify modal closes
- [ ] **Expected**: All close methods work

**TC-UI-010: Confirmation Dialog**
- [ ] Trigger delete action
- [ ] Verify confirmation dialog
- [ ] Click cancel
- [ ] Verify no action taken
- [ ] Trigger again
- [ ] Click confirm
- [ ] Verify action executes
- [ ] **Expected**: Confirmation works

**TC-UI-011: Modal Focus Trap**
- [ ] Open modal
- [ ] Press Tab key repeatedly
- [ ] Verify focus stays in modal
- [ ] Verify cycles through focusable elements
- [ ] **Expected**: Focus trap works

**TC-UI-012: Nested Modals**
- [ ] Open modal
- [ ] From modal, open another modal
- [ ] Close second modal
- [ ] Verify first modal still open
- [ ] **Expected**: Nested modals work

---

### 8.3 Dropdowns and Selects
**Location**: Various (uses `components/ui/dropdown-menu.tsx`, `components/ui/select.tsx`)

#### Test Cases:

**TC-UI-013: Dropdown Opening**
- [ ] Click dropdown trigger
- [ ] Verify menu opens
- [ ] Verify positioned correctly
- [ ] **Expected**: Dropdown opens

**TC-UI-014: Dropdown Selection**
- [ ] Open dropdown
- [ ] Click option
- [ ] Verify option selected
- [ ] Verify menu closes
- [ ] **Expected**: Selection works

**TC-UI-015: Select Component**
- [ ] Click select field
- [ ] Verify options display
- [ ] Select option
- [ ] Verify value updates
- [ ] **Expected**: Select works

**TC-UI-016: Multi-Select**
- [ ] If multi-select available
- [ ] Select multiple options
- [ ] Verify all selections shown
- [ ] Remove selection
- [ ] **Expected**: Multi-select works

**TC-UI-017: Dropdown Keyboard Navigation**
- [ ] Focus dropdown
- [ ] Press Enter/Space to open
- [ ] Use arrow keys to navigate
- [ ] Press Enter to select
- [ ] **Expected**: Keyboard nav works

---

### 8.4 Forms and Inputs
**Location**: Various

#### Test Cases:

**TC-UI-018: Text Input**
- [ ] Focus text input
- [ ] Type text
- [ ] Verify character limit if applicable
- [ ] Verify validation
- [ ] **Expected**: Input works

**TC-UI-019: Textarea**
- [ ] Focus textarea
- [ ] Type multi-line text
- [ ] Verify auto-resize if applicable
- [ ] **Expected**: Textarea works

**TC-UI-020: Checkbox**
- [ ] Click checkbox
- [ ] Verify checked state
- [ ] Click again
- [ ] Verify unchecked
- [ ] **Expected**: Checkbox toggles

**TC-UI-021: Radio Buttons**
- [ ] Select radio option
- [ ] Verify selected
- [ ] Select different option
- [ ] Verify first deselects
- [ ] **Expected**: Radio buttons work

**TC-UI-022: Toggle Switch**
- [ ] Click toggle
- [ ] Verify state changes
- [ ] Visual indicator updates
- [ ] **Expected**: Toggle works

**TC-UI-023: Date Picker**
- [ ] Click date input
- [ ] Verify calendar opens
- [ ] Select date
- [ ] Verify date populates
- [ ] **Expected**: Date picker works

**TC-UI-024: File Upload**
- [ ] Click file upload area
- [ ] Select file
- [ ] Verify file name shows
- [ ] Verify file size shown
- [ ] Remove file
- [ ] **Expected**: Upload works

**TC-UI-025: Form Validation**
- [ ] Submit form with errors
- [ ] Verify validation messages
- [ ] Verify error styling
- [ ] Fix errors
- [ ] Verify messages clear
- [ ] **Expected**: Validation works

---

### 8.5 Tables and Lists
**Location**: Various (uses `components/ui/table.tsx`)

#### Test Cases:

**TC-UI-026: Table Display**
- [ ] View page with table
- [ ] Verify headers
- [ ] Verify data rows
- [ ] Verify alignment
- [ ] **Expected**: Table displays

**TC-UI-027: Table Sorting**
- [ ] Click column header
- [ ] Verify sort ascending
- [ ] Click again
- [ ] Verify sort descending
- [ ] **Expected**: Sorting works

**TC-UI-028: Table Pagination**
- [ ] Navigate to next page
- [ ] Verify page changes
- [ ] Check page number
- [ ] Jump to specific page
- [ ] **Expected**: Pagination works

**TC-UI-029: Row Selection**
- [ ] If selectable, click checkbox
- [ ] Verify row selected
- [ ] Select multiple rows
- [ ] Verify bulk actions enabled
- [ ] **Expected**: Selection works

**TC-UI-030: Table Search/Filter**
- [ ] Use table search
- [ ] Enter query
- [ ] Verify rows filter
- [ ] **Expected**: Search works

---

### 8.6 Charts and Visualizations
**Location**: Various (uses Recharts)

#### Test Cases:

**TC-UI-031: Line Chart**
- [ ] View page with line chart
- [ ] Verify chart renders
- [ ] Hover over data points
- [ ] Verify tooltip shows details
- [ ] **Expected**: Line chart works

**TC-UI-032: Bar Chart**
- [ ] View bar chart
- [ ] Verify bars render
- [ ] Hover over bar
- [ ] Verify tooltip
- [ ] **Expected**: Bar chart works

**TC-UI-033: Pie Chart**
- [ ] View pie chart
- [ ] Verify segments
- [ ] Hover over segment
- [ ] Verify tooltip
- [ ] Click segment for detail
- [ ] **Expected**: Pie chart works

**TC-UI-034: Chart Legend**
- [ ] Verify legend displays
- [ ] Click legend item
- [ ] Verify series toggles visibility
- [ ] **Expected**: Legend interactive

**TC-UI-035: Chart Responsiveness**
- [ ] Resize window
- [ ] Verify chart adapts
- [ ] Test mobile size
- [ ] **Expected**: Charts responsive

---

### 8.7 Tooltips and Popovers
**Location**: Various (uses `components/ui/tooltip.tsx`, `components/ui/popover.tsx`)

#### Test Cases:

**TC-UI-036: Tooltip on Hover**
- [ ] Hover over element with tooltip
- [ ] Verify tooltip appears
- [ ] Check positioning
- [ ] Move mouse away
- [ ] Verify tooltip disappears
- [ ] **Expected**: Tooltip works

**TC-UI-037: Rich Tooltip**
- [ ] Hover over rich tooltip trigger
- [ ] Verify styled content appears
- [ ] Check formatting
- [ ] **Expected**: Rich tooltip works

**TC-UI-038: Popover Opening**
- [ ] Click popover trigger
- [ ] Verify popover opens
- [ ] Verify positioning
- [ ] **Expected**: Popover opens

**TC-UI-039: Popover Interactions**
- [ ] Open popover
- [ ] Interact with content inside
- [ ] Verify actions work
- [ ] Close popover
- [ ] **Expected**: Popover interactive

---

### 8.8 Skeleton Loaders
**Location**: Various (uses `components/skeletons/`)

#### Test Cases:

**TC-UI-040: Loading State**
- [ ] Navigate to page with async data
- [ ] Verify skeleton loader appears
- [ ] Verify animation (pulse/shimmer)
- [ ] Wait for data load
- [ ] Verify skeleton replaced with content
- [ ] **Expected**: Loading state works

**TC-UI-041: Dashboard Skeleton**
- [ ] Load dashboard
- [ ] Verify dashboard skeleton
- [ ] Check layout matches final content
- [ ] **Expected**: Skeleton appropriate

**TC-UI-042: Profile Card Skeleton**
- [ ] Load profiles page
- [ ] Verify profile card skeletons
- [ ] Check grid layout maintained
- [ ] **Expected**: Card skeletons work

---

### 8.9 Empty States
**Location**: Various (uses `components/ui/empty.tsx`)

#### Test Cases:

**TC-UI-043: No Data Empty State**
- [ ] Navigate to page with no data
- [ ] Verify empty state message
- [ ] Verify helpful illustration/icon
- [ ] Verify call-to-action button
- [ ] **Expected**: Empty state clear

**TC-UI-044: No Search Results**
- [ ] Search for non-existent term
- [ ] Verify no results message
- [ ] Verify suggestions provided
- [ ] **Expected**: No results state helpful

---

### 8.10 Error Boundaries
**Location**: Throughout app (uses `components/ui/error-boundary.tsx`)

#### Test Cases:

**TC-UI-045: Component Error Handling**
- [ ] Trigger component error (if possible)
- [ ] Verify error boundary catches it
- [ ] Verify error message displays
- [ ] Verify "Try Again" button
- [ ] Click try again
- [ ] **Expected**: Error handled gracefully

**TC-UI-046: 404 Page**
- [ ] Navigate to non-existent route
- [ ] Verify 404 page displays
- [ ] Verify helpful message
- [ ] Verify navigation options
- [ ] **Expected**: 404 page clear

---

## 9. API Integration

### 9.1 API Health
**Location**: Backend integration

#### Test Cases:

**TC-API-001: API Connection**
- [ ] Check browser console for API calls
- [ ] Verify API URL: `https://irisnet.wiredleap.com`
- [ ] Verify successful responses
- [ ] **Expected**: API reachable

**TC-API-002: Authentication Header**
- [ ] After login, check network tab
- [ ] Verify JWT token in headers
- [ ] Verify format: `Authorization: Bearer <token>`
- [ ] **Expected**: Auth header present

**TC-API-003: Token Refresh**
- [ ] Wait for token to expire
- [ ] Trigger API call
- [ ] Verify token refresh happens
- [ ] Verify new token used
- [ ] **Expected**: Token refresh works

**TC-API-004: Unauthorized Handling**
- [ ] Manually clear auth token
- [ ] Try accessing protected route
- [ ] Verify redirect to login
- [ ] **Expected**: 401 handled correctly

**TC-API-005: Network Error Handling**
- [ ] Disconnect internet
- [ ] Try loading data
- [ ] Verify error message
- [ ] Reconnect
- [ ] Verify retry works
- [ ] **Expected**: Network errors handled

---

### 9.2 Campaigns API
**Location**: `app/api/campaigns/`

#### Test Cases:

**TC-API-006: GET /api/campaigns**
- [ ] Load campaigns page
- [ ] Verify API call made
- [ ] Check response format
- [ ] Verify data populates
- [ ] **Expected**: Campaigns fetched

**TC-API-007: GET /api/campaigns/[id]**
- [ ] Load specific campaign
- [ ] Verify API call with ID
- [ ] Check response data
- [ ] **Expected**: Campaign details fetched

**TC-API-008: POST /api/campaigns**
- [ ] Create new campaign
- [ ] Verify POST request sent
- [ ] Check request body format
- [ ] Verify success response
- [ ] **Expected**: Campaign created

**TC-API-009: POST /api/campaigns/[id]/monitor**
- [ ] Start campaign monitoring
- [ ] Verify API call
- [ ] Check response
- [ ] **Expected**: Monitoring started

**TC-API-010: POST /api/campaigns/[id]/stop-monitoring**
- [ ] Stop monitoring
- [ ] Verify API call
- [ ] **Expected**: Monitoring stopped

**TC-API-011: GET /api/campaigns/search**
- [ ] Use campaign search
- [ ] Verify query parameters
- [ ] Check results format
- [ ] **Expected**: Search results returned

**TC-API-012: GET /api/campaigns/search/suggestions**
- [ ] Type in search field
- [ ] Verify suggestions API call
- [ ] Check autocomplete results
- [ ] **Expected**: Suggestions provided

**TC-API-013: POST /api/campaigns/check-post**
- [ ] Check post status
- [ ] Verify API call
- [ ] Check response format
- [ ] **Expected**: Post status returned

---

### 9.3 Social Profiles API
**Location**: `app/api/social/profiles/`

#### Test Cases:

**TC-API-014: GET /api/social/profiles/[id]**
- [ ] Load profile page
- [ ] Verify API call
- [ ] Check response data
- [ ] **Expected**: Profile data fetched

**TC-API-015: GET /api/social/profiles/[id]/posts**
- [ ] Load profile posts
- [ ] Verify API call with pagination
- [ ] Check posts array
- [ ] **Expected**: Posts fetched

**TC-API-016: GET /api/social/profiles/[id]/aianalysis**
- [ ] Request AI analysis
- [ ] Verify API call
- [ ] Check analysis data
- [ ] **Expected**: AI analysis returned

---

### 9.4 Political Dashboard API
**Location**: `app/api/political-dashboard/`

#### Test Cases:

**TC-API-017: GET /api/political-dashboard/quick-stats**
- [ ] Load dashboard
- [ ] Verify stats API call
- [ ] Check response format
- [ ] **Expected**: Stats fetched

**TC-API-018: GET /api/political-dashboard/campaign-themes**
- [ ] Load campaign themes section
- [ ] Verify API call
- [ ] Check themes data
- [ ] **Expected**: Themes fetched

**TC-API-019: GET /api/political-dashboard/influencer-tracker**
- [ ] Load influencer tracker
- [ ] Verify API call
- [ ] Check influencers list
- [ ] **Expected**: Influencers fetched

**TC-API-020: GET /api/political-dashboard/opponent-narratives**
- [ ] Load opponent narratives
- [ ] Verify API call
- [ ] Check narratives data
- [ ] **Expected**: Narratives fetched

**TC-API-021: GET /api/political-dashboard/support-base-energy**
- [ ] Load support base section
- [ ] Verify API call
- [ ] Check energy metrics
- [ ] **Expected**: Metrics fetched

---

## 10. Performance & Responsiveness

### 10.1 Page Load Performance

#### Test Cases:

**TC-PERF-001: Initial Page Load**
- [ ] Clear cache
- [ ] Load homepage
- [ ] Measure time to interactive (should be < 3s)
- [ ] Check Lighthouse score
- [ ] **Expected**: Fast initial load

**TC-PERF-002: Subsequent Navigation**
- [ ] Navigate between pages
- [ ] Measure transition time (should be < 500ms)
- [ ] **Expected**: Fast navigation

**TC-PERF-003: Large Dataset Rendering**
- [ ] Load page with many items (100+)
- [ ] Measure rendering time
- [ ] Verify virtualization if applicable
- [ ] **Expected**: Smooth rendering

**TC-PERF-004: Image Loading**
- [ ] Load page with many images
- [ ] Verify lazy loading
- [ ] Verify progressive loading
- [ ] Check image optimization
- [ ] **Expected**: Efficient image loading

**TC-PERF-005: Bundle Size**
- [ ] Check Network tab
- [ ] Verify code splitting
- [ ] Check bundle sizes reasonable
- [ ] **Expected**: Optimized bundles

---

### 10.2 Responsive Design

#### Test Cases:

**TC-RESP-001: Desktop (1920x1080)**
- [ ] Test at 1920x1080
- [ ] Verify layout
- [ ] Check all components visible
- [ ] Test all features
- [ ] **Expected**: Optimal desktop experience

**TC-RESP-002: Laptop (1440x900)**
- [ ] Test at 1440x900
- [ ] Verify responsive adjustments
- [ ] Check sidebar behavior
- [ ] **Expected**: Good laptop experience

**TC-RESP-003: Tablet (768x1024)**
- [ ] Test at tablet size
- [ ] Verify layout adapts
- [ ] Check touch interactions
- [ ] Verify navigation accessible
- [ ] **Expected**: Functional tablet experience

**TC-RESP-004: Mobile (375x667)**
- [ ] Test at mobile size
- [ ] Verify mobile layout
- [ ] Check hamburger menu
- [ ] Test touch targets (min 44x44px)
- [ ] Verify forms usable
- [ ] **Expected**: Full mobile functionality

**TC-RESP-005: Mobile (414x896) - iPhone**
- [ ] Test at iPhone size
- [ ] Verify safe areas respected
- [ ] Check bottom navigation
- [ ] **Expected**: iOS compatible

**TC-RESP-006: Mobile (360x740) - Android**
- [ ] Test at Android size
- [ ] Verify layout works
- [ ] Test gestures
- [ ] **Expected**: Android compatible

**TC-RESP-007: Ultra-wide (2560x1080)**
- [ ] Test at ultra-wide
- [ ] Verify content doesn't stretch too much
- [ ] Check max-width constraints
- [ ] **Expected**: Reasonable ultra-wide layout

**TC-RESP-008: Portrait/Landscape Toggle**
- [ ] Test on tablet/mobile
- [ ] Rotate device
- [ ] Verify layout adapts
- [ ] **Expected**: Orientation change handled

**TC-RESP-009: Font Scaling**
- [ ] Increase browser font size
- [ ] Verify text remains readable
- [ ] Check no overflow issues
- [ ] **Expected**: Accessible font scaling

---

### 10.3 Browser Compatibility

#### Test Cases:

**TC-BROWSER-001: Chrome/Chromium**
- [ ] Test all features in Chrome
- [ ] Verify animations work
- [ ] Check console for errors
- [ ] **Expected**: Full compatibility

**TC-BROWSER-002: Firefox**
- [ ] Test all features in Firefox
- [ ] Check video playback
- [ ] Verify layout consistency
- [ ] **Expected**: Full compatibility

**TC-BROWSER-003: Safari**
- [ ] Test all features in Safari
- [ ] Check webkit-specific issues
- [ ] Verify video backgrounds work
- [ ] Test on macOS
- [ ] **Expected**: Full compatibility

**TC-BROWSER-004: Safari iOS**
- [ ] Test on iPhone Safari
- [ ] Check touch gestures
- [ ] Verify form inputs
- [ ] Test video autoplay
- [ ] **Expected**: iOS Safari compatible

**TC-BROWSER-005: Chrome Mobile**
- [ ] Test on Android Chrome
- [ ] Verify all features
- [ ] Check performance
- [ ] **Expected**: Mobile Chrome compatible

**TC-BROWSER-006: Edge**
- [ ] Test in Microsoft Edge
- [ ] Verify compatibility
- [ ] **Expected**: Edge compatible

---

### 10.4 Accessibility

#### Test Cases:

**TC-A11Y-001: Keyboard Navigation**
- [ ] Use Tab key to navigate entire site
- [ ] Verify all interactive elements reachable
- [ ] Check focus indicators visible
- [ ] Test Skip to Content link
- [ ] **Expected**: Full keyboard access

**TC-A11Y-002: Screen Reader**
- [ ] Use screen reader (VoiceOver/NVDA)
- [ ] Navigate site
- [ ] Verify announcements make sense
- [ ] Check ARIA labels
- [ ] **Expected**: Screen reader compatible

**TC-A11Y-003: Color Contrast**
- [ ] Check color contrast ratios
- [ ] Use browser extensions
- [ ] Verify WCAG AA compliance
- [ ] **Expected**: Sufficient contrast

**TC-A11Y-004: Alt Text**
- [ ] Check all images have alt text
- [ ] Verify alt text is descriptive
- [ ] **Expected**: All images accessible

**TC-A11Y-005: Form Labels**
- [ ] Verify all inputs have labels
- [ ] Check label associations
- [ ] Test error announcements
- [ ] **Expected**: Forms accessible

**TC-A11Y-006: Focus Management**
- [ ] Open modal
- [ ] Verify focus moves to modal
- [ ] Close modal
- [ ] Verify focus returns
- [ ] **Expected**: Focus managed correctly

**TC-A11Y-007: Semantic HTML**
- [ ] Inspect HTML structure
- [ ] Verify semantic elements used
- [ ] Check heading hierarchy
- [ ] **Expected**: Proper semantics

---

### 10.5 Security

#### Test Cases:

**TC-SEC-001: XSS Prevention**
- [ ] Try injecting script tags in inputs
- [ ] Verify scripts don't execute
- [ ] **Expected**: XSS prevented

**TC-SEC-002: CSRF Protection**
- [ ] Check POST requests
- [ ] Verify CSRF tokens if applicable
- [ ] **Expected**: CSRF protection in place

**TC-SEC-003: Secure Storage**
- [ ] Check localStorage/sessionStorage
- [ ] Verify no sensitive data stored unencrypted
- [ ] **Expected**: Secure storage practices

**TC-SEC-004: HTTPS**
- [ ] Verify site uses HTTPS in production
- [ ] Check no mixed content warnings
- [ ] **Expected**: Secure connection

**TC-SEC-005: Authentication Timeout**
- [ ] Login
- [ ] Wait for session timeout
- [ ] Try accessing protected route
- [ ] Verify redirect to login
- [ ] **Expected**: Session timeout works

---

## Test Execution Summary

### Priority Levels
- **P0 (Critical)**: Must pass before release - Authentication, core navigation, data display
- **P1 (High)**: Important features - All analysis features, social feed, profiles
- **P2 (Medium)**: Secondary features - Advanced filters, exports, integrations
- **P3 (Low)**: Nice to have - Animations, tooltips, aesthetic elements

### Test Environments
1. **Local Development**: http://localhost:3000
2. **Staging**: [TBD]
3. **Production**: [TBD]

### Browsers to Test
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Safari iOS (latest)
- Chrome Android (latest)

### Devices to Test
- Desktop: 1920x1080, 1440x900
- Tablet: iPad (768x1024), iPad Pro (1024x1366)
- Mobile: iPhone 14 (390x844), Samsung Galaxy (360x740)

### Test Data
- Test credentials should be provided separately
- Use realistic but non-sensitive test data
- Test with various data volumes (empty, small, large datasets)

---

## Bug Reporting Template

When a test fails, report using this format:

```markdown
**Bug ID**: BUG-XXX
**Test Case**: TC-XXX
**Severity**: Critical/High/Medium/Low
**Priority**: P0/P1/P2/P3

**Environment**:
- URL: http://localhost:3000/...
- Browser: Chrome 120
- OS: macOS 14
- Device: Desktop

**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3

**Expected Result**:
[What should happen]

**Actual Result**:
[What actually happened]

**Screenshots/Videos**:
[Attach if applicable]

**Console Errors**:
[Copy any console errors]

**Additional Notes**:
[Any other relevant information]
```

---

## Sign-off

**Tested By**: _______________
**Date**: _______________
**Test Environment**: _______________
**Overall Status**: ☐ Pass ☐ Fail ☐ Partial

**Notes**:
_______________________________________________
_______________________________________________
_______________________________________________


