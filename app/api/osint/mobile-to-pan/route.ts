import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mobile_number, org, firNo } = body

    // Validate required fields
    if (!mobile_number) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: mobile_number' },
        { status: 400 }
      )
    }

    // Validate mobile number format
    if (!/^\d{10}$/.test(mobile_number)) {
      return NextResponse.json(
        { success: false, error: 'Invalid mobile number format. Must be 10 digits.' },
        { status: 400 }
      )
    }

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 1000))

    // Mock mobile to PAN response
    const responseData = {
      panNumber: 'ABCDE1234F',
      name: 'John Doe',
      dateOfBirth: '1990-01-01',
      verified: Math.random() > 0.2,
      lastUpdated: new Date().toISOString(),
      source: 'Income Tax Database',
      confidence: Math.floor(Math.random() * 15) + 85 // 85-100%
    }

    return NextResponse.json({
      success: true,
      data: responseData,
      metadata: {
        searchId: `mtp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        org,
        firNo
      }
    })

  } catch (error) {
    console.error('Mobile to PAN search error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
