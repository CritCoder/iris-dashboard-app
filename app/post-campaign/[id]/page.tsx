'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Check, Copy, RefreshCw, MessageCircle, Calendar, Hash, User, Heart, Share2, Eye, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { campaignApi, socialApi } from '@/lib/api'
import Link from 'next/link'

interface Post {
  id: string
  content: string
  platform: string
  platformPostId?: string
  url?: string
  postedAt?: string
  likesCount?: number
  commentsCount?: number
  sharesCount?: number
  viewsCount?: number
  aiSentiment?: string
  aiSummary?: string
  aiRelevanceScore?: number
  social_profile?: {
    username?: string
    displayName?: string
    platform?: string
    isVerified?: boolean
  }
  person?: {
    name?: string
  }
  aiAnalysis?: any
}

interface Comment {
  id: string
  content: string
  platform: string
  postedAt: string
  likesCount?: number
  commentsCount?: number
  aiSentiment?: string
  social_profile?: {
    username?: string
    displayName?: string
    isVerified?: boolean
  }
  person?: {
    name?: string
  }
  url?: string
}

interface AIReply {
  policeResponse: string
  generatedAt: string
}

export default function PostCampaignPage() {
  const params = useParams()
  const router = useRouter()
  const campaignId = params.id as string
  
  const [campaign, setCampaign] = useState<any>(null)
  const [originalPost, setOriginalPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [commentsLoading, setCommentsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // AI Reply states
  const [aiReply, setAiReply] = useState<AIReply | null>(null)
  const [aiReplyLoading, setAiReplyLoading] = useState(false)
  const [aiReplyError, setAiReplyError] = useState<string | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Load campaign data
  const loadCampaignData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Try to load campaign from sessionStorage first (for newly created campaigns)
      const cachedCampaign = sessionStorage.getItem(`campaign_${campaignId}`)
      if (cachedCampaign) {
        try {
          const campaignData = JSON.parse(cachedCampaign)
          setCampaign(campaignData)
          console.log('Loaded campaign from cache:', campaignData)
        } catch (e) {
          console.error('Error parsing cached campaign:', e)
        }
      }

      // Try to load original post from sessionStorage
      const cachedPost = sessionStorage.getItem(`originalPost_${campaignId}`)
      if (cachedPost) {
        try {
          setOriginalPost(JSON.parse(cachedPost))
        } catch (e) {
          console.error('Error parsing cached post:', e)
        }
      }

      // Load campaign details from API
      try {
        const campaignResponse = await campaignApi.getById(campaignId)
        if (campaignResponse.success) {
          const campaignData = campaignResponse.data as any
          setCampaign(campaignData)

          // If campaign has originalPost, use it
          if (campaignData?.originalPost) {
            setOriginalPost(campaignData.originalPost)
          }
        }
      } catch (error: any) {
        // If campaign not found (404), it might still be processing
        if (error.message?.includes('404')) {
          console.log('Campaign not found yet, might be processing')
          // Don't set error if we have cached data
          if (!cachedCampaign) {
            setError('Campaign is still being processed. Please wait...')
            // Retry after 3 seconds
            setTimeout(() => {
              loadCampaignData()
            }, 3000)
          }
        } else {
          throw error
        }
      }

      // Try to fetch original post from API
      try {
        const originalPostResponse = await campaignApi.getOriginalPost(campaignId)
        if (originalPostResponse.success && (originalPostResponse.data as any).found) {
          setOriginalPost((originalPostResponse.data as any).post)
        }
      } catch (error) {
        console.error('Error fetching original post:', error)
        // Don't treat this as a fatal error
      }

    } catch (error) {
      console.error('Error loading campaign data:', error)
      setError((error as Error).message)
    } finally {
      setLoading(false)
    }
  }, [campaignId])

  // Load comments
  const loadComments = useCallback(async (postId: string) => {
    try {
      setCommentsLoading(true)
      const response = await campaignApi.getComments(postId)
      
      if (response.success) {
        const data = response.data as any
        setComments(data.comments || [])
      }
    } catch (error) {
      console.error('Error loading comments:', error)
    } finally {
      setCommentsLoading(false)
    }
  }, [])

  // Generate AI reply
  const generateAiReply = useCallback(async (postId: string) => {
    setAiReplyLoading(true)
    setAiReplyError(null)

    try {
      const response = await socialApi.getPostAIReport(postId)
      
      if (response.success) {
        setAiReply(response.data as AIReply)
      } else {
        throw new Error('Failed to generate AI reply')
      }
    } catch (error) {
      console.error('Error generating AI reply:', error)
      setAiReplyError((error as Error).message)
    } finally {
      setAiReplyLoading(false)
    }
  }, [])

  // Copy reply to clipboard
  const copyReplyToClipboard = useCallback(async () => {
    try {
      const textToCopy = textareaRef.current?.value || aiReply?.policeResponse || ''
      
      if (textToCopy) {
        await navigator.clipboard.writeText(textToCopy)
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      }
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }, [aiReply])

  // Load campaign data on mount
  useEffect(() => {
    loadCampaignData()
  }, [loadCampaignData])

  // Auto-refresh for processing campaigns
  useEffect(() => {
    if (campaign?.status === 'PROCESSING' && !originalPost) {
      const interval = setInterval(() => {
        console.log('Auto-refreshing campaign data...')
        loadCampaignData()
      }, 10000) // Refresh every 10 seconds

      return () => clearInterval(interval)
    }
  }, [campaign?.status, originalPost, loadCampaignData])

  // Load comments when original post is available
  useEffect(() => {
    if (originalPost?.id) {
      loadComments(originalPost.id)
    }
  }, [originalPost?.id, loadComments])

  // Auto-generate AI reply when original post is loaded
  useEffect(() => {
    if (originalPost?.id && !aiReply && !aiReplyLoading) {
      generateAiReply(originalPost.id)
    }
  }, [originalPost?.id, aiReply, aiReplyLoading, generateAiReply])

  // Helper functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num?.toString() || '0'
  }

  const getSentimentColor = (sentiment?: string) => {
    const colors: Record<string, string> = {
      POSITIVE: 'bg-green-500/10 text-green-500 border-green-500/20',
      NEGATIVE: 'bg-red-500/10 text-red-500 border-red-500/20',
      NEUTRAL: 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
    return colors[sentiment || 'NEUTRAL'] || colors.NEUTRAL
  }

  const getSentimentBadgeColor = (sentiment?: string) => {
    const lowerSentiment = sentiment?.toLowerCase()
    if (lowerSentiment === 'positive') return 'default'
    if (lowerSentiment === 'negative') return 'destructive'
    return 'secondary'
  }

  if (loading && !originalPost) {
    return (
      <PageLayout>
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </PageLayout>
    )
  }

  if (error && !originalPost && !campaign) {
    // Check if this is a processing error
    const isProcessing = error.includes('processing') || error.includes('404')

    return (
      <PageLayout>
        <div className="h-screen flex items-center justify-center">
          <div className="text-center max-w-md">
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Campaign Processing</h2>
                <p className="text-muted-foreground mb-2">{campaign?.campaignName || 'Your campaign'} is being processed...</p>
                <p className="text-sm text-muted-foreground mb-4">
                  We're collecting data from {campaign?.platforms?.join(', ') || 'social media platforms'}. This usually takes 4-10 minutes.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => loadCampaignData()} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                  <Button onClick={() => router.back()} variant="ghost">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go Back
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-foreground mb-2">Error Loading Campaign</h2>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => router.back()}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
              </>
            )}
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-border px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-foreground">Post Campaign Analysis</h1>
                {campaign?.status === 'PROCESSING' && (
                  <Badge variant="secondary" className="animate-pulse">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Processing
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {campaign?.campaignName || 'Detailed analysis and comments tracking'}
              </p>
            </div>
            {campaign && (
              <div className="text-right text-sm text-muted-foreground">
                <p>Platforms: {campaign.platforms?.join(', ') || 'N/A'}</p>
                <p className="text-xs">Est. time: {campaign.estimatedProcessingTime || '4-10 minutes'}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Post & Comments */}
          <div className="flex-1 overflow-y-auto border-r border-border">
            <div className="p-6 space-y-6">
              {/* Processing Banner */}
              {campaign?.status === 'PROCESSING' && !originalPost && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mt-0.5"></div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">Campaign is Processing</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        We're actively collecting posts from {campaign.platforms?.join(', ')} about "{campaign.campaignName}".
                        This process typically takes {campaign.estimatedProcessingTime || '4-10 minutes'}.
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => loadCampaignData()}>
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Check Status
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Original Post */}
              {originalPost ? (
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {(originalPost.social_profile?.username?.[0] || originalPost.person?.name?.[0] || 'U').toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">
                          {originalPost.social_profile?.username || originalPost.person?.name || 'Unknown User'}
                        </span>
                        {originalPost.social_profile?.isVerified && (
                          <Badge variant="secondary" className="text-xs">✓ Verified</Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {originalPost.platform}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {originalPost.postedAt && formatDate(originalPost.postedAt)}
                      </div>
                    </div>
                  </div>

                  <p className="text-foreground whitespace-pre-wrap mb-4">
                    {originalPost.content}
                  </p>

                  <div className="flex items-center gap-6 text-sm text-muted-foreground border-t border-border pt-4">
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {formatNumber(originalPost.likesCount || 0)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {formatNumber(originalPost.commentsCount || 0)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Share2 className="w-4 h-4" />
                      {formatNumber(originalPost.sharesCount || 0)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {formatNumber(originalPost.viewsCount || 0)}
                    </span>
                    {originalPost.aiSentiment && (
                      <Badge variant={getSentimentBadgeColor(originalPost.aiSentiment)} className="ml-auto">
                        {originalPost.aiSentiment}
                      </Badge>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-card border border-border rounded-lg p-6 text-center">
                  <p className="text-muted-foreground">Loading post data...</p>
                </div>
              )}

              {/* Comments Section */}
              <div className="bg-card border border-border rounded-lg">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Comments ({comments.length})
                    </h3>
                    {commentsLoading && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        Loading...
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="divide-y divide-border max-h-96 overflow-y-auto">
                  {comments.length > 0 ? (
                    comments.map((comment) => (
                      <div key={comment.id} className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xs font-semibold">
                            {(comment.social_profile?.username?.[0] || comment.person?.name?.[0] || 'U').toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm text-foreground">
                                {comment.social_profile?.username || comment.person?.name || 'Unknown'}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(comment.postedAt)}
                              </span>
                              {comment.aiSentiment && (
                                <Badge variant="outline" className="text-xs ml-auto">
                                  {comment.aiSentiment}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-foreground mb-2">
                              {comment.content}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                {formatNumber(comment.likesCount || 0)}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageCircle className="w-3 h-3" />
                                {formatNumber(comment.commentsCount || 0)}
                              </span>
                              {comment.url && (
                                <a
                                  href={comment.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  View
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                        <MessageCircle className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground mb-1">No comments found yet</p>
                      <p className="text-sm text-muted-foreground">Campaign is processing, comments will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - AI Analysis */}
          <div className="w-96 overflow-y-auto bg-muted/30">
            <div className="p-6 space-y-6">
              {/* AI Summary */}
              {originalPost?.aiSummary && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <h3 className="font-semibold text-sm text-foreground">AI Summary</h3>
                  </div>
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                    <p className="text-sm text-foreground">{originalPost.aiSummary}</p>
                  </div>
                </div>
              )}

              {/* Relevance Score */}
              {originalPost?.aiRelevanceScore !== null && originalPost?.aiRelevanceScore !== undefined && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      Relevance: {((originalPost.aiRelevanceScore || 0) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={(originalPost.aiRelevanceScore || 0) * 100} className="h-2" />
                </div>
              )}

              {/* AI Quick Reply */}
              <div className="border-t border-border pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <h3 className="font-semibold text-sm text-foreground">AI Quick Reply</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => originalPost && generateAiReply(originalPost.id)}
                    disabled={aiReplyLoading}
                  >
                    <RefreshCw className={`w-3 h-3 mr-1 ${aiReplyLoading ? 'animate-spin' : ''}`} />
                    Regenerate
                  </Button>
                </div>

                {aiReplyLoading ? (
                  <div className="bg-card border border-border rounded-lg p-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Generating AI reply...</p>
                  </div>
                ) : aiReplyError ? (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <p className="text-sm text-destructive">{aiReplyError}</p>
                  </div>
                ) : aiReply ? (
                  <>
                    <div className="bg-card border border-border rounded-lg p-4">
                      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                        {aiReply.policeResponse}
                      </p>
                    </div>
                    <textarea
                      ref={textareaRef}
                      className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Edit the AI response or type your own reply..."
                      rows={4}
                      defaultValue={aiReply.policeResponse}
                    />
                  </>
                ) : originalPost ? (
                  <textarea
                    ref={textareaRef}
                    className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Type your reply here..."
                    rows={4}
                  />
                ) : null}

                <Button
                  onClick={copyReplyToClipboard}
                  className="w-full"
                  variant={copySuccess ? "default" : "outline"}
                  disabled={!aiReply && !textareaRef.current?.value}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copySuccess ? "Copied!" : "Copy Reply"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

