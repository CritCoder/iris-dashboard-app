'use client'

import {
  User,
  Mail,
  AtSign,
  Globe,
  Key,
  Hash,
  Car,
  Badge,
  MapPin,
  Phone,
  Link2,
  Bitcoin,
  Globe2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const searchTypes: { name: string; id: string; icon: LucideIcon }[] = [
  { name: 'Name', id: 'name', icon: User },
  { name: 'Email', id: 'email', icon: Mail },
  { name: 'Username', id: 'username', icon: AtSign },
  { name: 'IP Address', id: 'ip_address', icon: Globe },
  { name: 'Password', id: 'password', icon: Key },
  { name: 'Hashed Password', id: 'hashed_password', icon: Hash },
  { name: 'VIN', id: 'vin', icon: Car },
  { name: 'License Plate', id: 'license_plate', icon: Badge },
  { name: 'Address', id: 'address', icon: MapPin },
  { name: 'Phone', id: 'phone', icon: Phone },
  { name: 'Social', id: 'social', icon: Link2 },
  { name: 'Crypto Address', id: 'cryptocurrency_address', icon: Bitcoin },
  { name: 'Domain', id: 'domain', icon: Globe2 },
]

interface BreachedDataSidebarProps {
  activeType: string
  onTypeChange: (typeId: string) => void
}

export function BreachedDataSidebar({
  activeType,
  onTypeChange,
}: BreachedDataSidebarProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="px-2 mb-2 text-lg font-semibold tracking-tight">
          Search By
        </h2>
        <div className="space-y-1">
          {searchTypes.map((type) => {
            const Icon = type.icon
            const isActive = activeType === type.id
            return (
              <button
                key={type.id}
                onClick={() => onTypeChange(type.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md group transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted/50'
                }`}
              >
                <Icon
                  className={`mr-3 h-4 w-4 flex-shrink-0 ${
                    isActive ? '' : 'text-muted-foreground'
                  }`}
                />
                <span>{type.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
