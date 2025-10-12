'use client'

import { PageLayout } from '@/components/layout/page-layout'
import { Heart, MessageCircle, Share2, Eye, Copy, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'

export default function PostAnalysisPage() {
  return (
    <PageLayout>
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        {/* Breadcrumb */}
        <div className="border-b border-border px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Dashboard</Link>
            <span>›</span>
            <Link href="/analysis-history" className="hover:text-foreground">History</Link>
            <span>›</span>
            <span className="text-foreground">Post Analysis</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Side - Post Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-2xl">
              <div className="bg-card border border-border rounded-lg p-6 mb-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                    S
                  </div>
                  <div>
                    <div className="text-foreground font-medium">Safety Net of PA, LLC</div>
                    <div className="text-muted-foreground text-sm">Facebook · 14 hours ago</div>
                  </div>
                </div>

                <p className="text-foreground text-lg mb-6 leading-relaxed">
                  Let's not wait until October. Treat everyone nicely all year long! #bullyingpreventionmonth
                </p>

                <div className="flex items-center gap-6 text-muted-foreground text-sm">
                  <button className="flex items-center gap-2 hover:text-foreground transition-colors">
                    <Heart className="w-5 h-5" />
                    <span>0</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-foreground transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span>0</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-foreground transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span>0</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-blue-600 transition-colors ml-auto">
                    <span>View</span>
                    <Eye className="w-5 h-5" />
                    <span>0</span>
                  </button>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-foreground font-semibold">💬 Comments (0)</h3>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-accent rounded-lg transition-colors text-muted-foreground">
                      <span className="text-sm">+</span>
                    </button>
                    <button className="p-2 hover:bg-accent rounded-lg transition-colors text-muted-foreground">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm mb-1">No comments found yet</p>
                  <p className="text-muted-foreground text-xs">Campaign may still be starting up</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - AI Analysis */}
          <div className="w-full lg:w-[500px] border-l border-border overflow-y-auto bg-muted/30">
            <div className="p-6 space-y-6">
              {/* AI Analysis Header */}
              <div className="flex items-center gap-2 text-primary">
                <span className="text-lg">🤖</span>
                <h2 className="text-foreground font-semibold">AI Analysis</h2>
              </div>

              {/* Original Post Summary */}
              <div>
                <h3 className="text-foreground font-medium mb-3">Original Post Summary</h3>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-foreground text-sm leading-relaxed mb-3">
                    The post from Safety Net of PA encourages treating everyone nicely throughout the year, not just during October, which is Bullying Prevention Month. It promotes kindness and continuous anti-bullying efforts.
                  </p>
                  <div className="text-xs text-muted-foreground">Relevance: 30.0%</div>
                </div>
              </div>

              {/* Sentiment */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <span className="text-green-600 dark:text-green-400 font-medium">positive</span>
                </div>
              </div>

              {/* Relevance Score */}
              <div>
                <h3 className="text-foreground font-medium mb-3">Relevance Score</h3>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '38%' }} />
                  </div>
                  <span className="text-foreground font-medium text-sm">38.0%</span>
                </div>
              </div>

              {/* Topics */}
              <div>
                <h3 className="text-foreground font-medium mb-3">Topics</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-secondary border border-border rounded-lg text-foreground text-sm">
                    Bullying Prevention
                  </span>
                  <span className="px-3 py-1.5 bg-secondary border border-border rounded-lg text-foreground text-sm">
                    Kindness
                  </span>
                  <span className="px-3 py-1.5 bg-secondary border border-border rounded-lg text-foreground text-sm">
                    Social Awareness
                  </span>
                </div>
              </div>

              {/* Named Entities */}
              <div>
                <h3 className="text-foreground font-medium mb-3">🏷️ Named Entities</h3>
                <div className="bg-card border border-border rounded-lg p-3">
                  <span className="px-2 py-1 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded text-green-600 dark:text-green-400 text-sm">
                    Bullying Prevention Month
                  </span>
                </div>
              </div>

              {/* Organizations Mentioned */}
              <div>
                <h3 className="text-foreground font-medium mb-3">📋 Organizations Mentioned</h3>
                <div className="bg-card border border-border rounded-lg p-3">
                  <span className="px-2 py-1 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-600 dark:text-red-400 text-sm">
                    Safety Net of PA, LLC
                  </span>
                </div>
              </div>

              {/* Analysis Metadata */}
              <div>
                <h3 className="text-foreground font-medium mb-3">🔍 Analysis Metadata</h3>
                <div className="bg-card border border-border rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Campaign ID:</span>
                    <span className="text-foreground font-mono text-xs">cmpJvRxbo8N1c2b5Qnapk1sw</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Analysis Type:</span>
                    <span className="text-foreground">social_post</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Timestamp:</span>
                    <span className="text-foreground">10/1/2025 09:54 PM</span>
                  </div>
                </div>
              </div>

              {/* AI Quick Reply */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-foreground font-medium">🤖 AI Quick Reply</h3>
                  <button className="text-primary hover:text-primary/80 text-sm flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" />
                    Regenerate
                  </button>
                </div>

                <div className="bg-card border border-border rounded-lg p-4 mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-primary text-sm font-medium">AI Generated Response</span>
                    <span className="text-xs text-muted-foreground">11:44 AM</span>
                  </div>
                  <p className="text-foreground text-sm leading-relaxed mb-3">
                    This post does not require a response from BlrCityPolice.
                  </p>
                  <p className="text-muted-foreground text-sm">
                    This post does not require a response from BlrCityPolice.
                  </p>
                </div>

                <Textarea
                  placeholder="Type your response..."
                  className="bg-background border-input text-foreground placeholder-muted-foreground min-h-[100px] mb-3"
                />

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-accent rounded-lg transition-colors text-muted-foreground">
                      <span className="text-sm">📎</span>
                    </button>
                    <button className="p-2 hover:bg-accent rounded-lg transition-colors text-muted-foreground">
                      <span className="text-sm">😊</span>
                    </button>
                  </div>
                  <Button size="sm" className="gap-2">
                    <Copy className="w-4 h-4" />
                    Copy Reply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}