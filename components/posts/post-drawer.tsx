'use client'

import { useEffect, useState } from 'react'
import { X, Heart, MessageCircle, Share2, Eye, ExternalLink, Copy, RefreshCw, BarChart3, Users, TrendingUp, AlertTriangle, Clock, MapPin, Hash, Calendar, Loader2 } from 'lucide-react'
import { FacebookIcon, InstagramIcon, TwitterIcon } from '@/components/ui/platform-icons'
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useMobile } from '@/hooks/use-mobile'
import { api } from '@/lib/api'
import { convertToPostCardFormat } from '@/lib/utils'

interface PostDrawerProps {
  postId: string | null
  isOpen: boolean
  onClose: () => void
}

interface PostData {
  id: string
  author: string
  platform: 'facebook' | 'twitter' | 'instagram' | 'youtube' | 'news' | 'india-news'
  content: string
  timestamp: string
  likes: number
  comments: number
  shares: number
  views: number
  sentiment: 'positive' | 'negative' | 'neutral'
  url?: string
  thumbnailUrl?: string
  authorAvatar?: string
  media?: Array<{
    type: 'image' | 'video'
    url: string
    thumbnail?: string
  }>
}

export function PostDrawer({ postId, isOpen, onClose }: PostDrawerProps) {
  const [post, setPost] = useState<PostData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isMobile = useMobile()

  // Fetch post data when drawer opens
  useEffect(() => {
    if (isOpen && postId) {
      fetchPostData()
    }
  }, [isOpen, postId])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when drawer is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const fetchPostData = async () => {
    if (!postId) return

    setLoading(true)
    setError(null)

    try {
      const response = await api.social.getPostById(postId)
      
      if (response.success && response.data) {
        const postData = convertToPostCardFormat(response.data)
        setPost(postData)
      } else {
        setError(response.message || 'Failed to fetch post')
      }
    } catch (err) {
      console.error('Failed to fetch post:', err)
      setError('Failed to fetch post')
    } finally {
      setLoading(false)
    }
  }

  const platformIcons = {
    facebook: FacebookIcon,
    twitter: TwitterIcon,
    instagram: InstagramIcon
  }

  const sentimentColors = {
    positive: 'border-green-500/30 bg-green-500/5',
    negative: 'border-red-500/30 bg-red-500/5',
    neutral: 'border-yellow-500/30 bg-yellow-500/5'
  }

  const IconComponent = platformIcons[post?.platform || 'twitter'] || TwitterIcon

  if (!isOpen) return null

  return (
    <div className={`fixed inset-0 z-50 flex ${isMobile ? 'items-end justify-center' : 'items-center justify-center'} p-4`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full bg-background shadow-2xl transform transition-all duration-300 ease-out ${
        isMobile 
          ? 'max-w-full max-h-[90vh] rounded-t-2xl' 
          : 'max-w-4xl max-h-[85vh] rounded-2xl'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Post Details</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className={`overflow-y-auto ${isMobile ? 'max-h-[calc(90vh-4rem)]' : 'max-h-[calc(85vh-4rem)]'}`}>
          {loading ? (
            <div className="p-8 flex items-center justify-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading post...</span>
              </div>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              <h1 className="text-2xl font-bold text-destructive mb-2">Post Not Found</h1>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchPostData} variant="outline">
                Try Again
              </Button>
            </div>
          ) : post ? (
            <div className="p-4 sm:p-6">
              {/* Author Info */}
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {post.author.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg sm:text-xl font-semibold truncate">{post.author}</h1>
                  <p className="text-sm text-muted-foreground truncate">@{post.author.toLowerCase().replace(/\s+/g, '')}</p>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <Badge variant="outline" className="text-xs">{post.platform}</Badge>
                  <Badge
                    variant={post.sentiment === 'positive' ? 'default' : post.sentiment === 'negative' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {post.sentiment}
                  </Badge>
                </div>
              </div>

              {/* Main Content */}
              <div className={`${isMobile ? 'space-y-4' : 'grid grid-cols-1 lg:grid-cols-3 gap-6'}`}>
                {/* Post Content */}
                <div className={isMobile ? '' : 'lg:col-span-2'}>
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {new Date(post.timestamp).toLocaleString()}
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
                        <p className="text-foreground leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
                          {post.content}
                        </p>
                        
                        {/* Media */}
                        {post.media && post.media.length > 0 && (
                          <div className="space-y-2">
                            {post.media.map((item, index) => (
                              <div key={index} className="rounded-lg overflow-hidden">
                                {item.type === 'image' ? (
                                  <img 
                                    src={item.url} 
                                    alt="Post media" 
                                    className="w-full h-auto max-h-64 sm:max-h-96 object-cover"
                                  />
                                ) : (
                                  <video 
                                    src={item.url} 
                                    controls 
                                    className="w-full h-auto max-h-64 sm:max-h-96"
                                    poster={item.thumbnail}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* External Link */}
                        {post.url && (
                          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                            <a 
                              href={post.url} 
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
                  <Card className="mt-4 sm:mt-6">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base sm:text-lg">Engagement Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                            <span className="text-lg sm:text-2xl font-bold">{post.likes.toLocaleString()}</span>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground">Likes</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                            <span className="text-lg sm:text-2xl font-bold">{post.comments.toLocaleString()}</span>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground">Comments</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                            <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                            <span className="text-lg sm:text-2xl font-bold">{post.shares.toLocaleString()}</span>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground">Shares</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                            <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                            <span className="text-lg sm:text-2xl font-bold">{post.views.toLocaleString()}</span>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground">Views</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar - Only show on desktop */}
                {!isMobile && (
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
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Hash className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">ID:</span>
                          <code className="bg-muted px-2 py-1 rounded text-xs">{post.id}</code>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Date:</span>
                          <span>{new Date(post.timestamp).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Platform:</span>
                          <Badge variant="outline">{post.platform}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
