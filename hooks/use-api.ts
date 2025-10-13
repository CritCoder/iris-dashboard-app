// React hooks for API integration
import { useState, useEffect, useCallback } from 'react'
import { api, ApiResponse, PaginatedResponse } from '@/lib/api'

// Generic hook for API calls
export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiCall()
      setData(response.data)
    } catch (err) {
      console.warn('API call failed:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      // Set fallback data to prevent UI crashes
      setData(null)
    } finally {
      setLoading(false)
    }
  }, dependencies)

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
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
        setUser(response.data.user)
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
        setUser(response.data.user)
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
    (page, limit) => api.campaign.getAll({ ...params, page, limit }),
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
  return usePaginatedApi(
    (page, limit) => api.social.getPosts({ ...params, page, limit }),
    params?.page,
    params?.limit
  )
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
  return usePaginatedApi(
    (page, limit) => api.profile.getAll({ ...params, page, limit }),
    params?.page,
    params?.limit
  )
}

export function useProfile(id: string) {
  return useApi(() => api.profile.getById(id), [id])
}

// Entity hooks
export function useEntities(params?: any) {
  return useApi(() => api.entity.search(params), [params])
}

export function useEntityAnalytics(params?: any) {
  return useApi(() => api.entity.getAnalytics(params), [params])
}

export function useTopEntities(type: string, params?: any) {
  return useApi(() => api.entity.getTop(type, params), [type, params])
}

// Location hooks
export function useLocationAnalytics(params?: any) {
  return useApi(() => api.location.getAnalytics(params), [params])
}

export function useTopLocations(params?: any) {
  return useApi(() => api.location.getTop(params), [params])
}

// Political Dashboard hooks
export function usePoliticalStats(params?: any) {
  return useApi(() => api.political.getQuickStats(params), [params])
}

export function useCampaignThemes(params?: any) {
  return useApi(() => api.political.getCampaignThemes(params), [params])
}

export function useInfluencerTracker(params?: any) {
  return useApi(() => api.political.getInfluencerTracker(params), [params])
}

export function useOpponentNarratives(params?: any) {
  return useApi(() => api.political.getOpponentNarratives(params), [params])
}

export function useSupportBaseEnergy(params?: any) {
  return useApi(() => api.political.getSupportBaseEnergy(params), [params])
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
        return api.osint.mobileToName({ mobile: query })
      case 'address':
        return api.osint.mobileToAddress({ mobile: query })
      case 'account':
        return api.osint.mobileToAccount({ mobile: query })
      case 'vehicle':
        return api.osint.mobileToVehicle({ mobile: query })
      case 'pan':
        return api.osint.mobileToPan({ mobile: query })
      case 'truecaller':
        return api.osint.truecallerSearch({ mobile: query })
      default:
        return Promise.resolve(null)
    }
  }
  
  return useApi(searchFunction, [type, query])
}

// Profile hooks
export function useProfileDetails(id: string) {
  return useApi(() => api.profile.getById(id), [id])
}

export function useProfilePosts(id: string, params?: any) {
  return usePaginatedApi(
    (page, limit) => api.profile.getPosts(id, { ...params, page, limit }),
    [id, params]
  )
}

// Person hooks
export function usePersons(params?: any) {
  return usePaginatedApi(
    (page, limit) => api.person.getAll({ ...params, page, limit }),
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
    (page, limit) => api.user.getAll({ ...params, page, limit }),
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
    (page, limit) => api.credit.getAll({ ...params, page, limit }),
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
    (page, limit) => api.account.getAll({ ...params, page, limit }),
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
    (page, limit) => api.incident.getAll({ ...params, page, limit }),
    params?.page,
    params?.limit
  )
}

export function useIncident(id: string) {
  return useApi(() => api.incident.getById(id), [id])
}

export function useCommunities(params?: any) {
  return usePaginatedApi(() => api.communities.getCommunities(params), [params])
}

export function useGroups(params?: any) {
  return usePaginatedApi(() => api.groups.getGroups(params), [params])
}
