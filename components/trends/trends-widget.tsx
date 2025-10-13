'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCampaignTrends } from '@/hooks/use-campaign-trends'
import { TrendingUp, TrendingDown, Activity, MessageCircle, Heart, Share2 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

interface TrendsWidgetProps {
  campaignId: string
  timeRange?: string
  granularity?: string
}

export function TrendsWidget({ campaignId, timeRange = '24h', granularity = 'hour' }: TrendsWidgetProps) {
  const { data, loading, error } = useCampaignTrends({ campaignId, timeRange, granularity })

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Campaign Trends
          </h4>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-center text-muted-foreground">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-xs">Loading trends...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Campaign Trends
          </h4>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            <p className="text-xs">Failed to load trends</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data) return null

  const trends = data.trends.hourly
  const totalPosts = trends.reduce((sum, trend) => sum + trend.posts, 0)
  const totalEngagement = trends.reduce((sum, trend) => sum + trend.engagement, 0)
  const totalLikes = trends.reduce((sum, trend) => sum + trend.likes, 0)
  const totalShares = trends.reduce((sum, trend) => sum + trend.shares, 0)

  // Calculate sentiment distribution
  const sentimentTotals = trends.reduce((acc, trend) => {
    acc.POSITIVE += trend.sentiments.POSITIVE
    acc.NEGATIVE += trend.sentiments.NEGATIVE
    acc.NEUTRAL += trend.sentiments.NEUTRAL
    acc.MIXED += trend.sentiments.MIXED
    return acc
  }, { POSITIVE: 0, NEGATIVE: 0, NEUTRAL: 0, MIXED: 0 })

  // Prepare chart data
  const chartData = trends.map(trend => ({
    time: new Date(trend.timestamp).getHours() + ':00',
    posts: trend.posts,
    engagement: trend.engagement,
    likes: trend.likes,
    shares: trend.shares
  }))

  // Calculate trend direction
  const recentTrends = trends.slice(-3)
  const earlierTrends = trends.slice(-6, -3)
  const recentAvg = recentTrends.reduce((sum, t) => sum + t.posts, 0) / recentTrends.length
  const earlierAvg = earlierTrends.reduce((sum, t) => sum + t.posts, 0) / earlierTrends.length
  const isUpTrend = recentAvg > earlierAvg

  return (
    <div className="space-y-4">
      {/* Overview Stats */}
      <Card>
        <CardHeader className="pb-3">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Campaign Trends
            <Badge variant="outline" className="text-xs ml-auto">
              {timeRange}
            </Badge>
          </h4>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Total Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-purple-500 dark:text-purple-400 flex items-center justify-center gap-1">
                {totalPosts}
                {isUpTrend ? (
                  <TrendingUp className="w-3 h-3 text-green-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                )}
              </div>
              <div className="text-xs text-muted-foreground">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">{totalEngagement}</div>
              <div className="text-xs text-muted-foreground">Engagement</div>
            </div>
          </div>

          {/* Mini Chart */}
          <div className="h-20">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="time" hide />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    fontSize: '12px',
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="posts"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Sentiment Distribution */}
      <Card>
        <CardHeader className="pb-3">
          <h4 className="text-sm font-semibold text-foreground">Sentiment Distribution</h4>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(sentimentTotals).map(([sentiment, count]) => {
              const percentage = totalPosts > 0 ? Math.round((count / totalPosts) * 100) : 0
              const color = sentiment === 'POSITIVE' ? 'text-green-500' :
                           sentiment === 'NEGATIVE' ? 'text-red-500' :
                           sentiment === 'MIXED' ? 'text-yellow-500' : 'text-gray-500'

              if (count === 0) return null

              return (
                <div key={sentiment} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      sentiment === 'POSITIVE' ? 'bg-green-500' :
                      sentiment === 'NEGATIVE' ? 'bg-red-500' :
                      sentiment === 'MIXED' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`} />
                    <span className="text-xs text-muted-foreground capitalize">{sentiment.toLowerCase()}</span>
                  </div>
                  <span className={`text-sm font-bold ${color}`}>{percentage}%</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-3">
          <h4 className="text-sm font-semibold text-foreground">Recent Activity</h4>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trends.slice(-3).reverse().map((trend, index) => (
              <div key={trend.timestamp} className="flex items-center justify-between text-xs">
                <div className="text-muted-foreground">
                  {new Date(trend.timestamp).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    hour12: true
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" /> {trend.posts}
                  </span>
                  <span className="flex items-center gap-1 text-pink-500">
                    <Heart className="w-3 h-3" /> {trend.likes}
                  </span>
                  <span className="flex items-center gap-1 text-green-500">
                    <Share2 className="w-3 h-3" /> {trend.shares}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}