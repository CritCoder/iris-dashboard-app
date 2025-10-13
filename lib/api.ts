// API Service Layer for OSINT Turbo Dashboard
// Base configuration and utility functions

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://irisnet.wiredleap.com'

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

// Auth token management
export class AuthManager {
  private static token: string | null = null

  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token') || this.token
    }
    return this.token
  }

  static setToken(token: string): void {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  static clearToken(): void {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
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
    const token = AuthManager.getToken()

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        // Handle authentication errors gracefully
        if (response.status === 401) {
          console.warn(`Authentication required for ${endpoint}`)
          return { success: false, data: null, message: 'Authentication required' }
        }
        // Handle route not found errors
        if (response.status === 404) {
          console.warn(`Endpoint not found: ${endpoint}`)
          return { success: false, data: null, message: 'Endpoint not found' }
        }
        // Handle bad request errors gracefully
        if (response.status === 400) {
          console.warn(`Bad request for ${endpoint}:`, data.message || 'Invalid parameters')
          return { success: false, data: null, message: data.message || 'Invalid request parameters' }
        }
        // For other errors, return gracefully instead of throwing
        console.warn(`API error for ${endpoint}:`, data.message || `HTTP ${response.status}`)
        return { success: false, data: null, message: data.message || `HTTP error! status: ${response.status}` }
      }

      return data
    } catch (error) {
      console.error('API request failed:', error)
      // Return a graceful error response instead of throwing
      return { success: false, data: null, message: error instanceof Error ? error.message : 'Network error' }
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
}

const apiClient = new ApiClient()

