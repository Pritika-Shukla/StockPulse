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
            <Header showAuth={true} />
            {/* Hero Section */}
            <HeroSection />
            
            {/* Trading Widgets Section */}
            <section className="py-16 bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-white mb-4">Live Market Data</h2>
                        <p className="text-gray-400 text-lg">Real-time insights and analytics to help you make informed decisions</p>
                    </div>
                    
                    <div className="grid w-full gap-8 home-section">
                        <div className="md:col-span-1 xl:col-span-1">
                            <TradingViewWidget
                              title="Market Overview"
                              scriptUrl={`${scriptUrl}market-overview.js`}
                              config={MARKET_OVERVIEW_WIDGET_CONFIG}
                              className="custom-chart"
                              height={600}
                            />
                        </div>
                        <div className="md:col-span-1 xl:col-span-2">
                            <TradingViewWidget
                                title="Stock Heatmap"
                                scriptUrl={`${scriptUrl}stock-heatmap.js`}
                                config={HEATMAP_WIDGET_CONFIG}
                                height={600}
                                className="custom-chart"
                            />
                        </div>
                    </div>
                    
                    <div className="grid w-full gap-8 home-section mt-8">
                        <div className="h-full md:col-span-1 xl:col-span-1">
                            <TradingViewWidget
                                scriptUrl={`${scriptUrl}timeline.js`}
                                config={TOP_STORIES_WIDGET_CONFIG}
                                height={600}
                                className="custom-chart"
                            />
                        </div>
                        <div className="h-full md:col-span-1 xl:col-span-2">
                            <TradingViewWidget
                                scriptUrl={`${scriptUrl}market-quotes.js`}
                                config={MARKET_DATA_WIDGET_CONFIG}
                                height={600}
                                className="custom-chart"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

//testttt
export default Home;