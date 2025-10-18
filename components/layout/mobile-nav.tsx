'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { navConfig } from '@/components/dashboard/nav-config'
import { Menu } from 'lucide-react'

export function MobileNav({
  triggerClassName = '',
}: {
  triggerClassName?: string
}) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className={`md:hidden gap-2 ${triggerClassName}`} aria-label="Open navigation">
          <Menu className="w-4 h-4" />
          Menu
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[85%] max-w-sm overflow-y-auto">
        <div className="p-4 sm:p-5">
          <SheetHeader>
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-6">
            {navConfig.map((section) => (
              <div key={section.id} className="space-y-2">
                <div className="px-1 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">
                  {section.label}
                </div>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.href)
                    return (
                      <div key={item.id}>
                        <Link href={item.href}>
                          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                            active ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-accent'
                          }`}>
                            <Icon className="w-4 h-4" />
                            <span className="text-sm truncate flex-1">{item.label}</span>
                          </div>
                        </Link>
                        {item.submenu && item.submenu.length > 0 && (
                          <div className="ml-7 mt-1 space-y-0.5 border-l border-border/50 pl-3">
                            {item.submenu.map((sub) => (
                              <Link key={sub.id} href={sub.href}>
                                <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                                  isActive(sub.href) ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                                }`}>
                                  <sub.icon className="w-3.5 h-3.5" />
                                  <span className="truncate">{sub.label}</span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

