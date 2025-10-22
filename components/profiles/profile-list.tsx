'use client'

import { useState } from 'react'
import { Grid, List, Table } from 'lucide-react'
import { ProfileCard, Profile } from './profile-card'
import { Button } from '@/components/ui/button'
import {
  Table as UITable,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

interface ProfileListProps {
  profiles: Profile[]
  campaignId?: string
  defaultView?: 'grid' | 'list' | 'table'
  onProfileClick?: (profile: Profile) => void
}

export function ProfileList({ 
  profiles, 
  campaignId = '1', 
  defaultView = 'grid',
  onProfileClick 
}: ProfileListProps) {
  const [view, setView] = useState<'grid' | 'list' | 'table'>(defaultView)

  return (
    <div className="space-y-6">
      {/* View Switcher */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {profiles.length} profile{profiles.length !== 1 ? 's' : ''} found
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={view === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('grid')}
            className="h-8 px-3"
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('list')}
            className="h-8 px-3"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant={view === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('table')}
            className="h-8 px-3"
          >
            <Table className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {view === 'table' ? (
        <UITable>
          <TableHeader>
            <TableRow>
              <TableHead>Profile</TableHead>
              <TableHead>Bio</TableHead>
              <TableHead className="text-center">Followers</TableHead>
              <TableHead className="text-center">Posts</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                view="table"
                campaignId={campaignId}
                onClick={onProfileClick}
              />
            ))}
          </TableBody>
        </UITable>
      ) : view === 'list' ? (
        <div className="space-y-3">
          {profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              view="list"
              campaignId={campaignId}
              onClick={onProfileClick}
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              view="grid"
              campaignId={campaignId}
              onClick={onProfileClick}
            />
          ))}
        </div>
      )}

      {profiles.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <p>No profiles found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        </div>
      )}
    </div>
  )
}