import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { ScrollPersistence } from '@/lib/state-persistence'

/**
 * Hook to automatically restore and save scroll position for a page
 * @param key - Unique key for this scroll position (defaults to pathname)
 */
export function useScrollRestoration(key?: string) {
  const pathname = usePathname()
  const scrollKey = key || pathname
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const isRestoringRef = useRef(false)

  // Restore scroll position on mount
  useEffect(() => {
    if (scrollContainerRef.current && !isRestoringRef.current) {
      isRestoringRef.current = true
      const position = ScrollPersistence.restore(scrollKey)
      
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = position
        }
        isRestoringRef.current = false
      }, 100)
    }
  }, [scrollKey])

  // Save scroll position on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current && !isRestoringRef.current) {
        ScrollPersistence.save(scrollKey, scrollContainerRef.current.scrollTop)
      }
    }

    const container = scrollContainerRef.current
    container?.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      container?.removeEventListener('scroll', handleScroll)
    }
  }, [scrollKey])

  // Clear scroll position on unmount if navigating to a different page
  useEffect(() => {
    return () => {
      if (pathname !== scrollKey) {
        ScrollPersistence.clear(scrollKey)
      }
    }
  }, [pathname, scrollKey])

  return scrollContainerRef
}

