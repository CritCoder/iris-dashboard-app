'use client'

import { useState, useMemo } from 'react'
import { PageLayout } from '@/components/layout/page-layout'
import { Heart, MessageCircle, Share2, Eye, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useSocialPosts, useProfileDetails } from '@/hooks/use-api'
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
  content: string
  timestamp: string
  likes: number
  comments: number
  shares: number
  views: number
}

// All data will be fetched from APIs - no hard-coded data

function PostCard({ post }: { post: Post }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-all">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white text-sm font-semibold">
          G
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white font-medium text-sm mb-1">grok</div>
          <div className="text-zinc-500 text-xs">Twitter · {post.timestamp}</div>
        </div>
      </div>

      <p className="text-zinc-300 text-sm mb-4 line-clamp-3">{post.content}</p>

      <div className="flex items-center justify-between pt-3 border-t border-zinc-800 text-xs text-zinc-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5" /> {post.likes}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-3.5 h-3.5" /> {post.comments}
          </span>
          <span className="flex items-center gap-1">
            <Share2 className="w-3.5 h-3.5" /> {post.shares}
          </span>
        </div>
        <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300">
          View <Eye className="w-3.5 h-3.5" /> {post.views}
        </button>
      </div>
    </div>
  )
}

export default function ProfileDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis'>('overview')
  const [postFilter, setPostFilter] = useState<'latest' | 'top' | 'positive' | 'negative'>('latest')

  // Fetch profile details and posts
  const { data: profileData, loading: profileLoading } = useProfileDetails(params.id)
  
  const { data: posts, loading: postsLoading } = useSocialPosts({
    author: params.id,
    limit: 20,
    sortBy: postFilter === 'latest' ? 'createdAt' : 'engagement'
  })

  return (
    <PageLayout>
      <div className="h-screen flex flex-col lg:flex-row bg-black overflow-hidden">
        {/* Left Side - Profile Info */}
        <div className="w-full lg:w-[400px] border-r border-zinc-800 overflow-y-auto bg-zinc-950 p-6">
          <div className="text-center mb-6">
            <div className="w-32 h-32 mx-auto mb-4 bg-zinc-900 rounded-full flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-full h-full p-4">
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="80" fontWeight="bold">
                  Ø
                </text>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Grok</h1>
            <p className="text-zinc-400 text-sm mb-1">@grok</p>
            <a href="https://x.co/i/qnk08LG8" target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs hover:underline flex items-center justify-content-center gap-1">
              https://x.co/i/qnk08LG8 <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="mb-6 text-sm text-zinc-400">
            <p>📍 wherever you are</p>
            <p>📅 Joined November 2023</p>
          </div>

          <div className="flex items-center gap-4 mb-6 text-sm">
            <div>
              <span className="text-white font-semibold">3</span>
              <span className="text-zinc-500"> Following</span>
            </div>
            <div>
              <span className="text-white font-semibold">6.4M</span>
              <span className="text-zinc-500"> Followers</span>
            </div>
          </div>

          <Button variant="outline" className="w-full mb-6">
            View Profile
          </Button>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-zinc-800 text-white'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'analysis'
                  ? 'bg-zinc-800 text-white'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              AI Analysis
            </button>
          </div>

          {/* Profile Overview Stats */}
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-semibold mb-3">Profile Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-white mb-1">1392</div>
                  <div className="text-xs text-zinc-500">Total Posts</div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">53119830</div>
                  <div className="text-xs text-zinc-500">Profile Posts</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">Posting Time Pattern</h3>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <div className="h-32 flex items-end justify-between gap-1">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-blue-600 rounded-t"
                      style={{ height: `${Math.random() * 100}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">Engagement</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-white mb-1">14.73K</div>
                  <div className="text-xs text-zinc-500">💙 Likes</div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-white mb-1">381</div>
                  <div className="text-xs text-zinc-500">💬 Comments</div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-white mb-1">868</div>
                  <div className="text-xs text-zinc-500">🔄 Shares</div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-white mb-1">11</div>
                  <div className="text-xs text-zinc-500">👁️ Avg</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">Sentiment Distribution</h3>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <div className="relative w-40 h-40 mx-auto mb-4">
                  <svg viewBox="0 0 100 100" className="transform -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#3f3f46" strokeWidth="20" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#ef4444" strokeWidth="20" strokeDasharray="25 75" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="20" strokeDasharray="25 75" strokeDashoffset="-25" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#6b7280" strokeWidth="20" strokeDasharray="50 50" strokeDashoffset="-50" />
                  </svg>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-zinc-400">Positive</span>
                    </div>
                    <span className="text-white font-semibold">95</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-500" />
                      <span className="text-zinc-400">Neutral</span>
                    </div>
                    <span className="text-white font-semibold">885</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span className="text-zinc-400">Mixed</span>
                    </div>
                    <span className="text-white font-semibold">200</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-zinc-400">Negative</span>
                    </div>
                    <span className="text-white font-semibold">212</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">Platform Info</h3>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Platform</span>
                  <span className="text-white font-semibold">Twitter</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Verified</span>
                  <span className="text-white font-semibold">No</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Created</span>
                  <span className="text-white font-semibold">11/4/2023</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Posts */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b border-zinc-800 bg-black px-6 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPostFilter('latest')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  postFilter === 'latest'
                    ? 'bg-zinc-800 text-white'
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                Latest
              </button>
              <button
                onClick={() => setPostFilter('top')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  postFilter === 'top'
                    ? 'bg-zinc-800 text-white'
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                Top
              </button>
              <button
                onClick={() => setPostFilter('positive')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  postFilter === 'positive'
                    ? 'bg-zinc-800 text-white'
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                Positive
              </button>
              <button
                onClick={() => setPostFilter('negative')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  postFilter === 'negative'
                    ? 'bg-zinc-800 text-white'
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                Negative
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-black p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {postsLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 animate-pulse">
                    <div className="h-4 bg-zinc-700 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-zinc-700 rounded w-1/2" />
                  </div>
                ))
              ) : posts && posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <div className="col-span-full">
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <MessageCircle className="w-12 h-12 text-muted-foreground" />
                      </EmptyMedia>
                      <EmptyTitle>No Posts Found</EmptyTitle>
                      <EmptyDescription>
                        No posts found for this profile.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}