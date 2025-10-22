# To Be Deleted

**Temporary files, test scripts, and debug artifacts that can be safely deleted**

This folder contains files that were used during development/testing but are no longer needed for the application to function.

---

## ⚠️ Safe to Delete

All files in this folder can be safely deleted. They are:
- Test scripts used during development
- API capture/debugging files
- JSON data dumps from testing
- Temporary debug files
- Old test results

---

## 📁 What's Inside

### API Testing & Debugging Files
- all-requests-corrected.json
- all-requests-raw.json
- api-calls-captured.json
- api-comparison-report.md
- api-endpoints-report.json
- api-interaction-results.json
- api-test-summary.json
- captured-api-requests.json
- captured-authenticated-requests.json
- external-api-collection-corrected.json
- external-api-collection.json
- internal-api-collection-corrected.json
- internal-api-collection.json

### Test Scripts
- capture-api-requests.js
- capture-authenticated-requests.js
- extract-api-calls-final.js
- extract-api-calls-v2.js
- extract-api-calls-v3.js
- extract-api-calls.js
- final-comprehensive-test.js
- fix-api-errors.js
- fix-api-paths.js
- generate-final-collections.js
- test-all-pages.js
- test-api-calls.js
- test-api-interactions.js

### Other Temporary Files
- check-auth.html
- test-results.json
- Icon (duplicate/unused icon file)

---

## 🗑️ Why These Can Be Deleted

### API Testing Files
These were used to capture and analyze API calls during development. Now that the API integration is complete and documented, these raw capture files are no longer needed.

### Test Scripts
These were temporary scripts created to test various aspects of the application during development. Proper testing is now handled by:
- Manual testing documentation (in `/manual_testing/`)
- Playwright E2E tests (in `/tests/`)

### JSON Data Dumps
These are snapshots of API responses used for debugging. They're no longer needed as the API integration is stable and documented.

---

## ✅ Before Deleting

Make sure you've reviewed:
1. `/final_instructions/` - Contains all important documentation
2. `/manual_testing/` - Contains proper testing documentation
3. `/tests/` - Contains automated tests

If anything important is missing, retrieve it from these temporary files before deletion.

---

## 🔄 How to Delete

**Option 1: Delete entire folder**
```bash
rm -rf to_be_deleted/
```

**Option 2: Delete contents, keep folder**
```bash
rm -rf to_be_deleted/*
```

**Option 3: Review first**
```bash
# List all files
ls -la to_be_deleted/

# Delete specific files
cd to_be_deleted/
rm [filename]
```

---

## 📊 Statistics

- **Total Files**: 28
- **Disk Space**: ~2-5 MB (estimated)
- **Purpose**: Development/testing artifacts
- **Status**: No longer needed

---

## 💡 Note

If you're unsure about deleting these files, you can:
1. Create a backup/archive
2. Move to a separate archive folder
3. Keep them for a few more weeks before deletion

However, all critical information has been preserved in:
- `/final_instructions/` - Implementation docs
- `/manual_testing/` - Testing docs
- Application code itself

---

**Created**: May 9, 2025  
**Status**: Ready for deletion  
**Risk Level**: None - safe to delete

