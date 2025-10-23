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
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000))

    // Mock RC details response
    const responseData = {
      rcNumber: rc_number,
      ownerName: 'John Doe',
      vehicleMake: 'Maruti Suzuki',
      vehicleModel: 'Swift',
      registrationDate: '2020-01-15',
      engineNumber: 'ENG123456',
      chassisNumber: 'CHS123456',
      fuelType: 'Petrol',
      vehicleClass: 'LMV',
      registrationAuthority: 'RTO Mumbai',
      verified: Math.random() > 0.3,
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: responseData,
      metadata: {
        searchId: `rc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        org,
        firNo
      }
    })

  } catch (error) {
    console.error('RC details search error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
