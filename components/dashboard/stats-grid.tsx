import { TrendingUp, TrendingDown } from 'lucide-react'
import { usePoliticalStats } from '@/hooks/use-api'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { staggerContainerVariants, listItemVariants, liftGlowVariants } from '@/lib/motion'

// Type definition for stats data
interface StatsData {
  totalPosts: number
  totalEngagement: number
  positiveSentiment: number
  activeCampaigns: number
  postsTrend?: number
  engagementTrend?: number
  campaignsTrend?: number
}

interface StatCardProps {
  value: string
  label: string
  sublabel?: string
  trend?: number
  accent?: boolean
}

function StatCard({ value, label, sublabel, trend, accent = false }: StatCardProps) {
  return (
    <motion.div 
      className="bg-card border border-border rounded-lg p-6"
      variants={liftGlowVariants}
      initial="initial"
      whileHover="hover"
    >
      <div className="flex items-start justify-between mb-2">
        <motion.div 
          className="text-4xl font-bold text-foreground"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {value}
        </motion.div>
        {trend && (
          <motion.div 
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded border ${
              trend > 0 ? 'bg-secondary text-muted-foreground border-border' : 'bg-secondary text-muted-foreground border-border'
            }`}
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </motion.div>
        )}
      </div>
      <div className="text-sm text-muted-foreground font-medium mb-1">{label}</div>
      {sublabel && <div className="text-xs text-muted-foreground">{sublabel}</div>}
      {accent && (
        <motion.div 
          className="mt-4 h-1 bg-primary/20 rounded-full overflow-hidden"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ transformOrigin: 'left' }}
        />
      )}
    </motion.div>
  )
}

function SentimentBar({ positive }: { positive: number }) {
  return (
    <motion.div 
      className="bg-card border border-border rounded-lg p-6"
      variants={liftGlowVariants}
      initial="initial"
      whileHover="hover"
    >
      <div className="flex items-baseline justify-between mb-3">
        <motion.div 
          className="text-4xl font-bold text-foreground"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {positive}%
        </motion.div>
        <div className="text-sm text-muted-foreground font-medium">Positive Sentiment</div>
      </div>
      <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-primary/60 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${positive}%` }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <motion.div 
        className="mt-3 flex justify-between text-xs text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <span>Negative</span>
        <span>Neutral</span>
        <span>Positive</span>
      </motion.div>
    </motion.div>
  )
}

export function StatsGrid() {
  const { data: stats, loading, error } = usePoliticalStats({ timeRange: '7d', cached: true })
  
  // Mock data for when API is not available
  const mockStats: StatsData = {
    totalPosts: 14200,
    totalEngagement: 830400,
    positiveSentiment: 68,
    activeCampaigns: 8,
    postsTrend: 12,
    engagementTrend: 24,
    campaignsTrend: 8
  }
  
  // Process API data with fallbacks
  const displayData: StatsData = {
    totalPosts: (stats as any)?.overview?.totalPosts || mockStats.totalPosts,
    totalEngagement: (stats as any)?.overview?.totalEngagement || mockStats.totalEngagement,
    positiveSentiment: (stats as any)?.sentiment?.positive?.percentage || mockStats.positiveSentiment,
    activeCampaigns: (stats as any)?.overview?.activeCampaigns || mockStats.activeCampaigns,
    postsTrend: (stats as any)?.trends?.posts || mockStats.postsTrend,
    engagementTrend: (stats as any)?.trends?.engagement || mockStats.engagementTrend,
    campaignsTrend: (stats as any)?.trends?.campaigns || mockStats.campaignsTrend
  }

  // Show loading for only 2 seconds max, then show mock data
  const [showLoading, setShowLoading] = useState(true)
  
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setShowLoading(false)
      }, 2000)
      return () => clearTimeout(timer)
    } else {
      setShowLoading(false)
    }
  }, [loading])

  if (showLoading && loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
            <div className="h-8 bg-secondary rounded mb-2" />
            <div className="h-4 bg-secondary rounded mb-1" />
            <div className="h-3 bg-secondary rounded w-2/3" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={listItemVariants}>
        <StatCard 
          value={`${((displayData.totalPosts || 0) / 1000).toFixed(1)}K`}
          label="Total Posts" 
          trend={displayData.postsTrend} 
          accent 
        />
      </motion.div>
      <motion.div variants={listItemVariants}>
        <StatCard 
          value={`${((displayData.totalEngagement || 0) / 1000).toFixed(1)}K`}
          label="Total Engagement" 
          trend={displayData.engagementTrend} 
          accent 
        />
      </motion.div>
      <motion.div variants={listItemVariants}>
        <SentimentBar positive={displayData.positiveSentiment || 0} />
      </motion.div>
      <motion.div variants={listItemVariants}>
        <StatCard 
          value={(displayData.activeCampaigns || 0).toString()}
          label="Active Campaigns" 
          trend={displayData.campaignsTrend} 
          accent 
        />
      </motion.div>
    </motion.div>
  )
}
