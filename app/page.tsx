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
import { useState, useMemo, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Settings, Grid3X3, Eye, EyeOff } from 'lucide-react'
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
  PinIcon,
  BarChartIcon,
  GlobeIcon,
  LightningBoltIcon,
  ExclamationTriangleIcon
} from '@radix-ui/react-icons'
// import { AnimatedPage, div, Card } from '@/components/ui/animated'

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

  // Sample data for the new dashboard sections
  const recentActivity = [
    { id: 1, type: 'mention', content: 'Bengaluru Police mentioned in viral post', time: '2m ago', sentiment: 'positive' },
    { id: 2, type: 'trend', content: 'Traffic management trending up', time: '5m ago', sentiment: 'neutral' },
    { id: 3, type: 'alert', content: 'Negative sentiment spike detected', time: '8m ago', sentiment: 'negative' },
    { id: 4, type: 'mention', content: 'New influencer post about police reforms', time: '12m ago', sentiment: 'positive' },
    { id: 5, type: 'trend', content: 'Crime prevention discussions rising', time: '15m ago', sentiment: 'positive' }
  ]

  const topInfluencers = [
    { name: 'Rahul Gandhi', platform: 'Twitter', followers: '28.2M', engagement: '4.2%', sentiment: 'positive' },
    { name: 'AajTak', platform: 'Twitter', followers: '24.5M', engagement: '3.8%', sentiment: 'neutral' },
    { name: 'NDTV', platform: 'Twitter', followers: '18.9M', engagement: '3.5%', sentiment: 'neutral' },
    { name: 'Times of India', platform: 'Twitter', followers: '15.2M', engagement: '3.1%', sentiment: 'positive' }
  ]

  const trendingTopics = [
    { topic: 'Police Reforms', mentions: 1250, change: '+15%', sentiment: 'positive' },
    { topic: 'Traffic Management', mentions: 890, change: '-8%', sentiment: 'negative' },
    { topic: 'Crime Prevention', mentions: 2100, change: '+22%', sentiment: 'positive' },
    { topic: 'Community Outreach', mentions: 1560, change: '+5%', sentiment: 'positive' }
  ]

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
    console.log('Toggling card:', cardId, 'Current state:', enabledCards[cardId])
    setEnabledCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }))
  }

  const toggleAllCards = () => {
    const allEnabled = Object.values(enabledCards).every(Boolean)
    const newState = !allEnabled
    console.log('Toggling all cards:', { allEnabled, newState })
    const newEnabledCards = {}
    Object.keys(enabledCards).forEach(key => {
      newEnabledCards[key] = newState
    })
    setEnabledCards(newEnabledCards)
  }

  return (
    <ProtectedRoute>
      <PageLayout>
      <PageHeader
        title="Intelligence Dashboard"
        description="Real-time insights on narratives, opponents, and public sentiment"
        actions={
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <GlobalSearch />
            <Button
              variant={isCustomizing ? "default" : "outline"}
              size="sm"
              onClick={() => setIsCustomizing(!isCustomizing)}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              {isCustomizing ? 'Exit Customize' : 'Customize'}
            </Button>
          </div>
        }
      />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-4 sm:py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between mb-6">
              <TabsList>
                <TabsTrigger value="overview">📊 Overview</TabsTrigger>
                <TabsTrigger value="analytics">📈 Analytics</TabsTrigger>
                <TabsTrigger value="monitoring">🔍 Monitoring</TabsTrigger>
              </TabsList>
              <Tabs value={range} onValueChange={setRange}>
                <TabsList>
                  <TabsTrigger value="24h">24 Hours</TabsTrigger>
                  <TabsTrigger value="7d">7 Days</TabsTrigger>
                  <TabsTrigger value="30d">30 Days</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Customization Panel - Global for all tabs */}
            {isCustomizing && (
              <div className="mb-6 p-6 bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Grid3X3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Customize Dashboard</h3>
                    <Badge variant="secondary" className="text-xs">
                      {Object.values(enabledCards).filter(Boolean).length} of {Object.keys(enabledCards).length} enabled
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleAllCards}
                    className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    {Object.values(enabledCards).every(Boolean) ? (
                      <>
                        <EyeOff className="w-4 h-4" />
                        Hide All
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        Show All
                      </>
                    )}
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {dashboardCards.map((card) => (
                    <div
                      key={card.id}
                      className={`p-4 border-2 rounded-lg transition-all duration-200 cursor-pointer hover:shadow-md ${
                        enabledCards[card.id]
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-md'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800/50 hover:border-blue-300'
                      }`}
                      onClick={() => toggleCard(card.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id={card.id}
                          checked={enabledCards[card.id]}
                          onCheckedChange={() => toggleCard(card.id)}
                          className="mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <card.icon className={`w-4 h-4 ${enabledCards[card.id] ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'}`} />
                            <span className={`text-sm font-medium ${enabledCards[card.id] ? 'text-blue-900 dark:text-blue-100' : 'text-foreground'}`}>
                              {card.title}
                            </span>
                            {enabledCards[card.id] && (
                              <Badge variant="default" className="text-xs bg-blue-600 text-white">
                                Active
                              </Badge>
                            )}
                          </div>
                          <p className={`text-xs mt-1 ${enabledCards[card.id] ? 'text-blue-700 dark:text-blue-300' : 'text-muted-foreground'}`}>
                            {card.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
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
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-medium text-blue-300 uppercase tracking-wide">Total Mentions</p>
                            <p className="text-3xl font-black text-white mb-1">12,847</p>
                            <p className="text-xs text-green-400 flex items-center gap-1 font-bold">
                              <TrendingUp className="w-3 h-3" />
                              +12.5% from last week
                            </p>
                          </div>
                          <div className="w-14 h-14 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
                            <ChatBubbleIcon className="w-7 h-7 text-blue-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Card>
                )}

                {enabledCards['sentiment-score'] && (
                  <Card>
                    <Card className="border-2 border-green-500/30 bg-gradient-to-br from-green-950/40 to-green-900/20 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-medium text-green-300 uppercase tracking-wide">Sentiment Score</p>
                            <p className="text-3xl font-black text-white mb-1">68%</p>
                            <p className="text-xs text-green-400 flex items-center gap-1 font-bold">
                              <TrendingUp className="w-3 h-3" />
                              +3.2% from last week
                            </p>
                          </div>
                          <div className="w-14 h-14 rounded-xl bg-green-500/20 border border-green-400/30 flex items-center justify-center">
                            <HeartIcon className="w-7 h-7 text-green-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Card>
                )}

                {enabledCards['active-campaigns'] && (
                  <Card>
                    <Card className="border border-border/50 bg-card/50">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Active Campaigns</p>
                            <p className="text-2xl font-bold text-foreground">8</p>
                            <p className="text-xs text-blue-500 flex items-center gap-1 font-medium">
                              <ActivityLogIcon className="w-3 h-3" />
                              3 new this week
                            </p>
                          </div>
                          <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                            <BarChartIcon className="w-6 h-6 text-purple-400" />
                          </div>
                        </div>
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
                        <CardDescription className="text-orange-200/80">Most discussed topics today</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {trendingTopics.map((topic, index) => {
                            const isHighVolume = topic.mentions > 1500
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
                                    <span className="font-bold text-orange-400">{topic.mentions}</span> mentions
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
                                  <span className={`text-xs font-black ${
                                    topic.change.startsWith('+') 
                                      ? 'text-green-400' 
                                      : 'text-red-400'
                                  }`}>
                                    {topic.change}
                                  </span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
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
                    <InfluencerTracker />
                  </Card>
                )}

                {enabledCards['opponent-narrative'] && (
                  <Card className="lg:col-span-2">
                    <OpponentNarrativeWatch />
                  </Card>
                )}

                {enabledCards['support-base'] && (
                  <Card>
                    <SupportBaseEnergy />
                  </Card>
                )}
              </div>

            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6 animate-in fade-in duration-200">
              <StatsGrid />
              <div stagger={0.1} className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <Card>
                  <TopicSentimentHeatmap />
                </Card>
                <Card>
                  <InfluencerTracker />
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

              <div stagger={0.1} className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <Card>
                  <OpponentNarrativeWatch />
                </Card>
                <Card>
                  <SupportBaseEnergy />
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