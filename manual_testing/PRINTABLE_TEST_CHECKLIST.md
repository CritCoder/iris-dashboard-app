# IRIS Dashboard - Printable Test Checklist

**Date**: ____________  **Tester**: ____________  **Build**: ____________

---

## 🔥 CRITICAL TESTS (Must Pass) - 15 minutes

### Authentication
- [ ] Login with mobile number works
- [ ] Login with email works
- [ ] OTP verification works (6 digits)
- [ ] Signup flow complete
- [ ] Password reset works
- [ ] Logout works

### Core Navigation
- [ ] Dashboard loads without errors
- [ ] Sidebar navigation works
- [ ] All main menu items clickable
- [ ] Page transitions smooth

### Basic Functionality
- [ ] Can start new analysis
- [ ] Analysis results display
- [ ] Social feed loads
- [ ] Profile page loads

**Critical Test Status**: ☐ Pass ☐ Fail  
**If Failed, STOP and report immediately**

---

## 📱 AUTHENTICATION MODULE - 30 minutes

### Login Page (`/login`)
- [ ] Page displays full-screen
- [ ] Video background plays
- [ ] IRIS logo animates
- [ ] Mobile tab works
- [ ] Email tab works
- [ ] Tab transitions smooth
- [ ] Valid mobile (10 digits) submits
- [ ] Valid email submits
- [ ] Invalid input shows error
- [ ] Empty form disables button
- [ ] Loading state shows
- [ ] Success redirects to OTP page
- [ ] Terms modal opens
- [ ] Privacy modal opens

### Login OTP (`/login/verify-otp`)
- [ ] Page loads with OTP inputs
- [ ] First input auto-focused
- [ ] Auto-advance between inputs
- [ ] Backspace navigation works
- [ ] All 6 digits auto-submits
- [ ] Valid OTP succeeds
- [ ] Invalid OTP shows error
- [ ] Timer counts down (120s)
- [ ] Resend button appears at 0s
- [ ] Resend OTP works
- [ ] Back button returns to login
- [ ] Edit phone number works

### Signup Page (`/signup`)
- [ ] Full-screen design
- [ ] All form fields present
- [ ] Mobile/Email tabs work
- [ ] Name input accepts text
- [ ] Mobile validation (10 digits)
- [ ] Email validation works
- [ ] Password input works
- [ ] Confirm password matches
- [ ] Password visibility toggle
- [ ] Terms checkbox required
- [ ] Submit button enables when valid
- [ ] Form persists on refresh
- [ ] Redirects to OTP verification
- [ ] "Sign in" link works

### Password Reset
- [ ] Forgot password page loads
- [ ] Email/Mobile selection works
- [ ] Sends verification code
- [ ] OTP verification works
- [ ] Password requirements visible
- [ ] Requirements update dynamically
- [ ] Both password fields have toggle
- [ ] Passwords must match
- [ ] Reset button works
- [ ] Redirects to login after reset

**Auth Module Status**: ☐ Pass ☐ Fail  
**Bugs Found**: ___________

---

## 🏠 DASHBOARD & NAVIGATION - 20 minutes

### Main Dashboard (`/`)
- [ ] Dashboard loads
- [ ] Stats cards visible
- [ ] Icon sidebar visible (left)
- [ ] Main sidebar visible
- [ ] User profile section visible
- [ ] All navigation icons work
- [ ] Active route highlighted
- [ ] Quick stats load
- [ ] Recent activity shows
- [ ] Theme toggle works
- [ ] User menu opens
- [ ] Logout button works

### Navigation & Shortcuts
- [ ] `Cmd+K` opens quick actions
- [ ] `?` shows shortcuts dialog
- [ ] Tab key navigates elements
- [ ] ESC closes dialogs
- [ ] All sidebar items work
- [ ] Breadcrumbs show correctly
- [ ] Back button works
- [ ] Route progress bar shows

**Dashboard Status**: ☐ Pass ☐ Fail  
**Bugs Found**: ___________

---

## 🔍 ANALYSIS MODULE - 45 minutes

### Start Analysis (`/start-analysis`)
- [ ] Page loads
- [ ] Search input works
- [ ] Character count updates
- [ ] All platforms selectable
- [ ] Multiple platforms select
- [ ] Time range options work
- [ ] Custom date picker works
- [ ] Content type filters work
- [ ] Advanced filters expandable
- [ ] Language filter works
- [ ] Location filter works
- [ ] Save as campaign toggle
- [ ] Form validation works
- [ ] Submit button enables
- [ ] Creates analysis successfully

