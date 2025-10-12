'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Check, Copy, RefreshCw, MessageCircle, Calendar, Hash, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

interface Post {
  id: string
  title: string
  content: string
  author: string
  platform: string
  timestamp: string
  imageUrl?: string
  comments: Comment[]
  analysis: PostAnalysis
}

interface Comment {
  id: string
  author: string
  content: string
  timestamp: string
  likes: number
}

interface PostAnalysis {
  summary: string
  relevance: number
  sentiment: 'positive' | 'negative' | 'neutral'
  topics: string[]
  campaignId: string
  analysisType: string
  timestamp: string
  aiResponse: string
}

export default function PostCampaignPage() {
  const params = useParams()
  const postId = params.id as string
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Simulate API call to fetch post data
    const fetchPost = async () => {
      setLoading(true)
      // Mock data based on the image
      const mockPost: Post = {
        id: postId,
        title: "Gulbarga Weather Today, Gulbarga Temperature Hourly and...",
        content: "10 hours ago ... Headlines Sports News Business Newsindia NewsWorld NewsBollywood NewsHealth+ TipsIndian TV Shows Technology Travel Etimes Health & FitnessDelhi Gold Rate Today.",
        author: "India-News",
        platform: "News-Article",
        timestamp: "7 hours ago",
        imageUrl: "/placeholder.svg",
        comments: [],
        analysis: {
          summary: "Fallback analysis for india-news post from News-Article",
          relevance: 50.0,
          sentiment: "neutral",
          topics: [],
          campaignId: "",
          analysisType: "social_post",
          timestamp: "Invalid Date Invalid Date",
          aiResponse: "This post does not require a response from BirCityPolice. It appears to be an automated news feed or a general news aggregation post with no specific concerns, questions, or actionable information relevant to law enforcement."
        }
      }
      
      setTimeout(() => {
        setPost(mockPost)
        setLoading(false)
      }, 1000)
    }

    fetchPost()
  }, [postId])

  const handleCopyReply = async () => {
    if (post?.analysis.aiResponse) {
      try {
        await navigator.clipboard.writeText(post.analysis.aiResponse)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy text: ', err)
      }
    }
  }

  const handleRegenerate = () => {
    // Simulate regenerating AI response
    if (post) {
      const updatedPost = {
        ...post,
        analysis: {
          ...post.analysis,
          aiResponse: "This is a regenerated AI response. The post appears to be a general news update about weather conditions in Gulbarga and does not require any specific law enforcement response or action."
        }
      }
      setPost(updatedPost)
    }
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </PageLayout>
    )
  }

  if (!post) {
    return (
      <PageLayout>
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Post Not Found</h2>
            <p className="text-muted-foreground">The requested post could not be found.</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="h-screen flex flex-col overflow-hidden">
        <PageHeader
          title="Post Analysis"
          description="Detailed analysis of individual post"
        />

        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Post Details */}
          <div className="flex-1 overflow-y-auto border-r border-border">
            <div className="p-6">
              {/* Post Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {post.platform}
                  </Badge>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{post.timestamp}</span>
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-4">{post.title}</h1>
              </div>

              {/* Post Image */}
              <div className="mb-6">
                <div className="w-full h-48 bg-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">TOI</span>
                </div>
              </div>

              {/* Post Content */}
              <div className="mb-6">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>

              {/* Comments Section */}
              <div className="border-t border-border pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <MessageCircle className="w-5 h-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold text-foreground">Comments (0)</h3>
                </div>
                
                <div className="bg-muted/50 border border-border rounded-lg p-6 text-center">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-1">No comments found yet</p>
                  <p className="text-sm text-muted-foreground">Campaign may still be starting up</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - AI Analysis */}
          <div className="w-96 overflow-y-auto bg-muted/30">
            <div className="p-6">
              {/* AI Analysis Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Check className="w-5 h-5 text-green-500" />
                  <h2 className="text-lg font-semibold text-foreground">AI Analysis</h2>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-foreground">Original Post Summary</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{post.analysis.summary}</p>
                </div>
              </div>

              {/* Relevance Score */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Relevance: {post.analysis.relevance}%</span>
                </div>
                <Progress value={post.analysis.relevance} className="h-2" />
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={post.analysis.sentiment === 'positive' ? 'default' : post.analysis.sentiment === 'negative' ? 'destructive' : 'secondary'}>
                    {post.analysis.sentiment}
                  </Badge>
                </div>
              </div>

              {/* Topics */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-foreground mb-2">Topics</h3>
                <div className="text-sm text-muted-foreground">
                  {post.analysis.topics.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {post.analysis.topics.map((topic, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span>No topics identified</span>
                  )}
                </div>
              </div>

              {/* Analysis Metadata */}
              <div className="mb-6 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Hash className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Campaign ID:</span>
                  <span className="text-foreground">{post.analysis.campaignId || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Analysis Type:</span>
                  <span className="text-foreground">{post.analysis.analysisType}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Timestamp:</span>
                  <span className="text-foreground">{post.analysis.timestamp}</span>
                </div>
              </div>

              {/* AI Quick Reply */}
              <div className="border-t border-border pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Check className="w-5 h-5 text-green-500" />
                  <h3 className="text-lg font-semibold text-foreground">AI Quick Reply</h3>
                </div>
                
                <div className="mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRegenerate}
                    className="mb-3"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate
                  </Button>
                </div>

                <div className="bg-card border border-border rounded-lg p-4 mb-4">
                  <p className="text-sm text-foreground leading-relaxed">
                    {post.analysis.aiResponse}
                  </p>
                </div>

                <Button
                  onClick={handleCopyReply}
                  className="w-full"
                  variant={copied ? "default" : "outline"}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? "Copied!" : "Copy Reply"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}





