'use client'

import { Skeleton } from '@/components/ui/skeleton'

interface PostCardSkeletonProps {
  view?: 'grid' | 'list'
  count?: number
}

export function PostCardSkeleton({ view = 'list', count = 1 }: PostCardSkeletonProps) {
  const skeletons = Array.from({ length: count })

  if (view === 'grid') {
    return (
      <>
        {skeletons.map((_, index) => (
          <div key={index} className="bg-card border border-border rounded-lg overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-5 w-12" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/5" />
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-4 w-8" />
                </div>
                <Skeleton className="h-4 w-4" />
              </div>
            </div>
          </div>
        ))}
      </>
    )
  }
  
  // List view skeleton
  return (
    <>
      {skeletons.map((_, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-start gap-4">
            <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-6">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
