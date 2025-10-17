'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <AlertTriangle className="w-20 h-20 text-destructive mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist. It may have been moved or deleted.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="default"
            onClick={() => router.push('/')}
            className="gap-2"
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-8">
          If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  )
}

