import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

interface FilterCounts {
  [key: string]: number
}

export function useFilterCounts() {
  const [counts, setCounts] = useState<FilterCounts>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true)
        
        // Check if we have a token, if not return empty counts
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        if (!token) {
          console.log('🔄 No token found, skipping filter counts')
          setCounts({})
          setLoading(false)
          return
        }
        
        // Define all the filter combinations we want counts for
        const filterQueries = [
          { name: 'All Posts', params: {} },
          { name: 'Latest Posts', params: { timeRange: '24h', sortBy: 'postedAt', sortOrder: 'desc' } },
          { name: 'High Impact', params: { min_likesCount: '1000', min_sharesCount: '500' } },
          { name: 'Viral Negative', params: { sentiment: 'NEGATIVE', min_sharesCount: '1000' } },
          { name: 'Trending Discussions', params: { timeRange: '24h', sortBy: 'commentsCount' } },
          { name: 'High Engagement', params: { min_likesCount: '100', min_commentsCount: '50' } },
          { name: 'High Reach, Low Engagement', params: { min_viewsCount: '10000', max_likesCount: '50' } },
          { name: 'Viral Potential', params: { timeRange: '6h', sortBy: 'sharesCount' } },
          { name: 'News', params: { platform: 'india-news' } },
          { name: 'Videos', params: { hasVideos: 'true' } },
          { name: 'Twitter', params: { platform: 'twitter' } },
          { name: 'Facebook', params: { platform: 'facebook' } },
          { name: 'Instagram', params: { platform: 'instagram' } },
          { name: 'YouTube', params: { platform: 'youtube' } },
          { name: 'Positive Posts', params: { sentiment: 'POSITIVE' } },
          { name: 'Neutral Posts', params: { sentiment: 'NEUTRAL' } },
          { name: 'Negative Posts', params: { sentiment: 'NEGATIVE' } },
        ]

        const countPromises = filterQueries.map(async ({ name, params }) => {
          try {
            // Try to use inbox stats for platform and sentiment filters (more efficient)
            if (params.platform || params.sentiment) {
              try {
                const statsResponse = await api.social.getInboxStats({
                  platform: params.platform,
                  sentiment: params.sentiment,
                  timeRange: params.timeRange
                })
                if (statsResponse.success && statsResponse.data) {
                  console.log(`📊 Stats for ${name}:`, statsResponse.data)
                  // Extract count from stats response
                  const stats = statsResponse.data as any
                  if (stats.totalPosts !== undefined) {
                    return { name, count: stats.totalPosts }
                  }
                }
              } catch (statsError) {
                console.warn(`Stats API failed for ${name}, falling back to posts API:`, statsError)
              }
            }
            
            // Fallback to posts API with pagination
            const response = await api.social.getPosts({ ...params, limit: 1, page: 1 })
            if (response.success && response.data) {
              const responseData = response.data as any
              console.log(`🔍 Count for ${name}:`, {
                responseData,
                hasPagination: !!responseData.pagination,
                total: responseData.pagination?.total,
                dataLength: Array.isArray(responseData.data) ? responseData.data.length : 'not array'
              })
              
              if (Array.isArray(responseData.data) && responseData.pagination) {
                // Use pagination total like the infinite scroll hook
                return { name, count: responseData.pagination.total || 0 }
              } else if (Array.isArray(responseData)) {
                // Fallback to array length
                return { name, count: responseData.length }
              }
            }
            return { name, count: 0 }
          } catch (error) {
            console.warn(`Failed to fetch count for ${name}:`, error)
            return { name, count: 0 }
          }
        })

        const results = await Promise.all(countPromises)
        const countsMap = results.reduce((acc, { name, count }) => {
          acc[name] = count
          return acc
        }, {} as FilterCounts)

        setCounts(countsMap)
      } catch (error) {
        console.error('Failed to fetch filter counts:', error)
        setCounts({})
      } finally {
        setLoading(false)
      }
    }

    fetchCounts()
  }, [])

  return { counts, loading }
}
