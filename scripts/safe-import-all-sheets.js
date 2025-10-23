/**
 * SAFE IMPORT SCRIPT - ADDS DATA WITHOUT DELETING/ALTERING EXISTING DATA
 *
 * This script will:
 * 1. Read data from all sheets in the CSV file
 * 2. INSERT new records into the database
 * 3. NOT delete or alter any existing data
 * 4. Use INSERT ... ON CONFLICT DO NOTHING to avoid duplicates
 */

const fs = require('fs');
const path = require('path');

// Define the sheet names as they appear in the spreadsheet
const SHEET_NAMES = [
  'Right Hindu Groups',
  'Right Hindu Persons',
  'Right Wing Muslim Groups',
  'Human Rights',
  'ALL Farmers ORG Karnataka',
  'Trade Unions',
  'RRP',
  'Students ORG',
  'Christians Activist',
  'Kannadda',
  'Woman',
  'Mixed',
  'Mixed 2',
  'Political'
];

// Function to determine risk level based on group characteristics
function determineRiskLevel(name, members) {
  const nameUpper = name.toUpperCase();

  // High risk indicators
  if (nameUpper.includes('ಕಠೋರ') || nameUpper.includes('ಸೇನೆ') ||
      nameUpper.includes('ದಳ') || nameUpper.includes('BAJRANG') ||
      nameUpper.includes('MILITANT')) {
    return 'high';
  }

  // Medium risk for large groups or specific organizations
  if (members > 50000 || nameUpper.includes('ಹಿಂದೂ') ||
      nameUpper.includes('HINDU') || nameUpper.includes('ACTIVIST')) {
    return 'medium';
  }

  return 'low';
}

// Function to determine group type
function determineGroupType(name, sheetName) {
  const nameUpper = name.toUpperCase();

  // Use sheet name as a hint
  if (sheetName.includes('Muslim')) return 'religious';
  if (sheetName.includes('Christian')) return 'religious';
  if (sheetName.includes('Hindu')) return 'religious';
  if (sheetName.includes('Political')) return 'political';
  if (sheetName.includes('Students')) return 'social';
  if (sheetName.includes('Woman')) return 'social';
  if (sheetName.includes('Farmers')) return 'professional';
  if (sheetName.includes('Trade Unions')) return 'professional';
  if (sheetName.includes('Human Rights')) return 'social';

  // Fallback to name-based detection
  if (nameUpper.includes('ಹಿಂದೂ') || nameUpper.includes('HINDU') ||
      nameUpper.includes('ಬಜರಂಗ') || nameUpper.includes('ಪರಿಷತ್')) {
    return 'religious';
  }

  if (nameUpper.includes('ಮೋದಿ') || nameUpper.includes('MODI') ||
      nameUpper.includes('ಬಿಜೆಪಿ') || nameUpper.includes('BJP')) {
    return 'political';
  }

  if (nameUpper.includes('ಯುವ') || nameUpper.includes('YOUTH') ||
      nameUpper.includes('ಅಭಿಮಾನಿ')) {
    return 'social';
  }

  return 'other';
}

