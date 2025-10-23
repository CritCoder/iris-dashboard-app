'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface GlobalPostModalContextType {
  isOpen: boolean
  postId: string | null
  campaignId: string | null
  openPost: (postId: string, campaignId?: string) => void
  closePost: () => void
}

const GlobalPostModalContext = createContext<GlobalPostModalContextType | undefined>(undefined)

export function GlobalPostModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [postId, setPostId] = useState<string | null>(null)
  const [campaignId, setCampaignId] = useState<string | null>(null)

  const openPost = (newPostId: string, newCampaignId?: string) => {
    setPostId(newPostId)
    setCampaignId(newCampaignId || null)
    setIsOpen(true)
  }

  const closePost = () => {
    setIsOpen(false)
    setPostId(null)
    setCampaignId(null)
  }

  return (
    <GlobalPostModalContext.Provider value={{
      isOpen,
      postId,
      campaignId,
      openPost,
      closePost
    }}>
      {children}
    </GlobalPostModalContext.Provider>
  )
}

export function useGlobalPostModal() {
  const context = useContext(GlobalPostModalContext)
  if (context === undefined) {
    throw new Error('useGlobalPostModal must be used within a GlobalPostModalProvider')
  }
  return context
}
