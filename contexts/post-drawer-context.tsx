'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface PostDrawerContextType {
  isOpen: boolean
  postId: string | null
  openPost: (postId: string) => void
  closePost: () => void
}

const PostDrawerContext = createContext<PostDrawerContextType | undefined>(undefined)

export function PostDrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [postId, setPostId] = useState<string | null>(null)

  const openPost = (newPostId: string) => {
    setPostId(newPostId)
    setIsOpen(true)
  }

  const closePost = () => {
    setIsOpen(false)
    setPostId(null)
  }

  return (
    <PostDrawerContext.Provider value={{
      isOpen,
      postId,
      openPost,
      closePost
    }}>
      {children}
    </PostDrawerContext.Provider>
  )
}

export function usePostDrawer() {
  const context = useContext(PostDrawerContext)
  if (context === undefined) {
    throw new Error('usePostDrawer must be used within a PostDrawerProvider')
  }
  return context
}
