'use client'

import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { StatsGrid } from '@/components/dashboard/stats-grid'
import { TopicSentimentHeatmap } from '@/components/dashboard/topic-sentiment-heatmap'
import { InfluencerTracker } from '@/components/dashboard/influencer-tracker'
import { OpponentNarrativeWatch } from '@/components/dashboard/opponent-narrative-watch'
import { SupportBaseEnergy } from '@/components/dashboard/support-base-energy'
import { GlobalSearch } from '@/components/ui/global-search'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { SegmentedControl } from '@/components/ui/segmented-control'

export default function Page() {
  const [range, setRange] = useState('24h')
  return (
    <PageLayout>
      <PageHeader 
        title="Intelligence Dashboard"
        description="Real-time insights on narratives, opponents, and public sentiment"
        actions={
          <>
            <GlobalSearch />
            <SegmentedControl
              options={[
                { label: '24 Hours', value: '24h' },
                { label: '7 Days', value: '7d' },
                { label: '30 Days', value: '30d' },
              ]}
              value={range}
              onChange={setRange}
              className="w-[280px]"
            />
          </>
        }
      />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1800px] mx-auto px-6 py-8 list-animate-in">
          <StatsGrid />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <TopicSentimentHeatmap />
            <InfluencerTracker />
            <OpponentNarrativeWatch />
            <SupportBaseEnergy />
          </div>
        </div>
      </main>
    </PageLayout>
  )
}
