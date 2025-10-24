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
import { DashboardSkeleton } from '@/components/skeletons/dashboard-skeleton'
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
import { useCampaigns } from '@/hooks/use-campaigns'
import { motion } from 'framer-motion'
import { staggerContainerVariants, listItemVariants, fadeInUpVariants } from '@/lib/motion'

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
    '24h': '24h',
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
    'trending-topics': true,
    'topic-sentiment': true,
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

  // Fetch actual campaigns data for accurate counts
  // Use a high limit to ensure we get all campaigns for accurate counting
  const { data: campaigns, loading: campaignsLoading } = useCampaigns({ enabled: true, limit: 1000 })

  // Debug logging for dashboard data
  useEffect(() => {
    console.log('📊 Dashboard Data Debug:', {
      quickStats,
      campaignThemes,
      totalCampaigns: campaigns?.length,
      activeCampaigns: campaigns?.filter(c => c.monitoringStatus === 'ACTIVE').length,
      campaignStatuses: campaigns?.map(c => ({ name: c.name, status: c.monitoringStatus }))
    })
  }, [quickStats, campaignThemes, campaigns])

  // Calculate active campaigns count from real data
  const activeCampaignsCount = useMemo(() => {
    if (!campaigns || !Array.isArray(campaigns)) return 0
    return campaigns.filter(c => c.monitoringStatus === 'ACTIVE').length
  }, [campaigns])

  // Calculate total campaigns count
  const totalCampaignsCount = useMemo(() => {
    if (!campaigns || !Array.isArray(campaigns)) return 0
    return campaigns.length
  }, [campaigns])

  // Removed sample/fallback data - using only real API data

  // Process trending topics from API
  const trendingTopics = useMemo(() => {
    if (!campaignThemes || typeof campaignThemes !== 'object') {
      console.log('No campaign themes data:', campaignThemes)
      return []
    }

    // Try different possible data structures
    let allThemes: any[] = []

    // Check if it has a themes property
    if ('themes' in campaignThemes) {
      const themes = (campaignThemes as any).themes
      if (themes) {
        allThemes = [
          ...(themes.positive || []),
          ...(themes.negative || []),
          ...(themes.neutral || [])
        ]
      }
    }
    // Check if campaignThemes itself is an array
    else if (Array.isArray(campaignThemes)) {
      allThemes = campaignThemes
    }
    // Check if it has a data property
    else if ('data' in campaignThemes && Array.isArray((campaignThemes as any).data)) {
      allThemes = (campaignThemes as any).data
    }

    if (allThemes.length === 0) {
      console.log('No themes found in data structure:', campaignThemes)
      return []
    }

    console.log('Processing trending topics:', allThemes.length, 'themes found')
    return allThemes.slice(0, 4).map(campaign => ({
      topic: campaign.campaignName || campaign.name || campaign.topic || 'Unknown Campaign',
      mentions: campaign.metrics?.totalPosts || campaign.totalPosts || campaign.mentions || 0,
      change: campaign.metrics?.change || campaign.change || '+0%',
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
        <div className="h-screen flex flex-col bg-background overflow-hidden">
          {/* Improved Dashboard Header */}
          <header className="border-b border-border bg-background sticky top-0 z-40">
            <div className="max-w-[1800px] mx-auto px-3 sm:px-4 lg:px-6">
              {/* Row 1: Title + Customize Button */}
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div>
                    <h1 className="text-xl font-semibold text-foreground">Intelligence Dashboard</h1>
                    <p className="text-sm text-muted-foreground">Real-time insights on narratives, opponents, and public sentiment</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button
                    variant={isCustomizing ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsCustomizing(!isCustomizing)}
                    className="flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline">{isCustomizing ? 'Exit Customize' : 'Customize'}</span>
                    <span className="sm:hidden">Edit</span>
                  </Button>
                </div>
              </div>

            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1800px] mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-8">

            {/* Navigation Tabs, Search Bar, and Time Range - All in one row */}
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-border">
              {/* Navigation Tabs - Left Aligned */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                <TabsList className="inline-flex">
                  <TabsTrigger value="overview" className="flex items-center gap-2">
                    <BarChartIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span className="hidden sm:inline">Analytics</span>
                  </TabsTrigger>
                  <TabsTrigger value="monitoring" className="flex items-center gap-2">
                    <EyeOpenIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Monitoring</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Search Bar - Centered */}
              <div className="flex-1 flex justify-center">
                <div className="w-full max-w-sm">
                  <GlobalSearch />
                </div>
              </div>

              {/* Time Range Filter - Right Aligned */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden sm:inline">Time Range:</span>
                <Tabs value={range} onValueChange={setRange}>
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="24h" className="text-xs sm:text-sm">
                      <span className="hidden sm:inline">24 Hours</span>
                      <span className="sm:hidden">24h</span>
                    </TabsTrigger>
                    <TabsTrigger value="7d" className="text-xs sm:text-sm">
                      <span className="hidden sm:inline">7 Days</span>
                      <span className="sm:hidden">7d</span>
                    </TabsTrigger>
                    <TabsTrigger value="30d" className="text-xs sm:text-sm">
                      <span className="hidden sm:inline">30 Days</span>
                      <span className="sm:hidden">30d</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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



                {/* CUSTOMIZABLE 3x3 DASHBOARD GRID */}
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8"
                  variants={staggerContainerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Row 1 - Small Cards */}
                  {enabledCards['total-mentions'] && (
                    <motion.div variants={listItemVariants}>
                      <Card className="border border-border/50 bg-card/50">
                        <CardContent className="p-4 sm:p-6">
                          {statsLoading ? (
                            <div className="flex items-center justify-between">
                              <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-8 w-20" />
                                <Skeleton className="h-3 w-28" />
                              </div>
                              <Skeleton className="w-12 h-12 rounded-full" />
                            </div>
                          ) : (
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Total Mentions</p>
                                <p className="text-2xl font-bold text-foreground">
                                  {quickStats && typeof quickStats === 'object' && quickStats !== null && 'overview' in quickStats && (quickStats as any).overview?.totalPosts 
                                    ? formatNumber((quickStats as any).overview.totalPosts) 
                                    : '0'}
                                </p>
                              <p className="text-xs text-blue-500 flex items-center gap-1 font-medium">
                                <ChatBubbleIcon className="w-3 h-3" />
                                  Tracked across platforms
                              </p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                              <ChatBubbleIcon className="w-6 h-6 text-blue-400" />
                            </div>
                          </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {enabledCards['sentiment-score'] && (
                    <motion.div variants={listItemVariants}>
                      <Card className="border border-border/50 bg-card/50">
                        <CardContent className="p-4 sm:p-6">
                          {statsLoading ? (
                            <div className="flex items-center justify-between">
                              <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-8 w-20" />
                                <Skeleton className="h-3 w-28" />
                              </div>
                              <Skeleton className="w-12 h-12 rounded-full" />
                            </div>
                          ) : (
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Sentiment Score</p>
                                <p className="text-2xl font-bold text-foreground">
                                  {quickStats && typeof quickStats === 'object' && quickStats !== null && 'sentiment' in quickStats && (quickStats as any).sentiment?.positive?.percentage 
                                    ? `${(quickStats as any).sentiment.positive.percentage}%` 
                                    : '0%'}
                                </p>
                              <p className="text-xs text-green-500 flex items-center gap-1 font-medium">
                                <HeartIcon className="w-3 h-3" />
                                  Positive sentiment
                              </p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                              <HeartIcon className="w-6 h-6 text-green-400" />
                            </div>
                          </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {enabledCards['active-campaigns'] && (
                    <motion.div variants={listItemVariants}>
                      <a href="/analysis-history?filter=active" className="block">
                        <Card className="border border-border/50 bg-card/50 hover:bg-card/70 hover:border-border/70 transition-all duration-200 cursor-pointer">
                          <CardContent className="p-4 sm:p-6">
                            {campaignsLoading ? (
                              <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                  <Skeleton className="h-4 w-24" />
                                  <Skeleton className="h-8 w-20" />
                                  <Skeleton className="h-3 w-28" />
                                </div>
                                <Skeleton className="w-12 h-12 rounded-full" />
                              </div>
                            ) : (
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Campaigns</p>
                                  <p className="text-2xl font-bold text-foreground">
                                    {activeCampaignsCount}
                                  </p>
                                <p className="text-xs text-blue-500 flex items-center gap-1 font-medium">
                                  <ActivityLogIcon className="w-3 h-3" />
                                  {totalCampaignsCount} total campaigns
                                </p>
                              </div>
                              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                                <BarChartIcon className="w-6 h-6 text-purple-400" />
                              </div>
                            </div>
                            )}
                          </CardContent>
                        </Card>
                      </a>
                    </motion.div>
                  )}

                  {/* Row 2 - Trending Topics and Topic Sentiment (50-50 layout) */}
                  {enabledCards['trending-topics'] && (
                    <motion.div variants={listItemVariants} className="lg:col-span-2">
                      <Card className="bg-card border border-border h-full flex flex-col">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-5 h-5 text-orange-400" />
                              <CardTitle className="text-lg font-semibold text-foreground">Trending Topics</CardTitle>
                            </div>
                            <span className="text-xs text-muted-foreground">🔥</span>
                          </div>
                          <CardDescription className="text-xs text-muted-foreground">Most discussed campaign themes</CardDescription>
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
                          ) : themesError ? (
                            <div className="text-center py-8">
                              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-muted-foreground text-sm">Unable to load trending topics</p>
                              <p className="text-muted-foreground text-xs mt-1">{themesError}</p>
                            </div>
                          ) : trendingTopics.length === 0 ? (
                            <div className="text-center py-8">
                              <Hash className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-muted-foreground text-sm">No trending topics found</p>
                              <p className="text-muted-foreground text-xs mt-1">Start analyzing campaigns to see trending topics here</p>
                            </div>
                          ) : (
                          <motion.div 
                            className="space-y-3"
                            variants={staggerContainerVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            {trendingTopics.map((topic, index) => {
                                const isHighVolume = topic.mentions > 100
                              const isNegative = topic.sentiment === 'negative'
                              return (
                                <motion.div 
                                  key={index} 
                                  variants={listItemVariants}
                                  whileHover={{ scale: 1.02, x: 4 }}
                                  whileTap={{ scale: 0.98 }}
                                  className={`flex items-center justify-between cursor-pointer p-3 rounded-lg transition-all duration-200 bg-muted/30 hover:bg-muted/50 border border-border/50 ${isNegative ? 'ring-1 ring-red-500/30' : ''}`}
                                  onClick={() => {
                                    window.location.href = `/social-feed?filter=all-posts&search=${encodeURIComponent(topic.topic)}`
                                  }}
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <p className={`font-semibold text-foreground ${isNegative ? 'text-red-400' : ''}`}>
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
                                </motion.div>
                              )
                            })}
                          </motion.div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* Topic Sentiment - Now in same row as Trending Topics (50-50 layout) */}
                  {enabledCards['topic-sentiment'] && (
                    <motion.div variants={listItemVariants} className="lg:col-span-1">
                      <TopicSentimentHeatmap />
                    </motion.div>
                  )}

                  {/* Row 4 - Opponent Narrative and Support Base */}
                  {enabledCards['opponent-narrative'] && (
                    <motion.div variants={listItemVariants} className="lg:col-span-2">
                      <OpponentNarrativeWatch
                        data={opponentData}
                        loading={opponentLoading}
                        error={opponentError}
                      />
                    </motion.div>
                  )}

                  {enabledCards['support-base'] && (
                    <motion.div variants={listItemVariants}>
                      <SupportBaseEnergy
                        data={supportBaseData}
                        loading={supportLoading}
                        error={supportError}
                      />
                    </motion.div>
                  )}
                </motion.div>

              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="space-y-6 animate-in fade-in duration-200">
                <StatsGrid timeRange={timeRange} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <TopicSentimentHeatmap />
                  </div>
                  <div>
                    <InfluencerTracker 
                      data={influencerData} 
                      loading={influencerLoading} 
                      error={influencerError} 
                    />
                  </div>
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

                  {/* Recent Activity removed - will be populated from real API data in future */}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <OpponentNarrativeWatch 
                      data={opponentData} 
                      loading={opponentLoading} 
                      error={opponentError} 
                    />
                  </div>
                  <div>
                    <SupportBaseEnergy 
                      data={supportBaseData} 
                      loading={supportLoading} 
                      error={supportError} 
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            </Tabs>
            </div>
            </main>
          </div>
        </PageLayout>
      </ProtectedRoute>
    )
  }