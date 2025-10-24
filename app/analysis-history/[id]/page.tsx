'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { Download, Play, Square, RefreshCw, ChevronDown, ExternalLink, Heart, MessageCircle, Share2, Eye, Bell, BarChart3 } from 'lucide-react'
import {
  ChatBubbleLeftRightIcon, UserGroupIcon, CubeIcon, MapPinIcon, BellIcon,
  GlobeAltIcon, SparklesIcon, FireIcon, ShieldExclamationIcon, ChartBarIcon,
  EyeIcon, ArrowTrendingUpIcon, NewspaperIcon, VideoCameraIcon, FaceSmileIcon,
  MinusCircleIcon, FaceFrownIcon, ChevronRightIcon,
  UsersIcon, ChatBubbleBottomCenterTextIcon, HandThumbUpIcon, UserIcon,
  BuildingOfficeIcon, ExclamationTriangleIcon, MagnifyingGlassIcon,
  FlagIcon, BuildingLibraryIcon, HomeIcon
} from '@heroicons/react/24/outline'
import { FaTwitter, FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FacebookIcon, InstagramIcon, TwitterIcon } from '@/components/ui/platform-icons'
import Link from 'next/link'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { CampaignNotificationSettings } from '@/components/notifications/campaign-notification-settings'
import { PostList } from '@/components/posts/post-list'
import { PostRows } from '@/components/posts/post-rows'
import { TrendsWidget } from '@/components/trends/trends-widget'
import { Post } from '@/components/posts/post-card'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useCampaigns } from '@/hooks/use-campaigns'
import { useSocialPosts } from '@/hooks/use-api'
import { useProfiles, convertToProfileCardFormat } from '@/hooks/use-profiles'
import { ProfileList } from '@/components/profiles/profile-list'
import { useEntityAnalytics, useLocationAnalytics } from '@/hooks/use-api'
import { EntityList } from '@/components/entities/entity-list'
import { EntityDetailView } from '@/components/entities/entity-detail-view'
import { LocationList } from '@/components/locations/location-list'
import { LocationDetailView } from '@/components/locations/location-detail-view'
import { startMonitoring, stopMonitoring } from '@/lib/api/campaigns'
import { convertToPostCardFormat } from '@/lib/utils'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { TabBar, Tab } from '@/components/ui/tab-bar'
import { ProfileDetailView } from '@/components/profiles/profile-detail-view'
import { AISummaryCard } from '@/components/analysis/ai-summary-card'

// Sample posts removed - using only real API data

function CampaignDetailPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const campaignId = params.id as string
  const { data: campaigns, loading: campaignsLoading, error: campaignsError } = useCampaigns({ enabled: true })

  // Check authentication status
  const [authError, setAuthError] = useState<string | null>(null)
  
  const handleAuthError = () => {
    // Clear all auth data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('organization')
    }
    // Redirect to login
    router.push('/login')
  }
  
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      setAuthError('No authentication token found')
      console.error('🔐 Authentication Error: No token found in localStorage')
    } else {
      // Check if token is expired (basic JWT check)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const now = Date.now() / 1000
        if (payload.exp && payload.exp < now) {
          setAuthError('Authentication token has expired')
          console.error('🔐 Authentication Error: Token expired at', new Date(payload.exp * 1000))
        } else {
          setAuthError(null)
          console.log('🔐 Authentication: Token is valid, expires at', new Date(payload.exp * 1000))
          
          // Check if token expires soon (within 5 minutes) and warn user
          const fiveMinutesFromNow = (Date.now() / 1000) + (5 * 60)
          if (payload.exp && payload.exp < fiveMinutesFromNow) {
            console.warn('🔐 Authentication Warning: Token expires soon at', new Date(payload.exp * 1000))
          }
        }
      } catch (err) {
        setAuthError('Invalid authentication token format')
        console.error('🔐 Authentication Error: Invalid token format', err)
      }
    }
  }, [])

  // URL parameter management
  const updateUrlParams = (newParams: Record<string, string | undefined>, clearFilters: boolean = false) => {
    const current = new URLSearchParams(searchParams.toString())
    
    // Clear all filter parameters if requested
    if (clearFilters) {
      const filterParams = [
        'sentiment', 'platform', 'timeRange', 'sortBy', 'sortOrder',
        'min_likesCount', 'min_sharesCount', 'min_commentsCount', 'min_viewsCount', 
        'max_likesCount', 'contentType', 'hasVideos', 'minFollowers', 'maxFollowers',
        'minPosts', 'isVerified', 'accountType', 'navItem'
      ]
      filterParams.forEach(param => current.delete(param))
    }
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === 'all' || value === '') {
        current.delete(key)
      } else {
        current.set(key, value)
      }
    })
    
    const newUrl = `${window.location.pathname}?${current.toString()}`
    router.push(newUrl, { scroll: false })
  }

  // Get current URL parameters
  const getUrlParam = (key: string, defaultValue: string = '') => {
    return searchParams.get(key) || defaultValue
  }

  // Check if a set of parameters matches current URL
  const isActive = (params: Record<string, string>) => {
    const paramKeys = Object.keys(params)
    const searchParamKeys = Array.from(searchParams.keys())

    if (paramKeys.length !== searchParamKeys.length) {
      return false
    }

    if (paramKeys.length === 0 && searchParamKeys.length === 0) {
      return true
    }

    return paramKeys.every(key => searchParams.get(key) === params[key])
  }

  // Create href for menu items
  const createHref = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString())
    for (const key in params) {
      newParams.set(key, params[key])
    }
    return `${window.location.pathname}?${newParams.toString()}`
  }

  // Initialize state from URL parameters
  const [selectedSentiment, setSelectedSentiment] = useState(() => getUrlParam('sentiment', 'all'))
  const [selectedPlatform, setSelectedPlatform] = useState(() => getUrlParam('platform', 'all'))
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<'social-feed' | 'profiles' | 'entities' | 'locations' | 'notifications'>(() => 
    (getUrlParam('tab', 'social-feed') as any) || 'social-feed'
  )
  const [selectedNavItem, setSelectedNavItem] = useState<string | null>(() => getUrlParam('navItem') || null)
  const [selectedLocation, setSelectedLocation] = useState<any>(null)

  // State for profile tabs
  const [profileTabs, setProfileTabs] = useState<Tab[]>([
    { id: 'profiles-grid', title: 'All Profiles' },
  ])
  const [activeProfileTabId, setActiveProfileTabId] = useState('profiles-grid')

  // State for entity tabs
  const [entityTabs, setEntityTabs] = useState<Tab[]>([
    { id: 'entities-grid', title: 'All Entities' },
  ])
  const [activeEntityTabId, setActiveEntityTabId] = useState('entities-grid')


  // Sync URL parameters with state
  useEffect(() => {
    const sentiment = getUrlParam('sentiment', 'all')
    const platform = getUrlParam('platform', 'all')
    const tab = getUrlParam('tab', 'social-feed')
    const navItem = getUrlParam('navItem') || null

    setSelectedSentiment(sentiment)
    setSelectedPlatform(platform)
    setActiveAnalysisTab(tab as any)
    setSelectedNavItem(navItem)
  }, [searchParams])

  // Click handler for opening profile tabs
  const handleProfileClick = (profile: any) => {
    const tabExists = profileTabs.find((tab) => tab.id === profile.id)
    if (!tabExists) {
      setProfileTabs((prevTabs) => [
        ...prevTabs,
        { id: profile.id, title: profile.displayName || profile.username, profileData: profile },
      ])
    }
    setActiveProfileTabId(profile.id)
  }

  // Close handler for profile tabs
  const handleTabClose = (tabId: string) => {
    const newTabs = profileTabs.filter((tab) => tab.id !== tabId)
    setProfileTabs(newTabs)
    if (activeProfileTabId === tabId) {
      setActiveProfileTabId(newTabs[newTabs.length - 1]?.id || 'profiles-grid')
    }
  }

  // Click handler for opening entity tabs
  const handleEntityClick = (entity: any) => {
    const tabExists = entityTabs.find((tab) => tab.id === entity.id)
    if (!tabExists) {
      setEntityTabs((prevTabs) => [
        ...prevTabs,
        { id: entity.id, title: entity.name, entityData: entity },
      ])
    }
    setActiveEntityTabId(entity.id)
  }

  // Close handler for entity tabs
  const handleEntityTabClose = (tabId: string) => {
    const newTabs = entityTabs.filter((tab) => tab.id !== tabId)
    setEntityTabs(newTabs)
    if (activeEntityTabId === tabId) {
      setActiveEntityTabId(newTabs[newTabs.length - 1]?.id || 'entities-grid')
    }
  }

  // Derive API parameters from URL
  const apiParams = useMemo(() => {
    const params: any = {
      campaignId: campaignId,
      page: 1,
      limit: 50,
    }

    // Add filters from URL parameters
    const sentiment = getUrlParam('sentiment')
    const platform = getUrlParam('platform')
    const timeRange = getUrlParam('timeRange')
    const sortBy = getUrlParam('sortBy')
    const sortOrder = getUrlParam('sortOrder')
    const minLikesCount = getUrlParam('min_likesCount')
    const minSharesCount = getUrlParam('min_sharesCount')
    const minCommentsCount = getUrlParam('min_commentsCount')
    const minViewsCount = getUrlParam('min_viewsCount')
    const maxLikesCount = getUrlParam('max_likesCount')
    const contentType = getUrlParam('contentType')
    const hasVideos = getUrlParam('hasVideos')

    if (sentiment && sentiment !== 'all') params.sentiment = sentiment
    if (platform && platform !== 'all') params.platform = platform
    if (timeRange) params.timeRange = timeRange
    if (sortBy) params.sortBy = sortBy
    if (sortOrder) params.sortOrder = sortOrder
    if (minLikesCount) params.minLikesCount = parseInt(minLikesCount)
    if (minSharesCount) params.minSharesCount = parseInt(minSharesCount)
    if (minCommentsCount) params.minCommentsCount = parseInt(minCommentsCount)
    if (minViewsCount) params.minViewsCount = parseInt(minViewsCount)
    if (maxLikesCount) params.maxLikesCount = parseInt(maxLikesCount)
    if (contentType) params.contentType = contentType
    if (hasVideos) params.hasVideos = hasVideos === 'true'

    return params
  }, [campaignId, searchParams])

  // Derive profile API parameters from URL
  const profileApiParams = useMemo(() => {
    const params: any = {
      campaignId: campaignId,
      page: 1,
      limit: 50,
    }

    const platform = getUrlParam('platform')
    const minFollowers = getUrlParam('minFollowers')
    const maxFollowers = getUrlParam('maxFollowers')
    const minPosts = getUrlParam('minPosts')
    const isVerified = getUrlParam('isVerified')
    const accountType = getUrlParam('accountType')

    if (platform && platform !== 'all') params.platform = platform
    if (minFollowers) params.minFollowers = parseInt(minFollowers)
    if (maxFollowers) params.maxFollowers = parseInt(maxFollowers)
    if (minPosts) params.minPosts = parseInt(minPosts)
    if (isVerified) params.isVerified = isVerified === 'true'
    if (accountType) params.accountType = accountType

    return params
  }, [campaignId, searchParams])

  // Fetch posts for the current campaign
  const {
    data: postsData,
    pagination,
    loading: postsLoading,
    error: postsError
  } = useSocialPosts(apiParams)

  // Fetch profiles for the current campaign
  const {
    data: profilesData,
    loading: profilesLoading,
    error: profilesError,
    total: profilesTotal
  } = useProfiles(profileApiParams)

  // Find the active profile for the detail view
  const activeProfile = useMemo(() =>
    profileTabs.find((tab) => tab.id === activeProfileTabId)?.profileData
  , [profileTabs, activeProfileTabId])

  // Find the active entity for the detail view
  const activeEntity = useMemo(() =>
    entityTabs.find((tab) => tab.id === activeEntityTabId)?.entityData
  , [entityTabs, activeEntityTabId])

  // Derive entity API parameters from URL
  const entityApiParams = useMemo(() => {
    const params: any = {
    campaignId: campaignId,
    limit: 50,
    }

    const type = getUrlParam('type')
    const category = getUrlParam('category')
    const sentiment = getUrlParam('sentiment')
    const minMentions = getUrlParam('minMentions')
    const timeRange = getUrlParam('timeRange')
    const sortBy = getUrlParam('sortBy')

    if (type && type !== 'all') params.type = type
    if (category && category !== 'all') params.category = category
    if (sentiment && sentiment !== 'all') params.sentiment = sentiment
    if (minMentions) params.minMentions = parseInt(minMentions)
    if (timeRange) params.timeRange = timeRange
    if (sortBy) params.sortBy = sortBy

    return params
  }, [campaignId, searchParams])

  // Fetch entities for the current campaign
  const {
    data: entitiesData,
    loading: entitiesLoading,
    error: entitiesError
  } = useEntityAnalytics(entityApiParams)

  // Derive location API parameters from URL
  const locationApiParams = useMemo(() => {
    const params: any = {
      campaignId: campaignId,
      limit: 50,
    }

    const location = getUrlParam('location')
    const sentiment = getUrlParam('sentiment')
    const minMentions = getUrlParam('minMentions')
    const timeRange = getUrlParam('timeRange')
    const platform = getUrlParam('platform')

    if (location && location !== 'all') params.location = location
    if (sentiment && sentiment !== 'all') params.sentiment = sentiment
    if (minMentions) params.minMentions = parseInt(minMentions)
    if (timeRange) params.timeRange = timeRange
    if (platform && platform !== 'all') params.platform = platform

    return params
  }, [campaignId, searchParams])

  // Fetch locations for the current campaign
  const {
    data: locationsData,
    loading: locationsLoading,
    error: locationsError
  } = useLocationAnalytics(locationApiParams)

  const [isMonitoring, setIsMonitoring] = useState(true)
  const [isTogglingMonitoring, setIsTogglingMonitoring] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [expandedTabs, setExpandedTabs] = useState<Set<string>>(new Set())
  const contentRef = useRef<HTMLDivElement>(null)

  // Find the current campaign from the campaigns list
  const currentCampaign = campaigns?.find(campaign => campaign.id === campaignId) || null
  
  // Initialize monitoring state based on campaign data
  const actualMonitoringStatus = currentCampaign?.monitoringStatus === 'ACTIVE'

  // Convert API posts to PostCard format
  const allPosts = postsData && Array.isArray(postsData) ? postsData.map(convertToPostCardFormat) : []
  
  // Debug logging
  console.log('🔍 Analysis History Debug:', {
    campaignId,
    campaigns,
    currentCampaign,
    postsData,
    postsLoading,
    postsError,
    allPosts: allPosts.length,
    apiParams,
    // Authentication debug
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : 'server-side',
    user: typeof window !== 'undefined' ? localStorage.getItem('user') : 'server-side'
  })

  // Convert API profiles to ProfileCard format
  const allProfiles = profilesData && Array.isArray(profilesData) ? profilesData.map(convertToProfileCardFormat) : []

  // Handle menu item selection with URL updates
  const handleMenuItemSelect = (item: any, tabId: string) => {
    // Special handling for "All Posts", "All Authors", "All Entities", and "All Locations" - clear all filters
    if (item.name === 'All Posts' || item.name === 'All Authors' || item.name === 'All Entities' || item.name === 'All Locations') {
      updateUrlParams({ tab: tabId, navItem: item.name }, true)
      return
    }

    // Start with base parameters
    const newParams: Record<string, string> = {
      tab: tabId,
      navItem: item.name
    }

    // Add item-specific parameters (these will replace existing filters)
    if (item.params) {
      Object.assign(newParams, item.params)
    }

    // Clear all filter parameters first, then set new ones
    const current = new URLSearchParams(searchParams.toString())
    
    // Remove all existing filter parameters
    const filterParams = [
      'sentiment', 'platform', 'timeRange', 'sortBy', 'sortOrder',
      'min_likesCount', 'min_sharesCount', 'min_commentsCount', 'min_viewsCount', 
      'max_likesCount', 'contentType', 'hasVideos', 'minFollowers', 'maxFollowers',
      'minPosts', 'isVerified', 'accountType'
    ]
    
    filterParams.forEach(param => current.delete(param))
    
    // Add new parameters
    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== undefined && value !== 'all' && value !== '') {
        current.set(key, value)
      }
    })
    
    const newUrl = `${window.location.pathname}?${current.toString()}`
    router.push(newUrl, { scroll: false })
  }

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    updateUrlParams({ tab: tabId })
  }

  // Handle entity click
  const handleEntityBack = () => {
    // TODO: implement entity selection state
    console.log('Entity back clicked')
  }

  // Handle location click
  const handleLocationClick = (location: any) => {
    setSelectedLocation(location)
  }

  // Handle location back
  const handleLocationBack = () => {
    setSelectedLocation(null)
  }

  const menuItems = [
    {
      id: 'social-feed',
      title: 'Social Feed',
      description: 'What is happening',
      icon: ChatBubbleLeftRightIcon,
      subItems: [
        {
          title: 'Discover',
          items: [
            { name: 'All Posts', icon: GlobeAltIcon, params: {} },
            { name: 'Latest Posts', icon: SparklesIcon, params: { timeRange: '24h', sortBy: 'postedAt', sortOrder: 'desc' } },
          ],
        },
        {
          title: 'Content & Engagement',
          items: [
            { name: 'High Impact', icon: FireIcon, params: { min_likesCount: '1000', min_sharesCount: '500' } },
            { name: 'Viral Negative', icon: ShieldExclamationIcon, params: { sentiment: 'NEGATIVE', min_sharesCount: '1000' } },
            { name: 'Trending Discussions', icon: ChatBubbleLeftRightIcon, params: { timeRange: '24h', sortBy: 'commentsCount' } },
            { name: 'High Engagement', icon: ChartBarIcon, params: { min_likesCount: '100', min_commentsCount: '50' } },
            { name: 'High Reach/Low Engage', icon: EyeIcon, params: { min_viewsCount: '10000', max_likesCount: '50' } },
            { name: 'Viral Potential', icon: ArrowTrendingUpIcon, params: { timeRange: '6h', sortBy: 'sharesCount' } },
          ],
        },
        {
          title: 'Browse by Platform',
          items: [
            { name: 'News', icon: NewspaperIcon, params: { contentType: 'news' } },
            { name: 'Videos', icon: VideoCameraIcon, params: { hasVideos: 'true' } },
            { name: 'Twitter', icon: FaTwitter, params: { platform: 'twitter' } },
            { name: 'Facebook', icon: FaFacebook, params: { platform: 'facebook' } },
            { name: 'Instagram', icon: FaInstagram, params: { platform: 'instagram' } },
            { name: 'YouTube', icon: FaYoutube, params: { platform: 'youtube' } },
          ],
        },
        {
          title: 'Monitor Sentiment',
          items: [
            { name: 'Positive Posts', icon: FaceSmileIcon, params: { sentiment: 'POSITIVE' } },
            { name: 'Neutral Posts', icon: MinusCircleIcon, params: { sentiment: 'NEUTRAL' } },
            { name: 'Negative Posts', icon: FaceFrownIcon, params: { sentiment: 'NEGATIVE' } },
          ],
        },
      ]
    },
    {
      id: 'profiles',
      title: 'Profiles',
      description: 'Who is talking',
      icon: UserGroupIcon,
      subItems: [
        {
          title: 'Primary',
          items: [{ name: 'All Authors', icon: UsersIcon, params: {} }],
        },
        {
          title: 'Engagement & Impact',
          items: [
            { name: 'High Impact Authors', icon: FireIcon, params: { minFollowers: '500000' } },
            { name: 'High Reach Authors', icon: EyeIcon, params: { minFollowers: '100000' } },
            { name: 'Frequent Posters', icon: ChatBubbleBottomCenterTextIcon, params: { minPosts: '1000' } },
          ],
        },
        {
          title: 'Sentiment Based',
          items: [
            { name: 'Negative Influencers', icon: FaceFrownIcon, params: { personStatus: 'SUSPICIOUS' } },
            { name: 'Positive Influencers', icon: HandThumbUpIcon, params: { personStatus: 'WHOLESOME' } },
          ],
        },
        {
          title: 'Platforms',
          items: [
            { name: 'Twitter Influencers', icon: FaTwitter, params: { platform: 'twitter' } },
            { name: 'Facebook Pages', icon: FaFacebook, params: { platform: 'facebook' } },
            { name: 'Instagram Influencers', icon: FaInstagram, params: { platform: 'instagram' } },
          ],
        },
      ]
    },
    {
      id: 'entities',
      title: 'Entities',
      description: 'What is being talked about',
      icon: CubeIcon,
      subItems: [
        {
          title: 'Primary',
          items: [
            { name: 'All Entities', icon: GlobeAltIcon, params: {} },
            { name: 'All Topics', icon: ChatBubbleLeftRightIcon, params: { type: 'TOPIC' } },
            { name: 'All People', icon: UserIcon, params: { type: 'PERSON' } },
            { name: 'All Organizations', icon: BuildingOfficeIcon, params: { type: 'ORGANIZATION' } },
          ],
        },
        {
          title: 'Engagement & Impact',
          items: [
            { name: 'High Impact Entities', icon: FireIcon, params: { minMentions: '100' } },
            { name: 'Trending Topics', icon: ArrowTrendingUpIcon, params: { type: 'TOPIC', timeRange: '24h' } },
            { name: 'Frequently Mentioned', icon: ChartBarIcon, params: { sortBy: 'totalMentions' } },
          ],
        },
        {
          title: 'Sentiment Based',
          items: [
            { name: 'Negative Entities', icon: FaceFrownIcon, params: { sentiment: 'NEGATIVE' } },
            { name: 'Positive Entities', icon: FaceSmileIcon, params: { sentiment: 'POSITIVE' } },
            { name: 'Controversial', icon: ExclamationTriangleIcon, params: { sentiment: 'MIXED' } },
          ],
        },
        {
          title: 'Entity Types',
          items: [
            { name: 'Topics', icon: ChatBubbleLeftRightIcon, params: { type: 'TOPIC' } },
            { name: 'People', icon: UserIcon, params: { type: 'PERSON' } },
            { name: 'Organizations', icon: BuildingOfficeIcon, params: { type: 'ORGANIZATION' } },
            { name: 'Locations', icon: MapPinIcon, params: { type: 'LOCATION' } },
            { name: 'Threats', icon: ShieldExclamationIcon, params: { type: 'THREAT' } },
            { name: 'Keywords', icon: MagnifyingGlassIcon, params: { type: 'KEYWORD' } },
          ],
        },
        {
          title: 'Categories',
          items: [
            { name: 'Political Parties', icon: FlagIcon, params: { category: 'POLITICAL_PARTY' } },
            { name: 'Politicians', icon: UserGroupIcon, params: { category: 'POLITICIAN' } },
            { name: 'News Outlets', icon: NewspaperIcon, params: { category: 'NEWS_OUTLET' } },
            { name: 'Government Agencies', icon: BuildingLibraryIcon, params: { category: 'GOVERNMENT_AGENCY' } },
          ],
        },
      ]
    },
    {
      id: 'locations',
      title: 'Locations',
      description: 'Where is the action happening',
      icon: MapPinIcon,
      subItems: [
        {
          title: 'Primary',
          items: [
            { name: 'All Locations', icon: GlobeAltIcon, params: {} },
          ],
        },
        {
          title: 'Engagement & Impact',
          items: [
            { name: 'High Impact Locations', icon: FireIcon, params: { minMentions: '100' } },
            { name: 'Trending Locations', icon: ArrowTrendingUpIcon, params: { timeRange: '24h' } },
            { name: 'Frequently Mentioned', icon: ChartBarIcon, params: { sortBy: 'totalMentions' } },
          ],
        },
        {
          title: 'Sentiment Based',
          items: [
            { name: 'Negative Locations', icon: FaceFrownIcon, params: { sentiment: 'NEGATIVE' } },
            { name: 'Positive Locations', icon: FaceSmileIcon, params: { sentiment: 'POSITIVE' } },
            { name: 'Controversial Locations', icon: ExclamationTriangleIcon, params: { sentiment: 'MIXED' } },
          ],
        },
      ]
    }
  ]

  const toggleTabExpansion = (tabId: string) => {
    const newExpanded = new Set(expandedTabs)
    if (newExpanded.has(tabId)) {
      newExpanded.delete(tabId)
    } else {
      newExpanded.add(tabId)
    }
    setExpandedTabs(newExpanded)
  }

  // Handle monitoring toggle
  const handleToggleMonitoring = async () => {
    if (!campaignId) return
    
    setIsTogglingMonitoring(true)
    try {
      if (isMonitoring) {
        await stopMonitoring(campaignId)
        setIsMonitoring(false)
      } else {
        await startMonitoring(campaignId, 5) // Default interval of 5 minutes
        setIsMonitoring(true)
      }
    } catch (error) {
      console.error('Monitoring toggle failed:', error)
      alert(error instanceof Error ? error.message : 'Failed to update monitoring status')
    } finally {
      setIsTogglingMonitoring(false)
    }
  }

  // Handle stop monitoring
  const handleStopMonitoring = async () => {
    if (!campaignId) return
    
    setIsTogglingMonitoring(true)
    try {
      await stopMonitoring(campaignId)
      setIsMonitoring(false)
    } catch (error) {
      console.error('Stop monitoring failed:', error)
      alert(error instanceof Error ? error.message : 'Failed to stop monitoring')
    } finally {
      setIsTogglingMonitoring(false)
    }
  }

  const handleExportPDF = async () => {
    if (!contentRef.current) return

    try {
      setIsExporting(true)

      // Create a new jsPDF instance
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      // Get the content element
      const content = contentRef.current

      // Convert HTML to canvas
      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#1a1a1a'
      })

      // Calculate dimensions
      const imgWidth = 210 // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      const pageHeight = 297 // A4 height in mm
      let heightLeft = imgHeight
      let position = 0

      // Convert canvas to image
      const imgData = canvas.toDataURL('image/png')

      // Add image to PDF (with pagination if needed)
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // Save the PDF
      const date = new Date().toISOString().split('T')[0]
      const campaignName = currentCampaign?.name.toLowerCase().replace(/\s+/g, '-') || 'campaign'
      pdf.save(`${campaignName}-${date}.pdf`)

    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">
        {/* Simplified Header */}
        <div className="border-b border-border bg-background px-4 sm:px-6 py-3 flex-shrink-0">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Back Button, Title and Live Status */}
            <div className="flex items-center gap-3">
              <Link href="/analysis-history">
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <ChevronRightIcon className="w-4 h-4 rotate-180" />
                </Button>
              </Link>
              <h1 className="text-lg font-bold text-foreground">
                {campaignsLoading ? (
                  <div className="h-5 w-32 bg-muted animate-pulse rounded"></div>
                ) : campaignsError ? (
                  'Campaign Error'
                ) : (
                  currentCampaign?.name || 'Campaign Not Found'
                )}
              </h1>
              {actualMonitoringStatus && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-md">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-1.5 h-1.5 bg-green-500 rounded-full animate-ping opacity-75"></div>
                    <div className="relative w-1 h-1 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-xs text-green-400 font-medium">Live</span>
                </div>
              )}
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 h-8 px-3"
                onClick={handleExportPDF}
                disabled={isExporting}
              >
                <Download className="w-3 h-3" />
                {isExporting ? 'Generating...' : 'Export'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`gap-1.5 h-8 px-3 transition-colors ${
                  isMonitoring
                    ? 'bg-cyan-900/20 border-cyan-800 text-cyan-400 hover:bg-cyan-900/30'
                    : 'bg-gray-900/20 border-gray-800 text-gray-400 hover:bg-gray-900/30'
                }`}
                onClick={handleToggleMonitoring}
                disabled={isTogglingMonitoring}
              >
                {isTogglingMonitoring ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    {isMonitoring ? 'Pausing...' : 'Starting...'}
                  </>
                ) : isMonitoring ? (
                  <>
                    <Square className="w-3 h-3" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3" />
                    Start
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 bg-red-900/20 border-red-800 text-red-400 hover:bg-red-900/30 h-8 px-3"
                onClick={handleStopMonitoring}
                disabled={isTogglingMonitoring}
              >
                {isTogglingMonitoring ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <Square className="w-3 h-3" />
                )}
                Stop
              </Button>
            </div>
          </div>
        </div>

        {/* Processing Banner */}
        {currentCampaign && currentCampaign.status === 'PROCESSING' && (
          <div className="bg-blue-500/10 border-b border-blue-500/20 px-6 py-3">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Campaign is Processing</p>
                <p className="text-xs text-muted-foreground">
                  Data collection in progress. Results will appear once processing is complete.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content - Full Screen Desktop Layout */}
        <div ref={contentRef} className="flex-1 flex overflow-hidden min-h-0">
          {/* Left Sidebar - Compact Vertical Tabs (Toolbar Style) */}
          <div className="w-16 border-r border-border bg-card/50 backdrop-blur-sm flex flex-col h-full shadow-sm">
            {/* Main Analysis Tabs */}
            <div className="p-2 space-y-2">
              {menuItems.map((item) => {
                const isActive = activeAnalysisTab === item.id
                const IconComponent = item.icon
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      handleTabChange(item.id)
                      if (item.subItems.length > 0) {
                        // Always expand the tab when clicked if it has sub-items
                        const newExpanded = new Set(expandedTabs)
                        newExpanded.add(item.id)
                        setExpandedTabs(newExpanded)
                      }
                    }}
                    className={`w-12 h-12 flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-200 group relative border ${
                      isActive
                        ? 'bg-muted/60 text-foreground shadow-sm border-border/40'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/60 border-transparent hover:border-border/50 hover:shadow-sm'
                    }`}
                    title={`${item.title} - ${item.description}`}
                  >
                    <IconComponent className="w-5 h-5" />
                    
                    {/* Tooltip */}
                    <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-background border border-border rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-lg">
                      <div className="font-semibold">{item.title}</div>
                      <div className="text-muted-foreground">{item.description}</div>
                    </div>
                  </button>
                )
              })}
            </div>
            
            {/* Divider */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-6 h-px bg-border/60"></div>
            </div>
            
            {/* Notifications at Bottom */}
            <div className="p-2">
              <button
                onClick={() => setActiveAnalysisTab('notifications')}
                className={`w-12 h-12 flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-200 group relative border ${
                  activeAnalysisTab === 'notifications'
                    ? 'bg-muted/60 text-foreground shadow-sm border-border/40'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/60 border-transparent hover:border-border/50 hover:shadow-sm'
                }`}
                title="Notifications - Manage alerts & settings"
              >
                <BellIcon className="w-5 h-5" />
                
                {/* Tooltip */}
                <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-background border border-border rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-lg">
                  <div className="font-semibold">Notifications</div>
                  <div className="text-muted-foreground">Manage alerts & settings</div>
                </div>
              </button>
            </div>
          </div>

          {/* Sub-Sidebar - Shows when a tab with sub-items is expanded */}
          {expandedTabs.size > 0 && (() => {
            const activeMenuItem = menuItems.find(item => expandedTabs.has(item.id) && item.id === activeAnalysisTab)
            if (!activeMenuItem || activeMenuItem.subItems.length === 0) return null
            
            return (
              <div className="w-56 border-r border-border bg-background flex flex-col h-full">
                <div className="p-3 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-foreground">
                      {activeMenuItem.description}
                    </h3>
                    <button
                      onClick={() => toggleTabExpansion(activeMenuItem.id)}
                      className="p-1 hover:bg-accent rounded-md transition-colors"
                      title="Hide sidebar"
                    >
                      <ChevronRightIcon className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-4">
                  {activeMenuItem.subItems.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="space-y-2">
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide border-b border-border/30 pb-1">
                        {category.title}
                      </h4>
                      <div className="space-y-0.5">
                        {category.items.map((subItem, subIndex) => {
                          const SubIcon = subItem.icon
                          const active = isActive(subItem.params || {})
                          return (
                            <button
                              key={subIndex}
                              className={`w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded-md transition-colors border ${
                                active 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50 border-transparent hover:border-border/50'
                              }`}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMenuItemSelect(subItem, activeMenuItem.id)
                              }}
                            >
                              <SubIcon className={`w-3 h-3 flex-shrink-0 ${active ? 'text-primary-foreground' : 'text-gray-400'}`} />
                              <span className="text-left truncate">{subItem.name}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}

          {/* Main Feed Area */}
          <div className="flex-1 flex flex-col overflow-hidden min-h-0">
            <div className="flex-1 flex flex-col overflow-hidden p-6 min-h-0">
              {activeAnalysisTab === 'social-feed' && (
                authError ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center text-muted-foreground">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      <p className="text-lg font-semibold text-red-600 mb-2">Authentication Error</p>
                      <p className="text-sm text-red-500 mb-4">{authError}</p>
                      <div className="space-y-2">
                        <button 
                          onClick={() => window.location.reload()} 
                          className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                        >
                          Refresh Page
                        </button>
                        <button 
                          onClick={handleAuthError} 
                          className="px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors ml-2"
                        >
                          Clear Auth & Login
                        </button>
                      </div>
                    </div>
                  </div>
                ) : selectedNavItem ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-foreground">{selectedNavItem}</h2>
                        <button
                          onClick={() => {
                            updateUrlParams({ navItem: undefined })
                          }}
                          className="text-sm text-primary hover:text-primary/80 transition-colors mt-1"
                        >
                          ← Back to All Posts
                        </button>
                      </div>
                    </div>
                    <AISummaryCard
                      campaign={currentCampaign}
                      posts={allPosts}
                      loading={postsLoading}
                    />
                    <PostList
                      posts={allPosts}
                      campaignId={campaignId}
                      defaultView="grid"
                    />
                  </div>
                ) : postsLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center text-muted-foreground">
                      <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-sm">Loading posts...</p>
                    </div>
                  </div>
                ) : postsError ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center text-muted-foreground">
                      <p className="text-sm text-red-500 mb-2">Failed to load posts</p>
                      <p className="text-xs">{postsError}</p>
                      {postsError.includes('Authentication') || postsError.includes('401') ? (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-700 font-medium">Authentication Issue Detected</p>
                          <p className="text-xs text-red-600 mt-1">
                            Your session may have expired. Please try refreshing the page or logging in again.
                          </p>
                          <button 
                            onClick={() => window.location.reload()} 
                            className="mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                          >
                            Refresh Page
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : allPosts.length === 0 ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center text-muted-foreground">
                      <p className="text-sm mb-2">No posts found for this campaign</p>
                      <p className="text-xs">Try adjusting your filters or check if the campaign has any associated posts.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 min-h-0 flex flex-col">
                    <AISummaryCard
                      campaign={currentCampaign}
                      posts={allPosts}
                      loading={postsLoading}
                    />
                    <div className="flex-1 min-h-0">
                      <PostRows
                        posts={allPosts}
                        campaignId={campaignId}
                      />
                    </div>
                  </div>
                )
              )}

              {activeAnalysisTab === 'profiles' && (
                <div className="h-full flex flex-col">
                  <TabBar
                    tabs={profileTabs}
                    activeTabId={activeProfileTabId}
                    onTabClick={setActiveProfileTabId}
                    onTabClose={handleTabClose}
                  />
                  <div className="flex-1 overflow-y-auto">
                    {activeProfileTabId === 'profiles-grid' ? (
                <div className="p-4 sm:p-6">
                        {selectedNavItem ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-foreground">{selectedNavItem}</h2>
                        <button
                                  onClick={() => updateUrlParams({ navItem: undefined })}
                          className="text-sm text-primary hover:text-primary/80 transition-colors mt-1"
                        >
                          ← Back to All Profiles
                        </button>
                      </div>
                    </div>
                    {profilesLoading ? (
                      <div className="flex items-center justify-center h-64">
                                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
                      </div>
                    ) : profilesError ? (
                              <p className="text-red-500">{profilesError}</p>
                            ) : (
                              <ProfileList
                                profiles={allProfiles}
                                campaignId={campaignId}
                                defaultView="grid"
                                onProfileClick={handleProfileClick}
                              />
                            )}
                          </div>
                        ) : profilesLoading ? (
                      <div className="flex items-center justify-center h-64">
                            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
                        </div>
                        ) : profilesError ? (
                          <p className="text-red-500">{profilesError}</p>
                    ) : (
                      <ProfileList
                        profiles={allProfiles}
                        campaignId={campaignId}
                        defaultView="grid"
                            onProfileClick={handleProfileClick}
                      />
                        )}
                      </div>
                    ) : (
                      activeProfile && <ProfileDetailView profile={activeProfile} onClose={() => handleTabClose(activeProfileTabId)} />
                    )}
                  </div>
                </div>
              )}

              {activeAnalysisTab === 'entities' && (
                <div className="h-full flex flex-col">
                   <TabBar
                    tabs={entityTabs}
                    activeTabId={activeEntityTabId}
                    onTabClick={setActiveEntityTabId}
                    onTabClose={handleEntityTabClose}
                  />
                  <div className="flex-1 overflow-y-auto">
                    {activeEntityTabId === 'entities-grid' ? (
                      <div className="p-4 sm:p-6">
                        {entitiesLoading ? (
                           <div className="flex items-center justify-center h-64">
                            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
                          </div>
                        ) : entitiesError ? (
                          <p className="text-red-500">{entitiesError}</p>
                        ) : entitiesData && Array.isArray(entitiesData) && entitiesData.length > 0 ? (
                          <EntityList
                            entities={entitiesData}
                            onEntityClick={handleEntityClick}
                            defaultView="grid"
                          />
                        ) : (
                           <div className="flex items-center justify-center h-64">
                      <div className="text-center text-muted-foreground">
                        <CubeIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                              <p className="text-sm">No entities found</p>
                              <p className="text-xs">Try adjusting your filters</p>
                      </div>
                    </div>
                        )}
                      </div>
                    ) : (
                      activeEntity && (
                        <EntityDetailView
                          entity={activeEntity}
                          onBack={() => handleEntityTabClose(activeEntityTabId)}
                        />
                      )
                    )}
                  </div>
                </div>
              )}

              {activeAnalysisTab === 'locations' && !selectedLocation && (
                <div className="p-4 sm:p-6">
                  {locationsLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center text-muted-foreground">
                        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-sm">Loading locations...</p>
                      </div>
                    </div>
                  ) : locationsError ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center text-muted-foreground">
                        <p className="text-sm text-red-500 mb-2">Failed to load locations</p>
                        <p className="text-xs">{locationsError}</p>
                      </div>
                    </div>
                  ) : locationsData && Array.isArray(locationsData) && locationsData.length > 0 ? (
                    <LocationList
                      locations={locationsData}
                      onLocationClick={handleLocationClick}
                      defaultView="grid"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center text-muted-foreground">
                        <MapPinIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-sm">No locations found</p>
                        <p className="text-xs">Try adjusting your filters or search for specific locations</p>
                      </div>
                    </div>
                  )}
                  </div>
              )}

              {activeAnalysisTab === 'locations' && selectedLocation && (
                <div className="h-full">
                  <LocationDetailView 
                    location={selectedLocation} 
                    onBack={handleLocationBack}
                  />
                </div>
              )}

              {activeAnalysisTab === 'notifications' && (
                <div className="max-w-4xl mx-auto">
                  <CampaignNotificationSettings
                    campaignId={campaignId}
                    campaignName={currentCampaign?.name || 'Campaign'}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Live Analytics */}
          <div className="w-80 border-l border-border bg-background flex flex-col h-full min-h-0">
            <div className="p-4 border-b border-border flex-shrink-0">
              <h3 className="text-sm font-semibold text-foreground mb-3">Live Analytics</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 min-h-0">
              <TrendsWidget
                campaignId={campaignId}
                timeRange="24h"
                granularity="hour"
              />
            </div>
          </div>
        </div>
    </div>
  )
}

export default function CampaignDetailPageWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <CampaignDetailPage />
    </ErrorBoundary>
  )
}