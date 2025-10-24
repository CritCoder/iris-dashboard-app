import { Skeleton } from "@/components/ui/skeleton"

export function ProfileCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg p-4 h-full flex flex-col">
      {/* Header Row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-4 w-28 lg:w-32" />
            <Skeleton className="h-3 w-20 lg:w-24" />
          </div>
        </div>
        <Skeleton className="h-6 w-16 flex-shrink-0" />
      </div>

      {/* Bio */}
      <div className="space-y-2 mb-4 flex-1">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-3/4" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 rounded-lg bg-muted/30">
          <Skeleton className="h-5 w-14 mx-auto mb-2" />
          <Skeleton className="h-3 w-12 mx-auto" />
        </div>
        <div className="text-center p-3 rounded-lg bg-muted/30">
          <Skeleton className="h-5 w-14 mx-auto mb-2" />
          <Skeleton className="h-3 w-12 mx-auto" />
        </div>
        <div className="text-center p-3 rounded-lg bg-muted/30">
          <Skeleton className="h-5 w-14 mx-auto mb-2" />
          <Skeleton className="h-3 w-12 mx-auto" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-7 w-20" />
      </div>
    </div>
  )
}

export function ProfilesGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProfileCardSkeleton key={i} />
      ))}
    </div>
  )
}

