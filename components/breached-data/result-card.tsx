'use client'

import { Badge } from '@/components/ui/badge'
import {
  Mail,
  Key,
  Hash,
  User,
  MapPin,
  Globe,
  Phone,
  Link2,
} from 'lucide-react'

// A helper to render an array of items with a label and icon
const DataField = ({
  icon: Icon,
  label,
  data,
}: {
  icon: React.ElementType
  label: string
  data?: string[] | null
}) => {
  if (!data || data.length === 0) return null
  return (
    <div className="flex items-start text-sm">
      <Icon className="w-4 h-4 mr-2 mt-1 text-muted-foreground flex-shrink-0" />
      <div className="flex-1">
        <span className="font-semibold">{label}:</span>
        <div className="flex flex-wrap gap-2 mt-1">
          {data.map((item, index) => (
            <Badge key={index} variant="secondary" className="font-mono text-xs">
              {item}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

export function BreachedDataResultCard({ entry }: { entry: any }) {
  return (
    <div className="border border-border rounded-lg p-4 bg-card/50 transition-all hover:bg-card/80 hover:shadow-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-primary">{entry.database_name}</h3>
        {entry.id && (
          <span className="text-xs text-muted-foreground font-mono">
            ID: {entry.id}
          </span>
        )}
      </div>
      <div className="space-y-3">
        <DataField icon={User} label="Name" data={entry.name} />
        <DataField icon={User} label="Username" data={entry.username} />
        <DataField icon={Mail} label="Email" data={entry.email} />
        {/* <DataField icon={Key} label="Password" data={entry.password} /> */}
        {/* <DataField
          icon={Hash}
          label="Hashed Password"
          data={entry.hashed_password}
        /> */}
        <DataField icon={Globe} label="IP Address" data={entry.ip_address} />
        <DataField icon={MapPin} label="Address" data={entry.address} />
        <DataField icon={Phone} label="Phone" data={entry.phone} />
        <DataField icon={Link2} label="Social" data={entry.social} />
      </div>
    </div>
  )
}
