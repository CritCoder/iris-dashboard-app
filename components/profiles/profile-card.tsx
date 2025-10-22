'use client'

import { Users, MessageCircle, Eye, ExternalLink, MapPin, Globe, CheckCircle } from 'lucide-react'
import { FacebookIcon, InstagramIcon, TwitterIcon, YouTubeIcon, TikTokIcon, RedditIcon } from '@/components/ui/platform-icons'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { TableRow, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'

export interface Profile {
  id: string
  username: string
  displayName?: string | null
  platform: 'facebook' | 'twitter' | 'instagram' | 'youtube' | 'reddit' | 'tiktok'
  profileImageUrl?: string
  bio?: string | null
  followerCount?: number | null
  followingCount?: number | null
  postCount?: number | null
  isVerified: boolean
  isBlueVerified: boolean
  accountType?: string
  lastPostAt?: string
  website?: string
  location?: string
}

interface ProfileCardProps {
  profile: Profile
  view?: 'grid' | 'list' | 'table'
  campaignId?: string
  onClick?: (profile: Profile) => void
}

export function ProfileCard({ profile, view = 'grid', campaignId = '1', onClick }: ProfileCardProps) {
  const platformIcons = {
    facebook: FacebookIcon,
    twitter: TwitterIcon,
    instagram: InstagramIcon,
    youtube: YouTubeIcon,
    reddit: RedditIcon,
    tiktok: TikTokIcon
  }

  const IconComponent = platformIcons[profile.platform] || TwitterIcon

  const handleClick = () => {
    if (onClick) {
      onClick(profile)
    }
  }

  // Format numbers
  const formatNumber = (num: number | null | undefined): string => {
    if (num === null || num === undefined) return '0'
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  // Get account type color
  const getAccountTypeColor = (type: string | null | undefined) => {
    if (!type) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    switch (type.toLowerCase()) {
      case 'business': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'creator': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'verified': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  if (view === 'table') {
    return (
      <TableRow className="hover:bg-accent/20">
        <TableCell>
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={profile.profileImageUrl} alt={profile.displayName || profile.username} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {(profile.displayName || profile.username)?.charAt(0).toUpperCase() || 'P'}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2">
              <IconComponent className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-foreground">{profile.displayName || profile.username}</span>
                  {profile.isVerified && (
                    <CheckCircle className="w-3 h-3 text-blue-500" />
                  )}
                  {profile.isBlueVerified && (
                    <CheckCircle className="w-3 h-3 text-blue-400" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground">@{profile.username}</span>
              </div>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="max-w-md">
            <p className="text-sm text-foreground/90 line-clamp-2">{profile.bio}</p>
          </div>
        </TableCell>
        <TableCell>
          <div className="text-center">
            <div className="text-sm font-medium text-foreground">{formatNumber(profile.followerCount)}</div>
            <div className="text-xs text-muted-foreground">Followers</div>
          </div>
        </TableCell>
        <TableCell>
          <div className="text-center">
            <div className="text-sm font-medium text-foreground">{formatNumber(profile.postCount)}</div>
            <div className="text-xs text-muted-foreground">Posts</div>
          </div>
        </TableCell>
        <TableCell>
          <Badge className={`text-xs ${getAccountTypeColor(profile.accountType)}`}>
            {profile.accountType}
          </Badge>
        </TableCell>
        <TableCell>
          <Link href={`/analysis-history/${campaignId}/profile/${profile.id}`}>
            <button className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors">
              <Eye className="w-3 h-3" />
              <span>View</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </Link>
        </TableCell>
      </TableRow>
    )
  }

  if (view === 'list') {
    return (
      <Link href={`/analysis-history/${campaignId}/profile/${profile.id}`}>
        <Card className="hover:bg-accent/20 transition-colors cursor-pointer p-4 h-20">
          <div className="flex items-center gap-4 h-full">
            <Avatar className="w-12 h-12 flex-shrink-0">
              <AvatarImage src={profile.profileImageUrl} alt={profile.displayName || profile.username} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {(profile.displayName || profile.username)?.charAt(0).toUpperCase() || 'P'}
              </AvatarFallback>
            </Avatar>

            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                <IconComponent className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-foreground font-medium text-sm truncate">{profile.displayName || profile.username}</span>
                  {profile.isVerified && <CheckCircle className="w-3 h-3 text-blue-500 flex-shrink-0" />}
                  {profile.isBlueVerified && <CheckCircle className="w-3 h-3 text-blue-400 flex-shrink-0" />}
                  <span className="text-muted-foreground text-xs">@{profile.username}</span>
                  <Badge className={`text-xs flex-shrink-0 ${getAccountTypeColor(profile.accountType)}`}>
                    {profile.accountType}
                  </Badge>
                </div>
                <p className="text-foreground/90 text-xs line-clamp-1">{profile.bio}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-shrink-0">
              <div className="text-center">
                <div className="font-medium text-foreground">{formatNumber(profile.followerCount)}</div>
                <div>Followers</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-foreground">{formatNumber(profile.postCount)}</div>
                <div>Posts</div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs text-primary flex-shrink-0">
              <Eye className="w-3 h-3" />
              <span>View</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  // Default grid view - Instagram/social media style profile card
  const cardContent = (
    <Card className="hover:bg-accent/5 transition-all duration-200 cursor-pointer border-border/40 hover:border-border/60 hover:shadow-sm bg-card/50 backdrop-blur-sm h-80 flex flex-col">
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Avatar className="w-16 h-16">
              <AvatarImage src={profile.profileImageUrl} alt={profile.displayName || profile.username} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg">
                {(profile.displayName || profile.username)?.charAt(0).toUpperCase() || 'P'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-foreground font-semibold text-sm truncate">{profile.displayName || profile.username}</h3>
                {profile.isVerified && <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                {profile.isBlueVerified && <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />}
              </div>
              <div className="flex items-center gap-2">
                <IconComponent className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">@{profile.username}</span>
              </div>
            </div>
            <Badge className={`text-xs ${getAccountTypeColor(profile.accountType)}`}>
              {profile.accountType}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          {/* Bio */}
          <div className="flex-1 mb-4">
            <p className="text-foreground/90 text-sm leading-relaxed line-clamp-3">
              {profile.bio || 'No bio available'}
            </p>
          </div>

          {/* Location & Website */}
          {(profile.location || profile.website) && (
            <div className="space-y-1 mb-4">
              {profile.location && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{profile.location}</span>
                </div>
              )}
              {profile.website && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Globe className="w-3 h-3" />
                  <span className="truncate">{profile.website}</span>
                </div>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border/30 flex-shrink-0">
            <div className="text-center">
              <div className="text-sm font-bold text-foreground">{formatNumber(profile.followerCount)}</div>
              <div className="text-xs text-muted-foreground">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-foreground">{formatNumber(profile.followingCount)}</div>
              <div className="text-xs text-muted-foreground">Following</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-foreground">{formatNumber(profile.postCount)}</div>
              <div className="text-xs text-muted-foreground">Posts</div>
            </div>
          </div>
        </CardContent>
      </Card>
  )

  if (onClick) {
    return <div onClick={handleClick}>{cardContent}</div>
  }

  return (
    <Link href={`/analysis-history/${campaignId}/profile/${profile.id}`}>
      {cardContent}
    </Link>
  )
}