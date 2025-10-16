import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Critical Alert Skeleton */}
      <div className="p-4 border border-border rounded-lg">
        <div className="flex items-center gap-3">
          <Skeleton className="w-2 h-2 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-64" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Trending Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendingTopicsSkeleton />
        <TrendingTopicsSkeleton />
      </div>
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="w-8 h-8 rounded" />
      </div>
      <Skeleton className="h-8 w-24 mb-2" />
      <Skeleton className="h-4 w-20" />
    </div>
  )
}

export function TrendingTopicsSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <Skeleton className="h-6 w-40 mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-6 w-12" />
          </div>
        ))}
      </div>
    </div>
  )
}

