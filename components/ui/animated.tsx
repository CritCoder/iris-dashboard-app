/**
 * Reusable Animation Components
 * Pre-built animated wrappers for common use cases
 */

'use client'

import { motion, HTMLMotionProps, useInView } from 'framer-motion'
import { useRef, ReactNode } from 'react'
import {
  fadeInUpVariants,
  fadeInDownVariants,
  fadeInLeftVariants,
  fadeInRightVariants,
  scaleFadeVariants,
  staggerContainerVariants,
  fastStaggerContainerVariants,
  slowStaggerContainerVariants,
  listItemVariants,
  scrollRevealVariants,
  liftGlowVariants,
  createStagger,
  createFadeIn,
} from '@/lib/motion'

// ============================================
// ANIMATED CONTAINERS
// ============================================

interface AnimatedDivProps extends Omit<HTMLMotionProps<'div'>, 'variants'> {
  children: ReactNode
  delay?: number
}

/**
 * Fade in from bottom
 */
export function FadeInUp({ children, delay = 0, className, ...props }: AnimatedDivProps) {
  return (
    <motion.div
      variants={fadeInUpVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/**
 * Fade in from top
 */
export function FadeInDown({ children, delay = 0, className, ...props }: AnimatedDivProps) {
  return (
    <motion.div
      variants={fadeInDownVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/**
 * Fade in from left
 */
export function FadeInLeft({ children, delay = 0, className, ...props }: AnimatedDivProps) {
  return (
    <motion.div
      variants={fadeInLeftVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/**
 * Fade in from right
 */
export function FadeInRight({ children, delay = 0, className, ...props }: AnimatedDivProps) {
  return (
    <motion.div
      variants={fadeInRightVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/**
 * Scale and fade in
 */
export function ScaleFade({ children, delay = 0, className, ...props }: AnimatedDivProps) {
  return (
    <motion.div
      variants={scaleFadeVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// ============================================
// STAGGER LISTS
// ============================================

interface StaggerListProps extends AnimatedDivProps {
  staggerDelay?: number
  delayChildren?: number
  speed?: 'fast' | 'normal' | 'slow'
}

/**
 * Animated list container with stagger effect
 */
export function StaggerList({
  children,
  staggerDelay,
  delayChildren,
  speed = 'normal',
  className,
  ...props
}: StaggerListProps) {
  let variants = staggerContainerVariants
  
  if (speed === 'fast') variants = fastStaggerContainerVariants
  if (speed === 'slow') variants = slowStaggerContainerVariants
  if (staggerDelay !== undefined || delayChildren !== undefined) {
    variants = createStagger(staggerDelay, delayChildren)
  }

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/**
 * Individual list item (use inside StaggerList)
 */
export function StaggerItem({ children, className, ...props }: AnimatedDivProps) {
  return (
    <motion.div
      variants={listItemVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

interface ScrollRevealProps extends AnimatedDivProps {
  once?: boolean
  amount?: number
}

/**
 * Reveal element when scrolled into view
 */
export function ScrollReveal({
  children,
  once = true,
  amount = 0.3,
  className,
  ...props
}: ScrollRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount })

  return (
    <motion.div
      ref={ref}
      variants={scrollRevealVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/**
 * Scroll-triggered stagger list
 */
export function ScrollStaggerList({
  children,
  once = true,
  amount = 0.2,
  speed = 'normal',
  className,
  ...props
}: ScrollRevealProps & { speed?: 'fast' | 'normal' | 'slow' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount })

  let variants = staggerContainerVariants
  if (speed === 'fast') variants = fastStaggerContainerVariants
  if (speed === 'slow') variants = slowStaggerContainerVariants

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// ============================================
// HOVER EFFECTS
// ============================================

interface HoverLiftProps extends AnimatedDivProps {}

/**
 * Lift and glow on hover
 */
export function HoverLift({ children, className, ...props }: HoverLiftProps) {
  return (
    <motion.div
      variants={liftGlowVariants}
      initial="initial"
      whileHover="hover"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/**
 * Pressable button effect
 */
export function Pressable({ children, className, ...props }: AnimatedDivProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// ============================================
// LOADING ANIMATIONS
// ============================================

/**
 * Spinning loader
 */
export function Spinner({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <motion.div
      className={className}
      style={{ width: size, height: size }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </motion.div>
  )
}

/**
 * Pulsing dot
 */
export function PulsingDot({ className }: { className?: string }) {
  return (
    <motion.div
      className={`w-2 h-2 rounded-full ${className}`}
      animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

// ============================================
// TRANSITION WRAPPERS
// ============================================

/**
 * Page wrapper with transition
 */
export function PageWrapper({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={scaleFadeVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * Modal wrapper with slide up animation
 */
export function ModalWrapper({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 35 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ============================================
// BACKWARD COMPATIBILITY ALIASES
// ============================================

/**
 * Alias for PageWrapper (backward compatibility)
 */
export const AnimatedPage = PageWrapper

/**
 * Alias for StaggerList (backward compatibility)
 */
export const AnimatedGrid = StaggerList

/**
 * Alias for StaggerItem (backward compatibility)
 */
export const AnimatedCard = StaggerItem

/**
 * Alias for StaggerList (backward compatibility)
 */
export const AnimatedList = StaggerList

/**
 * Alias for StaggerItem (backward compatibility)
 */
export const AnimatedItem = StaggerItem

/**
 * Alias for FadeInUp (backward compatibility)
 */
export const FadeIn = FadeInUp

/**
 * Alias for FadeInUp (backward compatibility)
 */
export const SlideUp = FadeInUp

// Export all
export default {
  FadeInUp,
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  ScaleFade,
  StaggerList,
  StaggerItem,
  ScrollReveal,
  ScrollStaggerList,
  HoverLift,
  Pressable,
  Spinner,
  PulsingDot,
  PageWrapper,
  ModalWrapper,
  // Aliases
  AnimatedPage,
  AnimatedGrid,
  AnimatedCard,
  AnimatedList,
  AnimatedItem,
  FadeIn,
  SlideUp,
}
