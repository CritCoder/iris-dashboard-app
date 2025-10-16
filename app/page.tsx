'use client'

import { PageLayout } from '@/components/layout/page-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { api } from '@/lib/api'

// Utility function to format numbers
const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

// Utility function to format dates
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Utility function to get sentiment color
const getSentimentColor = (score: number) => {
  if (score > 0.2) return 'text-green-400'
  if (score < -0.2) return 'text-red-400'
  return 'text-yellow-400'
}

// Utility function to get sentiment percentage color
const getSentimentPercentageColor = (percentage: number) => {
  if (percentage >= 60) return 'text-green-400'
  if (percentage >= 40) return 'text-gray-400'
  return 'text-red-400'
}

// Component for progress bar
const ProgressBar = ({ percentage, color = 'bg-cyan-500' }: { percentage: number; color?: string }) => (
  <div className={cn('w-full h-2 bg-gray-800 rounded-full overflow-hidden')}>
    <div 
      className={cn(`h-full ${color} transition-all duration-500`)}
      style={{ width: `${percentage}%` }}
    />
  </div>
)

// Component for sentiment bar chart
const SentimentBar = ({ positive, neutral, negative }: { positive: number; neutral: number; negative: number }) => (
  <div className={cn('w-full h-3 flex rounded-full overflow-hidden')}>
    <div 
      className={cn('bg-green-500 transition-all duration-500')}
      style={{ width: `${positive}%` }}
      title={`${positive}% Positive`}
    />
    <div 
      className={cn('bg-gray-500 transition-all duration-500')}
      style={{ width: `${neutral}%` }}
      title={`${neutral}% Neutral`}
    />
    <div 
      className={cn('bg-red-500 transition-all duration-500')}
      style={{ width: `${negative}%` }}
      title={`${negative}% Negative`}
    />
  </div>
)

interface DashboardData {
  quickStats: any
  campaignThemes: any
  influencerTracker: any
  opponentNarratives: any
  supportBaseEnergy: any
}

interface LoadingStates {
  quickStats: boolean
  campaignThemes: boolean
  influencerTracker: boolean
  opponentNarratives: boolean
  supportBaseEnergy: boolean
}