// Authentication API
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post('/api/auth/login', credentials),

  otpLogin: (data: { phoneNumber: string; otp: string }) =>
    apiClient.post('/api/auth/otpLogin', data),

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

  getById: (id: string) => apiClient.get(`/campaigns/${id}`),

  getData: (id: string, params?: {
    platforms?: string
    limit?: number
    cursor?: string
    positive?: boolean
    negative?: boolean
    neutral?: boolean
  }) => apiClient.get(`/campaigns/${id}/data`, params),

  getMedia: (id: string, params?: { page?: number; limit?: number }) =>
    apiClient.get(`/campaigns/${id}/media`, params),

  create: (data: {
    name: string
    type: string
    description?: string
    keywords?: string[]
  }) => apiClient.post('/api/campaigns', data),

  update: (id: string, data: { name?: string; description?: string }) =>
    apiClient.put(`/campaigns/${id}`, data),

  delete: (id: string) => apiClient.delete(`/campaigns/${id}`),

  campaignSearch: (data: {
    query: string
    platforms?: string[]
    timeRange?: string
  }) => apiClient.post('/api/campaigns/campaign-search', data),

  diagnose: (id: string, data: { analysisType: string; parameters?: any }) =>
    apiClient.post(`/campaigns/${id}/diagnose`, data),

  getAnalysis: (campaignId: string, params?: { page?: number; limit?: number }) =>
    apiClient.get(`/campaigns/${campaignId}/analysis`, params),

  getAnalysisById: (campaignId: string, analysisId: string) =>
    apiClient.get(`/campaigns/${campaignId}/analysis/${analysisId}`),

  startMonitoring: (id: string, data: { monitoringType: string; alertThreshold?: number }) =>
    apiClient.post(`/campaigns/${id}/monitor`, data),

  stopMonitoring: (id: string) => apiClient.post(`/campaigns/${id}/stop-monitoring`),

  getMonitoringStatus: (id: string) => apiClient.get(`/campaigns/${id}/monitoring-status`),

  getTrends: (id: string, params?: { timeRange?: string; granularity?: string }) =>
    apiClient.get(`/campaigns/${id}/trends`, params),

  checkPerson: (personId: string) => apiClient.get(`/campaigns/check-person/${personId}`),

  checkPost: (params: { postId: string; platformPostId: string; platform: string }) =>
    apiClient.get('/api/campaigns/check-post', params),

  getOriginalPost: (campaignId: string) => apiClient.get(`/campaigns/${campaignId}/original-post`),

  getComments: (postId: string) => apiClient.get(`/campaigns/comments/${postId}`),

  getAlerts: (campaignId: string, params?: { page?: number; limit?: number }) =>
    apiClient.get(`/campaigns/${campaignId}/alerts`, params),

  createAlert: (campaignId: string, data: { type: string; threshold?: number; message?: string }) =>
    apiClient.post(`/campaigns/${campaignId}/alerts`, data),

  getEvents: (campaignId: string, params?: { page?: number; limit?: number }) =>
    apiClient.get(`/campaigns/${campaignId}/events`, params),

  createEvent: (campaignId: string, data: { type: string; title: string; description?: string }) =>
    apiClient.post(`/campaigns/${campaignId}/events`, data),

  getEntities: (campaignId: string, params?: { page?: number; limit?: number }) =>
    apiClient.get(`/campaigns/${campaignId}/entities`, params),

  createEntity: (campaignId: string, data: { name: string; type: string; description?: string }) =>
    apiClient.post(`/campaigns/${campaignId}/entities`, data),
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

  getPostById: (id: string) => apiClient.get(`/social/posts/${id}`),

  getPostsForAnalysis: () => apiClient.get('/api/social/posts/analysis-queue'),

  createPost: (data: { content: string; platform: string; authorId: string }) =>
    apiClient.post('/api/social/posts', data),

  updatePost: (id: string, data: { content?: string }) =>
    apiClient.put(`/social/posts/${id}`, data),

  updatePostAnalysis: (id: string, data: { sentiment?: string; entities?: string[]; topics?: string[] }) =>
    apiClient.patch(`/social/posts/${id}/analysis`, data),

  deletePost: (id: string) => apiClient.delete(`/social/posts/${id}`),

  updatePostReview: (id: string, data: { reviewStatus: string; reviewerNotes?: string }) =>
    apiClient.patch(`/social/posts/${id}/review`, data),

  togglePostFlag: (id: string, data: { isFlagged: boolean; flagReason?: string }) =>
    apiClient.patch(`/social/posts/${id}/flag`, data),

  resolvePost: (id: string, data: { isResolved: boolean; resolutionNotes?: string }) =>
    apiClient.patch(`/social/posts/${id}/resolve`, data),

  escalatePost: (id: string, data: { escalatedTo: string; escalationReason?: string }) =>
    apiClient.patch(`/social/posts/${id}/escalate`, data),

  assignPost: (id: string, data: { assignedTo: string; assignmentNotes?: string }) =>
    apiClient.patch(`/social/posts/${id}/assign`, data),

  addPostNote: (id: string, data: { note: string; noteType?: string }) =>
    apiClient.post(`/social/posts/${id}/notes`, data),

  getPostNotes: (id: string) => apiClient.get(`/social/posts/${id}/notes`),

  deletePostNote: (postId: string, noteId: string) =>
    apiClient.delete(`/social/posts/${postId}/notes/${noteId}`),

  linkRelatedPosts: (id: string, data: { relatedPostIds: string[]; relationType: string }) =>
    apiClient.post(`/social/posts/${id}/relations`, data),

  getPostActions: (id: string) => apiClient.get(`/social/posts/${id}/actions`),

  updatePostRelevance: (id: string, data: { relevance: number; relevanceNotes?: string }) =>
    apiClient.patch(`/social/posts/${id}/relevance`, data),

  updatePostClassification: (id: string, data: { classification: string; classificationNotes?: string }) =>
    apiClient.patch(`/social/posts/${id}/classification`, data),

  getPostAIReport: (postId: string) => apiClient.get(`/social/posts/${postId}/ai-report`),
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
  }) => apiClient.get('/api/social/profiles', params),

  getAllUnlimited: () => apiClient.get('/api/social/profiles/all'),

  search: (params: { query: string; limit?: number }) =>
    apiClient.get('/api/social/profiles/search', params),

  getById: (id: string) => apiClient.get(`/social/profiles/${id}`),

  getDetails: (id: string, params?: { page?: number; limit?: number }) =>
    apiClient.get(`/social/profiles/${id}/details`, params),

  getAIAnalysis: (id: string) => apiClient.get(`/social/profiles/${id}/aianalysis`),

  getPosts: (id: string, params?: {
    page?: number
    limit?: number
    sort?: string
    sentiment?: string
  }) => apiClient.get(`/social/profiles/${id}/posts`, params),

  create: (data: { username: string; platform: string; displayName: string }) =>
    apiClient.post('/api/social/profiles', data),

  update: (id: string, data: { displayName?: string; bio?: string }) =>
    apiClient.put(`/social/profiles/${id}`, data),

  delete: (id: string) => apiClient.delete(`/social/profiles/${id}`),

  getAuthorMetadata: (authorId: string) => apiClient.get(`/social/authors/${authorId}/metadata`),
}

