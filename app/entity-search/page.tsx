'use client'

import { useState, useEffect } from 'react'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Search, User, MapPin, CreditCard, Car, FileText, Phone, Loader2, CheckCircle2, XCircle, AlertCircle, Building2, Hash, Users2, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Combobox } from '@/components/ui/combobox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { api } from '@/lib/api'
import { AnimatedPage, AnimatedGrid, AnimatedCard, FadeIn } from '@/components/ui/animated'

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
    id: 'topic-analysis',
    label: 'Topic Analysis',
    icon: Hash,
    description: 'Search for topics, keywords, hashtags'
  },
  {
    id: 'person-of-interest',
    label: 'Person of Interest (POI)',
    icon: Users2,
    description: 'Search for specific individuals, profiles'
  },
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
  
  // Check if error is a "heavy load" message
  const isHeavyLoadError = result.error?.includes('heavy load') || result.error?.includes('temporarily unavailable')

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
              <AlertCircle className="w-5 h-5 text-orange-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            <CardTitle className="text-base">{result.title}</CardTitle>
          </div>
          <Badge variant={result.found ? 'default' : result.error ? 'secondary' : 'destructive'}>
            {result.loading ? 'Searching...' : result.found ? 'Found' : result.error ? 'Unavailable' : 'Not Found'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {result.loading ? (
          <div className="flex items-center justify-start py-8">
            <div className="text-left">
              <Loader2 className="w-8 h-8 animate-spin mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Searching...</p>
            </div>
          </div>
        ) : result.error ? (
          <Alert variant={isHeavyLoadError ? 'default' : 'destructive'} className={isHeavyLoadError ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900' : ''}>
            <AlertCircle className={`h-4 w-4 ${isHeavyLoadError ? 'text-orange-600 dark:text-orange-400' : ''}`} />
            <AlertDescription className={isHeavyLoadError ? 'text-orange-800 dark:text-orange-300' : ''}>
              {isHeavyLoadError ? (
                <div>
                  <p className="font-semibold mb-1">🔄 System Under Heavy Load</p>
                  <p className="text-sm">{result.error}</p>
                </div>
              ) : (
                result.error
              )}
            </AlertDescription>
          </Alert>
        ) : result.found && result.data ? (
          <div className="space-y-2">
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
              {JSON.stringify(result.data, null, 2)}
            </pre>
                  </div>
                ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <XCircle className="w-12 h-12 text-muted-foreground" />
              </EmptyMedia>
              <EmptyTitle>No Data Found</EmptyTitle>
              <EmptyDescription>
                No results found for this search query. Try adjusting your search parameters.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
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
  const [searchType, setSearchType] = useState<'general' | 'mobile' | 'vehicle'>('general')

  // Filter options based on search type
  const filteredOptions = searchOptions.filter(opt => {
    if (searchType === 'general') {
      return opt.id === 'topic-analysis' || opt.id === 'person-of-interest'
    } else if (searchType === 'mobile') {
      return opt.id.startsWith('mobile-') || opt.id === 'truecaller'
    } else {
      return opt.id.startsWith('vehicle-')
    }
  })

  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev =>
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    )
  }

  const selectAllOptions = () => {
    setSelectedOptions(filteredOptions.map(opt => opt.id))
  }

  // Auto-select cheapest option (first option) when search type changes
  useEffect(() => {
    if (filteredOptions.length > 0) {
      setSelectedOptions([filteredOptions[0].id])
    }
  }, [searchType])

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
        error: 'Service temporarily unavailable. Our systems are experiencing heavy load. Please try again in a few moments.'
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
          throw new Error('Service temporarily unavailable. Our systems are experiencing heavy load. Please try again in a few moments.')
      }

      return {
        type: optionId,
        title: option.label,
        found: result && (result.success || result.status === 'success' || result.data),
        data: result,
        error: undefined
      }
    } catch (error: any) {
      // Show friendly "heavy load" message instead of technical errors
      const isValidationError = error.message?.includes('Invalid') || error.message?.includes('format')
      return {
        type: optionId,
        title: option.label,
        found: false,
        data: null,
        error: isValidationError 
          ? error.message 
          : 'Service temporarily unavailable. Our systems are experiencing heavy load. Please try again in a few moments.'
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

                {/* Search Type Tabs */}
                <div className="space-y-2">
                  <Label>Search Type *</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Button
                      type="button"
                      variant={searchType === 'general' ? 'default' : 'outline'}
                      onClick={() => setSearchType('general')}
                      disabled={isSearching}
                      className="flex-1"
                    >
                      <Hash className="w-4 h-4 mr-2" />
                      General
                    </Button>
                    <Button
                      type="button"
                      variant={searchType === 'mobile' ? 'default' : 'outline'}
                      onClick={() => setSearchType('mobile')}
                      disabled={isSearching}
                      className="flex-1"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Mobile Search
                    </Button>
                    <Button
                      type="button"
                      variant={searchType === 'vehicle' ? 'default' : 'outline'}
                      onClick={() => setSearchType('vehicle')}
                      disabled={isSearching}
                      className="flex-1"
                    >
                      <Car className="w-4 h-4 mr-2" />
                      Vehicle Search
                    </Button>
                  </div>
                </div>

                {/* Search Query */}
                <div className="space-y-2">
                  <Label htmlFor="search-query">
                    {searchType === 'general' ? 'Search Query *' : searchType === 'mobile' ? 'Mobile Number *' : 'Vehicle Number *'}
                  </Label>
                  <Input
                    id="search-query"
                    placeholder={searchType === 'general' 
                      ? "Enter topic, keyword, hashtag, or person name"
                      : searchType === 'mobile' 
                      ? "Enter 10-digit mobile number (e.g., 9876543210)" 
                      : "Enter vehicle number (e.g., KA01AB1234 or KA-01-AB-1234)"}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={isSearching}
                  />
                  <p className="text-xs text-muted-foreground">
                    {searchType === 'mobile' 
                      ? 'Enter a valid 10-digit Indian mobile number' 
                      : 'Vehicle number format is flexible (7-13 characters)'}
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
                    {filteredOptions.map((option) => {
                      const Icon = option.icon
                      const isSelected = selectedOptions.includes(option.id)
                      
                      // Simplify label by removing redundant "Mobile to" or "Vehicle"
                      const simplifiedLabel = option.label
                        .replace('Mobile to ', '')
                        .replace('Vehicle ', '')
                        .replace('Unified Mobile Search', 'All Data')
                        .replace('Unified Vehicle Search', 'All Data')
                      
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
                                {simplifiedLabel}
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
              <AnimatedPage className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Search Results</h2>
                  <Badge variant="secondary">
                    {results.filter(r => r.found).length} / {results.length} Found
                  </Badge>
                    </div>

                <AnimatedGrid stagger={0.05} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {results.map((result, index) => (
                    <AnimatedCard key={`${result.type}-${index}`}>
                      <ResultCard result={result} />
                    </AnimatedCard>
                  ))}
                </AnimatedGrid>
              </AnimatedPage>
              )}

            {/* Empty State */}
            {results.length === 0 && !isSearching && (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Search className="w-12 h-12 text-muted-foreground" />
                  </EmptyMedia>
                  <EmptyTitle>No Search Results Yet</EmptyTitle>
                  <EmptyDescription>
                    Fill in the search parameters above and click "Start Search" to begin your investigation.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
