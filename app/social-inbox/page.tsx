'use client'

import { useState } from 'react'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Search, ChevronDown, Heart, MessageCircle, Share2, Eye, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FacebookIcon, InstagramIcon, TwitterIcon } from '@/components/ui/platform-icons'

interface Post {
  id: string
  author: string
  platform: 'facebook' | 'twitter' | 'instagram'
  content: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  timestamp: string
  likes: number
  comments: number
  shares: number
  views: number
  campaign: string
  relevanceScore: number
}

const samplePosts: Post[] = [
  {
    id: '1',
    author: 'Azin Naushad',
    platform: 'facebook',
    content: 'Hey guys, me and my friend are looking for a place to move in. We\'re open to: A 2BHK flat 🏠 Or 2 rooms in a 3BHK with flatmates 🏡 Preferred areas:HSR, BTM, Bellandur, CV Raman Nagar (and nearby) 💰 Budget: ~15-18k per head We\'re both working professionals, easy-going and chill. Looking to move in soon by this month DM if you\'ve got any leads or are looking for flatmates',
    priority: 'MEDIUM',
    timestamp: '2 hours ago',
    likes: 0,
    comments: 0,
    shares: 0,
    views: 0,
    campaign: 'bellandur',
    relevanceScore: 20.0
  },
  {
    id: '2',
    author: 'Azin Naushad',
    platform: 'facebook',
    content: 'Hey guys, me and my friend are looking for a place to move in. We\'re open to: A 2BHK flat 🏠 Or 2 rooms in a 3BHK with flatmates 🏡 Preferred areas:HSR...',
    priority: 'MEDIUM',
    timestamp: '2 hours ago',
    likes: 0,
    comments: 0,
    shares: 0,
    views: 0,
    campaign: 'bellandur',
    relevanceScore: 20.0
  },
  {
    id: '3',
    author: 'Azin Naushad',
    platform: 'facebook',
    content: 'Hey guys, me and my friend are looking for a place to move in. We\'re open to: A 2BHK flat 🏠 Or 2 rooms in a 3BHK with flatmates 🏡 Preferred areas:HSR...',
    priority: 'MEDIUM',
    timestamp: '2 hours ago',
    likes: 0,
    comments: 0,
    shares: 0,
    views: 0,
    campaign: 'bellandur',
    relevanceScore: 20.0
  }
]

