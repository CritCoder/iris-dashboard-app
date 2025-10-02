'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export function RouteProgress() {
  const pathname = usePathname()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!pathname) return
    setVisible(true)
    setProgress(0)
    const t1 = setTimeout(() => setProgress(80), 30)
    const t2 = setTimeout(() => setProgress(100), 250)
    const t3 = setTimeout(() => setVisible(false), 600)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [pathname])

  if (!visible) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div
        className="h-[2px] bg-primary transition-[width] duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

