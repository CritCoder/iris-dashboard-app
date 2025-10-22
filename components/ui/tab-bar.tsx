'use client'

import { X } from 'lucide-react'

export interface Tab {
  id: string
  title: string
  [key: string]: any
}

interface TabBarProps {
  tabs: Tab[]
  activeTabId: string
  onTabClick: (tabId: string) => void
  onTabClose?: (tabId: string) => void
}

export function TabBar({
  tabs,
  activeTabId,
  onTabClick,
  onTabClose,
}: TabBarProps) {
  return (
    <div className="flex border-b border-border bg-background">
      <nav className="-mb-px flex space-x-2 overflow-x-auto" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabClick(tab.id)}
            className={`
              group relative flex items-center whitespace-nowrap py-2 px-3 text-sm font-medium
              ${
                activeTabId === tab.id
                  ? 'border-b-2 border-primary text-primary'
                  : 'border-b-2 border-transparent text-muted-foreground hover:border-gray-300 dark:hover:border-gray-600 hover:text-foreground'
              }
            `}
          >
            {tab.title}
            {onTabClose && tabs.length > 1 && (
              <X
                className="ml-2 h-4 w-4 text-muted-foreground opacity-50 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                  onTabClose(tab.id)
                }}
              />
            )}
          </button>
        ))}
      </nav>
    </div>
  )
}
