'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function CampaignRedirectPage() {
  const router = useRouter()
  const params = useParams()
  const campaignId = params.id as string

  useEffect(() => {
    if (campaignId) {
      router.replace(`/analysis-history/${campaignId}`)
    }
  }, [router, campaignId])

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-400">Redirecting to campaign details...</p>
      </div>
    </div>
  )
}
