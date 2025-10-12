const fs = require('fs');

// Read the API file
let content = fs.readFileSync('lib/api.ts', 'utf8');

// List of endpoints that need /api prefix (excluding those that already have it)
const endpointsToFix = [
  '/campaigns',
  '/social',
  '/osint',
  '/political-dashboard',
  '/persons',
  '/users',
  '/credits',
  '/tools',
  '/accounts',
  '/incidents'
];

// Fix each endpoint
endpointsToFix.forEach(endpoint => {
  // Replace apiClient.method('/endpoint' with apiClient.method('/api/endpoint'
  const patterns = [
    new RegExp(`apiClient\\.(get|post|put|patch|delete)\\('${endpoint}`, 'g'),
    new RegExp(`apiClient\\.(get|post|put|patch|delete)\\('${endpoint}/`, 'g')
  ];
  
  patterns.forEach(pattern => {
    content = content.replace(pattern, (match, method) => {
      return match.replace(`'${endpoint}`, `'/api${endpoint}`);
    });
  });
});

// Write the updated content back
fs.writeFileSync('lib/api.ts', content);

console.log('✅ Fixed API paths - added /api prefix to all endpoints');
