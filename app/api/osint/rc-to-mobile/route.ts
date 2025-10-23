import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { rc_number, org, firNo } = body

    // Validate required fields
    if (!rc_number) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: rc_number' },
        { status: 400 }
      )
    }

    // Validate vehicle number format
    if (!/^[A-Z]{2}[\s-]?\d{2}[\s-]?[A-Z]{1,2}[\s-]?\d{4}$/i.test(rc_number)) {
      return NextResponse.json(
        { success: false, error: 'Invalid vehicle number format' },
        { status: 400 }
      )
    }

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1800 + Math.random() * 1200))

    // Mock RC to mobile response
    const responseData = {
      mobileNumbers: ['9876543210', '8765432109'],
      ownerName: 'John Doe',
      verified: Math.random() > 0.4,
      lastUpdated: new Date().toISOString(),
      source: 'RTO Database',
      confidence: Math.floor(Math.random() * 20) + 80 // 80-100%
    }

    return NextResponse.json({
      success: true,
      data: responseData,
      metadata: {
        searchId: `rtm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        org,
        firNo
      }
    })

  } catch (error) {
    console.error('RC to mobile search error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
