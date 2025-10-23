/**
 * IMPORT ALL 645 GROUPS FROM EXCEL INTO THE APPLICATION
 * This script processes the extracted data and creates a new data file for the API
 */

const fs = require('fs');
const path = require('path');

// Load the extracted data
const extractedDataPath = path.join(__dirname, 'all-groups-complete.json');
const extractedData = JSON.parse(fs.readFileSync(extractedDataPath, 'utf-8'));

console.log('IMPORTING ALL GROUPS INTO APPLICATION');
console.log('='.repeat(80));

// Helper functions
function cleanValue(value) {
  if (!value || typeof value !== 'string') return null;
  const cleaned = value.trim();

  // Check for common null values
  if (['nil', 'nill', 'null', 'na', 'n/a', 'not manation', '-', ''].includes(cleaned.toLowerCase())) {
    return null;
  }

  // Remove "Linked E-Mail ID" prefix if present
  if (cleaned.includes('Linked E-Mail ID')) {
    return cleaned.replace('Linked E-Mail ID', '').replace(/\n/g, '').trim();
  }

  return cleaned;
}

function determineGroupType(sheetName, groupName) {
  const name = (groupName || '').toLowerCase();
  const sheet = sheetName.toLowerCase();

  // Sheet-based categorization
  if (sheet.includes('hindu')) return 'religious';
  if (sheet.includes('muslim')) return 'religious';
  if (sheet.includes('christian')) return 'religious';
  if (sheet.includes('political')) return 'political';
  if (sheet.includes('student')) return 'social';
  if (sheet.includes('woman') || sheet.includes('women')) return 'social';
  if (sheet.includes('farmer')) return 'professional';
  if (sheet.includes('trade union')) return 'professional';
  if (sheet.includes('human rights')) return 'social';
  if (sheet.includes('kannadda') || sheet.includes('kannada')) return 'cultural';

  // Name-based fallback
  if (name.includes('hindu') || name.includes('muslim') || name.includes('christian')) return 'religious';
  if (name.includes('bjp') || name.includes('congress') || name.includes('political')) return 'political';
  if (name.includes('student') || name.includes('youth')) return 'social';
  if (name.includes('farmer') || name.includes('union')) return 'professional';

  return 'other';
}

function determineRiskLevel(sheetName, groupName, memberCount) {
  const name = (groupName || '').toLowerCase();
  const members = parseInt(memberCount) || 0;

  // High risk indicators
  if (name.includes('militant') || name.includes('sena') || name.includes('dal')) return 'high';
  if (sheetName.includes('Right Wing')) return 'high';

  // Medium risk based on size
  if (members > 50000) return 'medium';
  if (members > 10000 && (name.includes('hindu') || name.includes('muslim'))) return 'medium';

  return 'low';
}

// Process all groups
const processedGroups = [];
let errorCount = 0;

extractedData.groups.forEach((group, index) => {
  try {
    // Clean all values
    const facebook = cleanValue(group.facebook);
    const twitter = cleanValue(group.twitter);
    const instagram = cleanValue(group.instagram);
    const youtube = cleanValue(group.youtube);
    const phone = cleanValue(group.phone);
    const email = cleanValue(group.email);
    const address = cleanValue(group.address);
    const influencers = cleanValue(group.influencers);

    // Determine platforms
    const platforms = [];
    const socialMedia = {};

    if (facebook && facebook.startsWith('http')) {
      platforms.push('facebook');
      socialMedia.facebook = facebook;
    }
    if (twitter && (twitter.startsWith('http') || twitter.startsWith('@'))) {
      platforms.push('twitter');
      socialMedia.twitter = twitter;
    }
    if (instagram && instagram.startsWith('http')) {
      platforms.push('instagram');
      socialMedia.instagram = instagram;
    }
    if (youtube && youtube.startsWith('http')) {
      platforms.push('youtube');
      socialMedia.youtube = youtube;
    }

    // Build contact info
    const contactInfo = {};
    if (phone) contactInfo.phone = phone;
    if (email) contactInfo.email = email;

    // Create processed group object
    const processedGroup = {
      id: group.id,
      name: group.name,
      type: determineGroupType(group.sheet, group.name),
      members: parseInt(group.members) || 0,
      platforms,
      primaryPlatform: platforms[0] || 'unknown',
      description: `${group.name} - Sheet: ${group.sheet}`,
      riskLevel: determineRiskLevel(group.sheet, group.name, group.members),
      category: group.sheet,
      sheet: group.sheet,
      location: address,
      contactInfo: Object.keys(contactInfo).length > 0 ? contactInfo : null,
      socialMedia: Object.keys(socialMedia).length > 0 ? socialMedia : null,
      influencers: influencers,
      status: 'active',
      monitoringEnabled: false,
      isFacebookOnly: group.isFacebookOnly || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Enable monitoring for high-risk groups
    if (processedGroup.riskLevel === 'high') {
      processedGroup.monitoringEnabled = true;
    }

    processedGroups.push(processedGroup);
  } catch (error) {
    console.error(`Error processing group ${index + 1}:`, error.message);
    errorCount++;
  }
});

// Generate summary
const summary = {
  totalGroups: processedGroups.length,
  bySheet: {},
  byType: {},
  byRiskLevel: {},
  byPlatform: {},
  errors: errorCount
};

// Count by sheet
processedGroups.forEach(group => {
  // By sheet
  summary.bySheet[group.sheet] = (summary.bySheet[group.sheet] || 0) + 1;

  // By type
  summary.byType[group.type] = (summary.byType[group.type] || 0) + 1;

  // By risk level
  summary.byRiskLevel[group.riskLevel] = (summary.byRiskLevel[group.riskLevel] || 0) + 1;

  // By platform
  group.platforms.forEach(platform => {
    summary.byPlatform[platform] = (summary.byPlatform[platform] || 0) + 1;
  });
});

// Display summary
console.log(`\nProcessed ${processedGroups.length} groups successfully`);
if (errorCount > 0) {
  console.log(`⚠ ${errorCount} groups had errors and were skipped`);
}

console.log('\nGroups by Sheet:');
Object.entries(summary.bySheet).forEach(([sheet, count]) => {
  console.log(`  ${sheet}: ${count}`);
});

console.log('\nGroups by Type:');
Object.entries(summary.byType).forEach(([type, count]) => {
  console.log(`  ${type}: ${count}`);
});

console.log('\nGroups by Risk Level:');
Object.entries(summary.byRiskLevel).forEach(([level, count]) => {
  console.log(`  ${level}: ${count}`);
});

console.log('\nGroups by Platform:');
Object.entries(summary.byPlatform).forEach(([platform, count]) => {
  console.log(`  ${platform}: ${count}`);
});

// Save processed data
const outputData = {
  summary,
  groups: processedGroups,
  metadata: {
    totalGroups: processedGroups.length,
    importedAt: new Date().toISOString(),
    source: 'gp.xlsx'
  }
};

const outputPath = path.join(__dirname, '../public/groups-data.json');
fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));

console.log('\n' + '='.repeat(80));
console.log(`✓ Data successfully prepared for import`);
console.log(`✓ Saved to: ${outputPath}`);
console.log(`✓ Total groups: ${processedGroups.length}`);
console.log('='.repeat(80));

module.exports = outputData;