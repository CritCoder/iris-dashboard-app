'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Download, Users, ChevronLeft, Heart, MessageCircle, Share2, Eye, Facebook, Twitter, Instagram, Youtube, MapPin, Mail, Phone, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FacebookIcon, InstagramIcon, TwitterIcon } from '@/components/ui/platform-icons'
import Link from 'next/link'
import { organizationsData, type Organization } from '../organizations-data'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

interface Post {
  id: string
  author: string
  platform: 'facebook' | 'twitter' | 'instagram'
  content: string
  timestamp: string
  likes: number
  comments: number
  shares: number
  views: number
  sentiment: 'positive' | 'negative' | 'neutral'
}

// Using imported data now from organizations-data.ts
// Legacy sample organizations data kept for reference
const legacyOrganizationsData: Organization[] = [
  {
    id: 1,
    category: "Hindu Nationalist Organizations",
    name: "ಕಠೋರ ಹಿಂದುತ್ವವಾದಿಗಳು ಹಿಂದೂ ಜಾಗೃತಿ ಸೇನೆ",
    totalMembers: 3543,
    topInfluencers: [
      "Shivbhagath Bhagathsingh",
      "ಕೆಂಪೇಗೌಡ ಒಕ್ಕಲಿಗರ ಮೀಸಲಾತಿ ಹೋರಾಟ ಸಮಿತಿ(Admin)",
      "Vinaygowda"
    ],
    socialMedia: {
      facebook: "https://www.facebook.com/groups/481726962295310/?ref=share",
      twitter: null,
      instagram: "https://www.instagram.com/hindhu_jagruthii_sene/",
      youtube: null
    },
    contact: {
      physicalAddress: "Yalahanka",
      phoneNumber: "1919381307652",
      email: "rg065726@gmail.com"
    }
  },
  {
    id: 2,
    category: "Hindu Nationalist Organizations",
    name: "ಅಖಿಲಾ ಕರ್ನಾಟಕ ಹಿಂದೂ ಸಾಮ್ರಾಟ್ ಶಿವಾಜಿ ಸೇನಾ",
    totalMembers: 100,
    topInfluencers: [
      "Parashuram Segurkar (Admin1)",
      "Ambaresh Hindu (Admin2)"
    ],
    socialMedia: {
      facebook: "https://www.facebook.com/groups/503501497182282/members",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: "Yadagiri",
      phoneNumber: "9449477555",
      email: null
    }
  },
  {
    id: 3,
    category: "Hindu Nationalist Organizations",
    name: "ಬಲಿಷ್ಠ ಹಿಂದೂರಾಷ್ಟ್ರ",
    totalMembers: 19905,
    topInfluencers: [
      "Sharath Chandra"
    ],
    socialMedia: {
      facebook: "https://www.facebook.com/groups/126680487914954/members",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: "Bengaluru",
      phoneNumber: null,
      email: null
    }
  },
  {
    id: 4,
    category: "Hindu Nationalist Organizations",
    name: "ಕೇಸರಿ ಭಾರತ",
    totalMembers: 83906,
    topInfluencers: [
      "Raghavendra Reddy"
    ],
    socialMedia: {
      facebook: "https://www.facebook.com/groups/1578203138931997/members",
      twitter: null,
      instagram: "https://www.instagram.com/kesari_bharata/",
      youtube: null
    },
    contact: {
      physicalAddress: "Bengaluru",
      phoneNumber: null,
      email: null
    }
  },
  {
    id: 5,
    category: "Hindu Nationalist Organizations",
    name: "ಹಿಂದೂ ರಾಷ್ಟ್ರ",
    totalMembers: 4567,
    topInfluencers: [
      "Mantesh M"
    ],
    socialMedia: {
      facebook: "https://www.facebook.com/groups/3522107411173491/members",
      twitter: "https://twitter.com/GlobalHindu",
      instagram: "https://www.instagram.com/hindu._.rastra/",
      youtube: null
    },
    contact: {
      physicalAddress: "Vijaypura",
      phoneNumber: null,
      email: null
    }
  },
  {
    id: 6,
    category: "Hindu Nationalist Organizations",
    name: "ಜಯತು ಸನಾತನ ರಾಷ್ಟ್ರ",
    totalMembers: 1767,
    topInfluencers: [
      "Anil Kumar SV (Admin1)",
      "Anil Sv Gowda's(Admin2)"
    ],
    socialMedia: {
      facebook: "https://www.facebook.com/groups/1217587278614217/?ref=share",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: "Bengaluru",
      phoneNumber: null,
      email: "anilsv106@gmail.com"
    }
  },
  {
    id: 7,
    category: "Hindu Nationalist Organizations",
    name: "ಹಿಂದೂ ಹುಲಿ ಬಸನಗೌಡ ಪಾಟೀಲ ಅಭಿಮಾನಿಗಳು",
    totalMembers: 9141,
    topInfluencers: [
      "Hanamant Yamagar(Admin1)"
    ],
    socialMedia: {
      facebook: "https://www.facebook.com/groups/1592825204237356/members",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: "Jamakandi",
      phoneNumber: null,
      email: null
    }
  },
  {
    id: 8,
    category: "Hindu Nationalist Organizations",
    name: "ಯೋಗಿಜೀ ಫ್ಯಾನ್ಸ್ ಕರ್ನಾಟಕ",
    totalMembers: 30892,
    topInfluencers: [
      "Mahesh Vikram Hegde",
      "India with Modi(Admin)"
    ],
    socialMedia: {
      facebook: "https://www.facebook.com/groups/410546292958298",
      twitter: null,
      instagram: "https://www.instagram.com/yogiji_ni_moj/",
      youtube: null
    },
    contact: {
      physicalAddress: "Bengaluru",
      phoneNumber: null,
      email: null
    }
  },
  {
    id: 9,
    category: "Hindu Nationalist Organizations",
    name: "ನರೇಂದ್ರ ಮೋದಿ ಅಭಿಮಾನಿಗಳು ಕರ್ನಾಟಕ.",
    totalMembers: 99106,
    topInfluencers: [
      "Modi fans for karunadu"
    ],
    socialMedia: {
      facebook: "https://www.facebook.com/groups/2114701415476878/members",
      twitter: null,
      instagram: "https://www.instagram.com/narendra_modi_fns_club_karnatk/",
      youtube: null
    },
    contact: {
      physicalAddress: "Mangalore",
      phoneNumber: null,
      email: null
    }
  },
  {
    id: 10,
    category: "Hindu Nationalist Organizations",
    name: "Postcard ಕನ್ನಡ",
    totalMembers: 156388,
    topInfluencers: [
      "Mahesh Vikram Hegade"
    ],
    socialMedia: {
      facebook: "https://www.facebook.com/PostcardKanada",
      twitter: "https://twitter.com/PostcardKannada",
      instagram: "https://www.instagram.com/postcard_news/",
      youtube: null
    },
    contact: {
      physicalAddress: "Mangalore",
      phoneNumber: null,
      email: null
    }
  }
]

