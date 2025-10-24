'use client'

import { api } from '@/lib/api'
import { useState } from 'react'

export default function ApiTestPage() {
  const [result, setResult] = useState<any>(null)

  const testApiClient = async () => {
    console.log('🧪 TESTING API CLIENT - Starting test...')
    
    try {
      // Test the campaignSearch method with correct time range format
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 30)
      
      const testData = {
        topic: 'test',
        timeRange: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        },
        platforms: ['facebook', 'twitter'],
        campaignType: 'NORMAL'
      }
      
      console.log('🧪 TESTING API CLIENT - Calling campaignSearch with:', testData)
      const response = await api.campaign.campaignSearch(testData)
      console.log('🧪 TESTING API CLIENT - Response:', response)
      setResult(response)
    } catch (error) {
      console.error('🧪 TESTING API CLIENT - Error:', error)
      setResult({ error: error.message })
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Client Test</h1>
      <p className="mb-4">This page tests if the API client is loading fresh code.</p>
      
      <button 
        onClick={testApiClient}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Test API Client
      </button>
      
      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-bold">Result:</h3>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Check the browser console for debug logs:</p>
        <ul className="list-disc list-inside">
          <li>🚀 FRESH API CLIENT LOADED - Version: 2025-10-24-v3</li>
          <li>🔥 FRESH API CLIENT - campaignSearch method called</li>
        </ul>
      </div>
    </div>
  )
}