export default function Page() {
  const [data, setData] = useState<DashboardData>({
    quickStats: null,
    campaignThemes: null,
    influencerTracker: null,
    opponentNarratives: null,
    supportBaseEnergy: null
  })

  // Individual loading states for each section
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    quickStats: true,
    campaignThemes: true,
    influencerTracker: true,
    opponentNarratives: true,
    supportBaseEnergy: true
  })

  const [timeRange, setTimeRange] = useState('7d') // 7d, 30d, 90d, 1y
  const [influencerTopics, setInfluencerTopics] = useState<Record<string, string>>({})
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Reset loading states when time range changes
  useEffect(() => {
    setLoadingStates({
      quickStats: true,
      campaignThemes: true,
      influencerTracker: true,
      opponentNarratives: true,
      supportBaseEnergy: true
    })
  }, [timeRange])

  useEffect(() => {
    const fetchDashboardData = async () => {
      console.log('🚀 Fetching dashboard data from API routes...')

      // Fetch Quick Stats independently using API client
      api.political.getQuickStats({ timeRange, cached: true })
        .then(result => {
          console.log('  - Quick Stats:', result.success ? '✅' : '❌')
          if (result.success) {
            setData(prev => ({ ...prev, quickStats: result.data }))
          }
        })
        .catch(error => console.error('Quick Stats error:', error))
        .finally(() => setLoadingStates(prev => ({ ...prev, quickStats: false })))

      // Fetch Campaign Themes independently using API client
      api.political.getCampaignThemes({ timeRange, cached: true })
        .then(result => {
          console.log('  - Campaign Themes:', result.success ? '✅' : '❌')
          if (result.success) {
            setData(prev => ({ ...prev, campaignThemes: result.data }))
          }
        })
        .catch(error => console.error('Campaign Themes error:', error))
        .finally(() => setLoadingStates(prev => ({ ...prev, campaignThemes: false })))

      // Fetch Influencer Tracker independently using API client
      api.political.getInfluencerTracker({ timeRange, cached: true })
        .then(async (result) => {
          console.log('  - Influencer Tracker:', result.success ? '✅' : '❌')
          if (result.success) {
            setData(prev => ({ ...prev, influencerTracker: result.data }))
            
            // Fetch AI analysis topics for each influencer
            const influencerData = result.data as any
            if (influencerData?.influencers) {
              const topicsPromises = influencerData.influencers.slice(0, 12).map(async (influencer: any) => {
                try {
                  const aiResult = await api.profile.getAIAnalysis(influencer.id)
                  const aiData = aiResult.data as any
                  if (aiResult.success && aiData?.topics?.[0]) {
                    return {
                      id: influencer.id,
                      topic: aiData.topics[0].name
                    }
                  }
                } catch (error) {
                  console.error(`Failed to fetch AI analysis for influencer ${influencer.id}:`, error)
                }
                return {
                  id: influencer.id,
                  topic: 'No topics found'
                }
              })
              
              const topicsResults = await Promise.all(topicsPromises)
              const topicsMap: Record<string, string> = {}
              topicsResults.forEach((result: any) => {
                topicsMap[result.id] = result.topic
              })
              setInfluencerTopics(topicsMap)
            }
          }
        })
        .catch(error => console.error('Influencer Tracker error:', error))
        .finally(() => setLoadingStates(prev => ({ ...prev, influencerTracker: false })))

      // Fetch Opponent Narratives independently using API client
      api.political.getOpponentNarratives({ timeRange, cached: true })
        .then(result => {
          console.log('  - Opponent Narratives:', result.success ? '✅' : '❌')
          if (result.success) {
            setData(prev => ({ ...prev, opponentNarratives: result.data }))
          }
        })
        .catch(error => console.error('Opponent Narratives error:', error))
        .finally(() => setLoadingStates(prev => ({ ...prev, opponentNarratives: false })))

      // Fetch Support Base Energy independently using API client
      api.political.getSupportBaseEnergy({ timeRange, cached: true })
        .then(result => {
          console.log('  - Support Base Energy:', result.success ? '✅' : '❌')
          if (result.success) {
            setData(prev => ({ ...prev, supportBaseEnergy: result.data }))
          }
        })
        .catch(error => console.error('Support Base Energy error:', error))
        .finally(() => setLoadingStates(prev => ({ ...prev, supportBaseEnergy: false })))

      // Force re-render after initial load to fix grid layout issues
      setTimeout(() => {
        setIsInitialLoad(false)
      }, 100)
    }

    fetchDashboardData()
  }, [timeRange])

  // Handle window resize to fix grid layout issues
  useEffect(() => {
    const handleResize = () => {
      // Force a small re-render to recalculate grid layouts
      if (!isInitialLoad) {
        setIsInitialLoad(true)
        setTimeout(() => setIsInitialLoad(false), 50)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isInitialLoad])

  return (
    <PageLayout>
      <div className={cn('theme-default bg-background text-foreground min-h-screen')}>
        <div className={cn('w-full max-w-[1600px] mx-auto px-4 lg:px-8 py-6 space-y-6')} style={{ contain: 'layout' }}>
            <div className={cn('flex items-start justify-between')}>
              <div>
                <h1 className={cn('text-4xl font-semibold leading-tight cyber-text')}>Intelligence Dashboard</h1>
                <p className={cn('text-lg text-muted-foreground mt-1')}>Real-time insights on narratives, opponents, and public sentiment</p>
              </div>
              <div className={cn('flex items-center gap-2 text-sm')}>
                <button
                  onClick={() => setTimeRange('7d')}
                  className={cn('rounded-md px-4 py-3 transition-all', timeRange === '7d' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-muted-foreground hover:bg-white/10')}
                >
                  7 Days
                </button>
                <button
                  onClick={() => setTimeRange('30d')}
                  className={cn('rounded-md px-4 py-3 transition-all', timeRange === '30d' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-muted-foreground hover:bg-white/10')}
                >
                  30 Days
                </button>
                <button
                  onClick={() => setTimeRange('90d')}
                  className={cn('rounded-md px-4 py-3 transition-all', timeRange === '90d' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-muted-foreground hover:bg-white/10')}
                >
                  90 Days
                </button>
                <button
                  onClick={() => setTimeRange('1y')}
                  className={cn('rounded-md px-4 py-3 transition-all', timeRange === '1y' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-muted-foreground hover:bg-white/10')}
                >
                  1 Year
                </button>
              </div>
            </div>

            {/* Quick Stats - Hidden Active Campaigns */}
            {loadingStates.quickStats ? (
              <div className={cn('grid gap-4', isInitialLoad ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', 'min-w-0')}>
                {[1, 2, 3].map(i => (
                  <Card key={i} className={cn('bg-white/5 border-0 min-w-[200px] w-full')}>
                    <CardContent className={cn('pt-6')}>
                      <div className={cn('text-center')}>
                        <div className={cn('h-10 bg-gray-700/50 rounded animate-pulse mb-2')} />
                        <div className={cn('h-6 bg-gray-700/50 rounded animate-pulse')} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : data.quickStats && (
              <div className={cn('grid gap-4', isInitialLoad ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', 'min-w-0')}>
              {/* Total Campaigns card hidden */}
                <Card className={cn('bg-white/5 border-0 min-w-[200px] w-full')}>
                  <CardContent className={cn('pt-6')}>
                    <div className={cn('text-center')}>
                      <div className={cn('text-4xl font-bold cyber-text')}>
                        {formatNumber(data.quickStats.overview?.totalPosts || 0)}
                      </div>
                      <div className={cn('text-lg text-muted-foreground mt-1')}>Total Posts</div>
                      <ProgressBar percentage={Math.min(100, (data.quickStats.overview?.totalPosts || 0) / 200)} color="bg-cyan-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card className={cn('bg-white/5 border-0 min-w-[200px] w-full')}>
                  <CardContent className={cn('pt-6')}>
                    <div className={cn('text-center')}>
                      <div className={cn('text-4xl font-bold cyber-text')}>
                        {formatNumber(data.quickStats.overview?.totalEngagement || 0)}
                      </div>
                      <div className={cn('text-lg text-muted-foreground mt-1')}>Total Engagement</div>
                      <ProgressBar percentage={Math.min(100, (data.quickStats.overview?.totalEngagement || 0) / 15000)} color="bg-cyan-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card className={cn('bg-white/5 border-0 min-w-[200px] w-full')}>
                  <CardContent className={cn('pt-6')}>
                    <div className={cn('text-center')}>
                      <div className={cn('text-4xl font-bold cyber-text', getSentimentPercentageColor(data.quickStats.sentiment?.positive?.percentage || 0))}>
                        {data.quickStats.sentiment?.positive?.percentage || 0}%
                      </div>
                      <div className={cn('text-lg text-muted-foreground mt-1')}>Positive Sentiment</div>
                      <div className={cn('mt-2')}>
                        <SentimentBar 
                          positive={data.quickStats.sentiment?.positive?.percentage || 0}
                          neutral={data.quickStats.sentiment?.neutral?.percentage || 0}
                          negative={data.quickStats.sentiment?.negative?.percentage || 0}
                        />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            )}

            {/* Trending Campaigns section */}
            <Card className={cn('bg-white/5 border-0')}>
              <CardHeader>
                <div className={cn('flex items-start justify-between gap-3')}>
                  <div>
                    <CardTitle className={cn('cyber-text')}>Trending Campaigns</CardTitle>
                    <p className={cn('text-sm text-muted-foreground mt-1')}>
                      {loadingStates.campaignThemes ? 'Loading...' : `${data.campaignThemes?.summary?.totalCampaigns || 0} campaigns categorized by sentiment`}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loadingStates.campaignThemes ? (
                  <div className={cn('h-64 rounded-md bg-white/5 flex items-center justify-center')}>
                    <div className={cn('text-muted-foreground animate-pulse')}>Loading campaign themes...</div>
                  </div>
                ) : data.campaignThemes ? (
                  <div className={cn('space-y-4')}>
                    {data.campaignThemes.summary && (
                      <div>
                        <div className={cn('text-lg font-semibold mb-3 flex items-center gap-2')}>
                          <span>Summary Statistics</span>
                          <Badge className={cn('bg-gray-500/20 text-gray-400 border-gray-500/30')}>
                            Overview
                          </Badge>
                        </div>
                        <div className={cn('grid gap-4', isInitialLoad ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4', 'min-w-0')}>
                          <Card className={cn('bg-white/5 border-0 min-w-[180px]')}>
                            <CardContent className={cn('pt-6')}>
                              <div className={cn('text-center')}>
                                <div className={cn('text-4xl font-bold cyber-text')}>
                                  {data.campaignThemes.summary.totalCampaigns || 0}
                                </div>
                                <div className={cn('text-lg text-muted-foreground mt-1')}>Total Campaigns</div>
                              </div>
                            </CardContent>
                          </Card>
                          <Card className={cn('bg-white/5 border-0 min-w-[180px]')}>
                            <CardContent className={cn('pt-6')}>
                              <div className={cn('text-center')}>
                                <div className={cn('text-4xl font-bold cyber-text text-green-400')}>
                                  {data.campaignThemes.summary.positiveCount}
                                </div>
                                <div className={cn('text-lg text-muted-foreground mt-1')}>Positive</div>
                              </div>
                            </CardContent>
                          </Card>
                          <Card className={cn('bg-white/5 border-0 min-w-[180px]')}>
                            <CardContent className={cn('pt-6')}>
                              <div className={cn('text-center')}>
                                <div className={cn('text-4xl font-bold cyber-text text-red-400')}>
                                  {data.campaignThemes.summary.negativeCount}
                                </div>
                                <div className={cn('text-lg text-muted-foreground mt-1')}>Negative</div>
                              </div>
                            </CardContent>
                          </Card>
                          <Card className={cn('bg-white/5 border-0 min-w-[180px]')}>
                            <CardContent className={cn('pt-6')}>
                              <div className={cn('text-center')}>
                                <div className={cn('text-4xl font-bold cyber-text')}>
                                  {data.campaignThemes.summary.neutralCount || 0}
                                </div>
                                <div className={cn('text-lg text-muted-foreground mt-1')}>Neutral</div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    )}

                    {Object.values(data.campaignThemes.themes || {}).some((campaigns: any) => campaigns.length > 0) ? (
                    <div className={cn('grid gap-4', isInitialLoad ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3', 'min-w-0')}>
                      {Object.entries(data.campaignThemes.themes || {}).map(([themeType, campaigns]: [string, any]) => (
                        campaigns.length > 0 && (
                          <div key={themeType} className={cn('p-3 rounded', 
                            themeType === 'positive' ? 'bg-green-500/10' :
                            themeType === 'negative' ? 'bg-red-500/10' :
                            'bg-gray-500/10'
                          )}>
                            <div className={cn('flex items-center justify-between mb-3')}>
                              <h4 className={cn('text-lg font-semibold capitalize', 
                                themeType === 'positive' ? 'text-green-400' :
                                themeType === 'negative' ? 'text-red-400' :
                                'text-gray-400'
                              )}>
                                {themeType}
                              </h4>
                              <Badge className={cn(
                                themeType === 'positive' ? 'bg-green-500/20 text-green-400' :
                                themeType === 'negative' ? 'bg-red-500/20 text-red-400' :
                                'bg-gray-500/20 text-gray-400'
                              )}>
                                {campaigns.length}
                              </Badge>
                            </div>
                            
                            <div className={cn('space-y-2')}>
                              {campaigns.slice(0, 5).map((campaign: any) => (
                                <div 
                                  key={campaign.campaignId} 
                                  onClick={() => window.location.href = `/campaign/${campaign.campaignId}`}
                                  className={cn('p-2 rounded bg-black/30 cursor-pointer hover:bg-black/50 transition-all')}
                                >
                                  <div className={cn('font-semibold text-sm text-cyan-400 truncate mb-1')}>
                                    {campaign.campaignName}
                                  </div>
                                  
                                  <div className={cn('flex justify-between text-xs text-muted-foreground')}>
                                    <span>{campaign.metrics?.totalPosts || 0} posts</span>
                                    <span>{formatNumber(campaign.metrics?.totalEngagement || 0)} eng</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                    ) : (
                      <div className={cn('h-32 rounded-md bg-white/5 flex items-center justify-center')}>
                        <div className={cn('text-center')}>
                          <div className={cn('text-muted-foreground mb-2')}>No campaign themes found</div>
                          <div className={cn('text-sm text-muted-foreground/60')}>
                            Check console logs for data structure
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                ) : (
                  <div className={cn('h-64 rounded-md bg-white/5 flex items-center justify-center')}>
                    <div className={cn('text-muted-foreground')}>No campaign themes data available</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Amplifiers */}
            <Card className={cn('bg-white/5 border-0')}>
              <CardHeader>
                <CardTitle className={cn('cyber-text')}>Top Amplifiers</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingStates.supportBaseEnergy ? (
                  <div className={cn('h-64 rounded-md bg-white/5 flex items-center justify-center')}>
                    <div className={cn('text-muted-foreground animate-pulse')}>Loading amplifiers...</div>
                  </div>
                ) : data.supportBaseEnergy ? (
                  data.supportBaseEnergy.amplifiers && data.supportBaseEnergy.amplifiers.length > 0 ? (
                  <div className={cn('grid gap-4', isInitialLoad ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', 'min-w-0')}>
                    {data.supportBaseEnergy.amplifiers.slice(0, 9).map((amplifier: any, index: number) => (
                      <div key={index} className={cn('p-2 rounded bg-cyan-500/10 hover:bg-cyan-500/20 transition-all min-w-[250px]')}>
                        <div className={cn('flex items-center gap-2 mb-2')}>
                          <div className={cn('w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white text-sm font-bold')}>
                            {amplifier.displayName?.charAt(0) || amplifier.username?.charAt(0) || '?'}
                          </div>
                          <div className={cn('flex-1 min-w-0')}>
                            <div className={cn('font-semibold text-sm flex items-center gap-1 truncate')}>
                              {amplifier.displayName || amplifier.username}
                              {amplifier.verified && <span className={cn('text-cyan-400')}>✓</span>}
                            </div>
                            <div className={cn('text-xs text-muted-foreground truncate')}>
                              @{amplifier.username}
                            </div>
                          </div>
                          {amplifier.profileUrl && (
                            <a 
                              href={amplifier.profileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={cn('text-cyan-400 hover:text-cyan-300 transition-colors')}
                              title="View Profile"
                            >
                              <svg className={cn('w-4 h-4')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          )}
                        </div>

                            <div className={cn('grid grid-cols-2 gap-1 text-xs mb-2')}>
                              <div className={cn('text-center p-1 rounded bg-gray-500/10')}>
                                <div className={cn('font-bold text-cyan-400')}>{formatNumber(amplifier.followers || 0)}</div>
                                <div className={cn('text-muted-foreground')}>Followers</div>
                              </div>
                              <div className={cn('text-center p-1 rounded bg-gray-500/10')}>
                                <div className={cn('font-bold text-cyan-400')}>{formatNumber(amplifier.engagement?.totalEngagement || 0)}</div>
                                <div className={cn('text-muted-foreground')}>Engagement</div>
                              </div>
                            </div>

                        <div className={cn('mt-1')}>
                          <ProgressBar percentage={Math.min(100, (amplifier.followers || 0) / 1000000 * 100)} color="bg-cyan-500" />
                        </div>

                        {/* Go to Posts Button */}
                        <button
                          onClick={() => {
                            // Navigate to profiles page with the profile data
                            const profilesUrl = `/profiles?profileId=${amplifier.id}&username=${encodeURIComponent(amplifier.username)}&platform=${amplifier.platform}`;
                            window.location.href = profilesUrl;
                          }}
                          className={cn('w-full mt-2 px-3 py-2 text-xs bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 transition-all')}
                        >
                          Go to Posts
                        </button>
                      </div>
                    ))}
                  </div>
                  ) : (
                    <div className={cn('h-64 rounded-md bg-white/5 flex items-center justify-center')}>
                      <div className={cn('text-center')}>
                        <div className={cn('text-muted-foreground mb-2')}>No amplifiers found</div>
                        <div className={cn('text-sm text-muted-foreground/60')}>
                          Check console logs for data: {data.supportBaseEnergy.amplifiers?.length || 0} amplifiers in response
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <div className={cn('h-64 rounded-md bg-white/5 flex items-center justify-center')}>
                    <div className={cn('text-muted-foreground')}>No amplifier data available</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Trending Hashtags */}
              <Card className={cn('bg-white/5 border-0')}>
                <CardHeader>
                <CardTitle className={cn('cyber-text')}>Trending Hashtags</CardTitle>
                </CardHeader>
                <CardContent>
                {loadingStates.supportBaseEnergy ? (
                  <div className={cn('h-64 rounded-md bg-white/5 flex items-center justify-center')}>
                    <div className={cn('text-muted-foreground animate-pulse')}>Loading trending hashtags...</div>
                  </div>
                ) : data.supportBaseEnergy ? (
                  <div className={cn('space-y-4')}>
                    {/* All Trending Topics */}
                    <div>
                      <div className={cn('text-lg font-semibold mb-3 flex items-center gap-2')}>
                        <span>All Trending Topics</span>
                      </div>
                      {data.supportBaseEnergy.trendingTopics && data.supportBaseEnergy.trendingTopics.length > 0 ? (
                      <div className={cn('grid gap-4', isInitialLoad ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5', 'min-w-0')}>
                        {data.supportBaseEnergy.trendingTopics
                          .sort((a: any, b: any) => (b.engagement?.totalEngagement || 0) - (a.engagement?.totalEngagement || 0))
                          .slice(0, 3).map((topic: any, index: number) => (
                          <div key={index} className={cn('p-2 rounded bg-cyan-500/10 min-w-[200px]')}>
                            <div className={cn('flex items-center justify-between mb-1')}>
                              <div className={cn('font-semibold text-sm text-cyan-400 truncate')}>
                                {topic.type === 'hashtag' ? '#' : ''}{topic.topic}
                              </div>
                            </div>
                            
                            <div className={cn('text-center p-2 rounded bg-black/30 mb-1')}>
                              <div className={cn('text-lg font-bold text-green-400')}>{formatNumber(topic.engagement?.totalEngagement || 0)}</div>
                              <div className={cn('text-xs text-muted-foreground')}>Engagement</div>
                            </div>

                            {/* Sentiment Bar */}
                            {topic.sentiment && (
                              <div className={cn('mb-1')}>
                                <SentimentBar 
                                  positive={topic.sentiment.positive || 0}
                                  neutral={topic.sentiment.neutral || 0}
                                  negative={topic.sentiment.negative || 0}
                                />
                              </div>
                            )}

                            {/* Platforms */}
                            <div className={cn('flex gap-1 flex-wrap')}>
                              {topic.platforms?.map((platform: string, i: number) => (
                                <span key={i} className={cn('text-xs px-2 py-1 rounded bg-cyan-500/20 text-cyan-400')}>
                                  {platform}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      ) : (
                        <div className={cn('h-32 rounded-md bg-white/5 flex items-center justify-center')}>
                          <div className={cn('text-center')}>
                            <div className={cn('text-muted-foreground mb-2')}>No trending topics found</div>
                            <div className={cn('text-sm text-muted-foreground/60')}>
                              Check console logs for data: {data.supportBaseEnergy.trendingTopics?.length || 0} topics in response
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Platform Trending Topics */}
                    {data.supportBaseEnergy.platformTrending && (
                      <div>
                        <div className={cn('text-lg font-semibold mb-3 flex items-center gap-2')}>
                          <span>Platform Trending</span>
                        </div>
                        <div className={cn('grid gap-4', isInitialLoad ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3', 'min-w-0')}>
                          {Object.entries(data.supportBaseEnergy.platformTrending)
                            .filter(([platform]) => platform !== 'youtube' && platform !== 'linkedin')
                            .map(([platform, topics]: [string, any]) => (
                            <div key={platform} className={cn('p-3 rounded bg-cyan-500/10 min-w-[280px]')}>
                              <div className={cn('font-semibold text-lg text-cyan-400 mb-2 capitalize')}>
                                {platform}
                              </div>
                              <div className={cn('space-y-2')}>
                                {topics?.slice(0, 5).map((topic: any, index: number) => (
                                  <div key={index} className={cn('p-2 rounded bg-black/30')}>
                                    <div className={cn('font-semibold text-sm text-cyan-400')}>
                                      {topic.type === 'hashtag' ? '#' : ''}{topic.topic}
                                    </div>
                                    <div className={cn('text-xs text-muted-foreground')}>
                                      {topic.mentions} mentions · {formatNumber(topic.totalEngagement)} engagement
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                ) : (
                  <div className={cn('h-64 rounded-md bg-white/5 flex items-center justify-center')}>
                    <div className={cn('text-muted-foreground')}>No trending hashtags data available</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Influencer Tracker - Expanded */}
            <Card className={cn('bg-white/5 border-0')}>
              <CardHeader>
                <CardTitle className={cn('cyber-text')}>Influencers</CardTitle>
              </CardHeader>
                <CardContent>
                  {loadingStates.influencerTracker ? (
                    <div className={cn('h-96 rounded-md bg-white/5 flex items-center justify-center')}>
                      <div className={cn('text-muted-foreground animate-pulse')}>Loading influencer data...</div>
                    </div>
                  ) : data.influencerTracker ? (
                    <div className={cn('grid gap-4', isInitialLoad ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3', 'min-w-0')}>
                      {data.influencerTracker.influencers?.slice(0, 12).map((influencer: any, index: number) => (
                        <div key={influencer.id} className={cn('p-2 rounded bg-cyan-500/10 hover:bg-cyan-500/20 transition-all min-w-[280px]')}>
                          <div className={cn('flex items-center gap-2 mb-2')}>
                            <div className={cn('w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white text-sm font-bold')}>
                              {influencer.displayName?.charAt(0) || influencer.username?.charAt(0) || '?'}
                            </div>
                            <div className={cn('flex-1 min-w-0')}>
                              <div className={cn('font-semibold text-sm flex items-center gap-1 truncate')}>
                                {influencer.displayName || influencer.username}
                                {influencer.verified && <span className={cn('text-cyan-400')}>✓</span>}
                              </div>
                              <div className={cn('text-xs text-muted-foreground truncate')}>
                                @{influencer.username} · {influencer.platform}
                              </div>
                              {influencer.profileUrl && (
                                <div className={cn('text-xs text-cyan-400 truncate')} title={influencer.profileUrl}>
                                  {influencer.profileUrl}
                                </div>
                              )}
                            </div>
                            {influencer.profileUrl && (
                              <a 
                                href={influencer.profileUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={cn('text-cyan-400 hover:text-cyan-300 transition-colors')}
                                title="View Profile"
                              >
                                <svg className={cn('w-4 h-4')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            )}
                          </div>
                          
                          <div className={cn('grid grid-cols-2 gap-1 mb-2')}>
                            <div className={cn('text-center p-1 rounded bg-gray-500/10')}>
                              <div className={cn('text-sm font-bold text-cyan-400')}>{formatNumber(influencer.engagement?.totalEngagement || 0)}</div>
                              <div className={cn('text-xs text-muted-foreground')}>Engagement</div>
                            </div>
                            <div className={cn('text-center p-1 rounded bg-gray-500/10')}>
                              <div className={cn('text-sm font-bold text-cyan-400 truncate')} title={influencerTopics[influencer.id] || 'Loading...'}>
                                {influencerTopics[influencer.id] || 'Loading...'}
                              </div>
                              <div className={cn('text-xs text-muted-foreground')}>Top Topic</div>
                            </div>
                          </div>

                          {/* Sentiment Breakdown */}
                          {influencer.engagement?.sentimentBreakdown && (
                            <div className={cn('mb-2')}>
                              <SentimentBar 
                                positive={influencer.engagement.sentimentBreakdown.positive || 0}
                                neutral={influencer.engagement.sentimentBreakdown.neutral || 0}
                                negative={influencer.engagement.sentimentBreakdown.negative || 0}
                              />
                            </div>
                          )}

                          {influencer.viralContent && (
                            <div className={cn('mt-1 p-2 rounded bg-cyan-500/20 text-xs')}>
                              <div className={cn('text-cyan-400 font-semibold mb-1 flex items-center gap-1')}>
                                Viral ({formatNumber(influencer.viralContent.engagement || 0)})
                              </div>
                              <div className={cn('text-muted-foreground line-clamp-2')}>
                                {influencer.viralContent.content}
                              </div>
                            </div>
                          )}

                          {/* Go to Posts Button */}
                          <button
                            onClick={() => {
                              // Navigate to profiles page with the profile data
                              const profilesUrl = `/profiles?profileId=${influencer.profileId || influencer.id}&username=${encodeURIComponent(influencer.username)}&platform=${influencer.platform}`;
                              window.location.href = profilesUrl;
                            }}
                            className={cn('w-full mt-2 px-3 py-2 text-xs bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 transition-all')}
                          >
                            Go to Posts
                          </button>
                        </div>
                      ))}

                    </div>
                  ) : (
                    <div className={cn('h-96 rounded-md bg-white/5 flex items-center justify-center')}>
                      <div className={cn('text-muted-foreground')}>No influencer data available</div>
                    </div>
                  )}
                </CardContent>
              </Card>

        </div>
      </div>
    </PageLayout>
  )
}