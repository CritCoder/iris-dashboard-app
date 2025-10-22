/**
 * Performance Optimization Utilities
 * Optimized for 60fps smooth animations and interactions
 */

// ============================================
// PERFORMANCE OPTIMIZATION UTILITIES
// ============================================

/**
 * CSS classes for performance-optimized animations
 */
export const performanceClasses = {
  // Hardware acceleration
  gpu: 'transform-gpu will-change-transform',
  
  // Smooth resize performance
  smoothResize: 'will-change-width,height,transform transform-gpu',
  
  // Smooth drag performance
  smoothDrag: 'will-change-transform transform-gpu touch-action-none',
  
  // Smooth scroll performance
  smoothScroll: 'will-change-scroll-position transform-gpu',
  
  // Optimized transitions
  fastTransition: 'transition-transform duration-150 ease-out',
  smoothTransition: 'transition-all duration-200 ease-out',
  
  // Layout optimization
  containLayout: 'contain-layout',
  containPaint: 'contain-paint',
  containStrict: 'contain-strict',
} as const

/**
 * Framer Motion performance configurations
 */
export const motionConfig = {
  // Ultra-smooth spring for 60fps
  ultraSmooth: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
    mass: 0.8,
  },
  
  // Fast response for interactions
  quickResponse: {
    type: 'spring' as const,
    stiffness: 600,
    damping: 35,
    mass: 0.5,
  },
  
  // Smooth drag/resize
  smoothDrag: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 25,
    mass: 0.6,
  },
  
  // Gentle animations
  gentle: {
    type: 'tween' as const,
    duration: 0.25,
    ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
  },
  
  // Quick snap
  quick: {
    type: 'tween' as const,
    duration: 0.12,
    ease: [0.4, 0, 1, 1] as [number, number, number, number],
  },
} as const

/**
 * Border radius system for consistent design
 */
export const borderRadius = {
  // Semantic radius values
  none: 'rounded-none',
  xs: 'rounded-xs',      // 2px
  sm: 'rounded-sm',      // 4px
  base: 'rounded',       // 8px (default)
  md: 'rounded-md',      // 10px
  lg: 'rounded-lg',      // 12px
  xl: 'rounded-xl',      // 14px
  '2xl': 'rounded-2xl',  // 16px
  '3xl': 'rounded-3xl',  // 20px
  full: 'rounded-full',  // Fully rounded
  
  // Component-specific radius
  button: 'rounded-lg',
  card: 'rounded-lg',
  input: 'rounded-md',
  badge: 'rounded-full',
  avatar: 'rounded-full',
  modal: 'rounded-xl',
  tooltip: 'rounded-md',
} as const

/**
 * Performance monitoring utilities
 */
export const performance = {
  /**
   * Throttle function calls for better performance
   */
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout | null = null
    let lastExecTime = 0
    
    return (...args: Parameters<T>) => {
      const currentTime = Date.now()
      
      if (currentTime - lastExecTime > delay) {
        func(...args)
        lastExecTime = currentTime
      } else {
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(() => {
          func(...args)
          lastExecTime = Date.now()
        }, delay - (currentTime - lastExecTime))
      }
    }
  },
  
  /**
   * Debounce function calls
   */
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout | null = null
    
    return (...args: Parameters<T>) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(() => func(...args), delay)
    }
  },
  
  /**
   * Check if device supports hardware acceleration
   */
  supportsHardwareAcceleration: (): boolean => {
    if (typeof window === 'undefined') return true
    
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    return !!gl
  },
  
  /**
   * Get optimal animation duration based on device performance
   */
  getOptimalDuration: (baseDuration: number = 200): number => {
    if (typeof window === 'undefined') return baseDuration
    
    // Check if device is low-end
    const isLowEnd = navigator.hardwareConcurrency <= 2 || 
                     (navigator as any).deviceMemory && (navigator as any).deviceMemory <= 2
    
    return isLowEnd ? baseDuration * 0.7 : baseDuration
  },
} as const

/**
 * Responsive design utilities
 */
export const responsive = {
  /**
   * Get responsive border radius based on screen size
   */
  getRadius: (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md') => {
    return {
      xs: 'rounded-sm',   // 4px on mobile
      sm: 'rounded-md',   // 6px on mobile
      md: 'rounded-lg',   // 8px on mobile
      lg: 'rounded-xl',   // 12px on mobile
      xl: 'rounded-2xl',  // 16px on mobile
    }[size]
  },

  /**
   * Responsive grid classes for different content types
   */
  grid: {
    // Standard card grids (recommended)
    cards: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    
    // Compact card grids for smaller cards
    compact: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
    
    // Stats/metrics grids
    stats: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    
    // Large card grids (for dashboard widgets)
    large: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    
    // Two column layout
    twoCol: 'grid grid-cols-1 lg:grid-cols-2',
    
    // Three column layout
    threeCol: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    
    // Four column layout
    fourCol: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  },

  /**
   * Responsive gap classes
   */
  gap: {
    small: 'gap-2 sm:gap-3',
    medium: 'gap-3 sm:gap-4',
    large: 'gap-4 sm:gap-6',
    xlarge: 'gap-6 sm:gap-8',
  },

  /**
   * Get responsive grid class with gap
   */
  getGrid: (type: keyof typeof responsive.grid, gap: keyof typeof responsive.gap = 'medium') => {
    return `${responsive.grid[type]} ${responsive.gap[gap]}`
  },
} as const

export default {
  performanceClasses,
  motionConfig,
  borderRadius,
  performance,
  responsive,
}
