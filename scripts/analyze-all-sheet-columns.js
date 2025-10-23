const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Read the Excel file
const filePath = path.join(__dirname, '../public/gp.xlsx');
console.log('Analyzing column structures across all sheets...\n');
console.log('='.repeat(100));

try {
  const workbook = XLSX.readFile(filePath);
  const sheetNames = workbook.SheetNames;

  const allSheetData = {};

  sheetNames.forEach((sheetName, index) => {
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Get headers (first row)
    const headers = jsonData[0] || [];

    // Get sample data (2nd and 3rd rows if they exist)
    const sampleRows = [];
    if (jsonData[1]) sampleRows.push(jsonData[1]);
    if (jsonData[2]) sampleRows.push(jsonData[2]);

    console.log(`\n${index + 1}. Sheet: "${sheetName}"`);
    console.log('-'.repeat(80));
    console.log(`Total Rows: ${jsonData.length - 1} (excluding header)`);
    console.log(`\nColumns (${headers.length}):`);

    headers.forEach((col, idx) => {
      const colName = col || `[Empty Column ${idx}]`;
      console.log(`  ${idx + 1}. ${colName}`);
    });

    // Show sample data
    if (sampleRows.length > 0) {
      console.log(`\nSample Data (First row):`);
      sampleRows[0].forEach((value, idx) => {
        if (headers[idx] && value) {
          const displayValue = String(value).substring(0, 50);
          console.log(`  ${headers[idx]}: "${displayValue}${String(value).length > 50 ? '...' : ''}"`);
        }
      });
    }

    // Store for analysis
    allSheetData[sheetName] = {
      headers,
      sampleRows,
      rowCount: jsonData.length - 1
    };
  });

  console.log('\n' + '='.repeat(100));
  console.log('COLUMN COMPARISON ANALYSIS');
  console.log('='.repeat(100));

  // Group sheets by similar column structure
  const columnGroups = {};

  Object.entries(allSheetData).forEach(([sheetName, data]) => {
    const key = data.headers.join('|');
    if (!columnGroups[key]) {
      columnGroups[key] = [];
    }
    columnGroups[key].push(sheetName);
  });

  console.log('\nSheets grouped by column structure:');
  let groupNum = 1;

  Object.entries(columnGroups).forEach(([columns, sheets]) => {
    console.log(`\nGroup ${groupNum}: ${sheets.length} sheet(s)`);
    console.log('Sheets: ' + sheets.join(', '));

    const headers = columns.split('|');
    console.log('Common columns:');
    headers.slice(0, 5).forEach((h, i) => {
      console.log(`  - ${h}`);
    });
    if (headers.length > 5) {
      console.log(`  ... and ${headers.length - 5} more columns`);
    }
    groupNum++;
  });

  // Identify unique columns across all sheets
  console.log('\n' + '='.repeat(100));
  console.log('UNIQUE COLUMN ANALYSIS');
  console.log('='.repeat(100));

  const allColumns = new Set();
  const columnUsage = {};

  Object.entries(allSheetData).forEach(([sheetName, data]) => {
    data.headers.forEach(header => {
      if (header) {
        allColumns.add(header);
        if (!columnUsage[header]) {
          columnUsage[header] = [];
        }
        columnUsage[header].push(sheetName);
      }
    });
  });

  console.log(`\nTotal unique columns across all sheets: ${allColumns.size}`);

  // Common columns (present in multiple sheets)
  console.log('\nMost common columns:');
  const sortedColumns = Object.entries(columnUsage)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 15);

  sortedColumns.forEach(([col, sheets]) => {
    console.log(`  "${col}" - used in ${sheets.length} sheet(s)`);
  });

  // Save detailed analysis
  const analysis = {
    sheets: allSheetData,
    columnGroups: Object.entries(columnGroups).map(([cols, sheets]) => ({
      columns: cols.split('|'),
      sheets
    })),
    uniqueColumns: Array.from(allColumns),
    columnUsage
  };

  const outputPath = path.join(__dirname, 'sheet-columns-analysis.json');
  fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2));
  console.log(`\nDetailed analysis saved to: ${outputPath}`);

} catch (error) {
  console.error('Error analyzing sheets:', error);
}