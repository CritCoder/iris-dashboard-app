const fs = require('fs');
const path = require('path');

// Read the raw data captured by Puppeteer
const rawData = JSON.parse(fs.readFileSync('all-requests-raw.json', 'utf8'));

const BASE_API_URL = 'https://irisnet.wiredleap.com/api';
const LOCAL_BASE_URL = 'http://localhost:3001';

// Helper function to determine if a URL is an API call and its type (internal/external)
function isApiCall(url) {
  if (!url || typeof url !== 'string') return { isApi: false, type: null };
  
  // Check for internal API calls (localhost with /api path)
  const isInternalApi = url.includes(`${LOCAL_BASE_URL}/api`) || 
                       url.includes('localhost:3001/api') ||
                       url.includes('localhost:3000/api') ||
                       url.includes('127.0.0.1:3001/api') ||
                       url.includes('127.0.0.1:3000/api');
  
  // Check for external API calls
  const isExternalApi = url.includes(BASE_API_URL);

  if (isInternalApi) return { isApi: true, type: 'internal' };
  if (isExternalApi) return { isApi: true, type: 'external' };
  
  return { isApi: false, type: null };
}

// Helper function to extract all API endpoints (both requests and responses)
function extractAllApiEndpoints(rawData) {
  const endpoints = new Map();
  const requests = new Map(); // Store requests separately to match with responses

  // First pass: collect all requests
  [...rawData.internal, ...rawData.external].forEach(item => {
    if (item.type === 'request' && item.url) {
      const { isApi, type } = isApiCall(item.url);
      if (isApi) {
        try {
          const urlObj = new URL(item.url);
          const endpointKey = `${item.method || 'GET'} ${urlObj.pathname}`;
          requests.set(endpointKey, {
            method: item.method || 'GET',
            url: item.url,
            endpoint: urlObj.pathname,
            query: urlObj.search,
            headers: item.headers,
            postData: item.postData,
            page: item.page,
            type: type
          });
        } catch (error) {
          console.warn(`Error processing request URL: ${item.url}, Error: ${error.message}`);
        }
      }
    }
  });

  // Second pass: collect all responses and match with requests
  [...rawData.internal, ...rawData.external].forEach(item => {
    if (item.type === 'response' && item.url) {
      const { isApi, type } = isApiCall(item.url);
      if (isApi) {
        try {
          const urlObj = new URL(item.url);
          const endpointKey = `${item.method || 'GET'} ${urlObj.pathname}`;
          
          // Get the corresponding request
          const request = requests.get(endpointKey);
          
          if (request) {
            // Store the complete endpoint with both request and response
            endpoints.set(endpointKey, {
              method: request.method,
              url: request.url,
              endpoint: request.endpoint,
              query: request.query,
              status: item.status,
              responseBody: item.body,
              responseHeaders: item.headers,
              requestHeaders: request.headers,
              postData: request.postData,
              pages: new Set([request.page]),
              type: type
            });
          } else {
            // Response without matching request (shouldn't happen but handle gracefully)
            endpoints.set(endpointKey, {
              method: item.method || 'GET',
              url: item.url,
              endpoint: urlObj.pathname,
              query: urlObj.search,
              status: item.status,
              responseBody: item.body,
              responseHeaders: item.headers,
              requestHeaders: {},
              postData: null,
              pages: new Set([item.page]),
              type: type
            });
          }
        } catch (error) {
          console.warn(`Error processing response URL: ${item.url}, Error: ${error.message}`);
        }
      }
    }
  });

  // Third pass: add page information for all endpoints
  [...rawData.internal, ...rawData.external].forEach(item => {
    if (item.url && item.page) {
      const { isApi, type } = isApiCall(item.url);
      if (isApi) {
        try {
          const urlObj = new URL(item.url);
          const endpointKey = `${item.method || 'GET'} ${urlObj.pathname}`;
          if (endpoints.has(endpointKey)) {
            endpoints.get(endpointKey).pages.add(item.page);
          }
        } catch (error) {
          // Ignore invalid URLs already warned about
        }
      }
    }
  });

  return Array.from(endpoints.values());
}

