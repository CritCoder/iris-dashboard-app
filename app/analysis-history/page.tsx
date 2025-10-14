'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Search, Eye, Pause, Trash2, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { AnimatedPage, AnimatedList, AnimatedItem } from '@/components/ui/animated'
import {
  getCampaigns,
  searchCampaigns,
  deleteCampaign,
  startMonitoring,
  stopMonitoring,
  type Campaign,
  type PaginationInfo
} from '@/lib/api/campaigns'

// Helper to format numbers with K/M suffix
const formatNumber = (num: number | undefined | null): string => {
  if (num === undefined || num === null) {
    return '0';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Helper to format date
const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) {
    return 'N/A';
  }
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return 'N/A';
  }
};

// Helper to calculate sentiment score
const calculateSentimentScore = (sentiment: { positive: number; neutral: number; negative: number } | undefined | null): number => {
  if (!sentiment) {
    return 0;
  }
  // Weighted average: positive counts more, negative counts less
  const positive = sentiment.positive || 0;
  const neutral = sentiment.neutral || 0;
  const negative = sentiment.negative || 0;
  return Math.round((positive * 100) + (neutral * 50) + (negative * 0));
};

function CampaignRow({ 
  campaign, 
  onDelete, 
  onToggleMonitoring 
}: { 
  campaign: Campaign;
  onDelete: (id: string) => void;
  onToggleMonitoring: (id: string, isActive: boolean) => void;
}) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isToggling, setIsToggling] = useState(false)

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 70) return 'bg-green-600 text-white'
    if (sentiment >= 40) return 'bg-yellow-600 text-white'
    return 'bg-red-600 text-white'
  }

  // Calculate display values
  const sentimentScore = calculateSentimentScore(campaign.metrics?.sentimentDistribution)
  const displayDate = new Date(campaign.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
  const displayStatus = campaign.status.toLowerCase() as 'active' | 'inactive' | 'completed'

  const handleRowClick = () => {
    router.push(`/analysis-history/${campaign.id}`)
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm(`Are you sure you want to delete "${campaign.name}"? This action cannot be undone.`)) {
      setIsDeleting(true)
      try {
        await onDelete(campaign.id)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const handleToggleMonitoring = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsToggling(true)
    try {
      await onToggleMonitoring(campaign.id, campaign.monitoringStatus === 'ACTIVE')
    } finally {
      setIsToggling(false)
    }
  }

  const isMonitoring = campaign.monitoringStatus === 'ACTIVE'

  return (
    <div
      onClick={handleRowClick}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border-b border-border hover:bg-accent/20 transition-colors gap-3 cursor-pointer"
    >
      <div className="flex-1 min-w-0">
        <h3 className="text-foreground font-medium mb-1 hover:text-blue-400 transition-colors">
          {campaign.name}
        </h3>
        <p className="text-sm text-muted-foreground">{formatDate(campaign.createdAt)}</p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-6">
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-0">
          <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg px-3 sm:px-4 py-2 text-center min-w-[70px] sm:min-w-[80px] flex-shrink-0">
            <div className="text-blue-300 font-bold text-base sm:text-lg">{formatNumber(campaign.metrics?.totalPosts)}</div>
            <div className="text-xs text-blue-400">POSTS</div>
          </div>
          <div className="bg-cyan-900/20 border border-cyan-800/30 rounded-lg px-3 sm:px-4 py-2 text-center min-w-[70px] sm:min-w-[80px] flex-shrink-0">
            <div className="text-cyan-300 font-bold text-base sm:text-lg">{formatNumber(campaign.metrics?.totalEngagement)}</div>
            <div className="text-xs text-cyan-400">ENGAGE</div>
          </div>
          <div className="bg-green-900/20 border border-green-800/30 rounded-lg px-3 sm:px-4 py-2 text-center min-w-[70px] sm:min-w-[80px] flex-shrink-0">
            <div className="text-green-300 font-bold text-base sm:text-lg">{formatNumber(campaign.metrics?.reach)}</div>
            <div className="text-xs text-green-400">REACH</div>
          </div>
          <div className="bg-purple-900/20 border border-purple-800/30 rounded-lg px-3 sm:px-4 py-2 text-center min-w-[70px] sm:min-w-[80px] flex-shrink-0">
            <div className="text-purple-300 font-bold text-base sm:text-lg">{(campaign.metrics?.engagementRate || 0).toFixed(1)}%</div>
            <div className="text-xs text-purple-400">ENG RATE</div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-start gap-4">
          <div className="text-left sm:text-right">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${getSentimentColor(sentimentScore)}`}>
              <div className="text-xl sm:text-2xl font-bold">{sentimentScore}</div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">SENTIMENT</div>
          </div>

          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={(e) => {
                e.stopPropagation()
                handleRowClick()
              }}
              className="px-3 py-2 hover:bg-accent/30 rounded-lg transition-colors text-foreground/70 hover:text-blue-500 flex items-center gap-2"
            >
              <Eye className="w-4 sm:w-5 h-4 sm:h-5" />
              <span className="text-sm font-medium">View</span>
            </button>
            <button
              onClick={handleToggleMonitoring}
              disabled={isToggling}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                isMonitoring
                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
              }`}
              title={isMonitoring ? 'Active - Click to pause' : 'Paused - Click to activate'}
            >
              {isToggling ? (
                <Loader2 className="w-4 sm:w-5 h-4 sm:h-5 animate-spin" />
              ) : isMonitoring ? (
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
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 hover:bg-accent/30 rounded-lg transition-colors text-foreground/70 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <Loader2 className="w-4 sm:w-5 h-4 sm:h-5 animate-spin" />
              ) : (
                <Trash2 className="w-4 sm:w-5 h-4 sm:h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AnalysisHistoryPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  })
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Debounce search query
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
      setCurrentPage(1) // Reset to first page on search
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch campaigns
  const fetchCampaigns = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const monitored = activeTab === 'active' ? true : activeTab === 'inactive' ? false : undefined
      
      let response
      if (debouncedSearchQuery.trim()) {
        response = await searchCampaigns(debouncedSearchQuery, currentPage, 10, monitored)
      } else {
        response = await getCampaigns(currentPage, 10, monitored)
      }

      setCampaigns(response.data)
      setPagination(response.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch campaigns')
      console.error('Error fetching campaigns:', err)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, debouncedSearchQuery, activeTab])

  useEffect(() => {
    fetchCampaigns()
  }, [fetchCampaigns])

  // Handle tab change
  const handleTabChange = (tab: 'all' | 'active' | 'inactive') => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  // Handle delete campaign
  const handleDeleteCampaign = async (id: string) => {
    try {
      await deleteCampaign(id)
      // Refresh the list
      await fetchCampaigns()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete campaign')
    }
  }

  // Handle toggle monitoring
  const handleToggleMonitoring = async (id: string, isActive: boolean) => {
    try {
      if (isActive) {
        await stopMonitoring(id)
      } else {
        await startMonitoring(id)
      }
      // Refresh the list
      await fetchCampaigns()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update monitoring status')
    }
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const totalPages = pagination.totalPages
    const current = pagination.page

    if (totalPages <= 7) {
      // Show all pages if 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show first page
      pages.push(1)

      if (current > 3) {
        pages.push('...')
      }

      // Show pages around current
      const start = Math.max(2, current - 1)
      const end = Math.min(totalPages - 1, current + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (current < totalPages - 2) {
        pages.push('...')
      }

      // Show last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }

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
                onClick={() => handleTabChange('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:bg-accent/30'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleTabChange('active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === 'active'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:bg-accent/30'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => handleTabChange('inactive')}
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
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Loading campaigns...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                <p className="text-red-500 font-medium mb-2">Error loading campaigns</p>
                <p className="text-muted-foreground text-sm mb-4">{error}</p>
                <button
                  onClick={fetchCampaigns}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : campaigns.length > 0 ? (
            <AnimatedList stagger={0.03} className="divide-y divide-border list-animate-in">
              {campaigns.map((campaign) => (
                <AnimatedItem key={campaign.id}>
                  <CampaignRow 
                    campaign={campaign}
                    onDelete={handleDeleteCampaign}
                    onToggleMonitoring={handleToggleMonitoring}
                  />
                </AnimatedItem>
              ))}
            </AnimatedList>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <p>No campaigns found matching your criteria.</p>
            </div>
          )}
        </div>

        {!isLoading && !error && campaigns.length > 0 && (
          <div className="border-t border-border bg-background px-3 sm:px-4 h-16 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} campaigns
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={!pagination.hasPrev}
                className="p-2 hover:bg-accent/30 rounded-lg transition-colors text-foreground/70 hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="sr-only">Previous</span>
              </button>
              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page as number)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-foreground/70 hover:bg-accent/30 hover:text-foreground'
                    }`}
                  >
                    {page}
                  </button>
                )
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                disabled={!pagination.hasNext}
                className="px-3 sm:px-4 py-2 bg-secondary hover:bg-accent/30 rounded-lg transition-colors text-foreground/70 hover:text-foreground text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
