'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command'
import { Search, Home, Users, Globe, BarChart3, Hash, MapPin, Building2, Play, Mail, Shield, Clock } from 'lucide-react'
import { RecentItems, SearchHistory } from '@/lib/state-persistence'

export function QuickActions() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [recentItems, setRecentItems] = useState<any[]>([])
  const [searchHistory, setSearchHistory] = useState<string[]>([])

  useEffect(() => {
    // Load recent items and search history
    const profiles = RecentItems.get('profile')
    const entities = RecentItems.get('entity')
    const locations = RecentItems.get('location')
    const campaigns = RecentItems.get('campaign')
    
    setRecentItems([
      ...profiles.slice(0, 3),
      ...entities.slice(0, 2),
      ...locations.slice(0, 2),
      ...campaigns.slice(0, 3)
    ])
    
    setSearchHistory(SearchHistory.get().slice(0, 5))
  }, [open])

  useEffect(() => {
    // Keyboard shortcuts have been disabled
    // No event listeners are added
    return () => {}
  }, [])

  const navigate = (href: string) => {
    router.push(href)
    setOpen(false)
  }

  const handleSearchSelect = (query: string) => {
    SearchHistory.add(query)
    navigate(`/entity-search?q=${encodeURIComponent(query)}`)
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        {/* Quick Navigation */}
        <CommandGroup heading="Quick Navigation">
          <CommandItem onSelect={() => navigate('/')}>
            <Home className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => navigate('/profiles')}>
            <Users className="mr-2 h-4 w-4" />
            <span>Profiles</span>
          </CommandItem>
          <CommandItem onSelect={() => navigate('/social-feed')}>
            <Globe className="mr-2 h-4 w-4" />
            <span>Social Feed</span>
          </CommandItem>
          <CommandItem onSelect={() => navigate('/entities')}>
            <Hash className="mr-2 h-4 w-4" />
            <span>Entities</span>
          </CommandItem>
          <CommandItem onSelect={() => navigate('/locations')}>
            <MapPin className="mr-2 h-4 w-4" />
            <span>Locations</span>
          </CommandItem>
          <CommandItem onSelect={() => navigate('/groups')}>
            <Building2 className="mr-2 h-4 w-4" />
            <span>Groups</span>
          </CommandItem>
        </CommandGroup>

        {/* Recent Items */}
        {recentItems.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Recent">
              {recentItems.map((item) => (
                <CommandItem key={item.id} onSelect={() => navigate(item.href)}>
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{item.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {/* Search History */}
        {searchHistory.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Recent Searches">
              {searchHistory.map((query, index) => (
                <CommandItem key={index} onSelect={() => handleSearchSelect(query)}>
                  <Search className="mr-2 h-4 w-4" />
                  <span>{query}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {/* Actions */}
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => navigate('/start-analysis')}>
            <Play className="mr-2 h-4 w-4" />
            <span>Start New Analysis</span>
          </CommandItem>
          <CommandItem onSelect={() => navigate('/social-inbox')}>
            <Mail className="mr-2 h-4 w-4" />
            <span>Check Inbox</span>
          </CommandItem>
          <CommandItem onSelect={() => navigate('/osint-tools')}>
            <Shield className="mr-2 h-4 w-4" />
            <span>OSINT Tools</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

