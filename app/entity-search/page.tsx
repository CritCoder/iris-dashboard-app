'use client'

import { useState } from 'react'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Search, User, MapPin, CreditCard, Car, FileText, Phone, Loader2, CheckCircle2, XCircle, AlertCircle, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { api } from '@/lib/api'

interface SearchResult {
  type: string
  title: string
  data: any
  found: boolean
  error?: string
  loading?: boolean
}

interface SearchOption {
  id: string
  label: string
  icon: React.ElementType
  description: string
}

// Police stations in Bengaluru
const policeStations = [
  'Whitefield Division',
  'South East Division',
  'Central Division',
  'Northeast Division',
  'East Division',
  'North Division',
  'Koramangala',
  'HSR Layout',
  'Bellandur',
  'Marathahalli',
  'BTM Layout',
  'JP Nagar',
  'Jayanagar',
  'Indiranagar',
  'MG Road',
  'Cubbon Park',
  'Vidhana Soudha',
  'Yeshwanthpur',
  'Rajajinagar',
  'Malleshwaram'
]

// Available search options
const searchOptions: SearchOption[] = [
  {
    id: 'mobile-to-name',
    label: 'Mobile to Name',
    icon: User,
    description: 'Find name associated with mobile number'
  },
  {
    id: 'mobile-to-address',
    label: 'Mobile to Address',
    icon: MapPin,
    description: 'Find address linked to mobile number'
  },
  {
    id: 'mobile-to-account',
    label: 'Mobile to Account',
    icon: CreditCard,
    description: 'Find bank accounts linked to mobile'
  },
  {
    id: 'mobile-to-vehicle',
    label: 'Mobile to Vehicle',
    icon: Car,
    description: 'Find vehicles registered to mobile'
  },
  {
    id: 'mobile-to-pan',
    label: 'Mobile to PAN',
    icon: FileText,
    description: 'Find PAN card linked to mobile'
  },
  {
    id: 'truecaller',
    label: 'TrueCaller Search',
    icon: Phone,
    description: 'Search mobile number on TrueCaller'
  },
  {
    id: 'mobile-unified',
    label: 'Unified Mobile Search',
    icon: Search,
    description: 'Search all mobile-related data at once'
  },
  {
    id: 'vehicle-rc',
    label: 'Vehicle RC Details',
    icon: Car,
    description: 'Get vehicle registration details'
  },
  {
    id: 'vehicle-to-mobile',
    label: 'Vehicle to Mobile',
    icon: Phone,
    description: 'Find mobile linked to vehicle'
  },
  {
    id: 'vehicle-unified',
    label: 'Unified Vehicle Search',
    icon: Car,
    description: 'Search all vehicle-related data'
  }
]

