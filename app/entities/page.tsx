'use client'

import { useState, useMemo, Suspense, useCallback } from 'react'
import { PageLayout } from '@/components/layout/page-layout'
import { SearchInput } from '@/components/ui/search-input'
import { useEntities } from '@/hooks/use-api'
import { EntityDetailView } from '@/components/entities/entity-detail-view'
import { TabBar, Tab } from '@/components/ui/tab-bar'
import { EntityList } from '@/components/entities/entity-list'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { EntitiesSidebar } from '@/components/entities/entities-sidebar'


function EntitiesPageContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

  const [tabs, setTabs] = useState<Tab[]>([{ id: 'entities-grid', title: 'All Entities' }])
  const [activeTabId, setActiveTabId] = useState('entities-grid')

  const handleEntityClick = useCallback((entity: any) => {
    const tabExists = tabs.find((tab) => tab.id === entity.id)
    if (!tabExists) {
      setTabs((prevTabs) => [
        ...prevTabs,
        { id: entity.id, title: entity.name, entityData: entity },
      ])
    }
    setActiveTabId(entity.id)
  }, [tabs])

  const handleTabClose = useCallback((tabId: string) => {
    const newTabs = tabs.filter((tab) => tab.id !== tabId)
    setTabs(newTabs)
    if (activeTabId === tabId) {
      setActiveTabId(newTabs[newTabs.length - 1]?.id || 'entities-grid')
    }
  }, [tabs, activeTabId])

  const apiParams = useMemo(() => {
    const params: any = { ...activeFilters }
    if (searchQuery) params.q = searchQuery
    return params
  }, [searchQuery, activeFilters])
  
  const handleFilterChange = (params: Record<string, string>) => {
    setActiveFilters(params)
  }

  const { data: apiEntities, loading, error } = useEntities(apiParams)

  const activeEntity = useMemo(
    () => tabs.find((tab) => tab.id === activeTabId)?.entityData,
    [tabs, activeTabId]
  )
  
  const FilterSidebar = () => (
    <div className="p-4 sm:p-6">
      <h2 className="text-xl font-bold text-foreground mb-6">Explore Entities</h2>
      <EntitiesSidebar 
        onFilterChange={handleFilterChange}
        activeParams={apiParams}
      />
    </div>
  )

  return (
    <PageLayout>
      <div className="h-screen flex bg-background overflow-hidden">
        {/* Left Sidebar */}
        <div className="hidden md:block w-72 border-r border-border bg-card/30 overflow-y-auto">
          <FilterSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="h-16 flex-shrink-0 flex items-center px-4 border-b border-border bg-background">
            <div className="relative flex-1 max-w-md">
              <SearchInput
                placeholder="Search entities by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 ml-4">
               <span className="text-sm text-muted-foreground hidden sm:block">
                {apiEntities?.length || 0} entities found
              </span>
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">Filters</Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0 w-[85%] max-w-sm overflow-y-auto">
                    <FilterSidebar />
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
          
          <TabBar
            tabs={tabs}
            activeTabId={activeTabId}
            onTabClick={setActiveTabId}
            onTabClose={handleTabClose}
          />
          
          <div className="flex-1 overflow-y-auto">
            {activeTabId === 'entities-grid' ? (
              <div className="p-4 sm:p-6">
                {loading ? (
                  <p>Loading...</p> // Replace with a proper skeleton loader
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : (
                  <EntityList 
                    entities={apiEntities || []} 
                    onEntityClick={handleEntityClick} 
                  />
                )}
              </div>
            ) : (
              activeEntity && (
                <EntityDetailView 
                  entity={activeEntity} 
                  onBack={() => handleTabClose(activeTabId)} 
                />
              )
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}


export default function EntitiesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EntitiesPageContent />
    </Suspense>
  )
}
