import { Zap, Hash, BarChart3, Users } from 'lucide-react'

// Static data to prevent flickering
const staticSupportData = {
  hashtagsTracked: 12,
  amplifiers: [
    {
      avatar: "RG",
      name: "Rahul Gandhi",
      handle: "@RahulGandhi",
      score: "92.5",
      followers: "28.2M",
      posts: "156",
      engagement: "4.2%"
    },
    {
      avatar: "AT",
      name: "AajTak",
      handle: "@aajtak",
      score: "88.1",
      followers: "24.5M",
      posts: "89",
      engagement: "3.8%"
    }
  ],
  totalMentions: 2847,
  insights: [
    {
      type: "hashtag",
      text: "#PoliceReforms trending with 1,247 mentions"
    },
    {
      type: "platform",
      text: "Twitter shows highest engagement at 4.2%"
    },
    {
      type: "user",
      text: "8 key amplifiers driving 67% of reach"
    }
  ]
}

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

export function SupportBaseEnergy() {
  // Use static data to prevent flickering
  const hashtagsTracked = staticSupportData.hashtagsTracked
  const amplifiers = staticSupportData.amplifiers
  const totalMentions = staticSupportData.totalMentions
  const insights = staticSupportData.insights

  return (
    <div className="bg-card border border-border rounded-lg p-6 list-animate-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-1">Support Base Energy</h2>
          <p className="text-sm text-muted-foreground">{hashtagsTracked} hashtags tracked · {amplifiers.length} amplifiers · {totalMentions} total mentions</p>
        </div>
        <Zap className="w-5 h-5 text-muted-foreground" />
      </div>

      {amplifiers.length > 0 && (
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
      )}

      <div className="pt-4 border-t border-border">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Insights</h3>
        {insights.length > 0 ? (
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
        ) : (
          <div className="text-xs text-muted-foreground">
            No insights available at the moment.
          </div>
        )}
      </div>
    </div>
  )
}
