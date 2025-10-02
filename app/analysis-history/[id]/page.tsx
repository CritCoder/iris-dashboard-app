'use client'

import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Download, Play, Square, RefreshCw, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CampaignDetailPage() {
  return (
    <PageLayout>
      <PageHeader 
        title="women safety blr"
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-green-900/20 border-green-800 text-green-400 hover:bg-green-900/30">
              <Play className="w-4 h-4" />
              Monitoring Active
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-red-900/20 border-red-800 text-red-400 hover:bg-red-900/30">
              <Square className="w-4 h-4" />
              Stop
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Link href="/analysis-history">
              <Button variant="outline" size="sm">
                Back
              </Button>
            </Link>
          </>
        }
      />
      
      <main className="max-w-[1800px] mx-auto px-6 py-8">
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-white mb-1">163</div>
            <div className="text-xs text-zinc-500">📝 POSTS</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-white mb-1">15.6K</div>
            <div className="text-xs text-zinc-500">👥 ENGAGE</div>
          </div>
          <div className="bg-green-900/20 border border-green-800/30 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-white mb-1">12.5K</div>
            <div className="text-xs text-green-400">💚 LIKES</div>
          </div>
          <div className="bg-purple-900/20 border border-purple-800/30 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-white mb-1">624</div>
            <div className="text-xs text-purple-400">🔄 SHARES</div>
          </div>
        </div>

        <div className="text-center py-20">
          <p className="text-zinc-500">Campaign analysis view - Implementation in progress</p>
        </div>
      </main>
    </PageLayout>
  )
}