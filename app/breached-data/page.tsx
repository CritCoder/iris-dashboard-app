'use client'

import { useState, useMemo } from 'react'
import { PageLayout } from '@/components/layout/page-layout'
import { BreachedDataSidebar } from '@/components/breached-data/sidebar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'
import { BreachedDataResultCard } from '@/components/breached-data/result-card'

export default function BreachedDataPage() {
  const [activeSearchType, setActiveSearchType] = useState('email')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const PAGE_SIZE = 50

  const handleSearch = async (page = 1) => {
    if (!searchQuery.trim()) {
      setError('Please enter a search query.')
      return
    }

    setLoading(true)
    setError(null)
    setCurrentPage(page)

    // Reset results only on a new search term, not on pagination
    if (page === 1) {
      setSearchResults(null)
    }

    try {
      const formattedQuery = `${activeSearchType}:${searchQuery.trim()}`
      const response = await api.osint.breachedDataSearch({ 
        query: formattedQuery,
        page,
        size: PAGE_SIZE
      })

      if (response.success && response.data?.result) {
        setSearchResults(response.data.result)
      } else {
        setError(response.message || 'Failed to fetch breached data.')
        setSearchResults(null)
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.')
      setSearchResults(null)
    } finally {
      setLoading(false)
    }
  }

  const totalPages = useMemo(() => {
    if (!searchResults || !searchResults.total) return 0
    return Math.ceil(searchResults.total / PAGE_SIZE)
  }, [searchResults])

  return (
    <PageLayout>
      <div className="h-screen flex bg-background overflow-hidden">
        {/* Left Sidebar */}
        <div className="hidden md:block w-72 border-r border-border bg-card/30 p-4">
          <BreachedDataSidebar
            activeType={activeSearchType}
            onTypeChange={(type) => {
              setActiveSearchType(type)
              setSearchQuery('')
              setError(null)
              setSearchResults(null)
            }}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border">
            <h1 className="text-2xl font-bold">Breached Data Search</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Search for compromised data across various breach types.
            </p>
            <div className="mt-4 flex gap-2 items-center max-w-lg">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-semibold capitalize">
                  {activeSearchType.replace('_', ' ')}:
                </span>
                <Input
                  type="text"
                  placeholder={`Enter ${activeSearchType.replace('_', ' ')}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(1)}
                  className="pl-28" // Adjust padding for the prefix
                />
              </div>
              <Button onClick={() => handleSearch(1)} disabled={loading}>
                {loading && currentPage === 1 ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                {loading && currentPage === 1 ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {loading && (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            )}
            
            {error && (
              <div className="flex justify-center items-center h-full">
                <p className="text-red-500 bg-destructive/10 p-4 rounded-md">{error}</p>
              </div>
            )}
            
            {searchResults && (
              <div>
                <div className="mb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Found {searchResults.total} results in {searchResults.took}
                    </h2>
                    {totalPages > 0 && (
                       <p className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </p>
                    )}
                  </div>
                  {totalPages > 1 && (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => handleSearch(currentPage - 1)}
                        disabled={currentPage <= 1 || loading}
                      >
                        Previous
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleSearch(currentPage + 1)}
                        disabled={currentPage >= totalPages || loading}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </div>
                {searchResults.entries.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
                    {searchResults.entries.map((entry: any) => (
                      <BreachedDataResultCard key={entry.id} entry={entry} />
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-64">
                    <p className="text-muted-foreground">No breached data entries found for this query.</p>
                  </div>
                )}
              </div>
            )}

            {!loading && !error && !searchResults && (
              <div className="flex justify-center items-center h-full">
                <p className="text-muted-foreground text-center">
                  Select a search type and enter a query to begin.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
