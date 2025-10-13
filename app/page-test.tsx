'use client'

import { PageLayout } from '@/components/layout/page-layout'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { PageHeader } from '@/components/layout/page-header'

export default function PageTest() {
  return (
    <ProtectedRoute>
      <PageLayout>
        <PageHeader
          title="Test Page"
          description="Testing basic components"
        />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-4 sm:py-8">
            <h1>Basic Test Page</h1>
            <p>If you can see this, the basic components are working.</p>
          </div>
        </main>
      </PageLayout>
    </ProtectedRoute>
  )
}
