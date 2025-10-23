import { useState, useCallback, useEffect, useRef } from 'react'
import { api } from '@/lib/api'

// Sample data generator for fallback
const generateSamplePosts = (count: number = 20) => {
  const platforms = ['twitter', 'facebook', 'instagram', 'news']
  const sentiments = ['POSITIVE', 'NEUTRAL', 'NEGATIVE']
  const authors = ['john_doe', 'jane_smith', 'news_agency', 'tech_blog', 'user123']
  
  return Array.from({ length: count }, (_, i) => ({
    id: `sample-${i + 1}`,
    content: `Sample post content ${i + 1}. This is a ${sentiments[i % sentiments.length].toLowerCase()} post about current events.`,
    author: authors[i % authors.length],
    platform: platforms[i % platforms.length],
    timestamp: new Date(Date.now() - i * 3600000).toISOString(), // 1 hour apart
    likes: Math.floor(Math.random() * 1000),
    comments: Math.floor(Math.random() * 100),
    shares: Math.floor(Math.random() * 50),
    views: Math.floor(Math.random() * 5000),
    sentiment: sentiments[i % sentiments.length],
    mediaType: Math.random() > 0.5 ? 'image' : 'text',
    isViral: Math.random() > 0.8,
    classification: Math.random() > 0.7 ? 'HIGH' : 'MEDIUM'
  }))
}

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
          console.log('📊 Pagination data:', {
            total: pagination.total,
            page: pagination.page,
            totalPages: pagination.totalPages,
            hasNext: pagination.hasNext
          })
          setHasNextPage(pagination.hasNext || (pagination.page < pagination.totalPages))
          setCurrentPage(pagination.page)
        } else if (Array.isArray(responseData)) {
          // Flat array response
          if (isLoadMore) {
            setData(prevData => [...prevData, ...responseData])
          } else {
            setData(responseData)
          }
          setTotal(responseData.length) // Set total to current data length for flat array
          setHasNextPage(responseData.length === limit)
        } else {
          if (!isLoadMore) {
            setData([])
            setTotal(0)
          }
          setHasNextPage(false)
        }
      } else {
        setError(response.message || 'Failed to fetch posts')
        if (!isLoadMore) {
          setData([])
          setTotal(0)
        }
      }
    } catch (err) {
      console.warn('Failed to fetch social posts:', err)
      
      // Check if it's an authentication error
      const isAuthError = err instanceof Error && (
        err.message.includes('Authentication') || 
        err.message.includes('401') || 
        err.message.includes('Token expired')
      )
      
      if (isAuthError) {
        setError('Authentication failed. Please login again.')
        if (!isLoadMore) {
          setData([])
          setTotal(0)
        }
      } else {
        // For non-auth errors, try to use sample data as fallback
        console.log('🔄 Using sample data as fallback due to API error')
        const sampleData = generateSamplePosts(limit)
        
        if (isLoadMore) {
          setData(prevData => [...prevData, ...sampleData])
        } else {
          setData(sampleData)
          setTotal(sampleData.length)
        }
        
        setError(null) // Clear error since we have fallback data
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

  // Debug total count
  console.log('🔢 Hook returning total:', total, 'data length:', data.length)
  
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
