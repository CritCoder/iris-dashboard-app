'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Register service worker
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration.scope)
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error)
        })

      // Handle service worker updates
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service Worker updated, reloading page...')
        window.location.reload()
      })
    }
  }, [])

  return null
}
