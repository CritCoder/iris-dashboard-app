'use client'

import { useAuth } from '@/contexts/auth-context'
import { useEffect, useState } from 'react'

export default function DebugAuthPage() {
  const { user, token, isAuthenticated, isLoading } = useAuth()
  const [localStorageData, setLocalStorageData] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      const organization = localStorage.getItem('organization')
      
      setLocalStorageData({
        token: token ? `${token.substring(0, 20)}...` : null,
        user: user ? JSON.parse(user) : null,
        organization: organization ? JSON.parse(organization) : null
      })
    }
  }, [])

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Auth Context State</h2>
          <pre className="text-sm">{JSON.stringify({
            isLoading,
            isAuthenticated,
            hasUser: !!user,
            hasToken: !!token,
            tokenPreview: token ? `${token.substring(0, 20)}...` : null
          }, null, 2)}</pre>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">LocalStorage Data</h2>
          <pre className="text-sm">{JSON.stringify(localStorageData, null, 2)}</pre>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">User Data</h2>
          <pre className="text-sm">{JSON.stringify(user, null, 2)}</pre>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Actions</h2>
          <div className="space-x-4">
            <button 
              onClick={() => {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                localStorage.removeItem('organization')
                window.location.reload()
              }}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Clear Auth Data
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}