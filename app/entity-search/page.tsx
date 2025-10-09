'use client'

import { useState } from 'react'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Search, User, MapPin, CreditCard, Car, FileText, Phone, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
    <div className="bg-card border border-border rounded-lg p-6 hover:border-muted-foreground/50 transition-all">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-foreground font-semibold mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
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
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Search
              </>
            )}
          </Button>
        </div>

        {result && (
          <div className={`p-4 rounded-lg border ${
            result.found 
              ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
              : 'bg-muted/50 border-border'
          }`}>
            {result.found ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium mb-3">
                  <div className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400" />
                  Results Found
                </div>
                {Object.entries(result.data).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}:</span>
                    <span className="text-foreground font-medium">{value as string}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                No results found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function EntitySearchPage() {
  const [activeTab, setActiveTab] = useState<'unified' | 'advanced'>('unified')
  const [unifiedQuery, setUnifiedQuery] = useState('')
  const [unifiedLoading, setUnifiedLoading] = useState(false)
  const [unifiedResults, setUnifiedResults] = useState<Record<string, SearchResult>>({})
  
  // New state for two-step advanced search
  const [selectedSearchType, setSelectedSearchType] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)
  
  const [searchStates, setSearchStates] = useState<Record<string, { loading: boolean; result?: SearchResult }>>({
    name: { loading: false },
    address: { loading: false },
    account: { loading: false },
    vehicle: { loading: false },
    pan: { loading: false },
    truecaller: { loading: false }
  })

  const handleUnifiedSearch = async () => {
    if (!unifiedQuery.trim()) return

    setUnifiedLoading(true)
    setUnifiedResults({})

    // Simulate API calls for all search types
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Enhanced mock results with more diverse data
    const demoProfiles = [
      {
        name: {
          full_name: 'Rahul Kumar Sharma',
          age: '32',
          gender: 'Male',
          location: 'Bangalore, Karnataka'
        },
        address: {
          primary_address: 'HSR Layout, Sector 2, Bangalore - 560102',
          secondary_address: 'BTM Layout, Stage 1, Bangalore - 560068',
          registered_since: '2018'
        },
        account: {
          bank_name: 'HDFC Bank',
          account_type: 'Savings',
          ifsc_code: 'HDFC0001234',
          branch: 'HSR Layout Branch'
        },
        vehicle: {
          vehicle_number: 'KA-01-AB-1234',
          vehicle_type: 'Car',
          make_model: 'Honda City 2020',
          registration_date: '15/03/2020'
        },
        pan: {
          pan_number: 'ABCDE1234F',
          name_on_pan: 'RAHUL KUMAR SHARMA',
          status: 'Active',
          linked_aadhaar: 'Yes'
        },
        truecaller: {
          name: 'Rahul Sharma',
          carrier: 'Airtel',
          location: 'Bangalore',
          spam_score: 'Low',
          verified: 'Yes'
        }
      },
      {
        name: {
          full_name: 'Priya Singh',
          age: '28',
          gender: 'Female',
          location: 'Mumbai, Maharashtra'
        },
        address: {
          primary_address: 'Andheri West, Mumbai - 400058',
          secondary_address: 'Bandra East, Mumbai - 400051',
          registered_since: '2020'
        },
        account: {
          bank_name: 'ICICI Bank',
          account_type: 'Current',
          ifsc_code: 'ICIC0005678',
          branch: 'Andheri Branch'
        },
        vehicle: {
          vehicle_number: 'MH-02-CD-5678',
          vehicle_type: 'Scooter',
          make_model: 'TVS Jupiter 2021',
          registration_date: '22/07/2021'
        },
        pan: {
          pan_number: 'FGHIJ5678K',
          name_on_pan: 'PRIYA SINGH',
          status: 'Active',
          linked_aadhaar: 'Yes'
        },
        truecaller: {
          name: 'Priya Singh',
          carrier: 'Jio',
          location: 'Mumbai',
          spam_score: 'Low',
          verified: 'Yes'
        }
      },
      {
        name: {
          full_name: 'Amit Patel',
          age: '35',
          gender: 'Male',
          location: 'Ahmedabad, Gujarat'
        },
        address: {
          primary_address: 'Vastrapur, Ahmedabad - 380015',
          secondary_address: 'Satellite, Ahmedabad - 380015',
          registered_since: '2019'
        },
        account: {
          bank_name: 'SBI',
          account_type: 'Savings',
          ifsc_code: 'SBIN0009012',
          branch: 'Vastrapur Branch'
        },
        vehicle: {
          vehicle_number: 'GJ-01-EF-9012',
          vehicle_type: 'Bike',
          make_model: 'Bajaj Pulsar 2019',
          registration_date: '10/12/2019'
        },
        pan: {
          pan_number: 'KLMNO9012P',
          name_on_pan: 'AMIT PATEL',
          status: 'Active',
          linked_aadhaar: 'Yes'
        },
        truecaller: {
          name: 'Amit Patel',
          carrier: 'Vodafone',
          location: 'Ahmedabad',
          spam_score: 'Medium',
          verified: 'No'
        }
      }
    ]

    // Select a random profile for demo
    const selectedProfile = demoProfiles[Math.floor(Math.random() * demoProfiles.length)]
    
    const mockResults: Record<string, SearchResult> = {
      name: {
        type: 'name',
        found: Math.random() > 0.1, // Higher success rate for better demo experience
        data: selectedProfile.name
      },
      address: {
        type: 'address',
        found: Math.random() > 0.1,
        data: selectedProfile.address
      },
      account: {
        type: 'account',
        found: Math.random() > 0.1,
        data: selectedProfile.account
      },
      vehicle: {
        type: 'vehicle',
        found: Math.random() > 0.1,
        data: selectedProfile.vehicle
      },
      pan: {
        type: 'pan',
        found: Math.random() > 0.1,
        data: selectedProfile.pan
      },
      truecaller: {
        type: 'truecaller',
        found: Math.random() > 0.1,
        data: selectedProfile.truecaller
      }
    }

    setUnifiedResults(mockResults)
    setUnifiedLoading(false)
  }

  const handleAdvancedSearch = async () => {
    if (!searchQuery.trim() || !selectedSearchType) return

    setSearchLoading(true)
    setSearchResult(null)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Enhanced demo data with multiple profiles
    const demoProfiles = [
      {
        name: {
          full_name: 'Rahul Kumar Sharma',
          age: '32',
          gender: 'Male',
          location: 'Bangalore, Karnataka'
        },
        address: {
          primary_address: 'HSR Layout, Sector 2, Bangalore - 560102',
          secondary_address: 'BTM Layout, Stage 1, Bangalore - 560068',
          registered_since: '2018'
        },
        account: {
          bank_name: 'HDFC Bank',
          account_type: 'Savings',
          ifsc_code: 'HDFC0001234',
          branch: 'HSR Layout Branch'
        },
        vehicle: {
          vehicle_number: 'KA-01-AB-1234',
          vehicle_type: 'Car',
          make_model: 'Honda City 2020',
          registration_date: '15/03/2020'
        },
        pan: {
          pan_number: 'ABCDE1234F',
          name_on_pan: 'RAHUL KUMAR SHARMA',
          status: 'Active',
          linked_aadhaar: 'Yes'
        },
        truecaller: {
          name: 'Rahul Sharma',
          carrier: 'Airtel',
          location: 'Bangalore',
          spam_score: 'Low',
          verified: 'Yes'
        }
      },
      {
        name: {
          full_name: 'Priya Singh',
          age: '28',
          gender: 'Female',
          location: 'Mumbai, Maharashtra'
        },
        address: {
          primary_address: 'Andheri West, Mumbai - 400058',
          secondary_address: 'Bandra East, Mumbai - 400051',
          registered_since: '2020'
        },
        account: {
          bank_name: 'ICICI Bank',
          account_type: 'Current',
          ifsc_code: 'ICIC0005678',
          branch: 'Andheri Branch'
        },
        vehicle: {
          vehicle_number: 'MH-02-CD-5678',
          vehicle_type: 'Scooter',
          make_model: 'TVS Jupiter 2021',
          registration_date: '22/07/2021'
        },
        pan: {
          pan_number: 'FGHIJ5678K',
          name_on_pan: 'PRIYA SINGH',
          status: 'Active',
          linked_aadhaar: 'Yes'
        },
        truecaller: {
          name: 'Priya Singh',
          carrier: 'Jio',
          location: 'Mumbai',
          spam_score: 'Low',
          verified: 'Yes'
        }
      },
      {
        name: {
          full_name: 'Amit Patel',
          age: '35',
          gender: 'Male',
          location: 'Ahmedabad, Gujarat'
        },
        address: {
          primary_address: 'Vastrapur, Ahmedabad - 380015',
          secondary_address: 'Satellite, Ahmedabad - 380015',
          registered_since: '2019'
        },
        account: {
          bank_name: 'SBI',
          account_type: 'Savings',
          ifsc_code: 'SBIN0009012',
          branch: 'Vastrapur Branch'
        },
        vehicle: {
          vehicle_number: 'GJ-01-EF-9012',
          vehicle_type: 'Bike',
          make_model: 'Bajaj Pulsar 2019',
          registration_date: '10/12/2019'
        },
        pan: {
          pan_number: 'KLMNO9012P',
          name_on_pan: 'AMIT PATEL',
          status: 'Active',
          linked_aadhaar: 'Yes'
        },
        truecaller: {
          name: 'Amit Patel',
          carrier: 'Vodafone',
          location: 'Ahmedabad',
          spam_score: 'Medium',
          verified: 'No'
        }
      }
    ]

    // Select a random profile for demo
    const selectedProfile = demoProfiles[Math.floor(Math.random() * demoProfiles.length)]
    
    const mockData: Record<string, any> = {
      name: selectedProfile.name,
      address: selectedProfile.address,
      account: selectedProfile.account,
      vehicle: selectedProfile.vehicle,
      pan: selectedProfile.pan,
      truecaller: selectedProfile.truecaller
    }

    const result: SearchResult = {
      type: selectedSearchType,
      found: Math.random() > 0.1, // Higher success rate for better demo experience
      data: mockData[selectedSearchType]
    }

    setSearchResult(result)
    setSearchLoading(false)
  }

  const handleIndividualSearch = async (type: string, query: string) => {
    setSearchStates(prev => ({
      ...prev,
      [type]: { loading: true }
    }))

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Enhanced demo data with multiple profiles
    const demoProfiles = [
      {
        name: {
          full_name: 'Rahul Kumar Sharma',
          age: '32',
          gender: 'Male',
          location: 'Bangalore, Karnataka'
        },
        address: {
          primary_address: 'HSR Layout, Sector 2, Bangalore - 560102',
          secondary_address: 'BTM Layout, Stage 1, Bangalore - 560068',
          registered_since: '2018'
        },
        account: {
          bank_name: 'HDFC Bank',
          account_type: 'Savings',
          ifsc_code: 'HDFC0001234',
          branch: 'HSR Layout Branch'
        },
        vehicle: {
          vehicle_number: 'KA-01-AB-1234',
          vehicle_type: 'Car',
          make_model: 'Honda City 2020',
          registration_date: '15/03/2020'
        },
        pan: {
          pan_number: 'ABCDE1234F',
          name_on_pan: 'RAHUL KUMAR SHARMA',
          status: 'Active',
          linked_aadhaar: 'Yes'
        },
        truecaller: {
          name: 'Rahul Sharma',
          carrier: 'Airtel',
          location: 'Bangalore',
          spam_score: 'Low',
          verified: 'Yes'
        }
      },
      {
        name: {
          full_name: 'Priya Singh',
          age: '28',
          gender: 'Female',
          location: 'Mumbai, Maharashtra'
        },
        address: {
          primary_address: 'Andheri West, Mumbai - 400058',
          secondary_address: 'Bandra East, Mumbai - 400051',
          registered_since: '2020'
        },
        account: {
          bank_name: 'ICICI Bank',
          account_type: 'Current',
          ifsc_code: 'ICIC0005678',
          branch: 'Andheri Branch'
        },
        vehicle: {
          vehicle_number: 'MH-02-CD-5678',
          vehicle_type: 'Scooter',
          make_model: 'TVS Jupiter 2021',
          registration_date: '22/07/2021'
        },
        pan: {
          pan_number: 'FGHIJ5678K',
          name_on_pan: 'PRIYA SINGH',
          status: 'Active',
          linked_aadhaar: 'Yes'
        },
        truecaller: {
          name: 'Priya Singh',
          carrier: 'Jio',
          location: 'Mumbai',
          spam_score: 'Low',
          verified: 'Yes'
        }
      },
      {
        name: {
          full_name: 'Amit Patel',
          age: '35',
          gender: 'Male',
          location: 'Ahmedabad, Gujarat'
        },
        address: {
          primary_address: 'Vastrapur, Ahmedabad - 380015',
          secondary_address: 'Satellite, Ahmedabad - 380015',
          registered_since: '2019'
        },
        account: {
          bank_name: 'SBI',
          account_type: 'Savings',
          ifsc_code: 'SBIN0009012',
          branch: 'Vastrapur Branch'
        },
        vehicle: {
          vehicle_number: 'GJ-01-EF-9012',
          vehicle_type: 'Bike',
          make_model: 'Bajaj Pulsar 2019',
          registration_date: '10/12/2019'
        },
        pan: {
          pan_number: 'KLMNO9012P',
          name_on_pan: 'AMIT PATEL',
          status: 'Active',
          linked_aadhaar: 'Yes'
        },
        truecaller: {
          name: 'Amit Patel',
          carrier: 'Vodafone',
          location: 'Ahmedabad',
          spam_score: 'Medium',
          verified: 'No'
        }
      }
    ]

    // Select a random profile for demo
    const selectedProfile = demoProfiles[Math.floor(Math.random() * demoProfiles.length)]
    
    const mockData: Record<string, any> = {
      name: selectedProfile.name,
      address: selectedProfile.address,
      account: selectedProfile.account,
      vehicle: selectedProfile.vehicle,
      pan: selectedProfile.pan,
      truecaller: selectedProfile.truecaller
    }

    const result: SearchResult = {
      type,
      found: Math.random() > 0.1, // Higher success rate for better demo experience
      data: mockData[type]
    }

    setSearchStates(prev => ({
      ...prev,
      [type]: { loading: false, result }
    }))
  }

  const searchTypes = [
    {
      id: 'name',
      icon: User,
      title: 'Name Search',
      description: 'Find name associated with mobile number',
      placeholder: 'Enter mobile number (e.g., 9876543210)'
    },
    {
      id: 'address',
      icon: MapPin,
      title: 'Address Search',
      description: 'Find addresses associated with mobile number',
      placeholder: 'Enter mobile number (e.g., 9876543210)'
    },
    {
      id: 'account',
      icon: CreditCard,
      title: 'Account Search',
      description: 'Find bank account details associated with mobile number',
      placeholder: 'Enter mobile number (e.g., 9876543210)'
    },
    {
      id: 'vehicle',
      icon: Car,
      title: 'Vehicle Search',
      description: 'Find vehicles registered with mobile number',
      placeholder: 'Enter mobile number (e.g., 9876543210)'
    },
    {
      id: 'pan',
      icon: FileText,
      title: 'PAN Search',
      description: 'Find PAN details associated with mobile number',
      placeholder: 'Enter mobile number (e.g., 9876543210)'
    },
    {
      id: 'truecaller',
      icon: Phone,
      title: 'TrueCaller Search',
      description: 'Find caller details from TrueCaller database',
      placeholder: 'Enter mobile number (e.g., 9876543210)'
    }
  ]

  return (
    <PageLayout>
      <PageHeader 
        title="Entity Search"
        description="Search and discover information across multiple databases"
      />
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1800px] mx-auto px-6 py-8">
          {/* Modern Tabs */}
          <div className="flex justify-center mb-8">
            <div className="tabs-container">
              <div className="tabs">
                <input 
                  type="radio" 
                  id="radio-unified" 
                  name="search-tabs" 
                  checked={activeTab === 'unified'}
                  onChange={() => setActiveTab('unified')}
                />
                <label className="tab" htmlFor="radio-unified">
                  Unified Search
                </label>
                <input 
                  type="radio" 
                  id="radio-advanced" 
                  name="search-tabs"
                  checked={activeTab === 'advanced'}
                  onChange={() => setActiveTab('advanced')}
                />
                <label className="tab" htmlFor="radio-advanced">
                  Advanced Search
                </label>
                <span className="glider"></span>
              </div>
            </div>
          </div>

          {activeTab === 'unified' ? (
            <div className="space-y-6">
              {/* Unified Search Bar */}
              <div className="flex justify-center">
                <div className="bg-card border border-border rounded-lg p-6 w-1/2">
                  <div className="flex items-center gap-3 mb-4">
                    <Search className="w-6 h-6 text-muted-foreground" />
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Unified Search</h2>
                      <p className="text-sm text-muted-foreground">Search across all databases simultaneously</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Input
                      type="text"
                      placeholder="Enter mobile number (e.g., 9876543210)"
                      value={unifiedQuery}
                      onChange={(e) => setUnifiedQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleUnifiedSearch()}
                      className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 flex-1 text-lg py-6"
                    />
                    <Button 
                      onClick={handleUnifiedSearch}
                      disabled={unifiedLoading || !unifiedQuery.trim()}
                      className="gap-2 px-8"
                      size="lg"
                    >
                      {unifiedLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="w-5 h-5" />
                          Search All
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Unified Results */}
              {Object.keys(unifiedResults).length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {searchTypes.map((searchType) => {
                    const result = unifiedResults[searchType.id]
                    if (!result) return null

                    return (
                      <div key={searchType.id} className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                            <searchType.icon className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-foreground font-semibold mb-1">{searchType.title}</h3>
                            <p className="text-sm text-muted-foreground">{searchType.description}</p>
                          </div>
                        </div>

                        <div className={`p-4 rounded-lg border ${
                          result.found 
                            ? 'bg-green-900/20 border-green-800' 
                            : 'bg-zinc-800/50 border-zinc-700'
                        }`}>
                          {result.found ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-green-400 text-sm font-medium mb-3">
                                <div className="w-2 h-2 rounded-full bg-green-400" />
                                Results Found
                              </div>
                              {Object.entries(result.data).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between text-sm">
                                  <span className="text-zinc-400 capitalize">{key.replace(/_/g, ' ')}:</span>
                                  <span className="text-white font-medium">{value as string}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-zinc-500 text-sm">
                              <div className="w-2 h-2 rounded-full bg-zinc-600" />
                              No results found
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {/* Search Options Grid */}
              {!selectedSearchType ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {searchTypes.map((searchType) => (
                    <div
                  key={searchType.id}
                      onClick={() => setSelectedSearchType(searchType.id)}
                      className="bg-card border border-border rounded-lg p-6 hover:border-muted-foreground/50 transition-all cursor-pointer group"
                    >
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 rounded-lg bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                          <searchType.icon className="w-8 h-8 text-zinc-400 group-hover:text-zinc-300" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold mb-2">{searchType.title}</h3>
                          <p className="text-sm text-zinc-500">{searchType.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Back Button */}
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedSearchType(null)
                        setSearchQuery('')
                        setSearchResult(null)
                      }}
                      className="gap-2"
                    >
                      ← Back to Search Options
                    </Button>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                        {(() => {
                          const searchType = searchTypes.find(s => s.id === selectedSearchType)
                          return searchType ? <searchType.icon className="w-5 h-5 text-zinc-400" /> : null
                        })()}
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-white">
                          {searchTypes.find(s => s.id === selectedSearchType)?.title}
                        </h2>
                        <p className="text-sm text-zinc-500">
                          {searchTypes.find(s => s.id === selectedSearchType)?.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Search Input */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="mobile-input" className="text-sm font-medium text-zinc-300 mb-2 block">
                          Enter Mobile Number
                        </Label>
                        <div className="flex gap-3">
                          <Input
                            id="mobile-input"
                            type="text"
                            placeholder="Enter mobile number (e.g., 9876543210)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAdvancedSearch()}
                            className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 flex-1"
                          />
                          <Button 
                            onClick={handleAdvancedSearch}
                            disabled={searchLoading || !searchQuery.trim()}
                            className="gap-2"
                          >
                            {searchLoading ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Searching...
                              </>
                            ) : (
                              <>
                                <Search className="w-4 h-4" />
                                Search
                              </>
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Search Result */}
                      {searchResult && (
                        <div className={`p-4 rounded-lg border ${
                          searchResult.found 
                            ? 'bg-green-900/20 border-green-800' 
                            : 'bg-zinc-800/50 border-zinc-700'
                        }`}>
                          {searchResult.found ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-green-400 text-sm font-medium mb-3">
                                <div className="w-2 h-2 rounded-full bg-green-400" />
                                Results Found
                              </div>
                              {Object.entries(searchResult.data).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between text-sm">
                                  <span className="text-zinc-400 capitalize">{key.replace(/_/g, ' ')}:</span>
                                  <span className="text-white font-medium">{value as string}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-zinc-500 text-sm">
                              <div className="w-2 h-2 rounded-full bg-zinc-600" />
                              No results found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </PageLayout>
  )
}