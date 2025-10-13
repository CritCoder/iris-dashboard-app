'use client'

import { PageLayout } from '@/components/layout/page-layout'
import { Heart, MessageCircle, Share2, Eye, Copy, RefreshCw, BarChart3, Users, TrendingUp, AlertTriangle, Clock, MapPin, Hash, Calendar, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

export default function PostAnalysisPage() {
  const postData = {
    id: '6',
    platform: 'Facebook',
    author: {
      name: 'Safety Net of PA, LLC',
      avatar: 'S',
      handle: '@safetynetpa'
    },
    content: "Let's not wait until October. Treat everyone nicely all year long! #bullyingpreventionmonth",
    timestamp: '14 hours ago',
    engagement: {
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0
    },
    url: '#'
  }

  const analysisData = {
    sentiment: { label: 'Positive', value: 'positive', confidence: 0.85 },
    relevance: { score: 38.0, threshold: 70 },
    topics: ['Bullying Prevention', 'Kindness', 'Social Awareness', 'Anti-bullying'],
    entities: ['Bullying Prevention Month', 'October'],
    organizations: ['Safety Net of PA, LLC'],
    metadata: {
      campaignId: 'cmpJvRxbo8N1c2b5Qnapk1sw',
      analysisType: 'social_post',
      timestamp: '10/1/2025 09:54 PM',
      processingTime: '2.3s'
    }
  }

  const aiResponse = {
    generated: "This post does not require a response from BlrCityPolice.",
    timestamp: '11:44 AM',
    confidence: 0.92
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6 space-y-6">
          {/* Header with Post Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Post Card */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-600 text-white text-lg font-semibold">
                        {postData.author.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate">{postData.author.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {postData.platform}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{postData.timestamp}</span>
                        <span>•</span>
                        <span>{postData.author.handle}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={postData.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-foreground text-lg leading-relaxed">
                    {postData.content}
                  </p>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-muted-foreground text-sm">
                      <button className="flex items-center gap-2 hover:text-foreground transition-colors">
                        <Heart className="h-4 w-4" />
                        <span>{postData.engagement.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-foreground transition-colors">
                        <MessageCircle className="h-4 w-4" />
                        <span>{postData.engagement.comments}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-foreground transition-colors">
                        <Share2 className="h-4 w-4" />
                        <span>{postData.engagement.shares}</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Eye className="h-4 w-4" />
                      <span>{postData.engagement.views} views</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Sentiment</span>
                    <Badge variant={analysisData.sentiment.value === 'positive' ? 'default' : 'destructive'}>
                      {analysisData.sentiment.label}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Relevance</span>
                      <span className="font-medium">{analysisData.relevance.score}%</span>
                    </div>
                    <Progress value={analysisData.relevance.score} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Topics</span>
                    <span className="text-sm font-medium">{analysisData.topics.length}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    AI Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {aiResponse.generated}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Confidence: {(aiResponse.confidence * 100).toFixed(0)}%</span>
                    <span>{aiResponse.timestamp}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Analysis Tabs */}
          <Tabs defaultValue="analysis" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analysis
              </TabsTrigger>
              <TabsTrigger value="comments" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Comments (0)
              </TabsTrigger>
              <TabsTrigger value="engagement" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Engagement
              </TabsTrigger>
              <TabsTrigger value="response" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Response
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analysis" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Topics & Entities */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        Topics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {analysisData.topics.map((topic, index) => (
                          <Badge key={index} variant="secondary">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Named Entities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {analysisData.entities.map((entity, index) => (
                          <Badge key={index} variant="outline" className="border-green-200 text-green-700 dark:border-green-800 dark:text-green-300">
                            {entity}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Organizations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {analysisData.organizations.map((org, index) => (
                          <Badge key={index} variant="outline" className="border-red-200 text-red-700 dark:border-red-800 dark:text-red-300">
                            {org}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Metadata & Summary */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Analysis Metadata
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Campaign ID</span>
                          <p className="font-mono text-xs break-all">{analysisData.metadata.campaignId}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Analysis Type</span>
                          <p className="font-medium">{analysisData.metadata.analysisType}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Timestamp</span>
                          <p className="font-medium">{analysisData.metadata.timestamp}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Processing Time</span>
                          <p className="font-medium">{analysisData.metadata.processingTime}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Post Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                        The post from Safety Net of PA encourages treating everyone nicely throughout the year, 
                        not just during October, which is Bullying Prevention Month. It promotes kindness and 
                        continuous anti-bullying efforts.
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Relevance Score</span>
                        <Badge variant="outline">{analysisData.relevance.score}%</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="comments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Comments
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                      <Button variant="outline" size="sm">
                        <span className="mr-2">+</span>
                        Add Comment
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium text-foreground mb-2">No comments yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Comments will appear here once users start engaging with this post.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="engagement" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Likes</p>
                        <p className="text-2xl font-bold">{postData.engagement.likes}</p>
                      </div>
                      <Heart className="h-8 w-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Comments</p>
                        <p className="text-2xl font-bold">{postData.engagement.comments}</p>
                      </div>
                      <MessageCircle className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Shares</p>
                        <p className="text-2xl font-bold">{postData.engagement.shares}</p>
                      </div>
                      <Share2 className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Views</p>
                        <p className="text-2xl font-bold">{postData.engagement.views}</p>
                      </div>
                      <Eye className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Engagement Timeline</CardTitle>
                  <CardDescription>
                    Track how engagement has evolved over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium text-foreground mb-2">No engagement data yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Engagement metrics will appear here as users interact with the post.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="response" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      AI Response Generator
                    </div>
                    <Button variant="ghost" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        AI Generated
                      </Badge>
                      <span className="text-xs text-muted-foreground">{aiResponse.timestamp}</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                      {aiResponse.generated}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">Custom Response</label>
                    <Textarea
                      placeholder="Type your response here..."
                      className="min-h-[120px]"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <span className="mr-2">📎</span>
                          Attach
                        </Button>
                        <Button variant="outline" size="sm">
                          <span className="mr-2">😊</span>
                          Emoji
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Copy className="h-4 w-4 mr-2" />
                          Copy AI Response
                        </Button>
                        <Button size="sm">
                          Send Response
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  )
}