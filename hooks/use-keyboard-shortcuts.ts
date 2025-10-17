'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useKeyboardShortcuts() {
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if Cmd (Mac) or Ctrl (Windows/Linux) is pressed
      const isMod = e.metaKey || e.ctrlKey

      if (!isMod) return

      // Prevent default browser behavior for our shortcuts
      const shortcuts: Record<string, () => void> = {
        'd': () => {
          e.preventDefault()
          router.push('/')
        },
        'p': () => {
          e.preventDefault()
          router.push('/profiles')
        },
        's': () => {
          e.preventDefault()
          router.push('/social-feed')
        },
        'a': () => {
          e.preventDefault()
          router.push('/analysis-history')
        },
        'k': () => {
          e.preventDefault()
          router.push('/entity-search')
        },
        'e': () => {
          e.preventDefault()
          router.push('/entities')
        },
        'l': () => {
          e.preventDefault()
          router.push('/locations')
        },
        'b': () => {
          e.preventDefault()
          window.history.back()
        }
      }

      const handler = shortcuts[e.key.toLowerCase()]
      if (handler) {
        handler()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router])
}

