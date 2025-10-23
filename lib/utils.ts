import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to convert API post to PostCard format
export function convertToPostCardFormat(apiPost: any) {
  // Enhanced author information extraction - check multiple possible fields
  let authorName = 'Unknown Author'

  // Debug log only when author mapping fails
  let debugMode = false

  // Try multiple possible author field locations based on actual API response structure
  if (apiPost.person?.name) {
    authorName = apiPost.person.name
  } else if (apiPost.social_profile?.username) {
    authorName = apiPost.social_profile.username
  } else if (apiPost.author) {
    authorName = apiPost.author
  } else if (apiPost.username) {
    authorName = apiPost.username
  } else if (apiPost.displayName) {
    authorName = apiPost.displayName
  } else if (apiPost.profile?.username) {
    authorName = apiPost.profile.username
  } else if (apiPost.profile?.displayName) {
    authorName = apiPost.profile.displayName
  } else if (apiPost.metadata?.authorName) {
    authorName = apiPost.metadata.authorName
  } else if (apiPost.metadata?.authorScreenName) {
    authorName = apiPost.metadata.authorScreenName
  } else if (apiPost.metadata?.originalData?.author?.name) {
    authorName = apiPost.metadata.originalData.author.name
  } else if (apiPost.metadata?.originalData?.author?.userName) {
    authorName = apiPost.metadata.originalData.author.userName
  } else if (apiPost.metadata?.originalData?.user?.name) {
    authorName = apiPost.metadata.originalData.user.name
  } else if (apiPost.metadata?.originalData?.user?.screen_name) {
    authorName = apiPost.metadata.originalData.user.screen_name
  }

  // Only log when author mapping fails to reduce console noise
  if (authorName === 'Unknown Author' && debugMode) {
    console.log('⚠️ Author mapping failed for post:', {
      postId: apiPost.id,
      personName: apiPost.person?.name,
      socialProfileUsername: apiPost.social_profile?.username,
      author: apiPost.author,
      rawPost: apiPost
    })
  }

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
