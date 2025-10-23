import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

interface GroupData {
  id: string
  name: string
  type: 'religious' | 'political' | 'social' | 'other'
  members: number
  platforms: string[]
  primaryPlatform: string
  description?: string
  riskLevel: 'high' | 'medium' | 'low'
  category: string
  location?: string
  contactInfo?: {
    phone?: string
    email?: string
  }
  socialMedia?: {
    facebook?: string
    twitter?: string
    instagram?: string
    youtube?: string
  }
  influencers?: string
  createdAt: string
  updatedAt: string
  status: 'active' | 'inactive' | 'monitored'
  monitoringEnabled: boolean
  sheet: string
}

// Function to extract platform info from URLs
function extractPlatforms(facebookUrl: string, twitterUrl: string, instagramUrl: string, youtubeUrl: string) {
  const platforms: string[] = []
  const socialMedia: any = {}

  if (facebookUrl && facebookUrl !== 'Nil' && facebookUrl !== 'NIL') {
    platforms.push('facebook')
    socialMedia.facebook = facebookUrl
  }
  if (twitterUrl && twitterUrl !== 'Nil' && twitterUrl !== 'NIL') {
    platforms.push('twitter')
    socialMedia.twitter = twitterUrl
  }
  if (instagramUrl && instagramUrl !== 'Nil' && instagramUrl !== 'NIL') {
    platforms.push('instagram')
    socialMedia.instagram = instagramUrl
  }
  if (youtubeUrl && youtubeUrl !== 'Nil' && youtubeUrl !== 'NIL') {
    platforms.push('youtube')
    socialMedia.youtube = youtubeUrl
  }

  return { platforms, socialMedia }
}

// Function to determine risk level based on group characteristics
function determineRiskLevel(name: string, members: number, category: string): 'high' | 'medium' | 'low' {
  const nameUpper = name.toUpperCase()

  // High risk indicators
  if (nameUpper.includes('ಕಠೋರ') || nameUpper.includes('ಸೇನೆ') || nameUpper.includes('ದಳ') || nameUpper.includes('BAJRANG')) {
    return 'high'
  }

  // Medium risk for large groups or specific organizations
  if (members > 50000 || nameUpper.includes('ಹಿಂದೂ') || nameUpper.includes('HINDU')) {
    return 'medium'
  }

  return 'low'
}

// Function to determine group type
function determineGroupType(name: string, category: string): 'religious' | 'political' | 'social' | 'other' {
  const nameUpper = name.toUpperCase()

  if (nameUpper.includes('ಹಿಂದೂ') || nameUpper.includes('HINDU') || nameUpper.includes('ಬಜರಂಗ') || nameUpper.includes('ಪರಿಷತ್')) {
    return 'religious'
  }

  if (nameUpper.includes('ಮೋದಿ') || nameUpper.includes('MODI') || nameUpper.includes('ಬಿಜೆಪಿ') || nameUpper.includes('BJP')) {
    return 'political'
  }

  if (nameUpper.includes('ಯುವ') || nameUpper.includes('YOUTH') || nameUpper.includes('ಅಭಿಮಾನಿ')) {
    return 'social'
  }

  return 'other'
}

export async function POST(request: NextRequest) {
  try {
    // Read CSV file from public directory
    const csvPath = path.join(process.cwd(), 'public', 'groups.csv')
    const csvContent = await fs.readFile(csvPath, 'utf-8')

    // Parse CSV content
    const lines = csvContent.split('\n').filter(line => line.trim())
    const headers = lines[0].split(',')

    const groups: GroupData[] = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]
      if (!line.trim()) continue

      // Simple CSV parsing (handling basic cases)
      const values = line.split(',')

      // Skip if not enough columns
      if (values.length < 11) continue

      const slNo = values[0]?.trim()
      const orgName = values[1]?.trim()
      const totalMembers = parseInt(values[2]?.replace(/[^\d]/g, '') || '0')
      const influencers = values[3]?.trim()
      const facebookUrl = values[4]?.trim()
      const twitterUrl = values[5]?.trim()
      const instagramUrl = values[6]?.trim()
      const youtubeUrl = values[7]?.trim()
      const physicalAddress = values[8]?.trim()
      const phoneNumber = values[9]?.trim()
      const email = values[10]?.trim()

      // Skip empty rows
      if (!orgName || orgName === 'Organisation Type') continue

      const { platforms, socialMedia } = extractPlatforms(facebookUrl, twitterUrl, instagramUrl, youtubeUrl)
      const groupType = determineGroupType(orgName, 'Hindu Organizations')
      const riskLevel = determineRiskLevel(orgName, totalMembers, 'Hindu Organizations')

      const group: GroupData = {
        id: `group_${slNo || i}`,
        name: orgName,
        type: groupType,
        members: totalMembers,
        platforms,
        primaryPlatform: platforms[0] || 'facebook',
        description: `Hindu organization with ${totalMembers.toLocaleString()} members`,
        riskLevel,
        category: 'Hindu Organizations',
        location: physicalAddress && physicalAddress !== 'Nil' && physicalAddress !== 'NIL' ? physicalAddress : undefined,
        contactInfo: {
          phone: phoneNumber && phoneNumber !== 'Nil' && phoneNumber !== 'NIL' ? phoneNumber : undefined,
          email: email && email !== 'Nil' && email !== 'NIL' && email !== 'Linked E-Mail ID' ? email : undefined
        },
        socialMedia: Object.keys(socialMedia).length > 0 ? socialMedia : undefined,
        influencers: influencers && influencers !== 'Nil' && influencers !== 'NIL' ? influencers : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
        monitoringEnabled: riskLevel === 'high',
        sheet: 'Hindu Organizations'
      }

      groups.push(group)
    }

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${groups.length} groups`,
      data: {
        total: groups.length,
        groups: groups.slice(0, 10), // Return first 10 for preview
        summary: {
          high_risk: groups.filter(g => g.riskLevel === 'high').length,
          medium_risk: groups.filter(g => g.riskLevel === 'medium').length,
          low_risk: groups.filter(g => g.riskLevel === 'low').length,
          monitored: groups.filter(g => g.monitoringEnabled).length,
          total_members: groups.reduce((sum, g) => sum + g.members, 0)
        }
      }
    })

  } catch (error) {
    console.error('Error importing groups:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to import groups',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Groups import endpoint',
    usage: 'POST to this endpoint to import groups from CSV'
  })
}