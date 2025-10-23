import { useEffect, useRef, useCallback } from 'react'

interface UseInfiniteScrollOptions {
  hasNextPage: boolean
  loading: boolean
  onLoadMore: () => void
  threshold?: number
}

export function useInfiniteScroll({
  hasNextPage,
  loading,
  onLoadMore,
  threshold = 200
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries
    if (target.isIntersecting && hasNextPage && !loading) {
      onLoadMore()
    }
  }, [hasNextPage, loading, onLoadMore])

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: `${threshold}px`,
      threshold: 0.1
    })

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [handleObserver, threshold])

  return { loadMoreRef }
}
