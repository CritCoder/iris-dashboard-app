import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { entityType, query, filters, org, firNo } = body

    // Validate required fields
    if (!entityType || !query) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: entityType and query' },
        { status: 400 }
      )
    }

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Mock response based on entity type
    let responseData
    switch (entityType) {
      case 'username':
        responseData = {
          username: query,
          foundInBreaches: Math.random() > 0.5,
          breachCount: Math.floor(Math.random() * 5),
          lastSeen: new Date().toISOString(),
          associatedEmails: [`${query}@example.com`],
          breachSources: ['LinkedIn', 'Facebook', 'Twitter']
        }
        break
      case 'email':
        responseData = {
          email: query,
          foundInBreaches: Math.random() > 0.3,
          breachCount: Math.floor(Math.random() * 3),
          lastSeen: new Date().toISOString(),
          associatedPasswords: ['password123', 'qwerty', 'admin123'],
          breachSources: ['Adobe', 'LinkedIn', 'Dropbox']
        }
        break
      case 'domain':
        responseData = {
          domain: query,
          foundInBreaches: Math.random() > 0.4,
          breachCount: Math.floor(Math.random() * 2),
          lastSeen: new Date().toISOString(),
          subdomains: [`www.${query}`, `mail.${query}`, `admin.${query}`]
        }
        break
      case 'phone':
        responseData = {
          phone: query,
          foundInBreaches: Math.random() > 0.6,
          breachCount: Math.floor(Math.random() * 2),
          lastSeen: new Date().toISOString(),
          associatedNames: ['John Doe', 'Jane Smith']
        }
        break
      case 'name':
        responseData = {
          name: query,
          foundInBreaches: Math.random() > 0.5,
          breachCount: Math.floor(Math.random() * 4),
          lastSeen: new Date().toISOString(),
          associatedEmails: [`${query.toLowerCase().replace(' ', '.')}@example.com`],
          associatedPhones: ['9876543210', '8765432109']
        }
        break
      case 'hash':
        responseData = {
          hash: query,
          foundInBreaches: Math.random() > 0.7,
          breachCount: Math.floor(Math.random() * 3),
          lastSeen: new Date().toISOString(),
          plaintext: 'password123',
          hashType: 'MD5'
        }
        break
      default:
        responseData = {
          query,
          foundInBreaches: false,
          breachCount: 0,
          lastSeen: new Date().toISOString()
        }
    }

    return NextResponse.json({
      success: true,
      data: responseData,
      metadata: {
        searchId: `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        org,
        firNo
      }
    })

  } catch (error) {
    console.error('IronVeil search error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
