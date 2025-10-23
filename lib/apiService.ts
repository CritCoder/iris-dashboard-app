/**
 * Unified API Service - Compatible with both osint-fe and new-fe
 * This service provides a single interface for all API calls
 */

import { AuthManager } from './api'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://irisnet.wiredleap.com'
const API_BASE_URL = `${BASE_URL}/api`

class ApiService {
  private baseURL: string

  constructor() {
    this.baseURL = API_BASE_URL
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    // Handle FormData
    if (options.body instanceof FormData) {
      const headers = config.headers as Record<string, string>
      delete headers['Content-Type']
    } else if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
      config.body = JSON.stringify(config.body)
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          message: response.status === 401 ? 'Authentication failed' : 'Network error' 
        }))
        
        if (response.status === 401) {
          AuthManager.clearToken()
          throw new Error(errorData.message || 'Authentication failed')
        }
        
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return response.json()
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network connection failed. Please check your internet connection.')
      }
      throw error
    }
  }

  // Campaign APIs
  async getCampaignStats() {
    return this.request('/campaigns/stats')
  }

  async getAllCampaigns(page = 1, limit = 10, filters: any = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    if (filters.monitored === 'true' || filters.monitored === 'false') {
      params.append('monitored', filters.monitored)
    }
    return this.request(`/campaigns?${params.toString()}`)
  }

  async searchCampaigns(searchTerm: string, page = 1, limit = 10, filters: any = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      q: searchTerm.trim()
    })
    if (filters.monitored === 'true' || filters.monitored === 'false') {
      params.append('monitored', filters.monitored)
    }
    return this.request(`/campaigns/search?${params.toString()}`)
  }

  async getSearchSuggestions(searchTerm: string) {
    if (!searchTerm || !searchTerm.trim()) {
      return { suggestions: [] }
    }
    
    const params = new URLSearchParams({
      q: searchTerm.trim()
    })
    
    return this.request(`/campaigns/search/suggestions?${params.toString()}`)
  }

  async getCampaignById(id: string) {
    return this.request(`/campaigns/${id}`)
  }

  async getCampaignData(id: string, page = 1, limit = 10, platforms: string[] = [], cursor: string | null = null, sentimentParams: any = {}) {
    const params = new URLSearchParams()
    
    if (platforms && platforms.length > 0) {
      params.set('platforms', platforms.join(','))
    }
    
    if (limit) {
      params.set('limit', limit.toString())
    }
    
    if (cursor) {
      params.set('cursor', cursor)
    }
    
    // Add sentiment parameters
    if (sentimentParams.positive) {
      params.set('positive', sentimentParams.positive)
    }
    if (sentimentParams.negative) {
      params.set('negative', sentimentParams.negative)
    }
    if (sentimentParams.neutral) {
      params.set('neutral', sentimentParams.neutral)
    }
    
    const queryString = params.toString()
    const url = queryString ? `/campaigns/${id}/data?${queryString}` : `/campaigns/${id}/data`
    
    return this.request(url, {
      method: 'GET'
    })
  }

  async createCampaign(campaignData: any) {
    return this.request('/campaigns', {
      method: 'POST',
      body: campaignData,
    })
  }

  async campaignSearch(searchData: any) {
    return this.request('/campaigns/campaign-search', {
      method: 'POST',
      body: searchData,
    })
  }

  async diagnoseCampaign(id: string, analysisData: any = {}) {
    return this.request(`/campaigns/${id}/diagnose`, {
      method: 'POST',
      body: analysisData,
    })
  }

  async getCampaignAnalysis(campaignId: string, page = 1, limit = 10) {
    return this.request(`/campaigns/${campaignId}/analysis?page=${page}&limit=${limit}`)
  }

  async getCampaignAnalysisById(campaignId: string, analysisId: string) {
    return this.request(`/campaigns/${campaignId}/analysis/${analysisId}`)
  }

  async startCampaignMonitoring(id: string, monitoringData: any = {}) {
    return this.request(`/campaigns/${id}/monitor`, {
      method: 'POST',
      body: monitoringData,
    })
  }

  async stopCampaignMonitoring(id: string) {
    return this.request(`/campaigns/${id}/stop-monitoring`, {
      method: 'POST',
    })
  }

  async checkPostCampaign(postId?: string, platformPostId?: string, platform?: string) {
    const params = new URLSearchParams()
    if (postId) params.set('postId', postId)
    if (platformPostId) params.set('platformPostId', platformPostId)
    if (platform) params.set('platform', platform)
    
    return this.request(`/campaigns/check-post?${params.toString()}`)
  }

  async getOriginalPostForCampaign(campaignId: string) {
    return this.request(`/campaigns/${campaignId}/original-post`)
  }

  // Social Media APIs
  async getSocialStats() {
    return this.request('/social/stats')
  }

  async getAllProfiles(page = 1, limit = 50, filters: any = {}, cursor: string | null = null) {
    const params = new URLSearchParams({
      limit: limit.toString(),
    })

    if (cursor) {
      params.append('cursor', cursor)
    }

    // Filters
    if (filters.minFollowers !== undefined) params.append('minFollowers', filters.minFollowers)
    if (filters.maxFollowers !== undefined) params.append('maxFollowers', filters.maxFollowers)
    if (filters.minPosts !== undefined) params.append('minPosts', filters.minPosts)
    if (filters.maxPosts !== undefined) params.append('maxPosts', filters.maxPosts)
    if (filters.isVerified !== undefined) params.append('isVerified', filters.isVerified)
    if (filters.isBlueVerified !== undefined) params.append('isBlueVerified', filters.isBlueVerified)
    if (filters.platform) params.append('platform', filters.platform)
    if (filters.location) params.append('location', filters.location)
    if (filters.personStatus) params.append('personStatus', filters.personStatus)
    if (filters.search) params.append('search', filters.search)

    return this.request(`/social/profiles?${params.toString()}`)
  }

  async getProfileById(id: string) {
    return this.request(`/social/profiles/${id}`)
  }

  async getProfileDetails(id: string, page = 1, limit = 20) {
    return this.request(`/social/profiles/${id}/details?page=${page}&limit=${limit}`)
  }

  async getProfileAiAnalysis(id: string) {
    return this.request(`/social/profiles/${id}/aianalysis`)
  }

  async getProfilePosts(id: string, page = 1, limit = 20, sort = 'latest', sentiment: string | null = null) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sort: sort
    })
    
    if (sentiment && sentiment !== 'all') {
      params.append('sentiment', sentiment)
    }
    
    return this.request(`/social/profiles/${id}/posts?${params.toString()}`)
  }

  async getAllPosts(page = 1, limit = 10, filters: any = {}) {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('limit', limit.toString())
    
    // Add filters
    if (filters.search) params.append('search', filters.search)
    if (filters.platform) params.append('platform', filters.platform)
    if (filters.sentiment) params.append('sentiment', filters.sentiment)
    if (filters.campaignId) params.append('campaignId', filters.campaignId)
    if (filters.contentType) params.append('contentType', filters.contentType)
    if (filters.hasMedia) params.append('hasMedia', filters.hasMedia)
    if (filters.hasImages) params.append('hasImages', filters.hasImages)
    if (filters.hasVideos) params.append('hasVideos', filters.hasVideos)
    if (filters.startDate) params.append('startDate', filters.startDate)
    if (filters.endDate) params.append('endDate', filters.endDate)
    if (filters.timeRange) params.append('timeRange', filters.timeRange)
    
    return this.request(`/social/posts?${params.toString()}`)
  }

  async getPostComments(postId: string) {
    return this.request(`/campaigns/${postId}/comments`)
  }

  async getHourlyPostingData() {
    return this.request('/social/posts/hourly-data')
  }

  // Entity APIs
  async getEntityAnalytics(filters: any = {}) {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value))
      }
    })
    return this.request(`/social/entities/analytics?${params.toString()}`)
  }

  async getTopEntities(type: string, timeRange = '7d', limit = 20) {
    const params = new URLSearchParams({
      timeRange,
      limit: limit.toString()
    })
    return this.request(`/social/entities/top/${type}?${params.toString()}`)
  }

  async searchEntities(query: string, type?: string, category?: string, limit = 20) {
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString()
    })
    if (type) params.append('type', type)
    if (category) params.append('category', category)
    return this.request(`/social/entities/search?${params.toString()}`)
  }

  async getEntityDetails(id: string, page = 1, limit = 20, filter = 'latest') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      filter: filter
    })
    return this.request(`/social/entities/${id}?${params.toString()}`)
  }

  // Location APIs
  async getLocationAnalytics(filters: any = {}) {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value))
      }
    })
    return this.request(`/social/locations/analytics?${params.toString()}`)
  }

  async getTopLocations(timeRange = '7d', limit = 20) {
    const params = new URLSearchParams({
      timeRange,
      limit: limit.toString()
    })
    return this.request(`/social/locations/top?${params.toString()}`)
  }

  async searchLocations(query: string, limit = 20) {
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString()
    })
    return this.request(`/social/locations/search?${params.toString()}`)
  }

  async getLocationDetails(id: string, page = 1, limit = 20, filter = 'latest') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      filter: filter
    })
    return this.request(`/social/locations/${id}?${params.toString()}`)
  }

  // OSINT Tools APIs
  async ironveilSearch(data: { entityType?: string; query: string; filters?: any; org: string; firNo: string }) {
    return this.request('/osint/ironveil/search', {
      method: 'POST',
      body: data as any,
    })
  }

  async mobileToPAN(data: { mobile_number: string; org: string; firNo: string }) {
    return this.request('/osint/mobile-to-pan', {
      method: 'POST',
      body: data as any,
    })
  }

  async mobileToAccount(data: { mobile_number: string; org: string; firNo: string }) {
    return this.request('/osint/mobile-to-account', {
      method: 'POST',
      body: data as any,
    })
  }

  async mobileUnified(data: { mobile_number: string; org: string; firNo: string }) {
    return this.request('/osint/mobile-unified', {
      method: 'POST',
      body: data as any,
    })
  }

  async truecallerSearch(data: { mobile_number: string; org: string; firNo: string }) {
    return this.request('/osint/truecaller/search', {
      method: 'POST',
      body: data as any,
    })
  }

  async vehicleUnified(data: { vehicle_number: string; org: string; firNo: string }) {
    return this.request('/osint/vehicle-unified', {
      method: 'POST',
      body: data as any,
    })
  }

  async rcDetails(data: { rc_number: string; org: string; firNo: string }) {
    return this.request('/osint/rc-details', {
      method: 'POST',
      body: data as any,
    })
  }

  // Groups APIs
  async getAllGroups(page = 1, limit = 50) {
    return this.request(`/groups?page=${page}&limit=${limit}`)
  }

  async getGroupById(id: string) {
    return this.request(`/groups/${id}`)
  }

  async getGroupPosts(id: string, searchQuery = '', page = 1, limit = 20) {
    return this.request(`/groups/${id}/posts?searchQuery=${encodeURIComponent(searchQuery)}&page=${page}&limit=${limit}`)
  }

  async getFacebookGroupId(url: string) {
    return this.request(`/groups/facebook/group-id?url=${encodeURIComponent(url)}`)
  }

  async getFacebookGroupDetails(url: string) {
    return this.request(`/groups/facebook/group-details?url=${encodeURIComponent(url)}`)
  }
}

