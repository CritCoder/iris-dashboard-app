import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://irisnet.wiredleap.com'

export async function GET(request: NextRequest) {
  try {
    // Get authorization header from request
    const authHeader = request.headers.get('authorization')

    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'No authorization token provided' },
        { status: 401 }
      )
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '7d'
    const cached = searchParams.get('cached') || 'true'

    // Try to fetch from backend API, but return mock data if it fails
    try {
      const response = await fetch(
        `${API_BASE_URL}/political-dashboard/campaign-themes?timeRange=${timeRange}&cached=${cached}`,
        {
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        return NextResponse.json(data)
      }
    } catch (backendError) {
      console.log('Backend API not available, using mock data')
    }

    // Return mock data if backend is not available
    const mockData = {
      success: true,
      data: [
        {
          campaignName: 'Public Safety Initiative',
          metrics: { totalPosts: 2847, change: '+15%' },
          sentiment: 'positive'
        },
        {
          campaignName: 'Infrastructure Development',
          metrics: { totalPosts: 1923, change: '+8%' },
          sentiment: 'positive'
        },
        {
          campaignName: 'Education Reform',
          metrics: { totalPosts: 1654, change: '-3%' },
          sentiment: 'neutral'
        },
        {
          campaignName: 'Healthcare Access',
          metrics: { totalPosts: 1247, change: '+22%' },
          sentiment: 'positive'
        }
      ]
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error('Campaign themes API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

