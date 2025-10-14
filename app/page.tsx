'use client'

import { PageLayout } from '@/components/layout/page-layout'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { PageHeader } from '@/components/layout/page-header'
import { StatsGrid } from '@/components/dashboard/stats-grid'
import { TopicSentimentHeatmap } from '@/components/dashboard/topic-sentiment-heatmap'
import { InfluencerTracker } from '@/components/dashboard/influencer-tracker'
import { OpponentNarrativeWatch } from '@/components/dashboard/opponent-narrative-watch'
import { SupportBaseEnergy } from '@/components/dashboard/support-base-energy'
import { GlobalSearch } from '@/components/ui/global-search'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useState, useMemo, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Settings, Grid3X3, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'
import { TrendingUp, TrendingDown, Hash } from 'lucide-react'
import {
  ChatBubbleIcon,
  HeartIcon,
  ActivityLogIcon,
  LockClosedIcon,
  PersonIcon,
  Share2Icon,
  EyeOpenIcon,
  ClockIcon,
  BarChartIcon,
  GlobeIcon,
  LightningBoltIcon,
  ExclamationTriangleIcon
} from '@radix-ui/react-icons'
import { 
  usePoliticalStats, 
  useCampaignThemes, 
  useInfluencerTracker,
  useOpponentNarratives,
  useSupportBaseEnergy 
} from '@/hooks/use-api'
// import { AnimatedPage, div, Card } from '@/components/ui/animated'

// Helper function to format numbers
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// Helper function to map timeRange
const mapTimeRange = (range: string): string => {
  const mapping: Record<string, string> = {
    '24h': '7d',
    '7d': '7d',
    '30d': '30d',
  }
  return mapping[range] || '7d'
}

