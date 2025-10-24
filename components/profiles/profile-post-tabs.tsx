'use client'

const tabs = [
  { name: 'Latest', value: 'latest' },
  { name: 'Top', value: 'top' },
  { name: 'Positive', value: 'positive' },
  { name: 'Negative', value: 'negative' },
]

interface ProfilePostTabsProps {
  onTabSelect: (tab: string) => void
  activeTab?: string
}

export function ProfilePostTabs({ onTabSelect, activeTab = 'latest' }: ProfilePostTabsProps) {
  return (
    <div className="bg-background">
      <nav className="flex space-x-1" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => onTabSelect(tab.value)}
            className={`whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.value
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </nav>
    </div>
  )
}

