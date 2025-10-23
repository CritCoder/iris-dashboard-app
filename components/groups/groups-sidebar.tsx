'use client'

import { useState } from 'react'
import { Search, Filter, Users, Building2, Shield, AlertTriangle, Eye, EyeOff, MapPin, Globe, MessageSquare, TrendingUp, BarChart3 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface GroupsSidebarProps {
  onFilterChange: (filter: string) => void
  activeFilter: string
  onViewTypeChange: (viewType: 'all' | 'monitored' | 'suspicious') => void
  viewType: 'all' | 'monitored' | 'suspicious'
}

const filterCategories = [
  {
    title: 'View Type',
    items: [
      { id: 'all', name: 'All Groups', icon: Building2, count: 645 },
      { id: 'monitored', name: 'Monitored', icon: Eye, count: 18 },
      { id: 'suspicious', name: 'Suspicious', icon: AlertTriangle, count: 44 },
    ],
  },
  {
    title: 'Group Type',
    items: [
      { id: 'religious', name: 'Religious', icon: Building2, count: 153 },
      { id: 'political', name: 'Political', icon: Users, count: 10 },
      { id: 'social', name: 'Social', icon: MessageSquare, count: 27 },
      { id: 'professional', name: 'Professional', icon: Building2, count: 99 },
      { id: 'cultural', name: 'Cultural', icon: Globe, count: 120 },
      { id: 'other', name: 'Other', icon: Globe, count: 236 },
    ],
  },
  {
    title: 'Risk Level',
    items: [
      { id: 'high-risk', name: 'High Risk', icon: AlertTriangle, count: 18, color: 'text-red-600' },
      { id: 'medium-risk', name: 'Medium Risk', icon: Shield, count: 26, color: 'text-orange-600' },
      { id: 'low-risk', name: 'Low Risk', icon: Shield, count: 601, color: 'text-green-600' },
    ],
  },
  {
    title: 'Category',
    items: [
      { id: 'hindu-orgs', name: 'Hindu Organizations', icon: Building2, count: 31 },
      { id: 'political-groups', name: 'Political Groups', icon: Users, count: 3 },
      { id: 'youth-orgs', name: 'Youth Organizations', icon: TrendingUp, count: 5 },
      { id: 'militant-groups', name: 'Militant Groups', icon: AlertTriangle, count: 1 },
      { id: 'other-groups', name: 'Other Groups', icon: Globe, count: 60 },
    ],
  },
  {
    title: 'Platform',
    items: [
      { id: 'facebook', name: 'Facebook', icon: Globe, count: 608 },
      { id: 'instagram', name: 'Instagram', icon: Globe, count: 94 },
      { id: 'twitter', name: 'Twitter', icon: Globe, count: 119 },
      { id: 'youtube', name: 'YouTube', icon: Globe, count: 14 },
    ],
  },
  {
    title: 'Sheets',
    items: [
      { id: 'right-hindu-groups', name: 'Right Hindu Groups', icon: Building2, count: 100 },
      { id: 'right-hindu-persons', name: 'Right Hindu Persons', icon: Users, count: 38 },
      { id: 'right-wing-muslim-groups', name: 'Right Wing Muslim Groups', icon: Building2, count: 10 },
      { id: 'human-rights', name: 'Human Rights', icon: Shield, count: 18 },
      { id: 'all-farmers-org-karnataka', name: 'ALL Farmers ORG Karnataka', icon: Building2, count: 87 },
      { id: 'trade-unions', name: 'Trade Unions', icon: Users, count: 12 },
      { id: 'rrp', name: 'RRP', icon: Building2, count: 53 },
      { id: 'students-org', name: 'Students ORG', icon: Users, count: 6 },
      { id: 'christians-activist', name: 'Christians Activist', icon: Users, count: 4 },
      { id: 'kannadda', name: 'Kannadda', icon: Building2, count: 120 },
      { id: 'woman', name: 'Woman', icon: Users, count: 1 },
      { id: 'mixed', name: 'Mixed', icon: Globe, count: 160 },
      { id: 'mixed-2', name: 'Mixed 2', icon: Globe, count: 31 },
      { id: 'political', name: 'Political', icon: Building2, count: 5 },
    ],
  },
  {
    title: 'Location',
    items: [
      { id: 'bengaluru', name: 'Bengaluru', icon: MapPin, count: 5 },
      { id: 'mangalore', name: 'Mangalore', icon: MapPin, count: 3 },
      { id: 'vijay-nagar', name: 'Vijay Nagar', icon: MapPin, count: 3 },
      { id: 'bangalore', name: 'Bangalore', icon: MapPin, count: 2 },
    ],
  },
]

export function GroupsSidebar({ onFilterChange, activeFilter, onViewTypeChange, viewType }: GroupsSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleFilterClick = (filterId: string) => {
    onFilterChange(filterId)
  }

  const handleViewTypeClick = (viewTypeId: string) => {
    onViewTypeChange(viewTypeId as 'all' | 'monitored' | 'suspicious')
  }

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">Groups Monitoring</h2>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {filterCategories.map((category) => (
          <div key={category.title}>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
              {category.title}
            </h3>
            <div className="space-y-1">
              {category.items.map((item) => {
                const isActive = activeFilter === item.id
                const Icon = item.icon
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (category.title === 'View Type') {
                        handleViewTypeClick(item.id)
                      } else {
                        handleFilterClick(item.id)
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                      <span className="truncate">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {'color' in item && item.color && (
                        <div className={`w-2 h-2 rounded-full ${item.color.replace('text-', 'bg-')}`} />
                      )}
                      <Badge 
                        variant={isActive ? 'secondary' : 'outline'} 
                        className="text-xs"
                      >
                        {item.count}
                      </Badge>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="p-4 border-t border-border">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Groups</span>
              <span className="font-medium">645</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">High Risk</span>
              <span className="font-medium text-red-600">18</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Monitored</span>
              <span className="font-medium text-blue-600">18</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Members</span>
              <span className="font-medium">1.4M</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