### Analysis History (`/analysis-history`)
- [ ] List displays
- [ ] All past analyses shown
- [ ] Sort dropdown works
- [ ] Filter options work
- [ ] Search bar functions
- [ ] Pagination works
- [ ] Click item opens detail
- [ ] Delete button works
- [ ] Export button works

### Analysis Detail (`/analysis-history/[id]`)
- [ ] Page loads
- [ ] Overview section visible
- [ ] Search query displayed
- [ ] Date range shown
- [ ] Platforms listed
- [ ] Total posts count
- [ ] Quick filters present
- [ ] "All Posts" filter works
- [ ] "High Engagement" filter works
- [ ] "Recent" filter works
- [ ] "Viral Potential" filter works
- [ ] Sentiment filters work
- [ ] Posts grid displays
- [ ] Post cards formatted correctly
- [ ] Infinite scroll works
- [ ] Loading indicator shows
- [ ] Sentiment chart renders
- [ ] Timeline chart renders
- [ ] Top influencers list
- [ ] Keyword cloud visible
- [ ] Export report works
- [ ] Share button works

### Post Detail (`/analysis-history/[id]/post/[postId]`)
- [ ] Post detail opens
- [ ] Full content displays
- [ ] Author info complete
- [ ] Engagement metrics shown
- [ ] Sentiment score visible
- [ ] Comments load
- [ ] Related posts show
- [ ] Back navigation works

**Analysis Module Status**: ☐ Pass ☐ Fail  
**Bugs Found**: ___________

---

## 📱 SOCIAL MEDIA MODULE - 30 minutes

### Social Feed (`/social-feed`)
- [ ] Feed loads
- [ ] Posts from multiple platforms
- [ ] Platform filter works
- [ ] Sort options work
- [ ] Infinite scroll loads more
- [ ] Loading skeleton shows
- [ ] Refresh button works
- [ ] Post click opens detail
- [ ] Empty state if no posts

### Social Inbox (`/social-inbox`)
- [ ] Inbox loads
- [ ] Messages listed
- [ ] Filter options work
- [ ] Unread count correct
- [ ] Mark as read works
- [ ] Mark all as read works
- [ ] Reply functionality works
- [ ] Delete message works

### Profiles List (`/profiles`)
- [ ] Profiles grid displays
- [ ] Profile cards formatted
- [ ] Search bar works
- [ ] Platform filter works
- [ ] Sort options work
- [ ] Click card opens detail

### Profile Detail (`/profiles/[id]`)
- [ ] Profile loads
- [ ] Header complete
- [ ] Cover image displays
- [ ] Profile picture shows
- [ ] Bio text visible
- [ ] Follower counts shown
- [ ] Stats section complete
- [ ] Tab navigation works
- [ ] Posts tab loads
- [ ] Media tab loads
- [ ] Analytics tab loads
- [ ] AI Analysis tab loads
- [ ] Follow button works
- [ ] Export button works

**Social Module Status**: ☐ Pass ☐ Fail  
**Bugs Found**: ___________

---

## 📍 LOCATION MODULE - 15 minutes

### Locations List (`/locations`)
- [ ] Page loads
- [ ] Map view displays
- [ ] Map markers visible
- [ ] Map zoom/pan works
- [ ] Marker clusters work
- [ ] Marker click shows popup
- [ ] List view toggle works
- [ ] Search locations works
- [ ] Activity filter works

### Location Detail (`/locations/[id]`)
- [ ] Location detail loads
- [ ] Location info complete
- [ ] Detailed map shows
- [ ] Posts from location load
- [ ] Date filter works
- [ ] Activity heatmap renders
- [ ] Trending topics show

**Location Module Status**: ☐ Pass ☐ Fail  
**Bugs Found**: ___________

---

## 🏢 ORGANIZATIONS & ENTITIES - 15 minutes

### Organizations (`/organizations`)
- [ ] Organizations grid displays
- [ ] Search works
- [ ] Industry filter works
- [ ] Sort options work
- [ ] Click opens detail

### Organization Detail (`/organizations/[id]`)
- [ ] Profile complete
- [ ] Posts/mentions tab works
- [ ] Sentiment analysis shows
- [ ] Related entities shown

### Entities (`/entities`)
- [ ] Entities list displays
- [ ] Type filter works
- [ ] Search works
- [ ] Detail view opens

### Entity Search (`/entity-search`)
- [ ] Search interface loads
- [ ] Advanced options work
- [ ] Results display
- [ ] Save search works

