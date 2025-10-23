const fs = require('fs');
const path = require('path');

// Define sheet categories based on group characteristics
function determineSheet(name) {
  const nameUpper = name.toUpperCase();

  // Hindu Organizations
  if (nameUpper.includes('ಹಿಂದೂ') || nameUpper.includes('HINDU') ||
      nameUpper.includes('ಬಜರಂಗ') || nameUpper.includes('BAJRANG') ||
      nameUpper.includes('ವಿಶ್ವ ಹಿಂದೂ ಪರಿಷತ್') || nameUpper.includes('VHP') ||
      nameUpper.includes('RSS') || nameUpper.includes('ರಾಷ್ಟ್ರೀಯ ಸ್ವಯಂಸೇವಕ') ||
      nameUpper.includes('ಹಿಂದುತ್ವ')) {
    return 'Hindu Organizations';
  }

  // Political Groups
  if (nameUpper.includes('ಬಿಜೆಪಿ') || nameUpper.includes('BJP') ||
      nameUpper.includes('ಮೋದಿ') || nameUpper.includes('MODI') ||
      nameUpper.includes('NAMO') || nameUpper.includes('ನಮೋ')) {
    return 'Political Groups';
  }

  // Youth Organizations
  if (nameUpper.includes('ಯುವ') || nameUpper.includes('YOUTH') ||
      nameUpper.includes('YUVA') || nameUpper.includes('ಯೂತ್')) {
    return 'Youth Organizations';
  }

  // Maratha/Shivaji Groups
  if (nameUpper.includes('ಶಿವಾಜಿ') || nameUpper.includes('SHIVAJI') ||
      nameUpper.includes('MARATHA') || nameUpper.includes('ಮರಾಠ') ||
      nameUpper.includes('ಛತ್ರಪತಿ') || nameUpper.includes('CHATRAPATI')) {
    return 'Maratha Organizations';
  }

  // Media/News Groups
  if (nameUpper.includes('POSTCARD') || nameUpper.includes('ಸಂವಾದ') ||
      nameUpper.includes('SAMVADA') || nameUpper.includes('NEWS')) {
    return 'Media Groups';
  }

  // Nationalist Groups
  if (nameUpper.includes('ರಾಷ್ಟ್ರ') || nameUpper.includes('RASHTRA') ||
      nameUpper.includes('NATIONALIST') || nameUpper.includes('ರಾಷ್ಟ್ರೀಯ') ||
      nameUpper.includes('ಭಾರತ') || nameUpper.includes('BHARAT')) {
    return 'Nationalist Groups';
  }

  // Religious Groups (Sanatan)
  if (nameUpper.includes('ಸನಾತನ') || nameUpper.includes('SANATAN') ||
      nameUpper.includes('DHARMA') || nameUpper.includes('ಧರ್ಮ')) {
    return 'Religious Groups';
  }

  // Fan Clubs
  if (nameUpper.includes('ಅಭಿಮಾನಿ') || nameUpper.includes('FANS') ||
      nameUpper.includes('FAN CLUB') || nameUpper.includes('ಫ್ಯಾನ್ಸ್')) {
    return 'Fan Clubs';
  }

  // Militant/Armed Groups
  if (nameUpper.includes('ಸೇನೆ') || nameUpper.includes('SENA') ||
      nameUpper.includes('ದಳ') || nameUpper.includes('DAL') ||
      nameUpper.includes('BRIGADE') || nameUpper.includes('FORCE')) {
    return 'Militant Groups';
  }

  // Default to Other Groups
  return 'Other Groups';
}

// Read and process the CSV file
function processGroups() {
  const csvPath = path.join(__dirname, '../public/groups.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  // Parse CSV manually
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim());

  const sheetCategories = {};
  const processedGroups = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    // Simple CSV parsing
    const values = line.split(',');

    const slNo = values[0]?.trim();
    const orgName = values[1]?.trim();

    if (!orgName || orgName === 'Organisation Type') continue;

    const sheet = determineSheet(orgName);

    // Count groups by sheet
    if (!sheetCategories[sheet]) {
      sheetCategories[sheet] = 0;
    }
    sheetCategories[sheet]++;

    // Add to processed groups
    processedGroups.push({
      id: `group_${slNo || i}`,
      name: orgName,
      sheet: sheet
    });
  }

  // Output summary
  console.log('\n=== Groups Categorization Summary ===\n');
  const sortedSheets = Object.entries(sheetCategories)
    .sort((a, b) => b[1] - a[1]);

  sortedSheets.forEach(([sheet, count]) => {
    console.log(`${sheet}: ${count} groups`);
  });

  // Create output file with sheet categories
  const outputPath = path.join(__dirname, '../public/groups-sheets-config.json');
  fs.writeFileSync(outputPath, JSON.stringify({
    sheets: sortedSheets.map(([sheet]) => sheet),
    sheetCounts: sheetCategories,
    totalGroups: processedGroups.length
  }, null, 2));

  console.log(`\nTotal groups processed: ${processedGroups.length}`);
  console.log(`Output saved to: ${outputPath}`);

  return { sheetCategories, processedGroups };
}

// Run the categorization
const result = processGroups();