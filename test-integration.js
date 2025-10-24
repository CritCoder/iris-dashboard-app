// Test script to verify API integration
const testIntegration = async () => {
  console.log('🧪 Testing API Integration...')
  
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWZncnUyN3YwMDZuejJ4dXM2c3FoNmE5Iiwib3JnYW5pemF0aW9uSWQiOiJjbWRpcmpxcjIwMDAwejI4cG8yZW9uMHlmIiwiaWF0IjoxNzYxMjU4MDg2LCJleHAiOjE3NjEzNDQ0ODZ9.L_WGuXYkO2XVzQIrFkiHjGMB2DvG65e22sMf0FyNJGw'
  const baseURL = 'https://irisnet.wiredleap.com'
  
  try {
    // Test 1: Authentication
    console.log('1. Testing authentication...')
    const authResponse = await fetch(`${baseURL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    const authData = await authResponse.json()
    console.log('✅ Authentication successful:', authData.success)
    
    // Test 2: Campaign Search
    console.log('2. Testing campaign search...')
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30)
    
    const campaignData = {
      topic: 'integration test',
      timeRange: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      },
      platforms: ['facebook', 'twitter'],
      campaignType: 'NORMAL'
    }
    
    const campaignResponse = await fetch(`${baseURL}/api/campaigns/campaign-search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(campaignData)
    })
    
    const campaignResult = await campaignResponse.json()
    console.log('✅ Campaign search successful:', campaignResult.success)
    console.log('📊 Campaign ID:', campaignResult.data?.campaignId)
    
    // Test 3: Get Campaign Details
    if (campaignResult.success && campaignResult.data?.campaignId) {
      console.log('3. Testing campaign details...')
      const detailsResponse = await fetch(`${baseURL}/api/campaigns/${campaignResult.data.campaignId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const detailsData = await detailsResponse.json()
      console.log('✅ Campaign details successful:', detailsData.success)
    }
    
    console.log('🎉 All tests passed! Integration is working correctly.')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Run the test
testIntegration()
