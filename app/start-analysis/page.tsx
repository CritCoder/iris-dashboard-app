'use client'

import { useState } from 'react'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { FacebookIcon, InstagramIcon, TwitterIcon, NewsIcon } from '@/components/ui/platform-icons'

export default function StartAnalysisPage() {
  const [activeTab, setActiveTab] = useState<'topic' | 'poi'>('topic')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['facebook', 'instagram', 'twitter', 'india-news'])

  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: FacebookIcon, color: 'text-blue-500' },
    { id: 'instagram', name: 'Instagram', icon: InstagramIcon, color: 'text-pink-500' },
    { id: 'twitter', name: 'Twitter', icon: TwitterIcon, color: 'text-blue-400' },
    { id: 'india-news', name: 'India News', icon: NewsIcon, color: 'text-orange-500' }
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
      <div className="h-screen flex flex-col bg-black overflow-hidden">
        <PageHeader 
          title="Start Analysis"
          description="Advanced social media intelligence gathering and analysis"
        />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Modern Tabs */}
            <div className="flex justify-center mb-8">
              <div className="tabs-container">
                <div className="tabs">
                  <input 
                    type="radio" 
                    id="radio-topic" 
                    name="analysis-tabs" 
                    checked={activeTab === 'topic'}
                    onChange={() => setActiveTab('topic')}
                  />
                  <label className="tab" htmlFor="radio-topic">
                    Topic Analysis
                  </label>
                  <input 
                    type="radio" 
                    id="radio-poi" 
                    name="analysis-tabs"
                    checked={activeTab === 'poi'}
                    onChange={() => setActiveTab('poi')}
                  />
                  <label className="tab" htmlFor="radio-poi">
                    POI Analysis
                  </label>
                  <span className="glider"></span>
                </div>
              </div>
            </div>

            {/* Search Input */}
            <div className="mb-8">
              <Textarea
                placeholder="Enter topics, keywords, or hashtags to analyze..."
                className="bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 min-h-[120px] text-base resize-none"
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
              <h3 className="text-white font-semibold mb-4">Select Platforms</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {platforms.map((platform) => {
                  const IconComponent = platform.icon
                  return (
                    <button
                      key={platform.id}
                      onClick={() => togglePlatform(platform.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${
                        selectedPlatforms.includes(platform.id)
                          ? 'bg-zinc-800 border-zinc-700 text-white'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300'
                      }`}
                    >
                      <div className={`w-8 h-8 flex items-center justify-center ${platform.color}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="font-medium">{platform.name}</span>
                      {selectedPlatforms.includes(platform.id) && (
                        <span className="ml-auto text-green-400">✓</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Time Range */}
            <div>
              <h3 className="text-white font-semibold mb-4">Time Range</h3>
              <select className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg px-4 py-3 cursor-pointer hover:bg-zinc-800 transition-colors">
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