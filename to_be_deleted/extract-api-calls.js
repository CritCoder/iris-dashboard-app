const fs = require('fs');

// Read the raw data
const rawData = JSON.parse(fs.readFileSync('all-requests-raw.json', 'utf8'));

// Filter for actual API calls
function isApiCall(url) {
  if (!url || typeof url !== 'string') return false;
  return url.includes('/api/') || 
         url.includes('irisnet.wiredleap.com') ||
         url.includes('localhost:3001/api') ||
         url.includes('127.0.0.1:3001/api');
}

// Extract unique API endpoints
function extractApiEndpoints(requests) {
  const endpoints = new Map();
  
  requests.forEach(req => {
    if (req.type === 'request' && isApiCall(req.url)) {
      const key = `${req.method} ${req.endpoint}`;
      if (!endpoints.has(key)) {
        endpoints.set(key, {
          method: req.method,
          url: req.url,
          endpoint: req.endpoint,
          headers: req.headers,
          postData: req.postData,
          pages: new Set()
        });
      }
      endpoints.get(key).pages.add(req.page);
    }
  });
  
  return Array.from(endpoints.values()).map(endpoint => ({
    ...endpoint,
    pages: Array.from(endpoint.pages)
  }));
}

// Create Postman collection
function createPostmanCollection(endpoints, name, description) {
  const collection = {
    info: {
      name: name,
      description: description,
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    item: []
  };
  
  endpoints.forEach(endpoint => {
    try {
      const url = new URL(endpoint.url);
      const item = {
        name: `${endpoint.method} ${endpoint.endpoint}`,
        request: {
          method: endpoint.method,
          header: Object.entries(endpoint.headers || {}).map(([key, value]) => ({
            key,
            value,
            type: 'text'
          })),
          url: {
            raw: endpoint.url,
            protocol: url.protocol.replace(':', ''),
            host: url.host.split('.'),
            path: url.pathname.split('/').filter(p => p),
            query: Object.entries(url.searchParams).map(([key, value]) => ({
              key,
              value
            }))
          }
        },
        response: []
      };
      
      // Add post data if present
      if (endpoint.postData) {
        item.request.body = {
          mode: 'raw',
          raw: endpoint.postData
        };
      }
      
      collection.item.push(item);
    } catch (error) {
      console.warn(`Skipping invalid URL: ${endpoint.url}`);
    }
  });
  
  return collection;
}

// Process the data
console.log('Processing API calls...');

const internalEndpoints = extractApiEndpoints(rawData.internal);
const externalEndpoints = extractApiEndpoints(rawData.external);

console.log(`Found ${internalEndpoints.length} internal API endpoints`);
console.log(`Found ${externalEndpoints.length} external API endpoints`);

// Create Postman collections
const internalCollection = createPostmanCollection(
  internalEndpoints, 
  'IRIS Dashboard - Internal APIs',
  'Internal API endpoints for the IRIS Dashboard application'
);

const externalCollection = createPostmanCollection(
  externalEndpoints, 
  'IRIS Dashboard - External APIs',
  'External API endpoints called by the IRIS Dashboard application'
);

// Write collections
fs.writeFileSync('internal-api-collection.json', JSON.stringify(internalCollection, null, 2));
fs.writeFileSync('external-api-collection.json', JSON.stringify(externalCollection, null, 2));

// Create detailed report
const report = {
  timestamp: new Date().toISOString(),
  summary: {
    totalInternalEndpoints: internalEndpoints.length,
    totalExternalEndpoints: externalEndpoints.length,
    totalPages: 20
  },
  internalEndpoints: internalEndpoints.map(ep => ({
    method: ep.method,
    endpoint: ep.endpoint,
    url: ep.url,
    pages: ep.pages
  })),
  externalEndpoints: externalEndpoints.map(ep => ({
    method: ep.method,
    endpoint: ep.endpoint,
    url: ep.url,
    pages: ep.pages
  }))
};

fs.writeFileSync('api-endpoints-report.json', JSON.stringify(report, null, 2));

console.log('✅ Processing completed!');
console.log('📁 Generated files:');
console.log('  - internal-api-collection.json (Postman collection for internal APIs)');
console.log('  - external-api-collection.json (Postman collection for external APIs)');
console.log('  - api-endpoints-report.json (Detailed API endpoints report)');

// Print summary
console.log('\n📊 API Endpoints Summary:');
console.log(`Internal APIs: ${internalEndpoints.length}`);
internalEndpoints.forEach(ep => {
  console.log(`  ${ep.method} ${ep.endpoint} (used on: ${ep.pages.join(', ')})`);
});

console.log(`\nExternal APIs: ${externalEndpoints.length}`);
externalEndpoints.forEach(ep => {
  console.log(`  ${ep.method} ${ep.endpoint} (used on: ${ep.pages.join(', ')})`);
});