// Generate SQL for safe import (INSERT with ON CONFLICT DO NOTHING)
function generateSafeImportSQL() {
  const csvPath = path.join(__dirname, '../public/groups.csv');

  // Note: Since we only have one CSV file with data for "Right Hindu Groups",
  // we'll process that and create placeholder structure for other sheets

  console.log('Reading groups.csv file...');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n').filter(line => line.trim());

  let sqlStatements = [];

  // Add header comment
  sqlStatements.push(`-- SAFE IMPORT SCRIPT - Generated on ${new Date().toISOString()}`);
  sqlStatements.push(`-- This script uses INSERT ... ON CONFLICT DO NOTHING to avoid duplicates`);
  sqlStatements.push(`-- No existing data will be deleted or altered\n`);

  // Process current CSV data as "Right Hindu Groups"
  sqlStatements.push(`-- Importing Right Hindu Groups sheet data`);

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    // Simple CSV parsing
    const values = line.split(',');

    const slNo = values[0]?.trim();
    const orgName = values[1]?.trim();
    const totalMembers = parseInt(values[2]?.replace(/[^\d]/g, '') || '0');
    const influencers = values[3]?.trim();
    const facebookUrl = values[4]?.trim();
    const twitterUrl = values[5]?.trim();
    const instagramUrl = values[6]?.trim();
    const youtubeUrl = values[7]?.trim();
    const physicalAddress = values[8]?.trim();
    const phoneNumber = values[9]?.trim();
    const email = values[10]?.trim();

    // Skip empty rows or header rows
    if (!orgName || orgName === 'Organisation Type') continue;

    // Prepare values for SQL
    const id = `rh_group_${slNo || i}`;
    const name = orgName.replace(/'/g, "''");
    const type = determineGroupType(orgName, 'Right Hindu Groups');
    const riskLevel = determineRiskLevel(orgName, totalMembers);
    const sheet = 'Right Hindu Groups';

    // Build platforms array
    const platforms = [];
    const socialMedia = {};

    if (facebookUrl && facebookUrl !== 'Nil' && facebookUrl !== 'NIL') {
      platforms.push('facebook');
      socialMedia.facebook = facebookUrl.replace(/'/g, "''");
    }
    if (twitterUrl && twitterUrl !== 'Nil' && twitterUrl !== 'NIL') {
      platforms.push('twitter');
      socialMedia.twitter = twitterUrl.replace(/'/g, "''");
    }
    if (instagramUrl && instagramUrl !== 'Nil' && instagramUrl !== 'NIL') {
      platforms.push('instagram');
      socialMedia.instagram = instagramUrl.replace(/'/g, "''");
    }
    if (youtubeUrl && youtubeUrl !== 'Nil' && youtubeUrl !== 'NIL') {
      platforms.push('youtube');
      socialMedia.youtube = youtubeUrl.replace(/'/g, "''");
    }

    const platformsJson = JSON.stringify(platforms);
    const socialMediaJson = Object.keys(socialMedia).length > 0 ? JSON.stringify(socialMedia) : 'NULL';

    const location = physicalAddress && physicalAddress !== 'Nil' && physicalAddress !== 'NIL'
      ? `'${physicalAddress.replace(/'/g, "''")}'` : 'NULL';

    const contactInfoJson = {};
    if (phoneNumber && phoneNumber !== 'Nil' && phoneNumber !== 'NIL') {
      contactInfoJson.phone = phoneNumber;
    }
    if (email && email !== 'Nil' && email !== 'NIL' && email !== 'Linked E-Mail ID') {
      contactInfoJson.email = email;
    }
    const contactInfo = Object.keys(contactInfoJson).length > 0
      ? `'${JSON.stringify(contactInfoJson).replace(/'/g, "''")}'` : 'NULL';

    const influencersValue = influencers && influencers !== 'Nil' && influencers !== 'NIL'
      ? `'${influencers.replace(/'/g, "''")}'` : 'NULL';

    // Generate INSERT statement with ON CONFLICT DO NOTHING
    const sql = `INSERT INTO groups (
  id, name, type, members, platforms, primary_platform,
  description, risk_level, category, sheet, location,
  contact_info, social_media, influencers, status, monitoring_enabled
) VALUES (
  '${id}',
  '${name}',
  '${type}',
  ${totalMembers},
  '${platformsJson}',
  '${platforms[0] || 'facebook'}',
  'Group with ${totalMembers.toLocaleString()} members',
  '${riskLevel}',
  '${sheet}',
  '${sheet}',
  ${location},
  ${contactInfo},
  ${socialMediaJson === 'NULL' ? 'NULL' : `'${socialMediaJson.replace(/'/g, "''")}'`},
  ${influencersValue},
  'active',
  ${riskLevel === 'high' ? 'TRUE' : 'FALSE'}
) ON CONFLICT (id) DO NOTHING;`;

    sqlStatements.push(sql);
  }

  // Add placeholder comments for other sheets
  // These would be populated when actual data is available
  SHEET_NAMES.slice(1).forEach(sheetName => {
    sqlStatements.push(`\n-- Placeholder for ${sheetName} sheet data`);
    sqlStatements.push(`-- Data for this sheet will be imported when available`);
  });

  // Save the SQL file
  const outputPath = path.join(__dirname, '../database/safe-import-all-sheets.sql');
  const sqlContent = sqlStatements.join('\n');

  fs.writeFileSync(outputPath, sqlContent);

  console.log(`\n=== Safe Import SQL Generated ===`);
  console.log(`Output saved to: ${outputPath}`);
  console.log(`\nThis script will:`);
  console.log(`- INSERT new groups into the database`);
  console.log(`- Use ON CONFLICT DO NOTHING to avoid duplicates`);
  console.log(`- NOT delete or alter any existing data`);
  console.log(`\nTo run this script:`);
  console.log(`psql -U your_user -d your_database < ${outputPath}`);

  return outputPath;
}

// Generate the safe import SQL
generateSafeImportSQL();