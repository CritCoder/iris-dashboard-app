import { NextRequest, NextResponse } from 'next/server'
import groupsData from '@/public/groups-data.json'

interface GroupData {
  id: string
  name: string
  type: 'religious' | 'political' | 'social' | 'professional' | 'cultural' | 'other'
  members: number
  platforms: string[]
  primaryPlatform: string
  description?: string
  riskLevel: 'high' | 'medium' | 'low'
  category: string
  location?: string
  contactInfo?: {
    phone?: string
    email?: string
  }
  socialMedia?: {
    facebook?: string
    twitter?: string
    instagram?: string
    youtube?: string
  }
  influencers?: string
  createdAt: string
  updatedAt: string
  status: 'active' | 'inactive' | 'monitored'
  monitoringEnabled: boolean
  sheet: string
  isFacebookOnly?: boolean
}

// Load all groups from the pre-processed JSON file
function loadAllGroups(): GroupData[] {
  try {
    // The groups are already processed and ready in the JSON file
    return groupsData.groups as GroupData[]
  } catch (error) {
    console.error('Error loading groups data:', error)
    return []
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search')
    const type = searchParams.get('type')
    const riskLevel = searchParams.get('riskLevel')
    const monitoringEnabled = searchParams.get('monitoringEnabled')
    const platform = searchParams.get('platform')
    const sheet = searchParams.get('sheet')

    // Load all groups from the pre-processed data
    let allGroups = loadAllGroups()

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase()
      allGroups = allGroups.filter(group =>
        group.name.toLowerCase().includes(searchLower) ||
        group.description?.toLowerCase().includes(searchLower) ||
        group.category.toLowerCase().includes(searchLower) ||
        group.location?.toLowerCase().includes(searchLower)
      )
    }

    if (type) {
      allGroups = allGroups.filter(group => group.type === type)
    }

    if (riskLevel) {
      allGroups = allGroups.filter(group => group.riskLevel === riskLevel)
    }

    if (monitoringEnabled !== null && monitoringEnabled !== undefined) {
      const enabled = monitoringEnabled === 'true'
      allGroups = allGroups.filter(group => group.monitoringEnabled === enabled)
    }

    if (platform) {
      allGroups = allGroups.filter(group => group.platforms.includes(platform))
    }

    if (sheet) {
      allGroups = allGroups.filter(group => group.sheet === sheet)
    }

    // Calculate pagination
    const totalGroups = allGroups.length
    const totalPages = Math.ceil(totalGroups / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    // Get paginated groups
    const paginatedGroups = allGroups.slice(startIndex, endIndex)

    // Calculate statistics
    const stats = {
      total: totalGroups,
      byType: {} as Record<string, number>,
      byRiskLevel: {} as Record<string, number>,
      byPlatform: {} as Record<string, number>,
      bySheet: {} as Record<string, number>,
      monitored: 0
    }

    allGroups.forEach(group => {
      // Count by type
      stats.byType[group.type] = (stats.byType[group.type] || 0) + 1

      // Count by risk level
      stats.byRiskLevel[group.riskLevel] = (stats.byRiskLevel[group.riskLevel] || 0) + 1

      // Count by platform
      group.platforms.forEach(platform => {
        stats.byPlatform[platform] = (stats.byPlatform[platform] || 0) + 1
      })

      // Count by sheet
      stats.bySheet[group.sheet] = (stats.bySheet[group.sheet] || 0) + 1

      // Count monitored
      if (group.monitoringEnabled) {
        stats.monitored++
      }
    })

    return NextResponse.json({
      groups: paginatedGroups,
      pagination: {
        page,
        limit,
        totalPages,
        totalGroups
      },
      stats
    })
  } catch (error) {
    console.error('Error fetching groups:', error)
    return NextResponse.json(
      { error: 'Failed to fetch groups' },
      { status: 500 }
    )
  }
}

// Handle PUT request to update a group
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Group ID is required' },
        { status: 400 }
      )
    }

    // In a real application, this would update the database
    // For now, we'll just return the updated data
    const updatedGroup = {
      id,
      ...updateData,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({ group: updatedGroup })
  } catch (error) {
    console.error('Error updating group:', error)
    return NextResponse.json(
      { error: 'Failed to update group' },
      { status: 500 }
    )
  }
}