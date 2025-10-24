'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Eye, Pause, Trash2, Loader2, AlertCircle, ArrowUpDown, TrendingUp, Grid3X3, List } from 'lucide-react'
import { SearchInput } from '@/components/ui/search-input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DeleteConfirmationModal } from '@/components/ui/delete-confirmation-modal'
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
  const [showDeleteModal, setShowDeleteModal] = useState(false)

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

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(campaign.id)
      setShowDeleteModal(false)
    } finally {
      setIsDeleting(false)
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
          {isMonitoring ? (
            <div className="ml-2 flex items-center gap-1.5 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-md">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-1.5 h-1.5 bg-green-500 rounded-full animate-ping opacity-75"></div>
                <div className="relative w-1 h-1 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-xs text-green-400 font-medium">Live</span>
            </div>
          ) : (
            <Badge variant="outline" className="ml-2 text-xs text-muted-foreground">
              Paused
            </Badge>
          )}
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Campaign"
        description="This will permanently remove the campaign and all its associated data."
        itemName={campaign.name}
        isLoading={isDeleting}
      />
    </Card>
  )
}

function CampaignListItem({
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
  const [showDeleteModal, setShowDeleteModal] = useState(false)

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

  const handleRowClick = () => {
    router.push(`/analysis-history/${campaign.id}`)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(campaign.id)
      setShowDeleteModal(false)
    } finally {
      setIsDeleting(false)
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
    <>
      <div
        onClick={handleRowClick}
        className="group cursor-pointer hover:bg-accent/20 transition-all duration-200 border-b border-border/40 last:border-b-0 hover:border-border/60 hover:shadow-sm"
      >
        <div className="px-6 py-4 flex items-center gap-4">
          {/* Campaign Info */}
          <div className="flex-1 min-w-[300px]">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-sm font-semibold text-foreground truncate">
                {campaign.name}
              </h3>
              {isMonitoring ? (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-md">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-1.5 h-1.5 bg-green-500 rounded-full animate-ping opacity-75"></div>
                    <div className="relative w-1 h-1 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-xs text-green-400 font-medium">Live</span>
                </div>
              ) : (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  Paused
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{displayDate}</p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 text-sm">
            <div className="text-center min-w-[80px]">
              <div className="font-semibold text-foreground">{formatNumber(campaign.metrics?.totalPosts)}</div>
              <div className="text-xs text-muted-foreground">Posts</div>
            </div>
            <div className="text-center min-w-[100px]">
              <div className="font-semibold text-foreground">{formatNumber(campaign.metrics?.totalEngagement)}</div>
              <div className="text-xs text-muted-foreground">Engagement</div>
            </div>
            <div className="text-center min-w-[80px]">
              <div className="font-semibold text-foreground">{formatNumber(campaign.metrics?.reach)}</div>
              <div className="text-xs text-muted-foreground">Reach</div>
            </div>
            <div className="text-center min-w-[100px]">
              <div className="font-semibold text-foreground">{(campaign.metrics?.engagementRate || 0).toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Eng. Rate</div>
            </div>
            <div className="text-center min-w-[80px]">
              <div className="font-semibold text-foreground">{sentimentScore}%</div>
              <div className="text-xs text-muted-foreground">Sentiment</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 min-w-[140px]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleRowClick}
              className="px-3 py-1.5 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded transition-colors flex items-center gap-1.5 text-xs font-medium"
            >
              <Eye className="w-3 h-3" />
              View
            </button>
            <button
              onClick={handleToggleMonitoring}
              disabled={isToggling}
              className="px-3 py-1.5 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isToggling ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : isMonitoring ? (
                <Pause className="w-3 h-3" />
              ) : (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-3 py-1.5 bg-foreground/5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Trash2 className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Campaign"
        description="This will permanently remove the campaign and all its associated data."
        itemName={campaign.name}
        isLoading={isDeleting}
      />
    </>
  )
}

export default function AnalysisHistoryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  })
  
  // Initialize activeTab from URL parameters
  const getInitialActiveTab = (): 'all' | 'active' | 'inactive' => {
    const filter = searchParams.get('filter')
    if (filter === 'active') return 'active'
    if (filter === 'inactive') return 'inactive'
    return 'all'
  }
  
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>(getInitialActiveTab)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'date' | 'posts' | 'engagement' | 'sentiment'>('date')
  const [viewMode, setViewMode] = useState<'card' | 'list'>('list')
  const loadMoreRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoadingMore) return
    if (observerRef.current) observerRef.current.disconnect()
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && pagination.hasNext && !isLoadingMore) {
        setCurrentPage(prev => prev + 1)
      }
    })
    if (node) observerRef.current.observe(node)
  }, [isLoadingMore, pagination.hasNext])
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Debounce search query
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')

  // Update activeTab when URL parameters change
  useEffect(() => {
    const newActiveTab = getInitialActiveTab()
    if (newActiveTab !== activeTab) {
      setActiveTab(newActiveTab)
      setCurrentPage(1) // Reset to first page when filter changes
      setCampaigns([]) // Clear campaigns when filter changes
    }
  }, [searchParams])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
      setCurrentPage(1) // Reset to first page on search
      setCampaigns([]) // Clear campaigns when search changes
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch campaigns
  const fetchCampaigns = useCallback(async () => {
    // Set appropriate loading state
    if (currentPage === 1) {
      setIsLoading(true)
      setCampaigns([]) // Clear campaigns when loading first page
    } else {
      setIsLoadingMore(true)
    }
    setError(null)

    try {
      const monitored = activeTab === 'active' ? true : activeTab === 'inactive' ? false : undefined

      let response
      if (debouncedSearchQuery.trim()) {
        response = await searchCampaigns(debouncedSearchQuery, currentPage, 12, monitored)
      } else {
        response = await getCampaigns(currentPage, 12, monitored)
      }

      // Append or replace campaigns based on page
      if (currentPage === 1) {
        setCampaigns(response.data)
      } else {
        // Deduplicate campaigns by ID before appending
        setCampaigns(prev => {
          const existingIds = new Set(prev.map(c => c.id))
          const newCampaigns = response.data.filter(c => !existingIds.has(c.id))
          return [...prev, ...newCampaigns]
        })
      }
      setPagination(response.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch campaigns')
      console.error('Error fetching campaigns:', err)
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
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
    setCampaigns([]) // Clear campaigns when changing tabs

    // Update URL to reflect the filter
    const params = new URLSearchParams(searchParams.toString())
    if (tab === 'all') {
      params.delete('filter')
    } else {
      params.set('filter', tab)
    }
    router.push(`/analysis-history${params.toString() ? '?' + params.toString() : ''}`)
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

  return (
    <PageLayout>
      <div className="h-screen flex flex-col overflow-hidden">
        <PageHeader
          title="Analysis History"
          description="Track and manage your campaign analyses"
          actions={
            /* View Toggle in Header */
            <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
              <button
                onClick={() => setViewMode('card')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'card'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Card View"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          }
        />

        {/* Search, filters, and sort in one row */}
        <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Filter buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleTabChange('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:bg-accent/30'
                }`}
              >
                All Searches
              </button>
              <button
                onClick={() => handleTabChange('active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'active'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:bg-accent/30'
                }`}
              >
                Active Campaigns
              </button>
              <button
                onClick={() => handleTabChange('inactive')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'inactive'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:bg-accent/30'
                }`}
              >
                Paused Campaigns
              </button>
            </div>

            {/* Center: Search bar */}
            <div className="flex-1 max-w-md">
              <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search campaigns..."
                showKbd={false}
              />
            </div>

            {/* Right: Sort Dropdown */}
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
            viewMode === 'card' ? (
              <div className="w-full px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
                  {sortedCampaigns.map((campaign) => (
                    <CampaignCard
                      key={campaign.id}
                      campaign={campaign}
                      onDelete={handleDeleteCampaign}
                      onToggleMonitoring={handleToggleMonitoring}
                    />
                  ))}
                </div>
                {/* Infinite Scroll Trigger */}
                {pagination.hasNext && !isLoadingMore && (
                  <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                )}
                {/* Loading More Indicator */}
                {isLoadingMore && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
                    <p className="text-muted-foreground">Loading more campaigns...</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full">
                <div className="bg-background/50 border-b border-border/30">
                  {/* List Header */}
                  <div className="px-6 py-3 border-b border-border/50 bg-muted/50 backdrop-blur-sm">
                    <div className="flex items-center gap-8 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      <div className="flex-1 min-w-[400px]">Campaign</div>
                      <div className="flex items-center gap-8">
                        <div className="text-center min-w-[80px]">Posts</div>
                        <div className="text-center min-w-[100px]">Engagement</div>
                        <div className="text-center min-w-[80px]">Reach</div>
                        <div className="text-center min-w-[100px]">Eng. Rate</div>
                        <div className="text-center min-w-[80px]">Sentiment</div>
                        <div className="text-center min-w-[140px]">Actions</div>
                      </div>
                    </div>
                  </div>
                  {/* List Items */}
                  <div className="divide-y divide-border">
                    {sortedCampaigns.map((campaign) => (
                      <CampaignListItem
                        key={campaign.id}
                        campaign={campaign}
                        onDelete={handleDeleteCampaign}
                        onToggleMonitoring={handleToggleMonitoring}
                      />
                    ))}
                  </div>
                </div>
                {/* Infinite Scroll Trigger */}
                {pagination.hasNext && !isLoadingMore && (
                  <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                )}
                {/* Loading More Indicator */}
                {isLoadingMore && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
                    <p className="text-muted-foreground">Loading more campaigns...</p>
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="flex min-h-[60vh] items-center justify-center p-8 text-center text-muted-foreground">
              <div className="flex flex-col items-center gap-3">
                <p>No campaigns found matching your criteria.</p>
              </div>
            </div>
          )}
        </div>

        {/* Status Bar - Shows total count */}
        {!isLoading && !error && sortedCampaigns.length > 0 && (
          <div className="border-t border-border/50 bg-card/40 backdrop-blur-sm px-6 h-12 flex items-center justify-center shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
            <p className="text-sm font-medium text-foreground/80">
              <span className="text-primary font-semibold">{sortedCampaigns.length}</span> of <span className="text-foreground font-semibold">{pagination.total}</span> campaigns loaded
              {pagination.hasNext && <span className="ml-2 text-primary animate-pulse">• Scroll for more</span>}
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
