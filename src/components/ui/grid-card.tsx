"use client"

import React, { useState } from "react"

interface GridCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export function GridCard({ icon, title, description }: GridCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleTouchStart = () => {
    setIsHovered(true)
  }

  const handleTouchEnd = () => {
    // Delay to allow users to see the animation before it disappears
    setTimeout(() => setIsHovered(false), 200)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  return (
    <div 
      className={`group relative overflow-hidden rounded-xl border border-gray-700 bg-gray-900/50 p-8 min-h-[280px] transition-all duration-500 ${
        isHovered ? 'border-orange-500/45 shadow-2xl shadow-orange-500/20 -translate-y-2' : ''
      } hover:border-orange-500/45 hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-2`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Animated grid pattern on hover */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${
        isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      }`}
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 12px,
            rgba(150, 150, 150, 0.25) 12px,
            rgba(150, 150, 150, 0.25) 13px
          )`
        }}
      />
      
      <div className="relative z-10 h-full flex flex-col">
        {/* Icon with hover animation */}
        <div className={`mb-6 flex items-center justify-start transition-transform duration-500 ${
          isHovered ? 'scale-110' : 'group-hover:scale-110'
        }`}>
          <div className="relative">
            <div className={`absolute inset-0 bg-orange-500/20 rounded-lg blur-xl transition-opacity duration-500 ${
              isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`} />
            <div className="relative">
              {icon}
            </div>
          </div>
        </div>

        {/* Title with orange accent on hover */}
        <h3 className={`mb-4 text-2xl font-bold transition-colors duration-500 ${
          isHovered ? 'text-orange-400' : 'text-white group-hover:text-orange-400'
        }`}>
          {title}
        </h3>

        {/* Description with better spacing */}
        <p className={`text-base leading-relaxed flex-1 transition-colors duration-500 ${
          isHovered ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'
        }`}>
          {description}
        </p>
        
        {/* Decorative line that appears on hover */}
        <div className={`mt-6 h-0.5 bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-500 ${
          isHovered ? 'w-full' : 'w-0 group-hover:w-full'
        }`} />
      </div>
    </div>
  )
}
