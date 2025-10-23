import {
  Home, Mail, Play, BarChart3, Globe, Users, Hash, MapPin, Building2,
  Search, TrendingUp, TrendingDown, Eye, MessageSquare, ThumbsDown, ThumbsUp,
  Twitter, Facebook, Instagram
} from 'lucide-react'

export interface NavItem {
  id: string
  label: string
  icon: any
  href: string
  description?: string
  submenu?: SubMenuItem[]
}

export interface SubMenuItem {
  id: string
  label: string
  icon: any
  href: string
}

export interface NavSection {
  id: string
  label: string
  items: NavItem[]
}

export const navConfig: NavSection[] = [
  {
    id: 'main',
    label: 'Main',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: Home,
        href: '/',
        description: 'Overview & insights'
      },
      {
        id: 'start-analysis',
        label: 'Start Analysis',
        icon: Play,
        href: '/start-analysis',
        description: 'Begin new campaign analysis'
      },
      {
        id: 'analysis-history',
        label: 'Analysis History',
        icon: BarChart3,
        href: '/analysis-history',
        description: 'View past analyses'
      }
    ]
  },
  {
    id: 'explore',
    label: 'Explore',
    items: [
      {
        id: 'social-feed',
        label: 'Social Feed',
        icon: Globe,
        href: '/social-feed',
        description: 'What\'s happening (feed)'
      },
      {
        id: 'profiles',
        label: 'Profiles',
        icon: Users,
        href: '/profiles',
        description: 'Who is talking'
      },
      {
        id: 'entities',
        label: 'Entities',
        icon: Hash,
        href: '/entities',
        description: 'What is being talked about',
        submenu: [
          { id: 'all-entities', label: 'All Entities', icon: Hash, href: '/entities' },
          { id: 'trending-entities', label: 'Trending', icon: TrendingUp, href: '/entities?filter=trending' },
          { id: 'positive-entities', label: 'Positive', icon: ThumbsUp, href: '/entities?sentiment=positive' },
          { id: 'negative-entities', label: 'Negative', icon: ThumbsDown, href: '/entities?sentiment=negative' }
        ]
      },
      {
        id: 'locations',
        label: 'Locations',
        icon: MapPin,
        href: '/locations',
        description: 'Where things are happening',
        submenu: [
          { id: 'all-locations', label: 'All Locations', icon: MapPin, href: '/locations' },
          { id: 'high-activity-locations', label: 'High Activity', icon: TrendingUp, href: '/locations?activity=high' },
          { id: 'medium-activity-locations', label: 'Medium Activity', icon: BarChart3, href: '/locations?activity=medium' },
          { id: 'low-activity-locations', label: 'Low Activity', icon: TrendingDown, href: '/locations?activity=low' }
        ]
      },
      {
        id: 'groups',
        label: 'Groups',
        icon: Building2,
        href: '/groups',
        description: 'Social groups and communities'
      }
    ]
  },
  {
    id: 'tools',
    label: 'Tools',
    items: [
      {
        id: 'entity-search',
        label: 'Entity Search',
        icon: Search,
        href: '/entity-search',
        description: 'Search all entities'
      },
      {
        id: 'social-inbox',
        label: 'Social Inbox',
        icon: Mail,
        href: '/social-inbox',
        description: 'Messages & interactions'
      }
    ]
  }
]

