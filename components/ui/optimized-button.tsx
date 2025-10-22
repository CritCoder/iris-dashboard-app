"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { borderRadius, performanceClasses } from "@/lib/performance"
import { transitions } from "@/lib/motion"

const optimizedButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold ring-offset-background transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm hover:shadow-md",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:shadow-sm",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm hover:shadow-md",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-11 px-8 text-base",
        xl: "h-12 px-10 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
      radius: {
        none: "rounded-none",
        sm: borderRadius.sm,
        default: borderRadius.base,
        md: borderRadius.md,
        lg: borderRadius.lg,
        xl: borderRadius.xl,
        full: borderRadius.full,
      },
      animation: {
        none: "",
        subtle: "hover:-translate-y-0.5 active:translate-y-0",
        bounce: "hover:-translate-y-1 active:translate-y-0",
        scale: "hover:scale-105 active:scale-95",
        lift: "hover:-translate-y-1 hover:shadow-lg active:translate-y-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      radius: "lg",
      animation: "subtle",
    },
  }
)

export interface OptimizedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof optimizedButtonVariants> {
  asChild?: boolean
  disableAnimation?: boolean
  loading?: boolean
  fullWidth?: boolean
}

const OptimizedButton = React.forwardRef<HTMLButtonElement, OptimizedButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    radius,
    animation,
    asChild = false, 
    disableAnimation = false,
    loading = false,
    fullWidth = false,
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const buttonClasses = cn(
      optimizedButtonVariants({ variant, size, radius, animation }),
      performanceClasses.gpu,
      fullWidth && "w-full",
      loading && "cursor-not-allowed",
      className
    )

    // Motion variants for smooth animations
    const motionVariants = {
      initial: { scale: 1, y: 0 },
      hover: { 
        scale: animation === 'scale' ? 1.05 : 1,
        y: animation === 'bounce' || animation === 'lift' ? -4 : (animation === 'subtle' ? -2 : 0),
        transition: transitions.quickResponse
      },
      tap: { 
        scale: animation === 'scale' ? 0.95 : 0.98,
        y: 0,
        transition: transitions.quick
      },
    }

    // No animation
    if (disableAnimation || asChild) {
      return (
        <Comp
          className={buttonClasses}
          ref={ref}
          disabled={disabled || loading}
          {...props}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Loading...
            </div>
          ) : (
            children
          )}
        </Comp>
      )
    }

    // With motion animations
    return (
      <motion.button
        className={buttonClasses}
        ref={ref}
        variants={motionVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Loading...
          </div>
        ) : (
          children
        )}
      </motion.button>
    )
  }
)

OptimizedButton.displayName = "OptimizedButton"

export { OptimizedButton, optimizedButtonVariants }
