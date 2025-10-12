'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Search, Heart, MessageCircle, Share2, Eye, Plus, FolderPlus, Flag, CheckCircle, Archive, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FacebookIcon, InstagramIcon, TwitterIcon } from '@/components/ui/platform-icons'
import { useSocialPosts, useInboxStats } from '@/hooks/use-api'
import { AnimatedPage, AnimatedList, AnimatedCard, FadeIn } from '@/components/ui/animated'

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

  // Determine why this post is showing
  const getAlertReason = () => {
    const reasons = []
    if (post.priority === 'HIGH') reasons.push({ icon: '🚨', text: 'High Priority Alert', color: 'text-red-500' })
    if (post.likes > 1000 || post.comments > 100) reasons.push({ icon: '📈', text: 'High Engagement', color: 'text-blue-500' })
    if (post.relevanceScore > 80) reasons.push({ icon: '🎯', text: 'High Relevance', color: 'text-purple-500' })
    return reasons[0] || { icon: '📬', text: 'Needs Review', color: 'text-gray-500' }
  }

  const alertReason = getAlertReason()

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
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColors[post.priority]}`}>
              {post.priority}
            </span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium bg-accent/50 ${alertReason.color} flex items-center gap-1`}>
              <span>{alertReason.icon}</span>
              <span>{alertReason.text}</span>
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
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [showAddNote, setShowAddNote] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'posts' | 'notes'>('posts')
  const [selectedSentiment, setSelectedSentiment] = useState('all')
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [selectedCampaign, setSelectedCampaign] = useState('all')
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h')
  const [sortBy, setSortBy] = useState('date')

  // Fetch posts that need attention/review - using production API
  const { data: apiPosts, loading, error } = useSocialPosts({
    needsAttention: true,
    reviewStatus: 'pending',
    page: 1,
    limit: 100 // Increased limit to fetch more posts
  })

  const { data: inboxStats } = useInboxStats({ timeRange: '7d' })

  // Use API data from production database
  const posts = apiPosts || []

  // Auto-select first post when posts are available and no post is selected
  useEffect(() => {
    if (posts && posts.length > 0 && !selectedPost) {
      setSelectedPost(posts[0])
    }
  }, [posts, selectedPost])

  // Keyboard shortcuts for lightning-fast navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      const currentIndex = selectedPost ? posts.findIndex(p => p.id === selectedPost.id) : -1

      switch (e.key) {
        // Navigation
        case 'ArrowDown':
        case 'j': // Vim-style
          e.preventDefault()
          if (currentIndex < posts.length - 1) {
            setSelectedPost(posts[currentIndex + 1])
          }
          break

        case 'ArrowUp':
        case 'k': // Vim-style
          e.preventDefault()
          if (currentIndex > 0) {
            setSelectedPost(posts[currentIndex - 1])
          }
          break

        // Actions
        case 'c':
          e.preventDefault()
          // Add to Campaign
          console.log('Add to Campaign')
          break

        case 'f':
          e.preventDefault()
          // Flag for Review
          console.log('Flag for Review')
          break

        case 'r':
          e.preventDefault()
          // Mark as Read
          console.log('Mark as Read')
          break

        case 'a':
          e.preventDefault()
          // Archive
          console.log('Archive')
          break

        case 'n':
          e.preventDefault()
          // Toggle Add Note
          setShowAddNote(prev => !prev)
          break

        // Tab switching
        case '1':
          e.preventDefault()
          setActiveTab('posts')
          break

        case '2':
          e.preventDefault()
          setActiveTab('notes')
          break

        // Search focus
        case '/':
          e.preventDefault()
          document.querySelector<HTMLInputElement>('input[type="text"]')?.focus()
          break

        // Escape - clear search or close note
        case 'Escape':
          if (showAddNote) {
            setShowAddNote(false)
            setNoteText('')
          } else {
            setSearchQuery('')
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [posts, selectedPost, showAddNote])

  return (
    <PageLayout>
      <div className="h-screen flex flex-col overflow-hidden w-full min-h-screen">
        <PageHeader
          title="Social Inbox"
          description="New posts from all campaigns"
          actions={
            <div className="w-full">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
                {/* Tab Toggle */}
                <div className="flex items-center bg-muted/50 rounded-md border border-border overflow-hidden">
                  <button 
                    onClick={() => setActiveTab('posts')}
                    className={`px-4 py-2 text-sm font-medium transition-all duration-200 border-r border-border ${
                      activeTab === 'posts' 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                  >
                    Inbox Posts
                  </button>
                  <button 
                    onClick={() => setActiveTab('notes')}
                    className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      activeTab === 'notes' 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                  >
                    Saved Notes
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Sentiment Filter */}
                  <select 
                    value={selectedSentiment}
                    onChange={(e) => setSelectedSentiment(e.target.value)}
                    className="bg-background border border-border rounded-md px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30"
                  >
                    <option value="all">All Sentiments</option>
                    <option value="POSITIVE">Positive</option>
                    <option value="NEGATIVE">Negative</option>
                    <option value="NEUTRAL">Neutral</option>
                    <option value="MIXED">Mixed</option>
                  </select>

                  {/* Platform Filter */}
                  <select 
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="bg-background border border-border rounded-md px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30"
                  >
                    <option value="all">All Platforms</option>
                    <option value="twitter">Twitter</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                    <option value="india-news">India News</option>
                  </select>

                  {/* Campaign Filter */}
                  <select 
                    value={selectedCampaign}
                    onChange={(e) => setSelectedCampaign(e.target.value)}
                    className="bg-background border border-border rounded-md px-2 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 max-w-[10rem] truncate"
                  >
                    <option value="all">All Campaigns</option>
                    <option value="cmgjzn11q0001z2alaq70ckwk">Bengaluru Police</option>
                    <option value="cmgjzjpf50001z2yqum0gfs8a">Bengaluru Police</option>
                    <option value="cmgjz4l4k0001z2cknnhlna63">Karnataka</option>
                    <option value="cmghzsbzu0001z2ks8m3lkqwy">Karnataka</option>
                    <option value="cmghlcu8i00b1z2ulan0hltsc">Person: Namma Karnataka Sene</option>
                    <option value="cmggordtg00ahz2ulvpwmh2c2">https://www.facebook.com/share/17Uviu2NRS/</option>
                    <option value="cmggomfez00adz2ulbx65o7ta">[8:20 pm, 7/10/2025] Manju Cdr Ccps: https://www.facebook.com/share/15hQEYpsJg/ [8:20 pm, 7/10/2025] Manju Cdr Ccps: https://www.facebook.com/share/19QKn8syac/ [8:20 pm, 7/10/2025] Manju Cdr Ccps: https://www.facebook.com/share/1A6jV8udxm/ [8:20 pm, 7/10/2025] Manju Cdr Ccps: https://www.facebook.com/share/17Uviu2NRS/</option>
                    <option value="cmgf1njtx000hz2ulnb7tt1o5">Namma Karnataka Sene</option>
                    <option value="cmgf1hd160003z2ul846zyil1">Namma Karnataka Sene</option>
                    <option value="cmgf0cqjl006tz21oqzh47ko2">Person: kiran_murthy_</option>
                    <option value="cmgf0b9ox006pz21oxhlst5r7">Person: @kiranmurthy</option>
                    <option value="cmgf09e56006lz21odzy5zkeb">PAVANKALYAN</option>
                    <option value="cmgezjz1q0069z21olev19tk3">Person: yenri_mediaa_</option>
                    <option value="cmgezggpq0065z21owi57rlv5">https://www.instagram.com/stories/ganesh__thanushree_/</option>
                    <option value="cmgez9r6g005xz21orvu254i0">BANGALORE PROTEST</option>
                    <option value="cmgeyjmsb004zz21oczivhqs2">BlrCityPolice</option>
                    <option value="cmgeybbcj004dz21owmdvctzi">Person: @rytdwrong</option>
                    <option value="cmgey3uou003hz21o1d7v3a8l">#pavankalyan</option>
                    <option value="cmgexzr2e0035z21olrzgr6qr">@rytdwrong</option>
                    <option value="cmgexxhfe002xz21oy24q4zyb">pavan kalyan visit</option>
                    <option value="cmgexvufc002tz21opejgkg61">pavan kalyan visit</option>
                    <option value="cmgew0hk5001dz21o26089sfy">I LOVE MOHAMMADA</option>
                    <option value="cmgeuzzte000hz21otshx88k2">Person: BlrCityPolice</option>
                    <option value="cmgbvyjuj005zz2quv8c7mp28">bengaluru dasara</option>
                    <option value="cmgazwhd40031z2que2uhbuzh">the wholetruth foods</option>
                    <option value="cmgamhaxm0019z2qu1ga00opq">social media</option>
                    <option value="cmgaltvwr000xz2que4fq08v6">ರೈತರ ಭೂಸ್ವಾದಿನ ಹೋರಾಟ</option>
                    <option value="cmgalozw6000pz2qu6krys0mu">gen-Z karnataka</option>
                    <option value="cmgal9c16000dz2quurnwe3cj">Person: Kavanagala__kavitegara___anita</option>
                    <option value="cmgal6hkn0009z2qu72fqfju2">Person: https://www.instagram.com/kavanagala__kavitegara___anita?igsh=MTlmb2dyZzl0YzVwcQ==</option>
                    <option value="cmgal3i0p0005z2quvmfsxbjf">Person: tourismcares</option>
                    <option value="cmgakel42001vz2dt29ptboaa">Person: kavanagala_kavitegara_anita</option>
                    <option value="cmgak4ote001pz2dtf53lu6pq">Person: nasa</option>
                    <option value="cmgak40vs001dz2dthcg7mzrn">Person: nasa</option>
                    <option value="cmg4v0oeo0015z25e2napklew">women safety blr</option>
                    <option value="cmg4uu17s000hz25eiw0gcdwe">kanakpura taluk</option>
                    <option value="cmg4u8zpr0009z25efza5o89x">whitefield bengaluru</option>
                    <option value="cmg4tfvqu002dz2hb48gzy7qz">whitefield</option>
                    <option value="cmg4t110g0023z2hbxbjch5rj">bellandur</option>
                    <option value="cmg44b9200003z25vdrgrpzi4">bengaluru police</option>
                    <option value="cmg27ryub004xz2iwa19kbat6">dharmasthala</option>
                    <option value="cmg1vlcou0019z2iw3jadm3wx">https://www.instagram.com/noel.sdh?igsh=ejE0dXU1dGJpNGFh</option>
                    <option value="cmg0jamy400j5z2q4smnpy8pi">@karnatakaportfolio_</option>
                    <option value="cmg0iwdsc00irz2q4bjjsdbip">https://www.instagram.com/share/p/BAIi6rar/M</option>
                    <option value="cmg0irpnh00inz2q4ros3j5tp">https://www.instagram.com/share/reel/_38TPRUCC</option>
                    <option value="cmfzfjttw00frz2q42jxyqp4k">MA SALEEM</option>
                    <option value="cmfzfewgd00fnz2q4i5n7mqrn">BCP</option>
                    <option value="cmfzb7lb600e9z2q441t9wd9u">manemanepolice</option>
                    <option value="cmfxwg4fu009lz2q4uzev1rni">S L Bhyrappa</option>
                    <option value="cmfxwezq6009hz2q4ob76nlst">S L Bhyrappa</option>
                    <option value="cmfwptjon0049z2q43qv6v35j">vaibhavceramics2025</option>
                    <option value="cmfwjtiuq0037z2q4hcaxf3cw">dasara</option>
                    <option value="cmfwjsh1m0031z2q4vjqctbfz">chain snatch</option>
                    <option value="cmfus0rj4001nz2b5if1stf0d">Banu Mushtaq</option>
                    <option value="cmfurzgg0001jz2b56jxmo12r">Mysore Dasara</option>
                    <option value="cmftn1zqa0017z2gnxxjcch1u">modi ji</option>
                    <option value="cmdmvv64a0005z204lkihy0gl">@blrcitypolice</option>
                    <option value="cmdk56kqg0001z2yxe0f73hyv">bangalore traffic</option>
                  </select>

                  {/* Time Range Filter */}
                  <select 
                    value={selectedTimeRange}
                    onChange={(e) => setSelectedTimeRange(e.target.value)}
                    className="bg-background border border-border rounded-md px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30"
                  >
                    <option value="30m">Last 30 Minutes</option>
                    <option value="1h">Last 1 Hour</option>
                    <option value="6h">Last 6 Hours</option>
                    <option value="12h">Last 12 Hours</option>
                    <option value="24h">Last 24 Hours</option>
                    <option value="3d">Last 3 Days</option>
                    <option value="1w">Last Week</option>
                    <option value="1m">Last Month</option>
                    <option value="custom">Custom Range</option>
                  </select>

                  {/* Sort Filter */}
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-background border border-border rounded-md px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="relevance">Sort by Relevance</option>
                  </select>

                  {/* Reset Button */}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedSentiment('all')
                      setSelectedPlatform('all')
                      setSelectedCampaign('all')
                      setSelectedTimeRange('24h')
                      setSortBy('date')
                      setSearchQuery('')
                    }}
                    className="bg-background hover:bg-accent border border-border hover:border-accent/50"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          }
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden w-full h-full">
          {/* Left Column - Post List */}
          <div className="w-full lg:w-[300px] border-r border-border bg-background flex-shrink-0 flex flex-col h-full max-h-[40vh] lg:max-h-none">
            <div className="p-3 sm:p-4 border-b border-border flex-shrink-0">
              <h2 className="text-foreground font-semibold mb-1 text-sm sm:text-base">Inbox ({posts?.length || 0})</h2>
              <p className="text-xs text-muted-foreground">New posts that have not been classified yet</p>
            </div>
            <div className="divide-y divide-border flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-4 space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-secondary rounded w-3/4 mb-2" />
                      <div className="h-3 bg-secondary rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : posts && posts.length > 0 ? (
                posts.map((post) => (
                  <PostListItem
                    key={post.id}
                    post={post}
                    isSelected={selectedPost?.id === post.id}
                    onClick={() => setSelectedPost(post)}
                  />
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <p>No posts requiring attention at the moment.</p>
                </div>
              )}
            </div>
          </div>

          {/* Center Column - Post Detail (Main Focus) */}
          <div className="flex-1 overflow-y-auto min-w-0 h-full max-w-4xl mx-auto">
            {selectedPost ? (
              <AnimatedPage className="p-4 sm:p-8 max-w-4xl mx-auto">
                {/* Selected Post - Centered and Prominent */}
                <FadeIn className="bg-card border border-border rounded-xl p-8 mb-8 list-animate-in shadow-sm">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-foreground font-semibold text-lg">
                      {selectedPost.author[0]}
                    </div>
                    <div className="flex-1">
                      <div className="text-foreground font-semibold text-lg mb-1">{selectedPost.author}</div>
                      <div className="text-muted-foreground text-sm flex items-center gap-2">
                        <span className="capitalize">{selectedPost.platform}</span>
                        <span>•</span>
                        <span>{selectedPost.timestamp}</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          selectedPost.priority === 'HIGH' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                          selectedPost.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        }`}>
                          {selectedPost.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-foreground/90 mb-6 leading-relaxed text-base whitespace-pre-wrap break-words">{selectedPost.content}</p>

                  <div className="flex items-center justify-between pt-6 border-t border-border">
                    <div className="flex items-center gap-8">
                      <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        <Heart className="w-5 h-5" />
                        <span className="font-medium">{selectedPost.likes.toLocaleString()}</span>
                      </button>
                      <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span className="font-medium">{selectedPost.comments.toLocaleString()}</span>
                      </button>
                      <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        <Share2 className="w-5 h-5" />
                        <span className="font-medium">{selectedPost.shares.toLocaleString()}</span>
                      </button>
                    </div>
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                      <Eye className="w-5 h-5" />
                      <span className="font-medium">{selectedPost.views.toLocaleString()} views</span>
                    </button>
                  </div>
                </FadeIn>

                {/* Post Analytics - Centered */}
                <div className="bg-card border border-border rounded-xl p-8 mb-8 shadow-sm">
                  <h3 className="text-foreground font-semibold text-xl mb-6">Post Analytics</h3>
                  
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-base text-muted-foreground">Relevance Score</span>
                      <span className="text-foreground font-semibold text-lg">{selectedPost.relevanceScore}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-3">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${selectedPost.relevanceScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-3xl font-bold text-foreground mb-2">{selectedPost.likes.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Likes</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-3xl font-bold text-foreground mb-2">{selectedPost.shares.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Shares</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-3xl font-bold text-foreground mb-2">{selectedPost.comments.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Comments</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-3xl font-bold text-foreground mb-2">{selectedPost.views.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Views</div>
                    </div>
                  </div>
                </div>

                {/* Actions - Centered */}
                <div className="bg-card border border-border rounded-xl p-8 mb-8 shadow-sm">
                  <h3 className="text-foreground font-semibold text-xl mb-6">Quick Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button className="flex items-center gap-4 p-5 bg-blue-500/10 hover:bg-blue-500/20 border-2 border-blue-500/30 hover:border-blue-500/50 rounded-xl transition-all duration-200 group">
                      <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FolderPlus className="w-6 h-6 text-blue-500" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-foreground font-semibold text-base mb-1">Add to Campaign</div>
                        <div className="text-sm text-muted-foreground">Include in an existing campaign</div>
                      </div>
                    </button>

                    <button className="flex items-center gap-4 p-5 bg-amber-500/10 hover:bg-amber-500/20 border-2 border-amber-500/30 hover:border-amber-500/50 rounded-xl transition-all duration-200 group">
                      <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Flag className="w-6 h-6 text-amber-500" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-foreground font-semibold text-base mb-1">Flag for Review</div>
                        <div className="text-sm text-muted-foreground">Mark as requiring attention</div>
                      </div>
                    </button>

                    <button className="flex items-center gap-4 p-5 bg-green-500/10 hover:bg-green-500/20 border-2 border-green-500/30 hover:border-green-500/50 rounded-xl transition-all duration-200 group">
                      <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-foreground font-semibold text-base mb-1">Mark as Read</div>
                        <div className="text-sm text-muted-foreground">Mark as reviewed and complete</div>
                      </div>
                    </button>

                    <button className="flex items-center gap-4 p-5 bg-zinc-500/10 hover:bg-zinc-500/20 border-2 border-zinc-500/30 hover:border-zinc-500/50 rounded-xl transition-all duration-200 group">
                      <div className="w-12 h-12 rounded-lg bg-zinc-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Archive className="w-6 h-6 text-zinc-400" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-foreground font-semibold text-base mb-1">Archive</div>
                        <div className="text-sm text-muted-foreground">Move to archive for later</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Notes - Centered */}
                <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-foreground font-semibold text-xl">Notes</h3>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setShowAddNote(!showAddNote)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Note
                    </Button>
                  </div>

                  {showAddNote && (
                    <div className="mb-6">
                      <Textarea
                        placeholder="Add your note here..."
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        className="mb-4 min-h-[100px]"
                      />
                      <div className="flex gap-3 justify-center">
                        <Button size="lg" onClick={() => {
                          // Handle save note
                          setShowAddNote(false)
                          setNoteText('')
                        }}>
                          Save Note
                        </Button>
                        <Button variant="outline" size="lg" onClick={() => {
                          setShowAddNote(false)
                          setNoteText('')
                        }}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="text-center text-muted-foreground py-8">
                      No notes added yet.
                    </div>
                  </div>
                </div>
              </AnimatedPage>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <div className="text-6xl mb-4">📧</div>
                  <h3 className="text-xl font-semibold mb-2">Select a post from the inbox</h3>
                  <p>Choose a post from the left sidebar to view detailed information and analytics.</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Quick Details */}
          <div className="w-full lg:w-[320px] bg-muted/30 p-4 sm:p-6 overflow-y-auto">
            <h3 className="text-foreground font-semibold mb-4">Quick Details</h3>
            
            {selectedPost ? (
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-muted-foreground">Platform:</span>
                      <span className="text-sm text-foreground font-medium capitalize">{selectedPost.platform}</span>
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
                      <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                        selectedPost.priority === 'HIGH' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                        selectedPost.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                        'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      }`}>
                        {selectedPost.priority}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-muted-foreground">Relevance:</span>
                        <span className="text-sm text-foreground font-medium">{selectedPost.relevanceScore}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-foreground font-semibold mb-3">Campaign</h3>
                  <div className="bg-muted border border-border rounded-lg px-3 py-2">
                    <span className="text-sm text-foreground">{selectedPost.campaign}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <p>Select a post to view details.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}