// Entities API
export const entityApi = {
  getAnalytics: (params?: {
    timeRange?: string
    platform?: string
    category?: string
  }) => apiClient.get('/api/social/entities/analytics', params),

  getTop: (type: string, params?: { timeRange?: string; limit?: number }) =>
    apiClient.get(`/social/entities/top/${type}`, params),

  search: (params: {
    q: string
    type?: string
    category?: string
    limit?: number
  }) => apiClient.get('/api/social/entities/search', params),

  getDetails: (id: string, params?: { page?: number; limit?: number; filter?: string }) =>
    apiClient.get(`/social/entities/${id}`, params),
}

// Locations API
export const locationApi = {
  getAnalytics: (params?: { timeRange?: string; platform?: string }) =>
    apiClient.get('/api/social/locations/analytics', params),

  getTop: (params?: { timeRange?: string; limit?: number }) =>
    apiClient.get('/api/social/locations/top', params),

  search: (params: { q: string; limit?: number }) =>
    apiClient.get('/api/social/locations/search', params),

  getDetails: (id: string, params?: { page?: number; limit?: number; filter?: string }) =>
    apiClient.get(`/social/locations/${id}`, params),

  getMultipleDetails: (params: {
    page?: number
    limit?: number
    filter?: string
    locations: string
  }) => apiClient.get('/api/social/locations/multiple', params),
}

// OSINT External APIs
export const osintApi = {
  ironVeilSearch: (data: { query: string; org: string; firNo: string }) =>
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
    apiClient.post('/api/osint/truecaller-search', data),

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

  getById: (id: string) => apiClient.get(`/persons/${id}`),

  create: (data: { name: string; age?: number; location?: string }) =>
    apiClient.post('/api/persons', data),

  update: (id: string, data: { name?: string; age?: number; location?: string }) =>
    apiClient.put(`/persons/${id}`, data),

  delete: (id: string) => apiClient.delete(`/persons/${id}`),

  updateStatus: (id: string, data: { status: string; notes?: string }) =>
    apiClient.patch(`/persons/${id}/status`, data),
}

// Users API
export const userApi = {
  getStats: () => apiClient.get('/api/users/stats'),

  getAll: (params?: { page?: number; limit?: number }) =>
    apiClient.get('/api/users', params),

  getById: (id: string) => apiClient.get(`/users/${id}`),

  create: (data: { email: string; password: string; name: string; role: string }) =>
    apiClient.post('/api/users', data),

  update: (id: string, data: { name?: string; role?: string }) =>
    apiClient.put(`/users/${id}`, data),

  delete: (id: string) => apiClient.delete(`/users/${id}`),
}

// Credits API
export const creditApi = {
  getStats: () => apiClient.get('/api/credits/stats'),

  getAll: (params?: { page?: number; limit?: number }) =>
    apiClient.get('/api/credits', params),

  getUserCredits: (userId: string) => apiClient.get(`/credits/user/${userId}`),

  addCredits: (data: { userId: string; amount: number; reason: string }) =>
    apiClient.post('/api/credits', data),

  deductCredits: (data: { userId: string; amount: number; reason: string }) =>
    apiClient.post('/api/credits/deduct', data),
}

// Tools API
export const toolApi = {
  getAll: () => apiClient.get('/api/tools'),

  getById: (id: string) => apiClient.get(`/tools/${id}`),
}

// Accounts API
export const accountApi = {
  getAll: (params?: { page?: number; limit?: number }) =>
    apiClient.get('/api/accounts', params),

  getById: (id: string) => apiClient.get(`/accounts/${id}`),

  create: (data: { name: string; type: string; description?: string }) =>
    apiClient.post('/api/accounts', data),

  update: (id: string, data: { name?: string; description?: string }) =>
    apiClient.put(`/accounts/${id}`, data),

  delete: (id: string) => apiClient.delete(`/accounts/${id}`),
}

// Incidents API
export const incidentApi = {
  getAll: (params?: { page?: number; limit?: number }) =>
    apiClient.get('/api/incidents', params),

  getById: (id: string) => apiClient.get(`/incidents/${id}`),

  create: (data: { title: string; description?: string; severity?: string; status?: string }) =>
    apiClient.post('/api/incidents', data),

  update: (id: string, data: { title?: string; status?: string }) =>
    apiClient.put(`/incidents/${id}`, data),

  delete: (id: string) => apiClient.delete(`/incidents/${id}`),
}

// Reports API
export const reportApi = {
  uploadFile: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.request('/reports/upload', {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type, let browser set it with boundary
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
const groupsApi = {
  getGroups: (params?: any) =>
    apiClient.get('/api/groups', params),
  
  getGroup: (id: string) =>
    apiClient.get(`/api/groups/${id}`),
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
  communities: communitiesApi,
  groups: groupsApi,
}

export default api
