'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Search, Eye, Pause, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { AnimatedPage, AnimatedList, AnimatedItem } from '@/components/ui/animated'

interface Campaign {
  id: string
  name: string
  date: string
  posts: string
  engage: string
  likes: string
  shares: string
  sentiment: number
  status: 'active' | 'inactive'
}

const campaigns: Campaign[] = [
  {
    id: '1',
    name: 'women safety blr',
    date: 'Sep 29, 2025',
    posts: '163',
    engage: '15.6K',
    likes: '12.5K',
    shares: '624',
    sentiment: 8,
    status: 'active'
  },
  {
    id: '2',
    name: 'kanakpura taluk',
    date: 'Sep 29, 2025',
    posts: '117',
    engage: '16K',
    likes: '15K',
    shares: '653',
    sentiment: 76,
    status: 'active'
  },
  {
    id: '3',
    name: 'whitefield bengaluru',
    date: 'Sep 29, 2025',
    posts: '236',
    engage: '2.6K',
    likes: '1.8K',
    shares: '162',
    sentiment: 72,
    status: 'active'
  },
  {
    id: '4',
    name: 'whitefield',
    date: 'Sep 29, 2025',
    posts: '204',
    engage: '1.7K',
    likes: '1.2K',
    shares: '104',
    sentiment: 69,
    status: 'active'
  },
  {
    id: '5',
    name: 'bellandur',
    date: 'Sep 29, 2025',
    posts: '4.4K',
    engage: '15.9K',
    likes: '12.5K',
    shares: '1.1K',
    sentiment: 11,
    status: 'active'
  },
  {
    id: '6',
    name: 'bengaluru police',
    date: 'Sep 29, 2025',
    posts: '444',
    engage: '258.7K',
    likes: '223.6K',
    shares: '23.2K',
    sentiment: 85,
    status: 'active'
  },
  {
    id: '7',
    name: 'dharmasthala',
    date: 'Sep 27, 2025',
    posts: '429',
    engage: '18.6K',
    likes: '14.8K',
    shares: '1.9K',
    sentiment: 15,
    status: 'active'
  },
  {
    id: '8',
    name: 'mysore palace',
    date: 'Sep 25, 2025',
    posts: '156',
    engage: '8.2K',
    likes: '6.1K',
    shares: '342',
    sentiment: 68,
    status: 'inactive'
  },
  {
    id: '9',
    name: 'coorg tourism',
    date: 'Sep 23, 2025',
    posts: '89',
    engage: '4.1K',
    likes: '3.2K',
    shares: '198',
    sentiment: 82,
    status: 'inactive'
  }
]

function CampaignRow({ campaign }: { campaign: Campaign }) {
  const router = useRouter()

  const getSentimentColor = (sentiment: number) => {
    // Using dark red and green like homepage
    if (sentiment >= 70) return 'bg-green-600 text-white'
    if (sentiment >= 40) return 'bg-yellow-600 text-white'
    return 'bg-red-600 text-white'
  }

  const handleRowClick = () => {
    router.push(`/analysis-history/${campaign.id}`)
  }

  return (
    <div
      onClick={handleRowClick}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border-b border-border hover:bg-accent/20 transition-colors gap-3 cursor-pointer"
    >
      <div className="flex-1 min-w-0">
        <h3 className="text-foreground font-medium mb-1 hover:text-blue-400 transition-colors">
          {campaign.name}
        </h3>
        <p className="text-sm text-muted-foreground">{campaign.date}</p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-6">
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-0">
          <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg px-3 sm:px-4 py-2 text-center min-w-[70px] sm:min-w-[80px] flex-shrink-0">
            <div className="text-blue-300 font-bold text-base sm:text-lg">{campaign.posts}</div>
            <div className="text-xs text-blue-400">POSTS</div>
          </div>
          <div className="bg-cyan-900/20 border border-cyan-800/30 rounded-lg px-3 sm:px-4 py-2 text-center min-w-[70px] sm:min-w-[80px] flex-shrink-0">
            <div className="text-cyan-300 font-bold text-base sm:text-lg">{campaign.engage}</div>
            <div className="text-xs text-cyan-400">ENGAGE</div>
          </div>
          <div className="bg-green-900/20 border border-green-800/30 rounded-lg px-3 sm:px-4 py-2 text-center min-w-[70px] sm:min-w-[80px] flex-shrink-0">
            <div className="text-green-300 font-bold text-base sm:text-lg">{campaign.likes}</div>
            <div className="text-xs text-green-400">LIKES</div>
          </div>
          <div className="bg-purple-900/20 border border-purple-800/30 rounded-lg px-3 sm:px-4 py-2 text-center min-w-[70px] sm:min-w-[80px] flex-shrink-0">
            <div className="text-purple-300 font-bold text-base sm:text-lg">{campaign.shares}</div>
            <div className="text-xs text-purple-400">SHARES</div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-start gap-4">
          <div className="text-left sm:text-right">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${getSentimentColor(campaign.sentiment)}`}>
              <div className="text-xl sm:text-2xl font-bold">{campaign.sentiment}</div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">SENTIMENT</div>
          </div>

          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button className="px-3 py-2 hover:bg-accent/30 rounded-lg transition-colors text-foreground/70 hover:text-blue-500 flex items-center gap-2">
              <Eye className="w-4 sm:w-5 h-4 sm:h-5" />
              <span className="text-sm font-medium">View</span>
            </button>
            <button
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                campaign.status === 'active'
                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
              }`}
              title={campaign.status === 'active' ? 'Active - Click to pause' : 'Paused - Click to activate'}
            >
              {campaign.status === 'active' ? (
                <>
                  <Pause className="w-4 sm:w-5 h-4 sm:h-5" />
                  <span className="text-sm font-medium">Pause</span>
                </>
              ) : (
                <>
                  <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <span className="text-sm font-medium">Start</span>
                </>
              )}
            </button>
            <button className="p-2 hover:bg-accent/30 rounded-lg transition-colors text-foreground/70 hover:text-red-500">
              <Trash2 className="w-4 sm:w-5 h-4 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AnalysisHistoryPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const totalPages = 3

  // Filter campaigns based on active tab and search query
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesTab = activeTab === 'all' || campaign.status === activeTab
    const matchesSearch = searchQuery === '' || 
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  return (
    <PageLayout>
      <div className="h-screen flex flex-col overflow-hidden">
        <PageHeader
          title="Analysis History"
          description="Track and manage your campaign analyses"
        />

        {/* Search and filters in one row */}
        <div className="border-b border-border bg-background p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 text-sm w-full"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:bg-accent/30'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === 'active'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:bg-accent/30'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setActiveTab('inactive')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === 'inactive'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:bg-accent/30'
                }`}
              >
                Inactive
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <AnimatedList stagger={0.03} className="divide-y divide-border list-animate-in">
            {filteredCampaigns.length > 0 ? (
              filteredCampaigns.map((campaign) => (
                <AnimatedItem key={campaign.id}>
                  <CampaignRow campaign={campaign} />
                </AnimatedItem>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <p>No campaigns found matching your criteria.</p>
              </div>
            )}
          </AnimatedList>
        </div>

        <div className="border-t border-border bg-background px-3 sm:px-4 h-16 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Showing {filteredCampaigns.length} of {campaigns.length} campaigns
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 hover:bg-accent/30 rounded-lg transition-colors text-foreground/70 hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="sr-only">Previous</span>
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-foreground/70 hover:bg-accent/30 hover:text-foreground'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 sm:px-4 py-2 bg-secondary hover:bg-accent/30 rounded-lg transition-colors text-foreground/70 hover:text-foreground text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
