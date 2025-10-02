'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Search, Eye, Pause, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'

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
  }
]

function CampaignRow({ campaign }: { campaign: Campaign }) {
  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 70) return 'bg-green-500'
    if (sentiment >= 40) return 'bg-yellow-500'
    return 'bg-orange-500'
  }

  return (
    <div className="flex items-center justify-between p-4 border-b border-border hover:bg-accent/20 transition-colors">
      <div className="flex-1">
        <Link href={`/analysis-history/${campaign.id}`}>
          <h3 className="text-foreground font-medium mb-1 hover:text-blue-400 transition-colors cursor-pointer">
            {campaign.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground">{campaign.date}</p>
      </div>

      <div className="flex items-center gap-6 overflow-x-auto">
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="bg-card border border-border rounded-lg px-4 py-2 text-center min-w-[80px]">
            <div className="text-foreground font-bold text-lg">{campaign.posts}</div>
            <div className="text-xs text-muted-foreground">📝 POSTS</div>
          </div>
          <div className="bg-card border border-border rounded-lg px-4 py-2 text-center min-w-[80px]">
            <div className="text-foreground font-bold text-lg">{campaign.engage}</div>
            <div className="text-xs text-muted-foreground">👥 ENGAGE</div>
          </div>
          <div className="bg-green-900/20 border border-green-800/30 rounded-lg px-4 py-2 text-center min-w-[80px]">
            <div className="text-white font-bold text-lg">{campaign.likes}</div>
            <div className="text-xs text-green-400">💚 LIKES</div>
          </div>
          <div className="bg-purple-900/20 border border-purple-800/30 rounded-lg px-4 py-2 text-center min-w-[80px]">
            <div className="text-white font-bold text-lg">{campaign.shares}</div>
            <div className="text-xs text-purple-400">🔄 SHARES</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right min-w-[100px]">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${getSentimentColor(campaign.sentiment)} bg-opacity-20 border border-current`}>
              <div className="text-2xl font-bold text-foreground">{campaign.sentiment}</div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">SENTIMENT</div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-accent/30 rounded-lg transition-colors text-muted-foreground hover:text-blue-400">
              <Eye className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-accent/30 rounded-lg transition-colors text-muted-foreground hover:text-yellow-400">
              <Pause className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-accent/30 rounded-lg transition-colors text-muted-foreground hover:text-red-400">
              <Trash2 className="w-5 h-5" />
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
  const totalPages = 3

  return (
    <PageLayout>
      <div className="h-screen flex flex-col overflow-hidden">
        <PageHeader 
          title="Analysis History"
          description="Track and manage your campaign analyses"
          actions={
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search campaigns by name or description..."
                  className="pl-12 pr-4 py-3 text-sm w-80"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'all'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground hover:bg-accent/30'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveTab('active')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'active'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground hover:bg-accent/30'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setActiveTab('inactive')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'inactive'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground hover:bg-accent/30'
                  }`}
                >
                  Inactive
                </button>
              </div>
            </div>
          }
        />

        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-border list-animate-in">
            {campaigns.map((campaign) => (
              <CampaignRow key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </div>

        <div className="border-t border-border p-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing 1 to 10 of 24 campaigns
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 hover:bg-accent/30 rounded-lg transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="sr-only">Previous</span>
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:bg-accent/30'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-secondary hover:bg-accent/30 rounded-lg transition-colors text-foreground text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
