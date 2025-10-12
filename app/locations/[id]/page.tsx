'use client'

import { useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Search, MapPin, TrendingUp, ChevronRight, X, Download, Eye, Heart, MessageCircle, Share2, ExternalLink, Clock, Sparkles, AlertCircle, CheckCircle, MinusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface Post {
  id: string
  source: string
  timestamp: string
  content: string
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'MIXED'
  relevance: number
  likes: number
  comments: number
  shares: number
}

// Sample data for Bengaluru location
const samplePosts: Post[] = [
  {
    id: '1',
    source: 'News-Article @india-news',
    timestamp: 'Oct 11, 2025, 03:40 AM',
    content: 'Bengaluru police taking strict action against social media content that violates community guidelines. New safety measures online implemented across the city.',
    sentiment: 'NEUTRAL',
    relevance: 80,
    likes: 0,
    comments: 0,
    shares: 0
  },
  {
    id: '2',
    source: 'News-Article @karnataka-news',
    timestamp: 'Oct 11, 2025, 02:15 AM',
    content: 'Karnataka high court notice to govt on plea challenging division of Bengaluru police. Legal proceedings continue regarding administrative restructuring.',
    sentiment: 'MIXED',
    relevance: 75,
    likes: 0,
    comments: 0,
    shares: 0
  },
  {
    id: '3',
    source: 'News-Article @ndtv',
    timestamp: 'Oct 10, 2025, 11:30 PM',
    content: 'Viral Post: Latest News, Photos, Videos on Viral Post - NDTV.COM... To Fix Bengaluru Potholes. Citizens demand better infrastructure maintenance.',
    sentiment: 'NEGATIVE',
    relevance: 85,
    likes: 0,
    comments: 0,
    shares: 0
  },
  {
    id: '4',
    source: 'News-Article @times-of-india',
    timestamp: 'Oct 10, 2025, 10:45 PM',
    content: 'Bengaluru traffic management system receives positive feedback from commuters. New digital initiatives showing promising results in reducing congestion.',
    sentiment: 'POSITIVE',
    relevance: 70,
    likes: 0,
    comments: 0,
    shares: 0
  },
  {
    id: '5',
    source: 'News-Article @deccan-herald',
    timestamp: 'Oct 10, 2025, 09:20 PM',
    content: 'Bengaluru police community outreach programs gain momentum. Increased public participation in safety awareness campaigns across the city.',
    sentiment: 'POSITIVE',
    relevance: 65,
    likes: 0,
    comments: 0,
    shares: 0
  }
]

function PostCard({ post }: { post: Post }) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'POSITIVE': return 'bg-green-100 text-green-800 border-green-200'
      case 'NEGATIVE': return 'bg-red-100 text-red-800 border-red-200'
      case 'NEUTRAL': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'MIXED': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-muted-foreground">{post.source}</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.timestamp}
              </span>
            </div>
            <p className="text-sm text-foreground leading-relaxed mb-3">
              {post.content}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                {post.likes}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                {post.comments}
              </span>
              <span className="flex items-center gap-1">
                <Share2 className="w-3 h-3" />
                {post.shares}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 ml-4">
            <Badge className={`text-xs ${getSentimentColor(post.sentiment)}`}>
              {post.sentiment}
            </Badge>
            <div className="text-xs text-muted-foreground">
              Relevance: {post.relevance}%
            </div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-foreground mb-3">{title}</h3>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  )
}

