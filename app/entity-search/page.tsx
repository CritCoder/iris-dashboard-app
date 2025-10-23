'use client'

import { useState, useEffect } from 'react'
import { PageLayout } from '@/components/layout/page-layout'
import { Search, User, MapPin, CreditCard, Car, FileText, Phone, Loader2, CheckCircle2, XCircle, AlertCircle, Building2, Hash, Users2, MessageSquare, FileCheck, RefreshCw } from 'lucide-react'
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
import { SanitizedSearchInput } from '@/components/ui/sanitized-input'

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
  // IronVeil Entity Search Options
  {
    id: 'ironveil-username',
    label: 'Username Search',
    icon: User,
    description: 'Search for usernames in breach databases'
  },
  {
    id: 'ironveil-email',
    label: 'Email Search',
    icon: MessageSquare,
    description: 'Find email addresses in data breaches'
  },
  {
    id: 'ironveil-domain',
    label: 'Domain Search',
    icon: Building2,
    description: 'Search domain-related breaches'
  },
  {
    id: 'ironveil-phone',
    label: 'Phone Search',
    icon: Phone,
    description: 'Find phone numbers in breached data'
  },
  {
    id: 'ironveil-name',
    label: 'Name Search',
    icon: User,
    description: 'Search for names in breach databases'
  },
  {
    id: 'ironveil-hash',
    label: 'Password Hash Search',
    icon: Hash,
    description: 'Search for password hashes'
  },
  // TrueCaller
  {
    id: 'truecaller',
    label: 'TrueCaller Search',
    icon: Phone,
    description: 'Search mobile number on TrueCaller'
  },
  // Mobile Search Options
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
  // Vehicle Search Options
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
    id: 'puc-checking',
    label: 'PUC Checking Record',
    icon: FileCheck,
    description: 'Check Pollution Under Control certificate details'
  },
  // Social Entity Analytics
  {
    id: 'entity-analytics',
    label: 'Entity Analytics',
    icon: Hash,
    description: 'Get comprehensive entity analytics'
  },
  {
    id: 'entity-search',
    label: 'Entity Search',
    icon: Search,
    description: 'Search entities by name'
  }
]

