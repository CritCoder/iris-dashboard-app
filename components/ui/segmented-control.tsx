'use client'

import React from 'react'

interface Option {
  label: string
  value: string
}

interface SegmentedControlProps {
  options: Option[]
  value: string
  onChange: (val: string) => void
  className?: string
}

export function SegmentedControl({ options, value, onChange, className }: SegmentedControlProps) {
  const index = Math.max(0, options.findIndex(o => o.value === value))
  const width = 100 / Math.max(options.length, 1)

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={`relative bg-secondary border border-border rounded-lg p-1 flex items-center ${className ?? ''}`}
    >
      {/* Glider */}
      <div
        aria-hidden
        className="absolute top-1 bottom-1 rounded-md bg-background shadow-sm transition-transform duration-200 ease-out"
        style={{
          width: `calc(${width}% - 0.5rem)`,
          transform: `translateX(calc(${index} * ${width}%))`,
          left: '0.25rem',
        }}
      />

      {/* Options */}
      {options.map((opt, i) => {
        const selected = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`segment-${opt.value}`}
            id={`segment-trigger-${opt.value}`}
            className={`relative z-10 flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors pressable ${
              selected
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