**Orgs & Entities Status**: ☐ Pass ☐ Fail  
**Bugs Found**: ___________

---

## 📢 CAMPAIGN MODULE - 15 minutes

### Campaign Detail (`/campaign/[id]`)
- [ ] Campaign overview loads
- [ ] Status indicator correct
- [ ] Start monitoring works
- [ ] Stop monitoring works
- [ ] Real-time updates work
- [ ] Edit campaign works
- [ ] Delete campaign works

### Post-Campaign (`/post-campaign/[id]`)
- [ ] Final results display
- [ ] Performance metrics complete
- [ ] Export report works

**Campaign Module Status**: ☐ Pass ☐ Fail  
**Bugs Found**: ___________

---

## 🔍 OSINT TOOLS - 15 minutes

### OSINT Dashboard (`/osint-tools`)
- [ ] Tools list displays
- [ ] Reverse image search works
- [ ] Username search works
- [ ] Email lookup works
- [ ] Phone lookup works
- [ ] Domain investigation works
- [ ] Cross-platform search works
- [ ] Export results works
- [ ] Search history shows

**OSINT Module Status**: ☐ Pass ☐ Fail  
**Bugs Found**: ___________

---

## 🎨 UI COMPONENTS - 20 minutes

### Notifications
- [ ] Success toasts appear
- [ ] Error toasts appear
- [ ] Info toasts appear
- [ ] Toasts auto-dismiss
- [ ] Close button works
- [ ] Multiple toasts stack

### Modals & Dialogs
- [ ] Modals open
- [ ] Backdrop appears
- [ ] Body scroll locked
- [ ] X button closes
- [ ] Backdrop click closes
- [ ] ESC key closes
- [ ] Confirmation dialogs work
- [ ] Focus trap works

### Forms & Inputs
- [ ] Text inputs work
- [ ] Textareas work
- [ ] Checkboxes toggle
- [ ] Radio buttons work
- [ ] Toggle switches work
- [ ] Date pickers work
- [ ] File upload works
- [ ] Form validation works

### Dropdowns & Menus
- [ ] Dropdowns open
- [ ] Options selectable
- [ ] Keyboard nav works
- [ ] Menus close on select

### Charts
- [ ] Line charts render
- [ ] Bar charts render
- [ ] Pie charts render
- [ ] Tooltips on hover
- [ ] Legends work

### Other Components
- [ ] Tables display correctly
- [ ] Table sorting works
- [ ] Pagination works
- [ ] Tooltips appear/disappear
- [ ] Skeletons show on load
- [ ] Empty states display
- [ ] Error boundaries catch errors

**UI Components Status**: ☐ Pass ☐ Fail  
**Bugs Found**: ___________

---

## 📱 RESPONSIVE TESTING - 20 minutes

### Desktop (1920x1080)
- [ ] Full layout displays
- [ ] Sidebar visible
- [ ] All features accessible
- [ ] Charts render properly
- [ ] No horizontal scroll

### Laptop (1440x900)
- [ ] Layout adapts
- [ ] Sidebar adjusts
- [ ] Content readable
- [ ] Features accessible

### Tablet (768x1024)
- [ ] Tablet layout
- [ ] Touch targets adequate (44x44px min)
- [ ] Navigation accessible
- [ ] Forms usable
- [ ] Charts readable

### Mobile (375x667)
- [ ] Mobile layout
- [ ] Hamburger menu works
- [ ] Touch targets adequate
- [ ] Forms easy to use
- [ ] Content scrollable
- [ ] No horizontal scroll
- [ ] Tap targets not overlapping

### Orientation
- [ ] Portrait mode works
- [ ] Landscape mode works
- [ ] Layout adapts on rotation

**Responsive Status**: ☐ Pass ☐ Fail  
**Bugs Found**: ___________

---

## 🌐 BROWSER TESTING - 20 minutes

### Chrome (Primary)
- [ ] All features work
- [ ] Animations smooth
- [ ] No console errors
- [ ] Performance good

### Firefox
- [ ] All features work
- [ ] Video backgrounds play
- [ ] Layout consistent
- [ ] No console errors

### Safari (macOS)
- [ ] All features work
- [ ] Webkit issues handled
- [ ] Video backgrounds work
- [ ] No console errors

### Safari (iOS)
- [ ] Touch gestures work
- [ ] Form inputs work
- [ ] Video autoplay handled
- [ ] Layout correct

