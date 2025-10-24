'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { SpotlightSearch } from './spotlight-search'

export function GlobalSearch() {
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false)

  // Global keyboard shortcuts have been disabled
  useEffect(() => {
    // No keyboard shortcuts are active
    return () => {}
  }, [])

  return (
    <>
      {/* Mobile: Icon button */}
      <button 
        type="button"
        onClick={() => setIsSpotlightOpen(true)}
        className="sm:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-input bg-background hover:bg-accent hover:border-ring transition-colors"
        aria-label="Search"
      >
        <Search className="w-4 h-4 text-muted-foreground" />
      </button>

      {/* Desktop: Full search bar */}
      <div className="relative hidden sm:block w-full">
        <button 
          type="button"
          onClick={() => setIsSpotlightOpen(true)}
          className="bg-background border border-input rounded-xl pl-10 pr-20 py-3 text-sm text-muted-foreground hover:text-foreground hover:border-ring focus:outline-none focus:border-ring w-full cursor-pointer text-left transition-all duration-200 h-[46px]"
        >
          Search pages, posts, profiles, entities...
        </button>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-muted-foreground bg-muted border border-border rounded pointer-events-none">
          ⌘K
        </kbd>
      </div>
      
      <SpotlightSearch 
        isOpen={isSpotlightOpen} 
        onClose={() => setIsSpotlightOpen(false)} 
      />
    </>
  )
}
