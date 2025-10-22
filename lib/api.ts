// API Service Layer for OSINT Turbo Dashboard
// Base configuration and utility functions

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// Types for API responses
export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
  error?: string
}

export interface PaginatedResponse<T = any> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Auth token management - Using 'token' key to match osint-fe
export class AuthManager {
  private static token: string | null = null
  private static initialized: boolean = false

  // Initialize token from localStorage on first access
  private static initialize(): void {
    if (!this.initialized && typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token')
      if (storedToken) {
        this.token = storedToken
        console.log('AuthManager: Token loaded from localStorage')
      }
      this.initialized = true
    }
  }

  static getToken(): string | null {
    this.initialize()
    if (typeof window !== 'undefined') {
      // Always check localStorage as source of truth
      return localStorage.getItem('token') || this.token
    }
    return this.token || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWZncnUyN3YwMDZuejJ4dXM2c3FoNmE5Iiwib3JnYW5pemF0aW9uSWQiOiJjbWRpcmpxcjIwMDAwejI4cG8yZW9uMHlmIiwiaWF0IjoxNzYwNjk1NjE1LCJleHAiOjE3NjA3ODIwMTV9.DZLu5MV2y-yGcyS-pDoNT1IIsZZPnRH1mdVdlQAoy5s'
  }

  static setToken(token: string): void {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify({ token }))
      console.log('AuthManager: Token saved to localStorage')
    }
  }

  static clearToken(): void {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('organization')
      console.log('AuthManager: Token cleared from localStorage')
    }
  }

  static getUser(): any {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user')
      return userStr ? JSON.parse(userStr) : null
    }
    return null
  }

  static setUser(user: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user))
    }
  }

  static getOrganization(): any {
    if (typeof window !== 'undefined') {
      const orgStr = localStorage.getItem('organization')
      return orgStr ? JSON.parse(orgStr) : null
    }
    return null
  }

  static setOrganization(org: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('organization', JSON.stringify(org))
    }
  }
}

// Base API client
class ApiClient {
  private baseURL: string

