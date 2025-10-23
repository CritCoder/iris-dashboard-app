'use client'

import { useState, useMemo } from 'react'
import { PageLayout } from '@/components/layout/page-layout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Loader2, Mail, User, Globe, Hash, Shield, MapPin, Phone, Link, Bitcoin, Database } from 'lucide-react'
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

  const searchTypes = [
    { id: 'email', name: 'Email', icon: Mail, description: 'Email addresses' },
    { id: 'username', name: 'Username', icon: User, description: 'Usernames' },
    { id: 'ip_address', name: 'IP Address', icon: Globe, description: 'IP addresses' },
    { id: 'password', name: 'Password', icon: Shield, description: 'Passwords' },
    { id: 'hashed_password', name: 'Hashed Password', icon: Hash, description: 'Hashed passwords' },
    { id: 'vin', name: 'VIN', icon: MapPin, description: 'Vehicle identification' },
    { id: 'license_plate', name: 'License Plate', icon: MapPin, description: 'License plates' },
    { id: 'address', name: 'Address', icon: MapPin, description: 'Physical addresses' },
    { id: 'phone', name: 'Phone', icon: Phone, description: 'Phone numbers' },
    { id: 'social', name: 'Social', icon: Link, description: 'Social profiles' },
    { id: 'crypto_address', name: 'Crypto Address', icon: Bitcoin, description: 'Cryptocurrency addresses' },
    { id: 'domain', name: 'Domain', icon: Database, description: 'Domain names' }
  ]

  return (
    <PageLayout>
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <div className="max-w-4xl w-full mx-auto px-3 sm:px-4 lg:px-6 py-4">
            <Card className="h-fit max-h-[calc(100vh-2rem)] overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Breached Data Search</CardTitle>
                <CardDescription className="text-sm">Search for compromised data across various breach types.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 overflow-y-auto max-h-[calc(100vh-12rem)]">

                {/* Search Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Search By</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {searchTypes.map((type) => {
                      const IconComponent = type.icon
                      const isSelected = activeSearchType === type.id
                      return (
                        <button
                          key={type.id}
                          onClick={() => {
                            setActiveSearchType(type.id)
                            setSearchQuery('')
                            setError(null)
                            setSearchResults(null)
                          }}
                          className={`relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                            isSelected
                              ? 'border-primary bg-accent/50 shadow-md scale-105'
                              : 'border-border bg-card hover:bg-accent/30 hover:border-muted-foreground/30'
                          }`}
                        >
                          {/* Selection indicator */}
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-lg">
                              <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}

                          <div className={`w-8 h-8 rounded-full ${isSelected ? 'bg-primary' : 'bg-muted'} flex items-center justify-center transition-all`}>
                            <IconComponent className={`w-4 h-4 ${isSelected ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                          </div>
                          <div className="text-center">
                            <span className={`text-xs font-medium block ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {type.name}
                            </span>
                            <span className="text-xs opacity-75 text-muted-foreground">
                              {type.description}
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Search Input */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Enter {searchTypes.find(t => t.id === activeSearchType)?.name || 'Search Query'}
                  </label>
                  <div className="flex gap-2 items-center">
                    <div className="relative flex-1">
                      <Input
                        type="text"
                        placeholder={`Enter ${activeSearchType.replace('_', ' ')}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch(1)}
                        className="text-sm"
                      />
                    </div>
                    <Button onClick={() => handleSearch(1)} disabled={loading || !searchQuery.trim()}>
                      {loading && currentPage === 1 ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4 mr-2" />
                      )}
                      {loading && currentPage === 1 ? 'Searching...' : 'Search'}
                    </Button>
                  </div>
                </div>

                {/* Results Section */}
                {loading && (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                )}

                {error && (
                  <div className="flex justify-center items-center py-8">
                    <p className="text-red-500 bg-destructive/10 p-4 rounded-md text-sm">{error}</p>
                  </div>
                )}

                {searchResults && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
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
                    {searchResults.entries.length > 0 ? (
                      <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                        {searchResults.entries.map((entry: any) => (
                          <BreachedDataResultCard key={entry.id} entry={entry} />
                        ))}
                      </div>
                    ) : (
                      <div className="flex justify-center items-center py-8">
                        <p className="text-muted-foreground text-sm">No breached data entries found for this query.</p>
                      </div>
                    )}
                  </div>
                )}

                {!loading && !error && !searchResults && (
                  <div className="flex justify-center items-center py-8">
                    <p className="text-muted-foreground text-center text-sm">
                      Select a search type and enter a query to begin.
                    </p>
                  </div>
                )}

              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
