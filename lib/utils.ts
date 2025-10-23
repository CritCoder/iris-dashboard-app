import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to convert API post to PostCard format
export function convertToPostCardFormat(apiPost: any) {
  // Extract author information from metadata
  const authorName = apiPost.metadata?.authorName || apiPost.metadata?.originalData?.author?.name || 'Unknown Author'
  const authorScreenName = apiPost.metadata?.authorScreenName || apiPost.metadata?.originalData?.author?.userName || authorName

  // Debug platform detection - temporarily disabled
  // console.log('🔍 Platform detection:', {
  //   originalPlatform: apiPost.platform,
  //   content: apiPost.content?.substring(0, 100),
  //   authorName
  // })

  // Ensure platform is one of the supported platforms
  let platform = 'twitter' as 'facebook' | 'twitter' | 'instagram' | 'youtube' | 'news' | 'india-news'
  if (apiPost.platform === 'facebook' || apiPost.platform === 'instagram' || apiPost.platform === 'twitter' || 
      apiPost.platform === 'youtube' || apiPost.platform === 'news' || apiPost.platform === 'india-news') {
    platform = apiPost.platform
  } else {
    // Try to detect platform from content or metadata
    const content = apiPost.content?.toLowerCase() || ''
    const authorNameLower = authorName?.toLowerCase() || ''
    
    // Check for India News indicators
    if (content.includes('times of india') || content.includes('indian express') || 
        content.includes('headlines') || content.includes('news') || 
        authorNameLower.includes('news') || content.includes('rajkot news')) {
      platform = 'india-news'
    }
    // Check for YouTube indicators
    else if (content.includes('youtube') || content.includes('watch?v=') || 
             authorNameLower.includes('youtube')) {
      platform = 'youtube'
    }
    // Check for Facebook indicators
    else if (content.includes('facebook') || authorNameLower.includes('facebook')) {
      platform = 'facebook'
    }
    // Check for Instagram indicators
    else if (content.includes('instagram') || content.includes('ig:') || 
             authorNameLower.includes('instagram')) {
      platform = 'instagram'
    }
    // Default to news for content that looks like news
    else if (content.includes('news') || content.includes('headlines') || 
             content.includes('express') || content.includes('times')) {
      platform = 'news'
    }
  }

  // Convert sentiment to lowercase and handle all cases
  let sentiment = 'neutral' as 'positive' | 'negative' | 'neutral'
  if (apiPost.aiSentiment) {
    const aiSentiment = apiPost.aiSentiment.toLowerCase()
    if (aiSentiment === 'positive') sentiment = 'positive'
    if (aiSentiment === 'negative') sentiment = 'negative'
    if (aiSentiment === 'neutral') sentiment = 'neutral'
  }

  return {
    id: apiPost.id || 'unknown',
    author: authorName,
    platform: platform,
    content: apiPost.content || '',
    timestamp: apiPost.postedAt ? new Date(apiPost.postedAt).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }) : 'Unknown time',
    likes: apiPost.likesCount || 0,
    comments: apiPost.commentsCount || 0,
    shares: apiPost.sharesCount || 0,
    views: apiPost.viewsCount || 0,
    sentiment: sentiment
  }
}
