import TradingViewWidget from "@/components/TradingViewWidget";
import HeroSection from "@/components/HeroSection";
import Header from "@/components/Header";
import {
    HEATMAP_WIDGET_CONFIG,
    MARKET_DATA_WIDGET_CONFIG,
    MARKET_OVERVIEW_WIDGET_CONFIG,
    TOP_STORIES_WIDGET_CONFIG
} from "@/lib/constants";
import { getAllUsers } from "@/lib/actions/users.actions";

const Home = async () => {
    const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

    return (
        <div className="min-h-screen bg-gray-900">
            <Header  />
            {/* Hero Section */}
            <HeroSection />
            
           
        </div>
    )
}

export default Home;