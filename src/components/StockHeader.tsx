"use client";

import { useState, useEffect } from "react";
import { StockQuote, StockProfile } from "@/lib/actions/finnhub.actions";
import { Star } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface StockHeaderProps {
  symbol: string;
  profile: StockProfile;
  quote: StockQuote;
  exchangeName: string;
  marketCap: string;
  peRatio: string;
  eps: string;
  divYield: string;
}

export default function StockHeader({
  symbol,
  profile,
  quote,
  exchangeName,
  marketCap,
  peRatio,
  eps,
  divYield,
}: StockHeaderProps) {
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if stock is in watchlist
    const checkWatchlist = async () => {
      try {
        const response = await fetch(`/api/watchlist?symbol=${encodeURIComponent(symbol)}`);
        if (response.ok) {
          const data = await response.json();
          setIsInWatchlist(data.isInWatchlist || false);
        }
      } catch (error) {
        console.error("Error checking watchlist:", error);
      } finally {
        setIsChecking(false);
      }
    };
    checkWatchlist();
  }, [symbol]);

  const toggleWatchlist = async () => {
    setIsLoading(true);
    try {
      const action = isInWatchlist ? "remove" : "add";
      const response = await fetch("/api/watchlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symbol,
          company: profile.name,
          action,
        }),
      });

      if (response.ok) {
        setIsInWatchlist(!isInWatchlist);
      } else {
        console.error("Failed to update watchlist");
      }
    } catch (error) {
      console.error("Error updating watchlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isPositive = quote.change >= 0;
  const changeColor = isPositive ? "text-green-400" : "text-red-400";

  // Format price
  const formatPrice = (price: number) => price.toFixed(2);

  // Get market status (simplified - would need actual market hours)
  const getMarketStatus = () => {
    const now = new Date();
    // Simple check - market typically open 9:30 AM - 4:00 PM ET
    return "MARKET CLOSED (AS OF " + now.toLocaleTimeString("en-US", { timeZoneName: "short" }) + ")";
  };
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      {/* Top Row - Company Info and Add to Watchlist */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          {profile.logo && (
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-700">
              <Image
                src={profile.logo}
                alt={profile.name}
                fill
                className="object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-white">{profile.name.toUpperCase()}</h1>
            <p className="text-gray-400 text-sm">{symbol}</p>
            <p className="text-gray-500 text-xs">{exchangeName}</p>
          </div>
        </div>
        <button
          onClick={toggleWatchlist}
          disabled={isLoading || isChecking}
          className={cn(
            "px-4 py-2 font-semibold rounded-lg transition-colors flex items-center gap-2",
            isInWatchlist
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-yellow-500 hover:bg-yellow-600 text-gray-900",
            (isLoading || isChecking) && "opacity-50 cursor-not-allowed"
          )}
        >
          <Star className={cn("w-4 h-4", isInWatchlist && "fill-current")} />
          {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
        </button>
      </div>

      {/* Price and Change */}
      <div className="flex items-baseline gap-4 mb-4">
        <div>
          <div className="text-4xl font-bold text-white">{formatPrice(quote.currentPrice)} USD</div>
          <div className={`text-xl font-semibold ${changeColor}`}>
            {isPositive ? "+" : ""}{formatPrice(quote.change)} ({isPositive ? "+" : ""}{quote.percentChange.toFixed(2)}%)
          </div>
          <div className="text-gray-500 text-sm mt-1">{getMarketStatus()}</div>
        </div>
      </div>

      {/* Key Metrics Bar */}
      <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-gray-700">
        <div className="text-sm">
          <span className="text-gray-400">EPS: </span>
          <span className="text-white font-semibold">{eps}</span>
        </div>
        <div className="text-sm">
          <span className="text-gray-400">MARKET CAP: </span>
          <span className="text-white font-semibold">{marketCap}</span>
        </div>
        <div className="text-sm">
          <span className="text-gray-400">DIV YIELD: </span>
          <span className="text-white font-semibold">{divYield}</span>
        </div>
        <div className="text-sm">
          <span className="text-gray-400">P/E: </span>
          <span className="text-white font-semibold">{peRatio}</span>
        </div>
      </div>
    </div>
  );
}