function PostListItem({ post, isSelected, onClick }: { post: Post; isSelected: boolean; onClick: () => void }) {
  const platformIcons = {
    facebook: FacebookIcon,
    twitter: TwitterIcon,
    instagram: InstagramIcon
  }

  const priorityColors = {
    LOW: 'bg-secondary text-muted-foreground',
    MEDIUM: 'bg-blue-600 text-white',
    HIGH: 'bg-red-600 text-white'
  }

  return (
    <div
      onClick={onClick}
      className={`p-4 border-l-2 cursor-pointer transition-all ${
        isSelected
          ? 'bg-secondary border-l-blue-500'
          : 'bg-transparent border-l-transparent hover:bg-accent/20'
      }`}
    >
      <div className="flex items-start gap-3 mb-2">
        <div className="w-6 h-6 flex items-center justify-center">
          {(() => {
            const IconComponent = platformIcons[post.platform]
            return <IconComponent className="w-5 h-5 text-muted-foreground" />
          })()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-foreground font-medium text-sm mb-1">{post.author}</div>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-2">{post.content}</p>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColors[post.priority]}`}>
              {post.priority}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>⏰ {post.timestamp}</span>
            <div className="flex items-center gap-3">
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SocialInboxPage() {
  const [selectedPost, setSelectedPost] = useState<Post>(samplePosts[0])
  const [showAddNote, setShowAddNote] = useState(false)
  const [noteText, setNoteText] = useState('')

  return (
    <PageLayout>
      <div className="h-screen flex flex-col overflow-hidden w-full min-h-screen">
        <PageHeader 
          title="Social Inbox"
          description="New posts from all campaigns"
          actions={
            <div className="flex items-center gap-4">
              <div className="flex-1 flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search posts..."
                    className="pl-10 pr-4 py-2 text-sm h-9"
                  />
                </div>

                <select className="bg-background border border-border text-foreground text-sm rounded-lg pl-3 pr-8 py-2 h-9 cursor-pointer hover:bg-accent/20 transition-colors appearance-none">
                  <option>All Sentiments</option>
                  <option>Positive</option>
                  <option>Negative</option>
                  <option>Neutral</option>
                </select>

                <select className="bg-background border border-border text-foreground text-sm rounded-lg pl-3 pr-8 py-2 h-9 cursor-pointer hover:bg-accent/20 transition-colors appearance-none">
                  <option>All Platforms</option>
                  <option>Facebook</option>
                  <option>Twitter</option>
                  <option>Instagram</option>
                </select>

                <select className="bg-background border border-border text-foreground text-sm rounded-lg pl-3 pr-8 py-2 h-9 cursor-pointer hover:bg-accent/20 transition-colors appearance-none">
                  <option>All Campaigns</option>
                  <option>bellandur</option>
                </select>

                <select className="bg-background border border-border text-foreground text-sm rounded-lg pl-3 pr-8 py-2 h-9 cursor-pointer hover:bg-accent/20 transition-colors appearance-none">
                  <option>Last 24 Hours</option>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>

                <select className="bg-background border border-border text-foreground text-sm rounded-lg pl-3 pr-8 py-2 h-9 cursor-pointer hover:bg-accent/20 transition-colors appearance-none">
                  <option>Sort by Date</option>
                  <option>Sort by Engagement</option>
                  <option>Sort by Priority</option>
                </select>

                <Button variant="outline" size="sm" className="h-9">
                  Reset
                </Button>
              </div>
            </div>
          }
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden w-full h-full">
          {/* Left Column - Post List */}
          <div className="w-full lg:w-[350px] border-r border-border bg-background flex-shrink-0 flex flex-col h-full">
            <div className="p-4 border-b border-border flex-shrink-0">
              <h2 className="text-foreground font-semibold mb-1">Inbox (1441)</h2>
              <p className="text-xs text-muted-foreground">New posts that have not been classified yet</p>
            </div>
            <div className="divide-y divide-border flex-1 overflow-y-auto">
              {samplePosts.map((post) => (
                <PostListItem
                  key={post.id}
                  post={post}
                  isSelected={selectedPost.id === post.id}
                  onClick={() => setSelectedPost(post)}
                />
              ))}
            </div>
          </div>

          {/* Middle Column - Post Detail */}
          <div className="flex-1 overflow-y-auto min-w-0 h-full border-r border-border">
            <div className="p-6 max-w-none">
              {/* Selected Post */}
              <div className="bg-card border border-border rounded-lg p-6 mb-6 list-animate-in">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground font-semibold">
                    {selectedPost.author[0]}
                  </div>
                  <div className="flex-1">
                        <div className="text-foreground font-medium mb-1">{selectedPost.author}</div>
                        <div className="text-muted-foreground text-sm">
                      {selectedPost.platform} · {selectedPost.timestamp}
                    </div>
                  </div>
                </div>

                    <p className="text-foreground/90 mb-4 leading-relaxed whitespace-pre-wrap break-words">{selectedPost.content}</p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-4 text-sm">
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                      <Heart className="w-4 h-4" />
                      <span>{selectedPost.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span>{selectedPost.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                      <Share2 className="w-4 h-4" />
                      <span>{selectedPost.shares}</span>
                    </button>
                  </div>
                  <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
                    <span>View</span>
                    <Eye className="w-4 h-4" />
                    <span>{selectedPost.views}</span>
                  </button>
                </div>
              </div>

                  {/* AI Analysis */}
                  <div className="bg-card border border-border rounded-lg p-6 mb-6 list-animate-in">
                    <h3 className="text-foreground font-semibold mb-4">AI Analysis</h3>
                
                <div className="mb-6">
                  <h4 className="text-muted-foreground text-sm font-medium mb-2">Summary</h4>
                      <p className="text-foreground/90 text-sm leading-relaxed whitespace-pre-wrap break-words">
                    Azin Naushad and a friend are seeking a 2BHK flat or two rooms in a 3BHK with flatmates in HSR, BTM, Bellandur, or CV Raman Nagar, with a budget of 15-18k per person. They are working professionals looking to move in by the end of the current month.
                  </p>
                </div>

                <div>
                  <h4 className="text-muted-foreground text-sm font-medium mb-2">Relevance Score</h4>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary/60 rounded-full"
                        style={{ width: `${selectedPost.relevanceScore}%` }}
                      />
                    </div>
                    <span className="text-foreground font-medium text-sm">{selectedPost.relevanceScore}%</span>
                  </div>
                </div>
              </div>

                  {/* Engagement */}
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-foreground font-semibold mb-4">Engagement</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">{selectedPost.likes}</div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-500">Likes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">{selectedPost.shares}</div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-500">Shares</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">{selectedPost.comments}</div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-500">Comments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">{selectedPost.views}</div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-500">Views</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Unified Notes & Post Details */}
          <div className="w-full lg:w-[320px] bg-background flex-shrink-0 h-full flex flex-col">
            {/* Notes Section */}
            <div className="p-4 border-b border-border flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-foreground font-semibold">Notes & Analysis</h3>
                <Button 
                  size="sm" 
                  className="gap-2 h-8 text-xs"
                  onClick={() => setShowAddNote(true)}
                >
                  <Plus className="w-3 h-3" />
                  Add Note
                </Button>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {showAddNote ? (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Add your note here..."
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      className="min-h-[80px] resize-none"
                    />
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => {
                          // Here you would save the note
                          console.log('Note saved:', noteText)
                          setNoteText('')
                          setShowAddNote(false)
                        }}
                      >
                        Save Note
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setNoteText('')
                          setShowAddNote(false)
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-muted flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">No notes yet</p>
                    <p className="text-xs text-muted-foreground">Add your first note</p>
                  </div>
                )}
              </div>
            </div>

            {/* Post Details */}
            <div className="p-4 border-t border-border flex-1 overflow-y-auto">
              <h3 className="text-foreground font-semibold mb-3">Post Details</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">Platform:</span>
                  <span className="text-sm text-foreground font-medium">{selectedPost.platform}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">Posted:</span>
                  <span className="text-sm text-foreground font-medium">{selectedPost.timestamp}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">Author:</span>
                  <span className="text-sm text-foreground font-medium">{selectedPost.author}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">Priority:</span>
                  <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">{selectedPost.priority}</span>
                </div>
                <div className="pt-2 border-t border-border">
                  <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">
                    View Original Post
                  </button>
                </div>
              </div>

              {/* Campaign */}
              <div className="mt-6">
                <h3 className="text-foreground font-semibold mb-3">Campaign</h3>
                <div className="bg-muted border border-border rounded-lg px-3 py-2">
                  <span className="text-sm text-foreground">{selectedPost.campaign}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
