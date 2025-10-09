'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Search, Share2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Profile {
  id: string
  name: string
  handle: string
  platform: 'twitter' | 'facebook' | 'instagram'
  followers: string
  posts: string
  engagement: string
  level: string
  accountAge: string
  views: string
  impact: 'high' | 'medium' | 'low'
  reach: 'high' | 'medium' | 'low'
  postFrequency: 'frequent' | 'moderate' | 'rare'
  sentiment: 'positive' | 'negative' | 'neutral'
  logo?: string
}

const generateProfiles = (): Profile[] => {
  const profiles = [
    { name: 'Rahul Gandhi', handle: '@RahulGandhi', platform: 'twitter' as const, followers: '28.2M', posts: '8.3K', engagement: '0.0%', level: 'Celebrity' },
    { name: 'AajTak', handle: '@aajtak', platform: 'twitter' as const, followers: '24.6M', posts: '1.0M', engagement: '0.0%', level: 'Celebrity' },
    { name: 'NDTV', handle: '@ndtv', platform: 'twitter' as const, followers: '16.1M', posts: '1.6M', engagement: '0.0%', level: 'Celebrity' },
    { name: 'The Times Of India', handle: '@timesofindia', platform: 'twitter' as const, followers: '14.9M', posts: '1.0M', engagement: '0.0%', level: 'Celebrity' },
    { name: 'ABP News', handle: '@ABPNews', platform: 'twitter' as const, followers: '14.3M', posts: '676.6K', engagement: '0.0%', level: 'Celebrity' },
    { name: 'Congress', handle: '@INCIndia', platform: 'twitter' as const, followers: '11.6M', posts: '163.1K', engagement: '0.0%', level: 'Celebrity' },
    { name: 'TIMES NOW', handle: '@TimesNow', platform: 'twitter' as const, followers: '10.2M', posts: '1.3M', engagement: '0.0%', level: 'Celebrity' },
    { name: 'ANI', handle: '@ANI', platform: 'twitter' as const, followers: '9.2M', posts: '976.8K', engagement: '0.0%', level: 'Celebrity' },
    { name: 'Hindustan Times', handle: '@htTweets', platform: 'twitter' as const, followers: '8.6M', posts: '1.6M', engagement: '0.0%', level: 'Celebrity' },
    { name: 'The Hindu', handle: '@the_hindu', platform: 'twitter' as const, followers: '8.4M', posts: '693.1K', engagement: '0.0%', level: 'Celebrity' },
    { name: 'Zee News', handle: '@ZeeNews', platform: 'twitter' as const, followers: '7.0M', posts: '622.6K', engagement: '0.0%', level: 'Celebrity' },
    { name: 'Grok', handle: '@grok', platform: 'twitter' as const, followers: '6.4M', posts: '53.1M', engagement: '0.0%', level: 'Celebrity' },
    { name: 'IndiaToday', handle: '@IndiaToday', platform: 'twitter' as const, followers: '6.3M', posts: '1.4M', engagement: '0.0%', level: 'Celebrity' },
    { name: 'Amazon', handle: '@amazon', platform: 'twitter' as const, followers: '6.0M', posts: '65.5K', engagement: '0.0%', level: 'Celebrity' },
    { name: 'OLX', handle: '@olx', platform: 'twitter' as const, followers: '5.3M', posts: '37.5K', engagement: '0.0%', level: 'Celebrity' },
    { name: 'News18', handle: '@CNNnews18', platform: 'twitter' as const, followers: '4.6M', posts: '1.3M', engagement: '0.0%', level: 'Celebrity' },
    { name: 'Press Trust of India', handle: '@PTI_News', platform: 'twitter' as const, followers: '4.4M', posts: '338.8K', engagement: '0.0%', level: 'Celebrity' },
    { name: 'Economic Times', handle: '@EconomicTimes', platform: 'twitter' as const, followers: '4.6M', posts: '902.7K', engagement: '0.0%', level: 'Celebrity' },
    { name: 'The Indian Express', handle: '@IndianExpress', platform: 'twitter' as const, followers: '4.3M', posts: '1.1M', engagement: '0.0%', level: 'Celebrity' },
    { name: 'NDTV India', handle: '@ndtvindia', platform: 'twitter' as const, followers: '4.3M', posts: '204.0K', engagement: '0.0%', level: 'Celebrity' }
  ]

  return profiles.map((p, i) => ({
    ...p,
    id: `profile-${i}`,
    accountAge: `${Math.floor(Math.random() * 10) + 1} years`,
    views: '0 views',
    impact: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
    reach: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
    postFrequency: ['frequent', 'moderate', 'rare'][Math.floor(Math.random() * 3)] as 'frequent' | 'moderate' | 'rare',
    sentiment: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)] as 'positive' | 'negative' | 'neutral'
  }))
}

