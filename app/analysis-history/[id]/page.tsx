'use client'

import { useState, useRef } from 'react'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Download, Play, Square, RefreshCw, ChevronDown, ExternalLink, Heart, MessageCircle, Share2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FacebookIcon, InstagramIcon, TwitterIcon } from '@/components/ui/platform-icons'
import Link from 'next/link'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

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

const samplePosts: Post[] = [
  {
    id: '1',
    author: 'dubeyjikahin',
    platform: 'twitter',
    content: 'Bengaluru police taking strict action against social media content that violates community guidelines. #BengaluruPolice #SocialMedia',
    timestamp: '2 days ago',
    likes: 45,
    comments: 12,
    shares: 8,
    views: 1200,
    sentiment: 'neutral'
  },
  {
    id: '2',
    author: 'grok',
    platform: 'twitter',
    content: 'New AI model Grok Imagine launched with enhanced capabilities for content analysis and monitoring.',
    timestamp: '2 days ago',
    likes: 5,
    comments: 0,
    shares: 1,
    views: 800,
    sentiment: 'positive'
  },
  {
    id: '3',
    author: 'EnglishSalar',
    platform: 'twitter',
    content: 'Arrest made in Bengaluru for spreading misinformation on social media platforms. Police action shows commitment to digital safety.',
    timestamp: '2 days ago',
    likes: 23,
    comments: 5,
    shares: 3,
    views: 950,
    sentiment: 'positive'
  },
  {
    id: '4',
    author: 'DeccanChronicle',
    platform: 'twitter',
    content: 'Bengaluru police crackdown on fake news and hate speech online continues with multiple arrests this week.',
    timestamp: '2 days ago',
    likes: 67,
    comments: 15,
    shares: 12,
    views: 2100,
    sentiment: 'neutral'
  },
  {
    id: '5',
    author: 'JIMMY211711',
    platform: 'twitter',
    content: 'Personal experience with Bengaluru police response to online harassment complaint. Quick and professional action taken.',
    timestamp: '2 days ago',
    likes: 12,
    comments: 3,
    shares: 2,
    views: 600,
    sentiment: 'positive'
  },
  {
    id: '6',
    author: 'Misabh2020',
    platform: 'twitter',
    content: 'Concerns about freedom of expression vs. content moderation policies in Bengaluru. Need for balanced approach.',
    timestamp: '2 days ago',
    likes: 8,
    comments: 7,
    shares: 1,
    views: 450,
    sentiment: 'negative'
  }
]

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
    <div className={`bg-card border rounded-lg p-4 hover:bg-accent/20 transition-colors ${sentimentColors[post.sentiment]}`}>
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
        </div>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <Eye className="w-3 h-3 mr-1" />
          View
          <ExternalLink className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </div>
  )
}

