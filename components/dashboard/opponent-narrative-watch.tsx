import { Target } from 'lucide-react'

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

export function OpponentNarrativeWatch() {
  // Use static data to prevent flickering
  const partiesTracked = staticOpponentData.partiesTracked
  const totalMentions = staticOpponentData.totalMentions
  const narratives = staticOpponentData.narratives

  return (
    <div className="bg-card border border-border rounded-lg p-6 list-animate-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-1">Opponent Narrative Watch</h2>
          <p className="text-sm text-muted-foreground">{partiesTracked} parties tracked · {totalMentions} total mentions</p>
        </div>
        <Target className="w-5 h-5 text-muted-foreground" />
      </div>

      {narratives.length === 0 ? (
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
                  narrative.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                  narrative.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
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
