import { Users, Zap, Lightbulb } from 'lucide-react'
import { entityData } from '@/data/entity-data'

interface EntityCardProps {
  avatar: string
  name: string
  handle: string
  platform: string
  stance: string
  followers: string
  posts: string
  engagement: string
  viralContent?: {
    engagement: string
    text: string
  }
}

function EntityCard({ avatar, name, handle, platform, stance, followers, posts, engagement, viralContent }: EntityCardProps) {
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
          <div className="text-lg font-bold text-foreground">{followers}</div>
          <div className="text-xs text-muted-foreground">Followers</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">{posts}</div>
          <div className="text-xs text-muted-foreground">Posts</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">{engagement}</div>
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
  return (
    <div className="bg-card border border-border rounded-lg p-6 list-animate-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-1">Influencer & Entity Tracker</h2>
          <p className="text-sm text-muted-foreground">50 top accounts · 15 supportive · 3 critical</p>
        </div>
        <Users className="w-5 h-5 text-zinc-600" />
      </div>

      <div className="space-y-4">
        {entityData.map((entity, index) => (
          <EntityCard key={index} {...entity} />
        ))}
      </div>

      <div className="mt-6 p-4 bg-muted/50 border border-border rounded-lg">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Key Insight:</span> @BENGALURU CITY POLICE leading leaning_supportive narrative with viral threads (126K reach). @Revolution Tv showing strong critical stance with 100% negative sentiment.
          </div>
        </div>
      </div>
    </div>
  )
}
