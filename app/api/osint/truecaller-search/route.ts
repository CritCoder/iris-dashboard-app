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
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500))

    // Mock TrueCaller response
    const responseData = {
      name: 'John Doe',
      location: 'Mumbai, Maharashtra',
      carrier: 'Airtel',
      spamScore: Math.floor(Math.random() * 10),
      verified: Math.random() > 0.3,
      lastSeen: new Date().toISOString(),
      profilePicture: null,
      socialMedia: {
        facebook: Math.random() > 0.5 ? 'facebook.com/johndoe' : null,
        instagram: Math.random() > 0.6 ? 'instagram.com/johndoe' : null
      }
    }

    return NextResponse.json({
      success: true,
      data: responseData,
      metadata: {
        searchId: `tc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        org,
        firNo
      }
    })

  } catch (error) {
    console.error('TrueCaller search error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
