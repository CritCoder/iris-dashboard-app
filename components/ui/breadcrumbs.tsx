'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { motion } from 'framer-motion'

interface BreadcrumbsProps {
  className?: string
}

export function Breadcrumbs({ className }: BreadcrumbsProps) {
  const pathname = usePathname()

  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean)
    const breadcrumbs = [{ label: 'Home', href: '/' }]

    let currentPath = ''
    paths.forEach((path, index) => {
      currentPath += `/${path}`
      
      // Convert path to readable label
      const label = path
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      breadcrumbs.push({
        label,
        href: currentPath
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  if (breadcrumbs.length <= 1) return null

  return (
    <nav className={`flex items-center gap-2 text-sm ${className}`}>
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1

        return (
          <React.Fragment key={crumb.href}>
            {index === 0 ? (
              <Link href={crumb.href}>
                <motion.div
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  <Home className="w-4 h-4" />
                </motion.div>
              </Link>
            ) : (
              <>
                <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                {isLast ? (
                  <span className="text-foreground font-medium">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href}>
                    <motion.span
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      whileHover={{ scale: 1.05 }}
                    >
                      {crumb.label}
                    </motion.span>
                  </Link>
                )}
              </>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

