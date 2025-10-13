// Mock Notification API Service
// Provides fallback functionality when backend endpoints are not available

import { ApiResponse } from './api'

interface NotificationSettings {
  emailEnabled: boolean
  emailRecipients: string[]
  notifyOnNewPost: boolean
  notifyOnHighPriority: boolean
  notifyOnNegativeSentiment: boolean
  notifyOnHighEngagement: boolean
  minEngagementThreshold: number
  digestFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly'
}

interface TeamMember {
  id: string
  email: string
  name: string
  role: string
}

interface NotificationHistoryItem {
  id: string
  campaignId: string
  type: string
  title: string
  message: string
  timestamp: string
  status: 'sent' | 'failed' | 'pending'
  recipientEmail: string
}

// Mock data storage keys
const STORAGE_KEYS = {
  CAMPAIGN_SETTINGS: (campaignId: string) => `notification-settings-${campaignId}`,
  TEAM_MEMBERS: 'notification-team-members',
  USER_PREFERENCES: 'notification-user-preferences',
  NOTIFICATION_HISTORY: 'notification-history'
}

// Default notification settings
const DEFAULT_SETTINGS: NotificationSettings = {
  emailEnabled: false,
  emailRecipients: [],
  notifyOnNewPost: true,
  notifyOnHighPriority: true,
  notifyOnNegativeSentiment: true,
  notifyOnHighEngagement: false,
  minEngagementThreshold: 1000,
  digestFrequency: 'realtime'
}

// Mock team members
const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  { id: '1', email: 'admin@example.com', name: 'Admin User', role: 'Administrator' },
  { id: '2', email: 'analyst@example.com', name: 'Data Analyst', role: 'Analyst' },
  { id: '3', email: 'manager@example.com', name: 'Campaign Manager', role: 'Manager' },
  { id: '4', email: 'supervisor@example.com', name: 'Team Supervisor', role: 'Supervisor' },
  { id: '5', email: 'reviewer@example.com', name: 'Content Reviewer', role: 'Reviewer' }
]

// Helper functions for localStorage operations
const storageHelpers = {
  get: (key: string) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Failed to parse localStorage item:', error)
      return null
    }
  },

  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
      return false
    }
  },

  remove: (key: string) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Failed to remove from localStorage:', error)
      return false
    }
  }
}

