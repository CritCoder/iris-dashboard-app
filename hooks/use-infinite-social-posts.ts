import { useState, useCallback, useEffect, useRef } from 'react'
import { api } from '@/lib/api'

interface InfiniteSocialPostsParams {
  limit?: number
  platform?: string
  sentiment?: string
  mediaType?: string
  timeRange?: string
  classification?: string
  search?: string
  enabled?: boolean
}

interface InfiniteSocialPostsReturn {
  data: any[]
  loading: boolean
  loadingMore: boolean
  error: string | null
  hasNextPage: boolean
  loadMore: () => void
  refetch: () => void
  total: number
}

export function useInfiniteSocialPosts(params: InfiniteSocialPostsParams = {}): InfiniteSocialPostsReturn {
  const {
    limit = 20,
    platform,
    sentiment,
    mediaType,
    timeRange,
    classification,
    search,
    enabled = true
  } = params

  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  
  const isLoadingRef = useRef(false)

  const fetchData = useCallback(async (page: number = 1, isLoadMore: boolean = false) => {
    if (!enabled || isLoadingRef.current) return

    isLoadingRef.current = true
    
    if (isLoadMore) {
      setLoadingMore(true)
    } else {
      setLoading(true)
    }
    setError(null)

    try {
      const apiParams = {
        page,
        limit,
        platform,
        sentiment,
        mediaType,
        timeRange,
        classification,
        search,
      }

      console.log('🚀 Fetching social posts (infinite scroll):', { page, ...apiParams })

      const response = await api.social.getPosts(apiParams)
      
      console.log('✅ Social posts API response:', response)

      if (response.success && response.data) {
        const responseData = response.data as any
        
        if (Array.isArray(responseData.data) && responseData.pagination) {
          // Paginated response
          const newPosts = responseData.data
          const pagination = responseData.pagination
          
          if (isLoadMore) {
            setData(prevData => [...prevData, ...newPosts])
          } else {
            setData(newPosts)
          }
          
          setTotal(pagination.total || 0)
          setHasNextPage(pagination.hasNext || (pagination.page < pagination.totalPages))
          setCurrentPage(pagination.page)
        } else if (Array.isArray(responseData)) {
          // Flat array response
          if (isLoadMore) {
            setData(prevData => [...prevData, ...responseData])
          } else {
            setData(responseData)
          }
          setHasNextPage(responseData.length === limit)
        } else {
          if (!isLoadMore) {
            setData([])
          }
          setHasNextPage(false)
        }
      } else {
        setError(response.message || 'Failed to fetch posts')
        if (!isLoadMore) {
          setData([])
        }
      }
    } catch (err) {
      console.warn('Failed to fetch social posts:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      if (!isLoadMore) {
        setData([])
      }
    } finally {
      setLoading(false)
      setLoadingMore(false)
      isLoadingRef.current = false
    }
  }, [enabled, limit, platform, sentiment, mediaType, timeRange, classification, search])

  const loadMore = useCallback(() => {
    if (!loadingMore && hasNextPage && !isLoadingRef.current) {
      const nextPage = currentPage + 1
      fetchData(nextPage, true)
    }
  }, [loadingMore, hasNextPage, currentPage, fetchData])

  const refetch = useCallback(() => {
    setData([])
    setCurrentPage(1)
    setHasNextPage(true)
    fetchData(1, false)
  }, [fetchData])

  // Initial load
  useEffect(() => {
    if (enabled) {
      setData([])
      setCurrentPage(1)
      setHasNextPage(true)
      fetchData(1, false)
    }
  }, [enabled, platform, sentiment, mediaType, timeRange, classification, search])

  return {
    data,
    loading,
    loadingMore,
    error,
    hasNextPage,
    loadMore,
    refetch,
    total
  }
}
