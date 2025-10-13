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
  const buttonRefs = React.useRef<(HTMLButtonElement | null)[]>([])
  const [gliderStyle, setGliderStyle] = React.useState<React.CSSProperties>({})
  const index = Math.max(0, options.findIndex(o => o.value === value))

  React.useEffect(() => {
    const activeButton = buttonRefs.current[index]
    if (activeButton) {
      setGliderStyle({
        width: `${activeButton.offsetWidth}px`,
        transform: `translateX(${activeButton.offsetLeft}px)`,
      })
    }
  }, [index, options])

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={`relative bg-muted border border-border rounded-lg py-1 px-1.5 flex items-center gap-0.5 ${className ?? ''}`}
    >
      {/* Glider */}
      <div
        aria-hidden
        className="absolute top-1 bottom-1 left-1.5 rounded-md bg-background shadow-md border border-border transition-all duration-300"
        style={gliderStyle}
      />

      {/* Options */}
      {options.map((opt, i) => {
        const selected = opt.value === value
        return (
          <button
            key={opt.value}
            ref={(el) => { buttonRefs.current[i] = el }}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`segment-${opt.value}`}
            id={`segment-trigger-${opt.value}`}
            className={`relative z-10 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-300 ease-out whitespace-nowrap ${
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

