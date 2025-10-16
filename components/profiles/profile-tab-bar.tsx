'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Tab {
  id: string
  title: string
  profileData?: any
}

interface ProfileTabBarProps {
  tabs: Tab[]
  activeTabId: string
  onTabClick: (tabId: string) => void
  onTabClose: (tabId: string) => void
}

export function ProfileTabBar({ tabs, activeTabId, onTabClick, onTabClose }: ProfileTabBarProps) {
  return (
    <div className="flex-shrink-0 bg-card border-b border-border">
      <div className="flex items-center overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabClick(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTabId === tab.id
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/50'
            }`}
          >
            <span>{tab.title}</span>
            {tab.id !== 'profiles-grid' && (
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-destructive/20"
                onClick={(e) => {
                  e.stopPropagation()
                  onTabClose(tab.id)
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

