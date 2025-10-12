'use client'

import { useState } from 'react'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Search, User, MapPin, CreditCard, Car, FileText, Phone, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@/lib/api'

interface SearchResult {
  type: string
  data: any
  found: boolean
}

function SearchCard({ 
  icon: Icon, 
  title, 
  description, 
  placeholder,
  onSearch,
  loading,
  result
}: { 
  icon: React.ElementType
  title: string
  description: string
  placeholder: string
  onSearch: (query: string) => void
  loading: boolean
  result?: SearchResult
}) {
  const [query, setQuery] = useState('')

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query)
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6 hover:border-muted-foreground/50 transition-all">
      <div className="flex items-start gap-3 sm:gap-4 mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-foreground font-semibold mb-1 text-sm sm:text-base">{title}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <Button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Search
          </Button>
        </div>

        {result && (
          <div className="mt-4 p-4 bg-muted/50 border border-border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${result.found ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm font-medium">
                {result.found ? 'Found' : 'Not Found'}
              </span>
            </div>
            {result.data && (
              <div className="text-sm text-muted-foreground">
                {result.found ? (
                  <div className="text-green-600">
                    Data retrieved successfully
                  </div>
                ) : (
                  <div className="text-red-600">
                    {result.data.message || 'No data found for this query'}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Helper function to make OSINT external API calls
const makeOSINTCall = async (type: string, query: string) => {
  try {
    // Mock organization and FIR number for demo purposes
    const org = "IRIS_DEMO"
    const firNo = "DEMO_FIR_001"
    
    switch (type) {
      case 'name':
        return await api.osint.mobileToName({ mobile_number: query, org, firNo })
      case 'address':
        return await api.osint.mobileToAddress({ mobile_number: query, org, firNo })
      case 'account':
        return await api.osint.mobileToAccount({ mobile_number: query, org, firNo })
      case 'vehicle':
        return await api.osint.mobileToVehicle({ mobile_number: query, org, firNo })
      case 'pan':
        return await api.osint.mobileToPAN({ mobile_number: query, org, firNo })
      case 'truecaller':
        return await api.osint.truecallerSearch({ mobile_number: query, org, firNo })
      default:
        return null
    }
  } catch (error) {
    console.error(`OSINT API call failed for ${type}:`, error)
    return null
  }
}

export default function EntitySearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSearchType, setSelectedSearchType] = useState<string>('')
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [unifiedQuery, setUnifiedQuery] = useState('')
  const [unifiedResults, setUnifiedResults] = useState<Record<string, SearchResult>>({})
  const [unifiedLoading, setUnifiedLoading] = useState(false)

  const handleSearch = async (type: string, query: string) => {
    setSearchLoading(true)
    setSearchResult(null)

    try {
      const result = await makeOSINTCall(type, query)
      setSearchResult({
        type,
        data: result,
        found: result && result.success
      })
    } catch (error) {
      console.error('Search error:', error)
      setSearchResult({
        type,
        data: { success: false, message: 'Search failed. Please try again.' },
        found: false
      })
    } finally {
      setSearchLoading(false)
    }
  }

  const handleUnifiedSearch = async () => {
    if (!unifiedQuery.trim()) return

    setUnifiedLoading(true)
    setUnifiedResults({})

    try {
      // Use API to search for all types
      const searchPromises = [
        makeOSINTCall('name', unifiedQuery),
        makeOSINTCall('address', unifiedQuery),
        makeOSINTCall('account', unifiedQuery),
        makeOSINTCall('vehicle', unifiedQuery),
        makeOSINTCall('pan', unifiedQuery),
        makeOSINTCall('truecaller', unifiedQuery)
      ]

      const results = await Promise.all(searchPromises)
      
      const unifiedResults: Record<string, SearchResult> = {
        name: { type: 'name', found: results[0] && results[0].success, data: results[0] },
        address: { type: 'address', found: results[1] && results[1].success, data: results[1] },
        account: { type: 'account', found: results[2] && results[2].success, data: results[2] },
        vehicle: { type: 'vehicle', found: results[3] && results[3].success, data: results[3] },
        pan: { type: 'pan', found: results[4] && results[4].success, data: results[4] },
        truecaller: { type: 'truecaller', found: results[5] && results[5].success, data: results[5] }
      }

      setUnifiedResults(unifiedResults)
    } catch (error) {
      console.error('Search error:', error)
      setUnifiedResults({})
    } finally {
      setUnifiedLoading(false)
    }
  }

  const searchTypes = [
    {
      id: 'name',
      icon: User,
      title: 'Name Search',
      description: 'Search by person name to find detailed information',
      placeholder: 'Enter full name (e.g., John Doe)'
    },
    {
      id: 'address',
      icon: MapPin,
      title: 'Address Search',
      description: 'Search by address to find property and location details',
      placeholder: 'Enter address (e.g., 123 Main St, City)'
    },
    {
      id: 'account',
      icon: CreditCard,
      title: 'Bank Account Search',
      description: 'Search by bank account number or IFSC code',
      placeholder: 'Enter account number or IFSC code'
    },
    {
      id: 'vehicle',
      icon: Car,
      title: 'Vehicle Search',
      description: 'Search by vehicle registration number',
      placeholder: 'Enter registration number (e.g., DL-01-AB-1234)'
    },
    {
      id: 'pan',
      icon: FileText,
      title: 'PAN Search',
      description: 'Search by PAN number for tax and financial information',
      placeholder: 'Enter PAN number (e.g., ABCDE1234F)'
    },
    {
      id: 'truecaller',
      icon: Phone,
      title: 'Phone Search',
      description: 'Search by phone number for contact and location details',
      placeholder: 'Enter mobile number (e.g., 9876543210)'
    }
  ]

  return (
    <PageLayout>
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        <PageHeader 
          title="Entity Search" 
          description="Search for detailed information about people, places, and entities"
        />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* Unified Search */}
          <div className="mb-6 sm:mb-8">
            <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-foreground mb-3 sm:mb-4">Unified Search</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Search across all data sources with a single query
              </p>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4">
                <Input
                  type="text"
                  placeholder="Enter search query (name, phone, address, etc.)"
                  value={unifiedQuery}
                  onChange={(e) => setUnifiedQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUnifiedSearch()}
                  className="flex-1"
                />
                <Button
                  onClick={handleUnifiedSearch}
                  disabled={unifiedLoading || !unifiedQuery.trim()}
                  className="gap-2 w-full sm:w-auto"
                >
                  {unifiedLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  Search All
                </Button>
              </div>

              {Object.keys(unifiedResults).length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(unifiedResults).map(([type, result]) => (
                    <div key={type} className="p-4 bg-muted/50 border border-border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${result.found ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-sm font-medium capitalize">{type}</span>
                      </div>
                      {result.data && (
                        <div className="text-xs text-muted-foreground">
                          {result.found ? (
                            <div className="text-green-600">
                              Data retrieved successfully
                            </div>
                          ) : (
                            <div className="text-red-600">
                              {result.data.message || 'No data found'}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Individual Search Types */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {searchTypes.map((searchType) => (
              <SearchCard
                key={searchType.id}
                icon={searchType.icon}
                title={searchType.title}
                description={searchType.description}
                placeholder={searchType.placeholder}
                onSearch={(query) => handleSearch(searchType.id, query)}
                loading={searchLoading}
                result={searchResult?.type === searchType.id ? searchResult : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
