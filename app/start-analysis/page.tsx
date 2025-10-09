'use client'

import { useState } from 'react'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { FacebookIcon, InstagramIcon, TwitterIcon, NewsIcon } from '@/components/ui/platform-icons'

export default function StartAnalysisPage() {
  const [activeTab, setActiveTab] = useState<'topic' | 'poi'>('topic')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['facebook', 'instagram', 'twitter', 'india-news'])

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

  return (
    <PageLayout>
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        <PageHeader 
          title="Start Analysis"
          description="Advanced social media intelligence gathering and analysis"
        />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {/* Analysis Type Tabs */}
            <div className="flex justify-center mb-8">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'topic' | 'poi')} className="w-auto">
                <TabsList className="flex gap-1 bg-muted p-1 rounded-lg">
                  <TabsTrigger 
                    value="topic" 
                    className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground data-[state=inactive]:hover:bg-accent/50 px-4 py-2 rounded-md transition-all"
                  >
                    Topic Analysis
                  </TabsTrigger>
                  <TabsTrigger 
                    value="poi" 
                    className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground data-[state=inactive]:hover:bg-accent/50 px-4 py-2 rounded-md transition-all"
                  >
                    POI Analysis
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Search Input */}
            <div className="mb-8">
              <Textarea
                placeholder="Enter topics, keywords, or hashtags to analyze..."
                className="min-h-[120px] text-base resize-none"
              />
            </div>

            {/* Analyze Button */}
            <div className="mb-8">
              <Button className="w-full py-6 text-base font-medium">
                Analyze
              </Button>
            </div>

            {/* Select Platforms */}
            <div className="mb-8">
              <h3 className="text-foreground font-semibold mb-4">Select Platforms</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {platforms.map((platform) => {
                  const IconComponent = platform.icon
                  return (
                    <button
                      key={platform.id}
                      onClick={() => togglePlatform(platform.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${
                        selectedPlatforms.includes(platform.id)
                          ? `${platform.bgColor} ${platform.borderColor} text-white border-2`
                          : 'bg-card border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <div className={`w-8 h-8 flex items-center justify-center ${
                        selectedPlatforms.includes(platform.id) ? 'text-white' : platform.color
                      }`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="font-medium">{platform.name}</span>
                      <span className="ml-auto w-4 h-4 flex items-center justify-center">
                        {selectedPlatforms.includes(platform.id) && (
                          <span className="text-white">✓</span>
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
              <select className="w-full bg-background border border-border text-foreground rounded-lg px-4 py-3 cursor-pointer hover:bg-accent transition-colors">
                <option>Any time</option>
                <option>Last 24 hours</option>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
                <option>Last 6 months</option>
                <option>Last year</option>
                <option>Custom range</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}