// Function to create a Postman collection from extracted API endpoints
function createPostmanCollection(name, description, endpoints) {
  const collection = {
    info: {
      name: name,
      description: description,
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    item: []
  };

  endpoints.forEach(ep => {
    const requestItem = {
      name: `${ep.method} ${ep.endpoint}`,
      request: {
        method: ep.method,
        header: Object.entries(ep.requestHeaders || {}).map(([key, value]) => ({ key, value })),
        url: (() => {
          try {
            const url = new URL(ep.url);
            return {
              raw: ep.url,
              protocol: url.protocol.replace(':', ''),
              host: url.host.split('.'),
              path: url.pathname.split('/').filter(p => p),
              query: Array.from(url.searchParams.entries()).map(([key, value]) => ({
                key,
                value
              }))
            };
          } catch (error) {
            return {
              raw: ep.url,
              protocol: 'http',
              host: ['invalid-url'],
              path: [],
              query: []
            };
          }
        })(),
        body: ep.postData ? {
          mode: 'raw',
          raw: ep.postData,
          options: {
            raw: {
              language: 'json'
            }
          }
        } : undefined
      },
      response: [{
        name: `${ep.method} ${ep.endpoint} Response`,
        originalRequest: {
          method: ep.method,
          header: Object.entries(ep.requestHeaders || {}).map(([key, value]) => ({ key, value })),
          url: (() => {
            try {
              const url = new URL(ep.url);
              return {
                raw: ep.url,
                protocol: url.protocol.replace(':', ''),
                host: url.host.split('.'),
                path: url.pathname.split('/').filter(p => p),
                query: Array.from(url.searchParams.entries()).map(([key, value]) => ({
                  key,
                  value
                }))
              };
            } catch (error) {
              return {
                raw: ep.url,
                protocol: 'http',
                host: ['invalid-url'],
                path: [],
                query: []
              };
            }
          })(),
        },
        status: ep.status,
        code: ep.status,
        _postman_previewlanguage: 'json',
        header: Object.entries(ep.responseHeaders || {}).map(([key, value]) => ({ key, value })),
        cookie: [],
        body: ep.responseBody
      }]
    };
    collection.item.push(requestItem);
  });

  return collection;
}

async function main() {
  console.log('🔍 Processing API calls with comprehensive extraction...');
  console.log('📋 Architecture: Frontend-only Next.js app consuming external APIs\n');

  const apiEndpoints = extractAllApiEndpoints(rawData);

  const internalEndpoints = apiEndpoints.filter(ep => ep.type === 'internal');
  const externalEndpoints = apiEndpoints.filter(ep => ep.type === 'external');

  console.log(`📊 Results:`);
  console.log(`   Internal APIs: ${internalEndpoints.length} (Expected: 0 - This is a frontend-only app)`);
  console.log(`   External APIs: ${externalEndpoints.length} (All backend API calls)`);

  // Create collections
  const internalCollection = createPostmanCollection(
    "Internal API Collection",
    "Collection of internal API calls captured from Puppeteer\n\nNote: This app is frontend-only and doesn't have internal API routes. All API calls go to external backend server.",
    internalEndpoints
  );

  const externalCollection = createPostmanCollection(
    "External API Collection", 
    "Collection of external API calls captured from Puppeteer\n\nThese are all the backend API calls made by the frontend application to https://irisnet.wiredleap.com/api",
    externalEndpoints
  );

  // Write to project directory
  fs.writeFileSync('internal-api-collection.json', JSON.stringify(internalCollection, null, 2));
  fs.writeFileSync('external-api-collection.json', JSON.stringify(externalCollection, null, 2));
  fs.writeFileSync('api-endpoints-report.json', JSON.stringify(apiEndpoints.map(ep => ({
    method: ep.method,
    endpoint: ep.endpoint,
    status: ep.status,
    type: ep.type,
    usedOnPages: Array.from(ep.pages),
    responseBodySample: ep.responseBody ? ep.responseBody.substring(0, 200) + '...' : 'N/A'
  })), null, 2));

  // Copy to desktop
  const desktopPath = path.join(require('os').homedir(), 'Desktop');
  fs.writeFileSync(path.join(desktopPath, 'internal-api-collection.json'), JSON.stringify(internalCollection, null, 2));
  fs.writeFileSync(path.join(desktopPath, 'external-api-collection.json'), JSON.stringify(externalCollection, null, 2));

  console.log('\n✅ Processing completed!');
  console.log('📁 Generated files:');
  console.log('  - internal-api-collection.json (Postman collection for internal APIs)');
  console.log('  - external-api-collection.json (Postman collection for external APIs)');
  console.log('  - api-endpoints-report.json (Detailed API endpoints report)');
  console.log('  - Files copied to Desktop');

  console.log('\n📋 External API Endpoints Summary:');
  externalEndpoints.forEach(ep => console.log(`  ${ep.method} ${ep.endpoint} (Status: ${ep.status}, used on: ${Array.from(ep.pages).join(', ')})`));
  
  if (internalEndpoints.length === 0) {
    console.log('\n💡 Note: No internal API endpoints found because this is a frontend-only Next.js application.');
    console.log('   All API calls are made to the external backend server.');
  }
}

main();
