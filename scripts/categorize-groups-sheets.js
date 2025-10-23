const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/sync');

// Define sheet categories based on group characteristics
function determineSheet(name, type) {
  const nameUpper = name.toUpperCase();
  const nameLower = name.toLowerCase();

  // Hindu Organizations
  if (nameUpper.includes('ಹಿಂದೂ') || nameUpper.includes('HINDU') ||
      nameUpper.includes('ಬಜರಂಗ') || nameUpper.includes('BAJRANG') ||
      nameUpper.includes('ವಿಶ್ವ ಹಿಂದೂ ಪರಿಷತ್') || nameUpper.includes('VHP') ||
      nameUpper.includes('RSS') || nameUpper.includes('ರಾಷ್ಟ್ರೀಯ ಸ್ವಯಂಸೇವಕ')) {
    return 'Hindu Organizations';
  }

  // Political Groups
  if (nameUpper.includes('ಬಿಜೆಪಿ') || nameUpper.includes('BJP') ||
      nameUpper.includes('ಮೋದಿ') || nameUpper.includes('MODI') ||
      nameUpper.includes('CONGRESS') || nameUpper.includes('ಕಾಂಗ್ರೆಸ್')) {
    return 'Political Groups';
  }

  // Youth Organizations
  if (nameUpper.includes('ಯುವ') || nameUpper.includes('YOUTH') ||
      nameUpper.includes('YUVA') || nameUpper.includes('ಯೂತ್')) {
    return 'Youth Organizations';
  }

  // Maratha/Shivaji Groups
  if (nameUpper.includes('ಶಿವಾಜಿ') || nameUpper.includes('SHIVAJI') ||
      nameUpper.includes('MARATHA') || nameUpper.includes('ಮರಾಠ')) {
    return 'Maratha Organizations';
  }

  // Media/News Groups
  if (nameUpper.includes('POSTCARD') || nameUpper.includes('ಸಂವಾದ') ||
      nameUpper.includes('SAMVADA') || nameUpper.includes('NEWS')) {
    return 'Media Groups';
  }

  // Nationalist Groups
  if (nameUpper.includes('ರಾಷ್ಟ್ರ') || nameUpper.includes('RASHTRA') ||
      nameUpper.includes('NATIONALIST') || nameUpper.includes('ರಾಷ್ಟ್ರೀಯ')) {
    return 'Nationalist Groups';
  }

  // Religious Groups (non-Hindu)
  if (nameUpper.includes('ಸನಾತನ') || nameUpper.includes('SANATAN') ||
      nameUpper.includes('DHARMA') || nameUpper.includes('ಧರ್ಮ')) {
    return 'Religious Groups';
  }

  // Fan Clubs
  if (nameUpper.includes('ಅಭಿಮಾನಿ') || nameUpper.includes('FANS') ||
      nameUpper.includes('FAN CLUB') || nameUpper.includes('ಫ್ಯಾನ್ಸ್')) {
    return 'Fan Clubs';
  }

  // Default to Other Groups
  return 'Other Groups';
}

// Read and process the CSV file
function processGroups() {
  const csvPath = path.join(__dirname, '../public/groups.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  // Parse CSV
  const records = csv.parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true
  });

  const sheetCategories = {};
  const processedGroups = [];

  records.forEach((record, index) => {
    const orgName = record['Organisation Type'] || '';
    if (!orgName || orgName === 'Organisation Type') return;

    const sheet = determineSheet(orgName);

    // Count groups by sheet
    if (!sheetCategories[sheet]) {
      sheetCategories[sheet] = 0;
    }
    sheetCategories[sheet]++;

    // Add sheet to the record
    processedGroups.push({
      ...record,
      sheet: sheet,
      id: `group_${index + 1}`
    });
  });

  // Output summary
  console.log('\n=== Groups Categorization Summary ===\n');
  Object.entries(sheetCategories)
    .sort((a, b) => b[1] - a[1])
    .forEach(([sheet, count]) => {
      console.log(`${sheet}: ${count} groups`);
    });

  // Create output file with sheet categories
  const outputPath = path.join(__dirname, '../public/groups-with-sheets.json');
  fs.writeFileSync(outputPath, JSON.stringify({
    sheets: Object.keys(sheetCategories).sort(),
    sheetCounts: sheetCategories,
    groups: processedGroups
  }, null, 2));

  console.log(`\nOutput saved to: ${outputPath}`);

  // Also create a SQL update script
  const sqlPath = path.join(__dirname, '../database/update-group-sheets.sql');
  let sqlContent = '-- Update groups with sheet categories\n\n';

  processedGroups.forEach(group => {
    const name = group['Organisation Type'].replace(/'/g, "''");
    const sheet = group.sheet.replace(/'/g, "''");
    sqlContent += `UPDATE groups SET sheet = '${sheet}' WHERE name = '${name}';\n`;
  });

  fs.writeFileSync(sqlPath, sqlContent);
  console.log(`SQL update script saved to: ${sqlPath}`);

  return sheetCategories;
}

// Run the categorization
processGroups();