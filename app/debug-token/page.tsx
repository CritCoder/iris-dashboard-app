'use client'

import { useState, useEffect } from 'react'

export default function DebugTokenPage() {
  const [token, setToken] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<any>(null)

  useEffect(() => {
    // Get token from localStorage
    const storedToken = localStorage.getItem('token')
    setToken(storedToken)
  }, [])

  const setTestToken = () => {
    const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWZncnUyN3YwMDZuejJ4dXM2c3FoNmE5Iiwib3JnYW5pemF0aW9uSWQiOiJjbWRpcmpxcjIwMDAwejI4cG8yZW9uMHlmIiwiaWF0IjoxNzYxMjU4MDg2LCJleHAiOjE3NjEzNDQ0ODZ9.L_WGuXYkO2XVzQIrFkiHjGMB2DvG65e22sMf0FyNJGw'
    localStorage.setItem('token', testToken)
    
    // Also set user and organization data for completeness
    const userData = {
      id: "cmfgru27v006nz2xus6sqh6a9",
      email: "suumit@mydukaan.io",
      isAdmin: true
    }
    const orgData = {
      id: "cmdirjqr20000z28po2eon0yf",
      name: "blr.police"
    }
    
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('organization', JSON.stringify(orgData))
    
    setToken(testToken)
    console.log('✅ Test token set successfully')
  }

  const testApiCall = async () => {
    try {
      const response = await fetch('https://irisnet.wiredleap.com/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({ error: error.message })
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Token Debug Page</h1>
      
      <div className="mb-4">
        <p className="mb-2">Current token in localStorage:</p>
        <p className="text-sm bg-gray-100 p-2 rounded break-all">
          {token ? `${token.substring(0, 50)}...` : 'No token found'}
        </p>
      </div>

      <div className="mb-4">
        <button 
          onClick={setTestToken}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
        >
          Set Test Token
        </button>
        
        <button 
          onClick={testApiCall}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={!token}
        >
          Test API Call
        </button>
      </div>

      {testResult && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-bold">Test Result:</h3>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
