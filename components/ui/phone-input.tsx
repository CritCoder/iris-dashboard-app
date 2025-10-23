'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  required?: boolean
  id?: string
  name?: string
}

export function PhoneInput({
  value,
  onChange,
  placeholder = "9876543210",
  className,
  disabled = false,
  required = false,
  id,
  name
}: PhoneInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, '').slice(0, 10)
    onChange(inputValue)
  }

  return (
    <div className="relative">
      <div className="flex items-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden focus-within:border-white/30 focus-within:bg-white/10 transition-all duration-200">
        {/* India Flag and Country Code */}
        <div className="flex items-center gap-2 px-3 py-3 border-r border-white/10">
          <div className="relative w-6 h-4 flex-shrink-0">
            {/* India Flag SVG */}
            <svg
              viewBox="0 0 24 16"
              className="w-6 h-4"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="24" height="16" fill="#FF9933" />
              <rect y="5.33" width="24" height="5.33" fill="#FFFFFF" />
              <rect y="10.67" width="24" height="5.33" fill="#138808" />
              <g transform="translate(12,8)">
                <circle r="1.5" fill="#000080" />
                <g stroke="#000080" strokeWidth="0.2" fill="none">
                  {Array.from({ length: 24 }, (_, i) => (
                    <line
                      key={i}
                      x1={0}
                      y1={0}
                      x2={Math.cos((i * 15 * Math.PI) / 180) * 2}
                      y2={Math.sin((i * 15 * Math.PI) / 180) * 2}
                    />
                  ))}
                </g>
              </g>
            </svg>
            <span className="text-base font-medium text-white ml-1">+91</span>
          </div>
        </div>
        
        {/* Phone Number Input */}
        <input
          id={id}
          name={name}
          type="tel"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          maxLength={10}
          className={cn(
            "bg-transparent text-white placeholder:text-zinc-400 flex-1 h-12 text-base font-medium px-4 transition-all duration-200 focus:outline-none",
            className
          )}
        />
      </div>
    </div>
  )
}

// Alternative version for light backgrounds
export function PhoneInputLight({
  value,
  onChange,
  placeholder = "9876543210",
  className,
  disabled = false,
  required = false,
  id,
  name
}: PhoneInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, '').slice(0, 10)
    onChange(inputValue)
  }

  return (
    <div className="relative">
      <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-200">
        {/* India Flag and Country Code */}
        <div className="flex items-center gap-2 px-3 py-3 border-r border-gray-300">
          <div className="relative w-6 h-4 flex-shrink-0">
            {/* India Flag SVG */}
            <svg
              viewBox="0 0 24 16"
              className="w-6 h-4"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="24" height="16" fill="#FF9933" />
              <rect y="5.33" width="24" height="5.33" fill="#FFFFFF" />
              <rect y="10.67" width="24" height="5.33" fill="#138808" />
              <g transform="translate(12,8)">
                <circle r="1.5" fill="#000080" />
                <g stroke="#000080" strokeWidth="0.2" fill="none">
                  {Array.from({ length: 24 }, (_, i) => (
                    <line
                      key={i}
                      x1={0}
                      y1={0}
                      x2={Math.cos((i * 15 * Math.PI) / 180) * 2}
                      y2={Math.sin((i * 15 * Math.PI) / 180) * 2}
                    />
                  ))}
                </g>
              </g>
            </svg>
            <span className="text-base font-medium text-gray-700 ml-1">+91</span>
          </div>
        </div>
        
        {/* Phone Number Input */}
        <input
          id={id}
          name={name}
          type="tel"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          maxLength={10}
          className={cn(
            "bg-transparent text-gray-900 placeholder:text-gray-500 flex-1 h-12 text-base font-medium px-4 transition-all duration-200 focus:outline-none",
            className
          )}
        />
      </div>
    </div>
  )
}
