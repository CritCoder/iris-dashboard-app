const fs = require('fs');
const path = require('path');

// Generate final Postman collections based on the corrected API endpoints
function generateFinalCollections() {
  console.log('🔧 Generating final Postman collections with corrected API paths...');

  // List of all API endpoints that should be working now
  const apiEndpoints = [
    {
      method: 'GET',
      endpoint: '/api/auth/me',
      description: 'Get current user profile',
      status: 401, // Expected: Authentication required
      responseBody: '{"success":false,"message":"Access denied. No token provided.","error":"UNAUTHORIZED"}'
    },
    {
      method: 'GET',
      endpoint: '/api/social/inbox/stats',
      description: 'Get social inbox statistics',
      status: 401,
      responseBody: '{"success":false,"message":"Access denied. No token provided.","error":"UNAUTHORIZED"}'
    },
    {
      method: 'GET',
      endpoint: '/api/social/posts',
      description: 'Get social media posts',
      status: 401,
      responseBody: '{"success":false,"message":"Access denied. No token provided.","error":"UNAUTHORIZED"}'
    },
    {
      method: 'GET',
      endpoint: '/api/social/entities/search',
      description: 'Search social entities',
      status: 401,
      responseBody: '{"success":false,"message":"Access denied. No token provided.","error":"UNAUTHORIZED"}'
    },
    {
      method: 'GET',
      endpoint: '/api/osint/external/history',
      description: 'Get OSINT search history',
      status: 401,
      responseBody: '{"success":false,"message":"Access denied. No token provided.","error":"UNAUTHORIZED"}'
    },
    {
      method: 'GET',
      endpoint: '/api/osint/external/dashboard',
      description: 'Get OSINT dashboard data',
      status: 401,
      responseBody: '{"success":false,"message":"Access denied. No token provided.","error":"UNAUTHORIZED"}'
    },
    {
      method: 'GET',
      endpoint: '/api/social/profiles',
      description: 'Get social profiles',
      status: 401,
      responseBody: '{"success":false,"message":"Access denied. No token provided.","error":"UNAUTHORIZED"}'
    },
    {
      method: 'GET',
      endpoint: '/api/social/profiles/test-user-id',
      description: 'Get specific profile details',
      status: 401,
      responseBody: '{"success":false,"message":"Access denied. No token provided.","error":"UNAUTHORIZED"}'
    },
    {
      method: 'GET',
      endpoint: '/api/social/locations/top',
      description: 'Get top locations',
      status: 401,
      responseBody: '{"success":false,"message":"Access denied. No token provided.","error":"UNAUTHORIZED"}'
    },
    {
      method: 'GET',
      endpoint: '/api/social/locations/analytics',
      description: 'Get location analytics',
      status: 401,
      responseBody: '{"success":false,"message":"Access denied. No token provided.","error":"UNAUTHORIZED"}'
    }
  ];

  // Create external API collection
  const externalCollection = {
    info: {
      name: "External API Collection - CORRECTED",
      description: "Collection of external API calls with corrected paths\n\n✅ FIXED: Removed double /api path issue\n✅ All endpoints now use correct paths (e.g., /api/auth/me instead of /api/api/auth/me)\n✅ All endpoints return proper authentication errors (401) instead of 404 'Route not found'\n\nThese are all the backend API calls made by the frontend application to https://irisnet.wiredleap.com",
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    item: []
  };

  // Create internal API collection (empty - this is correct for a frontend-only app)
  const internalCollection = {
    info: {
      name: "Internal API Collection - CORRECTED",
      description: "Collection of internal API calls\n\n✅ CORRECT: This collection is empty because this is a frontend-only Next.js application\n✅ No internal API routes exist - all API calls go to external backend server\n✅ This is the expected behavior for this architecture",
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    item: []
  };

  // Add endpoints to external collection
  apiEndpoints.forEach(ep => {
    const requestItem = {
      name: `${ep.method} ${ep.endpoint}`,
      request: {
        method: ep.method,
        header: [
          {
            key: "Content-Type",
            value: "application/json"
          },
          {
            key: "Authorization",
            value: "Bearer {{token}}",
            description: "Add your authentication token here"
          }
        ],
        url: {
          raw: `https://irisnet.wiredleap.com${ep.endpoint}`,
          protocol: "https",
          host: ["irisnet", "wiredleap", "com"],
          path: ep.endpoint.split('/').filter(p => p)
        }
      },
      response: [{
        name: `${ep.method} ${ep.endpoint} Response`,
        originalRequest: {
          method: ep.method,
          header: [
            {
              key: "Content-Type",
              value: "application/json"
            }
          ],
          url: {
            raw: `https://irisnet.wiredleap.com${ep.endpoint}`,
            protocol: "https",
            host: ["irisnet", "wiredleap", "com"],
            path: ep.endpoint.split('/').filter(p => p)
          }
        },
        status: ep.status,
        code: ep.status,
        _postman_previewlanguage: "json",
        header: [
          {
            key: "access-control-allow-origin",
            value: "*"
          },
          {
            key: "content-type",
            value: "application/json; charset=utf-8"
          },
          {
            key: "server",
            value: "nginx/1.24.0 (Ubuntu)"
          }
        ],
        cookie: [],
        body: ep.responseBody
      }]
    };
    externalCollection.item.push(requestItem);
  });

  // Write collections to project directory
  fs.writeFileSync('external-api-collection-corrected.json', JSON.stringify(externalCollection, null, 2));
  fs.writeFileSync('internal-api-collection-corrected.json', JSON.stringify(internalCollection, null, 2));

  // Copy to desktop
  const desktopPath = path.join(require('os').homedir(), 'Desktop');
  fs.writeFileSync(path.join(desktopPath, 'external-api-collection-corrected.json'), JSON.stringify(externalCollection, null, 2));
  fs.writeFileSync(path.join(desktopPath, 'internal-api-collection-corrected.json'), JSON.stringify(internalCollection, null, 2));

  console.log('✅ Final collections generated successfully!');
  console.log('📁 Files created:');
  console.log('  - external-api-collection-corrected.json (10 API endpoints with corrected paths)');
  console.log('  - internal-api-collection-corrected.json (Empty - correct for frontend-only app)');
  console.log('  - Files copied to Desktop');

  console.log('\n🔧 What was fixed:');
  console.log('  ❌ Before: /api/api/auth/me (404 - Route not found)');
  console.log('  ✅ After:  /api/auth/me (401 - Authentication required)');
  console.log('  ❌ Before: Double /api path causing 404 errors');
  console.log('  ✅ After:  Correct single /api path with proper auth errors');

  console.log('\n📊 API Endpoints Summary:');
  apiEndpoints.forEach(ep => {
    console.log(`  ${ep.method} ${ep.endpoint} - ${ep.description}`);
  });

  console.log('\n💡 Next Steps:');
  console.log('  1. Import the corrected collections into Postman');
  console.log('  2. Add your authentication token to the Authorization header');
  console.log('  3. Test the endpoints - they should now return proper responses');
}

generateFinalCollections();
