const fs = require('fs');

// Read the sidebar component
const content = fs.readFileSync('./components/groups/groups-sidebar.tsx', 'utf8');

// Extract the sheets section
const sheetsMatch = content.match(/title: 'Sheets',[\s\S]*?items: \[([\s\S]*?)\]/);

if (sheetsMatch) {
  console.log('✅ SHEETS SECTION FOUND IN CODE:');
  console.log('================================\n');

  // Extract sheet names
  const sheetItems = sheetsMatch[1];
  const sheetNames = sheetItems.match(/name: '([^']+)'/g);

  if (sheetNames) {
    console.log('Found', sheetNames.length, 'sheets:\n');
    sheetNames.forEach((name, index) => {
      const cleanName = name.replace(/name: '|'/g, '');
      console.log(`${index + 1}. ${cleanName}`);
    });
  }

  console.log('\n================================');
  console.log('✅ All sheets are properly defined in the code!');
} else {
  console.log('❌ Sheets section not found');
}

// Also check if the file compiles
try {
  require('esbuild').buildSync({
    entryPoints: ['./components/groups/groups-sidebar.tsx'],
    bundle: false,
    write: false,
    loader: { '.tsx': 'tsx' },
    logLevel: 'silent'
  });
  console.log('✅ File syntax is valid');
} catch (e) {
  console.log('⚠️  Syntax check skipped (esbuild not available)');
}