function FilterItem({ 
  label, 
  isActive = false, 
  hasSubmenu = false, 
  onClick,
  count
}: { 
  label: string
  isActive?: boolean
  hasSubmenu?: boolean
  onClick?: () => void
  count?: number
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
        isActive 
          ? 'bg-primary text-primary-foreground' 
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      }`}
    >
      <span>{label}</span>
      <div className="flex items-center gap-2">
        {count !== undefined && <span className="text-xs text-muted-foreground">{count}</span>}
        {hasSubmenu && <ChevronRight className="w-4 h-4" />}
      </div>
    </button>
  )
}

export default function LocationDetailPage() {
  const params = useParams()
  const locationId = params.id as string
  
  const [activeTab, setActiveTab] = useState('latest')
  const [activeFilter, setActiveFilter] = useState('all-locations')
  const [searchQuery, setSearchQuery] = useState('')

  // Get location name from ID (in real app, this would come from API)
  const locationName = locationId === 'bengaluru' ? 'Bengaluru' : 
                      locationId === 'bangalore' ? 'Bangalore' : 
                      locationId.charAt(0).toUpperCase() + locationId.slice(1)

  const filteredPosts = useMemo(() => {
    let filtered = [...samplePosts]

    // Apply tab filtering
    switch (activeTab) {
      case 'positive':
        filtered = filtered.filter(post => post.sentiment === 'POSITIVE')
        break
      case 'negative':
        filtered = filtered.filter(post => post.sentiment === 'NEGATIVE')
        break
      case 'top-posts':
        filtered = filtered.sort((a, b) => b.relevance - a.relevance)
        break
    }

    // Apply search filtering
    if (searchQuery) {
      filtered = filtered.filter(post => 
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.source.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered
  }, [activeTab, searchQuery])

  const totalMentions = 117
  const lastSeen = 'Oct 10, 2025, 12:06 PM'

  return (
    <PageLayout>
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        <PageHeader 
          title="Location Explorer"
          description={`${locationName} location analysis and monitoring`}
          actions={
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {filteredPosts.length} posts found
              </span>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          }
        />

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Filters and Location Details */}
          <div className="hidden lg:block lg:w-80 border-r border-border bg-muted/30 overflow-y-auto">
            <div className="p-4 sm:p-6">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm mb-6">
                <Link href="/locations" className="text-muted-foreground hover:text-foreground transition-colors">
                  All Locations
                </Link>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground font-medium">{locationName}</span>
              </div>

              {/* Location Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{locationName}</h2>
                  <p className="text-sm text-muted-foreground">LOCATION • {totalMentions} mentions</p>
                </div>
              </div>

              {/* Post Tabs */}
              <div className="flex gap-1 mb-6">
                {[
                  { id: 'latest', label: 'Latest' },
                  { id: 'top-posts', label: 'Top Posts' },
                  { id: 'positive', label: 'Positive' },
                  { id: 'negative', label: 'Negative' }
                ].map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveTab(tab.id)}
                    className="text-xs"
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>

              <FilterSection title="PRIMARY">
                <FilterItem 
                  label="All Locations" 
                  isActive={activeFilter === 'all-locations'}
                  onClick={() => setActiveFilter('all-locations')}
                  count={20}
                />
                <FilterItem 
                  label="High Impact Locations"
                  onClick={() => setActiveFilter('high-impact')}
                  count={5}
                />
                <FilterItem 
                  label="Trending Locations"
                  onClick={() => setActiveFilter('trending')}
                  count={3}
                />
                <FilterItem 
                  label="Frequently Mentioned"
                  onClick={() => setActiveFilter('frequent')}
                  count={8}
                />
              </FilterSection>

              <FilterSection title="SENTIMENT BASED">
                <FilterItem 
                  label="Negative Locations"
                  isActive={activeFilter === 'negative'}
                  onClick={() => setActiveFilter('negative')}
                  count={2}
                />
                <FilterItem 
                  label="Positive Locations"
                  onClick={() => setActiveFilter('positive')}
                  count={6}
                />
                <FilterItem 
                  label="Controversial"
                  onClick={() => setActiveFilter('controversial')}
                  count={1}
                />
              </FilterSection>

              <FilterSection title="POLICE DIVISIONS">
                <FilterItem 
                  label="Whitefield Division"
                  hasSubmenu
                  onClick={() => setActiveFilter('whitefield')}
                />
                <FilterItem 
                  label="South East Division"
                  hasSubmenu
                  onClick={() => setActiveFilter('south-east')}
                />
                <FilterItem 
                  label="Central Division"
                  hasSubmenu
                  onClick={() => setActiveFilter('central')}
                />
                <FilterItem 
                  label="Northeast Division"
                  hasSubmenu
                  onClick={() => setActiveFilter('northeast')}
                />
                <FilterItem 
                  label="East Division"
                  hasSubmenu
                  onClick={() => setActiveFilter('east')}
                />
                <FilterItem 
                  label="North Division"
                  hasSubmenu
                  onClick={() => setActiveFilter('north')}
                />
              </FilterSection>
            </div>
          </div>

          {/* Main Content - Posts Feed */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-3 sm:p-4 border-b border-border">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="gap-2">
                    {locationName}
                    <X className="w-3 h-3 cursor-pointer" />
                  </Badge>
                </div>
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{totalMentions} total mentions</span>
                  <span>Last seen: {lastSeen}</span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {/* AI Summary Section */}
              <Card className="mb-6 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <CardTitle className="text-lg">AI Summary</CardTitle>
                    </div>
                    <Badge variant="secondary" className="gap-1">
                      <Clock className="w-3 h-3" />
                      Last 24 hours
                    </Badge>
                  </div>
                  <CardDescription>
                    Quick overview of what's happening in {locationName}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Sentiment Overview */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-xs font-medium text-green-700 dark:text-green-400">Positive</span>
                      </div>
                      <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                        {samplePosts.filter(p => p.sentiment === 'POSITIVE').length}
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-500">
                        {Math.round((samplePosts.filter(p => p.sentiment === 'POSITIVE').length / samplePosts.length) * 100)}% of posts
                      </div>
                    </div>
                    
                    <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <span className="text-xs font-medium text-red-700 dark:text-red-400">Negative</span>
                      </div>
                      <div className="text-2xl font-bold text-red-700 dark:text-red-400">
                        {samplePosts.filter(p => p.sentiment === 'NEGATIVE').length}
                      </div>
                      <div className="text-xs text-red-600 dark:text-red-500">
                        {Math.round((samplePosts.filter(p => p.sentiment === 'NEGATIVE').length / samplePosts.length) * 100)}% of posts
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-950/20 border border-gray-200 dark:border-gray-800 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <MinusCircle className="w-4 h-4 text-gray-600" />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-400">Neutral</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-700 dark:text-gray-400">
                        {samplePosts.filter(p => p.sentiment === 'NEUTRAL' || p.sentiment === 'MIXED').length}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-500">
                        {Math.round((samplePosts.filter(p => p.sentiment === 'NEUTRAL' || p.sentiment === 'MIXED').length / samplePosts.length) * 100)}% of posts
                      </div>
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-foreground">Key Insights</h4>
                    <div className="space-y-2">
                      <Alert className="bg-background/50">
                        <TrendingUp className="h-4 w-4" />
                        <AlertTitle className="text-sm">Overall Sentiment: Mixed</AlertTitle>
                        <AlertDescription className="text-xs">
                          The area is experiencing mixed sentiment with {samplePosts.filter(p => p.sentiment === 'POSITIVE').length} positive developments around traffic management and community programs, but concerns remain about infrastructure issues like potholes.
                        </AlertDescription>
                      </Alert>
                      
                      <Alert className="bg-background/50">
                        <MapPin className="h-4 w-4" />
                        <AlertTitle className="text-sm">Main Topics</AlertTitle>
                        <AlertDescription className="text-xs">
                          <div className="flex flex-wrap gap-1 mt-2">
                            <Badge variant="secondary" className="text-xs">Police Action</Badge>
                            <Badge variant="secondary" className="text-xs">Traffic Management</Badge>
                            <Badge variant="secondary" className="text-xs">Infrastructure</Badge>
                            <Badge variant="secondary" className="text-xs">Community Safety</Badge>
                          </div>
                        </AlertDescription>
                      </Alert>

                      <Alert className="bg-background/50">
                        <Sparkles className="h-4 w-4" />
                        <AlertTitle className="text-sm">What's Happening</AlertTitle>
                        <AlertDescription className="text-xs">
                          Bengaluru police are actively implementing new safety measures and community outreach programs. While there's positive feedback on traffic management improvements, citizens continue to raise concerns about road infrastructure. Legal proceedings are ongoing regarding administrative restructuring of the police division.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Posts List */}
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
              
              {filteredPosts.length === 0 && (
                <div className="text-center py-12">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No posts found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or filters
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

