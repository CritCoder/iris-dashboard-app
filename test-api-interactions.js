const puppeteer = require('puppeteer');
const fs = require('fs');

async function testApiInteractions() {
  console.log('🚀 Starting API interaction testing with Puppeteer...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1280, height: 720 }
  });
  
  const page = await browser.newPage();
  
  // Enable request/response interception
  const requests = [];
  const responses = [];
  
  page.on('request', request => {
    requests.push({
      url: request.url(),
      method: request.method(),
      headers: request.headers(),
      postData: request.postData(),
      timestamp: new Date().toISOString(),
      type: 'request'
    });
  });
  
  page.on('response', response => {
    responses.push({
      url: response.url(),
      method: response.request().method(),
      status: response.status(),
      statusText: response.statusText(),
      headers: response.headers(),
      timestamp: new Date().toISOString(),
      type: 'response'
    });
  });
  
  // Test specific pages that should trigger API calls
  const testPages = [
    { 
      url: 'http://localhost:3001/social-feed', 
      name: 'Social Feed',
      actions: [
        { type: 'wait', duration: 5000 },
        { type: 'click', selector: 'button' },
        { type: 'wait', duration: 3000 }
      ]
    },
    { 
      url: 'http://localhost:3001/entities', 
      name: 'Entities',
      actions: [
        { type: 'wait', duration: 5000 },
        { type: 'type', selector: 'input[type="text"]', text: 'test' },
        { type: 'wait', duration: 3000 }
      ]
    },
    { 
      url: 'http://localhost:3001/entity-search', 
      name: 'Entity Search',
      actions: [
        { type: 'wait', duration: 5000 },
        { type: 'type', selector: 'input', text: '1234567890' },
        { type: 'click', selector: 'button' },
        { type: 'wait', duration: 5000 }
      ]
    }
  ];
  
  const results = {
    pages: [],
    totalRequests: 0,
    totalResponses: 0,
    apiCalls: {
      internal: [],
      external: []
    }
  };
  
  for (const pageInfo of testPages) {
    console.log(`\n📄 Testing: ${pageInfo.name} (${pageInfo.url})`);
    
    try {
      // Navigate to the page
      await page.goto(pageInfo.url, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      // Wait for initial load
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Perform actions to trigger API calls
      for (const action of pageInfo.actions) {
        try {
          if (action.type === 'wait') {
            await new Promise(resolve => setTimeout(resolve, action.duration));
          } else if (action.type === 'click') {
            await page.click(action.selector);
          } else if (action.type === 'type') {
            await page.type(action.selector, action.text);
          }
        } catch (actionError) {
          console.log(`    ⚠️  Action failed: ${actionError.message}`);
        }
      }
      
      // Wait a bit more for any delayed API calls
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const pageResult = {
        name: pageInfo.name,
        url: pageInfo.url,
        status: 'success',
        requests: requests.length,
        responses: responses.length
      };
      
      results.pages.push(pageResult);
      console.log(`  ✅ Page tested successfully`);
      
    } catch (error) {
      console.log(`  ❌ Error testing page: ${error.message}`);
      results.pages.push({
        name: pageInfo.name,
        url: pageInfo.url,
        status: 'error',
        error: error.message,
        requests: requests.length,
        responses: responses.length
      });
    }
  }
  
  // Categorize API calls
  const allRequests = [...requests, ...responses];
  results.totalRequests = requests.length;
  results.totalResponses = responses.length;
  
  allRequests.forEach(item => {
    const url = item.url;
    if (url.includes('localhost:3001/api')) {
      results.apiCalls.internal.push({
        ...item,
        page: 'localhost'
      });
    } else if (url.includes('irisnet.wiredleap.com/api')) {
      results.apiCalls.external.push({
        ...item,
        page: 'external'
      });
    }
  });
  
  // Save results
  fs.writeFileSync('api-interaction-results.json', JSON.stringify(results, null, 2));
  fs.writeFileSync('api-calls-captured.json', JSON.stringify({
    internal: results.apiCalls.internal,
    external: results.apiCalls.external
  }, null, 2));
  
  console.log('\n📊 API Interaction Test Results:');
  console.log(`  Total pages tested: ${results.pages.length}`);
  console.log(`  Successful pages: ${results.pages.filter(p => p.status === 'success').length}`);
  console.log(`  Failed pages: ${results.pages.filter(p => p.status === 'error').length}`);
  console.log(`  Total requests captured: ${results.totalRequests}`);
  console.log(`  Total responses captured: ${results.totalResponses}`);
  console.log(`  Internal API calls: ${results.apiCalls.internal.length}`);
  console.log(`  External API calls: ${results.apiCalls.external.length}`);
  
  console.log('\n📁 Files generated:');
  console.log('  - api-interaction-results.json (Detailed test results)');
  console.log('  - api-calls-captured.json (API calls data)');
  
  if (results.apiCalls.external.length > 0) {
    console.log('\n🔍 External API calls found:');
    results.apiCalls.external.forEach(call => {
      console.log(`  ${call.method} ${call.url} (Status: ${call.status})`);
    });
  }
  
  await browser.close();
  console.log('\n✅ API interaction testing completed!');
}

testApiInteractions().catch(console.error);
