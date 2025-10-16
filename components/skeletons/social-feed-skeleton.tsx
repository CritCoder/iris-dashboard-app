import { Skeleton } from "@/components/ui/skeleton"

export function SocialFeedSkeleton() {
  return (
    <div className="space-y-4">
      {/* Grid of post card skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export function PostCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg p-4 h-full flex flex-col">
      {/* Header with avatar and author */}
      <div className="flex items-start gap-3 mb-3">
        <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>

      {/* Content text - 4 lines */}
      <div className="space-y-2 mb-4 flex-1">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-5/6" />
      </div>

      {/* Stats footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-3">
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-3 w-8" />
        </div>
        <Skeleton className="h-3 w-10" />
      </div>
    </div>
  )
}