// Create and export a singleton instance
const apiService = new ApiService()
export default apiService

// Export individual API sections for convenience
export const campaignApi = {
  getStats: () => apiService.getCampaignStats(),
  getAll: (page?: number, limit?: number, filters?: any) => apiService.getAllCampaigns(page, limit, filters),
  search: (searchTerm: string, page?: number, limit?: number, filters?: any) => apiService.searchCampaigns(searchTerm, page, limit, filters),
  getSearchSuggestions: (searchTerm: string) => apiService.getSearchSuggestions(searchTerm),
  getById: (id: string) => apiService.getCampaignById(id),
  getData: (id: string, page?: number, limit?: number, platforms?: string[], cursor?: string | null, sentimentParams?: any) => apiService.getCampaignData(id, page, limit, platforms, cursor, sentimentParams),
  create: (data: any) => apiService.createCampaign(data),
  createSearch: (data: any) => apiService.campaignSearch(data),
  diagnose: (id: string, data?: any) => apiService.diagnoseCampaign(id, data),
  getAnalysis: (campaignId: string, page?: number, limit?: number) => apiService.getCampaignAnalysis(campaignId, page, limit),
  getAnalysisById: (campaignId: string, analysisId: string) => apiService.getCampaignAnalysisById(campaignId, analysisId),
  startMonitoring: (id: string, data?: any) => apiService.startCampaignMonitoring(id, data),
  stopMonitoring: (id: string) => apiService.stopCampaignMonitoring(id),
  checkPostCampaign: (postId?: string, platformPostId?: string, platform?: string) => apiService.checkPostCampaign(postId, platformPostId, platform),
  getOriginalPost: (campaignId: string) => apiService.getOriginalPostForCampaign(campaignId),
}

