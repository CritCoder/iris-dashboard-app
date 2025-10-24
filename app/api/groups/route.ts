import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://irisnet.wiredleap.com'
const API_BASE_URL = `${BASE_URL}/api`

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Get auth token from cookies
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth_token')?.value

    // Forward all query parameters to the backend
    const backendUrl = `${API_BASE_URL}/groups?${searchParams.toString()}`

    // Make request to backend API
    const response = await fetch(backendUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { 'Cookie': `auth_token=${authToken}` }),
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Failed to fetch groups from backend'
      }))
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch groups' },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Transform backend response to match frontend expectations
    if (data.success && data.data) {
      // Backend returns: { success: true, data: { data: [...], pagination: {...} } }
      const groups = Array.isArray(data.data.data) ? data.data.data :
                     Array.isArray(data.data) ? data.data : []

      const pagination = data.data.pagination || {
        total: data.data.pagination?.total || groups.length,
        page: data.data.pagination?.page || parseInt(searchParams.get('page') || '1'),
        limit: data.data.pagination?.limit || parseInt(searchParams.get('limit') || '50'),
        totalPages: data.data.pagination?.totalPages || 1
      }

      // Map backend group data to frontend format
      const mappedGroups = groups.map((group: any) => ({
        id: group.id,
        name: group.name,
        type: 'other',
        members: 0,
        platforms: [
          group.facebookUri && 'facebook',
          group.twitterUri && 'twitter',
          group.instagramUri && 'instagram',
          group.youtubeUri && 'youtube'
        ].filter(Boolean),
        primaryPlatform: group.facebookUri ? 'facebook' : 'Multiple',
        description: '',
        riskLevel: 'low' as const,
        category: group.supergroup || group.superGroup?.name || '',
        location: '',
        contactInfo: {
          phone: group.linkedPhoneNumber,
          email: group.linkedEmailId
        },
        socialMedia: {
          facebook: group.facebookUri,
          twitter: group.twitterUri,
          instagram: group.instagramUri,
          youtube: group.youtubeUri
        },
        influencers: '',
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
        status: 'active' as const,
        monitoringEnabled: false,
        sheet: group.supergroup || group.superGroup?.name || '',
        isFacebookOnly: !!(group.facebookUri && !group.twitterUri && !group.instagramUri && !group.youtubeUri)
      }))

      return NextResponse.json({
        groups: mappedGroups,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          totalPages: pagination.totalPages || Math.ceil(pagination.total / pagination.limit),
          totalGroups: pagination.total || mappedGroups.length
        },
        stats: {
          total: mappedGroups.length,
          byType: {},
          byRiskLevel: {},
          byPlatform: {},
          bySheet: {},
          monitored: 0
        }
      })
    }

    // Fallback: return empty groups if structure doesn't match
    return NextResponse.json({
      groups: [],
      pagination: {
        page: 1,
        limit: 50,
        totalPages: 0,
        totalGroups: 0
      },
      stats: {
        total: 0,
        byType: {},
        byRiskLevel: {},
        byPlatform: {},
        bySheet: {},
        monitored: 0
      }
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