/**
 * State Persistence Utilities
 * Handles localStorage management for UI state, filters, and scroll positions
 */

// Scroll position storage
export const ScrollPersistence = {
  save: (key: string, position: number) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`scroll_${key}`, position.toString())
    }
  },
  
  restore: (key: string): number => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(`scroll_${key}`)
      return saved ? parseInt(saved, 10) : 0
    }
    return 0
  },
  
  clear: (key: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(`scroll_${key}`)
    }
  }
}

// Filter state storage
export const FilterPersistence = {
  save: (page: string, filters: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`filters_${page}`, JSON.stringify(filters))
    }
  },
  
  restore: (page: string): Record<string, any> | null => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`filters_${page}`)
      return saved ? JSON.parse(saved) : null
    }
    return null
  },
  
  clear: (page: string) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`filters_${page}`)
    }
  }
}

// Sidebar state storage
export const SidebarPersistence = {
  saveExpanded: (submenu: string | null) => {
    if (typeof window !== 'undefined') {
      if (submenu) {
        localStorage.setItem('sidebar_expanded', submenu)
      } else {
        localStorage.removeItem('sidebar_expanded')
      }
    }
  },
  
  restoreExpanded: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sidebar_expanded')
    }
    return null
  }
}

// Recent items storage
export const RecentItems = {
  add: (type: 'profile' | 'entity' | 'location' | 'campaign', item: { id: string; name: string; href: string }) => {
    if (typeof window !== 'undefined') {
      const key = `recent_${type}`
      const existing = localStorage.getItem(key)
      const items = existing ? JSON.parse(existing) : []
      
      // Remove if already exists
      const filtered = items.filter((i: any) => i.id !== item.id)
      
      // Add to beginning
      filtered.unshift(item)
      
      // Keep only last 10
      const limited = filtered.slice(0, 10)
      
      localStorage.setItem(key, JSON.stringify(limited))
    }
  },
  
  get: (type: 'profile' | 'entity' | 'location' | 'campaign'): Array<{ id: string; name: string; href: string }> => {
    if (typeof window !== 'undefined') {
      const key = `recent_${type}`
      const existing = localStorage.getItem(key)
      return existing ? JSON.parse(existing) : []
    }
    return []
  },
  
  clear: (type: 'profile' | 'entity' | 'location' | 'campaign') => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`recent_${type}`)
    }
  }
}

// Search history
export const SearchHistory = {
  add: (query: string) => {
    if (typeof window !== 'undefined' && query.trim()) {
      const existing = localStorage.getItem('search_history')
      const history = existing ? JSON.parse(existing) : []
      
      // Remove if already exists
      const filtered = history.filter((q: string) => q !== query)
      
      // Add to beginning
      filtered.unshift(query)
      
      // Keep only last 20
      const limited = filtered.slice(0, 20)
      
      localStorage.setItem('search_history', JSON.stringify(limited))
    }
  },
  
  get: (): string[] => {
    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem('search_history')
      return existing ? JSON.parse(existing) : []
    }
    return []
  },
  
  clear: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('search_history')
    }
  }
}

