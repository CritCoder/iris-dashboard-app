'use client'

import { Heart, MessageCircle, Share2, Eye, ExternalLink } from 'lucide-react'
import { FacebookIcon, InstagramIcon, TwitterIcon } from '@/components/ui/platform-icons'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import { TableRow, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export interface Post {
  id: string
  author: string
  platform: 'facebook' | 'twitter' | 'instagram' | 'youtube' | 'reddit' | 'news' | 'india-news'
  content: string
  timestamp: string
  likes: number
  comments: number
  shares: number
  views: number
  sentiment: 'positive' | 'negative' | 'neutral'
  url?: string
  thumbnailUrl?: string
  authorAvatar?: string
}

interface PostCardProps {
  post: Post
  view?: 'grid' | 'list' | 'table'
  href?: string
}

export function PostCard({ post, view = 'grid', href }: PostCardProps) {
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

  // Fallback to TwitterIcon if platform is not recognized
  const IconComponent = platformIcons[post.platform] || TwitterIcon

  if (view === 'table') {
    return (
      <TableRow className="hover:bg-accent/20">
        <TableCell>
          <div className="flex items-center gap-2">
            <IconComponent className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{post.author}</span>
          </div>
        </TableCell>
        <TableCell>
          <div className="max-w-md">
            <p className="text-sm text-foreground/90 line-clamp-2">{post.content}</p>
          </div>
        </TableCell>
        <TableCell>
          <span className="text-xs text-muted-foreground">{post.timestamp}</span>
        </TableCell>
        <TableCell>
          <Badge
            variant={post.sentiment === 'positive' ? 'default' : post.sentiment === 'negative' ? 'destructive' : 'secondary'}
            className="text-xs"
          >
            {post.sentiment}
          </Badge>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" /> {post.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" /> {post.comments}
            </span>
          </div>
        </TableCell>
        <TableCell>
          <Link href={href || `/social-feed/post/${post.id}`}>
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
      <Link href={href || `/social-feed/post/${post.id}`}>
        <Card className={`hover:bg-accent/20 transition-colors cursor-pointer ${sentimentColors[post.sentiment]} p-4 h-20`}>
          <div className="flex items-center gap-4 h-full">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                <IconComponent className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-foreground font-medium text-sm truncate">{post.author}</span>
                  <span className="text-muted-foreground text-xs">• {post.timestamp}</span>
                  <Badge
                    variant={post.sentiment === 'positive' ? 'default' : post.sentiment === 'negative' ? 'destructive' : 'secondary'}
                    className="text-xs flex-shrink-0"
                  >
                    {post.sentiment}
                  </Badge>
                </div>
                <p className="text-foreground/90 text-sm line-clamp-2">{post.content}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-shrink-0">
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" /> {post.likes}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" /> {post.comments}
              </span>
              <span className="flex items-center gap-1">
                <Share2 className="w-3 h-3" /> {post.shares}
              </span>
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

  // Default grid view - Twitter-style tweet card
  return (
    <Link href={href || `/social-feed/post/${post.id}`}>
      <Card className={`hover:bg-accent/5 transition-all duration-200 cursor-pointer border-border/40 hover:border-border/60 hover:shadow-sm bg-card/50 backdrop-blur-sm h-64 flex flex-col`}>
        <div className="p-4 flex flex-col h-full">
          {/* Tweet Header - Avatar, Name, Handle */}
          <div className="flex items-start gap-3 mb-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <IconComponent className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col">
                <span className="text-foreground font-semibold text-sm truncate">{post.author}</span>
                <span className="text-muted-foreground text-sm">@{post.author.toLowerCase().replace(/\s+/g, '')}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge
                variant={post.sentiment === 'positive' ? 'default' : post.sentiment === 'negative' ? 'destructive' : 'secondary'}
                className="text-xs px-2 py-0.5"
              >
                {post.sentiment}
              </Badge>
              <span className="text-xs text-muted-foreground">{post.timestamp}</span>
            </div>
          </div>

          {/* Tweet Content */}
          <div className="flex-1 mb-3">
            <p className="text-foreground text-sm leading-normal line-clamp-4">
              {post.content}
            </p>
          </div>

          {/* Tweet Actions */}
          <div className="flex items-center justify-between text-muted-foreground pt-2 border-t border-border/30 flex-shrink-0">
            <button className="flex items-center gap-2 hover:text-blue-500 transition-colors group">
              <div className="p-1.5 rounded-full group-hover:bg-blue-500/10">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className="text-xs">{post.comments}</span>
            </button>

            <button className="flex items-center gap-2 hover:text-green-500 transition-colors group">
              <div className="p-1.5 rounded-full group-hover:bg-green-500/10">
                <Share2 className="w-4 h-4" />
              </div>
              <span className="text-xs">{post.shares}</span>
            </button>

            <button className="flex items-center gap-2 hover:text-red-500 transition-colors group">
              <div className="p-1.5 rounded-full group-hover:bg-red-500/10">
                <Heart className="w-4 h-4" />
              </div>
              <span className="text-xs">{post.likes}</span>
            </button>

            <button className="flex items-center gap-2 hover:text-primary transition-colors group">
              <div className="p-1.5 rounded-full group-hover:bg-primary/10">
                <ExternalLink className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>
      </Card>
    </Link>
  )
}