'use client'

import { useState, useEffect } from 'react'
import { ProfileHeader } from './profile-header'
import { ProfilePostTabs } from './profile-post-tabs'
import { ProfileStats } from './profile-stats'
import { PostCard } from '@/components/posts/post-card'
import { convertToPostCardFormat } from '@/hooks/use-posts'
import { useAuth } from '@/contexts/auth-context'
import { Loader2 } from 'lucide-react'

interface ProfileDetailViewProps {
  profile: any
  onClose?: () => void
}

export function ProfileDetailView({ profile, onClose }: ProfileDetailViewProps) {
  const { token } = useAuth()
  const [posts, setPosts] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('latest')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  })
  const [loadingMore, setLoadingMore] = useState(false)

  // Fetch profile posts
  useEffect(() => {
    const fetchPosts = async () => {
      if (!profile?.id || !token) return
      
      setLoading(true)
      try {
        // Determine sentiment filter based on active tab
        let sentiment = null
        if (activeTab === 'positive') sentiment = 'POSITIVE'
        else if (activeTab === 'negative') sentiment = 'NEGATIVE'
        
        const params = new URLSearchParams({
          page: pagination.page.toString(),
          limit: pagination.limit.toString(),
        })
        
        if (sentiment) params.append('sentiment', sentiment)
        
        const response = await fetch(
          `https://irisnet.wiredleap.com/api/social/profiles/${profile.id}/posts?${params.toString()}`,
          {
            headers: {
              'Accept': '*/*',
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        
        if (result.success) {
          setPosts(result.data?.posts || result.data || [])
          if (result.data?.pagination || result.pagination) {
            setPagination(result.data?.pagination || result.pagination)
          }
        }
      } catch (error) {
        console.error('Failed to fetch profile posts:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPosts()
  }, [profile?.id, activeTab, token])

  // Fetch profile details and stats
  useEffect(() => {
    const fetchProfileDetails = async () => {
      if (!profile?.id || !token) return
      
      try {
        const response = await fetch(
          `https://irisnet.wiredleap.com/api/social/profiles/${profile.id}`,
          {
            headers: {
              'Accept': '*/*',
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        
        if (result.success && result.data) {
          setStats(result.data.stats || null)
        }
      } catch (error) {
        console.error('Failed to fetch profile details:', error)
      }
    }
    
    fetchProfileDetails()
  }, [profile?.id, token])

  const handleLoadMore = async () => {
    if (loadingMore || !pagination.hasNext) return
    
    setLoadingMore(true)
    try {
      let sentiment = null
      if (activeTab === 'positive') sentiment = 'POSITIVE'
      else if (activeTab === 'negative') sentiment = 'NEGATIVE'
      
      const params = new URLSearchParams({
        page: (pagination.page + 1).toString(),
        limit: pagination.limit.toString(),
      })
      
      if (sentiment) params.append('sentiment', sentiment)
      
      const response = await fetch(
        `https://irisnet.wiredleap.com/api/social/profiles/${profile.id}/posts?${params.toString()}`,
        {
          headers: {
            'Accept': '*/*',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.success) {
        setPosts(prevPosts => [...prevPosts, ...(result.data?.posts || result.data || [])])
        if (result.data?.pagination || result.pagination) {
          setPagination(result.data?.pagination || result.pagination)
        }
      }
    } catch (error) {
      console.error('Failed to load more posts:', error)
    } finally {
      setLoadingMore(false)
    }
  }

  if (!profile) return null

  return (
    <div className="h-full w-full flex bg-background">
      {/* Left Column - Header + Posts (3/4 width) */}
      <div className="w-3/4 flex flex-col border-r border-border">
        <ProfileHeader profile={profile} onClose={onClose} />
        <ProfilePostTabs onTabSelect={setActiveTab} activeTab={activeTab} />
        
        {/* Posts Feed */}
        <div className="flex-1 overflow-y-auto">
          {loading && posts.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Loading posts...</p>
              </div>
            </div>
          ) : posts.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground">No posts found</p>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {posts.map((post) => {
                const formattedPost = convertToPostCardFormat(post)
                return (
                  <PostCard
                    key={post.id}
                    post={formattedPost}
                    view="list"
                  />
                )
              })}
              
              {/* Load More Button */}
              {pagination.hasNext && (
                <div className="text-center py-4">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loadingMore ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      'Load More Posts'
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Right Column - Statistics (1/4 width) */}
      <div className="w-1/4 flex flex-col">
        <ProfileStats profile={profile} posts={posts} stats={stats} />
      </div>
    </div>
  )
}

