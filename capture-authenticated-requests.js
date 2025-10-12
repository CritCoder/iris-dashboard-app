const { chromium } = require('playwright');

async function captureAuthenticatedRequests() {
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
    console.log('🚀 Starting to capture authenticated API requests from http://localhost:7777');
    
    // Navigate to the old frontend
    await page.goto('http://localhost:7777', { waitUntil: 'networkidle' });
    console.log('✅ Loaded homepage');
    
    // Wait a bit for any initial API calls
    await page.waitForTimeout(3000);
    
    // Try to find and click login button or navigate to login
    try {
      console.log('🔍 Looking for login functionality...');
      
      // Look for common login elements
      const loginSelectors = [
        'button:has-text("Login")',
        'a:has-text("Login")',
        'button:has-text("Sign In")',
        'a:has-text("Sign In")',
        '[data-testid="login"]',
        '.login-button',
        '#login'
      ];
      
      let loginFound = false;
      for (const selector of loginSelectors) {
        try {
          const element = await page.locator(selector).first();
          if (await element.isVisible()) {
            console.log(`🔑 Found login element: ${selector}`);
            await element.click();
            loginFound = true;
            break;
          }
        } catch (e) {
          // Continue to next selector
        }
      }
      
      if (loginFound) {
        console.log('⏳ Waiting for login page to load...');
        await page.waitForTimeout(2000);
        
        // Try to find email/username and password fields
        const emailSelectors = ['input[type="email"]', 'input[name="email"]', 'input[name="username"]', '#email', '#username'];
        const passwordSelectors = ['input[type="password"]', 'input[name="password"]', '#password'];
        
        for (const emailSelector of emailSelectors) {
          try {
            const emailField = await page.locator(emailSelector).first();
            if (await emailField.isVisible()) {
              console.log(`📧 Found email field: ${emailSelector}`);
              await emailField.fill('suumit@mydukaan.io'); // Use the email from the sidebar
              break;
            }
          } catch (e) {
            // Continue to next selector
          }
        }
        
        for (const passwordSelector of passwordSelectors) {
          try {
            const passwordField = await page.locator(passwordSelector).first();
            if (await passwordField.isVisible()) {
              console.log(`🔒 Found password field: ${passwordSelector}`);
              await passwordField.fill('password123'); // Try common password
              break;
            }
          } catch (e) {
            // Continue to next selector
          }
        }
        
        // Try to find and click submit button
        const submitSelectors = [
          'button[type="submit"]',
          'button:has-text("Login")',
          'button:has-text("Sign In")',
          'input[type="submit"]'
        ];
        
        for (const submitSelector of submitSelectors) {
          try {
            const submitButton = await page.locator(submitSelector).first();
            if (await submitButton.isVisible()) {
              console.log(`🚀 Found submit button: ${submitSelector}`);
              await submitButton.click();
              break;
            }
          } catch (e) {
            // Continue to next selector
          }
        }
        
        console.log('⏳ Waiting for authentication...');
        await page.waitForTimeout(5000);
      } else {
        console.log('⚠️ No login form found, proceeding without authentication...');
      }
    } catch (e) {
      console.log('⚠️ Login attempt failed, proceeding without authentication...');
    }
    
    // Now navigate through different pages to capture their API calls
    const pages = [
      '/',
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
        await page.waitForTimeout(3000); // Wait for API calls to complete
        
        // Try to interact with the page to trigger more API calls
        try {
          // Look for buttons, links, or other interactive elements
          const interactiveElements = await page.locator('button, a, [role="button"]').all();
          for (let i = 0; i < Math.min(3, interactiveElements.length); i++) {
            try {
              const element = interactiveElements[i];
              if (await element.isVisible()) {
                await element.click();
                await page.waitForTimeout(1000);
                await page.goBack(); // Go back to capture the difference
                await page.waitForTimeout(1000);
                break;
              }
            } catch (e) {
              // Continue to next element
            }
          }
        } catch (e) {
          // Ignore interaction errors
        }
        
        console.log(`✅ Captured requests for ${pagePath}`);
      } catch (e) {
        console.log(`❌ Failed to navigate to ${pagePath}: ${e.message}`);
      }
    }
    
    // Save all captured requests to a file
    const fs = require('fs');
    const outputFile = 'captured-authenticated-requests.json';
    fs.writeFileSync(outputFile, JSON.stringify(apiRequests, null, 2));
    
    console.log(`\n🎉 Captured ${apiRequests.length} API requests!`);
    console.log(`📄 Saved to: ${outputFile}`);
    
    // Print summary
    console.log('\n📊 Summary of captured requests:');
    const uniqueEndpoints = [...new Set(apiRequests.map(req => req.url))];
    uniqueEndpoints.forEach(endpoint => {
      const method = apiRequests.find(req => req.url === endpoint)?.method;
      const status = apiRequests.find(req => req.url === endpoint)?.response?.status;
      console.log(`  ${method} ${endpoint} (${status || 'no response'})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

captureAuthenticatedRequests().catch(console.error);