  constructor(baseURL: string = BASE_URL) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    // ALWAYS get token fresh from localStorage - using 'token' key to match osint-fe
    let token: string | null = null
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token')
    }

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    // Remove Content-Type for FormData
    if (options.body instanceof FormData) {
      const headers = config.headers as Record<string, string>
      delete headers['Content-Type']
    }

    // DEBUG: Log outgoing request
    console.log('🚀 API REQUEST:', {
      url,
      method: config.method || 'GET',
      headers: config.headers,
      body: config.body ? (config.body instanceof FormData ? '[FormData]' : config.body) : undefined,
      timestamp: new Date().toISOString()
    })

    try {
      const response = await fetch(url, config)
      
      // DEBUG: Log response status and headers
      console.log('📥 API RESPONSE:', {
        url,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        timestamp: new Date().toISOString()
      })
      
      if (!response.ok) {
        const data = await response.json().catch(() => ({ 
          message: response.status === 401 ? 'Authentication failed' : 'Network error' 
        }))
        
        // DEBUG: Log error response
        console.error('❌ API ERROR:', {
          url,
          status: response.status,
          statusText: response.statusText,
          error: data,
          timestamp: new Date().toISOString()
        })
        
        // Handle authentication errors - clear token and notify
        if (response.status === 401) {
          console.warn('Authentication failed - clearing token')
          AuthManager.clearToken()
          throw new Error(data.message || 'Authentication failed')
        }
        
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      const responseData = await response.json()
      
      // DEBUG: Log successful response
      console.log('✅ API SUCCESS:', {
        url,
        status: response.status,
        dataLength: Array.isArray(responseData.data) ? responseData.data.length : 'not array',
        success: responseData.success,
        hasPagination: !!(responseData as any).pagination,
        timestamp: new Date().toISOString()
      })
      
      return responseData
    } catch (error) {
      // DEBUG: Log network/other errors
      console.error('💥 API REQUEST FAILED:', {
        url,
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      })
      
      // For network errors, provide helpful message
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network connection failed. Please check your internet connection.')
      }
      throw error
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseURL}${endpoint}`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }
    return this.request<T>(url.pathname + url.search)
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    })
  }

  async uploadFile<T>(endpoint: string, file: File): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append('file', file)
    
    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
    })
  }
}

const apiClient = new ApiClient()

// Authentication API
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post('/api/auth/login', credentials),

  otpLogin: (data: { phoneNumber: string; otp: string }) => {
    // Remove the + sign from the beginning of the phone number if present
    const cleanPhoneNumber = data.phoneNumber.startsWith('+') ? data.phoneNumber.substring(1) : data.phoneNumber;
    return apiClient.post('/api/auth/otpLogin', { ...data, phoneNumber: cleanPhoneNumber });
  },

  getProfile: () => apiClient.get('/api/auth/me'),

  logout: () => apiClient.post('/api/auth/logout'),

  addUser: (userData: { email: string; password: string; name: string; role: string }) =>
    apiClient.post('/api/auth/add-user', userData),

  getOrganizationUsers: () => apiClient.get('/api/auth/organization-users'),
}

// Campaign API
export const campaignApi = {
  getStats: () => apiClient.get('/api/campaigns/stats'),

  getAll: (params?: {
    page?: number
    limit?: number
    monitored?: boolean
  }) => apiClient.get('/api/campaigns', params),

  search: (params: {
    q: string
    page?: number
    limit?: number
    monitored?: boolean
  }) => apiClient.get('/api/campaigns/search', params),

  getSearchSuggestions: (params: { q: string }) =>
    apiClient.get('/api/campaigns/search/suggestions', params),

  searchByPerson: (params: {
    campaignType: 'PERSON'
    personId: string
    socialProfileId: string
    page?: number
    limit?: number
  }) => apiClient.get('/api/campaigns', params),

  getById: (id: string) => apiClient.get(`/api/campaigns/${id}`),

  getData: (id: string, params?: {
    platforms?: string
    limit?: number
    cursor?: string
    positive?: boolean
    negative?: boolean
    neutral?: boolean
  }) => apiClient.get(`/api/campaigns/${id}/data`, params),

  getMedia: (id: string, params?: { page?: number; limit?: number }) =>
    apiClient.get(`/api/campaigns/${id}/media`, params),

  create: (data: {
    name: string
    type: string
    description?: string
    keywords?: string[]
  }) => apiClient.post('/api/campaigns', data),

  update: (id: string, data: { name?: string; description?: string }) =>
    apiClient.put(`/api/campaigns/${id}`, data),

  delete: (id: string) => apiClient.delete(`/api/campaigns/${id}`),

  campaignSearch: (data: {
    query: string
    platforms?: string[]
    timeRange?: string
  }) => apiClient.post('/api/campaigns/campaign-search', data),

  diagnose: (id: string, data: { analysisType: string; parameters?: any }) =>
    apiClient.post(`/api/campaigns/${id}/diagnose`, data),

  getAnalysis: (campaignId: string, params?: { page?: number; limit?: number }) =>
    apiClient.get(`/api/campaigns/${campaignId}/analysis`, params),

  getAnalysisById: (campaignId: string, analysisId: string) =>
    apiClient.get(`/api/campaigns/${campaignId}/analysis/${analysisId}`),

  startMonitoring: (id: string, data: { monitoringType: string; alertThreshold?: number }) =>
    apiClient.post(`/api/campaigns/${id}/monitor`, data),

  stopMonitoring: (id: string) => apiClient.post(`/api/campaigns/${id}/stop-monitoring`),

  getMonitoringStatus: (id: string) => apiClient.get(`/api/campaigns/${id}/monitoring-status`),

  getTrends: (id: string, params?: { timeRange?: string; granularity?: string }) =>
    apiClient.get(`/api/campaigns/${id}/trends`, params),

  checkPerson: (personId: string) => apiClient.get(`/api/campaigns/check-person/${personId}`),

  checkPost: (params: { postId: string; platformPostId: string; platform: string }) =>
    apiClient.get('/api/campaigns/check-post', params),

  getOriginalPost: (campaignId: string) => apiClient.get(`/api/campaigns/${campaignId}/original-post`),

  getComments: (postId: string) => apiClient.get(`/api/campaigns/comments/${postId}`),

  getAlerts: (campaignId: string, params?: { page?: number; limit?: number }) =>
    apiClient.get(`/api/campaigns/${campaignId}/alerts`, params),

  createAlert: (campaignId: string, data: { type: string; threshold?: number; message?: string }) =>
    apiClient.post(`/api/campaigns/${campaignId}/alerts`, data),

  getEvents: (campaignId: string, params?: { page?: number; limit?: number }) =>
    apiClient.get(`/api/campaigns/${campaignId}/events`, params),

  createEvent: (campaignId: string, data: { type: string; title: string; description?: string }) =>
    apiClient.post(`/api/campaigns/${campaignId}/events`, data),

  getEntities: (campaignId: string, params?: { page?: number; limit?: number }) =>
    apiClient.get(`/api/campaigns/${campaignId}/entities`, params),

  createEntity: (campaignId: string, data: { name: string; type: string; description?: string }) =>
    apiClient.post(`/api/campaigns/${campaignId}/entities`, data),
}

// Social Media API
export const socialApi = {
  getStats: () => apiClient.get('/api/social/stats'),

  getInboxStats: (params?: {
    sentiment?: string
    platform?: string
    search?: string
    timeRange?: string
  }) => apiClient.get('/api/social/inbox/stats', params),

  getHourlyPostingData: () => apiClient.get('/api/social/posts/hourly-data'),

  // Entity Analytics Methods
  getEntityAnalytics: (params?: {
    type?: string
    category?: string
    timeRange?: string
    sentiment?: string
    platform?: string
    socialProfileId?: string
    campaignId?: string
    limit?: number
    minMentions?: number
    query?: string
  }) => apiClient.get('/api/social/entities/analytics', params),

  getTopEntities: (type: string, params?: {
    timeRange?: string
    limit?: number
    minMentions?: number
  }) => apiClient.get(`/api/social/entities/top/${type}`, params),

  searchEntities: (params: {
    q: string
    type?: string
    category?: string
    limit?: number
  }) => apiClient.get('/api/social/entities/search', params),

  getEntityDetails: (id: string, params?: {
    page?: number
    limit?: number
    filter?: string
  }) => apiClient.get(`/api/social/entities/${id}`, params),

  getPosts: (params?: {
    page?: number
    limit?: number
    search?: string
    platform?: string
    sentiment?: string
    campaignId?: string
    contentType?: string
    hasMedia?: boolean
    hasImages?: boolean
    hasVideos?: boolean
    needsAttention?: boolean
    priority?: string
    reviewStatus?: string
    classification?: string
    relevance?: number
    riskLevel?: string
    isFlagged?: boolean
    isResolved?: boolean
    assignedTo?: string
    escalatedTo?: string
    notes?: string
    min_likesCount?: number
    max_likesCount?: number
    min_commentsCount?: number
    max_commentsCount?: number
    min_sharesCount?: number
    max_sharesCount?: number
    min_viewsCount?: number
    max_viewsCount?: number
    startDate?: string
    endDate?: string
    timeRange?: string
  }) => apiClient.get('/api/social/posts', params),

  getPostById: (id: string) => apiClient.get(`/api/social/posts/${id}`),

  getPostsForAnalysis: () => apiClient.get('/api/social/posts/analysis-queue'),

  createPost: (data: { content: string; platform: string; authorId: string }) =>
    apiClient.post('/api/social/posts', data),

  updatePost: (id: string, data: { content?: string }) =>
    apiClient.put(`/api/social/posts/${id}`, data),

  updatePostAnalysis: (id: string, data: { sentiment?: string; entities?: string[]; topics?: string[] }) =>
    apiClient.patch(`/api/social/posts/${id}/analysis`, data),

  deletePost: (id: string) => apiClient.delete(`/api/social/posts/${id}`),

  updatePostReview: (id: string, data: { reviewStatus: string; reviewerNotes?: string }) =>
    apiClient.patch(`/api/social/posts/${id}/review`, data),

  togglePostFlag: (id: string, data: { isFlagged: boolean; flagReason?: string }) =>
    apiClient.patch(`/api/social/posts/${id}/flag`, data),

  resolvePost: (id: string, data: { isResolved: boolean; resolutionNotes?: string }) =>
    apiClient.patch(`/api/social/posts/${id}/resolve`, data),

  escalatePost: (id: string, data: { escalatedTo: string; escalationReason?: string }) =>
    apiClient.patch(`/api/social/posts/${id}/escalate`, data),

  assignPost: (id: string, data: { assignedTo: string; assignmentNotes?: string }) =>
    apiClient.patch(`/api/social/posts/${id}/assign`, data),

  addPostNote: (id: string, data: { note: string; noteType?: string }) =>
    apiClient.post(`/api/social/posts/${id}/notes`, data),

  getPostNotes: (id: string) => apiClient.get(`/api/social/posts/${id}/notes`),

  deletePostNote: (postId: string, noteId: string) =>
    apiClient.delete(`/api/social/posts/${postId}/notes/${noteId}`),

  linkRelatedPosts: (id: string, data: { relatedPostIds: string[]; relationType: string }) =>
    apiClient.post(`/api/social/posts/${id}/relations`, data),

  getPostActions: (id: string) => apiClient.get(`/api/social/posts/${id}/actions`),

  updatePostRelevance: (id: string, data: { relevance: number; relevanceNotes?: string }) =>
    apiClient.patch(`/api/social/posts/${id}/relevance`, data),

  updatePostClassification: (id: string, data: { classification: string; classificationNotes?: string }) =>
    apiClient.patch(`/api/social/posts/${id}/classification`, data),

  getPostAIReport: (postId: string) => apiClient.get(`/api/social/posts/${postId}/ai-report`),
}

// Social Profiles API
export const profileApi = {
  getAll: (params?: {
    limit?: number
    cursor?: string
    minFollowers?: number
    maxFollowers?: number
    minPosts?: number
    maxPosts?: number
    isVerified?: boolean
    isBlueVerified?: boolean
    platform?: string
    location?: string
    personStatus?: string
    search?: string
    campaignId?: string
  }) => apiClient.get('/api/social/profiles', params),

  getAllUnlimited: () => apiClient.get('/api/social/profiles/all'),

  search: (params: { query: string; limit?: number }) =>
    apiClient.get('/api/social/profiles/search', params),

  getById: (id: string) => apiClient.get(`/api/social/profiles/${id}`),

  getDetails: (id: string, params?: { page?: number; limit?: number }) =>
    apiClient.get(`/api/social/profiles/${id}/details`, params),

  getAIAnalysis: (id: string) => apiClient.get(`/api/social/profiles/${id}/aianalysis`),

  getPosts: (id: string, params?: {
    page?: number
    limit?: number
    sort?: string
    sentiment?: string
  }) => apiClient.get(`/api/social/profiles/${id}/posts`, params),

  create: (data: { username: string; platform: string; displayName: string }) =>
    apiClient.post('/api/social/profiles', data),

  update: (id: string, data: { displayName?: string; bio?: string }) =>
    apiClient.put(`/api/social/profiles/${id}`, data),

  delete: (id: string) => apiClient.delete(`/api/social/profiles/${id}`),

  getAuthorMetadata: (authorId: string) => apiClient.get(`/api/social/authors/${authorId}/metadata`),
}

// Entities API
export const entityApi = {
  getAnalytics: (params?: {
    timeRange?: string
    platform?: string
    category?: string
  }) => apiClient.get('/api/social/entities/analytics', params),

  getTop: (type: string, params?: { timeRange?: string; limit?: number }) =>
    apiClient.get(`/api/social/entities/top/${type}`, params),

  search: (params: {
    q: string
    type?: string
    category?: string
    limit?: number
  }) => apiClient.get('/api/social/entities/search', params),

  getDetails: (id: string, params?: { page?: number; limit?: number; filter?: string }) =>
    apiClient.get(`/api/social/entities/${id}`, params),
}

// Locations API
export const locationApi = {
  // Get Location Analytics - Retrieves aggregated analytics for all locations
  getAnalytics: (params?: Record<string, any>) =>
    apiClient.get('/api/social/locations/analytics', params),

  // Search Locations - Searches for locations by name or other criteria
  search: (params: { q: string; limit?: number }) =>
    apiClient.get('/api/social/locations/search', params),

  // Get Location Details by ID - Retrieves detailed information and posts for a specific location
  getById: (id: string, params?: { page?: number; limit?: number; filter?: string }) =>
    apiClient.get(`/api/social/locations/${id}`, params),

  // Get Posts from Multiple Locations - Retrieves posts that mention any of the specified locations
  getByMultipleNames: (params: {
    locations: string // Comma-separated list of location names
    page?: number
    limit?: number
    filter?: string
  }) => apiClient.get('/api/social/locations/multiple', params),
}

// OSINT External APIs
export const osintApi = {
  ironVeilSearch: (data: { entityType?: string; query: string; filters?: any; org: string; firNo: string }) =>
    apiClient.post('/api/osint/ironveil/search', data),

  ironveilSearch: (data: { entityType?: string; query: string; filters?: any; org: string; firNo: string }) =>
    apiClient.post('/api/osint/ironveil/search', data),

  mobileToPAN: (data: { mobile_number: string; org: string; firNo: string }) =>
    apiClient.post('/api/osint/mobile-to-pan', data),

  mobileToAccount: (data: { mobile_number: string; org: string; firNo: string }) =>
    apiClient.post('/api/osint/mobile-to-account', data),

  mobileToAddress: (data: { mobile_number: string; org: string; firNo: string }) =>
    apiClient.post('/api/osint/mobile-to-address', data),

  mobileToName: (data: { mobile_number: string; org: string; firNo: string }) =>
    apiClient.post('/api/osint/mobile-to-name', data),

  mobileToVehicle: (data: { mobile_number: string; org: string; firNo: string }) =>
    apiClient.post('/api/osint/mobile-to-vehicle', data),

  mobileUnified: (data: { mobile_number: string; org: string; firNo: string }) =>
    apiClient.post('/api/osint/mobile-unified', data),

  rcDetails: (data: { rc_number: string; org: string; firNo: string }) =>
    apiClient.post('/api/osint/rc-details', data),

  rcToMobile: (data: { rc_number: string; org: string; firNo: string }) =>
    apiClient.post('/api/osint/rc-to-mobile', data),

  truecallerSearch: (data: { mobile_number: string; org: string; firNo: string }) =>
    apiClient.post('/api/osint/truecaller/search', data),

  upiToBank: (data: { upi_id: string; org: string; firNo: string }) =>
    apiClient.post('/api/osint/upi-to-bank', data),

  vehicleUnified: (data: { vehicle_number: string; org: string; firNo: string }) =>
    apiClient.post('/api/osint/vehicle-unified', data),

  getDashboard: () => apiClient.get('/api/osint/external/dashboard'),

  getHistory: (params?: { limit?: number }) => apiClient.get('/api/osint/external/history', params),
}

// Political Dashboard API
export const politicalApi = {
  getQuickStats: (params?: { timeRange?: string; cached?: boolean }) =>
    apiClient.get('/api/political-dashboard/quick-stats', params),

  getCampaignThemes: (params?: { timeRange?: string; cached?: boolean }) =>
    apiClient.get('/api/political-dashboard/campaign-themes', params),

  getInfluencerTracker: (params?: { timeRange?: string; cached?: boolean }) =>
    apiClient.get('/api/political-dashboard/influencer-tracker', params),

  getOpponentNarratives: (params?: { timeRange?: string; cached?: boolean }) =>
    apiClient.get('/api/political-dashboard/opponent-narratives', params),

  getSupportBaseEnergy: (params?: { timeRange?: string; cached?: boolean }) =>
    apiClient.get('/api/political-dashboard/support-base-energy', params),
}

// Persons API
export const personApi = {
  getStats: () => apiClient.get('/api/persons/stats'),

  search: (params?: { name?: string; age?: number; location?: string }) =>
    apiClient.get('/api/persons/search', params),

  getAll: (params?: { page?: number; limit?: number }) =>
    apiClient.get('/api/persons', params),

  getById: (id: string) => apiClient.get(`/api/persons/${id}`),

  create: (data: { name: string; age?: number; location?: string }) =>
    apiClient.post('/api/persons', data),

  update: (id: string, data: { name?: string; age?: number; location?: string }) =>
    apiClient.put(`/api/persons/${id}`, data),

  delete: (id: string) => apiClient.delete(`/api/persons/${id}`),

  updateStatus: (id: string, data: { status: string; notes?: string }) =>
    apiClient.patch(`/api/persons/${id}/status`, data),
}

// Users API
export const userApi = {
  getStats: () => apiClient.get('/api/users/stats'),

  getAll: (params?: { page?: number; limit?: number }) =>
    apiClient.get('/api/users', params),

  getById: (id: string) => apiClient.get(`/api/users/${id}`),

  create: (data: { email: string; password: string; name: string; role: string }) =>
    apiClient.post('/api/users', data),

  update: (id: string, data: { name?: string; role?: string }) =>
    apiClient.put(`/api/users/${id}`, data),

  delete: (id: string) => apiClient.delete(`/api/users/${id}`),
}

// Credits API
export const creditApi = {
  getStats: () => apiClient.get('/api/credits/stats'),

  getAll: (params?: { page?: number; limit?: number }) =>
    apiClient.get('/api/credits', params),

  getUserCredits: (userId: string) => apiClient.get(`/api/credits/user/${userId}`),

  addCredits: (data: { userId: string; amount: number; reason: string }) =>
    apiClient.post('/api/credits', data),

  deductCredits: (data: { userId: string; amount: number; reason: string }) =>
    apiClient.post('/api/credits/deduct', data),
}

// Tools API
export const toolApi = {
  getAll: () => apiClient.get('/api/tools'),

  getById: (id: string) => apiClient.get(`/api/tools/${id}`),
}

// Accounts API
export const accountApi = {
  getAll: (params?: { page?: number; limit?: number }) =>
    apiClient.get('/api/accounts', params),

  getById: (id: string) => apiClient.get(`/api/accounts/${id}`),

  create: (data: { name: string; type: string; description?: string }) =>
    apiClient.post('/api/accounts', data),

  update: (id: string, data: { name?: string; description?: string }) =>
    apiClient.put(`/api/accounts/${id}`, data),

  delete: (id: string) => apiClient.delete(`/api/accounts/${id}`),
}

// Incidents API
export const incidentApi = {
  getAll: (params?: { page?: number; limit?: number }) =>
    apiClient.get('/api/incidents', params),

  getById: (id: string) => apiClient.get(`/api/incidents/${id}`),

  create: (data: { title: string; description?: string; severity?: string; status?: string }) =>
    apiClient.post('/api/incidents', data),

  update: (id: string, data: { title?: string; status?: string }) =>
    apiClient.put(`/api/incidents/${id}`, data),

  delete: (id: string) => apiClient.delete(`/api/incidents/${id}`),
}

// Reports API
export const reportApi = {
  uploadFile: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.request('/api/reports/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}

// Notifications API
export const notificationApi = {
  // Get notification settings for a campaign
  getCampaignSettings: (campaignId: string) =>
    apiClient.get(`/api/notifications/campaigns/${campaignId}/settings`),

  // Update notification settings for a campaign
  updateCampaignSettings: (campaignId: string, data: {
    emailEnabled: boolean
    emailRecipients: string[]
    notifyOnNewPost: boolean
    notifyOnHighPriority: boolean
    notifyOnNegativeSentiment: boolean
    notifyOnHighEngagement: boolean
    minEngagementThreshold?: number
    digestFrequency?: 'realtime' | 'hourly' | 'daily' | 'weekly'
  }) => apiClient.put(`/api/notifications/campaigns/${campaignId}/settings`, data),

  // Get all notification preferences for current user
  getUserPreferences: () =>
    apiClient.get('/api/notifications/preferences'),

  // Update user notification preferences
  updateUserPreferences: (data: {
    emailEnabled: boolean
    emailAddress?: string
    digestEnabled: boolean
    digestFrequency?: string
  }) => apiClient.put('/api/notifications/preferences', data),

  // Get notification history
  getHistory: (params?: { page?: number; limit?: number; campaignId?: string }) =>
    apiClient.get('/api/notifications/history', params),

  // Test email notification
  testEmail: (data: { campaignId: string; recipientEmail: string }) =>
    apiClient.post('/api/notifications/test-email', data),

  // Get team members for notifications
  getTeamMembers: () =>
    apiClient.get('/api/notifications/team-members'),
}

// Communities API
const communitiesApi = {
  getCommunities: (params?: any) =>
    apiClient.get('/api/communities', params),
  
  getCommunity: (id: string) =>
    apiClient.get(`/api/communities/${id}`),
}

// Groups API
export const groupApi = {
  getAll: (params?: { page?: number; limit?: number }) =>
    apiClient.get('/api/groups', params),
  
  getById: (id: string) =>
    apiClient.get(`/api/groups/${id}`),
  
  create: (data: { name: string; platform: string; url: string; description?: string }) =>
    apiClient.post('/api/groups', data),
  
  update: (id: string, data: { name?: string; description?: string }) =>
    apiClient.put(`/api/groups/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete(`/api/groups/${id}`),
  
  getPosts: (id: string, params?: { searchQuery?: string; page?: number; limit?: number }) =>
    apiClient.get(`/api/groups/${id}/posts`, params),
  
  getCampaign: (id: string) =>
    apiClient.get(`/api/groups/${id}/campaign`),
  
  refreshPosts: (id: string, platform: string) =>
    apiClient.post(`/api/groups/${id}/refresh-posts`, { platform }),
  
  getCampaignPosts: (id: string, params?: { page?: number; limit?: number; platform?: string }) =>
    apiClient.get(`/api/groups/${id}/campaign-posts`, params),
  
  facebook: {
    getGroupId: (url: string) =>
      apiClient.get('/api/groups/facebook/group-id', { url }),
    
    getGroupDetails: (url: string) =>
      apiClient.get('/api/groups/facebook/group-details', { url }),
    
    getGroupPosts: (groupId: string, params?: { cursor?: string; sortingOrder?: string }) =>
      apiClient.get('/api/groups/facebook/group-posts', { groupId, ...params }),
    
    getGroupEvents: (groupId: string, params?: { cursor?: string }) =>
      apiClient.get('/api/groups/facebook/group-events', { groupId, ...params }),
  },
  
  instagram: {
    getProfileData: (url: string) =>
      apiClient.get('/api/groups/instagram/profile-data', { url }),
    
    getPosts: (url: string) =>
      apiClient.get('/api/groups/instagram/posts', { url }),
  },
}

// Export all APIs
export const api = {
  auth: authApi,
  campaign: campaignApi,
  social: socialApi,
  profile: profileApi,
  entity: entityApi,
  location: locationApi,
  osint: osintApi,
  political: politicalApi,
  person: personApi,
  user: userApi,
  credit: creditApi,
  tool: toolApi,
  account: accountApi,
  incident: incidentApi,
  report: reportApi,
  notification: notificationApi,
  group: groupApi,
  community: communitiesApi,
}

// Export default client for backward compatibility
export default apiClient
