const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Read the Excel file
const filePath = path.join(__dirname, '../public/gp.xlsx');

console.log('EXTRACTING ALL DATA - Including rows without Organisation Type\n');
console.log('='.repeat(100));

try {
  const workbook = XLSX.readFile(filePath);
  const allExtractedData = {};

  workbook.SheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {defval: ""});

    console.log(`\n${sheetName}:`);
    console.log('-'.repeat(50));

    const groups = [];
    let noNameButHasData = 0;
    let totalWithData = 0;

    jsonData.forEach((row, index) => {
      // Check if row has any meaningful data
      const hasName = row['Organisation Type'] && row['Organisation Type'].toString().trim() !== '';
      const fbValue = row['Facebook Profile URL'] ? row['Facebook Profile URL'].toString() : '';
      const hasFacebook = fbValue.trim() !== '' && !fbValue.includes('Facebook Profile URL'); // Skip header repeated

      const twitterValue = row['Twitter'] ? row['Twitter'].toString() : '';
      const hasTwitter = twitterValue.trim() !== '' &&
                        twitterValue !== 'Twitter' && twitterValue.toLowerCase() !== 'nil';

      const instagramValue = row['Instagram'] ? row['Instagram'].toString() : '';
      const hasInstagram = instagramValue.trim() !== '' &&
                          instagramValue !== 'Instagram' && instagramValue.toLowerCase() !== 'nil';

      const hasMembers = row['Total Members'] && parseInt(row['Total Members']) > 0;

      // For Mixed sheet
      const hasFBPageName = row['Facebook Page Name'] && row['Facebook Page Name'].toString().trim() !== '';

      // For Mixed 2 sheet
      const hasOrgName = row['POLITICAL AND RELEGIOUS  ORGANIZATIONS KARNATAKA'] &&
                        row['POLITICAL AND RELEGIOUS  ORGANIZATIONS KARNATAKA'].toString().trim() !== '';

      // Determine if this row has any useful data
      const hasUsefulData = hasName || hasFacebook || hasTwitter || hasInstagram ||
                           hasMembers || hasFBPageName || hasOrgName;

      if (hasUsefulData) {
        totalWithData++;

        // Build a name from available data
        let groupName = '';
        if (hasName) {
          groupName = row['Organisation Type'];
        } else if (hasFBPageName) {
          groupName = row['Facebook Page Name'];
        } else if (hasOrgName) {
          groupName = row['POLITICAL AND RELEGIOUS  ORGANIZATIONS KARNATAKA'];
        } else if (hasFacebook) {
          // Try to extract name from Facebook URL
          const fbUrl = row['Facebook Profile URL'];
          const match = fbUrl.match(/facebook\.com\/([^\/\?]+)/);
          if (match) {
            groupName = `FB: ${match[1].replace(/[.\-_]/g, ' ')}`;
          } else {
            groupName = `Unknown Group ${sheetName}_${index + 1}`;
          }
          noNameButHasData++;
        } else {
          groupName = `Unknown Group ${sheetName}_${index + 1}`;
          noNameButHasData++;
        }

        groups.push({
          rowIndex: index + 2, // Excel row number (1-indexed + header)
          name: groupName,
          members: row['Total Members'] || 0,
          facebook: row['Facebook Profile URL'] || row['Facebook Page Link'] || '',
          twitter: row['Twitter'] || row['Twitter Link'] || row['IN TWITTER'] || '',
          instagram: row['Instagram'] || '',
          youtube: row['Youtube'] || row['Youtube ID'] || '',
          influencers: row['Top Influencer IDS'] || '',
          address: row['Physical Address'] || row['Location'] || row['Address'] || '',
          phone: row['Linked Phone Number'] || row['Mobile Nomber'] || '',
          email: row['Linked E-Mail ID'] || row['Email ID'] || '',
          hasOriginalName: hasName || hasFBPageName || hasOrgName
        });
      }
    });

    console.log(`  Total rows with useful data: ${totalWithData}`);
    console.log(`  Groups with names: ${groups.filter(g => g.hasOriginalName).length}`);
    console.log(`  Groups without names (but have other data): ${noNameButHasData}`);

    // Show sample of groups without names
    const withoutNames = groups.filter(g => !g.hasOriginalName);
    if (withoutNames.length > 0) {
      console.log(`\n  Sample groups without original names:`);
      withoutNames.slice(0, 3).forEach(g => {
        console.log(`    Row ${g.rowIndex}: ${g.name}`);
        if (g.facebook) console.log(`      Facebook: ${g.facebook.substring(0, 60)}...`);
        if (g.twitter) console.log(`      Twitter: ${g.twitter.substring(0, 60)}...`);
      });
    }

    allExtractedData[sheetName] = groups;
  });

  // Summary
  console.log('\n' + '='.repeat(100));
  console.log('EXTRACTION SUMMARY');
  console.log('='.repeat(100));

  let grandTotal = 0;
  let withNames = 0;
  let withoutNames = 0;

  Object.entries(allExtractedData).forEach(([sheet, groups]) => {
    const named = groups.filter(g => g.hasOriginalName).length;
    const unnamed = groups.filter(g => !g.hasOriginalName).length;

    console.log(`${sheet}:`);
    console.log(`  Total: ${groups.length} (Named: ${named}, Unnamed: ${unnamed})`);

    grandTotal += groups.length;
    withNames += named;
    withoutNames += unnamed;
  });

  console.log('\n' + '='.repeat(50));
  console.log(`GRAND TOTAL: ${grandTotal} groups`);
  console.log(`  With original names: ${withNames}`);
  console.log(`  Without names (extracted from URLs): ${withoutNames}`);

  // Save the extracted data
  const outputPath = path.join(__dirname, 'all-extracted-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(allExtractedData, null, 2));
  console.log(`\n✓ All extracted data saved to: ${outputPath}`);

} catch (error) {
  console.error('Error:', error);
}