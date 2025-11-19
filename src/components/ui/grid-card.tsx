"use client"

import React from "react"

interface GridCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export function GridCard({ icon, title, description }: GridCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-700 bg-gray-900/50 p-8 min-h-[280px] transition-all duration-500 hover:border-orange-500/45 hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-2">
      {/* Animated grid pattern on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
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
        <div className="mb-6 flex items-center justify-start group-hover:scale-110 transition-transform duration-500">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              {icon}
            </div>
          </div>
        </div>

        {/* Title with orange accent on hover */}
        <h3 className="mb-4 text-2xl font-bold text-white group-hover:text-orange-400 transition-colors duration-500">
          {title}
        </h3>

        {/* Description with better spacing */}
        <p className="text-base text-gray-400 leading-relaxed flex-1 group-hover:text-gray-300 transition-colors duration-500">
          {description}
        </p>
        
        {/* Decorative line that appears on hover */}
        <div className="mt-6 h-0.5 w-0 bg-gradient-to-r from-orange-500 to-orange-400 group-hover:w-full transition-all duration-500" />
      </div>
    </div>
  )
}
