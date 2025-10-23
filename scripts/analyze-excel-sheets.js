const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Read the Excel file
const filePath = path.join(__dirname, '../public/gp.xlsx');
console.log('Reading Excel file:', filePath);

try {
  const workbook = XLSX.readFile(filePath);
  const sheetNames = workbook.SheetNames;

  console.log(`\nFound ${sheetNames.length} sheets in the Excel file:`);
  console.log('='.repeat(80));

  let totalEntries = 0;
  const sheetSummaries = [];

  sheetNames.forEach((sheetName, index) => {
    const worksheet = workbook.Sheets[sheetName];

    // Convert sheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    const rowCount = jsonData.length;

    // Get headers
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    const headers = [];
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      const cell = worksheet[cellAddress];
      headers.push(cell ? cell.v : `Column${col + 1}`);
    }

    console.log(`${index + 1}. "${sheetName}" - ${rowCount} entries`);

    // Show first few column names
    if (headers.length > 0) {
      console.log(`   Columns: ${headers.slice(0, 5).join(', ')}${headers.length > 5 ? '...' : ''}`);
    }

    // Sample first entry if exists
    if (jsonData.length > 0) {
      const firstEntry = jsonData[0];
      const sampleFields = Object.entries(firstEntry).slice(0, 3);
      console.log(`   Sample: ${sampleFields.map(([k, v]) => `${k}: "${String(v).substring(0, 30)}${String(v).length > 30 ? '...' : ''}"`).join(', ')}`);
    }

    sheetSummaries.push({
      name: sheetName,
      rowCount: rowCount,
      columns: headers
    });

    totalEntries += rowCount;
    console.log('');
  });

  console.log('='.repeat(80));
  console.log(`Total sheets: ${sheetNames.length}`);
  console.log(`Total entries across all sheets: ${totalEntries}`);

  // Save summary to JSON file for reference
  const summaryPath = path.join(__dirname, 'excel-sheets-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(sheetSummaries, null, 2));
  console.log(`\nSummary saved to: ${summaryPath}`);

} catch (error) {
  console.error('Error reading Excel file:', error);
}