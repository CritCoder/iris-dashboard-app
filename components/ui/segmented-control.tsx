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
      className={`relative bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-1.5 flex items-center gap-1 ${className ?? ''}`}
    >
      {/* Glider */}
      <div
        aria-hidden
        className="absolute top-1.5 bottom-1.5 rounded-lg bg-zinc-800 shadow-lg border border-zinc-700/50 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
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
            className={`relative z-10 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ease-out whitespace-nowrap ${
              selected
                ? 'text-white'
                : 'text-zinc-400 hover:text-zinc-200'
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

