'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Heart,
  Share2,
  Eye,
  Users,
  BarChart3,
  RefreshCw,
  Sparkles,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

interface Campaign {
  id: string
  name: string
  metrics: {
    totalPosts: number
    totalEngagement: number
    totalLikes: number
    totalShares: number
    totalComments: number
    totalViews: number
  }
}

interface Post {
  id: string
  content: string
  sentiment: 'positive' | 'negative' | 'neutral'
  platform: string
  likes: number
  shares: number
  comments: number
  views: number
  timestamp: string
}

interface AISummaryCardProps {
  campaign: Campaign | null
  posts: Post[]
  loading?: boolean
}

function generateAISummary(campaign: Campaign | null, posts: Post[]): string {
  if (!campaign || posts.length === 0) {
    return "No activity data available for analysis. Start monitoring to generate insights."
  }

  const { metrics } = campaign

  // Analyze sentiment distribution
  const sentimentCounts = posts.reduce((acc, post) => {
    acc[post.sentiment] = (acc[post.sentiment] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const totalPosts = posts.length
  const positivePercent = Math.round((sentimentCounts.positive || 0) / totalPosts * 100)
  const negativePercent = Math.round((sentimentCounts.negative || 0) / totalPosts * 100)
  const neutralPercent = Math.round((sentimentCounts.neutral || 0) / totalPosts * 100)

  // Platform analysis
  const platformCounts = posts.reduce((acc, post) => {
    acc[post.platform] = (acc[post.platform] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topPlatform = Object.entries(platformCounts).sort((a, b) => b[1] - a[1])[0]

  // Engagement analysis
  const avgEngagement = Math.round((metrics.totalLikes + metrics.totalShares + metrics.totalComments) / totalPosts)
  const highEngagementPosts = posts.filter(p => (p.likes + p.shares + p.comments) > avgEngagement * 2).length

  // Recent activity (last 24h simulation)
  const recentPosts = posts.slice(0, Math.floor(totalPosts * 0.3)) // Simulate recent 30%
  const recentEngagement = recentPosts.reduce((sum, p) => sum + p.likes + p.shares + p.comments, 0)

  // Generate summary based on analysis
  let summary = `Campaign "${campaign.name}" shows `

  if (positivePercent > 60) {
    summary += `strong positive sentiment (${positivePercent}%) across ${totalPosts} posts. `
  } else if (negativePercent > 40) {
    summary += `concerning negative sentiment (${negativePercent}%) that requires attention. `
  } else {
    summary += `mixed sentiment with ${positivePercent}% positive, ${negativePercent}% negative content. `
  }

  summary += `Most activity is on ${topPlatform[0]} (${topPlatform[1]} posts). `

  if (metrics.totalEngagement > 10000) {
    summary += `High engagement levels with ${(metrics.totalEngagement / 1000).toFixed(1)}K total interactions. `
  } else if (metrics.totalEngagement > 1000) {
    summary += `Moderate engagement with ${metrics.totalEngagement.toLocaleString()} interactions. `
  } else {
    summary += `Limited engagement suggesting content needs optimization. `
  }

  if (highEngagementPosts > totalPosts * 0.2) {
    summary += `${highEngagementPosts} posts show viral potential. `
  }

  // Add recommendation
  if (negativePercent > 50) {
    summary += "⚠️ Immediate attention needed for reputation management."
  } else if (positivePercent > 70) {
    summary += "✅ Strong positive momentum - consider amplifying successful content."
  } else {
    summary += "📊 Balanced activity - monitor for emerging trends."
  }

  return summary
}

export function AISummaryCard({ campaign, posts, loading = false }: AISummaryCardProps) {
  const [aiSummary, setAiSummary] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (campaign && posts.length > 0) {
      setIsGenerating(true)
      // Simulate AI generation delay
      const timer = setTimeout(() => {
        const summary = generateAISummary(campaign, posts)
        setAiSummary(summary)
        setIsGenerating(false)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [campaign, posts])

  const regenerateSummary = () => {
    if (campaign && posts.length > 0) {
      setIsGenerating(true)
      setTimeout(() => {
        const summary = generateAISummary(campaign, posts)
        setAiSummary(summary)
        setIsGenerating(false)
      }, 1000)
    }
  }

  if (loading || !campaign) {
    return (
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-muted animate-pulse rounded"></div>
              <div className="w-32 h-5 bg-muted animate-pulse rounded"></div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="w-full h-4 bg-muted animate-pulse rounded"></div>
            <div className="w-3/4 h-4 bg-muted animate-pulse rounded"></div>
            <div className="grid grid-cols-4 gap-4 mt-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-8 bg-muted animate-pulse rounded mb-2 mx-auto"></div>
                  <div className="w-12 h-3 bg-muted animate-pulse rounded mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate additional metrics
  const sentimentCounts = posts.reduce((acc, post) => {
    acc[post.sentiment] = (acc[post.sentiment] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const sentimentColor =
    (sentimentCounts.positive || 0) > (sentimentCounts.negative || 0) ? 'text-green-600' :
    (sentimentCounts.negative || 0) > (sentimentCounts.positive || 0) ? 'text-red-600' : 'text-orange-600'

  return (
    <Card className="mb-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-lg">AI Campaign Summary</CardTitle>
            <Badge variant="secondary" className="text-xs">
              Live Analysis
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={regenerateSummary}
            disabled={isGenerating}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <CardDescription>
          AI-powered insights and key metrics for {campaign?.name}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg border">
            <div className="text-2xl font-bold text-purple-600">
              {campaign.metrics.totalPosts.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <BarChart3 className="w-3 h-3" />
              POSTS
            </div>
          </div>

          <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg border">
            <div className="text-2xl font-bold text-green-600">
              {campaign.metrics.totalEngagement > 1000
                ? `${(campaign.metrics.totalEngagement / 1000).toFixed(1)}K`
                : campaign.metrics.totalEngagement.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <TrendingUp className="w-3 h-3" />
              ENGAGE
            </div>
          </div>

          <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg border">
            <div className="text-2xl font-bold text-pink-600">
              {campaign.metrics.totalLikes > 1000
                ? `${(campaign.metrics.totalLikes / 1000).toFixed(1)}K`
                : campaign.metrics.totalLikes.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Heart className="w-3 h-3" />
              LIKES
            </div>
          </div>

          <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg border">
            <div className="text-2xl font-bold text-blue-600">
              {campaign.metrics.totalShares.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Share2 className="w-3 h-3" />
              SHARES
            </div>
          </div>
        </div>

        {/* AI Summary */}
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-4 border">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <span>Smart Analysis</span>
                {isGenerating && <RefreshCw className="w-3 h-3 animate-spin" />}
              </h4>
              {isGenerating ? (
                <div className="space-y-2">
                  <div className="w-full h-3 bg-muted animate-pulse rounded"></div>
                  <div className="w-4/5 h-3 bg-muted animate-pulse rounded"></div>
                  <div className="w-3/5 h-3 bg-muted animate-pulse rounded"></div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {aiSummary}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${sentimentColor.replace('text-', 'bg-')}`}></div>
              Sentiment: {(sentimentCounts.positive || 0) > (sentimentCounts.negative || 0) ? 'Positive' :
                         (sentimentCounts.negative || 0) > (sentimentCounts.positive || 0) ? 'Negative' : 'Mixed'}
            </span>
            <span>{posts.length} posts analyzed</span>
          </div>
          <span className="text-xs opacity-60">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}