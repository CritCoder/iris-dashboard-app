'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface PostData {
  id: string
  author: string
  platform: 'facebook' | 'twitter' | 'instagram' | 'youtube' | 'news' | 'india-news'
  content: string
  timestamp: string
  likes: number
  comments: number
  shares: number
  views: number
  sentiment: 'positive' | 'negative' | 'neutral'
  url?: string
  thumbnailUrl?: string
  authorAvatar?: string
}

interface GlobalPostModalContextType {
  isOpen: boolean
  postId: string | null
  campaignId: string | null
  postData: PostData | null
  openPost: (postId: string, campaignId?: string, postData?: PostData) => void
  closePost: () => void
}

const GlobalPostModalContext = createContext<GlobalPostModalContextType | undefined>(undefined)

export function GlobalPostModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [postId, setPostId] = useState<string | null>(null)
  const [campaignId, setCampaignId] = useState<string | null>(null)
  const [postData, setPostData] = useState<PostData | null>(null)

  const openPost = (newPostId: string, newCampaignId?: string, newPostData?: PostData) => {
    setPostId(newPostId)
    setCampaignId(newCampaignId || null)
    setPostData(newPostData || null)
    setIsOpen(true)
  }

  const closePost = () => {
    setIsOpen(false)
    setPostId(null)
    setCampaignId(null)
    setPostData(null)
  }

  return (
    <GlobalPostModalContext.Provider value={{
      isOpen,
      postId,
      campaignId,
      postData,
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
