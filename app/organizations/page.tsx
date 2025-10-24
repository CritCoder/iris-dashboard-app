'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Users, TrendingUp, ChevronRight, X, Download, Eye, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/ui/search-input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimatedPage, AnimatedGrid, AnimatedCard } from '@/components/ui/animated'
import { organizationsData, type Organization } from './organizations-data'

// Using imported data - uncomment below for legacy local data
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

function OrganizationCard({ organization, onClick }: { organization: Organization; onClick: () => void }) {
  return (
    <Card 
      onClick={onClick}
      className="hover:border-primary/50 transition-all cursor-pointer hover:shadow-md"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6 text-white" />
          </div>
          <Badge variant="secondary" className="text-xs">
            {organization.totalMembers.toLocaleString()} members
          </Badge>
        </div>
        <CardTitle className="text-base line-clamp-2">{organization.name}</CardTitle>
        <CardDescription className="text-xs">{organization.category}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Top Influencers */}
        {organization.topInfluencers.length > 0 && (
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1">Top Influencers</div>
            <div className="space-y-1">
              {organization.topInfluencers.slice(0, 2).map((influencer, idx) => (
                <div key={idx} className="text-xs text-foreground truncate">
                  • {influencer}
                </div>
              ))}
              {organization.topInfluencers.length > 2 && (
                <div className="text-xs text-muted-foreground">
                  +{organization.topInfluencers.length - 2} more
                </div>
              )}
            </div>
          </div>
        )}

        {/* Social Media Links */}
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          {organization.socialMedia.facebook && (
            <a 
              href={organization.socialMedia.facebook} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 hover:bg-accent rounded transition-colors"
            >
              <Facebook className="w-4 h-4 text-blue-600" />
            </a>
          )}
          {organization.socialMedia.twitter && (
            <a 
              href={organization.socialMedia.twitter} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 hover:bg-accent rounded transition-colors"
            >
              <Twitter className="w-4 h-4 text-blue-400" />
            </a>
          )}
          {organization.socialMedia.instagram && (
            <a 
              href={organization.socialMedia.instagram} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 hover:bg-accent rounded transition-colors"
            >
              <Instagram className="w-4 h-4 text-pink-600" />
            </a>
          )}
          {organization.socialMedia.youtube && (
            <a 
              href={organization.socialMedia.youtube} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 hover:bg-accent rounded transition-colors"
            >
              <Youtube className="w-4 h-4 text-red-600" />
            </a>
          )}
          {organization.contact.physicalAddress && (
            <div className="flex items-center gap-1 ml-auto text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              {organization.contact.physicalAddress}
            </div>
          )}
        </div>

        {/* View Details Button */}
        <Button variant="ghost" size="sm" className="w-full gap-2 text-xs">
          <Eye className="w-3 h-3" />
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-foreground mb-3">{title}</h3>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  )
}

function FilterItem({ 
  label, 
  isActive = false, 
  onClick,
  count
}: { 
  label: string
  isActive?: boolean
  onClick?: () => void
  count?: number
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
        isActive 
          ? 'bg-primary text-primary-foreground' 
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      }`}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span className={`text-xs ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
          {count}
        </span>
      )}
    </button>
  )
}

