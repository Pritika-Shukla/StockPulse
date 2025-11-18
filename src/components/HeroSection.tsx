import React from 'react'
import { Star } from 'lucide-react'

const HeroSection = () => {
  return (
    <section className="relative py-20 md:py-32 flex items-center justify-center bg-black overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Sub-headline */}
          <p className="text-base md:text-lg text-orange-500 mb-4 font-medium">
            For active traders and investors.
          </p>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
            Track and analyze
            <br />
            <span className="text-white">real-time </span>
            <span className="text-orange-500">market data</span>
          </h1>

          {/* Description */}
          <p className="text-base md:text-lg text-white mb-8 max-w-2xl mx-auto leading-relaxed">
            Get real-time stock data, advanced analytics, and personalized insights to make informed investment decisions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button className="bg-white text-black font-semibold py-2.5 px-7 rounded-md text-base transition-all duration-300 hover:bg-gray-100">
              Start Trading
            </button>
            
            <button className="bg-black border border-white text-white font-semibold py-2.5 px-7 rounded-md text-base transition-all duration-300 hover:bg-gray-900">
              Explore Markets
            </button>
          </div>

          {/* Endorsement Section */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 text-white">
            <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-black font-bold text-base">S</span>
            </div>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-black stroke-black" />
              ))}
            </div>
            <span className="text-sm md:text-base text-center">
              Trusted by traders worldwide. <span className="font-bold">StockPulse</span>.
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
