import { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  centerContent?: ReactNode
}

export function PageHeader({ title, description, actions, centerContent }: PageHeaderProps) {
  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground mb-1">{title}</h1>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          {centerContent && (
            <div className="flex-1 flex justify-center px-8">
              {centerContent}
            </div>
          )}
          <div className="flex-1 flex justify-end">
            {actions && <div className="flex items-center gap-4">{actions}</div>}
          </div>
        </div>
      </div>
    </header>
  )
}
