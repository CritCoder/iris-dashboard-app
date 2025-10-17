"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { borderRadius, performanceClasses } from "@/lib/performance"
import { transitions } from "@/lib/motion"

interface OptimizedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disableAnimation?: boolean
  hoverEffect?: boolean
  dragEnabled?: boolean
  resizeEnabled?: boolean
}

const OptimizedCard = React.forwardRef<HTMLDivElement, OptimizedCardProps>(
  ({ 
    className, 
    variant = 'default',
    size = 'md',
    disableAnimation = false,
    hoverEffect = false,
    dragEnabled = false,
    resizeEnabled = false,
    children,
    ...props 
  }, ref) => {
    const variants = {
      default: 'bg-card border border-border',
      elevated: 'bg-card border-0 shadow-lg',
      outlined: 'bg-transparent border-2 border-border',
      ghost: 'bg-transparent border-0',
    }

    const sizes = {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8',
    }

    const baseClasses = cn(
      // Base styling
      borderRadius.card,
      variants[variant],
      sizes[size],
      // Performance optimizations
      performanceClasses.gpu,
      resizeEnabled && performanceClasses.smoothResize,
      dragEnabled && performanceClasses.smoothDrag,
      // Interactive states
      hoverEffect && 'hover:shadow-md transition-shadow duration-200',
      'text-card-foreground',
      className
    )

    // No animation
    if (disableAnimation) {
      return (
        <div ref={ref} className={baseClasses} {...props}>
          {children}
        </div>
      )
    }

    // Motion variants for different effects
    const motionVariants = {
      initial: { opacity: 0, y: 20, scale: 0.95 },
      animate: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: transitions.smooth
      },
      hover: hoverEffect ? { 
        y: -2, 
        scale: 1.02,
        transition: transitions.quickResponse
      } : {},
      drag: dragEnabled ? {
        transition: transitions.drag
      } : {},
      resize: resizeEnabled ? {
        transition: transitions.resize
      } : {}
    }

    return (
      <motion.div
        ref={ref}
        className={baseClasses}
        variants={motionVariants}
        initial="initial"
        animate="animate"
        whileHover={hoverEffect ? "hover" : undefined}
        drag={dragEnabled}
        dragMomentum={false}
        dragElastic={0.1}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

OptimizedCard.displayName = "OptimizedCard"

// Sub-components with consistent styling
const OptimizedCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 pb-0", className)}
    {...props}
  />
))
OptimizedCardHeader.displayName = "OptimizedCardHeader"

const OptimizedCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
OptimizedCardTitle.displayName = "OptimizedCardTitle"

const OptimizedCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
OptimizedCardDescription.displayName = "OptimizedCardDescription"

const OptimizedCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
OptimizedCardContent.displayName = "OptimizedCardContent"

const OptimizedCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
OptimizedCardFooter.displayName = "OptimizedCardFooter"

export { 
  OptimizedCard, 
  OptimizedCardHeader, 
  OptimizedCardFooter, 
  OptimizedCardTitle, 
  OptimizedCardDescription, 
  OptimizedCardContent 
}