// Sample posts for each organization
const generatePostsForOrganization = (orgId: number, orgName: string): Post[] => {
  const platforms: Array<'facebook' | 'twitter' | 'instagram'> = ['facebook', 'twitter', 'instagram']
  const sentiments: Array<'positive' | 'negative' | 'neutral'> = ['positive', 'negative', 'neutral']

  const sampleContents = [
    `Latest update from ${orgName}. Join us in our mission for a better tomorrow!`,
    `Important announcement regarding upcoming events. Stay tuned for more details.`,
    `Thank you to all our members for your continuous support and dedication.`,
    `New initiatives launched this week. Check out our latest programs and activities.`,
    `Community gathering scheduled for next month. All members are invited to participate.`,
    `Celebrating our growing community of ${Math.floor(Math.random() * 1000)} active members!`,
    `Special message from our leadership team. Together we grow stronger.`,
    `Monthly report: Our impact in the community continues to expand.`,
    `Join our online discussion this weekend. Your voice matters!`,
    `Proud to announce our latest social initiative in the region.`
  ]

  return Array.from({ length: 15 }, (_, i) => ({
    id: `${orgId}-post-${i + 1}`,
    author: orgName.substring(0, 20),
    platform: platforms[Math.floor(Math.random() * platforms.length)],
    content: sampleContents[Math.floor(Math.random() * sampleContents.length)],
    timestamp: `${Math.floor(Math.random() * 7) + 1} days ago`,
    likes: Math.floor(Math.random() * 500),
    comments: Math.floor(Math.random() * 100),
    shares: Math.floor(Math.random() * 50),
    views: Math.floor(Math.random() * 5000),
    sentiment: sentiments[Math.floor(Math.random() * sentiments.length)]
  }))
}