export const socialApi = {
  getStats: () => apiService.getSocialStats(),
  profiles: {
    getAll: (page?: number, limit?: number, filters?: any, cursor?: string | null) => apiService.getAllProfiles(page, limit, filters, cursor),
    getById: (id: string) => apiService.getProfileById(id),
    getDetails: (id: string, page?: number, limit?: number) => apiService.getProfileDetails(id, page, limit),
    getPosts: (id: string, page?: number, limit?: number, sort?: string, sentiment?: string | null) => apiService.getProfilePosts(id, page, limit, sort, sentiment),
    getAiAnalysis: (id: string) => apiService.getProfileAiAnalysis(id),
  },
  posts: {
    getAll: (page?: number, limit?: number, filters?: any) => apiService.getAllPosts(page, limit, filters),
    getHourlyData: () => apiService.getHourlyPostingData(),
  },
  entities: {
    getAnalytics: (filters?: any) => apiService.getEntityAnalytics(filters),
    getTop: (type: string, timeRange?: string, limit?: number) => apiService.getTopEntities(type, timeRange, limit),
    search: (query: string, type?: string, category?: string, limit?: number) => apiService.searchEntities(query, type, category, limit),
    getById: (id: string, page?: number, limit?: number, filter?: string) => apiService.getEntityDetails(id, page, limit, filter),
  },
  locations: {
    getAnalytics: (filters?: any) => apiService.getLocationAnalytics(filters),
    getTop: (timeRange?: string, limit?: number) => apiService.getTopLocations(timeRange, limit),
    search: (query: string, limit?: number) => apiService.searchLocations(query, limit),
    getById: (id: string, page?: number, limit?: number, filter?: string) => apiService.getLocationDetails(id, page, limit, filter),
  },
}

export const groupApi = {
  getAll: (page?: number, limit?: number) => apiService.getAllGroups(page, limit),
  getById: (id: string) => apiService.getGroupById(id),
  getPosts: (id: string, searchQuery?: string, page?: number, limit?: number) => apiService.getGroupPosts(id, searchQuery, page, limit),
  facebook: {
    getGroupId: (url: string) => apiService.getFacebookGroupId(url),
    getGroupDetails: (url: string) => apiService.getFacebookGroupDetails(url),
  },
}

export const osintApi = {
  ironveilSearch: (data: any) => apiService.ironveilSearch(data),
  mobileToPAN: (data: any) => apiService.mobileToPAN(data),
  mobileToAccount: (data: any) => apiService.mobileToAccount(data),
  mobileUnified: (data: any) => apiService.mobileUnified(data),
  truecallerSearch: (data: any) => apiService.truecallerSearch(data),
  vehicleUnified: (data: any) => apiService.vehicleUnified(data),
  rcDetails: (data: any) => apiService.rcDetails(data),
}

