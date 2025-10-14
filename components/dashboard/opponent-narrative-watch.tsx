import { Target, Loader2, AlertCircle } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Static data to prevent flickering
const staticOpponentData = {
  partiesTracked: 3,
  totalMentions: 1247,
  narratives: [
    {
      title: "Political Opposition Campaign",
      mentions: 456,
      description: "Opposition parties targeting police reforms and governance issues",
      sentiment: "negative",
      trend: "+12% trending"
    },
    {
      title: "Media Criticism", 
      mentions: 234,
      description: "Media outlets questioning recent policy decisions",
      sentiment: "neutral",
      trend: "-3% trending"
    }
  ]
}

interface OpponentNarrativeWatchProps {
  data?: any
  loading?: boolean
  error?: string | null
}

export function OpponentNarrativeWatch({ data, loading, error }: OpponentNarrativeWatchProps = {}) {
  // Transform API data or use static data as fallback
  const narratives = data?.narratives ? data.narratives.map((narr: any) => ({
    title: narr.title || 'Untitled Narrative',
    mentions: narr.engagement || 0,
    description: narr.description || '',
    sentiment: narr.sentiment?.label || narr.sentiment || 'neutral',
    trend: narr.trend || 'stable'
  })) : staticOpponentData.narratives
  
  const partiesTracked = data?.partiesTracked || staticOpponentData.partiesTracked
  const totalMentions = data?.totalMentions || staticOpponentData.totalMentions

  return (
    <div className="bg-card border border-border rounded-lg p-6 list-animate-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-1">Opponent Narrative Watch</h2>
          <p className="text-sm text-muted-foreground">
            {loading ? 'Loading...' : `${partiesTracked} parties tracked · ${totalMentions} total mentions`}
          </p>
        </div>
        {loading ? (
          <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
        ) : (
          <Target className="w-5 h-5 text-muted-foreground" />
        )}
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-4 border border-border rounded-lg space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : narratives.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
            <Target className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-foreground font-semibold mb-2">No Opponents Tracked</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            No opponent parties are currently being monitored. Set up tracking to monitor political opponents and their narratives.
          </p>
          <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg transition-colors">
            Set Up Tracking
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {narratives.map((narrative: any, index: number) => (
            <div key={index} className="p-4 border border-border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-foreground">{narrative.title}</h4>
                <span className="text-xs text-muted-foreground">{narrative.mentions} mentions</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{narrative.description}</p>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs ${
                  narrative.sentiment === 'negative' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                  narrative.sentiment === 'positive' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                }`}>
                  {narrative.sentiment}
                </span>
                <span className="text-xs text-muted-foreground">{narrative.trend}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
