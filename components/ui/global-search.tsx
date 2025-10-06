'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { SpotlightSearch } from './spotlight-search'

export function GlobalSearch() {
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false)

  // Global keyboard shortcut for spotlight search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSpotlightOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input 
          type="text"
          placeholder="Search..."
          onClick={() => setIsSpotlightOpen(true)}
          className="bg-background border border-border rounded-lg pl-10 pr-20 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring w-80 cursor-pointer"
          readOnly
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs text-muted-foreground bg-muted rounded border border-border">⌘K</kbd>
      </div>
      
      <SpotlightSearch 
        isOpen={isSpotlightOpen} 
        onClose={() => setIsSpotlightOpen(false)} 
      />
    </>
  )
}