export default function Page() {
  const [range, setRange] = useState('24h')
  const [activeTab, setActiveTab] = useState('overview')
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [enabledCards, setEnabledCards] = useState({
    'total-mentions': true,
    'sentiment-score': true,
    'active-campaigns': true,
    'threat-level': true,
    'trending-topics': true,
    'topic-sentiment': true,
    'influencer-tracker': true,
    'opponent-narrative': true,
    'support-base': true
  })

  // Fetch dashboard data from APIs
  const timeRange = mapTimeRange(range)
  
  // Memoize API params to prevent infinite re-renders
  const apiParams = useMemo(() => ({ 
    timeRange, 
    cached: true 
  }), [timeRange])
  
  const { data: quickStats, loading: statsLoading, error: statsError } = usePoliticalStats(apiParams)
  const { data: campaignThemes, loading: themesLoading, error: themesError } = useCampaignThemes(apiParams)
  const { data: influencerData, loading: influencerLoading, error: influencerError } = useInfluencerTracker(apiParams)
  const { data: opponentData, loading: opponentLoading, error: opponentError } = useOpponentNarratives(apiParams)
  const { data: supportBaseData, loading: supportLoading, error: supportError } = useSupportBaseEnergy(apiParams)

  // Sample data for the new dashboard sections (fallback)
  const recentActivity = [
    { id: 1, type: 'mention', content: 'Bengaluru Police mentioned in viral post', time: '2m ago', sentiment: 'positive' },
    { id: 2, type: 'trend', content: 'Traffic management trending up', time: '5m ago', sentiment: 'neutral' },
    { id: 3, type: 'alert', content: 'Negative sentiment spike detected', time: '8m ago', sentiment: 'negative' },
    { id: 4, type: 'mention', content: 'New influencer post about police reforms', time: '12m ago', sentiment: 'positive' },
    { id: 5, type: 'trend', content: 'Crime prevention discussions rising', time: '15m ago', sentiment: 'positive' }
  ]

  // Process trending topics from API
  const trendingTopics = useMemo(() => {
    if (!campaignThemes || typeof campaignThemes !== 'object' || !('themes' in campaignThemes)) return []
    
    const themes = (campaignThemes as any).themes
    if (!themes) return []
    
    const allThemes: any[] = [
      ...(themes.positive || []),
      ...(themes.negative || []),
      ...(themes.neutral || [])
    ]
    
    return allThemes.slice(0, 4).map(campaign => ({
      topic: campaign.campaignName || 'Unknown Campaign',
      mentions: campaign.metrics?.totalPosts || 0,
      change: campaign.metrics?.change || '+0%',
      sentiment: campaign.sentiment || 'neutral'
    }))
  }, [campaignThemes])

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/50'
      case 'negative': return 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50'
      case 'neutral': return 'text-gray-700 dark:text-gray-400 bg-gray-50 dark:bg-gray-950/30 border-gray-200 dark:border-gray-800'
      default: return 'text-gray-700 dark:text-gray-400 bg-gray-50 dark:bg-gray-950/30 border-gray-200 dark:border-gray-800'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'mention': return ChatBubbleIcon
      case 'trend': return TrendingUp
      case 'alert': return ExclamationTriangleIcon
      default: return ActivityLogIcon
    }
  }

  // Dashboard card definitions
  const dashboardCards = [
    {
      id: 'total-mentions',
      title: 'Total Mentions',
      description: 'Real-time mention tracking',
      icon: ChatBubbleIcon,
      color: 'blue',
      size: 'small'
    },
    {
      id: 'sentiment-score',
      title: 'Sentiment Score',
      description: 'Overall sentiment analysis',
      icon: HeartIcon,
      color: 'green',
      size: 'small'
    },
    {
      id: 'active-campaigns',
      title: 'Active Campaigns',
      description: 'Current campaign status',
      icon: BarChartIcon,
      color: 'purple',
      size: 'small'
    },
    {
      id: 'threat-level',
      title: 'Threat Level',
      description: 'Security threat assessment',
      icon: LockClosedIcon,
      color: 'gray',
      size: 'small'
    },
    {
      id: 'trending-topics',
      title: 'Trending Topics',
      description: 'Hot topics and discussions',
      icon: TrendingUp,
      color: 'orange',
      size: 'large'
    },
    {
      id: 'topic-sentiment',
      title: 'Topic Sentiment',
      description: 'Sentiment heatmap analysis',
      icon: Hash,
      color: 'blue',
      size: 'large'
    },
    {
      id: 'influencer-tracker',
      title: 'Influencer Tracker',
      description: 'Key influencer monitoring',
      icon: PersonIcon,
      color: 'purple',
      size: 'large'
    },
    {
      id: 'opponent-narrative',
      title: 'Opponent Narrative',
      description: 'Opposition monitoring',
      icon: EyeOpenIcon,
      color: 'red',
      size: 'large'
    },
    {
      id: 'support-base',
      title: 'Support Base',
      description: 'Support base analysis',
      icon: Share2Icon,
      color: 'green',
      size: 'large'
    }
  ]

  const toggleCard = (cardId: string) => {
    console.log('Toggling card:', cardId, 'Current state:', enabledCards[cardId as keyof typeof enabledCards])
    setEnabledCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId as keyof typeof prev]
    }))
  }

  const toggleAllCards = () => {
    const allEnabled = Object.values(enabledCards).every(Boolean)
    const newState = !allEnabled
    console.log('Toggling all cards:', { allEnabled, newState })
    const newEnabledCards: Record<string, boolean> = {}
    Object.keys(enabledCards).forEach(key => {
      newEnabledCards[key] = newState
    })
    setEnabledCards(newEnabledCards as typeof enabledCards)
  }

  return (
    <ProtectedRoute>
      <PageLayout>
      <PageHeader
        title="Intelligence Dashboard"
        description="Real-time insights on narratives, opponents, and public sentiment"
        actions={
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <GlobalSearch />
            <Button
              variant={isCustomizing ? "default" : "outline"}
              size="sm"
              onClick={() => setIsCustomizing(!isCustomizing)}
              className="flex items-center justify-center gap-2 flex-shrink-0"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">{isCustomizing ? 'Exit Customize' : 'Customize'}</span>
              <span className="sm:hidden">Edit</span>
            </Button>
          </div>
        }
      />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-4 sm:py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-6">
              <TabsList className="w-full sm:w-auto overflow-x-auto">
                <TabsTrigger value="overview" className="text-xs sm:text-sm whitespace-nowrap">
                  <span className="hidden sm:inline">📊 Overview</span>
                  <span className="sm:hidden">📊</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="text-xs sm:text-sm whitespace-nowrap">
                  <span className="hidden sm:inline">📈 Analytics</span>
                  <span className="sm:hidden">📈</span>
                </TabsTrigger>
                <TabsTrigger value="monitoring" className="text-xs sm:text-sm whitespace-nowrap">
                  <span className="hidden sm:inline">🔍 Monitoring</span>
                  <span className="sm:hidden">🔍</span>
                </TabsTrigger>
              </TabsList>
              <Tabs value={range} onValueChange={setRange}>
                <TabsList className="w-full sm:w-auto">
                  <TabsTrigger value="24h" className="text-xs sm:text-sm flex-1 sm:flex-none">
                    <span className="hidden sm:inline">24 Hours</span>
                    <span className="sm:hidden">24h</span>
                  </TabsTrigger>
                  <TabsTrigger value="7d" className="text-xs sm:text-sm flex-1 sm:flex-none">
                    <span className="hidden sm:inline">7 Days</span>
                    <span className="sm:hidden">7d</span>
                  </TabsTrigger>
                  <TabsTrigger value="30d" className="text-xs sm:text-sm flex-1 sm:flex-none">
                    <span className="hidden sm:inline">30 Days</span>
                    <span className="sm:hidden">30d</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Customization Panel - Global for all tabs */}
            {isCustomizing && (
              <div className="mb-6 p-3 sm:p-6 bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Grid3X3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <h3 className="text-sm sm:text-lg font-semibold text-blue-900 dark:text-blue-100">Customize Dashboard</h3>
                    <Badge variant="secondary" className="text-[10px] sm:text-xs whitespace-nowrap">
                      {Object.values(enabledCards).filter(Boolean).length}/{Object.keys(enabledCards).length}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleAllCards}
                    className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-100 w-full sm:w-auto justify-center"
                  >
                    {Object.values(enabledCards).every(Boolean) ? (
                      <>
                        <EyeOff className="w-4 h-4" />
                        <span className="text-xs sm:text-sm">Hide All</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        <span className="text-xs sm:text-sm">Show All</span>
                      </>
                    )}
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {dashboardCards.map((card) => {
                    const isEnabled = enabledCards[card.id as keyof typeof enabledCards]
                    return (
                    <div
                      key={card.id}
                      className={`p-3 sm:p-4 border-2 rounded-lg transition-all duration-200 cursor-pointer hover:shadow-md ${
                          isEnabled
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-md'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800/50 hover:border-blue-300'
                      }`}
                      onClick={() => toggleCard(card.id)}
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        <Checkbox
                          id={card.id}
                            checked={isEnabled}
                          onCheckedChange={() => toggleCard(card.id)}
                          className="mt-0.5 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                              <card.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${isEnabled ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'}`} />
                              <span className={`text-xs sm:text-sm font-medium ${isEnabled ? 'text-blue-900 dark:text-blue-100' : 'text-foreground'}`}>
                              {card.title}
                            </span>
                              {isEnabled && (
                              <Badge variant="default" className="text-[10px] sm:text-xs bg-blue-600 text-white">
                                Active
                              </Badge>
                            )}
                          </div>
                            <p className={`text-[10px] sm:text-xs mt-1 ${isEnabled ? 'text-blue-700 dark:text-blue-300' : 'text-muted-foreground'}`}>
                            {card.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    )
                  })}
                </div>
              </div>
            )}

          <TabsContent value="overview">
            <div className="animate-in fade-in duration-200">

              {/* CRITICAL ALERT BAR - Highest Priority */}
              <div className="mb-6 p-4 bg-red-950/20 border border-red-900/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <p className="text-red-400 font-semibold text-sm">⚠️ CRITICAL ALERT</p>
                    <p className="text-red-300 text-xs">Traffic Management sentiment dropped 15% this week - Immediate attention required</p>
                  </div>
                  <Button variant="destructive" size="sm">View Details</Button>
                </div>
              </div>

              {/* CUSTOMIZABLE 3x3 DASHBOARD GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
                {/* Row 1 - Small Cards */}
                {enabledCards['total-mentions'] && (
                  <Card>
                    <Card className="border-2 border-blue-500/30 bg-gradient-to-br from-blue-950/40 to-blue-900/20 shadow-lg">
                      <CardContent className="p-6">
                        {statsLoading ? (
                          <div className="space-y-3">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-32" />
                            <Skeleton className="h-3 w-28" />
                          </div>
                        ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-medium text-blue-300 uppercase tracking-wide">Total Mentions</p>
                              <p className="text-3xl font-black text-white mb-1">
                                {quickStats && typeof quickStats === 'object' && quickStats !== null && 'overview' in quickStats && (quickStats as any).overview?.totalPosts 
                                  ? formatNumber((quickStats as any).overview.totalPosts) 
                                  : '0'}
                              </p>
                            <p className="text-xs text-green-400 flex items-center gap-1 font-bold">
                              <TrendingUp className="w-3 h-3" />
                                Tracked across platforms
                            </p>
                          </div>
                          <div className="w-14 h-14 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
                            <ChatBubbleIcon className="w-7 h-7 text-blue-400" />
                          </div>
                        </div>
                        )}
                      </CardContent>
                    </Card>
                  </Card>
                )}

                {enabledCards['sentiment-score'] && (
                  <Card>
                    <Card className="border-2 border-green-500/30 bg-gradient-to-br from-green-950/40 to-green-900/20 shadow-lg">
                      <CardContent className="p-6">
                        {statsLoading ? (
                          <div className="space-y-3">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-32" />
                            <Skeleton className="h-3 w-28" />
                          </div>
                        ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-medium text-green-300 uppercase tracking-wide">Sentiment Score</p>
                              <p className="text-3xl font-black text-white mb-1">
                                {quickStats && typeof quickStats === 'object' && quickStats !== null && 'sentiment' in quickStats && (quickStats as any).sentiment?.positive?.percentage 
                                  ? `${(quickStats as any).sentiment.positive.percentage}%` 
                                  : '0%'}
                              </p>
                            <p className="text-xs text-green-400 flex items-center gap-1 font-bold">
                              <TrendingUp className="w-3 h-3" />
                                Positive sentiment
                            </p>
                          </div>
                          <div className="w-14 h-14 rounded-xl bg-green-500/20 border border-green-400/30 flex items-center justify-center">
                            <HeartIcon className="w-7 h-7 text-green-400" />
                          </div>
                        </div>
                        )}
                      </CardContent>
                    </Card>
                  </Card>
                )}

                {enabledCards['active-campaigns'] && (
                  <Card>
                    <Card className="border border-border/50 bg-card/50">
                      <CardContent className="p-6">
                        {themesLoading ? (
                          <div className="space-y-3">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-20" />
                            <Skeleton className="h-3 w-28" />
                          </div>
                        ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Active Campaigns</p>
                              <p className="text-2xl font-bold text-foreground">
                                {campaignThemes && typeof campaignThemes === 'object' && campaignThemes !== null && 'summary' in campaignThemes && (campaignThemes as any).summary?.totalCampaigns || 0}
                              </p>
                            <p className="text-xs text-blue-500 flex items-center gap-1 font-medium">
                              <ActivityLogIcon className="w-3 h-3" />
                                {campaignThemes && typeof campaignThemes === 'object' && campaignThemes !== null && 'summary' in campaignThemes && (campaignThemes as any).summary?.positiveCount || 0} positive campaigns
                            </p>
                          </div>
                          <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                            <BarChartIcon className="w-6 h-6 text-purple-400" />
                          </div>
                        </div>
                        )}
                      </CardContent>
                    </Card>
                  </Card>
                )}

                {/* Row 2 - Large Cards */}
                {enabledCards['trending-topics'] && (
                  <Card className="lg:col-span-2">
                    <Card className="border-2 border-orange-500/30 bg-gradient-to-br from-orange-950/20 to-orange-900/10">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-orange-300">
                          <TrendingUp className="w-5 h-5" />
                          🔥 Trending Topics
                        </CardTitle>
                        <CardDescription className="text-orange-200/80">Most discussed campaign themes</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {themesLoading ? (
                          <div className="space-y-3">
                            {[1, 2, 3, 4].map((i) => (
                              <div key={i} className="p-3 space-y-2">
                                <Skeleton className="h-5 w-48" />
                                <Skeleton className="h-4 w-32" />
                              </div>
                            ))}
                          </div>
                        ) : trendingTopics.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">No trending topics available</p>
                          </div>
                        ) : (
                        <div className="space-y-3">
                          {trendingTopics.map((topic, index) => {
                              const isHighVolume = topic.mentions > 100
                            const isNegative = topic.sentiment === 'negative'
                            return (
                              <div 
                                key={index} 
                                className={`flex items-center justify-between cursor-pointer p-3 rounded-lg transition-all duration-200 ${
                                  isHighVolume 
                                    ? 'bg-orange-500/10 border border-orange-400/30 hover:bg-orange-500/20' 
                                    : 'bg-muted/30 hover:bg-muted/50'
                                } ${isNegative ? 'ring-1 ring-red-500/30' : ''}`}
                                onClick={() => {
                                  window.location.href = `/social-feed?filter=all-posts&search=${encodeURIComponent(topic.topic)}`
                                }}
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className={`font-semibold ${isHighVolume ? 'text-white' : 'text-foreground'} ${isNegative ? 'text-red-400' : ''}`}>
                                      {topic.topic}
                                    </p>
                                    {isHighVolume && <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full font-bold">HOT</span>}
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">
                                      <span className="font-bold text-orange-400">{formatNumber(topic.mentions)}</span> mentions
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge className={`text-xs font-bold ${
                                    topic.sentiment === 'positive' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                    topic.sentiment === 'negative' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                                    'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                  }`}>
                                    {topic.sentiment}
                                  </Badge>
                                    {topic.change && (
                                  <span className={`text-xs font-black ${
                                    topic.change.startsWith('+') 
                                      ? 'text-green-400' 
                                      : 'text-red-400'
                                  }`}>
                                    {topic.change}
                                  </span>
                                    )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                        )}
                      </CardContent>
                    </Card>
                  </Card>
                )}

                {enabledCards['threat-level'] && (
                  <Card>
                    <Card className="border border-border/30 bg-muted/20">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground/70">Threat Level</p>
                            <p className="text-2xl font-bold text-foreground/80">Low</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <LockClosedIcon className="w-3 h-3" />
                              No alerts
                            </p>
                          </div>
                          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                            <LockClosedIcon className="w-6 h-6 text-green-500/70" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Card>
                )}

                {/* Row 3 - Large Components */}
                {enabledCards['topic-sentiment'] && (
                  <Card className="lg:col-span-2">
                    <TopicSentimentHeatmap />
                  </Card>
                )}

                {enabledCards['influencer-tracker'] && (
                  <Card>
                    <InfluencerTracker 
                      data={influencerData} 
                      loading={influencerLoading} 
                      error={influencerError} 
                    />
                  </Card>
                )}

                {enabledCards['opponent-narrative'] && (
                  <Card className="lg:col-span-2">
                    <OpponentNarrativeWatch 
                      data={opponentData} 
                      loading={opponentLoading} 
                      error={opponentError} 
                    />
                  </Card>
                )}

                {enabledCards['support-base'] && (
                  <Card>
                    <SupportBaseEnergy 
                      data={supportBaseData} 
                      loading={supportLoading} 
                      error={supportError} 
                    />
                  </Card>
                )}
              </div>

            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6 animate-in fade-in duration-200">
              <StatsGrid />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <Card>
                  <TopicSentimentHeatmap />
                </Card>
                <Card>
                  <InfluencerTracker 
                    data={influencerData} 
                    loading={influencerLoading} 
                    error={influencerError} 
                  />
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="monitoring">
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Active Monitoring</CardTitle>
                          <CardDescription>Real-time monitoring of key entities and topics</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href="/analysis-history?filter=active">See all</a>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border border-border rounded-lg">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                              <LightningBoltIcon className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Bengaluru Police</p>
                              <p className="text-xs text-muted-foreground">Active monitoring</p>
                            </div>
                          </div>
                          <div className="text-xs text-green-600">✓ All systems operational</div>
                        </div>
                        
                        <div className="p-4 border border-border rounded-lg">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <Hash className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Traffic Management</p>
                              <p className="text-xs text-muted-foreground">Topic tracking</p>
                            </div>
                          </div>
                          <div className="text-xs text-blue-600">📈 Trending up</div>
                        </div>
                        
                        <div className="p-4 border border-border rounded-lg">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                              <PersonIcon className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Key Influencers</p>
                              <p className="text-xs text-muted-foreground">Profile monitoring</p>
                            </div>
                          </div>
                          <div className="text-xs text-purple-600">👥 24 profiles tracked</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity - Moved to Monitoring Tab */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ActivityLogIcon className="w-5 h-5" />
                        Recent Activity
                      </CardTitle>
                      <CardDescription>Live updates from your monitoring</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentActivity.map((activity) => {
                          const Icon = getActivityIcon(activity.type)
                          return (
                            <div key={activity.id} className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                <Icon className="w-4 h-4 text-muted-foreground" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-foreground">{activity.content}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge className={`text-xs ${getSentimentColor(activity.sentiment)}`}>
                                    {activity.sentiment}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <ClockIcon className="w-3 h-3" />
                                    {activity.time}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <Card>
                  <OpponentNarrativeWatch 
                    data={opponentData} 
                    loading={opponentLoading} 
                    error={opponentError} 
                  />
                </Card>
                <Card>
                  <SupportBaseEnergy 
                    data={supportBaseData} 
                    loading={supportLoading} 
                    error={supportError} 
                  />
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        </div>
      </main>
    </PageLayout>
    </ProtectedRoute>
  )
}