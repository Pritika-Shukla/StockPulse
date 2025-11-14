"use client";

import { StockQuote } from "@/lib/actions/finnhub.actions";
import TradingViewWidget from "./TradingViewWidget";
import { CANDLE_CHART_WIDGET_CONFIG, BASELINE_WIDGET_CONFIG } from "@/lib/constants";
import { getTradingViewSymbol } from "@/lib/utils";

interface StockChartsProps {
  symbol: string;
  quote: StockQuote;
  exchange: string;
}

export default function StockCharts({ symbol, quote, exchange }: StockChartsProps) {
  const scriptUrl = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
  const tvSymbol = getTradingViewSymbol(symbol, exchange);

  // Update configs with symbol
  const candleConfig = {
    ...CANDLE_CHART_WIDGET_CONFIG(symbol),
    symbol: tvSymbol,
  };

  const baselineConfig = {
    ...BASELINE_WIDGET_CONFIG(symbol),
    symbol: tvSymbol,
  };

  return (
    <div className="space-y-6">
      {/* Top Chart - Candlestick */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="mb-2">
          <h3 className="text-white font-semibold text-sm">
            {symbol} - 1D - Cboe One
          </h3>
          <div className="text-gray-400 text-xs">
            O:{quote.open.toFixed(2)} H:{quote.high.toFixed(2)} L:{quote.low.toFixed(2)} C:{quote.currentPrice.toFixed(2)} {quote.change >= 0 ? "+" : ""}{quote.change.toFixed(2)} ({quote.percentChange >= 0 ? "+" : ""}{quote.percentChange.toFixed(2)}%)
          </div>
        </div>
        <div className="h-[500px]">
          <TradingViewWidget
            scriptUrl={scriptUrl}
            config={candleConfig}
            height={500}
            className="custom-chart"
          />
        </div>
      </div>

      {/* Bottom Chart - Line Chart */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="mb-2">
          <h3 className="text-white font-semibold text-sm">
            {symbol} - 1D - Cboe One
          </h3>
          <div className="text-gray-400 text-xs">
            {quote.currentPrice.toFixed(2)} {quote.change >= 0 ? "+" : ""}{quote.change.toFixed(2)} ({quote.percentChange >= 0 ? "+" : ""}{quote.percentChange.toFixed(2)}%)
          </div>
        </div>
        <div className="h-[500px]">
          <TradingViewWidget
            scriptUrl={scriptUrl}
            config={baselineConfig}
            height={500}
            className="custom-chart"
          />
        </div>
      </div>
    </div>
  );
}

