import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Critical Alert Skeleton */}
      <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div className="flex items-center gap-3">
          <Skeleton className="w-2 h-2 rounded-full bg-red-200 dark:bg-red-800" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-40 bg-red-200 dark:bg-red-800" />
            <Skeleton className="h-3 w-80 bg-red-200 dark:bg-red-800" />
          </div>
          <Skeleton className="h-9 w-24 bg-red-200 dark:bg-red-800" />
        </div>
      </div>

      {/* Stats Grid - Better responsive layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendingTopicsSkeleton />
        <TrendingTopicsSkeleton />
      </div>
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-28 lg:w-32" />
        <Skeleton className="w-8 h-8 rounded-lg" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-8 w-20 lg:w-24" />
        <Skeleton className="h-3 w-16 lg:w-20" />
      </div>
    </div>
  )
}

export function TrendingTopicsSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
      <Skeleton className="h-6 w-36 lg:w-40 mb-6" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-12" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

