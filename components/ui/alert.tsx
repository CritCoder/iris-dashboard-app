import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground [&>svg]:text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        critical:
          "bg-red-600 dark:bg-red-950/20 border-red-700 dark:border-red-900/50 text-white dark:text-red-400 shadow-lg [&>svg]:text-white dark:[&>svg]:text-red-500",
        warning:
          "bg-amber-500 dark:bg-amber-950/20 border-amber-600 dark:border-amber-900/50 text-white dark:text-amber-400 shadow-lg [&>svg]:text-white dark:[&>svg]:text-amber-500",
        success:
          "bg-green-600 dark:bg-green-950/20 border-green-700 dark:border-green-900/50 text-white dark:text-green-400 shadow-lg [&>svg]:text-white dark:[&>svg]:text-green-500",
        info:
          "bg-blue-600 dark:bg-blue-950/20 border-blue-700 dark:border-blue-900/50 text-white dark:text-blue-400 shadow-lg [&>svg]:text-white dark:[&>svg]:text-blue-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
