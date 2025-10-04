import TradingViewWidget from "@/components/TradingViewWidget";
import { MARKET_OVERVIEW_WIDGET_CONFIG } from "@/lib/constants";

export default function Home() {
  return (
    <TradingViewWidget
    scriptUrl="https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js"
    config={MARKET_OVERVIEW_WIDGET_CONFIG}
    className="w-full h-[500px]"
    />
 
  );
}
