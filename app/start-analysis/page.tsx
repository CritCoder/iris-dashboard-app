'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FacebookIcon, InstagramIcon, TwitterIcon, NewsIcon } from '@/components/ui/platform-icons'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Search, Zap, Calendar, Globe, Mail, UserSearch, ArrowRight, Shield, BarChart3, MessageSquare } from 'lucide-react'
import { AnimatedPage, FadeIn, SlideUp } from '@/components/ui/animated'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { DateRange } from 'react-day-picker'
import { api } from '@/lib/api'

export default function StartAnalysisPage() {
  const router = useRouter()
  const { success, error } = useToast()
  const [activeTab, setActiveTab] = useState<'topic' | 'poi'>('topic')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['facebook', 'twitter'])
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
    // DEBUG: Version identifier to verify fresh code loading
    console.log('🎯 FRESH CODE LOADED - Version: 2025-10-24-v2')
    
    // Enhanced validation based on the guide
    if (!searchQuery.trim()) {
      error('Please enter a search query')
      return
    }

    if (searchQuery.trim().length < 3) {
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

    // Validate date range if custom
    if (timeRange === 'custom' && dateRange?.from && dateRange?.to) {
      if (dateRange.from >= dateRange.to) {
        error('End date must be after start date')
        return
      }
    }

    setIsAnalyzing(true)

    try {
      // Prepare time range data - API requires startDate and endDate format
      let timeRangeData: any
      if (timeRange === 'custom' && dateRange?.from && dateRange?.to) {
        timeRangeData = {
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString()
        }
      } else {
        // For 'any' time range, use the last 30 days
        const endDate = new Date()
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - 30)
        
        timeRangeData = {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      }

      // Create a new campaign for analysis using the proper API structure
      const searchData = {
        topic: searchQuery,
        timeRange: timeRangeData,
        platforms: selectedPlatforms,
        campaignType: activeTab === 'topic' ? 'NORMAL' : 'PERSON'
      }

      // Add person details if it's a POI search
      if (activeTab === 'poi') {
        searchData.personDetails = {
          username: searchQuery,
          name: searchQuery,
          profileId: searchQuery
        }
      }

      // DEBUG: Log the search data to verify the new structure
      console.log('🚀 NEW API CALL - Search Data:', searchData)
      console.log('🚀 NEW API CALL - Using campaignSearch method')
      
      const result = await api.campaign.campaignSearch(searchData)

      if (result.success) {
        success('Analysis started successfully!')

        // Store campaign data in sessionStorage so detail page can use it immediately
        if (result.data) {
          sessionStorage.setItem(`campaign_${result.data.campaignId}`, JSON.stringify(result.data))
        }

        // Redirect to the campaign dashboard page to see all posts and analytics
        // The API returns campaignId in the response according to the guide
        router.push(`/analysis-history/${result.data.campaignId}`)
      } else {
        error(result.error || 'Failed to start analysis')
      }
    } catch (err: any) {
      console.error('Analysis error:', err)
      
      // Handle specific error types based on the guide
      if (err.message?.includes('401')) {
        error('Your session has expired. Please log in again.')
      } else if (err.message?.includes('403')) {
        error('You do not have permission to perform this action.')
      } else if (err.message?.includes('404')) {
        error('The requested resource was not found.')
      } else if (err.message?.includes('500')) {
        error('Server error. Please try again later.')
      } else {
        error(err.message || 'Failed to start analysis. Please try again.')
      }
    } finally {
      setIsAnalyzing(false)
    }
  }


  return (
    <PageLayout>
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <div className="max-w-4xl w-full mx-auto px-3 sm:px-4 lg:px-6 py-4">
            <Card className="h-fit max-h-[calc(100vh-2rem)] overflow-hidden">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Social Media Monitoring</CardTitle>
                    <CardDescription className="text-sm">Set up comprehensive monitoring across platforms</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
                    
                    {/* Analysis Type Tabs */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Analysis Type</label>
                      <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg">
                        <button
                          onClick={() => setActiveTab('topic')}
                          className={`px-3 py-2 rounded-md transition-all ${
                            activeTab === 'topic'
                              ? 'bg-background text-foreground shadow-sm border border-border'
                              : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                          }`}
                        >
                          <div className="text-left">
                            <div className="font-semibold text-sm">Topic Analysis</div>
                            <div className="text-xs opacity-90">Keywords, hashtags</div>
                          </div>
                        </button>
                        <button
                          onClick={() => setActiveTab('poi')}
                          className={`px-3 py-2 rounded-md transition-all ${
                            activeTab === 'poi'
                              ? 'bg-background text-foreground shadow-sm border border-border'
                              : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                          }`}
                        >
                          <div className="text-left">
                            <div className="font-semibold text-sm">Person of Interest</div>
                            <div className="text-xs opacity-90">Individuals, profiles</div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Search Input */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {activeTab === 'topic' ? 'Enter Topics, Keywords, or Hashtags' : 'Enter Person Name, Username, or Profile URL'}
                      </label>
                      <Textarea
                        placeholder={activeTab === 'topic' 
                          ? "e.g., Bengaluru Traffic, #BengaluruPolice, Women Safety..." 
                          : "e.g., @username, person name, profile URL..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="min-h-[80px] text-sm resize-none"
                      />
                    </div>

                    {/* Platform Selection */}
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">Select Platforms</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {platforms.map((platform) => {
                          const IconComponent = platform.icon
                          const isSelected = selectedPlatforms.includes(platform.id)
                          return (
                            <button
                              key={platform.id}
                              onClick={() => togglePlatform(platform.id)}
                              className={`relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                                isSelected
                                  ? `${platform.borderColor} bg-accent/50 shadow-md scale-105`
                                  : 'border-border bg-card hover:bg-accent/30 hover:border-muted-foreground/30'
                              }`}
                            >
                              {/* Checkmark indicator */}
                              {isSelected && (
                                <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full ${platform.bgColor} flex items-center justify-center shadow-lg`}>
                                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}

                              <div className={`w-10 h-10 rounded-full ${isSelected ? platform.bgColor : 'bg-muted'} flex items-center justify-center transition-all`}>
                                <IconComponent className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-muted-foreground'}`} />
                              </div>
                              <span className={`text-xs font-medium ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {platform.name}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Time Range */}
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">Time Range</h4>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { value: 'any', label: 'Any' },
                          { value: '24h', label: '24h' },
                          { value: '7d', label: '7d' },
                          { value: '30d', label: '30d' },
                          { value: '3m', label: '3m' },
                          { value: '6m', label: '6m' },
                          { value: '1y', label: '1y' },
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
                            className={`px-2 py-1.5 text-xs rounded-lg border transition-all ${
                              timeRange === option.value
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Date Range */}
                    {timeRange === 'custom' && (
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2">
                          Select Custom Date Range
                        </label>
                        <DateRangePicker
                          date={dateRange}
                          onDateChange={setDateRange}
                          placeholder="Choose start and end dates"
                          className="w-full"
                        />
                      </div>
                    )}

                    {/* Analyze Button */}
                    <Button 
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || searchQuery.trim().length < 3}
                      className="w-full py-2 text-sm font-medium"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Start Analysis
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}