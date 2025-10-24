'use client'

import { useState } from 'react'
import { Grid3X3, List, Table } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table as TableComponent, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PostCard, Post } from './post-card'

interface PostListProps {
  posts: Post[]
  campaignId?: string
  defaultView?: 'grid' | 'list' | 'table'
}

export function PostList({ posts, campaignId = '1', defaultView = 'grid' }: PostListProps) {
  const [view, setView] = useState<'grid' | 'list' | 'table'>(defaultView)

  const ViewToggle = () => (
    <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
      <Button
        variant={view === 'grid' ? 'default' : 'ghost'}
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => setView('grid')}
        title="Grid view"
      >
        <Grid3X3 className="w-4 h-4" />
      </Button>
      <Button
        variant={view === 'list' ? 'default' : 'ghost'}
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => setView('list')}
        title="List view"
      >
        <List className="w-4 h-4" />
      </Button>
      <Button
        variant={view === 'table' ? 'default' : 'ghost'}
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => setView('table')}
        title="Table view"
      >
        <Table className="w-4 h-4" />
      </Button>
    </div>
  )

  const renderContent = () => {
    if (view === 'table') {
      return (
        <div className="rounded-md border">
          <TableComponent>
            <TableHeader>
              <TableRow>
                <TableHead>Author</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Sentiment</TableHead>
                <TableHead>Engagement</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  view="table"
                  campaignId={campaignId}
                />
              ))}
            </TableBody>
          </TableComponent>
        </div>
      )
    }

    if (view === 'list') {
      return (
        <div className="space-y-3">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              view="list"
              campaignId={campaignId}
            />
          ))}
        </div>
      )
    }

    // Grid view (default)
    return (
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            view="grid"
            campaignId={campaignId}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {posts.length} post{posts.length !== 1 ? 's' : ''}
        </div>
        <ViewToggle />
      </div>

      {posts.length === 0 ? (
        <div className="flex min-h-[40vh] items-center justify-center text-center py-12">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Grid3X3 className="w-12 h-12 opacity-50" />
            <p>No posts found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        </div>
      ) : (
        renderContent()
      )}
    </div>
  )
}