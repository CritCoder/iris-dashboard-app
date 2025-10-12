'use client'

// Reusable animated components using Framer Motion
// All animations are GPU-accelerated for 60fps performance

import { motion, HTMLMotionProps } from 'framer-motion'
import {
  pageVariants,
  containerVariants,
  itemVariants,
  cardVariants,
  gridItemVariants,
  listItemVariants,
  fadeInVariants,
  slideUpVariants,
  slideInLeftVariants,
  slideInRightVariants,
  scaleInVariants,
  buttonVariants,
} from '@/lib/animations'
import { ComponentProps, forwardRef } from 'react'

// Animated page wrapper
export const AnimatedPage = motion.div
AnimatedPage.defaultProps = {
  variants: pageVariants,
  initial: 'initial',
  animate: 'animate',
  exit: 'exit',
}

// Animated container for stagger effects
export const AnimatedContainer = motion.div
AnimatedContainer.defaultProps = {
  variants: containerVariants,
  initial: 'initial',
  animate: 'animate',
}

// Animated item (for use within AnimatedContainer)
export const AnimatedItem = motion.div
AnimatedItem.defaultProps = {
  variants: itemVariants,
}

// Animated card
export const AnimatedCard = motion.div
AnimatedCard.defaultProps = {
  variants: cardVariants,
  initial: 'initial',
  animate: 'animate',
  whileHover: 'hover',
  whileTap: 'tap',
}

// Animated grid item
export const AnimatedGridItem = motion.div
AnimatedGridItem.defaultProps = {
  variants: gridItemVariants,
  initial: 'initial',
  animate: 'animate',
}

// Animated list item
export const AnimatedListItem = motion.div
AnimatedListItem.defaultProps = {
  variants: listItemVariants,
  initial: 'initial',
  animate: 'animate',
}

// Fade in element
export const FadeIn = motion.div
FadeIn.defaultProps = {
  variants: fadeInVariants,
  initial: 'initial',
  animate: 'animate',
}

// Slide up element
export const SlideUp = motion.div
SlideUp.defaultProps = {
  variants: slideUpVariants,
  initial: 'initial',
  animate: 'animate',
}

// Slide in from left
export const SlideInLeft = motion.div
SlideInLeft.defaultProps = {
  variants: slideInLeftVariants,
  initial: 'initial',
  animate: 'animate',
}

// Slide in from right
export const SlideInRight = motion.div
SlideInRight.defaultProps = {
  variants: slideInRightVariants,
  initial: 'initial',
  animate: 'animate',
}

// Scale in element
export const ScaleIn = motion.div
ScaleIn.defaultProps = {
  variants: scaleInVariants,
  initial: 'initial',
  animate: 'animate',
}

// Animated button
export const AnimatedButton = motion.button
AnimatedButton.defaultProps = {
  whileHover: 'hover',
  whileTap: 'tap',
  variants: buttonVariants,
}

// Grid container with stagger
interface AnimatedGridProps extends HTMLMotionProps<'div'> {
  stagger?: number
}

export const AnimatedGrid = forwardRef<HTMLDivElement, AnimatedGridProps>(
  ({ stagger = 0.05, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial="initial"
        animate="animate"
        variants={{
          initial: { opacity: 0 },
          animate: {
            opacity: 1,
            transition: {
              staggerChildren: stagger,
              delayChildren: 0.1,
            },
          },
        }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
AnimatedGrid.displayName = 'AnimatedGrid'

// List container with stagger
interface AnimatedListProps extends HTMLMotionProps<'div'> {
  stagger?: number
}

export const AnimatedList = forwardRef<HTMLDivElement, AnimatedListProps>(
  ({ stagger = 0.05, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial="initial"
        animate="animate"
        variants={{
          initial: { opacity: 0 },
          animate: {
            opacity: 1,
            transition: {
              staggerChildren: stagger,
            },
          },
        }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
AnimatedList.displayName = 'AnimatedList'
