"use client";

import { StockQuote, StockProfile } from "@/lib/actions/finnhub.actions";
import TradingViewWidget from "./TradingViewWidget";
import { TECHNICAL_ANALYSIS_WIDGET_CONFIG, COMPANY_PROFILE_WIDGET_CONFIG, COMPANY_FINANCIALS_WIDGET_CONFIG } from "@/lib/constants";
import { getTradingViewSymbol } from "@/lib/utils";

interface StockSidebarProps {
  symbol: string;
  profile: StockProfile;
  quote: StockQuote;
  exchange: string;
}

export default function StockSidebar({ symbol, profile, quote: _quote, exchange }: StockSidebarProps) {
  const scriptUrl = "https://s3.tradingview.com/external-embedding/embed-widget-";
  const tvSymbol = getTradingViewSymbol(symbol, exchange);

  // Update configs with proper symbol format
  const technicalConfig = {
    ...TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol),
    symbol: tvSymbol,
  };

  const profileConfig = {
    ...COMPANY_PROFILE_WIDGET_CONFIG(symbol),
    symbol: tvSymbol,
    height: 450,
  };

  const financialsConfig = {
    ...COMPANY_FINANCIALS_WIDGET_CONFIG(symbol),
    symbol: tvSymbol,
    height: 864,
  };

  return (
    <div className="space-y-6">
      {/* Technical Analysis Widget */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-4">Technical Analysis for {symbol}</h3>
        <div className="h-[400px]">
          <TradingViewWidget
            scriptUrl={`${scriptUrl}technical-analysis.js`}
            config={technicalConfig}
            height={400}
            className="custom-chart"
          />
        </div>
      </div>

      {/* Company Profile Widget */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-4">{symbol} Profile</h3>
        <div className="space-y-3 mb-4">
          <div className="text-sm">
            <span className="text-gray-400">Sector: </span>
            <span className="text-white">{profile.industry || "N/A"}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-400">Industry: </span>
            <span className="text-white">{profile.industry || "N/A"}</span>
          </div>
        </div>
        {profile.description && (
          <div className="text-sm text-gray-300 leading-relaxed">
            {profile.description}
          </div>
        )}
        <div className="mt-4 h-[450px] overflow-hidden relative rounded-lg border-2 border-gray-700">
          <TradingViewWidget
            scriptUrl={`${scriptUrl}symbol-profile.js`}
            config={profileConfig}
            height={450}
            className="custom-chart"
          />
        </div>
      </div>

      {/* Financials Widget */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-4">{symbol} Financials</h3>
        <div className="h-[864px] overflow-hidden relative">
          <TradingViewWidget
            scriptUrl={`${scriptUrl}financials.js`}
            config={financialsConfig}
            height={864}
            className=""
          />
        </div>
      </div>
    </div>
  );
}

