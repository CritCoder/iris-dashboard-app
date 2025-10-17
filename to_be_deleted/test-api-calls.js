const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// All pages to test
const pages = [
  '/',
  '/login',
  '/login/verify-otp',
  '/signup',
  '/signup/verify-otp',
  '/forgot-password',
  '/forgot-password/verify-otp',
  '/forgot-password/reset',
  '/social-inbox',
  '/social-feed',
  '/entities',
  '/entity-search',
  '/osint-tools',
  '/profiles',
  '/profiles/test-user-id',
  '/locations',
  '/start-analysis',
  '/analysis-history',
  '/analysis-history/test-analysis-id',
  '/analysis-history/test-analysis-id/post/test-post-id'
];

// Base URL
const BASE_URL = 'http://localhost:3001';

// Store all captured requests
const allRequests = {
  internal: [],
  external: []
};

// Helper function to categorize requests
function categorizeRequest(url) {
  try {
    if (typeof url === 'string' && (url.includes('localhost:3001') || url.includes('127.0.0.1:3001'))) {
      return 'internal';
    }
    return 'external';
  } catch (error) {
    console.warn(`Error categorizing URL: ${url}`);
    return 'external';
  }
}

// Helper function to extract API endpoint info
function extractApiInfo(request) {
  try {
    const url = new URL(request.url);
    return {
      method: request.method,
      url: request.url,
      endpoint: url.pathname,
      query: url.search,
      headers: request.headers,
      postData: request.postData,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.warn(`Invalid URL: ${request.url}`);
    return {
      method: request.method,
      url: request.url,
      endpoint: '/invalid-url',
      query: '',
      headers: request.headers,
      postData: request.postData,
      timestamp: new Date().toISOString()
    };
  }
}

// Helper function to extract response info
function extractResponseInfo(response) {
  return {
    status: response.status(),
    statusText: response.statusText(),
    headers: response.headers(),
    url: response.url(),
    timestamp: new Date().toISOString()
  };
}

async function testPage(browser, pagePath) {
  console.log(`Testing page: ${pagePath}`);
  
  const page = await browser.newPage();
  const pageRequests = [];
  const pageResponses = [];
  
  // Enable request interception
  await page.setRequestInterception(true);
  
  // Capture requests
  page.on('request', (request) => {
    try {
      const requestInfo = extractApiInfo(request);
      pageRequests.push(requestInfo);
      
      // Categorize and store
      const category = categorizeRequest(request.url);
      allRequests[category].push({
        ...requestInfo,
        page: pagePath,
        type: 'request'
      });
      
      request.continue();
    } catch (error) {
      console.warn(`Error processing request: ${error.message}`);
      request.continue();
    }
  });
  
  // Capture responses
  page.on('response', async (response) => {
    try {
      const responseInfo = extractResponseInfo(response);
      pageResponses.push(responseInfo);
      
      // Try to get response body for API calls
      let responseBody = null;
      try {
        if (response.url().includes('/api/') || response.url().includes('irisnet.wiredleap.com')) {
          responseBody = await response.text();
        }
      } catch (error) {
        console.warn(`Could not get response body for ${response.url()}:`, error.message);
      }
      
      // Categorize and store
      const category = categorizeRequest(response.url());
      allRequests[category].push({
        ...responseInfo,
        page: pagePath,
        type: 'response',
        body: responseBody
      });
    } catch (error) {
      console.warn(`Error processing response: ${error.message}`);
    }
  });
  
  try {
    // Navigate to the page
    await page.goto(`${BASE_URL}${pagePath}`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Wait a bit more for any delayed API calls
    await page.waitForTimeout(3000);
    
    // Try to interact with the page to trigger more API calls
    try {
      // Look for buttons, links, or other interactive elements
      const buttons = await page.$$('button');
      const links = await page.$$('a');
      
      // Click a few buttons if they exist (but not too many to avoid infinite loops)
      for (let i = 0; i < Math.min(buttons.length, 3); i++) {
        try {
          const button = buttons[i];
          const text = await button.evaluate(el => el.textContent);
          // Skip dangerous buttons
          if (text && !text.toLowerCase().includes('delete') && !text.toLowerCase().includes('remove')) {
            await button.click();
            await page.waitForTimeout(1000);
          }
        } catch (error) {
          // Ignore click errors
        }
      }
      
      // Try to fill forms if they exist
      const inputs = await page.$$('input');
      for (let i = 0; i < Math.min(inputs.length, 2); i++) {
        try {
          const input = inputs[i];
          const type = await input.evaluate(el => el.type);
          if (type === 'text' || type === 'email') {
            await input.type('test@example.com');
            await page.waitForTimeout(500);
          }
        } catch (error) {
          // Ignore input errors
        }
      }
    } catch (error) {
      console.warn(`Error interacting with page ${pagePath}:`, error.message);
    }
    
    console.log(`✓ Page ${pagePath} tested successfully`);
    console.log(`  - Requests captured: ${pageRequests.length}`);
    console.log(`  - Responses captured: ${pageResponses.length}`);
    
  } catch (error) {
    console.error(`✗ Error testing page ${pagePath}:`, error.message);
  } finally {
    await page.close();
  }
}

async function createPostmanCollection(requests, filename) {
  const collection = {
    info: {
      name: filename.replace('.json', ''),
      description: `API Collection for ${filename.replace('.json', '')}`,
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    item: []
  };
  
  // Group requests by endpoint
  const groupedRequests = {};
  requests.forEach(req => {
    if (req.type === 'request') {
      const key = `${req.method} ${req.endpoint}`;
      if (!groupedRequests[key]) {
        groupedRequests[key] = {
          name: `${req.method} ${req.endpoint}`,
          request: {
            method: req.method,
            header: Object.entries(req.headers).map(([key, value]) => ({
              key,
              value,
              type: 'text'
            })),
            url: (() => {
              try {
                const url = new URL(req.url);
                return {
                  raw: req.url,
                  protocol: url.protocol.replace(':', ''),
                  host: url.host.split('.'),
                  path: url.pathname.split('/').filter(p => p),
                  query: Object.entries(url.searchParams).map(([key, value]) => ({
                    key,
                    value
                  }))
                };
              } catch (error) {
                return {
                  raw: req.url,
                  protocol: 'http',
                  host: ['localhost'],
                  path: ['invalid-url'],
                  query: []
                };
              }
            })()
          },
          response: []
        };
      }
      
      // Add response if available
      const response = requests.find(r => 
        r.type === 'response' && 
        r.url === req.url && 
        r.timestamp > req.timestamp
      );
      
      if (response) {
        collection.item.push({
          name: `${req.method} ${req.endpoint}`,
          request: {
            method: req.method,
            header: Object.entries(req.headers).map(([key, value]) => ({
              key,
              value,
              type: 'text'
            })),
            url: (() => {
              try {
                const url = new URL(req.url);
                return {
                  raw: req.url,
                  protocol: url.protocol.replace(':', ''),
                  host: url.host.split('.'),
                  path: url.pathname.split('/').filter(p => p),
                  query: Object.entries(url.searchParams).map(([key, value]) => ({
                    key,
                    value
                  }))
                };
              } catch (error) {
                return {
                  raw: req.url,
                  protocol: 'http',
                  host: ['localhost'],
                  path: ['invalid-url'],
                  query: []
                };
              }
            })()
          },
          response: [{
            name: `Response - ${response.status}`,
            originalRequest: {
              method: req.method,
              header: Object.entries(req.headers).map(([key, value]) => ({
                key,
                value,
                type: 'text'
              })),
              url: {
                raw: req.url,
                protocol: new URL(req.url).protocol.replace(':', ''),
                host: new URL(req.url).host.split('.'),
                path: new URL(req.url).pathname.split('/').filter(p => p)
              }
            },
            status: response.statusText,
            code: response.status,
            _postman_previewlanguage: 'json',
            header: Object.entries(response.headers).map(([key, value]) => ({
              key,
              value
            })),
            body: response.body || 'No response body'
          }]
        });
      }
    }
  });
  
  // Write to file
  fs.writeFileSync(filename, JSON.stringify(collection, null, 2));
  console.log(`✓ Created Postman collection: ${filename}`);
}

async function main() {
  console.log('🚀 Starting comprehensive API testing with Puppeteer...');
  
  const browser = await puppeteer.launch({
    headless: false, // Set to true for headless mode
    defaultViewport: { width: 1280, height: 720 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    // Test all pages
    for (const pagePath of pages) {
      await testPage(browser, pagePath);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay between pages
    }
    
    console.log('\n📊 Testing Summary:');
    console.log(`Total Internal Requests: ${allRequests.internal.length}`);
    console.log(`Total External Requests: ${allRequests.external.length}`);
    
    // Create Postman collections
    await createPostmanCollection(allRequests.internal, 'internal-api-collection.json');
    await createPostmanCollection(allRequests.external, 'external-api-collection.json');
    
    // Save raw data for analysis
    fs.writeFileSync('all-requests-raw.json', JSON.stringify(allRequests, null, 2));
    console.log('✓ Saved raw request data to all-requests-raw.json');
    
    // Create summary report
    const summary = {
      timestamp: new Date().toISOString(),
      totalPages: pages.length,
      totalRequests: allRequests.internal.length + allRequests.external.length,
      internalRequests: allRequests.internal.length,
      externalRequests: allRequests.external.length,
      pages: pages.map(page => ({
        path: page,
        internalRequests: allRequests.internal.filter(req => req.page === page).length,
        externalRequests: allRequests.external.filter(req => req.page === page).length
      }))
    };
    
    fs.writeFileSync('api-test-summary.json', JSON.stringify(summary, null, 2));
    console.log('✓ Created summary report: api-test-summary.json');
    
  } catch (error) {
    console.error('❌ Error during testing:', error);
  } finally {
    await browser.close();
  }
  
  console.log('\n✅ Testing completed!');
  console.log('📁 Generated files:');
  console.log('  - internal-api-collection.json (Postman collection for internal APIs)');
  console.log('  - external-api-collection.json (Postman collection for external APIs)');
  console.log('  - all-requests-raw.json (Raw request/response data)');
  console.log('  - api-test-summary.json (Summary report)');
}

// Run the test
main().catch(console.error);
