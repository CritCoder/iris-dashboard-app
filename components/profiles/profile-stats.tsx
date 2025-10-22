'use client'

import { useMemo } from 'react'
import { Heart, MessageCircle, Share2, Eye, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ProfileStatsProps {
  profile: any
  posts: any[]
  stats?: any
}

export function ProfileStats({ profile, posts, stats }: ProfileStatsProps) {
  // Calculate statistics from posts
  const calculatedStats = useMemo(() => {
    if (!posts || posts.length === 0) {
      return {
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0,
        totalViews: 0,
        avgLikes: 0,
        avgComments: 0,
        avgShares: 0,
        sentimentDistribution: { positive: 0, negative: 0, neutral: 0 },
      }
    }

    const totalLikes = posts.reduce((sum, post) => sum + (post.likesCount || 0), 0)
    const totalComments = posts.reduce((sum, post) => sum + (post.commentsCount || 0), 0)
    const totalShares = posts.reduce((sum, post) => sum + (post.sharesCount || 0), 0)
    const totalViews = posts.reduce((sum, post) => sum + (post.viewsCount || 0), 0)

    const sentimentDistribution = posts.reduce(
      (acc, post) => {
        const sentiment = (post.aiSentiment || '').toLowerCase()
        if (sentiment === 'positive') acc.positive++
        else if (sentiment === 'negative') acc.negative++
        else acc.neutral++
        return acc
      },
      { positive: 0, negative: 0, neutral: 0 }
    )

    return {
      totalLikes,
      totalComments,
      totalShares,
      totalViews,
      avgLikes: Math.round(totalLikes / posts.length),
      avgComments: Math.round(totalComments / posts.length),
      avgShares: Math.round(totalShares / posts.length),
      sentimentDistribution,
    }
  }, [posts])

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 bg-muted/20">
      {/* Profile Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Profile Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Total Posts</span>
            <span className="text-sm font-bold text-foreground">
              {formatNumber(profile.postCount || profile.posts || posts.length)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Loaded Posts</span>
            <span className="text-sm font-bold text-foreground">{posts.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Platform</span>
            <Badge variant="outline" className="text-xs capitalize">
              {profile.platform || 'Unknown'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Engagement Statistics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Engagement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-3 h-3 text-red-500" />
                <span className="text-xs text-muted-foreground">Total Likes</span>
              </div>
              <span className="text-sm font-bold text-foreground">
                {formatNumber(calculatedStats.totalLikes)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-3 h-3 text-blue-500" />
                <span className="text-xs text-muted-foreground">Total Comments</span>
              </div>
              <span className="text-sm font-bold text-foreground">
                {formatNumber(calculatedStats.totalComments)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-3 h-3 text-green-500" />
                <span className="text-xs text-muted-foreground">Total Shares</span>
              </div>
              <span className="text-sm font-bold text-foreground">
                {formatNumber(calculatedStats.totalShares)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-3 h-3 text-purple-500" />
                <span className="text-xs text-muted-foreground">Total Views</span>
              </div>
              <span className="text-sm font-bold text-foreground">
                {formatNumber(calculatedStats.totalViews)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Average Engagement */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Average per Post
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Avg. Likes</span>
            <span className="text-sm font-bold text-foreground">
              {formatNumber(calculatedStats.avgLikes)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Avg. Comments</span>
            <span className="text-sm font-bold text-foreground">
              {formatNumber(calculatedStats.avgComments)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Avg. Shares</span>
            <span className="text-sm font-bold text-foreground">
              {formatNumber(calculatedStats.avgShares)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Sentiment Distribution */}
      {posts.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Sentiment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Positive</span>
                <Badge variant="default" className="bg-green-500/20 text-green-600 dark:text-green-400 hover:bg-green-500/30">
                  {calculatedStats.sentimentDistribution.positive}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Negative</span>
                <Badge variant="default" className="bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/30">
                  {calculatedStats.sentimentDistribution.negative}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Neutral</span>
                <Badge variant="default" className="bg-gray-500/20 text-gray-600 dark:text-gray-400 hover:bg-gray-500/30">
                  {calculatedStats.sentimentDistribution.neutral}
                </Badge>
              </div>
            </div>

            {/* Visual sentiment bar */}
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden flex">
              <div
                className="bg-green-500 h-full"
                style={{
                  width: `${
                    (calculatedStats.sentimentDistribution.positive / posts.length) * 100
                  }%`,
                }}
              />
              <div
                className="bg-red-500 h-full"
                style={{
                  width: `${
                    (calculatedStats.sentimentDistribution.negative / posts.length) * 100
                  }%`,
                }}
              />
              <div
                className="bg-gray-500 h-full"
                style={{
                  width: `${
                    (calculatedStats.sentimentDistribution.neutral / posts.length) * 100
                  }%`,
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Account Info */}
      {profile.accountType && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Account Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Type</span>
              <Badge variant="outline" className="text-xs capitalize">
                {profile.accountType}
              </Badge>
            </div>
            {profile.isVerified && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Verified</span>
                <Badge variant="default" className="text-xs bg-blue-500/20 text-blue-600 dark:text-blue-400">
                  Yes
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

