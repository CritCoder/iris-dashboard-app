import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { q, limit } = body

    // Validate required fields
    if (!q) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: q' },
        { status: 400 }
      )
    }

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 1800))

    // Mock entity search response
    const responseData = [
      { 
        name: q, 
        type: 'person', 
        relevance: 0.95,
        mentions: Math.floor(Math.random() * 30) + 10,
        platforms: ['Twitter', 'Facebook', 'LinkedIn', 'Instagram']
      },
      { 
        name: `${q} Corp`, 
        type: 'organization', 
        relevance: 0.87,
        mentions: Math.floor(Math.random() * 20) + 5,
        platforms: ['Twitter', 'LinkedIn']
      },
      { 
        name: `${q} City`, 
        type: 'location', 
        relevance: 0.72,
        mentions: Math.floor(Math.random() * 15) + 3,
        platforms: ['Twitter', 'Instagram']
      }
    ]

    return NextResponse.json({
      success: true,
      data: responseData,
      metadata: {
        searchId: `es_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        limit
      }
    })

  } catch (error) {
    console.error('Entity search error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
