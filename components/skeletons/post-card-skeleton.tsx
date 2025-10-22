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
          <div key={index} className="flex flex-col space-y-3">
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[200px]" />
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
        <div key={index} className="flex items-center space-x-4 p-4 border border-border/40 rounded-lg">
          <Skeleton className="h-16 w-16 rounded-md" />
          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/6" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </>
  )
}
