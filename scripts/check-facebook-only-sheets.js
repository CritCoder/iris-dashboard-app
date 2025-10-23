const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '../public/gp.xlsx');
const workbook = XLSX.readFile(filePath);

// Sheets that seem to have only Facebook URLs
const problematicSheets = ['RRP', 'Christians Activist', 'Kannadda ', 'Woman', 'Political'];

console.log('CHECKING SHEETS WITH ONLY FACEBOOK URLs');
console.log('='.repeat(80));

problematicSheets.forEach(sheetName => {
  if (!workbook.SheetNames.includes(sheetName)) return;

  console.log(`\n${sheetName}:`);
  console.log('-'.repeat(50));

  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, {defval: "", raw: false});

  // Count different types of data
  let rowsWithFacebook = 0;
  let rowsWithOnlyFacebook = 0;
  let facebookUrls = [];

  jsonData.forEach((row, idx) => {
    const fbUrl = row['Facebook Profile URL'] || '';
    const hasValidFb = fbUrl && fbUrl.toString().trim() !== '' &&
                      fbUrl.toString().startsWith('http');

    if (hasValidFb) {
      rowsWithFacebook++;

      // Check if ONLY Facebook is filled
      const otherFieldsFilled = Object.entries(row).filter(([key, value]) => {
        return key !== 'Facebook Profile URL' &&
               key !== ' Facebook Profile URL ' &&
               value && value.toString().trim() !== '';
      }).length;

      if (otherFieldsFilled === 0) {
        rowsWithOnlyFacebook++;
        if (facebookUrls.length < 10) {
          facebookUrls.push({
            row: idx + 2,
            url: fbUrl
          });
        }
      }
    }
  });

  console.log(`Total rows with Facebook URLs: ${rowsWithFacebook}`);
  console.log(`Rows with ONLY Facebook URLs (no other data): ${rowsWithOnlyFacebook}`);

  if (facebookUrls.length > 0) {
    console.log('\nSample Facebook URLs (these could be groups!):');
    facebookUrls.forEach(({row, url}) => {
      // Try to extract a meaningful name from the URL
      let extractedName = 'Unknown';

      // Pattern 1: facebook.com/groupname
      let match = url.match(/facebook\.com\/([^\/\?]+)/);
      if (match && match[1] !== 'profile.php') {
        extractedName = match[1].replace(/[-_.]/g, ' ');
      }
      // Pattern 2: profile.php?id=
      else if (url.includes('profile.php?id=')) {
        match = url.match(/id=(\d+)/);
        if (match) {
          extractedName = `Profile ID ${match[1]}`;
        }
      }
      // Pattern 3: /groups/
      else if (url.includes('/groups/')) {
        match = url.match(/groups\/([^\/\?]+)/);
        if (match) {
          extractedName = `Group: ${match[1]}`;
        }
      }

      console.log(`  Row ${row}: ${extractedName}`);
      console.log(`    URL: ${url.substring(0, 70)}${url.length > 70 ? '...' : ''}`);
    });
  }
});

console.log('\n' + '='.repeat(80));
console.log('RECOMMENDATION:');
console.log('These sheets contain Facebook URLs that ARE the groups themselves.');
console.log('We should extract group names from these URLs and import them.');