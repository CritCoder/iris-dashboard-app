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
    await new Promise(resolve => setTimeout(resolve, 2200 + Math.random() * 800))

    // Mock mobile to vehicle response
    const responseData = {
      vehicles: ['KA01AB1234', 'MH02CD5678'],
      ownerName: 'John Doe',
      registrationDate: '2020-01-15',
      verified: Math.random() > 0.3,
      lastUpdated: new Date().toISOString(),
      source: 'RTO Database',
      confidence: Math.floor(Math.random() * 20) + 80 // 80-100%
    }

    return NextResponse.json({
      success: true,
      data: responseData,
      metadata: {
        searchId: `mtv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        org,
        firNo
      }
    })

  } catch (error) {
    console.error('Mobile to vehicle search error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