function PUCCard({ pucData }: { pucData: any }) {
  if (!pucData) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileCheck className="w-12 h-12 text-muted-foreground" />
          </EmptyMedia>
          <EmptyTitle>No PUC Records Found</EmptyTitle>
          <EmptyDescription>
            No PUC certificates found for this vehicle number.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <FileCheck className="w-5 h-5 text-green-500" />
        <h3 className="font-semibold">PUC Certificate Details</h3>
        <Badge variant="default">Certificate Found</Badge>
      </div>
      
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-green-500" />
              <CardTitle className="text-sm">PUC Certificate: {pucData.puccNumber}</CardTitle>
            </div>
            <Badge variant="default">Valid</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Vehicle Number:</span>
              <p className="text-muted-foreground">{pucData.vehicleNumber}</p>
            </div>
            <div>
              <span className="font-medium">Customer Name:</span>
              <p className="text-muted-foreground">{pucData.customerName || 'N/A'}</p>
            </div>
            <div>
              <span className="font-medium">Make & Model:</span>
              <p className="text-muted-foreground">{pucData.make} {pucData.model}</p>
            </div>
            <div>
              <span className="font-medium">Fuel Type:</span>
              <p className="text-muted-foreground">{pucData.fuel}</p>
            </div>
            <div>
              <span className="font-medium">Test Date:</span>
              <p className="text-muted-foreground">{pucData.testDate}</p>
            </div>
            <div>
              <span className="font-medium">Valid Until:</span>
              <p className="text-muted-foreground">{pucData.validDate}</p>
            </div>
          </div>
          
          {pucData.testResults && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <h4 className="font-medium text-sm mb-2">Emission Test Results</h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-medium">CO (Carbon Monoxide):</span>
                  <p className="text-muted-foreground">
                    {pucData.testResults.petrol?.co?.measured || pucData.testResults.diesel?.co?.measured || 'N/A'} 
                    {pucData.testResults.petrol?.co?.presStd && ` (Limit: ${pucData.testResults.petrol.co.presStd})`}
                  </p>
                </div>
                <div>
                  <span className="font-medium">HC (Hydrocarbons):</span>
                  <p className="text-muted-foreground">
                    {pucData.testResults.petrol?.hc?.measured || pucData.testResults.diesel?.hc?.measured || 'N/A'}
                    {pucData.testResults.petrol?.hc?.presStd && ` (Limit: ${pucData.testResults.petrol.hc.presStd})`}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {pucData.imageUrl && (
            <div className="mt-3 p-3 bg-muted rounded-lg">
              <h4 className="font-medium text-sm mb-2">Certificate Image</h4>
              <a 
                href={pucData.imageUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm underline"
              >
                View Certificate Image
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function renderFormattedResult(result: SearchResult) {
  const data = result.data?.data || result.data
  
  // IronVeil search results
  if (result.type.startsWith('ironveil-') && data?.result) {
    const searchResult = data.result
    
    if (searchResult.success && searchResult.data) {
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-medium">Data Found</span>
          </div>
          
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">Search ID:</span>
                <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {data.searchId || 'N/A'}
                </span>
              </div>
              
              {searchResult.data && typeof searchResult.data === 'object' && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Found Data:</h4>
                  <div className="bg-white dark:bg-gray-900 border rounded p-3 text-xs">
                    {Object.entries(searchResult.data).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                        <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span className="text-gray-600 dark:text-gray-400">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {data.metadata && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <div>Searched: {data.metadata.query}</div>
                  <div>Source: {data.metadata.source}</div>
                  <div>Timestamp: {new Date(data.metadata.timestamp).toLocaleString()}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-orange-600">
            <AlertCircle className="w-4 h-4" />
            <span className="font-medium">Search Completed - No Data Found</span>
          </div>
          
          <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">Search ID:</span>
                <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {data.searchId || 'N/A'}
                </span>
              </div>
              
              {searchResult.error && (
                <div className="text-sm text-orange-700 dark:text-orange-300">
                  <strong>Error:</strong> {searchResult.error}
                </div>
              )}
              
              {data.metadata && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <div>Searched: {data.metadata.query}</div>
                  <div>Source: {data.metadata.source}</div>
                  <div>Timestamp: {new Date(data.metadata.timestamp).toLocaleString()}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    }
  }
  
  // TrueCaller results
  if (result.type === 'truecaller' && data) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle2 className="w-4 h-4" />
          <span className="font-medium">TrueCaller Data Found</span>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="space-y-2">
            {data.name && (
              <div className="flex justify-between">
                <span className="font-medium text-sm">Name:</span>
                <span className="text-sm">{data.name}</span>
              </div>
            )}
            {data.location && (
              <div className="flex justify-between">
                <span className="font-medium text-sm">Location:</span>
                <span className="text-sm">{data.location}</span>
              </div>
            )}
            {data.carrier && (
              <div className="flex justify-between">
                <span className="font-medium text-sm">Carrier:</span>
                <span className="text-sm">{data.carrier}</span>
              </div>
            )}
            {data.spamScore && (
              <div className="flex justify-between">
                <span className="font-medium text-sm">Spam Score:</span>
                <span className="text-sm">{data.spamScore}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
  
  // Mobile search results
  if (result.type.startsWith('mobile-') && data) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle2 className="w-4 h-4" />
          <span className="font-medium">Mobile Data Found</span>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <div className="space-y-2">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="font-medium text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                <span className="text-sm">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  // Vehicle search results
  if (result.type.startsWith('vehicle-') && data) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle2 className="w-4 h-4" />
          <span className="font-medium">Vehicle Data Found</span>
        </div>
        
        <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
          <div className="space-y-2">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="font-medium text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                <span className="text-sm">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  // Entity analytics results
  if (result.type === 'entity-analytics' && data) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle2 className="w-4 h-4" />
          <span className="font-medium">Entity Analytics Found</span>
        </div>
        
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
          <div className="space-y-2">
            {Array.isArray(data) ? (
              <div>
                <div className="font-medium text-sm mb-2">Found {data.length} entities:</div>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {data.slice(0, 5).map((entity: any, index: number) => (
                    <div key={index} className="flex justify-between text-xs bg-white dark:bg-gray-900 p-2 rounded">
                      <span className="font-medium">{entity.name}</span>
                      <span className="text-gray-500">{entity.type}</span>
                    </div>
                  ))}
                  {data.length > 5 && (
                    <div className="text-xs text-gray-500 text-center py-1">
                      ... and {data.length - 5} more entities
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {Object.entries(data).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="font-medium text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <span className="text-sm">{String(value)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
  
  // Entity search results
  if (result.type === 'entity-search' && data) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle2 className="w-4 h-4" />
          <span className="font-medium">Entity Search Results</span>
        </div>
        
        <div className="bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800 rounded-lg p-4">
          <div className="space-y-2">
            {Array.isArray(data) ? (
              <div>
                <div className="font-medium text-sm mb-2">Found {data.length} matching entities:</div>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {data.slice(0, 5).map((entity: any, index: number) => (
                    <div key={index} className="flex justify-between text-xs bg-white dark:bg-gray-900 p-2 rounded">
                      <span className="font-medium">{entity.name}</span>
                      <span className="text-gray-500">{entity.type}</span>
                    </div>
                  ))}
                  {data.length > 5 && (
                    <div className="text-xs text-gray-500 text-center py-1">
                      ... and {data.length - 5} more entities
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {Object.entries(data).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="font-medium text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <span className="text-sm">{String(value)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
  
  // Fallback for any other data format
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-green-600">
        <CheckCircle2 className="w-4 h-4" />
        <span className="font-medium">Data Found</span>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-900 border rounded-lg p-4">
        <div className="space-y-2">
          {typeof data === 'object' && data !== null ? (
            Object.entries(data).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="font-medium text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                <span className="text-sm">{String(value)}</span>
              </div>
            ))
          ) : (
            <div className="text-sm">{String(data)}</div>
          )}
        </div>
      </div>
    </div>
  )
}

function ResultCard({ result, onRetry, searchQuery }: { result: SearchResult; onRetry?: (optionId: string, query: string) => void; searchQuery?: string }) {
  const Icon = result.loading ? Loader2 : result.found ? CheckCircle2 : result.error ? AlertCircle : XCircle
  
  // Check if error is a "heavy load" message or retryable error
  const isHeavyLoadError = result.error?.includes('heavy load') || result.error?.includes('temporarily unavailable')
  const isRetryableError = isHeavyLoadError || result.error?.includes('connect') || result.error?.includes('timeout') || result.error?.includes('network')

  // Special handling for PUC results
  if (result.type === 'puc-checking' && result.found && result.data) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <CardTitle className="text-base">{result.title}</CardTitle>
            </div>
            <Badge variant="default">Found</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <PUCCard pucData={result.data.data || result.data} />
        </CardContent>
      </Card>
    )
  }

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
          <div className="space-y-3">
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
            {isRetryableError && onRetry && (
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onRetry(result.type, searchQuery || '')}
                  className="text-xs"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Retry
                </Button>
              </div>
            )}
          </div>
        ) : result.found && result.data ? (
          <div className="space-y-3">
            {renderFormattedResult(result)}
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
  const [vehicleType, setVehicleType] = useState<'P' | 'D'>('P')
  const [hasSearched, setHasSearched] = useState(false)

  // Filter options based on search type
  const filteredOptions = searchOptions.filter(opt => {
    if (searchType === 'general') {
      return opt.id.startsWith('ironveil-') || opt.id === 'entity-analytics' || opt.id === 'entity-search'
    } else if (searchType === 'mobile') {
      return opt.id.startsWith('mobile-') || opt.id === 'truecaller' || opt.id === 'ironveil-phone'
    } else {
      return opt.id.startsWith('vehicle-') || opt.id === 'puc-checking'
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

  const clearAllOptions = () => {
    setSelectedOptions([])
  }

  const handleRetry = async (optionId: string, originalQuery: string) => {
    // Find the original query from the search input
    const query = searchQuery || originalQuery
    if (!query) return

    // Remove the failed result
    setResults(prev => prev.filter(r => !(r.type === optionId && r.error)))
    
    // Retry the search
    try {
      const result = await makeApiCall(optionId, query, station, firNumber)
      setResults(prev => [result, ...prev])
    } catch (error) {
      console.error('Retry failed:', error)
    }
  }

  const checkPUCStatus = async (vehicleNumber: string, vehicleType: 'P' | 'D', retryCount = 0) => {
    const maxRetries = 3
    
    try {
      const fuelType = vehicleType === 'P' ? 'petrol' : 'diesel'
      const response = await fetch(`https://pucc.deno.dev/api/pucc?vehicleNumber=${vehicleNumber}&fuelType=${fuelType}`)
      
      if (!response.ok) {
        if (retryCount < maxRetries) {
          console.log(`Retrying PUC check (attempt ${retryCount + 1}/${maxRetries})...`)
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)))
          return checkPUCStatus(vehicleNumber, vehicleType, retryCount + 1)
        }
        throw new Error('Failed to fetch PUC data from Karnataka transport department')
      }
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'No PUC records found for this vehicle number')
      }
      
      return {
        success: true,
        data: result.data
      }
    } catch (error) {
      console.error('PUC check error:', error)
      
      if (retryCount < maxRetries && (error instanceof TypeError || (error as Error).message?.includes('fetch'))) {
        console.log(`Network error, retrying PUC check (attempt ${retryCount + 1}/${maxRetries})...`)
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)))
        return checkPUCStatus(vehicleNumber, vehicleType, retryCount + 1)
      }
      
      throw new Error((error as Error).message || 'Failed to retrieve PUC data from Karnataka transport department')
    }
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
        // IronVeil Entity Search APIs
        case 'ironveil-username':
          result = await api.osint.ironveilSearch({ 
            entityType: 'username', 
            query, 
            filters: {}, 
            org, 
            firNo 
          })
          break
        case 'ironveil-email':
          result = await api.osint.ironveilSearch({ 
            entityType: 'email', 
            query, 
            filters: {}, 
            org, 
            firNo 
          })
          break
        case 'ironveil-domain':
          result = await api.osint.ironveilSearch({ 
            entityType: 'domain', 
            query, 
            filters: {}, 
            org, 
            firNo 
          })
          break
        case 'ironveil-phone':
          if (!isMobileQuery) throw new Error('Invalid mobile number format')
          result = await api.osint.ironveilSearch({ 
            entityType: 'phone', 
            query, 
            filters: {}, 
            org, 
            firNo 
          })
          break
        case 'ironveil-name':
          result = await api.osint.ironveilSearch({ 
            entityType: 'name', 
            query, 
            filters: {}, 
            org, 
            firNo 
          })
          break
        case 'ironveil-hash':
          result = await api.osint.ironveilSearch({ 
            entityType: 'hash', 
            query, 
            filters: {}, 
            org, 
            firNo 
          })
          break
        // TrueCaller
        case 'truecaller':
          if (!isMobileQuery) throw new Error('Invalid mobile number format')
          result = await api.osint.truecallerSearch({ mobile_number: query, org, firNo })
          break
        // Mobile Search APIs
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
        // Vehicle Search APIs
        case 'vehicle-rc':
          if (!isVehicleQuery) throw new Error('Invalid vehicle number format')
          result = await api.osint.rcDetails({ rc_number: query, org, firNo })
          break
        case 'vehicle-to-mobile':
          if (!isVehicleQuery) throw new Error('Invalid vehicle number format')
          result = await api.osint.rcToMobile({ rc_number: query, org, firNo })
          break
        case 'puc-checking':
          if (!isVehicleQuery) throw new Error('Invalid vehicle number format')
          result = await checkPUCStatus(query, vehicleType)
          break
        // Social Entity Analytics
        case 'entity-analytics':
          result = await api.social.getEntityAnalytics({ 
            query,
            timeRange: '7d',
            limit: 20 
          })
          break
        case 'entity-search':
          result = await api.social.searchEntities({ 
            q: query,
            limit: 20 
          })
          break
        default:
          throw new Error('Service temporarily unavailable. Our systems are experiencing heavy load. Please try again in a few moments.')
      }

      return {
        type: optionId,
        title: option.label,
        found: result && (result.success || result.data),
        data: result,
        error: undefined
      }
    } catch (error: any) {
      // Provide specific error messages for different types of errors
      let errorMessage = 'Service temporarily unavailable. Our systems are experiencing heavy load. Please try again in a few moments.'
      
      if (error.message?.includes('Invalid')) {
        errorMessage = error.message
      } else if (optionId === 'puc-checking') {
        // PUC-specific error handling
        if (error.message?.includes('connect') || error.message?.includes('network')) {
          errorMessage = 'Unable to connect to the transport department. Please check your internet connection and try again.'
        } else if (error.message?.includes('timeout') || error.message?.includes('temporarily unavailable')) {
          errorMessage = 'The transport department website is temporarily unavailable. Please try again in a few minutes.'
        } else if (error.message?.includes('No PUC records found')) {
          errorMessage = 'No PUC records found for this vehicle number. Please verify the registration number.'
        } else if (error.message) {
          errorMessage = error.message
        }
      }
      
      return {
        type: optionId,
        title: option.label,
        found: false,
        data: null,
        error: errorMessage
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
    setHasSearched(true)
    
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
    setVehicleType('P')
    setHasSearched(false)
  }

  return (
    <PageLayout>
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        <div className="flex-1 overflow-y-auto flex items-center justify-center">
          <div className="max-w-4xl w-full mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6">
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
              <CardContent className="space-y-4 sm:space-y-6">
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
                  <SanitizedSearchInput
                    id="search-query"
                    placeholder={searchType === 'general' 
                      ? "Enter username, email, domain, name, or hash"
                      : searchType === 'mobile' 
                      ? "Enter 10-digit mobile number (e.g., 9876543210)" 
                      : "Enter vehicle number (e.g., KA01AB1234 or KA-01-AB-1234)"}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={isSearching}
                    onSanitizedChange={(sanitized, isValid, error) => {
                      if (isValid) {
                        setSearchQuery(sanitized)
                      }
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    {searchType === 'general'
                      ? 'Enter username, email, domain, name, or password hash for IronVeil search'
                      : searchType === 'mobile' 
                      ? 'Enter a valid 10-digit Indian mobile number' 
                      : 'Vehicle number format is flexible (7-13 characters)'}
                  </p>
                </div>

                {/* Vehicle Type Selection - Only show for vehicle search and when PUC checking is selected */}
                {searchType === 'vehicle' && selectedOptions.includes('puc-checking') && (
                  <div className="space-y-2">
                    <Label htmlFor="vehicle-type">Select Vehicle Type (Petrol/Diesel) *</Label>
                    <Select value={vehicleType} onValueChange={(value: 'P' | 'D') => setVehicleType(value)} disabled={isSearching}>
                      <SelectTrigger id="vehicle-type">
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="P">Petrol Vehicle</SelectItem>
                        <SelectItem value="D">Diesel Vehicle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

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

                <AnimatedGrid className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {results.map((result, index) => (
                    <AnimatedCard key={`${result.type}-${index}`}>
                      <ResultCard result={result} onRetry={handleRetry} searchQuery={searchQuery} />
                    </AnimatedCard>
                  ))}
                </AnimatedGrid>
              </AnimatedPage>
              )}

            {/* Empty State - Only show after a search has been attempted */}
            {results.length === 0 && !isSearching && hasSearched && (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Search className="w-12 h-12 text-muted-foreground" />
                  </EmptyMedia>
                  <EmptyTitle>No Search Results Found</EmptyTitle>
                  <EmptyDescription>
                    No results were found for your search criteria. Try adjusting your search parameters.
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
