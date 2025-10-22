# IRIS Dashboard - Testing Quick Reference

**Quick access guide for manual testers**  
**Test URL**: http://localhost:3000

---

## 📋 Quick Test Checklist

### ✅ Critical Path Testing (Must Test First - P0)

| Feature | URL | Key Tests | Status |
|---------|-----|-----------|--------|
| **Login** | `/login` | Mobile login, Email login, OTP flow | ☐ |
| **Signup** | `/signup` | Registration, OTP verification | ☐ |
| **Dashboard** | `/` | Loads, sidebar nav works | ☐ |
| **Start Analysis** | `/start-analysis` | Create analysis, search works | ☐ |
| **Analysis Results** | `/analysis-history/[id]` | Posts display, filters work | ☐ |
| **Social Feed** | `/social-feed` | Posts load, infinite scroll | ☐ |
| **Profiles** | `/profiles` | List displays, detail view | ☐ |
| **Logout** | Any page | Logout works, redirects correctly | ☐ |

---

## 🗺️ Complete Page Map

### Authentication Pages (No Login Required)
```
/login                          - Login page
  /login/verify-otp             - OTP verification for login
/signup                         - Registration page
  /signup/verify-otp            - OTP verification for signup
/forgot-password                - Password reset request
  /forgot-password/verify-otp   - OTP verification for reset
  /forgot-password/reset        - Set new password
```

### Main Application (Login Required)
```
/                               - Main dashboard
/start-analysis                 - Start new social media analysis
/analysis-history               - List of all past analyses
  /analysis-history/[id]        - Detailed analysis results
    /analysis-history/[id]/post/[postId]  - Individual post detail
/social-feed                    - Aggregated social media feed
/social-inbox                   - Social media messages/notifications
/profiles                       - Social media profiles list
  /profiles/[id]                - Detailed profile view
/locations                      - Location-based analysis
  /locations/[id]               - Specific location details
/organizations                  - Organizations list
  /organizations/[id]           - Organization details
/entities                       - Named entities (people, places, orgs)
/entity-search                  - Search for entities
/communities-groups             - Community and group analysis
/campaign/[id]                  - Campaign monitoring
/post-campaign/[id]             - Post-campaign analysis
/osint-tools                    - Open-source intelligence tools
```

### Debug/Test Pages
```
/debug-auth                     - Authentication debugging
/clear-auth                     - Clear authentication
/test-map                       - Map testing
/test-osm                       - OpenStreetMap testing
/test-animations                - Animation testing
/optimized-components           - Component performance testing
```

---

## 🎯 Feature Test Matrix

### 1. Authentication & Security

| Test | Location | What to Check |
|------|----------|---------------|
| Mobile Login | `/login` | Enter 10-digit number, receive OTP, verify |
| Email Login | `/login` | Enter email, receive OTP, verify |
| Invalid Input | `/login` | Try 9 digits, invalid email - should show errors |
| OTP Auto-Submit | `/login/verify-otp` | Enter 6 digits, auto-submits |
| OTP Timer | `/login/verify-otp` | Timer counts down from 120s |
| Resend OTP | `/login/verify-otp` | Wait for timer, click resend |
| Signup Flow | `/signup` | Full registration with OTP |
| Password Strength | `/signup` | Watch indicators as you type |
| Password Reset | `/forgot-password` | Complete reset flow |
| Session Timeout | Any page | Wait 30min, session should expire |
| Logout | Any page | Click logout, should redirect to login |
| Protected Routes | Direct URL | Access `/profiles` without login - should redirect |

### 2. Dashboard & Navigation

| Test | Location | What to Check |
|------|----------|---------------|
| Sidebar Visible | `/` | Icon sidebar (left) + Main sidebar visible |
| Icon Navigation | `/` | Click each icon, page changes |
| Active State | Any page | Current page highlighted in sidebar |
| Quick Actions | Any page | Press `Cmd+K` or `Ctrl+K`, search works |
| Shortcuts Dialog | Any page | Press `?`, dialog shows shortcuts |
| Theme Toggle | Any page | Switch light/dark, verify persists |
| User Menu | Any page | Click profile, dropdown appears |
| Breadcrumbs | Detail pages | Breadcrumbs show current location |

### 3. Analysis Features

