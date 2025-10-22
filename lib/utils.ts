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

  // Ensure platform is one of the supported platforms
  let platform = 'twitter' as 'facebook' | 'twitter' | 'instagram'
  if (apiPost.platform === 'facebook' || apiPost.platform === 'instagram' || apiPost.platform === 'twitter') {
    platform = apiPost.platform
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
