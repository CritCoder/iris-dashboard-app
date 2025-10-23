const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '../public/gp.xlsx');
const workbook = XLSX.readFile(filePath);

// Check these problematic sheets
const sheetsToCheck = ['RRP', 'Christians Activist', 'Kannadda ', 'Woman', 'Political'];

console.log('FINDING WHERE THE ACTUAL DATA IS IN EACH SHEET');
console.log('='.repeat(80));

sheetsToCheck.forEach(sheetName => {
  if (!workbook.SheetNames.includes(sheetName)) {
    console.log(`\n${sheetName}: NOT FOUND`);
    return;
  }

  console.log(`\n${sheetName}:`);
  console.log('-'.repeat(50));

  const worksheet = workbook.Sheets[sheetName];

  // Get raw data to see actual cell positions
  const range = XLSX.utils.decode_range(worksheet['!ref']);
  console.log(`Sheet range: A1 to ${XLSX.utils.encode_cell({r: range.e.r, c: range.e.c})}`);
  console.log(`Total rows: ${range.e.r + 1}, Total columns: ${range.e.c + 1}`);

  // Check first 10 rows for any data
  console.log('\nChecking first 10 rows for non-empty cells:');

  for (let row = 0; row <= Math.min(9, range.e.r); row++) {
    let nonEmptyCells = [];

    for (let col = 0; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = worksheet[cellAddress];

      if (cell && cell.v !== undefined && cell.v !== null && cell.v !== '') {
        const value = String(cell.v).substring(0, 30);
        nonEmptyCells.push({
          col: XLSX.utils.encode_col(col),
          value: value + (String(cell.v).length > 30 ? '...' : '')
        });
      }
    }

    if (nonEmptyCells.length > 0) {
      console.log(`  Row ${row + 1}: ${nonEmptyCells.length} non-empty cells`);
      nonEmptyCells.forEach(({col, value}) => {
        console.log(`    Column ${col}: "${value}"`);
      });
    }
  }

  // Try to get data with header row = 1 (in case headers are not in first row)
  console.log('\nTrying different parsing options:');

  // Option 1: Standard parsing
  const json1 = XLSX.utils.sheet_to_json(worksheet);
  console.log(`  Standard parsing: ${json1.length} rows`);

  // Option 2: With blank defaults
  const json2 = XLSX.utils.sheet_to_json(worksheet, {defval: ""});
  console.log(`  With blank defaults: ${json2.length} rows`);

  // Option 3: Raw data (no headers)
  const json3 = XLSX.utils.sheet_to_json(worksheet, {header: 1});
  console.log(`  Raw data: ${json3.length} rows`);

  // Show what columns are detected
  if (json2.length > 0) {
    console.log('\nDetected columns:');
    Object.keys(json2[0]).forEach(col => {
      console.log(`  - "${col}"`);
    });
  }
});

console.log('\n' + '='.repeat(80));