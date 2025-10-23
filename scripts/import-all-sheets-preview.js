/**
 * PREVIEW SCRIPT - Shows what data will be imported WITHOUT touching the database
 * Run this first to verify data mapping before actual import
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const {
  SHEET_MAPPING_STRATEGY,
  determineGroupType,
  determineRiskLevel,
  cleanValue
} = require('./data-mapping-strategy');

// Read the Excel file
const filePath = path.join(__dirname, '../public/gp.xlsx');

console.log('='.repeat(100));
console.log('DATA IMPORT PREVIEW - NO DATABASE CHANGES WILL BE MADE');
console.log('='.repeat(100));

function processSheet(workbook, sheetName, mappingStrategy) {
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet);

  const processedGroups = [];
  let skippedRows = 0;

  jsonData.forEach((row, index) => {
    try {
      // Skip empty rows
      if (!row || Object.keys(row).length === 0) {
        skippedRows++;
        return;
      }

      const mapping = mappingStrategy.mapping;

      // Extract and clean data
      const name = cleanValue(mapping.name(row));

      // Skip if no name
      if (!name || name === 'Unnamed Group') {
        skippedRows++;
        return;
      }

      const id = mapping.id(row, sheetName, index + 1);
      const members = mapping.totalMembers ? mapping.totalMembers(row) : 0;

      // Extract social media URLs
      const facebook = cleanValue(mapping.facebookUrl(row));
      const twitter = cleanValue(mapping.twitterUrl(row));
      const instagram = cleanValue(mapping.instagramUrl(row));
      const youtube = cleanValue(mapping.youtubeUrl(row));

      // Determine platforms
      const platforms = [];
      const socialMedia = {};

      if (facebook) {
        platforms.push('facebook');
        socialMedia.facebook = facebook;
      }
      if (twitter) {
        platforms.push('twitter');
        socialMedia.twitter = twitter;
      }
      if (instagram) {
        platforms.push('instagram');
        socialMedia.instagram = instagram;
      }
      if (youtube) {
        platforms.push('youtube');
        socialMedia.youtube = youtube;
      }

      // Extract contact info
      const phone = cleanValue(mapping.phoneNumber(row));
      const email = cleanValue(mapping.email(row));
      const location = cleanValue(mapping.physicalAddress(row));

      const contactInfo = {};
      if (phone) contactInfo.phone = phone;
      if (email) contactInfo.email = email;
      if (mapping.website) {
        const website = cleanValue(mapping.website(row));
        if (website) contactInfo.website = website;
      }

      // Create unified group object
      const group = {
        id,
        name,
        type: determineGroupType(sheetName, name),
        members,
        platforms,
        primaryPlatform: platforms[0] || 'unknown',
        description: `${name} - ${members.toLocaleString()} members`,
        riskLevel: determineRiskLevel(sheetName, name, members),
        category: sheetName,
        sheet: sheetName,
        location,
        contactInfo: Object.keys(contactInfo).length > 0 ? contactInfo : null,
        socialMedia: Object.keys(socialMedia).length > 0 ? socialMedia : null,
        influencers: cleanValue(mapping.influencers(row)),
        status: 'active',
        monitoringEnabled: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Set monitoring for high-risk groups
      if (group.riskLevel === 'high') {
        group.monitoringEnabled = true;
      }

      processedGroups.push(group);
    } catch (error) {
      console.error(`Error processing row ${index + 1} in ${sheetName}:`, error.message);
      skippedRows++;
    }
  });

  return { groups: processedGroups, skippedRows };
}

function previewImport() {
  try {
    const workbook = XLSX.readFile(filePath);
    const allGroups = [];
    const summary = {
      totalSheets: 0,
      totalGroups: 0,
      bySheet: {},
      byType: {},
      byRiskLevel: {},
      errors: []
    };

    // Process each mapping strategy
    Object.entries(SHEET_MAPPING_STRATEGY).forEach(([strategyName, strategy]) => {
      strategy.sheets.forEach(sheetName => {
        if (workbook.SheetNames.includes(sheetName)) {
          console.log(`\nProcessing: ${sheetName}`);
          console.log('-'.repeat(50));

          const result = processSheet(workbook, sheetName, strategy);

          console.log(`  ✓ Processed: ${result.groups.length} groups`);
          if (result.skippedRows > 0) {
            console.log(`  ⚠ Skipped: ${result.skippedRows} rows (empty or invalid)`);
          }

          // Add to all groups
          allGroups.push(...result.groups);

          // Update summary
          summary.totalSheets++;
          summary.bySheet[sheetName] = result.groups.length;

          // Count by type
          result.groups.forEach(g => {
            summary.byType[g.type] = (summary.byType[g.type] || 0) + 1;
            summary.byRiskLevel[g.riskLevel] = (summary.byRiskLevel[g.riskLevel] || 0) + 1;
          });

          // Show sample data from this sheet
          if (result.groups.length > 0) {
            const sample = result.groups[0];
            console.log(`  Sample entry:`);
            console.log(`    - ID: ${sample.id}`);
            console.log(`    - Name: ${sample.name.substring(0, 50)}...`);
            console.log(`    - Type: ${sample.type}`);
            console.log(`    - Members: ${sample.members.toLocaleString()}`);
            console.log(`    - Risk Level: ${sample.riskLevel}`);
            console.log(`    - Platforms: ${sample.platforms.join(', ') || 'none'}`);
          }
        } else {
          console.log(`\n⚠ Sheet "${sheetName}" not found in workbook`);
          summary.errors.push(`Sheet "${sheetName}" not found`);
        }
      });
    });

    summary.totalGroups = allGroups.length;

    // Display summary
    console.log('\n' + '='.repeat(100));
    console.log('IMPORT SUMMARY');
    console.log('='.repeat(100));

    console.log(`\nTotal Sheets Processed: ${summary.totalSheets}`);
    console.log(`Total Groups to Import: ${summary.totalGroups}`);

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

    if (summary.errors.length > 0) {
      console.log('\n⚠ Errors:');
      summary.errors.forEach(err => console.log(`  - ${err}`));
    }

    // Save preview data to JSON
    const previewPath = path.join(__dirname, 'import-preview-data.json');
    fs.writeFileSync(previewPath, JSON.stringify({
      summary,
      sampleGroups: allGroups.slice(0, 10),
      totalGroups: allGroups.length
    }, null, 2));

    console.log(`\n✓ Preview data saved to: ${previewPath}`);
    console.log('\n' + '='.repeat(100));
    console.log('NO DATABASE CHANGES WERE MADE - THIS WAS JUST A PREVIEW');
    console.log('Review the preview data before running the actual import');
    console.log('='.repeat(100));

    return { allGroups, summary };

  } catch (error) {
    console.error('Error during preview:', error);
  }
}

// Run preview
previewImport();