### Chrome (Android)
- [ ] All features work
- [ ] Touch responsive
- [ ] Performance acceptable
- [ ] Layout correct

**Browser Compatibility Status**: ☐ Pass ☐ Fail  
**Bugs Found**: ___________

---

## ⚡ PERFORMANCE - 15 minutes

### Page Load
- [ ] Homepage < 3s
- [ ] Dashboard < 3s
- [ ] Analysis page < 3s
- [ ] Profile page < 3s

### Navigation
- [ ] Page transitions < 500ms
- [ ] Smooth animations (60fps)
- [ ] No janky scrolling

### Data Loading
- [ ] API responses < 1s
- [ ] Large datasets render smoothly
- [ ] Images load progressively
- [ ] Infinite scroll smooth

### Resources
- [ ] No memory leaks
- [ ] Bundle sizes reasonable
- [ ] Images optimized
- [ ] Code splitting works

**Performance Status**: ☐ Pass ☐ Fail  
**Issues Found**: ___________

---

## ♿ ACCESSIBILITY - 15 minutes

### Keyboard Navigation
- [ ] Tab navigates all elements
- [ ] Focus indicators visible
- [ ] Skip to content works
- [ ] All buttons reachable
- [ ] Forms fully accessible

### Screen Reader
- [ ] Announcements make sense
- [ ] ARIA labels present
- [ ] Landmarks used correctly
- [ ] Alt text on images

### Visual
- [ ] Color contrast sufficient (WCAG AA)
- [ ] Text readable at 200% zoom
- [ ] No color-only indicators
- [ ] Focus visible

### Interaction
- [ ] All form labels present
- [ ] Error messages announced
- [ ] Focus management correct
- [ ] Semantic HTML used

**Accessibility Status**: ☐ Pass ☐ Fail  
**Issues Found**: ___________

---

## 🔒 SECURITY CHECKS - 10 minutes

### Input Validation
- [ ] XSS prevented (script tags don't execute)
- [ ] SQL injection prevented
- [ ] Input sanitized

### Authentication
- [ ] Session timeout works
- [ ] Protected routes redirect
- [ ] JWT token in headers
- [ ] Token refresh works

### Storage
- [ ] No sensitive data in localStorage
- [ ] Passwords not stored
- [ ] Tokens secure

### Network
- [ ] HTTPS in production
- [ ] No mixed content warnings
- [ ] CORS configured correctly

**Security Status**: ☐ Pass ☐ Fail  
**Issues Found**: ___________

---

## 📊 TEST SUMMARY

### Overall Statistics
- **Total Tests Run**: _____
- **Tests Passed**: _____
- **Tests Failed**: _____
- **Tests Blocked**: _____
- **Pass Rate**: _____%

### Bugs Summary
- **Critical Bugs**: _____
- **High Priority**: _____
- **Medium Priority**: _____
- **Low Priority**: _____
- **Total Bugs**: _____

### Time Spent
- **Testing Duration**: _____ hours
- **Bug Documentation**: _____ hours
- **Total Time**: _____ hours

### Modules Tested
- [ ] Authentication
- [ ] Dashboard
- [ ] Analysis
- [ ] Social Media
- [ ] Locations
- [ ] Organizations
- [ ] Entities
- [ ] Campaigns
- [ ] OSINT Tools
- [ ] UI Components
- [ ] Responsive
- [ ] Browsers
- [ ] Performance
- [ ] Accessibility
- [ ] Security

---

## ✅ FINAL SIGN-OFF

### Test Environment
- **URL**: ____________________
- **Build**: ____________________
- **Date**: ____________________

### Browser Tested
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Safari
- [ ] Mobile Chrome

### Device Tested
- [ ] Desktop
- [ ] Laptop
- [ ] Tablet
- [ ] Mobile

### Overall Assessment
- [ ] **PASS** - Ready for release
- [ ] **PASS WITH MINOR ISSUES** - Can release with known issues documented
- [ ] **FAIL** - Not ready for release, critical issues found

### Tester Information
**Name**: ____________________  
**Signature**: ____________________  
**Date**: ____________________

### Reviewer Information
**Name**: ____________________  
**Signature**: ____________________  
**Date**: ____________________

---

## 📝 NOTES & COMMENTS

_________________________________________________________________

_________________________________________________________________

_________________________________________________________________

_________________________________________________________________

_________________________________________________________________

_________________________________________________________________

---

**Version**: 1.0  
**Last Updated**: May 9, 2025  
**Print this checklist for each testing session**