// Mock Notification API
export const mockNotificationApi = {
  // Get notification settings for a campaign
  getCampaignSettings: async (campaignId: string): Promise<ApiResponse<NotificationSettings>> => {
    console.log(`[Mock API] Getting notification settings for campaign: ${campaignId}`)
    
    const key = STORAGE_KEYS.CAMPAIGN_SETTINGS(campaignId)
    const settings = storageHelpers.get(key) || DEFAULT_SETTINGS
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return {
      success: true,
      data: settings,
      message: 'Settings loaded successfully'
    }
  },

  // Update notification settings for a campaign
  updateCampaignSettings: async (campaignId: string, settings: NotificationSettings): Promise<ApiResponse<void>> => {
    console.log(`[Mock API] Updating notification settings for campaign: ${campaignId}`, settings)
    
    const key = STORAGE_KEYS.CAMPAIGN_SETTINGS(campaignId)
    const success = storageHelpers.set(key, settings)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (success) {
      return {
        success: true,
        data: null,
        message: 'Settings updated successfully'
      }
    } else {
      return {
        success: false,
        data: null,
        message: 'Failed to save settings'
      }
    }
  },

  // Get all notification preferences for current user
  getUserPreferences: async (): Promise<ApiResponse<any>> => {
    console.log('[Mock API] Getting user notification preferences')
    
    const preferences = storageHelpers.get(STORAGE_KEYS.USER_PREFERENCES) || {
      emailEnabled: true,
      emailAddress: 'user@example.com',
      digestEnabled: true,
      digestFrequency: 'daily'
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))
    
    return {
      success: true,
      data: preferences,
      message: 'User preferences loaded successfully'
    }
  },

  // Update user notification preferences
  updateUserPreferences: async (data: any): Promise<ApiResponse<void>> => {
    console.log('[Mock API] Updating user notification preferences', data)
    
    const success = storageHelpers.set(STORAGE_KEYS.USER_PREFERENCES, data)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400))
    
    if (success) {
      return {
        success: true,
        data: null,
        message: 'User preferences updated successfully'
      }
    } else {
      return {
        success: false,
        data: null,
        message: 'Failed to update user preferences'
      }
    }
  },

  // Get notification history
  getHistory: async (params?: { page?: number; limit?: number; campaignId?: string }): Promise<ApiResponse<NotificationHistoryItem[]>> => {
    console.log('[Mock API] Getting notification history', params)
    
    const history = storageHelpers.get(STORAGE_KEYS.NOTIFICATION_HISTORY) || []
    
    // Filter by campaign if specified
    let filteredHistory = history
    if (params?.campaignId) {
      filteredHistory = history.filter((item: NotificationHistoryItem) => item.campaignId === params.campaignId)
    }
    
    // Simulate pagination
    const page = params?.page || 1
    const limit = params?.limit || 20
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedHistory = filteredHistory.slice(startIndex, endIndex)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return {
      success: true,
      data: paginatedHistory,
      message: 'Notification history loaded successfully'
    }
  },

  // Test email notification
  testEmail: async (data: { campaignId: string; recipientEmail: string }): Promise<ApiResponse<void>> => {
    console.log('[Mock API] Testing email notification', data)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Add to notification history
    const history = storageHelpers.get(STORAGE_KEYS.NOTIFICATION_HISTORY) || []
    const newNotification: NotificationHistoryItem = {
      id: `test-${Date.now()}`,
      campaignId: data.campaignId,
      type: 'test_email',
      title: 'Test Email Notification',
      message: 'This is a test email to verify notification settings.',
      timestamp: new Date().toISOString(),
      status: 'sent',
      recipientEmail: data.recipientEmail
    }
    
    history.unshift(newNotification)
    storageHelpers.set(STORAGE_KEYS.NOTIFICATION_HISTORY, history.slice(0, 100)) // Keep only last 100
    
    return {
      success: true,
      data: null,
      message: `Test email sent successfully to ${data.recipientEmail}`
    }
  },

  // Get team members for notifications
  getTeamMembers: async (): Promise<ApiResponse<TeamMember[]>> => {
    console.log('[Mock API] Getting team members')
    
    const teamMembers = storageHelpers.get(STORAGE_KEYS.TEAM_MEMBERS) || DEFAULT_TEAM_MEMBERS
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 250))
    
    return {
      success: true,
      data: teamMembers,
      message: 'Team members loaded successfully'
    }
  },

  // Add a team member
  addTeamMember: async (member: Omit<TeamMember, 'id'>): Promise<ApiResponse<TeamMember>> => {
    console.log('[Mock API] Adding team member', member)
    
    const teamMembers = storageHelpers.get(STORAGE_KEYS.TEAM_MEMBERS) || DEFAULT_TEAM_MEMBERS
    const newMember: TeamMember = {
      ...member,
      id: `member-${Date.now()}`
    }
    
    teamMembers.push(newMember)
    storageHelpers.set(STORAGE_KEYS.TEAM_MEMBERS, teamMembers)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400))
    
    return {
      success: true,
      data: newMember,
      message: 'Team member added successfully'
    }
  },

  // Remove a team member
  removeTeamMember: async (memberId: string): Promise<ApiResponse<void>> => {
    console.log('[Mock API] Removing team member', memberId)
    
    const teamMembers = storageHelpers.get(STORAGE_KEYS.TEAM_MEMBERS) || DEFAULT_TEAM_MEMBERS
    const filteredMembers = teamMembers.filter((member: TeamMember) => member.id !== memberId)
    storageHelpers.set(STORAGE_KEYS.TEAM_MEMBERS, filteredMembers)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return {
      success: true,
      data: null,
      message: 'Team member removed successfully'
    }
  },

  // Send notification
  sendNotification: async (data: {
    campaignId: string
    type: string
    title: string
    message: string
    recipientEmails: string[]
  }): Promise<ApiResponse<void>> => {
    console.log('[Mock API] Sending notification', data)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Add to notification history
    const history = storageHelpers.get(STORAGE_KEYS.NOTIFICATION_HISTORY) || []
    
    data.recipientEmails.forEach(email => {
      const newNotification: NotificationHistoryItem = {
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        campaignId: data.campaignId,
        type: data.type,
        title: data.title,
        message: data.message,
        timestamp: new Date().toISOString(),
        status: Math.random() > 0.1 ? 'sent' : 'failed', // 90% success rate
        recipientEmail: email
      }
      history.unshift(newNotification)
    })
    
    storageHelpers.set(STORAGE_KEYS.NOTIFICATION_HISTORY, history.slice(0, 100)) // Keep only last 100
    
    return {
      success: true,
      data: null,
      message: `Notification sent to ${data.recipientEmails.length} recipient(s)`
    }
  }
}

export default mockNotificationApi
