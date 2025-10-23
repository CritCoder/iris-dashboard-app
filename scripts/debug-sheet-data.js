const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Read the Excel file
const filePath = path.join(__dirname, '../public/gp.xlsx');

console.log('DEBUGGING SHEET DATA - Finding why data is missing\n');
console.log('='.repeat(100));

try {
  const workbook = XLSX.readFile(filePath);

  const problematicSheets = [
    'RRP',
    'Christians Activist',
    'Kannadda ',
    'Woman',
    'Political'
  ];

  // Check each sheet more carefully
  workbook.SheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName];

    // Get sheet range
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    const totalRows = range.e.r - range.s.r; // Total rows minus header

    // Try different parsing methods
    const jsonDefault = XLSX.utils.sheet_to_json(worksheet);
    const jsonWithBlanks = XLSX.utils.sheet_to_json(worksheet, {defval: ""});
    const jsonRaw = XLSX.utils.sheet_to_json(worksheet, {header: 1});

    console.log(`\n${sheetName}:`);
    console.log('-'.repeat(50));
    console.log(`  Total rows in sheet: ${totalRows}`);
    console.log(`  Rows with default parsing: ${jsonDefault.length}`);
    console.log(`  Rows with blank defaults: ${jsonWithBlanks.length}`);
    console.log(`  Raw rows (including empty): ${jsonRaw.length}`);

    // Check if it's a problematic sheet
    if (problematicSheets.includes(sheetName)) {
      console.log('\n  ⚠️  PROBLEMATIC SHEET - Checking first 10 rows:');

      // Look at raw data
      for (let i = 0; i < Math.min(10, jsonRaw.length); i++) {
        const row = jsonRaw[i];
        if (row && row.length > 0) {
          // Count non-empty cells
          const nonEmptyCells = row.filter(cell => cell !== undefined && cell !== null && cell !== '').length;
          console.log(`    Row ${i}: ${nonEmptyCells} non-empty cells`);

          // Show first few values
          if (i > 0) { // Skip header
            const values = row.slice(0, 5).map(v => v ? String(v).substring(0, 20) : '[empty]');
            console.log(`      Values: ${values.join(' | ')}`);
          }
        }
      }

      // Check specific columns
      if (jsonWithBlanks.length > 0) {
        console.log('\n  Column check (first row with data):');
        const firstRow = jsonWithBlanks[0];
        Object.keys(firstRow).forEach(key => {
          const value = firstRow[key];
          if (value && value !== '') {
            console.log(`    ${key}: "${String(value).substring(0, 30)}${String(value).length > 30 ? '...' : ''}"`);
          }
        });
      }
    }

    // Count rows with actual data (at least name or org field)
    let rowsWithData = 0;
    jsonWithBlanks.forEach(row => {
      // Check various possible name fields
      const hasName = row['Organisation Type'] ||
                     row['Facebook Page Name'] ||
                     row['POLITICAL AND RELEGIOUS  ORGANIZATIONS KARNATAKA'] ||
                     row['ORG'] ||
                     row['Name'] ||
                     row['Group Name'];

      if (hasName && hasName.toString().trim() !== '') {
        rowsWithData++;
      }
    });

    console.log(`  Rows with actual group data: ${rowsWithData}`);

    // If there's a big discrepancy, investigate
    if (rowsWithData < jsonDefault.length / 2) {
      console.log('  ⚠️  Many rows might be missing group names!');
    }
  });

  console.log('\n' + '='.repeat(100));
  console.log('DETAILED INVESTIGATION OF MISSING DATA');
  console.log('='.repeat(100));

  // Deep dive into specific sheets
  ['Kannadda ', 'RRP', 'Political', 'Woman', 'Christians Activist'].forEach(sheetName => {
    if (!workbook.SheetNames.includes(sheetName)) return;

    console.log(`\n${sheetName} - Deep Analysis:`);
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {defval: "", raw: false});

    let validGroups = 0;
    let emptyOrgType = 0;
    let hasDataButNoOrgType = 0;

    jsonData.forEach((row, idx) => {
      const orgType = row['Organisation Type'];
      const hasFacebook = row['Facebook Profile URL'] && row['Facebook Profile URL'].toString().trim() !== '';
      const hasAnyData = Object.values(row).some(v => v && v.toString().trim() !== '');

      if (orgType && orgType.toString().trim() !== '') {
        validGroups++;
      } else if (hasAnyData) {
        emptyOrgType++;
        if (hasFacebook || row['Twitter'] || row['Instagram']) {
          hasDataButNoOrgType++;

          // Show sample of what we're missing
          if (hasDataButNoOrgType <= 3) {
            console.log(`  Row ${idx + 2} has data but no Organisation Type:`);
            Object.entries(row).forEach(([key, value]) => {
              if (value && value.toString().trim() !== '') {
                console.log(`    ${key}: "${String(value).substring(0, 40)}..."`);
              }
            });
          }
        }
      }
    });

    console.log(`  Valid groups (with Organisation Type): ${validGroups}`);
    console.log(`  Rows with data but no Organisation Type: ${hasDataButNoOrgType}`);
    console.log(`  Empty Organisation Type fields: ${emptyOrgType}`);
  });

} catch (error) {
  console.error('Error:', error);
}