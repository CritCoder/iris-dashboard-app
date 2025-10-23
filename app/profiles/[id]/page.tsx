'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, MapPin, Calendar, Heart, MessageSquare, Share2, Eye, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react'
import { useProfiles } from '@/hooks/use-api'
import { getHighResProfileImage } from '@/lib/image-utils'
import { useState } from 'react'

export default function ProfileDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: profileId } = use(params)
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarTab, setSidebarTab] = useState<'overview' | 'ai-analysis'>('overview')

  // Fetch profiles and find the specific one
  const { data: profiles, loading, error } = useProfiles({})
  const profile = profiles?.find(p => p.id === profileId)

  // Debug logging
  console.log('Profile Detail Debug:', {
    profileId,
    profilesCount: profiles?.length,
    foundProfile: !!profile,
    profileData: profile
  })

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  if (!profile || error) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
            <p className="text-muted-foreground mb-4">
              {error || 'The profile you are looking for does not exist.'}
            </p>
            <Button onClick={() => router.push('/profiles')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profiles
            </Button>
          </div>
        </div>
      </PageLayout>
    )
  }

  // Sample posts data - in real app, fetch from API
  const samplePosts = [
    {
      id: '1',
      content: 'Sample post content from this profile. This is a great update about recent activities and insights.',
      timestamp: '2 weeks ago',
      likes: 3900,
      comments: 124,
      shares: 86,
      views: 25000,
      platform: profile.platform
    },
    {
      id: '2',
      content: 'Another interesting post with valuable information for followers.',
      timestamp: '3 weeks ago',
      likes: 729,
      comments: 10,
      shares: 250,
      views: 10000,
      platform: profile.platform
    },
    {
      id: '3',
      content: 'Keep an eye on the night sky in October—you might catch a falling star!',
      timestamp: '1 month ago',
      likes: 4300,
      comments: 729,
      shares: 298,
      views: 15000,
      platform: profile.platform
    }
  ]

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter': return '𝕏'
      case 'facebook': return '📘'
      case 'instagram': return '📷'
      default: return '🌐'
    }
  }

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-500'
      case 'negative': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  // Calculate totals
  const totalLikes = samplePosts.reduce((sum, p) => sum + p.likes, 0)
  const totalComments = samplePosts.reduce((sum, p) => sum + p.comments, 0)
  const totalShares = samplePosts.reduce((sum, p) => sum + p.shares, 0)
  const avgViews = Math.round(samplePosts.reduce((sum, p) => sum + p.views, 0) / samplePosts.length)

  const positiveCount = 24
  const neutralCount = 10
  const totalSentiment = positiveCount + neutralCount
  const positivePercent = (positiveCount / totalSentiment) * 100
  const neutralPercent = (neutralCount / totalSentiment) * 100

  return (
    <PageLayout>
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        {/* Top Bar */}
        <div className="border-b border-border px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/profiles')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              All Profiles
            </Button>
            <div className="h-6 w-px bg-border"></div>
            <h1 className="text-xl font-bold">Profiles Explorer</h1>
          </div>
          <Badge variant="outline" className="text-xs">
            50 profiles (more available)
          </Badge>
        </div>

        {/* Main Content - 2 Column Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column - Profile Header & Posts Feed */}
          <div className="flex-1 flex flex-col overflow-hidden border-r border-border">
            {/* Profile Header with Cover */}
            <div className="flex-shrink-0">
              {/* Cover Image */}
              <div className="h-48 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 relative">
                {profile.profileBannerUrl ? (
                  <img
                    src={getHighResProfileImage(profile.profileBannerUrl)}
                    alt="Cover"
                    className="w-full h-full object-cover opacity-30"
                    onError={(e) => {
                      // Fallback to avatar if banner fails to load
                      if (profile.avatar) {
                        e.currentTarget.src = getHighResProfileImage(profile.avatar)
                      }
                    }}
                  />
                ) : profile.avatar ? (
                  <img
                    src={getHighResProfileImage(profile.avatar)}
                    alt="Cover"
                    className="w-full h-full object-cover opacity-30"
                  />
                ) : null}
              </div>

              {/* Profile Info Overlay */}
              <div className="px-6 -mt-16 relative z-10">
                <div className="flex items-end gap-4 mb-4">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-background border-4 border-background overflow-hidden">
                      {profile.avatar ? (
                        <img
                          src={getHighResProfileImage(profile.avatar)}
                          alt={profile.displayName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-4xl font-bold">
                          {profile.displayName[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-background border-2 border-background flex items-center justify-center text-xl">
                      {getPlatformIcon(profile.platform)}
                    </div>
                  </div>

                  {/* Name & Actions */}
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-2xl font-bold">{profile.displayName}</h2>
                      {profile.verified && (
                        <span className="text-blue-500 text-xl">✓</span>
                      )}
                    </div>
                    <p className="text-muted-foreground">@{profile.username}</p>
                  </div>

                  <Button variant="default" className="mb-2">
                    View Profile
                  </Button>
                </div>

                {/* Bio */}
                {profile.bio && (
                  <p className="text-sm text-foreground mb-3 leading-relaxed">
                    {profile.bio}
                  </p>
                )}

                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  {profile.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {profile.location}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined December 2007
                  </div>
                  {profile.verified && (
                    <div className="text-green-600 flex items-center gap-1">
                      <span>✓</span> Verification: https://t.co/example
                    </div>
                  )}
                </div>

                {/* Follower Stats */}
                <div className="flex items-center gap-6 text-sm mb-4">
                  <div>
                    <span className="font-bold text-foreground">{profile.following?.toLocaleString() || '0'}</span>
                    <span className="text-muted-foreground"> Following</span>
                  </div>
                  <div>
                    <span className="font-bold text-foreground">{profile.followers?.toLocaleString() || '0'}</span>
                    <span className="text-muted-foreground"> Followers</span>
                  </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent p-0 h-auto">
                    <TabsTrigger 
                      value="latest" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                    >
                      Latest
                    </TabsTrigger>
                    <TabsTrigger 
                      value="top" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                    >
                      Top
                    </TabsTrigger>
                    <TabsTrigger 
                      value="positive" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                    >
                      Positive
                    </TabsTrigger>
                    <TabsTrigger 
                      value="negative" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                    >
                      Negative
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {/* Posts Feed */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-4 space-y-4">
                {samplePosts.map((post) => (
                  <Card key={post.id} className="hover:border-primary/50 transition-colors">
                    <CardContent className="p-4">
                      {/* Post Header */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center font-bold">
                          {profile.displayName[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{profile.displayName}</span>
                            {profile.verified && <span className="text-blue-500 text-xs">✓</span>}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {profile.platform} • {post.timestamp}
                          </div>
                        </div>
                      </div>

                      {/* Post Content */}
                      <p className="text-sm text-foreground mb-3 leading-relaxed">
                        {post.content}
                      </p>

                      {/* Post Stats */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5" />
                            <span>{post.likes.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>{post.comments}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Share2 className="w-3.5 h-3.5" />
                            <span>{post.shares}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{post.views.toLocaleString()}</span>
                          </div>
                          <Button variant="ghost" size="sm" className="h-7 px-2 gap-1">
                            View
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Analytics Sidebar */}
          <div className="w-96 flex-shrink-0 overflow-y-auto bg-card/50">
            <div className="p-6 space-y-6">
              {/* Tabs */}
              <div className="flex gap-2">
                <Button 
                  variant={sidebarTab === 'overview' ? 'default' : 'ghost'} 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setSidebarTab('overview')}
                >
                  Overview
                </Button>
                <Button 
                  variant={sidebarTab === 'ai-analysis' ? 'default' : 'ghost'} 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setSidebarTab('ai-analysis')}
                >
                  AI Analysis
                </Button>
              </div>

              {/* Overview Tab Content */}
              {sidebarTab === 'overview' && (
                <>
              {/* Profile Overview */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Profile Overview
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-3xl font-bold text-primary">{profile.posts?.toLocaleString() || '34'}</div>
                      <div className="text-xs text-muted-foreground">Total Posts</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-primary">{samplePosts.length.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Profile Posts</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Posting Time Pattern */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-xs font-semibold text-foreground mb-3">
                    Posting Time Pattern
                  </h3>
                  {/* Simple bar chart */}
                  <div className="flex items-end gap-1.5 h-28 mb-2">
                    {[3, 4, 3, 5, 4, 6, 5, 9, 7, 8, 10, 9].map((height, i) => (
                      <div key={i} className="flex-1 flex flex-col justify-end group relative">
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-foreground text-background text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap">
                            {height} posts
                          </div>
                        </div>
                        <div 
                          className="bg-primary hover:bg-primary/80 rounded-t-sm w-full transition-all cursor-pointer"
                          style={{ height: `${height * 10}%` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[9px] text-muted-foreground px-0.5">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Aug</span>
                    <span>Sep</span>
                    <span>Oct</span>
                    <span>Nov</span>
                    <span>Dec</span>
                  </div>
                </CardContent>
              </Card>

              {/* Engagement */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-xs font-semibold text-foreground mb-4">
                    Engagement
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <Heart className="w-5 h-5 mx-auto mb-2 text-pink-500" />
                      <div className="text-xl font-bold">{totalLikes.toLocaleString()}</div>
                      <div className="text-[10px] text-muted-foreground">Likes</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <MessageSquare className="w-5 h-5 mx-auto mb-2 text-blue-500" />
                      <div className="text-xl font-bold">{totalComments.toLocaleString()}</div>
                      <div className="text-[10px] text-muted-foreground">Comments</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <Share2 className="w-5 h-5 mx-auto mb-2 text-green-500" />
                      <div className="text-xl font-bold">{totalShares.toLocaleString()}</div>
                      <div className="text-[10px] text-muted-foreground">Shares</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <Eye className="w-5 h-5 mx-auto mb-2 text-purple-500" />
                      <div className="text-xl font-bold">{avgViews.toLocaleString()}</div>
                      <div className="text-[10px] text-muted-foreground">Avg</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sentiment Distribution */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-xs font-semibold text-foreground mb-4">
                    Sentiment Distribution
                  </h3>
                  {/* Circular progress */}
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="16"
                        className="text-green-500"
                        strokeDasharray={`${positivePercent * 3.52} 352`}
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="16"
                        className="text-gray-500"
                        strokeDasharray={`${neutralPercent * 3.52} 352`}
                        strokeDashoffset={`-${positivePercent * 3.52}`}
                      />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-xs">Positive</span>
                      </div>
                      <span className="font-bold">{positiveCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                        <span className="text-xs">Neutral</span>
                      </div>
                      <span className="font-bold">{neutralCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Platform Info */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-xs font-semibold text-foreground mb-3">
                    Platform Info
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Platform</span>
                      <span className="font-medium">{profile.platform}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Verified</span>
                      <span className="font-medium">{profile.verified ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created</span>
                      <span className="font-medium">12/20/2007</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
                </>
              )}

              {/* AI Analysis Tab Content */}
              {sidebarTab === 'ai-analysis' && (
                <>
                  {/* Profile Score */}
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                        AI Profile Score
                      </h3>
                      <div className="text-center">
                        <div className="relative w-32 h-32 mx-auto mb-4">
                          <svg className="w-full h-full -rotate-90">
                            <circle
                              cx="64"
                              cy="64"
                              r="56"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="12"
                              className="text-muted"
                            />
                            <circle
                              cx="64"
                              cy="64"
                              r="56"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="12"
                              className="text-primary"
                              strokeDasharray="352"
                              strokeDashoffset="70"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div>
                              <div className="text-3xl font-bold">8.2</div>
                              <div className="text-[10px] text-muted-foreground">/ 10</div>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          High influence profile with consistent engagement
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Influence Analysis */}
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="text-xs font-semibold text-foreground mb-3">
                        Influence Analysis
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Reach</span>
                            <span className="font-semibold">92%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: '92%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Engagement</span>
                            <span className="font-semibold">85%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: '85%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Authority</span>
                            <span className="font-semibold">78%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500" style={{ width: '78%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Consistency</span>
                            <span className="font-semibold">88%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500" style={{ width: '88%' }}></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Content Analysis */}
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="text-xs font-semibold text-foreground mb-3">
                        Content Analysis
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5"></div>
                          <div>
                            <div className="font-medium text-xs">High-Quality Content</div>
                            <div className="text-xs text-muted-foreground">Posts are well-structured and informative</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5"></div>
                          <div>
                            <div className="font-medium text-xs">Consistent Posting</div>
                            <div className="text-xs text-muted-foreground">Regular activity with 34 posts</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5"></div>
                          <div>
                            <div className="font-medium text-xs">Moderate Interaction</div>
                            <div className="text-xs text-muted-foreground">Could improve response rate to comments</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5"></div>
                          <div>
                            <div className="font-medium text-xs">Positive Sentiment</div>
                            <div className="text-xs text-muted-foreground">71% positive sentiment across posts</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Risk Assessment */}
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="text-xs font-semibold text-foreground mb-3">
                        Risk Assessment
                      </h3>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">Risk Level</span>
                        <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                          Low Risk
                        </Badge>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Controversial Content</span>
                          <span className="font-semibold text-green-600">0%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Negative Sentiment</span>
                          <span className="font-semibold text-green-600">10%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Spam Indicators</span>
                          <span className="font-semibold text-green-600">2%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Key Topics */}
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="text-xs font-semibold text-foreground mb-3">
                        Key Topics
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-xs">Space Exploration</Badge>
                        <Badge variant="secondary" className="text-xs">Science</Badge>
                        <Badge variant="secondary" className="text-xs">Technology</Badge>
                        <Badge variant="secondary" className="text-xs">Astronomy</Badge>
                        <Badge variant="secondary" className="text-xs">Innovation</Badge>
                        <Badge variant="secondary" className="text-xs">Research</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recommendations */}
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="text-xs font-semibold text-foreground mb-3">
                        AI Recommendations
                      </h3>
                      <div className="space-y-2 text-xs">
                        <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded">
                          <div className="font-medium mb-1">📊 Increase Engagement</div>
                          <div className="text-muted-foreground">Respond to more comments to boost interaction rates</div>
                        </div>
                        <div className="p-2 bg-green-500/10 border border-green-500/20 rounded">
                          <div className="font-medium mb-1">✨ Content Strategy</div>
                          <div className="text-muted-foreground">Continue posting high-quality, informative content</div>
                        </div>
                        <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded">
                          <div className="font-medium mb-1">🎯 Optimal Timing</div>
                          <div className="text-muted-foreground">Post during peak hours (9-11 AM) for better reach</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
