'use client'

import { useState, useMemo, Suspense, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { Search, Users } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useProfiles } from '@/hooks/use-api'
import { ProfileList } from '@/components/profiles/profile-list'
import { ProfilesSidebar } from '@/components/profiles/profiles-sidebar'
import { ProfilesGridSkeleton } from '@/components/skeletons/profile-card-skeleton'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { TabBar, Tab } from '@/components/ui/tab-bar'
import { ProfileDetailView } from '@/components/profiles/profile-detail-view'

function ProfilesPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')

  const [tabs, setTabs] = useState<Tab[]>([
    { id: 'profiles-grid', title: 'All Profiles' },
  ])
  const [activeTabId, setActiveTabId] = useState('profiles-grid')

  const handleFilterChange = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(params)
    if (searchQuery) {
      newParams.set('search', searchQuery)
    }
    router.push(`/profiles?${newParams.toString()}`)
  }
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    const newParams = new URLSearchParams(searchParams.toString())
    if (query) {
      newParams.set('search', query)
    } else {
      newParams.delete('search')
    }
    router.push(`/profiles?${newParams.toString()}`)
  }

  const handleProfileClick = useCallback((profile: any) => {
    const tabExists = tabs.find((tab) => tab.id === profile.id)
    if (!tabExists) {
      setTabs((prevTabs) => [
        ...prevTabs,
        { id: profile.id, title: profile.displayName || profile.username, profileData: profile },
      ])
    }
    setActiveTabId(profile.id)
  }, [tabs])

  const handleTabClose = useCallback((tabId: string) => {
    const newTabs = tabs.filter((tab) => tab.id !== tabId)
    setTabs(newTabs)
    if (activeTabId === tabId) {
      setActiveTabId(newTabs[newTabs.length - 1]?.id || 'profiles-grid')
    }
  }, [tabs, activeTabId])

  const apiParams = useMemo(() => {
    const params: any = {
      limit: 50,
    }
    searchParams.forEach((value, key) => {
      params[key] = value
    })
    return params
  }, [searchParams])

  const { data: profilesData, loading, error } = useProfiles(apiParams)
  
  const activeProfile = useMemo(() => 
    tabs.find((tab) => tab.id === activeTabId)?.profileData,
    [tabs, activeTabId]
  )

  return (
      <PageLayout>
      <div className="h-screen flex bg-background overflow-hidden">
        <ProfilesSidebar
          onFilterChange={handleFilterChange}
          activeParams={searchParams}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b border-border bg-background px-4 py-3 flex items-center justify-between">
            <h1 className="text-lg font-semibold">Profiles</h1>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search profiles..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
          </div>

          <TabBar
            tabs={tabs}
            activeTabId={activeTabId}
            onTabClick={setActiveTabId}
            onTabClose={handleTabClose}
          />

          <div className="flex-1 overflow-y-auto">
            {activeTabId === 'profiles-grid' ? (
              <div className="p-4 sm:p-6">
                {loading ? (
                  <ProfilesGridSkeleton count={12} />
                ) : error ? (
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Users className="w-12 h-12 text-muted-foreground" />
                      </EmptyMedia>
                      <EmptyTitle>Error Loading Profiles</EmptyTitle>
                      <EmptyDescription>{error}</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                ) : profilesData && profilesData.length > 0 ? (
                  <ProfileList 
                    profiles={profilesData} 
                    defaultView="grid" 
                    onProfileClick={handleProfileClick}
                  />
                ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Users className="w-12 h-12 text-muted-foreground" />
              </EmptyMedia>
              <EmptyTitle>No Profiles Found</EmptyTitle>
              <EmptyDescription>
                        Try adjusting your filters or search query.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
                )}
              </div>
            ) : (
              activeProfile && <ProfileDetailView profile={activeProfile} onClose={() => handleTabClose(activeTabId)} />
        )}
        </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default function ProfilesPage() {
  return (
    <Suspense fallback={<ProfilesGridSkeleton count={12} />}>
      <ProfilesPageContent />
    </Suspense>
  )
}