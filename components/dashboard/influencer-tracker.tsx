import { Users, Zap, Lightbulb } from 'lucide-react'

// Static data to prevent flickering
const staticInfluencerData = {
  influencers: [
    {
      avatar: "RG",
      name: "Rahul Gandhi",
      handle: "@RahulGandhi",
      platform: "Twitter",
      stance: "Opposition",
      followers: "28.2M",
      posts: "8.3K",
      engagement: "4.2%",
      viralContent: {
        engagement: "125K",
        text: "Democracy and development go hand in hand..."
      }
    },
    {
      avatar: "AT",
      name: "AajTak",
      handle: "@aajtak",
      platform: "Twitter", 
      stance: "Neutral",
      followers: "24.5M",
      posts: "1.0M",
      engagement: "3.8%",
      viralContent: {
        engagement: "89K",
        text: "Breaking: Latest updates on current affairs..."
      }
    },
    {
      avatar: "ND",
      name: "NDTV",
      handle: "@ndtv",
      platform: "Twitter",
      stance: "Neutral", 
      followers: "18.9M",
      posts: "156K",
      engagement: "3.5%",
      viralContent: {
        engagement: "67K",
        text: "In-depth analysis of today's top stories..."
      }
    }
  ],
  summary: "3 key influencers tracked",
  insight: "Rahul Gandhi showing highest engagement this week"
};

interface EntityCardProps {
  avatar: string
  name: string
  handle: string
  platform: string
  stance: string
  followers: string | number
  posts: string | number
  engagement: string | number | {
    likes?: number
    shares?: number
    comments?: number
    totalReach?: number
    totalEngagement?: number
    averageEngagement?: number
    sentimentBreakdown?: any
  }
  viralContent?: {
    engagement: string
    text: string
  }
}

function EntityCard({ avatar, name, handle, platform, stance, followers, posts, engagement, viralContent }: EntityCardProps) {
  // Format engagement for display
  const formatEngagement = (eng: EntityCardProps['engagement']): string => {
    if (typeof eng === 'string') return eng
    if (typeof eng === 'number') return eng.toLocaleString()
    if (typeof eng === 'object' && eng !== null) {
      // If engagement is an object, try to extract a meaningful value
      if ('totalEngagement' in eng && typeof eng.totalEngagement === 'number') {
        return eng.totalEngagement.toLocaleString()
      }
      if ('averageEngagement' in eng && typeof eng.averageEngagement === 'number') {
        return eng.averageEngagement.toFixed(1) + '%'
      }
      if ('likes' in eng && typeof eng.likes === 'number') {
        return eng.likes.toLocaleString()
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
    <div className="bg-card border border-border rounded-lg p-5 card-hover pressable">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground font-semibold">
            {avatar}
          </div>
          <div>
            <div className="text-foreground font-semibold text-sm">{name}</div>
            <div className="text-muted-foreground text-xs">{handle} · {platform}</div>
          </div>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-medium border bg-secondary border-border text-muted-foreground`}>
          {stance.replace('_', ' ')}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">{formatNumber(followers)}</div>
          <div className="text-xs text-muted-foreground">Followers</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">{formatNumber(posts)}</div>
          <div className="text-xs text-muted-foreground">Posts</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">{formatEngagement(engagement)}</div>
          <div className="text-xs text-muted-foreground">Engagement</div>
        </div>
      </div>

      {viralContent && (
        <div className="pt-4 border-t border-border">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Viral Content ({viralContent.engagement})</span>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">{viralContent.text}</p>
        </div>
      )}
    </div>
  )
}

export function InfluencerTracker() {
  // Use static data to prevent flickering
  const influencerData = staticInfluencerData
  const displayData = influencerData.influencers
  const summary = influencerData.summary
  const insight = influencerData.insight

  return (
    <div className="bg-card border border-border rounded-lg p-6 list-animate-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-1">Influencer & Entity Tracker</h2>
          <p className="text-sm text-muted-foreground">{summary}</p>
        </div>
        <Users className="w-5 h-5 text-muted-foreground" />
      </div>

      <div className="space-y-4">
        {(displayData || []).map((entity: any, index: number) => (
          <EntityCard
            key={index}
            avatar={entity.avatar}
            name={entity.name}
            handle={entity.handle}
            platform={entity.platform}
            stance={entity.stance}
            followers={entity.followers}
            posts={entity.posts}
            engagement={entity.engagement}
            viralContent={entity.viralContent}
          />
        ))}
      </div>

      <div className="mt-6 p-4 bg-muted/50 border border-border rounded-lg">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Key Insight:</span> {insight}
          </div>
        </div>
      </div>
    </div>
  )
}