export default function OrganizationsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  const handleOrganizationClick = (organization: Organization) => {
    // Navigate to organization detail page
    router.push(`/organizations/${organization.id}`)
  }

  const filteredOrganizations = useMemo(() => {
    let filtered = [...organizationsData]

    // Apply filter
    switch (activeFilter) {
      case 'large':
        filtered = filtered.filter(org => org.totalMembers > 50000)
        break
      case 'medium':
        filtered = filtered.filter(org => org.totalMembers >= 10000 && org.totalMembers <= 50000)
        break
      case 'small':
        filtered = filtered.filter(org => org.totalMembers < 10000)
        break
      case 'bengaluru':
        filtered = filtered.filter(org => org.contact.physicalAddress?.toLowerCase().includes('bengaluru'))
        break
    }

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(org =>
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.topInfluencers.some(inf => inf.toLowerCase().includes(searchQuery.toLowerCase())) ||
        org.contact.physicalAddress?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered
  }, [searchQuery, activeFilter])

  const categories = useMemo(() => {
    const cats = new Set(organizationsData.map(org => org.category))
    return Array.from(cats)
  }, [])

  return (
    <PageLayout>
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        <PageHeader 
          title="Groups & Organizations"
          description="Monitor and track organizations and groups"
          actions={
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {filteredOrganizations.length} organizations found
              </span>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          }
        />

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Filters */}
          <div className="hidden lg:block lg:w-80 border-r border-border bg-muted/30 overflow-y-auto">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Organizations</h2>
              
              <FilterSection title="PRIMARY">
                <FilterItem 
                  label="All Organizations" 
                  isActive={activeFilter === 'all'}
                  onClick={() => setActiveFilter('all')}
                  count={organizationsData.length}
                />
                <FilterItem 
                  label="Large Groups (50K+)"
                  isActive={activeFilter === 'large'}
                  onClick={() => setActiveFilter('large')}
                  count={organizationsData.filter(o => o.totalMembers > 50000).length}
                />
                <FilterItem 
                  label="Medium Groups (10K-50K)"
                  isActive={activeFilter === 'medium'}
                  onClick={() => setActiveFilter('medium')}
                  count={organizationsData.filter(o => o.totalMembers >= 10000 && o.totalMembers <= 50000).length}
                />
                <FilterItem 
                  label="Small Groups (<10K)"
                  isActive={activeFilter === 'small'}
                  onClick={() => setActiveFilter('small')}
                  count={organizationsData.filter(o => o.totalMembers < 10000).length}
                />
              </FilterSection>

              <FilterSection title="BY LOCATION">
                <FilterItem 
                  label="Bengaluru"
                  isActive={activeFilter === 'bengaluru'}
                  onClick={() => setActiveFilter('bengaluru')}
                  count={organizationsData.filter(o => o.contact.physicalAddress?.toLowerCase().includes('bengaluru')).length}
                />
                <FilterItem 
                  label="Mangalore"
                  isActive={activeFilter === 'mangalore'}
                  onClick={() => setActiveFilter('mangalore')}
                  count={organizationsData.filter(o => o.contact.physicalAddress?.toLowerCase().includes('mangalore')).length}
                />
                <FilterItem 
                  label="Other Cities"
                  isActive={activeFilter === 'other'}
                  onClick={() => setActiveFilter('other')}
                  count={organizationsData.filter(o => {
                    const addr = o.contact.physicalAddress?.toLowerCase()
                    return addr && !addr.includes('bengaluru') && !addr.includes('mangalore')
                  }).length}
                />
              </FilterSection>

              <FilterSection title="BY CATEGORY">
                {categories.map((category) => (
                  <FilterItem 
                    key={category}
                    label={category}
                    isActive={activeFilter === category}
                    onClick={() => setActiveFilter(category)}
                    count={organizationsData.filter(o => o.category === category).length}
                  />
                ))}
              </FilterSection>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-3 sm:p-4 border-b border-border">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="gap-2">
                    {activeFilter === 'all' ? 'All Organizations' : activeFilter}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setActiveFilter('all')} />
                  </Badge>
                </div>
                <div className="flex-1">
                  <SearchInput
                    placeholder="Search organizations, influencers, locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {filteredOrganizations.length > 0 ? (
                <AnimatedGrid stagger={0.03} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredOrganizations.map((organization) => (
                    <AnimatedCard key={organization.id}>
                      <OrganizationCard
                        organization={organization}
                        onClick={() => handleOrganizationClick(organization)}
                      />
                    </AnimatedCard>
                  ))}
                </AnimatedGrid>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No organizations found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or filters
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

