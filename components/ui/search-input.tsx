'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface SearchInputProps {
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  className?: string
  showKbd?: boolean
  kbdText?: string
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className,
  showKbd = false,
  kbdText = "⌘K",
  onKeyDown
}: SearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className={cn(
          "pl-10 pr-4 text-sm w-full",
          showKbd && "pr-14"
        )}
      />
      {showKbd && (
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-muted-foreground bg-muted border border-border rounded pointer-events-none">
          {kbdText}
        </kbd>
      )}
    </div>
  )
}
