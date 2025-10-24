'use client'

import { useState } from 'react'
import { ProfileHeader } from './profile-header'
import { ProfilePostTabs } from './profile-post-tabs'
import { ProfileStats } from './profile-stats'
import { PostCard } from '@/components/posts/post-card'
import { convertToPostCardFormat } from '@/lib/utils'
import { useProfilePosts, useProfileDetails } from '@/hooks/use-api'
import { Loader2, Grid, List, Table as TableIcon } from 'lucide-react'
import { PostCardSkeleton } from '@/components/skeletons/post-card-skeleton'
import { Button } from '@/components/ui/button'
import {
  Table as UITable,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'


interface ProfileDetailViewProps {
  profile: any
  onClose?: () => void
}

export function ProfileDetailView({ profile, onClose }: ProfileDetailViewProps) {
  const [activeTab, setActiveTab] = useState('latest')
  const [view, setView] = useState<'grid' | 'list' | 'table'>('grid')

  const postApiParams: { sort: string; sentiment?: string } = { sort: 'latest' }
  if (activeTab === 'positive') postApiParams.sentiment = 'POSITIVE'
  if (activeTab === 'negative') postApiParams.sentiment = 'NEGATIVE'
  if (activeTab === 'top') postApiParams.sort = 'top'

  const {
    data: postsData,
    loading: postsLoading,
    error: postsError,
  } = useProfilePosts(profile.id, postApiParams)
  
  const { 
    data: profileDetails, 
    loading: detailsLoading,
    error: detailsError 
  } = useProfileDetails(profile.id)
  
  if (detailsLoading || !profileDetails) {
    return (
      <div className="h-full w-full flex bg-background p-4">
        <div className="w-3/4 pr-4">
          <Skeleton className="h-40 w-full" />
          <div className="mt-4 space-y-4">
            <PostCardSkeleton view="list" count={5} />
          </div>
        </div>
        <div className="w-1/4">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    )
  }

  const posts = postsData || []
  const stats = profileDetails.stats || null
  const fullProfile = profileDetails.profile || profile

  if (!profile) return null

  const renderPosts = () => {
    if (postsLoading) {
      return (
        <div className="p-4 space-y-4">
          <PostCardSkeleton view={view === 'table' ? 'list' : view} count={view === 'grid' ? 6 : 3} />
        </div>
      )
    }

    if (postsError) {
      return (
        <div className="h-full flex items-center justify-center">
          <p className="text-red-500">{postsError}</p>
        </div>
      )
    }

    if (posts.length === 0) {
      return (
        <div className="h-full flex items-center justify-center">
          <p className="text-muted-foreground">No posts found</p>
        </div>
      )
    }

    const postCards = posts.map((post) => {
      const formattedPost = convertToPostCardFormat(post)
      return (
        <PostCard
          key={post.id}
          post={formattedPost}
          view={view}
        />
      )
    })

    if (view === 'table') {
      return (
        <UITable>
          <TableHeader>
            <TableRow>
              <TableHead>Post</TableHead>
              <TableHead>Content</TableHead>
              <TableHead className="text-center">Likes</TableHead>
              <TableHead className="text-center">Comments</TableHead>
              <TableHead>Posted At</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{postCards}</TableBody>
        </UITable>
      )
    }

    if (view === 'grid') {
      return <div className="p-4 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">{postCards}</div>
    }

    return <div className="p-4 space-y-4">{postCards}</div>
  }

  return (
    <div className="h-full w-full flex bg-background">
      <div className="w-3/4 flex flex-col border-r border-border">
        {/* Fixed Header Section */}
        <div className="sticky top-0 z-10 bg-background border-b border-border">
          <ProfileHeader profile={fullProfile} onClose={onClose} />
          <div className="px-4 py-2 flex justify-between items-center bg-background">
            <ProfilePostTabs onTabSelect={setActiveTab} activeTab={activeTab} />
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
                <TableIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Scrollable Content Section */}
        <div className="flex-1 overflow-y-auto">
          {renderPosts()}
        </div>
      </div>
      
      <div className="w-1/4 flex flex-col">
        <ProfileStats profile={fullProfile} posts={posts} stats={stats} />
      </div>
    </div>
  )
}

