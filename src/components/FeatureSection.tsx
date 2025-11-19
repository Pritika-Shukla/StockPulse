"use client"

import { GridCard } from "./ui/grid-card"

// Icon components
const ChartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-orange-500 stroke-2">
    <path d="M3 3v18h18" />
    <path d="M18 17V9" />
    <path d="M13 17v-4" />
    <path d="M8 17v-2" />
  </svg>
)

const WatchlistIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-orange-500 stroke-2">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-orange-500 stroke-2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
)

const TrendingIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-orange-500 stroke-2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
)

const AnalyticsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-orange-500 stroke-2">
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
)

const RealTimeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-orange-500 stroke-2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

export default function FeatureSection() {
  const cards = [
    {
      icon: <RealTimeIcon />,
      title: "Real-Time Data",
      description: "Get instant access to live stock prices, market updates, and real-time quotes to make informed trading decisions"
    },
    {
      icon: <ChartIcon />,
      title: "Advanced Charts",
      description: "Interactive TradingView charts with technical analysis tools, indicators, and customizable timeframes"
    },
    {
      icon: <WatchlistIcon />,
      title: "Personal Watchlist",
      description: "Track your favorite stocks in one place and monitor their performance with personalized alerts"
    },
    {
      icon: <SearchIcon />,
      title: "Smart Search",
      description: "Quickly find stocks by symbol or company name with instant search results and trending suggestions"
    },
    {
      icon: <AnalyticsIcon />,
      title: "Market Analytics",
      description: "Comprehensive market overview with heatmaps, top gainers, losers, and detailed financial metrics"
    },
    {
      icon: <TrendingIcon />,
      title: "Trend Analysis",
      description: "Identify market trends and patterns with advanced technical analysis and price movement insights"
    }
  ]

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="text-orange-500 text-sm font-medium mb-2">Use Cases</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">For Active Traders & Investors</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            We empower traders and investors to track, analyze, and make informed decisions with real-time market data and advanced analytics
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => (
            <GridCard
              key={index}
              icon={card.icon}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
