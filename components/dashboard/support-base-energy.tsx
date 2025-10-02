import { Zap, Hash, BarChart3, Users } from 'lucide-react'
import { amplifierData } from '@/data/amplifier-data'

interface AmplifierCardProps {
  avatar: string
  name: string
  handle: string
  score: string
  followers: string
  posts: string
  engagement: string
}

function AmplifierCard({ avatar, name, handle, score, followers, posts, engagement }: AmplifierCardProps) {
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
        <div className="text-xs text-muted-foreground font-medium">Score {score}</div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-sm font-semibold text-foreground">{followers}</div>
          <div className="text-xs text-muted-foreground">Followers</div>
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">{posts}</div>
          <div className="text-xs text-muted-foreground">Posts</div>
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">{engagement}</div>
          <div className="text-xs text-muted-foreground">Engagement</div>
        </div>
      </div>
    </div>
  )
}

export function SupportBaseEnergy() {
  return (
    <div className="bg-card border border-border rounded-lg p-6 list-animate-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-1">Support Base Energy</h2>
          <p className="text-sm text-muted-foreground">0 hashtags tracked · 10 amplifiers · 0 total mentions</p>
        </div>
        <Zap className="w-5 h-5 text-muted-foreground" />
      </div>

      <div className="mb-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Top Amplifiers (10 total)</h3>
        <div className="grid grid-cols-2 gap-3">
          {amplifierData.map((amplifier, index) => (
            <AmplifierCard key={index} {...amplifier} />
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Insights</h3>
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-start gap-2">
            <Hash className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
            <span>#mysurudasara trending with 4 mentions and 3K engagement</span>
          </div>
          <div className="flex items-start gap-2">
            <BarChart3 className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
            <span>facebook trending: everyone with 40 mentions</span>
          </div>
          <div className="flex items-start gap-2">
            <BarChart3 className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
            <span>instagram trending: bangalore with 21 mentions</span>
          </div>
          <div className="flex items-start gap-2">
            <Users className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
            <span>@blrcitypolice driving conversation with 10640 amplification score</span>
          </div>
        </div>
      </div>
    </div>
  )
}
