// API service for campaigns
// Use Next.js API routes to avoid CORS issues
const API_BASE_URL = 'https://irisnet.wiredleap.com/api';

export interface CampaignMetrics {
  totalPosts: number;
  totalEngagement: number;
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  topPlatforms: Array<{
    platform: string;
    count: number;
  }>;
  engagementRate: number;
  reach: number;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  campaignType: 'KEYWORD' | 'PERSON' | 'POST' | 'HASHTAG';
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED';
  monitoringStatus: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  metrics: CampaignMetrics;
  searchRelevance?: {
    score: number;
    matchedFields: string[];
  };
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface CampaignsResponse {
  data: Campaign[];
  pagination: PaginationInfo;
}

export interface SearchSuggestion {
  value: string;
  label: string;
  type: string;
  priority: number;
}

export interface SearchSuggestionsResponse {
  suggestions: SearchSuggestion[];
}

export interface ApiError {
  success: false;
  error: {
    message: string;
    code: string;
    details?: Record<string, any>;
  };
}

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

// Generic API request handler
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error?.message || 'An error occurred');
  }

  return response.json();
};

// Get all campaigns with pagination and filtering
export const getCampaigns = async (
  page: number = 1,
  limit: number = 10,
  monitored?: boolean
): Promise<CampaignsResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (monitored !== undefined) {
    params.append('monitored', monitored.toString());
  }

  return apiRequest<CampaignsResponse>(`/campaigns?${params.toString()}`);
};

// Search campaigns
export const searchCampaigns = async (
  query: string,
  page: number = 1,
  limit: number = 10,
  monitored?: boolean
): Promise<CampaignsResponse> => {
  const params = new URLSearchParams({
    q: query,
    page: page.toString(),
    limit: limit.toString(),
  });

  if (monitored !== undefined) {
    params.append('monitored', monitored.toString());
  }

  return apiRequest<CampaignsResponse>(`/campaigns/search?${params.toString()}`);
};

// Get search suggestions
export const getSearchSuggestions = async (
  query: string
): Promise<SearchSuggestionsResponse> => {
  if (query.length < 2) {
    return { suggestions: [] };
  }

  const params = new URLSearchParams({ q: query });
  return apiRequest<SearchSuggestionsResponse>(
    `/campaigns/search/suggestions?${params.toString()}`
  );
};

// Delete campaign
export const deleteCampaign = async (id: string): Promise<{ success: boolean; message: string; id: string }> => {
  return apiRequest(`/campaigns/${id}`, {
    method: 'DELETE',
  });
};

// Start monitoring
export const startMonitoring = async (
  id: string,
  intervalMinutes: number = 5,
  notifications?: {
    email?: boolean;
    webhook?: string;
  }
): Promise<{
  success: boolean;
  message: string;
  campaign: {
    id: string;
    monitoringStatus: string;
    monitoringConfig: {
      intervalMinutes: number;
      lastRun: string;
      nextRun: string;
    };
  };
}> => {
  return apiRequest(`/campaigns/${id}/monitor`, {
    method: 'POST',
    body: JSON.stringify({
      intervalMinutes,
      notifications,
    }),
  });
};

// Stop monitoring
export const stopMonitoring = async (id: string): Promise<{
  success: boolean;
  message: string;
  campaign: {
    id: string;
    monitoringStatus: string;
  };
}> => {
  return apiRequest(`/campaigns/${id}/stop-monitoring`, {
    method: 'POST',
  });
};

