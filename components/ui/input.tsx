import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  disableAnimation?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, disableAnimation = false, ...props }, ref) => {
    const baseClassName = cn(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all duration-200 will-change-transform",
      className
    )

    if (disableAnimation) {
      return (
        <input
          type={type}
          className={baseClassName}
          ref={ref}
          {...props}
        />
      )
    }

    return (
      <motion.input
        type={type}
        className={baseClassName}
        ref={ref}
        whileFocus={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