const allProfiles = generateProfiles()

function ProfileCard({ profile }: { profile: Profile }) {
  const platformIcons = {
    twitter: '🐦',
    facebook: '📘',
    instagram: '📷'
  }

  const platformColors = {
    twitter: 'bg-sky-500',
    facebook: 'bg-blue-600',
    instagram: 'bg-pink-600'
  }

  return (
    <Link href={`/profiles/${profile.id}`}>
      <div className="bg-card border border-border rounded-lg p-4 card-hover pressable cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full ${platformColors[profile.platform]} flex items-center justify-center text-white text-xl font-bold`}>
              {profile.name[0]}
            </div>
            <div>
              <h3 className="text-white font-semibold text-base">{profile.name}</h3>
              <p className="text-zinc-500 text-sm">{profile.handle}</p>
            </div>
          </div>
          <span className="text-2xl">{platformIcons[profile.platform]}</span>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-zinc-500">👥 Followers</span>
            <span className="text-white font-semibold">{profile.followers}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-500">📝 Posts</span>
            <span className="text-white font-semibold">{profile.posts}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-500">📊 Engagement</span>
            <span className="text-white font-semibold">{profile.engagement}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-500">⭐ Level</span>
            <span className="text-white font-semibold">{profile.level}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-sm text-zinc-500">
          <span>Account • Age</span>
          <span>👁️ {profile.views}</span>
        </div>
      </div>
    </Link>
  )
}

export default function ProfilesPage() {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState('all-authors')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProfiles = useMemo(() => {
    let profiles = [...allProfiles]

    switch (activeFilter) {
      case 'all-authors':
        break
      case 'high-impact':
        profiles = profiles.filter(p => p.impact === 'high')
        break
      case 'high-reach':
        profiles = profiles.filter(p => p.reach === 'high')
        break
      case 'frequent-posters':
        profiles = profiles.filter(p => p.postFrequency === 'frequent')
        break
      case 'negative-influencers':
        profiles = profiles.filter(p => p.sentiment === 'negative')
        break
      case 'positive-influencers':
        profiles = profiles.filter(p => p.sentiment === 'positive')
        break
      case 'twitter':
        profiles = profiles.filter(p => p.platform === 'twitter')
        break
      case 'facebook':
        profiles = profiles.filter(p => p.platform === 'facebook')
        break
      case 'instagram':
        profiles = profiles.filter(p => p.platform === 'instagram')
        break
    }

    if (searchQuery) {
      profiles = profiles.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.handle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return profiles.slice(0, 50)
  }, [activeFilter, searchQuery])

  const primaryFilters = [
    { id: 'all-authors', label: 'All Authors', icon: '👥' }
  ]

  const engagementFilters = [
    { id: 'high-impact', label: 'High Impact Authors', icon: '🎯' },
    { id: 'high-reach', label: 'High Reach Authors', icon: '📡' },
    { id: 'frequent-posters', label: 'Frequent Posters', icon: '📝' }
  ]

  const sentimentFilters = [
    { id: 'negative-influencers', label: 'Negative Influencers', icon: '😞' },
    { id: 'positive-influencers', label: 'Positive Influencers', icon: '😊' }
  ]

  const platformFilters = [
    { id: 'twitter', label: 'Twitter Influencers', icon: '🐦' },
    { id: 'facebook', label: 'Facebook Pages', icon: '📘' },
    { id: 'instagram', label: 'Instagram Influencers', icon: '📷' }
  ]

  return (
    <PageLayout>
      <div className="h-screen flex flex-col overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <PageHeader
            title="Profiles Explorer"
            description={`${filteredProfiles.length} profiles (more available)`}
            actions={
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary border border-border rounded-lg text-sm text-foreground">
                  All Profiles
                </div>
                <div className="relative w-full sm:flex-1 sm:max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search authors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 text-sm w-full"
                  />
                </div>
                <Button className="gap-2" size="sm">
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share via WhatsApp</span>
                  <span className="sm:hidden">Share</span>
                </Button>
              </div>
            }
          />

          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="mb-4 text-sm text-muted-foreground">
              {filteredProfiles.length} profiles loaded (more available)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 list-animate-in">
              {filteredProfiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
