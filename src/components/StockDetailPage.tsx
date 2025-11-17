"use client";

import { StockQuote, StockProfile } from "@/lib/actions/finnhub.actions";
import StockHeader from "./StockHeader";
import StockCharts from "./StockCharts";
import StockSidebar from "./StockSidebar";

interface StockDetailPageProps {
  symbol: string;
  quote: StockQuote;
  profile: StockProfile;
}

export default function StockDetailPage({ symbol, quote, profile }: StockDetailPageProps) {
  // Format market cap
  const formatMarketCap = (cap?: number) => {
    if (!cap) return "N/A";
    if (cap >= 1e12) return `${(cap / 1e12).toFixed(2)}T`;
    if (cap >= 1e9) return `${(cap / 1e9).toFixed(2)}B`;
    if (cap >= 1e6) return `${(cap / 1e6).toFixed(2)}M`;
    return cap.toLocaleString();
  };

  // Calculate P/E ratio (simplified - would need earnings data)
  const peRatio = profile.marketCapitalization && quote.currentPrice 
    ? (profile.marketCapitalization / (quote.currentPrice * (profile.shareOutstanding || 1))).toFixed(2)
    : "N/A";

  // Calculate EPS (simplified - would need actual earnings data)
  const eps = "6.61"; // Placeholder - would need actual earnings data

  // Calculate dividend yield (simplified - would need dividend data)
  const divYield = "0.46%"; // Placeholder

  // Get exchange display name
  const getExchangeName = (exchange: string) => {
    const exchangeMap: Record<string, string> = {
      "NASDAQ": "Nasdaq Stock Market",
      "NYSE": "New York Stock Exchange",
      "AMEX": "American Stock Exchange",
    };
    return exchangeMap[exchange] || `${exchange} Stock Market`;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Top Section - Header with Company Info, Price, and Metrics */}
      <StockHeader
        symbol={symbol}
        profile={profile}
        quote={quote}
        exchangeName={getExchangeName(profile.exchange)}
        marketCap={formatMarketCap(profile.marketCapitalization)}
        peRatio={peRatio}
        eps={eps}
        divYield={divYield}
      />

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left Side - Charts (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <StockCharts symbol={symbol} quote={quote} exchange={profile.exchange} />
        </div>

        {/* Right Side - Sidebar (1/3 width) */}
        <div className="lg:col-span-1 space-y-6">
          <StockSidebar symbol={symbol} profile={profile} quote={quote} exchange={profile.exchange} />
        </div>
      </div>
    </div>
  );
}

