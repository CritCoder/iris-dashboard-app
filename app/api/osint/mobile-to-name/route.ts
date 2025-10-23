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
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000))

    // Mock mobile to name response
    const responseData = {
      name: 'John Doe',
      address: '123 Main St, Mumbai, Maharashtra 400001',
      verified: Math.random() > 0.2,
      lastUpdated: new Date().toISOString(),
      source: 'Aadhaar Database',
      confidence: Math.floor(Math.random() * 40) + 60 // 60-100%
    }

    return NextResponse.json({
      success: true,
      data: responseData,
      metadata: {
        searchId: `mtn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        org,
        firNo
      }
    })

  } catch (error) {
    console.error('Mobile to name search error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