function ResultCard({ result }: { result: SearchResult }) {
  const Icon = result.loading ? Loader2 : result.found ? CheckCircle2 : result.error ? AlertCircle : XCircle

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {result.loading ? (
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
            ) : result.found ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : result.error ? (
              <AlertCircle className="w-5 h-5 text-yellow-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            <CardTitle className="text-base">{result.title}</CardTitle>
          </div>
          <Badge variant={result.found ? 'default' : result.error ? 'secondary' : 'destructive'}>
            {result.loading ? 'Searching...' : result.found ? 'Found' : result.error ? 'Error' : 'Not Found'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {result.loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Searching...</p>
            </div>
          </div>
        ) : result.error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{result.error}</AlertDescription>
          </Alert>
        ) : result.found && result.data ? (
          <div className="space-y-2">
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
              {JSON.stringify(result.data, null, 2)}
            </pre>
                  </div>
                ) : (
          <div className="text-center py-8">
            <XCircle className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No data found</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function EntitySearchPage() {
  const [firNumber, setFirNumber] = useState('')
  const [station, setStation] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [formError, setFormError] = useState('')

  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev =>
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    )
  }

  const selectAllOptions = () => {
    setSelectedOptions(searchOptions.map(opt => opt.id))
  }

  const clearAllOptions = () => {
    setSelectedOptions([])
  }

  const makeApiCall = async (optionId: string, query: string, org: string, firNo: string): Promise<SearchResult> => {
    const option = searchOptions.find(opt => opt.id === optionId)
    if (!option) {
      return {
        type: optionId,
        title: optionId,
        found: false,
        data: null,
        error: 'Invalid search option'
      }
    }

    try {
      let result
      const isMobileQuery = /^\d{10}$/.test(query)
      const isVehicleQuery = /^[A-Z]{2}[\s-]?\d{2}[\s-]?[A-Z]{1,2}[\s-]?\d{4}$/i.test(query)

      switch (optionId) {
        case 'mobile-to-name':
          if (!isMobileQuery) throw new Error('Invalid mobile number format')
          result = await api.osint.mobileToName({ mobile_number: query, org, firNo })
          break
        case 'mobile-to-address':
          if (!isMobileQuery) throw new Error('Invalid mobile number format')
          result = await api.osint.mobileToAddress({ mobile_number: query, org, firNo })
          break
        case 'mobile-to-account':
          if (!isMobileQuery) throw new Error('Invalid mobile number format')
          result = await api.osint.mobileToAccount({ mobile_number: query, org, firNo })
          break
        case 'mobile-to-vehicle':
          if (!isMobileQuery) throw new Error('Invalid mobile number format')
          result = await api.osint.mobileToVehicle({ mobile_number: query, org, firNo })
          break
        case 'mobile-to-pan':
          if (!isMobileQuery) throw new Error('Invalid mobile number format')
          result = await api.osint.mobileToPAN({ mobile_number: query, org, firNo })
          break
        case 'truecaller':
          if (!isMobileQuery) throw new Error('Invalid mobile number format')
          result = await api.osint.truecallerSearch({ mobile_number: query, org, firNo })
          break
        case 'mobile-unified':
          if (!isMobileQuery) throw new Error('Invalid mobile number format')
          result = await api.osint.mobileUnified({ mobile_number: query, org, firNo })
          break
        case 'vehicle-rc':
          if (!isVehicleQuery) throw new Error('Invalid vehicle number format')
          result = await api.osint.rcDetails({ rc_number: query, org, firNo })
          break
        case 'vehicle-to-mobile':
          if (!isVehicleQuery) throw new Error('Invalid vehicle number format')
          result = await api.osint.rcToMobile({ rc_number: query, org, firNo })
          break
        case 'vehicle-unified':
          if (!isVehicleQuery) throw new Error('Invalid vehicle number format')
          result = await api.osint.vehicleUnified({ vehicle_number: query, org, firNo })
          break
        default:
          throw new Error('Unknown search type')
      }

      return {
        type: optionId,
        title: option.label,
        found: result && (result.success || result.status === 'success' || result.data),
        data: result,
        error: undefined
      }
    } catch (error: any) {
      return {
        type: optionId,
        title: option.label,
        found: false,
        data: null,
        error: error.message || 'Search failed'
      }
    }
  }

  const handleSearch = async () => {
    // Validation
    setFormError('')
    
    if (!firNumber.trim()) {
      setFormError('Please enter FIR number')
      return
    }
    
    if (!station) {
      setFormError('Please select a police station')
      return
    }
    
    if (!searchQuery.trim()) {
      setFormError('Please enter a search query (mobile number or vehicle number)')
      return
    }
    
    if (selectedOptions.length === 0) {
      setFormError('Please select at least one search option')
      return
    }

    setIsSearching(true)
    
    // Initialize results with loading state
    const initialResults: SearchResult[] = selectedOptions.map(optionId => {
      const option = searchOptions.find(opt => opt.id === optionId)!
      return {
        type: optionId,
        title: option.label,
        found: false,
        data: null,
        loading: true
      }
    })
    
    setResults(initialResults)

    // Make API calls
    try {
      const searchPromises = selectedOptions.map(optionId =>
        makeApiCall(optionId, searchQuery, station, firNumber)
      )

      const searchResults = await Promise.all(searchPromises)
      setResults(searchResults)
    } catch (error) {
      console.error('Search error:', error)
      setFormError('An error occurred during search. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleReset = () => {
    setFirNumber('')
    setStation('')
    setSearchQuery('')
    setSelectedOptions([])
    setResults([])
    setFormError('')
  }

  return (
    <PageLayout>
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        <PageHeader 
          title="Unified Search" 
          description="Comprehensive intelligence search across multiple databases"
        />

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Search Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search Parameters
                </CardTitle>
                <CardDescription>
                  Enter FIR details and select search options to begin investigation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* FIR Number and Station */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fir-number">FIR Number *</Label>
                    <Input
                      id="fir-number"
                      placeholder="Enter FIR number (e.g., FIR/2025/001)"
                      value={firNumber}
                      onChange={(e) => setFirNumber(e.target.value)}
                      disabled={isSearching}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="station">Police Station *</Label>
                    <Select value={station} onValueChange={setStation} disabled={isSearching}>
                      <SelectTrigger id="station">
                        <SelectValue placeholder="Select police station" />
                      </SelectTrigger>
                      <SelectContent>
                        {policeStations.map((stationName) => (
                          <SelectItem key={stationName} value={stationName}>
                            {stationName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Search Query */}
                <div className="space-y-2">
                  <Label htmlFor="search-query">Search Query *</Label>
                <Input
                    id="search-query"
                    placeholder="Enter mobile number (10 digits) or vehicle number (e.g., KA-01-AB-1234)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={isSearching}
                  />
                  <p className="text-xs text-muted-foreground">
                    Supported formats: Mobile (9876543210), Vehicle (KA-01-AB-1234)
                  </p>
                </div>

                {/* Search Options */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Search Options * (Select at least one)</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={selectAllOptions}
                        disabled={isSearching}
                      >
                        Select All
                      </Button>
                <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={clearAllOptions}
                        disabled={isSearching}
                      >
                        Clear All
                </Button>
              </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {searchOptions.map((option) => {
                      const Icon = option.icon
                      const isSelected = selectedOptions.includes(option.id)
                      
                      return (
                        <div
                          key={option.id}
                          className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-muted-foreground/50'
                          } ${isSearching ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={() => !isSearching && toggleOption(option.id)}
                        >
                          <Checkbox
                            id={option.id}
                            checked={isSelected}
                            onCheckedChange={() => !isSearching && toggleOption(option.id)}
                            disabled={isSearching}
                            className="mt-1"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                              <label
                                htmlFor={option.id}
                                className="text-sm font-medium leading-none cursor-pointer"
                              >
                                {option.label}
                              </label>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {option.description}
                            </p>
                            </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Error Message */}
                {formError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="flex-1 gap-2"
                    size="lg"
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        Start Search
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleReset}
                    disabled={isSearching}
                    variant="outline"
                    size="lg"
                  >
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            {results.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Search Results</h2>
                  <Badge variant="secondary">
                    {results.filter(r => r.found).length} / {results.length} Found
                  </Badge>
                    </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {results.map((result, index) => (
                    <ResultCard key={`${result.type}-${index}`} result={result} />
                  ))}
                </div>
                </div>
              )}

            {/* Empty State */}
            {results.length === 0 && !isSearching && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Search className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Search Results Yet</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-md">
                    Fill in the search parameters above and click "Start Search" to begin your investigation
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