| Test | Location | What to Check |
|------|----------|---------------|
| Search Input | `/start-analysis` | Enter query, character count updates |
| Platform Selection | `/start-analysis` | Select multiple platforms |
| Date Range | `/start-analysis` | Choose time range, custom dates |
| Start Analysis | `/start-analysis` | Submit form, redirects to results |
| Analysis History | `/analysis-history` | Past analyses listed |
| Sort History | `/analysis-history` | Sort by date, status, platform |
| Analysis Details | `/analysis-history/[id]` | Full results display |
| Quick Filters | `/analysis-history/[id]` | Click filters, results update |
| Posts Grid | `/analysis-history/[id]` | Posts display in grid |
| Sentiment Chart | `/analysis-history/[id]` | Pie chart shows sentiment |
| Timeline Chart | `/analysis-history/[id]` | Line chart shows engagement over time |
| Infinite Scroll | `/analysis-history/[id]` | Scroll posts, more load automatically |
| Export Report | `/analysis-history/[id]` | Click export, download PDF/CSV |
| Post Detail | `/analysis-history/[id]/post/[postId]` | Full post info |

### 4. Social Features

| Test | Location | What to Check |
|------|----------|---------------|
| Feed Display | `/social-feed` | Posts from multiple platforms |
| Platform Filter | `/social-feed` | Filter by specific platform |
| Sort Feed | `/social-feed` | Sort by recent, popular, trending |
| Feed Scroll | `/social-feed` | Infinite scroll loads more |
| Inbox Display | `/social-inbox` | Messages/notifications listed |
| Inbox Filters | `/social-inbox` | Filter unread, mentions, DMs |
| Mark as Read | `/social-inbox` | Click message, marks read |
| Profiles Grid | `/profiles` | Profiles display in grid |
| Search Profiles | `/profiles` | Search by username |
| Profile Detail | `/profiles/[id]` | Full profile info |
| Profile Tabs | `/profiles/[id]` | Posts, Media, Analytics, AI tabs |
| Profile Posts | `/profiles/[id]` | Posts tab shows user's posts |
| Profile Analytics | `/profiles/[id]` | Charts and metrics display |
| AI Analysis | `/profiles/[id]` | AI insights load |

### 5. Location & Map Features

| Test | Location | What to Check |
|------|----------|---------------|
| Map Display | `/locations` | Map loads with markers |
| List View | `/locations` | Switch to list view |
| Map Navigation | `/locations` | Zoom, pan map |
| Marker Clusters | `/locations` | Zoom out, markers cluster |
| Location Detail | `/locations/[id]` | Location info and map |
| Location Posts | `/locations/[id]` | Posts from location |

### 6. Organizations & Entities

| Test | Location | What to Check |
|------|----------|---------------|
| Orgs Grid | `/organizations` | Organizations listed |
| Search Orgs | `/organizations` | Search functionality |
| Org Detail | `/organizations/[id]` | Organization profile |
| Entities List | `/entities` | All entities shown |
| Entity Types | `/entities` | Filter by type (people, orgs, etc.) |
| Entity Search | `/entity-search` | Advanced search |

### 7. Campaign Management

| Test | Location | What to Check |
|------|----------|---------------|
| Campaign Detail | `/campaign/[id]` | Campaign overview |
| Start Monitoring | `/campaign/[id]` | Start button works |
| Stop Monitoring | `/campaign/[id]` | Stop button works |
| Real-time Updates | `/campaign/[id]` | New posts appear automatically |
| Campaign Settings | `/campaign/[id]` | Edit campaign |
| Post-Campaign | `/post-campaign/[id]` | Final results |

### 8. OSINT Tools

| Test | Location | What to Check |
|------|----------|---------------|
| Tools List | `/osint-tools` | All tools listed |
| Reverse Image | `/osint-tools` | Upload image, search |
| Username Search | `/osint-tools` | Search username across platforms |
| Email Lookup | `/osint-tools` | Lookup email |
| Phone Lookup | `/osint-tools` | Lookup phone number |
| Domain Investigation | `/osint-tools` | Investigate domain |

### 9. UI Components

| Test | Location | What to Check |
|------|----------|---------------|
| Toasts | Trigger any action | Success/error notifications appear |
| Modals | Delete/confirm actions | Modal opens, backdrop, ESC closes |
| Dropdowns | Any filter/menu | Opens, selects, closes |
| Forms | Any form | Validation, submit, errors |
| Tables | Any data table | Sorting, pagination works |
| Charts | Dashboard, analytics | Charts render, hover tooltips |
| Tooltips | Hover elements | Tooltips appear/disappear |
| Skeletons | Page load | Loading skeletons show |
| Empty States | No data pages | Helpful message displays |

