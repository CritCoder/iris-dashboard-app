'use client'

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    google: any
    googleMapsLoading?: boolean
    googleMapsLoaded?: boolean
  }
}

export default function TestMapPage() {
  const [status, setStatus] = useState<string>('Testing...')
  const [details, setDetails] = useState<any>({})

  useEffect(() => {
    const apiKey = 'AIzaSyCB6N-qTKl-7sAByqi4_EnukJ8zBKHN4zQ'
    
    setStatus('Loading Google Maps script...')
    setDetails({ apiKey: apiKey.substring(0, 20) + '...' })

    // Check if already loaded
    if (window.googleMapsLoaded && window.google?.maps) {
      setStatus('✅ Google Maps already loaded!')
      setDetails(prev => ({ ...prev, alreadyLoaded: true }))
      
      // Try to create a map
      try {
        const mapDiv = document.getElementById('test-map')
        if (mapDiv) {
          const map = new google.maps.Map(mapDiv, {
            center: { lat: 12.9716, lng: 77.5946 },
            zoom: 11
          })
          setStatus('✅ Map created successfully (already loaded)!')
          setDetails(prev => ({ ...prev, mapCreated: true, mapObject: !!map }))
        }
      } catch (error: any) {
        setStatus('❌ Error creating map')
        setDetails(prev => ({ ...prev, error: error.message }))
      }
      return
    }

    // Check if currently loading
    if (window.googleMapsLoading) {
      setStatus('⏳ Google Maps already loading, waiting...')
      
      const checkLoaded = setInterval(() => {
        if (window.googleMapsLoaded && window.google?.maps) {
          setStatus('✅ Google Maps finished loading!')
          setDetails(prev => ({ ...prev, waitedForLoad: true }))
          
          // Try to create a map
          try {
            const mapDiv = document.getElementById('test-map')
            if (mapDiv) {
              const map = new google.maps.Map(mapDiv, {
                center: { lat: 12.9716, lng: 77.5946 },
                zoom: 11
              })
              setStatus('✅ Map created successfully (waited)!')
              setDetails(prev => ({ ...prev, mapCreated: true, mapObject: !!map }))
            }
          } catch (error: any) {
            setStatus('❌ Error creating map')
            setDetails(prev => ({ ...prev, error: error.message }))
          }
          clearInterval(checkLoaded)
        }
      }, 100)
      
      setTimeout(() => {
        clearInterval(checkLoaded)
        if (!window.googleMapsLoaded) {
          setStatus('❌ Timeout waiting for Google Maps')
          window.googleMapsLoading = false
        }
      }, 10000)
      
      return () => clearInterval(checkLoaded)
    }

    // Mark as loading
    window.googleMapsLoading = true

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.id = 'google-maps-script'
    
    script.onload = () => {
      window.googleMapsLoaded = true
      window.googleMapsLoading = false
      
      setStatus('✅ Script loaded successfully!')
      setDetails(prev => ({ 
        ...prev, 
        scriptLoaded: true,
        googleMapsAvailable: !!window.google?.maps,
        version: window.google?.maps?.version
      }))

      // Try to create a map
      try {
        const mapDiv = document.getElementById('test-map')
        if (mapDiv) {
          const map = new google.maps.Map(mapDiv, {
            center: { lat: 12.9716, lng: 77.5946 },
            zoom: 11
          })
          setStatus('✅ Map created successfully!')
          setDetails(prev => ({ ...prev, mapCreated: true, mapObject: !!map }))
        }
      } catch (error: any) {
        setStatus('❌ Error creating map')
        setDetails(prev => ({ ...prev, error: error.message }))
      }
    }
    
    script.onerror = (error) => {
      window.googleMapsLoading = false
      setStatus('❌ Failed to load script')
      setDetails(prev => ({ ...prev, scriptError: String(error) }))
    }
    
    document.head.appendChild(script)

    // Check for Google Maps errors after a short delay
    setTimeout(() => {
      const mapDiv = document.getElementById('test-map')
      if (mapDiv) {
        const errorDiv = mapDiv.querySelector('.gm-err-message')
        if (errorDiv) {
          setStatus('❌ Google Maps Error Detected')
          setDetails(prev => ({ 
            ...prev, 
            googleMapsError: errorDiv.textContent,
            possibleCauses: [
              'API key might be invalid or expired',
              'API key might have domain restrictions',
              'Maps JavaScript API might not be enabled',
              'Billing might not be enabled on Google Cloud',
              'API key might have IP restrictions'
            ]
          }))
        }
      }
    }, 2000)

    // Also check for console errors
    const originalError = console.error
    const errors: string[] = []
    console.error = (...args) => {
      const errorMsg = args.join(' ')
      errors.push(errorMsg)
      setDetails(prev => ({ 
        ...prev, 
        consoleErrors: errors
      }))
      originalError.apply(console, args)
    }

    return () => {
      console.error = originalError
    }
  }, [])

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Google Maps API Test</h1>
        
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-2">Status:</h2>
          <p className="text-xl mb-4">{status}</p>
          
          <h3 className="text-sm font-semibold mb-2">Details:</h3>
          <pre className="bg-muted p-4 rounded text-xs overflow-auto">
            {JSON.stringify(details, null, 2)}
          </pre>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div 
            id="test-map" 
            style={{ height: '400px', width: '100%' }}
            className="bg-muted"
          />
        </div>

        <div className="mt-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Open Browser Console (F12) to see:</h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>Network requests to Google Maps API</li>
            <li>Any error messages from Google</li>
            <li>API key validation errors</li>
            <li>Billing or quota issues</li>
          </ul>
        </div>

        <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <h3 className="font-semibold mb-2 text-red-400">🔥 Common Issues:</h3>
          <div className="space-y-3 text-sm">
            <div>
              <strong>1. API Not Enabled:</strong>
              <p className="text-muted-foreground mt-1">Go to Google Cloud Console → APIs & Services → Enable "Maps JavaScript API"</p>
            </div>
            <div>
              <strong>2. Billing Not Enabled:</strong>
              <p className="text-muted-foreground mt-1">Google Maps requires a billing account. Go to Billing and add a payment method.</p>
            </div>
            <div>
              <strong>3. API Key Restrictions:</strong>
              <p className="text-muted-foreground mt-1">Check if your API key has HTTP referrer restrictions. Add "localhost:3000" to allowed referrers.</p>
            </div>
            <div>
              <strong>4. Check API Key:</strong>
              <a 
                href={`https://maps.googleapis.com/maps/api/js?key=AIzaSyCB6N-qTKl-7sAByqi4_EnukJ8zBKHN4zQ`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Click here to test API key directly →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

