'use client'

import { PageLayout } from '@/components/layout/page-layout'
import { Heart, MessageCircle, Share2, Eye, Copy, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'

export default function PostAnalysisPage() {
  return (
    <PageLayout>
      <div className="h-screen flex flex-col bg-black overflow-hidden">
        {/* Breadcrumb */}
        <div className="border-b border-zinc-800 px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Link href="/" className="hover:text-zinc-300">Dashboard</Link>
            <span>›</span>
            <Link href="/analysis-history" className="hover:text-zinc-300">History</Link>
            <span>›</span>
            <span className="text-white">Post Analysis</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Side - Post Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-2xl">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                    S
                  </div>
                  <div>
                    <div className="text-white font-medium">Safety Net of PA, LLC</div>
                    <div className="text-zinc-500 text-sm">Facebook · 14 hours ago</div>
                  </div>
                </div>

                <p className="text-white text-lg mb-6 leading-relaxed">
                  Let's not wait until October. Treat everyone nicely all year long! #bullyingpreventionmonth
                </p>

                <div className="flex items-center gap-6 text-zinc-400 text-sm">
                  <button className="flex items-center gap-2 hover:text-white transition-colors">
                    <Heart className="w-5 h-5" />
                    <span>0</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-white transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span>0</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-white transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span>0</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-blue-400 transition-colors ml-auto">
                    <span>View</span>
                    <Eye className="w-5 h-5" />
                    <span>0</span>
                  </button>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-6">
                <p className="text-zinc-300 leading-relaxed">
                  Let's not wait until October. Treat everyone nicely all year long! #bullyingpreventionmonth
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">💬 Comments (0)</h3>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400">
                      <span className="text-sm">+</span>
                    </button>
                    <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                  <p className="text-zinc-500 text-sm mb-1">No comments found yet</p>
                  <p className="text-zinc-600 text-xs">Campaign may still be starting up</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - AI Analysis */}
          <div className="w-full lg:w-[500px] border-l border-zinc-800 overflow-y-auto bg-zinc-950">
            <div className="p-6 space-y-6">
              {/* AI Analysis Header */}
              <div className="flex items-center gap-2 text-blue-400">
                <span className="text-lg">🤖</span>
                <h2 className="text-white font-semibold">AI Analysis</h2>
              </div>

              {/* Original Post Summary */}
              <div>
                <h3 className="text-white font-medium mb-3">Original Post Summary</h3>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                  <p className="text-zinc-300 text-sm leading-relaxed mb-3">
                    The post from Safety Net of PA encourages treating everyone nicely throughout the year, not just during October, which is Bullying Prevention Month. It promotes kindness and continuous anti-bullying efforts.
                  </p>
                  <div className="text-xs text-zinc-500">Relevance: 30.0%</div>
                </div>
              </div>

              {/* Sentiment */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-900/20 border border-green-800 rounded-lg">
                  <span className="text-green-400 font-medium">positive</span>
                </div>
              </div>

              {/* Relevance Score */}
              <div>
                <h3 className="text-white font-medium mb-3">Relevance Score</h3>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '38%' }} />
                  </div>
                  <span className="text-white font-medium text-sm">38.0%</span>
                </div>
              </div>

              {/* Topics */}
              <div>
                <h3 className="text-white font-medium mb-3">Topics</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 text-sm">
                    Bullying Prevention
                  </span>
                  <span className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 text-sm">
                    Kindness
                  </span>
                  <span className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 text-sm">
                    Social Awareness
                  </span>
                </div>
              </div>

              {/* Named Entities */}
              <div>
                <h3 className="text-white font-medium mb-3">🏷️ Named Entities</h3>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                  <span className="px-2 py-1 bg-green-900/20 border border-green-800 rounded text-green-400 text-sm">
                    Bullying Prevention Month
                  </span>
                </div>
              </div>

              {/* Organizations Mentioned */}
              <div>
                <h3 className="text-white font-medium mb-3">📋 Organizations Mentioned</h3>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                  <span className="px-2 py-1 bg-red-900/20 border border-red-800 rounded text-red-400 text-sm">
                    Safety Net of PA, LLC
                  </span>
                </div>
              </div>

              {/* Analysis Metadata */}
              <div>
                <h3 className="text-white font-medium mb-3">🔍 Analysis Metadata</h3>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Campaign ID:</span>
                    <span className="text-zinc-300 font-mono text-xs">cmpJvRxbo8N1c2b5Qnapk1sw</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Analysis Type:</span>
                    <span className="text-zinc-300">social_post</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Timestamp:</span>
                    <span className="text-zinc-300">10/1/2025 09:54 PM</span>
                  </div>
                </div>
              </div>

              {/* AI Quick Reply */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-medium">🤖 AI Quick Reply</h3>
                  <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" />
                    Regenerate
                  </button>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-blue-400 text-sm font-medium">AI Generated Response</span>
                    <span className="text-xs text-zinc-500">11:44 AM</span>
                  </div>
                  <p className="text-zinc-300 text-sm leading-relaxed mb-3">
                    This post does not require a response from BlrCityPolice.
                  </p>
                  <p className="text-zinc-400 text-sm">
                    This post does not require a response from BlrCityPolice.
                  </p>
                </div>

                <Textarea
                  placeholder="Type your response..."
                  className="bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 min-h-[100px] mb-3"
                />

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400">
                      <span className="text-sm">📎</span>
                    </button>
                    <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400">
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