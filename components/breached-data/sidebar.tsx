'use client'

import type { LucideIcon } from 'lucide-react'

interface BreachedDataSidebarProps {
  activeType: string
  onTypeChange: (typeId: string) => void
  searchTypes: {
    id: string
    name: string
    icon: LucideIcon
    description?: string
    color?: string
  }[]
}

export function BreachedDataSidebar({
  activeType,
  onTypeChange,
  searchTypes,
}: BreachedDataSidebarProps) {
  return (
    <div className="w-80 bg-card border-r border-border flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Breach Search</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose a data type to begin.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Search Parameters
          </h3>
          <div className="space-y-2">
            {searchTypes.map((type) => {
              const Icon = type.icon
              const isActive = activeType === type.id

              return (
                <button
                  key={type.id}
                  onClick={() => onTypeChange(type.id)}
                  className={`w-full rounded-lg border text-left px-3 py-2.5 transition-all duration-200 flex items-start gap-3 ${
                    isActive
                      ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                      : 'border-border bg-card hover:border-primary/40 hover:bg-accent/40'
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-md ${
                      isActive
                        ? type.color || 'bg-primary-foreground/20'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : ''}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium leading-none">
                        {type.name}
                      </span>
                    </div>
                    {type.description && (
                      <p className={`mt-1 text-xs ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {type.description}
                      </p>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
