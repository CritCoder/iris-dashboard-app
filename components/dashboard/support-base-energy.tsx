import { Zap, Hash, BarChart3, Users, Loader2, AlertCircle } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'

// No static data - use only real API data

interface AmplifierCardProps {
  avatar: string
  name: string
  handle: string
  score: string | number | {
    totalEngagement?: number
    averageEngagement?: number
    amplificationScore?: number
  }
  followers: string | number
  posts: string | number
  engagement: string | number | {
    totalEngagement?: number
    averageEngagement?: number
    amplificationScore?: number
  }
}

function AmplifierCard({ avatar, name, handle, score, followers, posts, engagement }: AmplifierCardProps) {
  // Format score for display
  const formatScore = (val: AmplifierCardProps['score']): string => {
    if (typeof val === 'string') return val
    if (typeof val === 'number') return val.toFixed(1)
    if (typeof val === 'object' && val !== null) {
      if ('amplificationScore' in val && typeof val.amplificationScore === 'number') {
        return val.amplificationScore.toFixed(1)
      }
      if ('totalEngagement' in val && typeof val.totalEngagement === 'number') {
        return val.totalEngagement.toLocaleString()
      }
    }
    return 'N/A'
  }

  // Format engagement for display
  const formatEngagement = (eng: AmplifierCardProps['engagement']): string => {
    if (typeof eng === 'string') return eng
    if (typeof eng === 'number') return eng.toFixed(1) + '%'
    if (typeof eng === 'object' && eng !== null) {
      if ('averageEngagement' in eng && typeof eng.averageEngagement === 'number') {
        return eng.averageEngagement.toFixed(1) + '%'
      }
      if ('totalEngagement' in eng && typeof eng.totalEngagement === 'number') {
        return eng.totalEngagement.toLocaleString()
      }
      if ('amplificationScore' in eng && typeof eng.amplificationScore === 'number') {
        return eng.amplificationScore.toFixed(1)
      }
    }
    return 'N/A'
  }

  const formatNumber = (val: string | number): string => {
    if (typeof val === 'number') return val.toLocaleString()
    if (typeof val === 'string') return val
    return 'N/A'
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 card-hover pressable">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground text-sm font-semibold">
          {avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-foreground font-medium text-sm truncate">{name}</div>
          <div className="text-muted-foreground text-xs truncate">{handle}</div>
        </div>
        <div className="text-xs text-muted-foreground font-medium">Score {formatScore(score)}</div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-sm font-semibold text-foreground">{formatNumber(followers)}</div>
          <div className="text-xs text-muted-foreground">Followers</div>
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">{formatNumber(posts)}</div>
          <div className="text-xs text-muted-foreground">Posts</div>
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">{formatEngagement(engagement)}</div>
          <div className="text-xs text-muted-foreground">Engagement</div>
        </div>
      </div>
    </div>
  )
}

interface SupportBaseEnergyProps {
  data?: any
  loading?: boolean
  error?: string | null
  campaignId?: string
  campaignName?: string
}

export function SupportBaseEnergy({ data, loading, error, campaignId, campaignName }: SupportBaseEnergyProps = {}) {
  // Transform API data only - no fallbacks
  const amplifiers = data?.amplifiers ? data.amplifiers.slice(0, 4).map((amp: any) => ({
    avatar: amp.displayName?.substring(0, 2).toUpperCase() || amp.username?.substring(0, 2).toUpperCase() || '??',
    name: amp.displayName || amp.username || 'Unknown',
    handle: `@${amp.username || 'unknown'}`,
    score: amp.engagement?.amplificationScore || amp.engagement?.totalEngagement || 'N/A',
    followers: amp.followers || 'N/A',
    posts: amp.totalPosts || 'N/A',
    engagement: amp.engagement || 'N/A'
  })) : []
  
  const hashtagsTracked = data?.trendingTopics?.length || 0
  const totalMentions = data?.totalMentions || 0
  
  // Generate insights from API data only
  const insights = data?.trendingTopics ? [
    {
      type: 'hashtag',
      text: `${data.trendingTopics[0]?.topic || 'Top topic'} trending with ${data.trendingTopics[0]?.engagement?.totalEngagement || 0} mentions`
    },
    {
      type: 'platform',
      text: `${amplifiers.length} active amplifiers tracked`
    },
    {
      type: 'user',
      text: `${totalMentions} total mentions across platforms`
    }
  ] : []

  return (
    <div className="bg-card border border-border rounded-lg p-6 list-animate-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-1">
            Support Base Energy
            {campaignName && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                for {campaignName}
              </span>
            )}
          </h2>
          <p className="text-sm text-muted-foreground">
            {loading ? 'Loading...' : data ? `${hashtagsTracked} hashtags tracked · ${amplifiers.length} amplifiers · ${totalMentions} total mentions` : 'No data available'}
          </p>
        </div>
        {loading ? (
          <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
        ) : (
          <Zap className="w-5 h-5 text-muted-foreground" />
        )}
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="mb-4">
          <Skeleton className="h-4 w-32 mb-3" />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2].map((i) => (
              <div key={i} className="p-4 border border-border rounded-lg space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : amplifiers.length > 0 ? (
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Top Amplifiers ({amplifiers.length} total)</h3>
          <div className="grid grid-cols-2 gap-3">
            {amplifiers.map((amplifier: any, index: number) => (
              <AmplifierCard
                key={index}
                avatar={amplifier.avatar}
                name={amplifier.name}
                handle={amplifier.handle}
                score={amplifier.score}
                followers={amplifier.followers}
                posts={amplifier.posts}
                engagement={amplifier.engagement}
              />
            ))}
          </div>
        </div>
      ) : !loading && !data ? (
        <div className="mb-4 text-center py-8">
          <div className="text-muted-foreground">
            <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No support base data available</p>
            <p className="text-xs text-muted-foreground mt-1">Data will appear when amplifiers are detected</p>
          </div>
        </div>
      ) : null}

      <div className="pt-4 border-t border-border">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Insights</h3>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ) : insights.length > 0 ? (
          <div className="space-y-2 text-xs text-muted-foreground">
            {insights.map((insight: any, index: number) => (
              <div key={index} className="flex items-start gap-2">
                {insight.type === 'hashtag' && <Hash className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />}
                {insight.type === 'platform' && <BarChart3 className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />}
                {insight.type === 'user' && <Users className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />}
                <span>{insight.text}</span>
              </div>
            ))}
          </div>
        ) : !loading && !data ? (
          <div className="text-xs text-muted-foreground text-center py-4">
            <BarChart3 className="w-4 h-4 mx-auto mb-1 opacity-50" />
            <p>No insights available</p>
            <p className="text-xs opacity-75 mt-1">Insights will appear when data is available</p>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">
            No insights available at the moment.
          </div>
        )}
      </div>
    </div>
  )
}
