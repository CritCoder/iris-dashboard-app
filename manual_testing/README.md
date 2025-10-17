# Manual Testing Documentation

**IRIS Dashboard - Complete Testing Package**  
**Version**: 1.0  
**Last Updated**: May 9, 2025

---

## 📚 Quick Navigation

Start with **[TESTING_INDEX.md](./TESTING_INDEX.md)** - Your complete guide to all testing documentation.

---

## 📖 Documentation Files

### 1. [TESTING_INDEX.md](./TESTING_INDEX.md) - START HERE
**The master index for all testing documentation**
- Overview of all documents
- When to use which document
- Quick start guides for different roles
- Training program
- Navigation to all resources

**👉 Read this first if you're new to the testing team!**

---

### 2. [COMPREHENSIVE_TEST_PLAN.md](./COMPREHENSIVE_TEST_PLAN.md)
**Detailed test cases for every feature**
- 300+ test cases across 10 modules
- Step-by-step test procedures
- Expected vs actual results format
- Bug reporting template
- Priority levels (P0-P3)

**Use for**: Detailed testing, regression testing, formal QA

---

### 3. [TESTING_QUICK_REFERENCE.md](./TESTING_QUICK_REFERENCE.md)
**Quick daily testing guide**
- 15-minute critical path checklist
- Complete page map with URLs
- Feature test matrices
- Common issues guide
- Daily test routines

**Use for**: Daily smoke tests, quick verification, team handoffs

---

### 4. [PAGE_MAP_VISUAL.md](./PAGE_MAP_VISUAL.md)
**Visual site structure and navigation**
- ASCII visual site map
- All 29 pages mapped with relationships
- Feature breakdowns per page
- Testing priorities by module
- 5 quick test paths

**Use for**: Understanding app structure, navigation testing, onboarding

---

### 5. [TESTING_DOCUMENTATION_SUMMARY.md](./TESTING_DOCUMENTATION_SUMMARY.md)
**Overview and guide to using all documents**
- How to use each document
- Test execution workflows
- Onboarding guide (3-week program)
- Metrics to track
- Success criteria

**Use for**: Team planning, onboarding, understanding the package

---

### 6. [PRINTABLE_TEST_CHECKLIST.md](./PRINTABLE_TEST_CHECKLIST.md)
**Print-friendly test checklist**
- 500+ checkboxes for all tests
- Sign-off sections
- Bug summary areas
- Compliance-ready format

**Use for**: Test sessions, formal sign-offs, paper-based testing

---

## 🎯 Quick Start by Role

### Team Lead / QA Manager
```
1. Read: TESTING_INDEX.md (15 min)
2. Review: TESTING_DOCUMENTATION_SUMMARY.md (15 min)
3. Plan: Use COMPREHENSIVE_TEST_PLAN.md for sprint planning
```

### New Tester
```
1. Start: TESTING_INDEX.md (15 min)
2. Learn Structure: PAGE_MAP_VISUAL.md (20 min)
3. Practice: TESTING_QUICK_REFERENCE.md (30 min)
4. Deep Dive: COMPREHENSIVE_TEST_PLAN.md (2-3 hours)
```

### Experienced Tester
```
Daily: TESTING_QUICK_REFERENCE.md
Feature Testing: COMPREHENSIVE_TEST_PLAN.md
Navigation: PAGE_MAP_VISUAL.md
```

---

## 📊 What's Covered

### Test Coverage
- ✅ **300+ test cases** across all features
- ✅ **29 pages** fully documented
- ✅ **10 modules** covered:
  1. Authentication & Authorization
  2. Dashboard & Navigation
  3. Analysis & Campaigns
  4. Social Feed & Profiles
  5. Locations & Maps
  6. Organizations & Entities
  7. OSINT Tools
  8. UI Components & Interactions
  9. API Integration
  10. Performance & Responsiveness

### Testing Types
- ✅ Functional Testing
- ✅ UI/UX Testing
- ✅ API Testing
- ✅ Responsive Testing
- ✅ Browser Compatibility
- ✅ Performance Testing
- ✅ Accessibility Testing
- ✅ Security Testing

---

## 🚀 Quick Test Paths

### Path 1: Critical Path (15 minutes)
Login → Dashboard → Start Analysis → View Results → Logout

### Path 2: Social Media Flow (5 minutes)
Login → Social Feed → Profiles → Profile Detail → Logout

### Path 3: Complete Analysis Flow (5 minutes)
Login → Start Analysis → Analysis History → Analysis Detail → Post Detail → Logout

### Path 4: Campaign Flow (5 minutes)
Login → Start Analysis (save as campaign) → Campaign Detail → Logout

### Path 5: Location Flow (3 minutes)
Login → Locations → Location Detail → Logout

---

## 🛠️ Test Environment

### Application
```
Development: http://localhost:3000
API: https://irisnet.wiredleap.com
```

### Test Accounts
```
Mobile: 9876543210
Email: test@example.com
OTP: Check console in dev mode
```

---

## 📋 Recommended Testing Workflow

### Daily Smoke Test (15 min)
Use: `TESTING_QUICK_REFERENCE.md` - Critical Path section

### Feature Testing (1-2 hours)
Use: `COMPREHENSIVE_TEST_PLAN.md` - Specific module

### Full Regression (7-9 hours)
Use: `COMPREHENSIVE_TEST_PLAN.md` - All P0/P1 tests
Track: `PRINTABLE_TEST_CHECKLIST.md`

### Pre-Release Testing
1. Execute all test cases in `COMPREHENSIVE_TEST_PLAN.md`
2. Complete `PRINTABLE_TEST_CHECKLIST.md`
3. Sign off on release

---

## 🐛 Bug Reporting

**Template Location**: `COMPREHENSIVE_TEST_PLAN.md` - Bug Reporting Template section

**Quick Bug Report Format**:
```
Page: /page-url
Issue: Description
Expected: What should happen
Actual: What happened
Browser: Chrome 120
Device: Desktop
```

---

## ✅ Success Criteria

### Before Release
- [ ] All P0 tests pass
- [ ] < 5% P1 test failures
- [ ] All critical paths tested on all browsers
- [ ] Mobile responsive testing complete
- [ ] Performance benchmarks met
- [ ] Security checks pass
- [ ] Sign-off completed

---

## 📞 Getting Help

1. **Check Documentation**: Start with `TESTING_INDEX.md`
2. **Search**: Use Cmd+F to find specific topics
3. **Ask Team Lead**: For clarifications
4. **Consult Comprehensive Plan**: For detailed procedures

---

## 📈 Documentation Statistics

| Metric | Value |
|--------|-------|
| Total Documents | 6 (including this README) |
| Total Test Cases | 300+ |
| Total Checkboxes | 600+ |
| Modules Covered | 10 |
| Pages Tested | 29 |
| Full Test Time | 7-9 hours |
| Quick Test Time | 15 minutes |

---

## 🔄 Keeping Documentation Updated

This documentation is a living resource. Updates should be made:
- When new features are added
- When test processes change
- When bugs reveal gaps in coverage
- During quarterly reviews

---

## 📅 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | May 9, 2025 | Initial documentation package created |

---

## 🎉 You're Ready!

Your testing team has everything needed to ensure IRIS Dashboard quality.

**Start with**: [TESTING_INDEX.md](./TESTING_INDEX.md)

**Questions?** Refer to the documentation or ask your team lead.

---

**Happy Testing! 🚀**

