const { chromium } = require('playwright');

async function testAllPages() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Track all network requests and responses
  const networkLog = [];
  const failedRequests = [];
  const pageResults = {};

  page.on('request', request => {
    networkLog.push({
      type: 'request',
      url: request.url(),
      method: request.method(),
      headers: request.headers(),
      timestamp: Date.now()
    });
  });

  page.on('response', response => {
    const request = response.request();
    const logEntry = {
      type: 'response',
      url: response.url(),
      status: response.status(),
      method: request.method(),
      timestamp: Date.now()
    };

    if (response.status() >= 400) {
      failedRequests.push({
        url: response.url(),
        status: response.status(),
        method: request.method(),
        page: page.url()
      });
    }

    networkLog.push(logEntry);
  });

  // List of all pages to test
  const pagesToTest = [
    '/',
    '/login',
    '/login/verify-otp',
    '/social-feed',
    '/social-feed?filter=all',
    '/social-feed?filter=high-impact',
    '/social-feed?filter=latest-posts',
    '/social-feed?filter=viral-posts',
    '/social-inbox',
    '/analysis-history',
    '/start-analysis',
    '/entities',
    '/locations',
    '/profiles',
    '/profiles/1',
    '/osint-tools'
  ];

  console.log('🚀 Starting comprehensive page testing...\n');

  for (const pagePath of pagesToTest) {
    console.log(`📄 Testing page: ${pagePath}`);
    
    try {
      // Navigate to the page
      await page.goto(`http://localhost:3000${pagePath}`, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });

      // Wait a bit for any dynamic content to load
      await page.waitForTimeout(2000);

      // Check for console errors
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push({
            message: msg.text(),
            page: pagePath
          });
        }
      });

      // Check for React errors
      const reactErrors = await page.evaluate(() => {
        const errors = [];
        // Check if there are any React error boundaries triggered
        const errorElements = document.querySelectorAll('[data-react-error-boundary]');
        errorElements.forEach(el => {
          errors.push({
            message: el.textContent,
            element: el.outerHTML
          });
        });
        return errors;
      });

      // Check if page loaded successfully
      const pageTitle = await page.title();
      const hasContent = await page.evaluate(() => {
        return document.body.textContent.length > 100;
      });

      pageResults[pagePath] = {
        success: true,
        title: pageTitle,
        hasContent,
        consoleErrors,
        reactErrors,
        networkRequests: networkLog.filter(log => 
          log.type === 'request' && log.url.includes('localhost:3000')
        ).length
      };

      console.log(`✅ ${pagePath} - Loaded successfully`);
      if (consoleErrors.length > 0) {
        console.log(`   ⚠️  ${consoleErrors.length} console errors`);
      }
      if (reactErrors.length > 0) {
        console.log(`   ⚠️  ${reactErrors.length} React errors`);
      }

    } catch (error) {
      console.log(`❌ ${pagePath} - Failed to load: ${error.message}`);
      pageResults[pagePath] = {
        success: false,
        error: error.message
      };
    }

    // Clear network log for next page
    networkLog.length = 0;
  }

  console.log('\n📊 Test Results Summary:');
  console.log('========================');

  // Summary of successful vs failed pages
  const successfulPages = Object.values(pageResults).filter(result => result.success);
  const failedPages = Object.values(pageResults).filter(result => !result.success);

  console.log(`✅ Successful pages: ${successfulPages.length}`);
  console.log(`❌ Failed pages: ${failedPages.length}`);

  if (failedPages.length > 0) {
    console.log('\n❌ Failed Pages:');
    failedPages.forEach((result, index) => {
      console.log(`   ${index + 1}. ${result.error}`);
    });
  }

  // Network request analysis
  console.log('\n🌐 Network Request Analysis:');
  console.log('============================');

  if (failedRequests.length > 0) {
    console.log(`❌ Failed API requests: ${failedRequests.length}`);
    failedRequests.forEach((req, index) => {
      console.log(`   ${index + 1}. ${req.method} ${req.url} - Status: ${req.status}`);
      console.log(`      Page: ${req.page}`);
    });
  } else {
    console.log('✅ No failed API requests detected');
  }

  // API endpoint analysis
  const apiRequests = networkLog.filter(log => 
    log.type === 'request' && 
    (log.url.includes('/api/') || log.url.includes('irisnet.wiredleap.com'))
  );

  console.log(`\n📡 Total API requests made: ${apiRequests.length}`);
  
  // Group by endpoint
  const endpointCounts = {};
  apiRequests.forEach(req => {
    const endpoint = req.url.split('?')[0]; // Remove query params
    endpointCounts[endpoint] = (endpointCounts[endpoint] || 0) + 1;
  });

  console.log('\n📋 API Endpoints Called:');
  Object.entries(endpointCounts).forEach(([endpoint, count]) => {
    console.log(`   ${endpoint} (${count} times)`);
  });

  // Detailed page results
  console.log('\n📄 Detailed Page Results:');
  console.log('=========================');
  
  Object.entries(pageResults).forEach(([pagePath, result]) => {
    console.log(`\n${pagePath}:`);
    if (result.success) {
      console.log(`   Title: ${result.title}`);
      console.log(`   Has Content: ${result.hasContent ? 'Yes' : 'No'}`);
      console.log(`   Network Requests: ${result.networkRequests}`);
      if (result.consoleErrors.length > 0) {
        console.log(`   Console Errors: ${result.consoleErrors.length}`);
        result.consoleErrors.forEach(error => {
          console.log(`     - ${error.message}`);
        });
      }
      if (result.reactErrors.length > 0) {
        console.log(`   React Errors: ${result.reactErrors.length}`);
        result.reactErrors.forEach(error => {
          console.log(`     - ${error.message}`);
        });
      }
    } else {
      console.log(`   Error: ${result.error}`);
    }
  });

  await browser.close();

  // Return results for further processing
  return {
    pageResults,
    failedRequests,
    networkLog,
    summary: {
      totalPages: pagesToTest.length,
      successful: successfulPages.length,
      failed: failedPages.length,
      failedApiRequests: failedRequests.length
    }
  };
}

// Run the test
testAllPages().then(results => {
  console.log('\n🎉 Testing completed!');
  console.log(`📊 Summary: ${results.summary.successful}/${results.summary.totalPages} pages successful`);
  
  if (results.summary.failedApiRequests > 0) {
    console.log(`⚠️  ${results.summary.failedApiRequests} failed API requests need attention`);
  }
}).catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});