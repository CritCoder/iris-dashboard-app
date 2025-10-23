// React hooks for API integration
import { useState, useEffect, useCallback } from 'react'
import { api, ApiResponse, PaginatedResponse } from '@/lib/api'
import apiService from '@/lib/apiService'

// Generic hook for API calls
export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiCall()
        if (!cancelled) {
          setData(response.data as T)
        }
      } catch (err) {
        if (!cancelled) {
          console.warn('API call failed:', err)
          setError(err instanceof Error ? err.message : 'An error occurred')
          setData(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      cancelled = true
    }
  }, [...dependencies])

  const refetch = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiCall()
      setData(response.data as T)
    } catch (err) {
      console.warn('API call failed:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [...dependencies])

  return { data, loading, error, refetch }
}

// Hook for paginated API calls
export function usePaginatedApi<T>(
  apiCall: (page: number, limit: number) => Promise<PaginatedResponse<T>>,
  initialPage: number = 1,
  initialLimit: number = 10
) {
  const [data, setData] = useState<T[]>([])
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async (page: number = pagination.page, limit: number = pagination.limit) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiCall(page, limit)
      setData(response.data)
      setPagination(response.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [apiCall, pagination?.page, pagination?.limit])

  const goToPage = useCallback((page: number) => {
    fetchData(page, pagination?.limit || initialLimit)
  }, [fetchData, pagination?.limit, initialLimit])

  const changeLimit = useCallback((limit: number) => {
    fetchData(1, limit)
  }, [fetchData])

  useEffect(() => {
    fetchData()
  }, [])

  return {
    data,
    pagination,
    loading,
    error,
    refetch: fetchData,
    goToPage,
    changeLimit,
  }
}

// Authentication hooks
export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.auth.login(credentials)
      if (response.success) {
        // Store token and user data
        setUser((response.data as any)?.user || response.data)
        return response
      }
      throw new Error(response.message || 'Login failed')
    } catch (error) {
      throw error
    }
  }

  const otpLogin = async (data: { phoneNumber: string; otp: string }) => {
    try {
      const response = await api.auth.otpLogin(data)
      if (response.success) {
        setUser((response.data as any)?.user || response.data)
        return response
      }
      throw new Error(response.message || 'OTP login failed')
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await api.auth.logout()
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const getProfile = async () => {
    try {
      const response = await api.auth.getProfile()
      if (response.success) {
        setUser(response.data)
        return response.data
      }
      throw new Error(response.message || 'Failed to get profile')
    } catch (error) {
      setUser(null)
      throw error
    }
  }

  useEffect(() => {
    // Check if user is already logged in
    getProfile().catch(() => {
      setLoading(false)
    })
  }, [])

  return {
    user,
    loading,
    login,
    otpLogin,
    logout,
    getProfile,
    isAuthenticated: !!user,
  }
}

// Campaign hooks
export function useCampaigns(params?: {
  page?: number
  limit?: number
  monitored?: boolean
}) {
  return usePaginatedApi(
    (page, limit) => api.campaign.getAll({ ...params, page, limit }) as any,
    params?.page,
    params?.limit
  )
}

export function useCampaign(id: string) {
  return useApi(() => api.campaign.getById(id), [id])
}

export function useCampaignStats() {
  return useApi(() => api.campaign.getStats())
}

export function useCampaignData(id: string, params?: any) {
  return useApi(() => api.campaign.getData(id, params), [id, params])
}

// Social Media hooks
export function useSocialPosts(params?: any) {
  const { enabled = true, ...apiParams } = params || {}
  const [data, setData] = useState<any[]>([])
  const [pagination, setPagination] = useState({
    page: apiParams?.page || 1,
    limit: apiParams?.limit || 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!enabled) {
      setData([])
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setError(null)
      console.log('🚀 Fetching social posts with params:', apiParams)
      const response = await api.social.getPosts(apiParams)
      console.log('📊 Social posts API response:', response)
      if (response.success && response.data) {
        const responseData = response.data as any
        if (Array.isArray(responseData.data) && responseData.pagination) {
          // Paginated response
          setData(responseData.data)
          setPagination(responseData.pagination)
        } else if (Array.isArray(responseData)) {
          // Flat array response
          setData(responseData)
        } else {
          setData([])
        }
      } else {
        setError(response.message || 'Failed to fetch posts')
        setData([])
      }
    } catch (err) {
      console.warn('Failed to fetch social posts:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setData([])
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(apiParams), enabled]) // Use JSON.stringify to properly detect params changes

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, pagination, loading, error, refetch: fetchData }
}

export function useSocialStats() {
  return useApi(() => api.social.getStats())
}

export function useInboxStats(params?: any) {
  return useApi(() => api.social.getInboxStats(params), [params])
}

export function usePost(id: string) {
  return useApi(() => api.social.getPostById(id), [id])
}

// Profile hooks
export function useProfiles(params?: any) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: params?.page || 1,
    limit: params?.limit || 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  })

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('🚀 Fetching profiles with params:', params)
      
      const response = await api.profile.getAll(params)
      
      console.log('✅ Profiles API Response:', response)
      
      if (response.success && response.data) {
        const profileData = Array.isArray(response.data) 
          ? response.data 
          : (response.data as any)?.data || []
        setData(profileData)
        
        if ((response as any).pagination) {
          setPagination((response as any).pagination)
        }
      } else {
        setError(response.message || 'Failed to fetch profiles')
        setData([])
      }
    } catch (err) {
      console.error('❌ Failed to fetch profiles:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setData([])
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(params)]) // Use JSON.stringify to properly detect params changes

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, pagination, loading, error, refetch: fetchData }
}

