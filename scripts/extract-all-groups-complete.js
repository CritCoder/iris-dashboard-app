/**
 * COMPLETE EXTRACTION INCLUDING FACEBOOK-ONLY ENTRIES
 * This extracts ALL groups including those with only Facebook URLs
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/gp.xlsx');

console.log('EXTRACTING ALL GROUPS - INCLUDING FACEBOOK-ONLY ENTRIES\n');
console.log('='.repeat(100));

function extractNameFromFacebookUrl(url) {
  if (!url || typeof url !== 'string') return null;

  // Clean the URL
  url = url.trim();

  // Pattern 1: facebook.com/pagename
  let match = url.match(/facebook\.com\/([^\/\?&]+)/);
  if (match && match[1] !== 'profile.php' && match[1] !== 'groups') {
    return match[1]
      .replace(/[-_.]/g, ' ')
      .replace(/%20/g, ' ')
      .replace(/%E0%B.*?%/g, '') // Remove encoded Kannada characters
      .trim();
  }

  // Pattern 2: facebook.com/groups/groupid
  match = url.match(/facebook\.com\/groups\/([^\/\?&]+)/);
  if (match) {
    return `Group: ${match[1]}`;
  }

  // Pattern 3: profile.php?id=123
  match = url.match(/profile\.php\?id=(\d+)/);
  if (match) {
    return `Facebook Profile ${match[1]}`;
  }

  return null;
}

function processAllSheets() {
  const workbook = XLSX.readFile(filePath);
  const allGroups = [];
  const summary = {
    bySheet: {},
    totalGroups: 0,
    withNames: 0,
    facebookOnly: 0
  };

  workbook.SheetNames.forEach(sheetName => {
    console.log(`\nProcessing: ${sheetName}`);
    console.log('-'.repeat(50));

    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {defval: ""});
    const sheetGroups = [];

    let groupsWithNames = 0;
    let facebookOnlyGroups = 0;
    let skipped = 0;

    jsonData.forEach((row, index) => {
      // Try to find the Facebook URL in various possible columns
      const fbUrl = row['Facebook Profile URL'] ||
                   row[' Facebook Profile URL '] || // Note the spaces
                   row['Facebook Page Link'] ||
                   '';

      const orgType = row['Organisation Type'] ||
                     row['Facebook Page Name'] ||
                     row['POLITICAL AND RELEGIOUS  ORGANIZATIONS KARNATAKA'] ||
                     '';

      // Clean values
      const cleanFbUrl = fbUrl.toString().trim();
      const cleanOrgType = orgType.toString().trim();

      // Skip if no useful data
      if (!cleanFbUrl && !cleanOrgType) {
        skipped++;
        return;
      }

      // Skip header rows that might have been included
      if (cleanFbUrl === 'Facebook Profile URL' || cleanOrgType === 'Organisation Type') {
        skipped++;
        return;
      }

      // Skip invalid URLs
      if (cleanFbUrl && !cleanFbUrl.startsWith('http')) {
        if (cleanFbUrl.toLowerCase() !== 'nil' &&
            cleanFbUrl.toLowerCase() !== 'nill' &&
            cleanFbUrl !== '') {
          console.log(`  Skipping invalid URL at row ${index + 2}: ${cleanFbUrl.substring(0, 30)}`);
        }
        skipped++;
        return;
      }

      let groupName = cleanOrgType;
      let isFacebookOnly = false;

      // If no organization name, try to extract from Facebook URL
      if (!groupName && cleanFbUrl) {
        groupName = extractNameFromFacebookUrl(cleanFbUrl);
        if (groupName) {
          isFacebookOnly = true;
          facebookOnlyGroups++;
        } else {
          groupName = `Unknown ${sheetName} #${index + 1}`;
        }
      } else if (groupName) {
        groupsWithNames++;
      }

      if (!groupName) {
        skipped++;
        return;
      }

      // Extract other data
      const members = parseInt(row['Total Members'] || '0');
      const twitter = row['Twitter'] || row['Twitter Link'] || row['IN TWITTER'] || '';
      const instagram = row['Instagram'] || '';
      const youtube = row['Youtube'] || row['Youtube ID'] || '';
      const phone = row['Linked Phone Number'] || row['Mobile Nomber'] || '';
      const email = row['Linked E-Mail ID'] || row['Email ID'] || '';
      const address = row['Physical Address'] || row['Location'] || row['Address'] || '';
      const influencers = row['Top Influencer IDS'] || '';

      // Create group object
      const group = {
        id: `${sheetName.toLowerCase().replace(/\s+/g, '_')}_${row['Sl No'] || row['SL No'] || (index + 1)}`,
        name: groupName,
        sheet: sheetName,
        members: members,
        facebook: cleanFbUrl,
        twitter: twitter.toString().trim(),
        instagram: instagram.toString().trim(),
        youtube: youtube.toString().trim(),
        phone: phone.toString().trim(),
        email: email.toString().trim(),
        address: address.toString().trim(),
        influencers: influencers.toString().trim(),
        isFacebookOnly: isFacebookOnly
      };

      sheetGroups.push(group);
      allGroups.push(group);
    });

    // Update summary
    summary.bySheet[sheetName] = {
      total: sheetGroups.length,
      withNames: groupsWithNames,
      facebookOnly: facebookOnlyGroups,
      skipped: skipped
    };

    console.log(`  ✓ Extracted: ${sheetGroups.length} groups`);
    console.log(`    - With names: ${groupsWithNames}`);
    console.log(`    - Facebook-only: ${facebookOnlyGroups}`);
    console.log(`    - Skipped: ${skipped}`);

    // Show samples of Facebook-only groups
    if (facebookOnlyGroups > 0) {
      console.log('  Sample Facebook-only groups:');
      sheetGroups.filter(g => g.isFacebookOnly).slice(0, 3).forEach(g => {
        console.log(`    - ${g.name}`);
      });
    }
  });

  summary.totalGroups = allGroups.length;
  summary.withNames = Object.values(summary.bySheet).reduce((sum, s) => sum + s.withNames, 0);
  summary.facebookOnly = Object.values(summary.bySheet).reduce((sum, s) => sum + s.facebookOnly, 0);

  return { allGroups, summary };
}

// Run extraction
const { allGroups, summary } = processAllSheets();

// Display final summary
console.log('\n' + '='.repeat(100));
console.log('EXTRACTION COMPLETE');
console.log('='.repeat(100));

console.log('\nSummary by Sheet:');
Object.entries(summary.bySheet).forEach(([sheet, stats]) => {
  if (stats.total > 0) {
    console.log(`  ${sheet}: ${stats.total} groups`);
  }
});

console.log('\n' + '-'.repeat(50));
console.log(`TOTAL GROUPS EXTRACTED: ${summary.totalGroups}`);
console.log(`  - Groups with original names: ${summary.withNames}`);
console.log(`  - Groups from Facebook URLs: ${summary.facebookOnly}`);

// Save all data
const outputPath = path.join(__dirname, 'all-groups-complete.json');
fs.writeFileSync(outputPath, JSON.stringify({
  summary,
  groups: allGroups
}, null, 2));

console.log(`\n✓ All data saved to: ${outputPath}`);

module.exports = { allGroups, summary };