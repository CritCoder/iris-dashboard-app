'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useKeyboardShortcuts() {
  const router = useRouter()

  // All keyboard shortcuts have been disabled
  useEffect(() => {
    // No keyboard shortcuts are active
    return () => {}
  }, [router])
}