export function useProfile(id: string) {
  return useApi(() => api.profile.getById(id), [id])
}

// Entity hooks
export function useEntities(params?: any) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Use search API if query is provided, otherwise use analytics
      const response = params?.q 
        ? await api.entity.search(params)
        : await api.entity.getAnalytics(params)
      
      if (response.success && response.data) {
        setData(Array.isArray(response.data) ? response.data : [])
      } else {
        setError(response.message || 'Failed to fetch entities')
        setData([])
      }
    } catch (err) {
      console.warn('Failed to fetch entities:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setData([])
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(params)])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

export function useEntityAnalytics(params?: any) {
  return useApi(() => api.entity.getAnalytics(params), [JSON.stringify(params)])
}

export function useTopEntities(type: string, params?: any) {
  return useApi(() => api.entity.getTop(type, params), [type, JSON.stringify(params)])
}

export function useEntityDetails(id: string, params?: any) {
  return useApi(() => api.entity.getDetails(id, params), [id, JSON.stringify(params)])
}

// Location hooks
export function useLocationAnalytics(params?: any) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Use search API if query is provided, otherwise use analytics
      const response = params?.q 
        ? await api.location.search(params)
        : await api.location.getAnalytics(params)
      
      if (response.success && response.data) {
        setData(Array.isArray(response.data) ? response.data : [])
      } else {
        setError(response.message || 'Failed to fetch locations')
        setData([])
      }
    } catch (err) {
      console.warn('Failed to fetch locations:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setData([])
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(params)])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

export function useLocationDetails(id: string, params?: any) {
  return useApi(() => api.location.getById(id, params), [id, JSON.stringify(params)])
}

export function useMultipleLocationDetails(params?: any) {
  return useApi(() => api.location.getByMultipleNames(params), [JSON.stringify(params)])
}

// Political Dashboard hooks
export function usePoliticalStats(params?: any) {
  return useApi(() => api.political.getQuickStats(params), [JSON.stringify(params)])
}

export function useCampaignThemes(params?: any) {
  return useApi(() => api.political.getCampaignThemes(params), [JSON.stringify(params)])
}

export function useInfluencerTracker(params?: any) {
  return useApi(() => api.political.getInfluencerTracker(params), [JSON.stringify(params)])
}

export function useOpponentNarratives(params?: any) {
  return useApi(() => api.political.getOpponentNarratives(params), [JSON.stringify(params)])
}

export function useSupportBaseEnergy(params?: any) {
  return useApi(() => api.political.getSupportBaseEnergy(params), [JSON.stringify(params)])
}

// OSINT hooks
export function useOSINTDashboard() {
  return useApi(() => api.osint.getDashboard())
}

export function useOSINTHistory(params?: any) {
  return useApi(() => api.osint.getHistory(params), [params])
}

export function useOSINTExternal(params: { type: string; query: string }) {
  const { type, query } = params
  
  const searchFunction = () => {
    switch (type) {
      case 'name':
        return api.osint.mobileToName({ mobile_number: query, org: '', firNo: '' })
      case 'address':
        return api.osint.mobileToAddress({ mobile_number: query, org: '', firNo: '' })
      case 'account':
        return api.osint.mobileToAccount({ mobile_number: query, org: '', firNo: '' })
      case 'vehicle':
        return api.osint.mobileToVehicle({ mobile_number: query, org: '', firNo: '' })
      case 'pan':
        return api.osint.mobileToPAN({ mobile_number: query, org: '', firNo: '' })
      case 'truecaller':
        return api.osint.truecallerSearch({ mobile_number: query, org: '', firNo: '' })
      default:
        return Promise.resolve({ success: true, data: null } as any)
    }
  }
  
  return useApi(searchFunction, [type, query])
}

