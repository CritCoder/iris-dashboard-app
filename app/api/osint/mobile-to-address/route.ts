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
    await new Promise(resolve => setTimeout(resolve, 1800 + Math.random() * 1200))

    // Mock mobile to address response
    const responseData = {
      address: '123 Main Street, Mumbai, Maharashtra 400001',
      verified: Math.random() > 0.3,
      lastUpdated: new Date().toISOString(),
      source: 'Aadhaar Database',
      confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
      coordinates: {
        lat: 19.0760 + (Math.random() - 0.5) * 0.1,
        lng: 72.8777 + (Math.random() - 0.5) * 0.1
      }
    }

    return NextResponse.json({
      success: true,
      data: responseData,
      metadata: {
        searchId: `mta_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        org,
        firNo
      }
    })

  } catch (error) {
    console.error('Mobile to address search error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
