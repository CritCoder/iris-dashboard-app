'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Search, Eye, Pause, Trash2, ChevronLeft, ChevronRight, Loader2, AlertCircle, ArrowUpDown, TrendingUp } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AnimatedPage, AnimatedGrid, AnimatedCard } from '@/components/ui/animated'
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

function CampaignCard({
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
    if (sentiment >= 70) return 'bg-green-600'
    if (sentiment >= 40) return 'bg-yellow-600'
    return 'bg-red-600'
  }

  // Calculate display values
  const sentimentScore = calculateSentimentScore(campaign.metrics?.sentimentDistribution)
  const displayDate = new Date(campaign.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  const handleCardClick = () => {
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
    <Card
      onClick={handleCardClick}
      className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-muted-foreground/30 h-full flex flex-col"
    >
      <CardContent className="p-5 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-5 pb-4 border-b border-border">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-foreground mb-1 truncate">
              {campaign.name}
            </h3>
            <p className="text-xs text-muted-foreground">{displayDate}</p>
          </div>
          <Badge
            variant={isMonitoring ? "default" : "outline"}
            className={`ml-2 text-xs ${isMonitoring ? '' : 'text-muted-foreground'}`}
          >
            {isMonitoring ? 'Active' : 'Paused'}
          </Badge>
        </div>

        {/* Stats Grid - Clean & Minimal */}
        <div className="grid grid-cols-4 gap-4 mb-5 flex-1">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground mb-1">{formatNumber(campaign.metrics?.totalPosts)}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground mb-1">{formatNumber(campaign.metrics?.totalEngagement)}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Engagement</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground mb-1">{formatNumber(campaign.metrics?.reach)}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Reach</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground mb-1">{(campaign.metrics?.engagementRate || 0).toFixed(1)}%</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Eng. Rate</div>
          </div>
        </div>

        {/* Action Buttons - Simplified */}
        <div className="flex gap-2 pt-4 border-t border-border" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handleCardClick}
            className="flex-1 px-3 py-2 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded transition-colors flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Eye className="w-4 h-4" />
            View
          </button>
          <button
            onClick={handleToggleMonitoring}
            disabled={isToggling}
            className="px-3 py-2 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isToggling ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isMonitoring ? (
              <Pause className="w-4 h-4" />
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-3 py-2 bg-foreground/5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AnalysisHistoryPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  })
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'date' | 'posts' | 'engagement' | 'sentiment'>('date')

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
        response = await searchCampaigns(debouncedSearchQuery, currentPage, 12, monitored)
      } else {
        response = await getCampaigns(currentPage, 12, monitored)
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

  // Sort campaigns
  const sortedCampaigns = [...campaigns].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      case 'posts':
        return (b.metrics?.totalPosts || 0) - (a.metrics?.totalPosts || 0)
      case 'engagement':
        return (b.metrics?.totalEngagement || 0) - (a.metrics?.totalEngagement || 0)
      case 'sentiment':
        return calculateSentimentScore(b.metrics?.sentimentDistribution) - calculateSentimentScore(a.metrics?.sentimentDistribution)
      default:
        return 0
    }
  })

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

        {/* Search, filters, and sort in one row */}
        <div className="border-b border-border bg-background p-3 sm:p-4">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search bar */}
            <div className="relative flex-1 min-w-[200px]">
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
            <div className="flex gap-2">
              <button
                onClick={() => handleTabChange('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:bg-accent/30'
                }`}
              >
                All Campaigns
              </button>
              <button
                onClick={() => handleTabChange('active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'active'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:bg-accent/30'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => handleTabChange('inactive')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'inactive'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:bg-accent/30'
                }`}
              >
                Paused
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-background border border-border rounded-lg text-sm font-medium transition-colors hover:bg-accent/20 cursor-pointer"
              >
                <option value="date">Latest</option>
                <option value="posts">Most Posts</option>
                <option value="engagement">Most Engagement</option>
                <option value="sentiment">Best Sentiment</option>
              </select>
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
          ) : sortedCampaigns.length > 0 ? (
            <div className="p-3 sm:p-4 lg:p-6">
              <AnimatedGrid staggerDelay={0.05} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {sortedCampaigns.map((campaign) => (
                  <AnimatedCard key={campaign.id}>
                    <CampaignCard
                      campaign={campaign}
                      onDelete={handleDeleteCampaign}
                      onToggleMonitoring={handleToggleMonitoring}
                    />
                  </AnimatedCard>
                ))}
              </AnimatedGrid>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <p>No campaigns found matching your criteria.</p>
            </div>
          )}
        </div>

        {!isLoading && !error && sortedCampaigns.length > 0 && (
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
