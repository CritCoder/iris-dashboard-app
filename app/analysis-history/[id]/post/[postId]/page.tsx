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
  sentiment?: string
  isViral?: boolean
  isTrending?: boolean
}

export default function PostAnalysisPage() {
  const params = useParams()
  const postId = params.postId as string
  const campaignId = params.id as string
  
  const [postData, setPostData] = useState<PostData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedReply, setSelectedReply] = useState<number>(0)

  useEffect(() => {
    console.log('🔍 LOADING POST:', { postId, campaignId })
    
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
          
          // Transform API response to match our interface
          const transformedPost: PostData = {
            id: post.id,
            platform: post.platform?.toLowerCase() || 'unknown',
            author: {
              name: post.social_profile?.displayName || post.person?.name || post.social_profile?.username || 'Unknown Author',
              avatar: (post.social_profile?.displayName || post.person?.name || 'U')[0].toUpperCase(),
              handle: post.social_profile?.username || post.social_profile?.displayName || '@unknown'
            },
            content: post.content || 'No content available',
            timestamp: post.postedAt ? new Date(post.postedAt).toLocaleString() : 'Unknown time',
            engagement: {
              likes: post.likesCount || 0,
              comments: post.commentsCount || 0,
              shares: post.sharesCount || 0,
              views: post.viewsCount || 0
            },
            url: post.url || '#',
                   thumbnailUrl: post.thumbnailUrl || 
                                 (post.imageUrls && post.imageUrls[0]) || 
                                 (post.mediaUrls && post.mediaUrls[0]) ||
                                 (post.attachments && post.attachments[0]?.url),
            sentiment: post.aiSentiment?.toLowerCase(),
            isViral: (post.likesCount || 0) > 1000 && (post.sharesCount || 0) > 100,
            isTrending: post.isFlagged || post.needsAttention || false
          }
          
                 console.log('✅ POST TRANSFORMED:', transformedPost)
                 console.log('🖼️ ORIGINAL POST IMAGE DATA:', {
                   thumbnailUrl: post.thumbnailUrl,
                   imageUrls: post.imageUrls,
                   hasThumbnail: !!post.thumbnailUrl,
                   hasImageUrls: !!(post.imageUrls && post.imageUrls.length > 0)
                 })
                 setPostData(transformedPost)
        } else {
          throw new Error('Post not found in API response')
        }
      } catch (err) {
        console.error('❌ ERROR FETCHING POST:', err)
        const errorMessage = err instanceof Error ? err.message : 'Failed to load post'
        
        // Check if it's a 404 error (post not found)
        if (errorMessage.includes('404') || errorMessage.includes('not found')) {
          setError('This post no longer exists or has been removed.')
        } else {
          setError(errorMessage)
        }
        
        // Enhanced fallback with more realistic data based on postId
        const fallbackPost: PostData = {
          id: postId,
          platform: 'twitter', // Most common platform
    author: {
            name: 'Social Media User',
      avatar: 'S',
            handle: '@socialuser'
    },
          content: `This is a sample post with ID: ${postId}. The actual post data could not be loaded from the server. This might be due to network issues, authentication problems, or the post no longer exists in the database.`,
          timestamp: new Date().toLocaleString(),
    engagement: {
            likes: Math.floor(Math.random() * 100),
            comments: Math.floor(Math.random() * 20),
            shares: Math.floor(Math.random() * 50),
            views: Math.floor(Math.random() * 1000)
          },
          url: '#',
          thumbnailUrl: undefined, // No fallback image
          sentiment: 'neutral',
          isViral: false,
          isTrending: false
        }
        
        console.log('🔄 USING FALLBACK DATA:', fallbackPost)
        console.log('🖼️ FALLBACK IMAGE URL:', fallbackPost.thumbnailUrl)
        setPostData(fallbackPost)
      } finally {
        setLoading(false)
      }
    }

    if (postId) {
      fetchPostData()
    }
  }, [postId, campaignId])

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
          <div className="text-center max-w-md">
            <h2 className="text-xl font-semibold text-foreground mb-2">Post Not Found</h2>
            <p className="text-muted-foreground mb-4">
              {error || 'The requested post could not be found.'}
            </p>
            <div className="space-y-2">
              <Button asChild>
                <Link href="/social-feed">Back to Social Feed</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/analysis-history">View All Campaigns</Link>
              </Button>
            </div>
          </div>
        </div>
      </PageLayout>
    )
  }

  const analysisData = {
    sentiment: { 
      label: postData.sentiment ? postData.sentiment.charAt(0).toUpperCase() + postData.sentiment.slice(1) : 'Neutral', 
      value: postData.sentiment || 'neutral', 
      confidence: 0.85 
    },
    relevance: { score: 38.0, threshold: 70 },
    topics: ['Social Media', 'Public Safety', 'Community'],
    entities: [postData.author.name],
    organizations: [postData.author.name],
    metadata: {
      campaignId: campaignId,
      analysisType: 'social_post',
      timestamp: postData.timestamp,
      processingTime: '2.3s'
    }
  }

  const aiResponse = {
    options: postData.isViral ? [
      "Thank you for sharing this important information. We appreciate your engagement and will continue to monitor developments in this area.",
      "We're grateful for your contribution to this discussion. Your insights help us stay informed about community concerns.",
      "Thank you for bringing this to our attention. We're committed to addressing these issues and appreciate your vigilance."
    ] : postData.isTrending ? [
      "We understand your concerns and are actively working to address these issues. Thank you for bringing this to our attention.",
      "Your feedback is valuable to us. We're reviewing this matter and will provide updates as we work toward a solution.",
      "Thank you for your patience as we investigate this issue. We appreciate your understanding and continued support."
    ] : [
      "Thank you for your post. We value community feedback and are committed to transparency in our operations.",
      "We appreciate you taking the time to share your thoughts. Your input helps us improve our services.",
      "Thank you for engaging with us. We're here to listen and work together toward positive outcomes."
    ],
    timestamp: new Date().toLocaleTimeString(),
    confidence: 0.92
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6 space-y-6">
          {/* Header with Post Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Post Card */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-600 text-white text-lg font-semibold">
                        {postData.author.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate">{postData.author.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {postData.platform}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{postData.timestamp}</span>
                        <span>•</span>
                        <span>{postData.author.handle}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={postData.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {postData.thumbnailUrl && (
                    <div className="mb-4">
                      <div className="relative">
                        <img 
                          src={postData.thumbnailUrl} 
                          alt="Post content" 
                          className="w-full h-auto rounded-lg max-h-96 object-cover border border-gray-200 dark:border-gray-700"
                          onError={(e) => {
                            console.log('🖼️ IMAGE LOAD ERROR:', postData.thumbnailUrl)
                            e.currentTarget.style.display = 'none'
                            // Show a placeholder when image fails
                            const placeholder = document.createElement('div')
                            placeholder.className = 'w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400'
                            placeholder.innerHTML = '<div class="text-center"><svg class="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path></svg><p>Image could not be loaded</p></div>'
                            e.currentTarget.parentNode?.appendChild(placeholder)
                          }}
                          onLoad={() => {
                            console.log('✅ IMAGE LOADED:', postData.thumbnailUrl)
                          }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <p className="text-foreground text-lg leading-relaxed">
                    {postData.content}
                  </p>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-muted-foreground text-sm">
                      <button className="flex items-center gap-2 hover:text-foreground transition-colors">
                        <Heart className="h-4 w-4" />
                        <span>{postData.engagement.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-foreground transition-colors">
                        <MessageCircle className="h-4 w-4" />
                        <span>{postData.engagement.comments}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-foreground transition-colors">
                        <Share2 className="h-4 w-4" />
                        <span>{postData.engagement.shares}</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Eye className="h-4 w-4" />
                      <span>{postData.engagement.views} views</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Sentiment</span>
                    <Badge variant={analysisData.sentiment.value === 'positive' ? 'default' : 'destructive'}>
                      {analysisData.sentiment.label}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Relevance</span>
                      <span className="font-medium">{analysisData.relevance.score}%</span>
                    </div>
                    <Progress value={analysisData.relevance.score} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Topics</span>
                    <span className="text-sm font-medium">{analysisData.topics.length}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    AI Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {aiResponse.options.map((option, index) => (
                      <div 
                        key={index} 
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedReply === index 
                            ? 'bg-primary/10 border-primary/30 ring-2 ring-primary/20' 
                            : 'bg-muted/50 hover:bg-muted/70'
                        }`}
                        onClick={() => setSelectedReply(index)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                            selectedReply === index 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-primary/10 text-primary'
                          }`}>
                            {index + 1}
                          </div>
                          <p className="text-sm text-foreground leading-relaxed flex-1">
                            {option}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-3">
                    <span>Confidence: {(aiResponse.confidence * 100).toFixed(0)}%</span>
                    <span>{aiResponse.timestamp}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Analysis Tabs */}
          <Tabs defaultValue="analysis" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analysis
              </TabsTrigger>
              <TabsTrigger value="comments" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Comments (0)
              </TabsTrigger>
              <TabsTrigger value="engagement" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Engagement
              </TabsTrigger>
              <TabsTrigger value="response" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Response
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analysis" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Topics & Entities */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        Topics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {analysisData.topics.map((topic, index) => (
                          <Badge key={index} variant="secondary">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Named Entities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {analysisData.entities.map((entity, index) => (
                          <Badge key={index} variant="outline" className="border-green-200 text-green-700 dark:border-green-800 dark:text-green-300">
                            {entity}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Organizations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {analysisData.organizations.map((org, index) => (
                          <Badge key={index} variant="outline" className="border-red-200 text-red-700 dark:border-red-800 dark:text-red-300">
                            {org}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Metadata & Summary */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Analysis Metadata
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Campaign ID</span>
                          <p className="font-mono text-xs break-all">{analysisData.metadata.campaignId}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Analysis Type</span>
                          <p className="font-medium">{analysisData.metadata.analysisType}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Timestamp</span>
                          <p className="font-medium">{analysisData.metadata.timestamp}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Processing Time</span>
                          <p className="font-medium">{analysisData.metadata.processingTime}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Post Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                        The post from Safety Net of PA encourages treating everyone nicely throughout the year, 
                        not just during October, which is Bullying Prevention Month. It promotes kindness and 
                        continuous anti-bullying efforts.
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Relevance Score</span>
                        <Badge variant="outline">{analysisData.relevance.score}%</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="comments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Comments
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                      <Button variant="outline" size="sm">
                        <span className="mr-2">+</span>
                        Add Comment
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium text-foreground mb-2">No comments yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Comments will appear here once users start engaging with this post.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="engagement" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Likes</p>
                        <p className="text-2xl font-bold">{postData.engagement.likes}</p>
                      </div>
                      <Heart className="h-8 w-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Comments</p>
                        <p className="text-2xl font-bold">{postData.engagement.comments}</p>
                      </div>
                      <MessageCircle className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Shares</p>
                        <p className="text-2xl font-bold">{postData.engagement.shares}</p>
                      </div>
                      <Share2 className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Views</p>
                        <p className="text-2xl font-bold">{postData.engagement.views}</p>
                      </div>
                      <Eye className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Engagement Timeline</CardTitle>
                  <CardDescription>
                    Track how engagement has evolved over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium text-foreground mb-2">No engagement data yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Engagement metrics will appear here as users interact with the post.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="response" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Suggested replies generated by AI
                    </div>
                    <Button variant="ghost" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        AI Generated
                      </Badge>
                      <span className="text-xs text-muted-foreground">{aiResponse.timestamp}</span>
                    </div>
                    <div className="space-y-3">
                      {aiResponse.options.map((option, index) => (
                        <div 
                          key={index} 
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedReply === index 
                              ? 'bg-primary/10 border-primary/30 ring-2 ring-primary/20' 
                              : 'bg-muted/50 hover:bg-muted/70'
                          }`}
                          onClick={() => setSelectedReply(index)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                              selectedReply === index 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-primary/10 text-primary'
                            }`}>
                              {index + 1}
                            </div>
                            <p className="text-sm text-foreground leading-relaxed flex-1">
                              {option}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">Custom Response</label>
                    <Textarea
                      placeholder="Type your response here..."
                      className="min-h-[120px]"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <span className="mr-2">📎</span>
                          Attach
                        </Button>
                        <Button variant="outline" size="sm">
                          <span className="mr-2">😊</span>
                          Emoji
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(aiResponse.options[selectedReply])
                          }}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Selected Reply
                        </Button>
                        <Button size="sm">
                          Send Response
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  )
}