### 10. Responsive & Performance

| Test | Browser Size | What to Check |
|------|-------------|---------------|
| Desktop | 1920x1080 | Full layout, all features |
| Laptop | 1440x900 | Responsive adjustments |
| Tablet | 768x1024 | Touch-friendly, readable |
| Mobile | 375x667 | Mobile layout, hamburger menu |
| Rotate Device | Tablet/Mobile | Layout adapts to orientation |
| Page Load | Any page | Loads in < 3 seconds |
| Navigation | Between pages | Transitions smooth |
| Large Dataset | Analysis results | 100+ items render smoothly |

---

## 🔍 Common Issues to Look For

### Visual Issues
- [ ] Text cut off or overlapping
- [ ] Images not loading or broken
- [ ] Misaligned elements
- [ ] Wrong colors or styling
- [ ] Animations not working
- [ ] Icons missing or wrong
- [ ] Responsive breakpoints broken
- [ ] Sidebar layout issues

### Functional Issues
- [ ] Buttons not clickable
- [ ] Forms not submitting
- [ ] Data not loading
- [ ] Infinite scroll not triggering
- [ ] Filters not applying
- [ ] Search not working
- [ ] Navigation broken
- [ ] Modal won't close
- [ ] Dropdown won't open
- [ ] Charts not rendering

### Performance Issues
- [ ] Page takes > 3s to load
- [ ] Lag when scrolling
- [ ] Slow form submission
- [ ] Chart rendering slow
- [ ] Memory leaks (tabs freeze)
- [ ] Large bundle sizes

### Data Issues
- [ ] Empty states when should have data
- [ ] Wrong data displaying
- [ ] Duplicate items
- [ ] Incorrect counts/metrics
- [ ] Broken pagination
- [ ] Missing fields

### Auth Issues
- [ ] Can't login
- [ ] Can't logout
- [ ] Session expires too soon
- [ ] Redirects not working
- [ ] Protected routes accessible without login
- [ ] Token not persisting

---

## 🛠️ Testing Tools

### Browser DevTools
```
F12 or Cmd+Option+I - Open DevTools
Cmd+Shift+M - Toggle device toolbar (responsive testing)
Network Tab - Check API calls
Console Tab - Check for errors
Application Tab - Check localStorage/sessionStorage
```

### Keyboard Shortcuts
```
Cmd/Ctrl + K - Quick actions
? - Show keyboard shortcuts
Tab - Navigate focusable elements
Esc - Close modals
```

### Test Accounts
```
Mobile: 9876543210
Email: test@example.com
OTP: [Will be sent to console in dev mode]
```

---

## 📝 How to Report a Bug

### Quick Bug Report Format
```
**Page**: /login
**Issue**: Button not clickable after submitting form
**Steps**: 
1. Go to /login
2. Enter mobile number
3. Click "Send OTP"
4. Try clicking button again - it stays disabled

**Expected**: Button should re-enable after API response
**Actual**: Button stays disabled permanently
**Browser**: Chrome 120
**Screenshot**: [Attach]
```

### Where to Report
- Create GitHub issue
- Add to bug tracking sheet
- Notify team on Slack/Discord

---

## ✅ Daily Test Routine

### Morning Check (15 mins)
1. [ ] Can login with mobile
2. [ ] Dashboard loads
3. [ ] Start new analysis
4. [ ] View analysis results
5. [ ] Check social feed
6. [ ] View a profile
7. [ ] Logout works

### Full Regression (2-3 hours)
- Run through all P0 and P1 tests
- Test on 2+ browsers
- Test on mobile device
- Check responsive at 3+ sizes
- Verify all critical paths

### Before Release
- Complete ALL test cases
- Test on all browsers
- Test on all devices
- Performance testing
- Security check
- Accessibility audit

---

## 📞 Need Help?

**Test Plan**: See `COMPREHENSIVE_TEST_PLAN.md` for detailed test cases  
**API Docs**: See `API_QUICK_REFERENCE.md`  
**Setup**: See `QUICK_START.md`

---

**Last Updated**: May 9, 2025  
**Version**: 1.0

