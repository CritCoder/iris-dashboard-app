'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, Loader2, Mail, User, Globe, Hash, Shield, MapPin, Phone, Link, Bitcoin, Database, Download, Filter, Eye, Copy, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Info, Zap, BarChart3, Grid3x3, List, TrendingUp, X } from 'lucide-react'
import { api } from '@/lib/api'
import { BreachedDataResultCard } from '@/components/breached-data/result-card'
import { BreachedDataSidebar } from '@/components/breached-data/sidebar'

export default function BreachedDataPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [activeSearchType, setActiveSearchType] = useState('email')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [autoLoadAll, setAutoLoadAll] = useState(false)
  const [allResults, setAllResults] = useState<any[]>([])
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [selectedResults, setSelectedResults] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)
  const PAGE_SIZE = 100

  // Ensure component is mounted before rendering content
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const searchTypes = [
    { id: 'email', name: 'Email', icon: Mail, color: 'bg-blue-500', description: 'Search email addresses' },
    { id: 'username', name: 'Username', icon: User, color: 'bg-green-500', description: 'Search usernames' },
    { id: 'ip_address', name: 'IP Address', icon: Globe, color: 'bg-purple-500', description: 'Search IP addresses' },
    { id: 'password', name: 'Password', icon: Shield, color: 'bg-red-500', description: 'Search passwords' },
    { id: 'hashed_password', name: 'Hashed Password', icon: Hash, color: 'bg-orange-500', description: 'Search hashed passwords' },
    { id: 'vin', name: 'VIN', icon: MapPin, color: 'bg-teal-500', description: 'Search vehicle identification numbers' },
    { id: 'license_plate', name: 'License Plate', icon: MapPin, color: 'bg-cyan-500', description: 'Search license plates' },
    { id: 'address', name: 'Address', icon: MapPin, color: 'bg-indigo-500', description: 'Search physical addresses' },
    { id: 'phone', name: 'Phone', icon: Phone, color: 'bg-pink-500', description: 'Search phone numbers' },
    { id: 'social', name: 'Social', icon: Link, color: 'bg-yellow-500', description: 'Search social media handles' },
    { id: 'crypto_address', name: 'Crypto Address', icon: Bitcoin, color: 'bg-amber-500', description: 'Search cryptocurrency addresses' },
    { id: 'domain', name: 'Domain', icon: Database, color: 'bg-emerald-500', description: 'Search domains' }
  ]

  // Helper function to check if all required fields are valid
  const isFormValid = () => {
    return searchQuery.trim().length >= 3 && activeSearchType && !loading
  }

  const handleSearch = async (page = 1, loadAll = false) => {
    // Validate all required fields before proceeding
    if (!searchQuery.trim()) {
      setError('Please enter a search query.')
      return
    }

    if (!activeSearchType) {
      setError('Please select a search type.')
      return
    }

    if (searchQuery.trim().length < 3) {
      setError('Search query must be at least 3 characters long.')
      return
    }

    setLoading(true)
    setError(null)
    setCurrentPage(page)

    // Reset results only on a new search term, not on pagination
    if (page === 1) {
      setSearchResults(null)
      setAllResults([])
    }

    try {
      const formattedQuery = `${activeSearchType}:${searchQuery.trim()}`
      const response = await api.osint.breachedDataSearch({ 
        query: formattedQuery,
        page,
        size: PAGE_SIZE
      })

      if (response.success && response.data && 'result' in response.data) {
        const newResults = response.data.result as any

        if (page === 1) {
          setSearchResults(newResults)
          setAllResults(newResults.entries || [])
        } else {
          // Append to existing results for pagination
          setAllResults(prev => [...prev, ...(newResults.entries || [])])
        }

        // Auto-load all results if enabled and there are more pages
        if (loadAll && newResults.total > (page * PAGE_SIZE)) {
          const totalPages = Math.ceil(newResults.total / PAGE_SIZE)
          if (page < totalPages) {
            // Load next page automatically
            setTimeout(() => handleSearch(page + 1, true), 500)
          }
        }
      } else {
        setError(response.message || 'Failed to fetch breached data.')
        setSearchResults(null)
        setAllResults([])
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.')
      setSearchResults(null)
      setAllResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearchTypeChange = (typeId: string) => {
    setActiveSearchType(typeId)
    setSearchQuery('')
    setError(null)
    setSearchResults(null)
    setAllResults([])
    setAutoLoadAll(false)
    setCurrentPage(1)
  }

  const handleAutoLoadAll = () => {
    // Validate required fields before auto-loading
    if (!searchQuery.trim()) {
      setError('Please enter a search query before loading all results.')
      return
    }

    if (!activeSearchType) {
      setError('Please select a search type before loading all results.')
      return
    }

    if (searchQuery.trim().length < 3) {
      setError('Search query must be at least 3 characters long.')
      return
    }

    setAutoLoadAll(true)
    handleSearch(1, true)
  }

  // Load all breached data by default
  const loadAllBreachedData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Load all types of breached data
      const typeIds = searchTypes.map((type) => type.id)
      const allPromises = typeIds.map(type => 
        api.osint.breachedDataSearch({ 
          query: `${type}:*`, // Search for all entries of this type
          page: 1,
          size: 50
        })
      )
      
      const responses = await Promise.all(allPromises)
      const allData = responses
        .filter(res => res.success && res.data && 'result' in res.data && (res.data as any).result?.entries)
        .flatMap(res => (res.data as any).result.entries)
      
      setAllResults(allData)
      setSearchResults({
        total: allData.length,
        took: 0,
        entries: allData
      })
    } catch (err: any) {
      setError(err.message || 'Failed to load breached data.')
    } finally {
      setLoading(false)
    }
  }

  // Load initial data on mount for better UX
  useEffect(() => {
    // Pre-load some sample data to show the interface is ready
    if (!searchResults && !loading) {
      // This ensures the page shows content immediately
      console.log('Breached data page ready for user input')
    }
  }, [searchResults, loading])

  // Show loading state when page is initializing
  const isPageLoading = loading && !searchResults

  const totalPages = useMemo(() => {
    if (!searchResults || !searchResults.total) return 0
    return Math.ceil(searchResults.total / PAGE_SIZE)
  }, [searchResults])

  // Analytics data
  const analytics = useMemo(() => {
    if (!allResults.length) return null

    const breachSources = allResults.reduce((acc: any, result: any) => {
      const source = result.source || 'Unknown'
      acc[source] = (acc[source] || 0) + 1
      return acc
    }, {})

    const dataTypes = allResults.reduce((acc: any, result: any) => {
      Object.keys(result).forEach(key => {
        if (key !== 'id' && key !== 'source' && result[key]) {
          acc[key] = (acc[key] || 0) + 1
        }
      })
      return acc
    }, {})

    return {
      totalEntries: allResults.length,
      uniqueSources: Object.keys(breachSources).length,
      topSources: Object.entries(breachSources)
        .sort(([,a]: any, [,b]: any) => b - a)
        .slice(0, 5),
      dataTypeDistribution: Object.entries(dataTypes)
        .sort(([,a]: any, [,b]: any) => b - a)
    }
  }, [allResults])

  // Save search to history
  useEffect(() => {
    if (searchQuery && searchResults) {
      setSearchHistory(prev => {
        const newHistory = [searchQuery, ...prev.filter(q => q !== searchQuery)].slice(0, 5)
        return newHistory
      })
    }
  }, [searchQuery, searchResults])

  // Export functionality
  const exportResults = (format: 'json' | 'csv') => {
    if (!allResults.length) return

    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `breached-data-${activeSearchType}-${timestamp}.${format}`

    if (format === 'json') {
      const dataStr = JSON.stringify(allResults, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.click()
      URL.revokeObjectURL(url)
    } else {
      // Convert to CSV
      const headers = new Set<string>()
      allResults.forEach(result => {
        Object.keys(result).forEach(key => headers.add(key))
      })

      const csvContent = [
        Array.from(headers).join(','),
        ...allResults.map(result =>
          Array.from(headers).map(header =>
            JSON.stringify(result[header] || '')
          ).join(',')
        )
      ].join('\n')

      const dataBlob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.click()
      URL.revokeObjectURL(url)
    }
  }

  // Bulk selection
  const toggleSelectAll = () => {
    if (selectedResults.size === allResults.length) {
      setSelectedResults(new Set())
    } else {
      setSelectedResults(new Set(allResults.map((_, index) => index.toString())))
    }
  }

  const toggleSelectResult = (index: number) => {
    const newSelected = new Set(selectedResults)
    const id = index.toString()
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedResults(newSelected)
  }

  // Don't render until mounted to prevent hydration issues
  if (!isMounted) {
    return (
      <PageLayout>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="h-screen flex bg-background">
        {/* Sidebar */}
        <BreachedDataSidebar
          activeType={activeSearchType}
          onTypeChange={handleSearchTypeChange}
          searchTypes={searchTypes}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <PageHeader
            title="Breach Intelligence"
            description="Advanced breach data search and analysis platform"
          />

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Search Input Card */}
            <Card className="border-none shadow-lg bg-gradient-to-br from-card to-card/80">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Search Input */}
                  <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Search for {searchTypes.find(t => t.id === activeSearchType)?.name || 'Data'}
                    </label>
                  </div>

                  {/* Enhanced Input Row */}
                  <div className="flex gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder={`Enter ${activeSearchType.replace('_', ' ')}...`}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && isFormValid() && handleSearch(1)}
                          className="text-sm h-12 pl-4 pr-12 border-2 focus:border-primary/50 bg-background/50"
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Examples */}
                      <div className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="font-medium whitespace-nowrap">Example:</span>
                        <span>
                          {activeSearchType === 'email' && 'john@example.com, user@domain.com'}
                          {activeSearchType === 'username' && 'johndoe, user123, admin'}
                          {activeSearchType === 'phone' && '+1234567890, 9876543210'}
                          {activeSearchType === 'domain' && 'example.com, company.org'}
                          {activeSearchType === 'name' && 'John Doe, Jane Smith'}
                          {activeSearchType === 'password' && 'password123, secret'}
                          {activeSearchType === 'ip_address' && '192.168.1.1, 8.8.8.8'}
                          {activeSearchType === 'hash' && '5f4dcc3b5aa765d61d8327deb882cf99'}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleSearch(1)}
                      disabled={!isFormValid()}
                      className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                    >
                      {loading && currentPage === 1 ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4 mr-2" />
                          Search
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setShowFilters(!showFilters)}
                      className="h-12 px-4"
                    >
                      <Filter className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Recent Search History */}
                  {!searchQuery && searchHistory.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="text-xs text-muted-foreground">Recent searches:</span>
                      {searchHistory.slice(0, 4).map((query, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => setSearchQuery(query)}
                        >
                          {query.length > 20 ? `${query.slice(0, 20)}...` : query}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Error Display */}
                  {error && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                      <span className="text-sm text-destructive">{error}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loading State */}
          {isPageLoading && (
            <Card className="border-none shadow-lg">
              <CardContent className="py-16">
                <div className="text-center max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mx-auto mb-6">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Loading breach data...</h3>
                  <p className="text-muted-foreground mb-6">
                    Please wait while we prepare the search interface and load available data sources.
                  </p>
                  <div className="flex justify-center gap-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Secure search
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Real-time results
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Database className="w-3 h-3" />
                      Multiple sources
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search Loading State */}
          {loading && !isPageLoading && (
            <Card className="border-none shadow-lg">
              <CardContent className="py-16">
                <div className="text-center max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mx-auto mb-6">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Searching breach databases...</h3>
                  <p className="text-muted-foreground mb-6">
                    Scanning multiple breach databases for {activeSearchType} matches. This may take a few moments.
                  </p>
                  <div className="flex justify-center gap-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Database className="w-3 h-3" />
                      Searching databases
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Secure query
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Real-time results
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Section */}
          {searchResults && (
                  <div className="space-y-6">
                    {/* Enhanced Results Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-6 border">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="space-y-3">
                          <h2 className="text-2xl font-bold text-foreground">
                            Found {searchResults.total} results in {searchResults.took}ms
                          </h2>
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span className="text-muted-foreground">
                                {allResults.length} of {searchResults.total} loaded
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              <span className="text-muted-foreground">
                                {PAGE_SIZE} per page
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                              <span className="text-muted-foreground">
                                {Math.round((allResults.length / searchResults.total) * 100)}% complete
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                          {!autoLoadAll && totalPages > 1 && (
                            <Button
                              onClick={handleAutoLoadAll}
                              className="bg-green-600 hover:bg-green-700 text-white"
                              disabled={loading}
                            >
                              <Database className="w-4 h-4 mr-2" />
                              Load All {searchResults.total} Results
                            </Button>
                          )}
                          {totalPages > 1 && !autoLoadAll && (
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSearch(currentPage - 1)}
                                disabled={currentPage <= 1 || loading}
                              >
                                Previous
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSearch(currentPage + 1)}
                                disabled={currentPage >= totalPages || loading}
                              >
                                Next
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Data Retrieval Progress</span>
                          <span className="font-medium">
                            {allResults.length} / {searchResults.total} results
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((allResults.length / searchResults.total) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Results Display - Maximum Data View */}
                    {allResults.length > 0 ? (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">
                            Breached Data Results ({allResults.length} entries)
                          </h3>
                          <div className="text-sm text-muted-foreground">
                            Showing all available data
                          </div>
                        </div>
                        
                        {/* Results Grid - Optimized for maximum data display */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
                          {allResults.map((entry: any, index: number) => (
                            <div key={`${entry.id}-${index}`} className="animate-in fade-in duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                              <BreachedDataResultCard entry={entry} />
                            </div>
                          ))}
                        </div>
                        
                        {/* Auto-loading indicator */}
                        {autoLoadAll && allResults.length < searchResults.total && (
                          <div className="flex items-center justify-center py-8">
                            <div className="flex items-center gap-3">
                              <Loader2 className="w-5 h-5 animate-spin text-primary" />
                              <span className="text-muted-foreground">
                                Auto-loading more results... ({allResults.length} / {searchResults.total})
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex justify-center items-center py-12">
                        <div className="text-center">
                          <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground text-lg">No breached data entries found for this query.</p>
                          <p className="text-muted-foreground text-sm mt-2">Try a different search term or data type.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

          {/* Empty State - Ready for Search */}
          {!isPageLoading && !error && !searchResults && (
            <Card className="border-none shadow-lg">
              <CardContent className="py-16">
                <div className="text-center max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mx-auto mb-6">
                    <Search className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Ready to search breach data</h3>
                  <p className="text-muted-foreground mb-6">
                    Select a data type above and enter your search query to discover compromised information across various breach databases.
                  </p>
                  <div className="flex justify-center gap-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Secure search
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Real-time results
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Database className="w-3 h-3" />
                      Multiple sources
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
