'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { FacebookIcon, InstagramIcon, TwitterIcon, NewsIcon } from '@/components/ui/platform-icons'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Search, Zap, Calendar } from 'lucide-react'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { DateRange } from 'react-day-picker'
import { campaignApi } from '@/lib/api'

export default function StartAnalysisPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<'topic' | 'poi' | 'post'>('topic')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['facebook', 'instagram', 'twitter', 'india-news'])
  const [searchQuery, setSearchQuery] = useState('')
  const [timeRange, setTimeRange] = useState('30d')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showDateModal, setShowDateModal] = useState(false)
  
  // POI specific state
  const [personDetails, setPersonDetails] = useState({
    username: '',
    name: '',
    profileId: ''
  })

  // POST specific state
  const [postDetails, setPostDetails] = useState({
    url: '',
    postId: ''
  })

  // Check authentication on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
      }
    }
  }, [router])

  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: FacebookIcon, color: 'text-blue-500', bgColor: 'bg-blue-600', borderColor: 'border-blue-500' },
    { id: 'instagram', name: 'Instagram', icon: InstagramIcon, color: 'text-pink-500', bgColor: 'bg-pink-600', borderColor: 'border-pink-500' },
    { id: 'twitter', name: 'Twitter', icon: TwitterIcon, color: 'text-blue-400', bgColor: 'bg-sky-500', borderColor: 'border-sky-400' },
    { id: 'youtube', name: 'YouTube', icon: NewsIcon, color: 'text-red-500', bgColor: 'bg-red-600', borderColor: 'border-red-500' },
    { id: 'reddit', name: 'Reddit', icon: NewsIcon, color: 'text-orange-500', bgColor: 'bg-orange-600', borderColor: 'border-orange-500' },
    { id: 'threads', name: 'Threads', icon: NewsIcon, color: 'text-purple-500', bgColor: 'bg-purple-600', borderColor: 'border-purple-500' },
    { id: 'india-news', name: 'India News', icon: NewsIcon, color: 'text-orange-500', bgColor: 'bg-orange-600', borderColor: 'border-orange-500' }
  ]

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    )
  }

  // Calculate date range based on time selection
  const getDateRangeFromTimeOption = (option: string) => {
    const now = new Date()
    const endDate = new Date(now)
    let startDate = new Date(now)

    switch (option) {
      case '24h':
        startDate.setDate(now.getDate() - 1)
        break
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setMonth(now.getMonth() - 1)
        break
      case '3m':
        startDate.setMonth(now.getMonth() - 3)
        break
      case '6m':
        startDate.setMonth(now.getMonth() - 6)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        // 'any' - default to 30 days
        startDate.setMonth(now.getMonth() - 1)
    }

    return { from: startDate, to: endDate }
  }

  // Extract post ID from URL
  const extractPostIdFromUrl = (url: string, platform: string) => {
    let extractedPostId = ''
    
    // Instagram: handles /p/, /reel/, /tv/
    const instagramMatch = url.match(/instagram\.com\/(p|reel|tv)\/([A-Za-z0-9_-]+)/)
    if (instagramMatch) {
      extractedPostId = instagramMatch[2]
      return { postId: extractedPostId, platform: 'instagram' }
    }

    // Twitter: handles both twitter.com and x.com
    const twitterMatch = url.match(/(?:twitter\.com|x\.com)\/[^\/]+\/status\/(\d+)/)
    if (twitterMatch) {
      extractedPostId = twitterMatch[1]
      return { postId: extractedPostId, platform: 'twitter' }
    }

    // Facebook: handles multiple formats
    const facebookMatch = url.match(/facebook\.com\/(?:[^\/]+\/(?:posts|videos|photos)\/|[^\/]+\/[^\/]+\/|photo\.php\?fbid=|permalink\.php\?story_fbid=)([A-Za-z0-9_-]+)/)
    if (facebookMatch) {
      extractedPostId = facebookMatch[1]
      return { postId: extractedPostId, platform: 'facebook' }
    }

    // YouTube: handles youtube.com/watch?v= and youtu.be/
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/)
    if (youtubeMatch) {
      extractedPostId = youtubeMatch[1]
      return { postId: extractedPostId, platform: 'youtube' }
    }

    // Reddit: handles /comments/postid/ format
    const redditMatch = url.match(/reddit\.com\/r\/[^\/]+\/comments\/([A-Za-z0-9_-]+)/)
    if (redditMatch) {
      extractedPostId = redditMatch[1]
      return { postId: extractedPostId, platform: 'reddit' }
    }

    // Threads: handles threads.net/t/ format
    const threadsMatch = url.match(/threads\.net\/t\/([A-Za-z0-9_-]+)/)
    if (threadsMatch) {
      extractedPostId = threadsMatch[1]
      return { postId: extractedPostId, platform: 'threads' }
    }

    // If no match, try the last segment of URL
    const potentialPostId = url.trim().replace(/\/$/, '').split('/').pop()
    if (potentialPostId && /^[A-Za-z0-9_-]+$/.test(potentialPostId)) {
      return { postId: potentialPostId, platform }
    }

    return { postId: '', platform }
  }

  const handleAnalyze = async () => {
    // Validation based on campaign type
    if (activeTab === 'topic') {
      if (!searchQuery.trim() || searchQuery.trim().length < 3) {
        toast({ title: 'Error', description: 'Please enter at least 3 characters', variant: 'destructive' })
        return
      }
    } else if (activeTab === 'poi') {
      const username = searchQuery.trim() || personDetails.username.trim()
      if (!username || username.length < 3) {
        toast({ title: 'Error', description: 'Please enter a username for person analysis', variant: 'destructive' })
        return
      }
    } else if (activeTab === 'post') {
      const urlOrId = postDetails.url.trim() || postDetails.postId.trim()
      if (!urlOrId) {
        toast({ title: 'Error', description: 'Please enter a post URL or post ID', variant: 'destructive' })
        return
      }
    }

    if (selectedPlatforms.length === 0) {
      toast({ title: 'Error', description: 'Please select at least one platform', variant: 'destructive' })
      return
    }

    if (timeRange === 'custom' && (!dateRange?.from || !dateRange?.to)) {
      toast({ title: 'Error', description: 'Please select a custom date range', variant: 'destructive' })
      return
    }

    setIsAnalyzing(true)

    try {
      // Get token
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      // Calculate final date range
      let finalDateRange = dateRange
      if (timeRange !== 'custom') {
        finalDateRange = getDateRangeFromTimeOption(timeRange)
      }

      // Default to 30 days if no range selected
      if (!finalDateRange?.from || !finalDateRange?.to) {
        finalDateRange = getDateRangeFromTimeOption('30d')
      }

      // Handle POST campaign separately
      if (activeTab === 'post') {
        const url = postDetails.url.trim()
        const manualPostId = postDetails.postId.trim()
        
        // Determine platform from selected platforms or detect from URL
        const validPlatforms = ['twitter', 'facebook', 'instagram', 'youtube', 'reddit', 'threads']
        const selectedValidPlatforms = selectedPlatforms.filter(p => validPlatforms.includes(p))

        if (selectedValidPlatforms.length === 0) {
          toast({ title: 'Error', description: 'Please select at least one valid platform for post analysis', variant: 'destructive' })
          setIsAnalyzing(false)
          return
        }

        // Extract post ID and platform
        let extractedPostId = manualPostId
        let detectedPlatform = selectedValidPlatforms[0]

        if (url) {
          const extracted = extractPostIdFromUrl(url, selectedValidPlatforms[0])
          if (extracted.postId) {
            extractedPostId = extracted.postId
            detectedPlatform = extracted.platform
          }
        }

        if (!extractedPostId) {
          toast({ title: 'Error', description: 'Unable to extract post ID from the provided URL', variant: 'destructive' })
          setIsAnalyzing(false)
          return
        }

        // Check if campaign already exists
        try {
          const existingCampaignResponse = await campaignApi.checkPostCampaign(
            undefined,
            extractedPostId,
            detectedPlatform
          )

          if (existingCampaignResponse?.success && existingCampaignResponse.data?.exists) {
            const existing = existingCampaignResponse.data.campaign
            toast({ title: 'Success', description: 'Campaign already exists! Redirecting...', variant: 'default' })
            
            // Prefetch original post
            try {
              await campaignApi.getOriginalPost(existing.id)
            } catch (prefetchErr) {
              console.warn('Failed to prefetch original post:', prefetchErr)
            }
            
            router.push(`/post-campaign/${existing.id}`)
            return
          }
        } catch (checkErr) {
          console.warn('Warning: checkPostCampaign failed, proceeding to create new campaign', checkErr)
        }

        // Build post details
        const finalUrl = url || (detectedPlatform === 'instagram' ? `https://www.instagram.com/p/${extractedPostId}/` :
                                  detectedPlatform === 'youtube' ? `https://www.youtube.com/watch?v=${extractedPostId}` :
                                  detectedPlatform === 'threads' ? `https://www.threads.net/t/${extractedPostId}` : undefined)

        const outPostDetails: any = {
          url: finalUrl,
          postId: extractedPostId,
          platformPostId: extractedPostId,
          platform: detectedPlatform
        }

        // Add platform-specific fields
        if (detectedPlatform === 'twitter') {
          outPostDetails.tweetId = extractedPostId
          outPostDetails.tweet_id = extractedPostId
        } else if (detectedPlatform === 'instagram') {
          outPostDetails.instagramPostId = extractedPostId
        } else if (detectedPlatform === 'facebook') {
          outPostDetails.facebookPostId = extractedPostId
        } else if (detectedPlatform === 'youtube') {
          outPostDetails.youtubeVideoId = extractedPostId
        } else if (detectedPlatform === 'reddit') {
          outPostDetails.redditPostId = extractedPostId
        }

        // Create POST campaign
        const response = await campaignApi.createSearch({
          topic: `Post Analysis: ${url || extractedPostId}`,
          timeRange: {
            startDate: finalDateRange.from.toISOString(),
            endDate: finalDateRange.to.toISOString()
          },
          platforms: [detectedPlatform],
          campaignType: 'POST',
          postDetails: outPostDetails
        })

        if (response.success && response.data?.campaignId) {
          toast({ title: 'Success', description: 'Analysis started successfully!', variant: 'default' })
          
          // Prefetch original post
          const newCampaignId = response.data.campaignId
          try {
            await campaignApi.getOriginalPost(newCampaignId)
          } catch (prefetchErr) {
            console.warn('Failed to prefetch original post:', prefetchErr)
          }
          
          router.push(`/post-campaign/${newCampaignId}`)
        } else {
          throw new Error(response.message || 'Failed to create post campaign')
        }
        return
      }

      // Handle GENERAL and PERSON campaigns
      const campaignType = activeTab === 'topic' ? 'NORMAL' : 'PERSON'
      let campaignTopic = searchQuery.trim()
      
      const searchData: any = {
        topic: campaignTopic,
        timeRange: {
          startDate: finalDateRange.from.toISOString(),
          endDate: finalDateRange.to.toISOString()
        },
        platforms: selectedPlatforms,
        campaignType: campaignType
      }

      // Add person details if POI campaign
      if (activeTab === 'poi') {
        const username = (searchQuery.trim() || personDetails.username.trim()).replace('@', '')
        const name = personDetails.name.trim() || username
        const profileId = personDetails.profileId.trim() || username

        searchData.topic = `Person: ${username}`
        searchData.personDetails = {
          username,
          name,
          profileId
        }
      }

      // Create campaign
      const response = await campaignApi.createSearch(searchData)

      if (response.success && response.data?.campaignId) {
        toast({ title: 'Success', description: 'Analysis started successfully!', variant: 'default' })
        router.push(`/campaign/${response.data.campaignId}`)
      } else {
        throw new Error(response.message || 'Failed to start analysis')
      }
    } catch (e: any) {
      toast({ 
        title: 'Error', 
        description: e.message || 'Failed to start analysis. Please try again.', 
        variant: 'destructive' 
      })
      console.error('Analysis error:', e)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const formatDateRange = () => {
    if (timeRange !== 'custom') {
      const options: Record<string, string> = {
        '24h': 'Last 24 hours',
        '7d': 'Last 7 days',
        '30d': 'Last 30 days',
        '3m': 'Last 3 months',
        '6m': 'Last 6 months',
        '1y': 'Last year',
        'any': 'Any time'
      }
      return options[timeRange] || 'Last 30 days'
    }
    
    if (dateRange?.from && dateRange?.to) {
      return `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
    }
    
    return 'Select date range'
  }

  return (
    <PageLayout>
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        <PageHeader 
          title="Start Analysis"
          description="Advanced social media intelligence gathering and analysis"
        />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
            {/* Analysis Type Tabs */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="w-full max-w-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 p-1 bg-muted rounded-lg">
                  <button
                    onClick={() => setActiveTab('topic')}
                    className={`px-4 py-4 rounded-md transition-all ${
                      activeTab === 'topic'
                        ? 'bg-background text-foreground shadow-sm border border-border'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-semibold text-base mb-1">Topic Analysis</div>
                      <div className="text-xs opacity-90">Search for topics, keywords, hashtags</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('poi')}
                    className={`px-4 py-4 rounded-md transition-all ${
                      activeTab === 'poi'
                        ? 'bg-background text-foreground shadow-sm border border-border'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-semibold text-base mb-1">Person of Interest</div>
                      <div className="text-xs opacity-90">Search for specific individuals</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('post')}
                    className={`px-4 py-4 rounded-md transition-all ${
                      activeTab === 'post'
                        ? 'bg-background text-foreground shadow-sm border border-border'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-semibold text-base mb-1">Post Analysis</div>
                      <div className="text-xs opacity-90">Analyze specific post URL</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Search Input */}
            <div className="mb-6 sm:mb-8">
              <label className="block text-sm font-medium text-foreground mb-2">
                {activeTab === 'topic' ? 'Enter Topics, Keywords, or Hashtags' : 
                 activeTab === 'poi' ? 'Enter Person Name, Username, or Profile URL' :
                 'Enter Post URL or Post ID'}
              </label>
              <Textarea
                placeholder={activeTab === 'topic' 
                  ? "e.g., Bengaluru Traffic, #BengaluruPolice, Women Safety..." 
                  : activeTab === 'poi'
                  ? "e.g., @username, person name, profile URL..."
                  : "e.g., https://www.instagram.com/p/DKnzCnmtepB/"}
                value={activeTab === 'post' ? postDetails.url : searchQuery}
                onChange={(e) => {
                  if (activeTab === 'post') {
                    setPostDetails(prev => ({ ...prev, url: e.target.value }))
                  } else {
                    setSearchQuery(e.target.value)
                  }
                }}
                className="min-h-[120px] text-base resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {activeTab === 'topic' 
                  ? 'Separate multiple topics with commas. You can include hashtags, keywords, or phrases.'
                  : activeTab === 'poi'
                  ? 'Enter the name, username, or social media profile URL of the person you want to analyze.'
                  : 'Enter the full post URL or just the post ID for analysis.'}
              </p>
            </div>

            {/* Analyze Button */}
            <div className="mb-6 sm:mb-8">
              <Button 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full py-6 text-base font-medium"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Analyze
                  </>
                )}
              </Button>
            </div>

            {/* Select Platforms */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-foreground font-semibold mb-4">Select Platforms</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {platforms.map((platform) => {
                  const IconComponent = platform.icon
                  const isSupported = activeTab === 'topic' || 
                    (activeTab === 'poi' && platform.id !== 'india-news') ||
                    (activeTab === 'post' && platform.id !== 'india-news')
                  
                  return (
                    <button
                      key={platform.id}
                      onClick={() => isSupported && togglePlatform(platform.id)}
                      disabled={!isSupported}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${
                        !isSupported
                          ? 'opacity-50 cursor-not-allowed bg-muted border-border text-muted-foreground'
                          : selectedPlatforms.includes(platform.id)
                          ? `${platform.bgColor} ${platform.borderColor} text-white`
                          : 'bg-card border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <div className={`w-8 h-8 flex items-center justify-center ${
                        selectedPlatforms.includes(platform.id) ? 'text-white' : platform.color
                      }`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="font-medium">{platform.name}</span>
                      <span className="ml-auto w-5 h-5 flex items-center justify-center">
                        {selectedPlatforms.includes(platform.id) && (
                          <span className="text-white text-lg">✓</span>
                        )}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Time Range */}
            <div>
              <h3 className="text-foreground font-semibold mb-4">Time Range</h3>
              
              {/* Preset Options */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {[
                  { value: 'any', label: 'Any time' },
                  { value: '24h', label: '24 hours' },
                  { value: '7d', label: '7 days' },
                  { value: '30d', label: '30 days' },
                  { value: '3m', label: '3 months' },
                  { value: '6m', label: '6 months' },
                  { value: '1y', label: '1 year' },
                  { value: 'custom', label: 'Custom' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setTimeRange(option.value)
                      if (option.value !== 'custom') {
                        setDateRange(undefined)
                      } else {
                        setShowDateModal(true)
                      }
                    }}
                    className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                      timeRange === option.value
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {/* Custom Date Range Picker */}
              {timeRange === 'custom' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Select Custom Date Range
                  </label>
                  <DateRangePicker
                    date={dateRange}
                    onDateChange={setDateRange}
                    placeholder="Choose start and end dates"
                    className="w-full"
                  />
                  {dateRange?.from && dateRange?.to && (
                    <p className="text-xs text-muted-foreground">
                      Selected: {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