function PostCard({ post }: { post: Post }) {
  const platformIcons = {
    facebook: FacebookIcon,
    twitter: TwitterIcon,
    instagram: InstagramIcon
  }

  const sentimentColors = {
    positive: 'border-green-500/30 bg-green-500/5',
    negative: 'border-red-500/30 bg-red-500/5',
    neutral: 'border-yellow-500/30 bg-yellow-500/5'
  }

  const IconComponent = platformIcons[post.platform]

  return (
    <Link href={`/analysis-history/1/post/${post.id}`}>
      <div className={`bg-card border rounded-lg p-4 hover:bg-accent/20 transition-colors cursor-pointer ${sentimentColors[post.sentiment]}`}>
        <div className="flex items-start gap-3 mb-3">
          <div className="w-6 h-6 flex items-center justify-center">
            <IconComponent className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-foreground font-medium text-sm mb-1">{post.author}</div>
            <div className="text-muted-foreground text-xs mb-2">
              {post.platform} - {post.timestamp}
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            {post.sentiment}
          </Badge>
        </div>

        <p className="text-foreground/90 text-sm mb-4 leading-relaxed">{post.content}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" /> {post.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" /> {post.comments}
            </span>
            <span className="flex items-center gap-1">
              <Share2 className="w-3 h-3" /> {post.shares}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" /> {post.views}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function OrganizationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const organizationId = parseInt(params.id as string)

  const [selectedSentiment, setSelectedSentiment] = useState('all')
  const [selectedPlatform, setSelectedPlatform] = useState('all')

  const organization = useMemo(() => {
    return organizationsData.find(org => org.id === organizationId)
  }, [organizationId])

  const posts = useMemo(() => {
    if (!organization) return []
    return generatePostsForOrganization(organization.id, organization.name)
  }, [organization])

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSentiment = selectedSentiment === 'all' || post.sentiment === selectedSentiment
      const matchesPlatform = selectedPlatform === 'all' || post.platform === selectedPlatform
      return matchesSentiment && matchesPlatform
    })
  }, [posts, selectedSentiment, selectedPlatform])

  if (!organization) {
    return (
      <PageLayout>
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Organization not found</h3>
            <Button onClick={() => router.push('/organizations')} className="mt-4">
              Back to Organizations
            </Button>
          </div>
        </div>
      </PageLayout>
    )
  }

  const sentimentCounts = {
    positive: posts.filter(p => p.sentiment === 'positive').length,
    negative: posts.filter(p => p.sentiment === 'negative').length,
    neutral: posts.filter(p => p.sentiment === 'neutral').length
  }

  const platformCounts = {
    facebook: posts.filter(p => p.platform === 'facebook').length,
    twitter: posts.filter(p => p.platform === 'twitter').length,
    instagram: posts.filter(p => p.platform === 'instagram').length
  }

  return (
    <PageLayout>
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        <PageHeader
          title={organization.name}
          description={organization.category}
          actions={
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push('/organizations')}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            </div>
          }
        />

        {/* Organization Info Section */}
        <div className="border-b border-border bg-muted/30 px-4 sm:px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-orange-500" />
                  <div>
                    <div className="text-2xl font-bold text-foreground">{organization.totalMembers.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Total Members</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-8 h-8 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold text-foreground">{posts.length}</div>
                    <div className="text-xs text-muted-foreground">Total Posts</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-purple-500" />
                  <div>
                    <div className="text-2xl font-bold text-foreground">{organization.topInfluencers.length}</div>
                    <div className="text-xs text-muted-foreground">Top Influencers</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <MapPin className="w-8 h-8 text-green-500" />
                  <div>
                    <div className="text-sm font-bold text-foreground truncate">{organization.contact.physicalAddress || 'N/A'}</div>
                    <div className="text-xs text-muted-foreground">Location</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact and Social Media */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Top Influencers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {organization.topInfluencers.map((influencer, idx) => (
                    <div key={idx} className="text-sm text-foreground flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                        {idx + 1}
                      </div>
                      {influencer}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Contact & Social Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {organization.contact.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{organization.contact.email}</span>
                  </div>
                )}
                {organization.contact.phoneNumber && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{organization.contact.phoneNumber}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 pt-2">
                  {organization.socialMedia.facebook && (
                    <a
                      href={organization.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-accent rounded transition-colors"
                    >
                      <Facebook className="w-5 h-5 text-blue-600" />
                    </a>
                  )}
                  {organization.socialMedia.twitter && (
                    <a
                      href={organization.socialMedia.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-accent rounded transition-colors"
                    >
                      <Twitter className="w-5 h-5 text-blue-400" />
                    </a>
                  )}
                  {organization.socialMedia.instagram && (
                    <a
                      href={organization.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-accent rounded transition-colors"
                    >
                      <Instagram className="w-5 h-5 text-pink-600" />
                    </a>
                  )}
                  {organization.socialMedia.youtube && (
                    <a
                      href={organization.socialMedia.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-accent rounded transition-colors"
                    >
                      <Youtube className="w-5 h-5 text-red-600" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters Section */}
        <div className="border-b border-border bg-background px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between">
            <div className="flex items-center gap-3">
              <Select value={selectedSentiment} onValueChange={setSelectedSentiment}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Sentiments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sentiments</SelectItem>
                  <SelectItem value="positive">Positive ({sentimentCounts.positive})</SelectItem>
                  <SelectItem value="negative">Negative ({sentimentCounts.negative})</SelectItem>
                  <SelectItem value="neutral">Neutral ({sentimentCounts.neutral})</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                variant={selectedPlatform === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPlatform('all')}
                className="text-xs"
              >
                All ({posts.length})
              </Button>
              <Button
                variant={selectedPlatform === 'facebook' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPlatform('facebook')}
                className="text-xs gap-2"
              >
                <FacebookIcon className="w-3 h-3" />
                ({platformCounts.facebook})
              </Button>
              <Button
                variant={selectedPlatform === 'twitter' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPlatform('twitter')}
                className="text-xs gap-2"
              >
                <TwitterIcon className="w-3 h-3" />
                ({platformCounts.twitter})
              </Button>
              <Button
                variant={selectedPlatform === 'instagram' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPlatform('instagram')}
                className="text-xs gap-2"
              >
                <InstagramIcon className="w-3 h-3" />
                ({platformCounts.instagram})
              </Button>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <MessageCircle className="w-12 h-12 text-muted-foreground" />
                </EmptyMedia>
                <EmptyTitle>No Posts Found</EmptyTitle>
                <EmptyDescription>
                  Try adjusting your filters to see more posts.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