// Profile hooks
export function useProfileDetails(id: string) {
  return useApi(() => api.profile.getById(id), [id])
}

export function useProfilePosts(id: string, params?: any) {
  const [data, setData] = useState<any[]>([])
  const [pagination, setPagination] = useState({
    page: params?.page || 1,
    limit: params?.limit || 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true)
      setError(null)
      const response = await api.profile.getPosts(id, params)
      if (response.success && response.data) {
        const responseData = response.data as any
        
        if (responseData.posts && Array.isArray(responseData.posts)) {
          setData(responseData.posts)
          if (responseData.pagination) {
            setPagination(responseData.pagination)
          }
        } else if (Array.isArray(responseData)) {
          setData(responseData)
        } else {
          setData([])
        }
      } else {
        setError(response.message || 'Failed to fetch profile posts')
        setData([])
      }
    } catch (err) {
      console.warn('Failed to fetch profile posts:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setData([])
    } finally {
      setLoading(false)
    }
  }, [id, JSON.stringify(params)])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, pagination, loading, error, refetch: fetchData }
}

// Person hooks
export function usePersons(params?: any) {
  return usePaginatedApi(
    (page, limit) => api.person.getAll({ ...params, page, limit }) as any,
    params?.page,
    params?.limit
  )
}

export function usePerson(id: string) {
  return useApi(() => api.person.getById(id), [id])
}

// User hooks
export function useUsers(params?: any) {
  return usePaginatedApi(
    (page, limit) => api.user.getAll({ ...params, page, limit }) as any,
    params?.page,
    params?.limit
  )
}

export function useUser(id: string) {
  return useApi(() => api.user.getById(id), [id])
}

// Credit hooks
export function useCredits(params?: any) {
  return usePaginatedApi(
    (page, limit) => api.credit.getAll({ ...params, page, limit }) as any,
    params?.page,
    params?.limit
  )
}

export function useUserCredits(userId: string) {
  return useApi(() => api.credit.getUserCredits(userId), [userId])
}

// Tool hooks
export function useTools() {
  return useApi(() => api.tool.getAll())
}

export function useTool(id: string) {
  return useApi(() => api.tool.getById(id), [id])
}

// Account hooks
export function useAccounts(params?: any) {
  return usePaginatedApi(
    (page, limit) => api.account.getAll({ ...params, page, limit }) as any,
    params?.page,
    params?.limit
  )
}

export function useAccount(id: string) {
  return useApi(() => api.account.getById(id), [id])
}

// Incident hooks
export function useIncidents(params?: any) {
  return usePaginatedApi(
    (page, limit) => api.incident.getAll({ ...params, page, limit }) as any,
    params?.page,
    params?.limit
  )
}

export function useIncident(id: string) {
  return useApi(() => api.incident.getById(id), [id])
}

export function useCommunities(params?: any) {
  // Communities API doesn't exist, return empty data
  return { data: [], loading: false, error: null }
}

export function useGroups(params?: any) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: params?.page || 1,
    limit: params?.limit || 50,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  })

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.set('page', params.page.toString())
      if (params?.limit) queryParams.set('limit', params.limit.toString())
      if (params?.search) queryParams.set('search', params.search)
      if (params?.type) queryParams.set('type', params.type)
      if (params?.riskLevel) queryParams.set('riskLevel', params.riskLevel)
      if (params?.monitoringEnabled !== undefined) queryParams.set('monitoringEnabled', params.monitoringEnabled.toString())
      if (params?.platform) queryParams.set('platform', params.platform)
      if (params?.sheet) queryParams.set('sheet', params.sheet)

      const response = await fetch(`/api/groups?${queryParams.toString()}`)
      const result = await response.json()

      if (result.success && result.data) {
        setData(result.data)
        if (result.pagination) {
          setPagination(result.pagination)
        }
      } else {
        setError(result.message || 'Failed to fetch groups')
        setData([])
      }
    } catch (err) {
      console.error('Failed to fetch groups:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setData([])
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(params)])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, pagination, loading, error, refetch: fetchData }
}
