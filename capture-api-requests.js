const { chromium } = require('playwright');

async function captureAPIRequests() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Array to store all captured requests
  const apiRequests = [];

  // Listen to all network requests
  page.on('request', request => {
    const url = request.url();
    const method = request.method();
    
    // Only capture API requests (not static assets)
    if (url.includes('/api/') || url.includes('/explore/') || url.includes('/social/') || 
        url.includes('/profiles') || url.includes('/entities') || url.includes('/locations') ||
        url.includes('/campaigns') || url.includes('/posts') || url.includes('/stats')) {
      
      const requestData = {
        url: url,
        method: method,
        headers: request.headers(),
        postData: request.postData(),
        timestamp: new Date().toISOString()
      };
      
      apiRequests.push(requestData);
      console.log(`📡 Captured: ${method} ${url}`);
    }
  });

  // Listen to all network responses
  page.on('response', async response => {
    const url = response.url();
    const status = response.status();
    
    if (url.includes('/api/') || url.includes('/explore/') || url.includes('/social/') || 
        url.includes('/profiles') || url.includes('/entities') || url.includes('/locations') ||
        url.includes('/campaigns') || url.includes('/posts') || url.includes('/stats')) {
      
      try {
        const responseData = await response.json();
        console.log(`📥 Response: ${status} ${url}`);
        
        // Find the corresponding request and add response data
        const requestIndex = apiRequests.findIndex(req => req.url === url);
        if (requestIndex !== -1) {
          apiRequests[requestIndex].response = {
            status: status,
            headers: response.headers(),
            data: responseData
          };
        }
      } catch (e) {
        // Response might not be JSON
        console.log(`📥 Response (non-JSON): ${status} ${url}`);
      }
    }
  });

  try {
    console.log('🚀 Starting to capture API requests from http://localhost:7777');
    
    // Navigate to the old frontend
    await page.goto('http://localhost:7777', { waitUntil: 'networkidle' });
    console.log('✅ Loaded homepage');
    
    // Wait a bit for any initial API calls
    await page.waitForTimeout(3000);
    
    // Navigate through different pages to capture their API calls
    const pages = [
      '/profiles',
      '/entities', 
      '/locations',
      '/social-inbox',
      '/analysis-history',
      '/social-feed'
    ];
    
    for (const pagePath of pages) {
      try {
        console.log(`🔄 Navigating to ${pagePath}`);
        await page.goto(`http://localhost:7777${pagePath}`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000); // Wait for API calls to complete
        console.log(`✅ Captured requests for ${pagePath}`);
      } catch (e) {
        console.log(`❌ Failed to navigate to ${pagePath}: ${e.message}`);
      }
    }
    
    // Save all captured requests to a file
    const fs = require('fs');
    const outputFile = 'captured-api-requests.json';
    fs.writeFileSync(outputFile, JSON.stringify(apiRequests, null, 2));
    
    console.log(`\n🎉 Captured ${apiRequests.length} API requests!`);
    console.log(`📄 Saved to: ${outputFile}`);
    
    // Print summary
    console.log('\n📊 Summary of captured requests:');
    const uniqueEndpoints = [...new Set(apiRequests.map(req => req.url))];
    uniqueEndpoints.forEach(endpoint => {
      const method = apiRequests.find(req => req.url === endpoint)?.method;
      console.log(`  ${method} ${endpoint}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

captureAPIRequests().catch(console.error);
