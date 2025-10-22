/**
 * Framer Motion Animation Utilities
 * Centralized animation variants and configurations for consistent micro-interactions
 */

import { Variants, Transition } from 'framer-motion'
import { motionConfig } from './performance'

// ============================================
// OPTIMIZED TRANSITIONS FOR 60FPS PERFORMANCE
// ============================================

export const transitions = {
  // Ultra-smooth spring (optimized for 60fps)
  smooth: motionConfig.ultraSmooth,
  
  // Performance-optimized bouncy effect
  bouncy: motionConfig.smoothDrag,
  
  // Gentle ease (GPU accelerated)
  gentle: motionConfig.gentle,
  
  // Quick snap (optimized for responsiveness)
  quick: motionConfig.quick,
  
  // Smooth drag/resize transitions
  drag: motionConfig.smoothDrag,
  
  // Resize transitions (using gentle for smooth resize)
  resize: motionConfig.gentle,
  
  // Quick response for interactions
  quickResponse: motionConfig.quickResponse,
  
  // Slow and smooth (for dramatic effects)
  slow: {
    type: 'tween' as const,
    duration: 0.4,
    ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
  },
}

// ============================================
// MICRO ANIMATIONS
// ============================================

// Button hover and tap animations
export const buttonVariants: Variants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.02,
    transition: transitions.quickResponse,
  },
  tap: { 
    scale: 0.98,
    transition: transitions.quick,
  },
}

// Card hover animations
export const cardVariants: Variants = {
  initial: { 
    y: 0,
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
  },
  hover: { 
    y: -4,
    boxShadow: '0 10px 20px -5px rgb(0 0 0 / 0.2)',
    transition: transitions.smooth,
  },
}

// Input focus animations
export const inputVariants: Variants = {
  initial: { scale: 1 },
  focus: { 
    scale: 1.01,
    transition: transitions.gentle,
  },
}

// Icon animations
export const iconVariants: Variants = {
  initial: { rotate: 0, scale: 1 },
  hover: { 
    rotate: 5,
    scale: 1.1,
    transition: transitions.bouncy,
  },
  tap: { 
    rotate: -5,
    scale: 0.95,
    transition: transitions.quick,
  },
}

// Badge pulse animation
export const badgeVariants: Variants = {
  initial: { scale: 1 },
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// ============================================
// PAGE ANIMATIONS
// ============================================

// Fade in from bottom
export const fadeInUpVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: transitions.gentle,
  },
}

// Fade in from top
export const fadeInDownVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: -20,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transitions.smooth,
  },
}

// Fade in from left
export const fadeInLeftVariants: Variants = {
  hidden: { 
    opacity: 0, 
    x: -20,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: transitions.smooth,
  },
}

// Fade in from right
export const fadeInRightVariants: Variants = {
  hidden: { 
    opacity: 0, 
    x: 20,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: transitions.smooth,
  },
}

// Scale fade in
export const scaleFadeVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: transitions.gentle,
  },
}

// ============================================
// LIST ANIMATIONS
// ============================================

// Container for stagger children
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
}

// Fast stagger
export const fastStaggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
}

// Slow stagger
export const slowStaggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

// List item variants
export const listItemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 10,
    scale: 0.98,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: transitions.smooth,
  },
}

// ============================================
// SPECIAL EFFECTS
// ============================================

// Slide in from bottom (modals, drawers)
export const slideUpVariants: Variants = {
  hidden: { 
    y: '100%',
    opacity: 0,
  },
  visible: { 
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 35,
    },
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: transitions.gentle,
  },
}

// Expand height
export const expandVariants: Variants = {
  collapsed: { 
    height: 0,
    opacity: 0,
  },
  expanded: { 
    height: 'auto',
    opacity: 1,
    transition: transitions.smooth,
  },
}

// Rotate and scale (loading spinners)
export const spinnerVariants: Variants = {
  initial: {
    rotate: 0,
  },
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
}

// Shimmer effect (skeleton loading)
export const shimmerVariants: Variants = {
  initial: {
    backgroundPosition: '-200% 0',
  },
  animate: {
    backgroundPosition: '200% 0',
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear',
    },
  },
}

// Notification slide in
export const notificationVariants: Variants = {
  hidden: { 
    x: 400,
    opacity: 0,
    scale: 0.9,
  },
  visible: { 
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
    },
  },
  exit: {
    x: 400,
    opacity: 0,
    scale: 0.9,
    transition: transitions.gentle,
  },
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

// Scroll reveal variants
export const scrollRevealVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 50,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 25,
    },
  },
}

// Parallax effect
export const parallaxVariants = (offset: number = 50): Variants => ({
  initial: { y: offset },
  animate: { y: -offset },
})

// ============================================
// HOVER EFFECTS
// ============================================

// Glow effect on hover
export const glowVariants: Variants = {
  initial: {
    filter: 'brightness(1)',
  },
  hover: {
    filter: 'brightness(1.1)',
    transition: transitions.gentle,
  },
}

// Lift and glow
export const liftGlowVariants: Variants = {
  initial: { 
    y: 0,
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
  },
  hover: { 
    y: -2,
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    transition: transitions.smooth,
  },
}

// Underline expand
export const underlineVariants: Variants = {
  initial: { 
    width: 0,
  },
  hover: { 
    width: '100%',
    transition: transitions.gentle,
  },
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Create a stagger animation with custom delay
 */
export const createStagger = (staggerDelay: number = 0.1, delayChildren: number = 0) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren,
    },
  },
})

/**
 * Create a custom fade in animation
 */
export const createFadeIn = (direction: 'up' | 'down' | 'left' | 'right' = 'up', distance: number = 20) => {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  }

  return {
    hidden: { 
      opacity: 0, 
      ...directions[direction],
    },
    visible: { 
      opacity: 1, 
      x: 0,
      y: 0,
      transition: transitions.smooth,
    },
  }
}

/**
 * Preset animation configurations
 */
export const presets = {
  // For page transitions
  page: scaleFadeVariants,
  
  // For cards
  card: cardVariants,
  
  // For buttons
  button: buttonVariants,
  
  // For lists
  list: staggerContainerVariants,
  listItem: listItemVariants,
  
  // For modals/dialogs
  modal: slideUpVariants,
  
  // For notifications/toasts
  notification: notificationVariants,
  
  // For scroll reveals
  scrollReveal: scrollRevealVariants,
}

export default presets

