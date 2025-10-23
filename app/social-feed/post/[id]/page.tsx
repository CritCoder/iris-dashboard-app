'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { Heart, MessageCircle, Share2, Eye, Copy, RefreshCw, BarChart3, Users, TrendingUp, AlertTriangle, Clock, MapPin, Hash, Calendar, ExternalLink, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { api } from '@/lib/api'

interface PostData {
  id: string
  platform: string
  author: {
    name: string
    avatar: string
    handle: string
  }
  content: string
  timestamp: string
  engagement: {
    likes: number
    comments: number
    shares: number
    views: number
  }
  url: string
  thumbnailUrl?: string
  isViral?: boolean
  isTrending?: boolean
}

export default function PostDetailPage() {
  const params = useParams()
  const postId = params.id as string
  
  const [postData, setPostData] = useState<PostData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedReply, setSelectedReply] = useState<number>(0)

  useEffect(() => {
    console.log('🔍 LOADING POST:', { postId })
    
    const fetchPostData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Try to fetch the specific post by ID
        console.log('🚀 ATTEMPTING API CALL for post:', postId)
        const response = await api.social.getPostById(postId)
        console.log('📊 POST API RESPONSE:', response)
        
        if (response.success && response.data) {
          const post = response.data
          console.log('✅ POST DATA RECEIVED:', post)
          
          // Transform the API response to match our PostData interface
          const transformedPost: PostData = {
            id: post.id || postId,
            platform: post.platform || 'twitter',
            author: {
              name: post.author?.name || post.author?.displayName || 'Unknown Author',
              avatar: post.author?.avatar || post.author?.profilePicture || '',
              handle: post.author?.handle || post.author?.username || '@unknown'
            },
            content: post.content || post.text || 'No content available',
            timestamp: post.timestamp || post.createdAt || new Date().toISOString(),
            engagement: {
              likes: post.engagement?.likes || post.likesCount || post.likes || 0,
              comments: post.engagement?.comments || post.commentsCount || post.comments || 0,
              shares: post.engagement?.shares || post.sharesCount || post.shares || 0,
              views: post.engagement?.views || post.viewsCount || post.views || 0
            },
            url: post.url || post.originalUrl || '',
            thumbnailUrl: post.thumbnailUrl || post.mediaUrl || '',
            isViral: post.isViral || false,
            isTrending: post.isTrending || false
          }
          
          setPostData(transformedPost)
        } else {
          console.error('❌ NO POST DATA:', response)
          setError('Post not found or failed to load')
        }
      } catch (err) {
        console.error('💥 ERROR FETCHING POST:', err)
        setError(err instanceof Error ? err.message : 'Failed to load post')
      } finally {
        setLoading(false)
      }
    }

    if (postId) {
      fetchPostData()
    }
  }, [postId])

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading post...</span>
          </div>
        </div>
      </PageLayout>
    )
  }

  if (error) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-destructive mb-2">Post Not Found</h1>
            <p className="text-muted-foreground mb-4">{error}</p>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Post ID: <code className="bg-muted px-2 py-1 rounded text-xs">{postId}</code></p>
              <Button asChild variant="outline">
                <Link href="/social-feed">← Back to Social Feed</Link>
              </Button>
            </div>
          </div>
        </div>
      </PageLayout>
    )
  }

  if (!postData) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">No Post Data</h1>
            <p className="text-muted-foreground mb-4">Unable to load post information</p>
            <Button asChild variant="outline">
              <Link href="/social-feed">← Back to Social Feed</Link>
            </Button>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          {/* Header */}
          <div className="mb-6">
            <Button asChild variant="ghost" className="mb-4">
              <Link href="/social-feed" className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 rotate-180" />
                Back to Social Feed
              </Link>
            </Button>
            
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {postData.author.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-semibold">{postData.author.name}</h1>
                <p className="text-muted-foreground">{postData.author.handle}</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Badge variant="outline">{postData.platform}</Badge>
                {postData.isViral && <Badge variant="default">Viral</Badge>}
                {postData.isTrending && <Badge variant="secondary">Trending</Badge>}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Post Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {new Date(postData.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-foreground leading-relaxed">{postData.content}</p>
                    
                    {postData.thumbnailUrl && (
                      <div className="rounded-lg overflow-hidden">
                        <img 
                          src={postData.thumbnailUrl} 
                          alt="Post media" 
                          className="w-full h-auto"
                        />
                      </div>
                    )}
                    
                    {postData.url && (
                      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        <a 
                          href={postData.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline truncate"
                        >
                          View Original Post
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Engagement Stats */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Engagement Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Heart className="w-5 h-5 text-red-500" />
                        <span className="text-2xl font-bold">{postData.engagement.likes.toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Likes</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <MessageCircle className="w-5 h-5 text-blue-500" />
                        <span className="text-2xl font-bold">{postData.engagement.comments.toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Comments</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Share2 className="w-5 h-5 text-green-500" />
                        <span className="text-2xl font-bold">{postData.engagement.shares.toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Shares</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Eye className="w-5 h-5 text-purple-500" />
                        <span className="text-2xl font-bold">{postData.engagement.views.toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Views</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    View Audience
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Track Performance
                  </Button>
                </CardContent>
              </Card>

              {/* Post Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Post Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">ID: {postData.id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {new Date(postData.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Platform: {postData.platform}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
