'use client'

import { MapPin, Calendar, ExternalLink, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getBestProfileImage, getHighResProfileImage } from '@/lib/image-utils'

interface ProfileHeaderProps {
  profile: any
  onClose?: () => void
}

const formatNumber = (num: number): string => {
  if (!num) return '0'
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

export function ProfileHeader({ profile, onClose }: ProfileHeaderProps) {
  const accountCreatedDate = profile.accountCreatedAt 
    ? new Date(profile.accountCreatedAt).toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      })
    : profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      })
    : 'N/A'

  return (
    <div className="bg-background">
      {/* Banner */}
      <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/5 relative">
        {profile.profileBannerUrl && (
          <img 
            src={getHighResProfileImage(profile.profileBannerUrl)} 
            alt="Banner" 
            className="w-full h-full object-cover" 
            onError={(e) => {
              // Hide image if it fails to load
              e.currentTarget.style.display = 'none'
            }}
          />
        )}
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-background/80 hover:bg-background"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="p-4 relative">
        <div className="flex justify-between items-start -mt-16">
          <Avatar className="w-24 h-24 border-4 border-background relative z-10">
            <AvatarImage 
              src={getBestProfileImage(profile.profileImageUrl, profile.avatar)} 
              alt={profile.username || profile.displayName} 
            />
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/50 text-primary-foreground text-2xl">
              {(profile.displayName || profile.username || 'U').charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          {profile.profileUrl && (
            <a 
              href={profile.profileUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mt-16"
            >
              <Button variant="outline" size="sm" className="gap-2">
                View Profile
                <ExternalLink className="w-3 h-3" />
              </Button>
            </a>
          )}
        </div>

        <div className="mt-3 space-y-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-foreground">
                {profile.displayName || profile.username}
              </h2>
              {(profile.isVerified || profile.verified) && (
                <CheckCircle className="w-5 h-5 text-blue-500" />
              )}
              {(profile.isBlueVerified || profile.blueVerified) && (
                <Badge variant="default" className="text-xs">Blue</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">@{profile.username}</p>
          </div>
          
          {profile.bio && (
            <p className="text-foreground text-sm leading-relaxed">
              {profile.bio}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {profile.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{profile.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Joined {accountCreatedDate}</span>
            </div>
          </div>

          {((profile.followingCount !== null && profile.followingCount !== undefined) || 
            (profile.followerCount !== null && profile.followerCount !== undefined) ||
            (profile.following !== null && profile.following !== undefined) || 
            (profile.followers !== null && profile.followers !== undefined)) && (
            <div className="flex items-center gap-6 pt-2">
              {((profile.followingCount !== null && profile.followingCount !== undefined) ||
                (profile.following !== null && profile.following !== undefined)) && (
                <div>
                  <span className="font-bold text-foreground text-sm">
                    {formatNumber(profile.followingCount ?? profile.following ?? 0)}
                  </span>
                  <span className="text-muted-foreground text-sm ml-1">Following</span>
                </div>
              )}
              {((profile.followerCount !== null && profile.followerCount !== undefined) ||
                (profile.followers !== null && profile.followers !== undefined)) && (
                <div>
                  <span className="font-bold text-foreground text-sm">
                    {formatNumber(profile.followerCount ?? profile.followers ?? 0)}
                  </span>
                  <span className="text-muted-foreground text-sm ml-1">Followers</span>
                </div>
              )}
              {((profile.postCount !== null && profile.postCount !== undefined) ||
                (profile.posts !== null && profile.posts !== undefined)) && (
                <div>
                  <span className="font-bold text-foreground text-sm">
                    {formatNumber(profile.postCount ?? profile.posts ?? 0)}
                  </span>
                  <span className="text-muted-foreground text-sm ml-1">Posts</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

