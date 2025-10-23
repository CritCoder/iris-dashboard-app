'use client'

import { useEffect, useState } from 'react'

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  memoryUsage?: number
  frameRate: number
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show in development or when explicitly enabled
    const shouldShow = process.env.NODE_ENV === 'development' || 
                      localStorage.getItem('showPerformanceMonitor') === 'true'
    
    if (!shouldShow) return

    const measurePerformance = () => {
      if (typeof window === 'undefined') return

      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const paint = performance.getEntriesByType('paint')
      
      const loadTime = navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0
      const renderTime = paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0
      
      // Memory usage (if available)
      const memory = (performance as any).memory
      const memoryUsage = memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : undefined
      
      // Frame rate monitoring
      let frameCount = 0
      let lastTime = performance.now()
      
      const measureFrameRate = () => {
        frameCount++
        const currentTime = performance.now()
        
        if (currentTime - lastTime >= 1000) {
          const frameRate = Math.round((frameCount * 1000) / (currentTime - lastTime))
          setMetrics(prev => prev ? { ...prev, frameRate } : null)
          frameCount = 0
          lastTime = currentTime
        }
        
        requestAnimationFrame(measureFrameRate)
      }
      
      setMetrics({
        loadTime: Math.round(loadTime),
        renderTime: Math.round(renderTime),
        memoryUsage,
        frameRate: 0
      })
      
      requestAnimationFrame(measureFrameRate)
    }

    // Measure after a short delay to ensure page is loaded
    const timeout = setTimeout(measurePerformance, 1000)
    
    return () => clearTimeout(timeout)
  }, [])

  // Toggle visibility with Ctrl+Shift+P
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault()
        setIsVisible(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!metrics || !isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
      <div className="text-xs font-mono space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Performance</span>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            ×
          </button>
        </div>
        <div>Load: {metrics.loadTime}ms</div>
        <div>Render: {metrics.renderTime}ms</div>
        {metrics.memoryUsage && <div>Memory: {metrics.memoryUsage}MB</div>}
        <div className="flex items-center gap-2">
          <span>FPS:</span>
          <div className={`w-2 h-2 rounded-full ${
            metrics.frameRate >= 55 ? 'bg-green-500' : 
            metrics.frameRate >= 45 ? 'bg-yellow-500' : 'bg-red-500'
          }`} />
          <span>{metrics.frameRate}</span>
        </div>
      </div>
    </div>
  )
}

// Hook for performance monitoring
export function usePerformanceMonitor() {
  const [isMonitoring, setIsMonitoring] = useState(false)

  const startMonitoring = () => {
    setIsMonitoring(true)
    localStorage.setItem('showPerformanceMonitor', 'true')
  }

  const stopMonitoring = () => {
    setIsMonitoring(false)
    localStorage.removeItem('showPerformanceMonitor')
  }

  return {
    isMonitoring,
    startMonitoring,
    stopMonitoring
  }
}
