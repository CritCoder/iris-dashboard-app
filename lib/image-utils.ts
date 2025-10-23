/**
 * Image utility functions for handling profile images and other media
 */

/**
 * Transforms Twitter profile image URLs from _normal to _400x400 for higher resolution
 * @param imageUrl - The original image URL
 * @returns The transformed URL with higher resolution
 */
export function getHighResProfileImage(imageUrl: string | null | undefined): string | undefined {
  if (!imageUrl) return undefined
  
  // Check if it's a Twitter profile image with _normal suffix
  if (imageUrl.includes('pbs.twimg.com') && imageUrl.includes('_normal')) {
    return imageUrl.replace('_normal', '_400x400')
  }
  
  // Return original URL if not a Twitter image or already high res
  return imageUrl
}

/**
 * Gets the best available profile image URL with fallback
 * @param profileImageUrl - Primary profile image URL
 * @param avatar - Fallback avatar URL
 * @returns The best available image URL
 */
export function getBestProfileImage(profileImageUrl?: string | null, avatar?: string | null): string | undefined {
  const primaryImage = getHighResProfileImage(profileImageUrl)
  const fallbackImage = getHighResProfileImage(avatar)
  
  return primaryImage || fallbackImage
}