export default function CampaignDetailPage() {
  const [selectedSentiment, setSelectedSentiment] = useState('all')
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [isMonitoring, setIsMonitoring] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const filteredPosts = samplePosts.filter(post => {
    const matchesSentiment = selectedSentiment === 'all' || post.sentiment === selectedSentiment
    const matchesPlatform = selectedPlatform === 'all' || post.platform === selectedPlatform
    return matchesSentiment && matchesPlatform
  })

  const handleExportPDF = async () => {
    if (!contentRef.current) return

    try {
      setIsExporting(true)

      // Create a new jsPDF instance
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      // Get the content element
      const content = contentRef.current

      // Convert HTML to canvas
      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#1a1a1a'
      })

      // Calculate dimensions
      const imgWidth = 210 // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      const pageHeight = 297 // A4 height in mm
      let heightLeft = imgHeight
      let position = 0

      // Convert canvas to image
      const imgData = canvas.toDataURL('image/png')

      // Add image to PDF (with pagination if needed)
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // Save the PDF
      const date = new Date().toISOString().split('T')[0]
      pdf.save(`bengaluru-police-campaign-${date}.pdf`)

    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <PageLayout>
      <div className="h-screen flex flex-col overflow-hidden">
        <PageHeader 
          title="Bengaluru Police"
          actions={
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleExportPDF}
                disabled={isExporting}
              >
                <Download className="w-4 h-4" />
                {isExporting ? 'Generating...' : 'Export PDF'}
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-green-900/20 border-green-800 text-green-400 hover:bg-green-900/30">
                <Play className="w-4 h-4" />
                Monitoring Active
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-red-900/20 border-red-800 text-red-400 hover:bg-red-900/30">
                <Square className="w-4 h-4" />
                Stop
              </Button>
              <Link href="/analysis-history">
                <Button variant="outline" size="sm">
                  Back
                </Button>
              </Link>
            </div>
          }
        />

        {/* Stats Bar */}
        <div className="border-b border-border bg-background px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">129</div>
                <div className="text-xs text-muted-foreground">POSTS</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">9.8K</div>
                <div className="text-xs text-muted-foreground">ENGAGE</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-400">9.2K</div>
                <div className="text-xs text-muted-foreground">LIKES</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">653</div>
                <div className="text-xs text-muted-foreground">SHARES</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Select value={selectedSentiment} onValueChange={setSelectedSentiment}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sentiment: All Sentiments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sentiments</SelectItem>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex gap-1">
                <Button
                  variant={selectedPlatform === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPlatform('all')}
                  className="text-xs"
                >
                  All Platforms (129)
                </Button>
                <Button
                  variant={selectedPlatform === 'facebook' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPlatform('facebook')}
                  className="text-xs gap-2"
                >
                  <FacebookIcon className="w-3 h-3" />
                  Facebook (0)
                </Button>
                <Button
                  variant={selectedPlatform === 'twitter' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPlatform('twitter')}
                  className="text-xs gap-2"
                >
                  <TwitterIcon className="w-3 h-3" />
                  Twitter (129)
                </Button>
                <Button
                  variant={selectedPlatform === 'instagram' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPlatform('instagram')}
                  className="text-xs gap-2"
                >
                  <InstagramIcon className="w-3 h-3" />
                  Instagram (0)
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div ref={contentRef} className="flex-1 flex overflow-hidden">
          {/* Left Column - Analytics */}
          <div className="w-full lg:w-1/2 border-r border-border bg-background p-4 sm:p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Posts Timeline */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-foreground font-semibold mb-4">Posts timeline (21 data points)</h3>
                <div className="h-48 bg-muted/20 rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <div className="text-2xl mb-2">📈</div>
                    <p>Timeline chart would be displayed here</p>
                    <p className="text-xs">Y-axis: 0-15 posts, X-axis: Time range</p>
                  </div>
                </div>
              </div>

              {/* Sentiment Distribution */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-foreground font-semibold mb-4">SENTIMENT DISTRIBUTION</h3>
                
                <div className="flex gap-6">
                  {/* Chart */}
                  <div className="flex-1 bg-muted/30 rounded-lg p-4">
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart 
                        data={[
                          { sentiment: 'Neutral', value: 73, color: '#8b8b8b' },
                          { sentiment: 'Negative', value: 18, color: '#ef4444' },
                          { sentiment: 'Positive', value: 9, color: '#22c55e' },
                        ]} 
                        margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          type="number"
                          domain={[0, 100]}
                          tick={{ fill: '#9ca3af', fontSize: 12 }}
                          axisLine={{ stroke: '#4b5563' }}
                        />
                        <YAxis 
                          dataKey="sentiment" 
                          type="category"
                          tick={{ fill: '#9ca3af', fontSize: 12 }}
                          axisLine={{ stroke: '#4b5563' }}
                        />
                        <Tooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-background px-3 py-2 rounded-lg shadow-lg border border-border">
                                  <p className="font-semibold text-foreground">{payload[0].payload.sentiment}</p>
                                  <p className="text-lg font-bold" style={{ color: payload[0].color }}>
                                    {payload[0].value}%
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                          {[
                            { sentiment: 'Neutral', value: 73, color: '#8b8b8b' },
                            { sentiment: 'Negative', value: 18, color: '#ef4444' },
                            { sentiment: 'Positive', value: 9, color: '#22c55e' },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Stats Panel */}
                  <div className="w-48 flex flex-col justify-center gap-4">
                    {[
                      { sentiment: 'Neutral', value: 73, color: '#8b8b8b' },
                      { sentiment: 'Negative', value: 18, color: '#ef4444' },
                      { sentiment: 'Positive', value: 9, color: '#22c55e' },
                    ].map((item) => (
                      <div key={item.sentiment}>
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <p className="text-sm font-medium text-muted-foreground">{item.sentiment}</p>
                        </div>
                        <p className="text-3xl font-bold text-foreground">{item.value}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Platforms */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-foreground font-semibold mb-4">Platforms</h3>
                <div className="flex items-center justify-center h-48">
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center mb-4">
                      <span className="text-white font-bold text-2xl">100%</span>
                    </div>
                    <div className="text-sm">
                      <div className="flex items-center gap-2 justify-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>Twitter 129</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Posts Grid */}
          <div className="w-full lg:w-1/2 bg-background p-4 sm:p-6 overflow-y-auto">
            <div className="grid gap-4">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}