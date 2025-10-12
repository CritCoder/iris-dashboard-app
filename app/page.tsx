'use client'

import { PageLayout } from '@/components/layout/page-layout'
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
import { useState, useMemo } from 'react'
import { SegmentedControl } from '@/components/ui/segmented-control'
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  AlertTriangle, 
  Users, 
  MessageSquare, 
  Heart, 
  Share2,
  Eye,
  Clock,
  MapPin,
  Hash,
  BarChart3,
  Globe,
  Shield,
  Zap
} from 'lucide-react'

export default function Page() {
  const [range, setRange] = useState('24h')
  const [activeTab, setActiveTab] = useState('overview')

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
      case 'positive': return 'text-green-600 bg-green-50 border-green-200'
      case 'negative': return 'text-red-600 bg-red-50 border-red-200'
      case 'neutral': return 'text-gray-600 bg-gray-50 border-gray-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'mention': return MessageSquare
      case 'trend': return TrendingUp
      case 'alert': return AlertTriangle
      default: return Activity
    }
  }

  return (
    <PageLayout>
      <PageHeader
        title="Intelligence Dashboard"
        description="Real-time insights on narratives, opponents, and public sentiment"
        actions={
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <GlobalSearch />
            <SegmentedControl
              options={[
                { label: '24 Hours', value: '24h' },
                { label: '7 Days', value: '7d' },
                { label: '30 Days', value: '30d' },
              ]}
              value={range}
              onChange={setRange}
              className="w-full sm:w-[280px]"
            />
          </div>
        }
      />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-4 sm:py-8">
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={activeTab === 'overview' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </Button>
            <Button
              variant={activeTab === 'analytics' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('analytics')}
            >
              Analytics
            </Button>
            <Button
              variant={activeTab === 'monitoring' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('monitoring')}
            >
              Monitoring
            </Button>
          </div>

          {activeTab === 'overview' && (
            <>
              {/* Key Metrics Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Mentions</p>
                        <p className="text-2xl font-bold text-foreground">12,847</p>
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          +12.5% from last week
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Sentiment Score</p>
                        <p className="text-2xl font-bold text-foreground">68%</p>
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          +3.2% from last week
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <Heart className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Active Campaigns</p>
                        <p className="text-2xl font-bold text-foreground">8</p>
                        <p className="text-xs text-blue-600 flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          3 new this week
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Threat Level</p>
                        <p className="text-2xl font-bold text-foreground">Low</p>
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          No alerts
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
                {/* Left Column - Analytics */}
                <div className="lg:col-span-2 space-y-6">
                  <TopicSentimentHeatmap />
                  <InfluencerTracker />
                </div>

                {/* Right Column - Activity & Alerts */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5" />
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
                                    <Clock className="w-3 h-3" />
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

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Trending Topics
                      </CardTitle>
                      <CardDescription>Most discussed topics today</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {trendingTopics.map((topic, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground">{topic.topic}</p>
                              <p className="text-xs text-muted-foreground">{topic.mentions} mentions</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={`text-xs ${getSentimentColor(topic.sentiment)}`}>
                                {topic.sentiment}
                              </Badge>
                              <span className={`text-xs font-medium ${
                                topic.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {topic.change}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <OpponentNarrativeWatch />
                <SupportBaseEnergy />
              </div>
            </>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <StatsGrid />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <TopicSentimentHeatmap />
                <InfluencerTracker />
              </div>
            </div>
          )}

          {activeTab === 'monitoring' && (
            <div className="space-y-6">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Zap className="w-4 h-4 text-green-600" />
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
                          <Users className="w-4 h-4 text-purple-600" />
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
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <OpponentNarrativeWatch />
                <SupportBaseEnergy />
              </div>
            </div>
          )}
        </div>
      </main>
    </PageLayout>
  )
}