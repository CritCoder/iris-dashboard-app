'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { FacebookIcon, InstagramIcon, TwitterIcon, NewsIcon } from '@/components/ui/platform-icons'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Search, Zap, Calendar } from 'lucide-react'
import { AnimatedPage, FadeIn, SlideUp } from '@/components/ui/animated'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { DateRange } from 'react-day-picker'

export default function StartAnalysisPage() {
  const router = useRouter()
  const { success, error } = useToast()
  const [activeTab, setActiveTab] = useState<'topic' | 'poi'>('topic')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['facebook', 'instagram', 'twitter', 'india-news'])
  const [searchQuery, setSearchQuery] = useState('')
  const [timeRange, setTimeRange] = useState('any')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: FacebookIcon, color: 'text-blue-500', bgColor: 'bg-blue-600', borderColor: 'border-blue-500' },
    { id: 'instagram', name: 'Instagram', icon: InstagramIcon, color: 'text-pink-500', bgColor: 'bg-pink-600', borderColor: 'border-pink-500' },
    { id: 'twitter', name: 'Twitter', icon: TwitterIcon, color: 'text-blue-400', bgColor: 'bg-sky-500', borderColor: 'border-sky-400' },
    { id: 'india-news', name: 'India News', icon: NewsIcon, color: 'text-orange-500', bgColor: 'bg-orange-600', borderColor: 'border-orange-500' }
  ]

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    )
  }

  const handleAnalyze = async () => {
    if (!searchQuery.trim() || searchQuery.trim().length < 3) {
      error('Please enter at least 3 characters')
      return
    }

    if (selectedPlatforms.length === 0) {
      error('Please select at least one platform')
      return
    }

    if (timeRange === 'custom' && (!dateRange?.from || !dateRange?.to)) {
      error('Please select a custom date range')
      return
    }

    setIsAnalyzing(true)

    try {
      // Prepare time range data
      let timeRangeData = timeRange
      if (timeRange === 'custom' && dateRange?.from && dateRange?.to) {
        timeRangeData = {
          type: 'custom',
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString()
        }
      }

      // Create a new campaign for analysis
      const response = await fetch('https://irisnet.wiredleap.com/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${activeTab === 'topic' ? 'Topic' : 'POI'} Analysis: ${searchQuery.substring(0, 50)}`,
          type: activeTab === 'topic' ? 'TOPIC' : 'PERSON',
          description: `Analysis of ${searchQuery} across ${selectedPlatforms.join(', ')} platforms`,
          keywords: searchQuery.split(',').map(k => k.trim()).filter(k => k.length > 0),
          platforms: selectedPlatforms,
          timeRange: timeRangeData
        })
      })

      const result = await response.json()

      if (result.success) {
        success('Analysis started successfully!')
        // Redirect to the campaign page or analysis results
        router.push(`/post-campaign/${result.data.id}`)
      } else {
        error(result.error?.message || 'Failed to start analysis')
      }
    } catch (error) {
      error('Failed to start analysis. Please try again.')
      console.error('Analysis error:', error)
    } finally {
      setIsAnalyzing(false)
    }
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
          <AnimatedPage className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {/* Analysis Type Tabs */}
            <FadeIn className="flex justify-center mb-8">
              <div className="w-full max-w-2xl">
                <div className="grid grid-cols-2 gap-3 p-1 bg-muted rounded-lg">
                  <button
                    onClick={() => setActiveTab('topic')}
                    className={`px-4 py-4 rounded-md transition-all ${
                      activeTab === 'topic'
                        ? 'bg-background text-foreground shadow-sm border border-border'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                  >
                    <div className="text-center">
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
                    <div className="text-center">
                      <div className="font-semibold text-base mb-1">Person of Interest (POI)</div>
                      <div className="text-xs opacity-90">Search for specific individuals, profiles</div>
                    </div>
                  </button>
                </div>
              </div>
            </FadeIn>

            {/* Search Input */}
            <SlideUp className="mb-8">
              <label className="block text-sm font-medium text-foreground mb-2">
                {activeTab === 'topic' ? 'Enter Topics, Keywords, or Hashtags' : 'Enter Person Name, Username, or Profile URL'}
              </label>
              <Textarea
                placeholder={activeTab === 'topic' 
                  ? "e.g., Bengaluru Traffic, #BengaluruPolice, Women Safety..." 
                  : "e.g., @username, person name, profile URL..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="min-h-[120px] text-base resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {activeTab === 'topic' 
                  ? 'Separate multiple topics with commas. You can include hashtags, keywords, or phrases.'
                  : 'Enter the name, username, or social media profile URL of the person you want to analyze.'}
              </p>
            </SlideUp>

            {/* Analyze Button */}
            <SlideUp className="mb-8">
              <Button 
                onClick={handleAnalyze}
                disabled={isAnalyzing || searchQuery.trim().length < 3}
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
              {searchQuery.trim().length > 0 && searchQuery.trim().length < 3 && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Enter at least 3 characters to start analysis
                </p>
              )}
            </SlideUp>

            {/* Select Platforms */}
            <SlideUp className="mb-8">
              <h3 className="text-foreground font-semibold mb-4">Select Platforms</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(platforms || []).map((platform) => {
                  const IconComponent = platform.icon
                  return (
                    <button
                      key={platform.id}
                      onClick={() => togglePlatform(platform.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${
                        selectedPlatforms.includes(platform.id)
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
            </SlideUp>

            {/* Time Range */}
            <SlideUp>
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
            </SlideUp>
          </AnimatedPage>
        </div>
      </div>
    </PageLayout>
  )
}