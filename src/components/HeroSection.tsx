import React from "react";

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
            Get real-time stock data, advanced analytics, and personalized
            insights to make informed investment decisions.
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
        </div>
        <div className="py-12 w-[80%] mx-auto bg-[#262626] ">
          {/* Video Demo Section */}
          <section className=" ">
            {/* Video Container */}
            <div className="mx-auto px-4 md:px-8 lg:px-12 relative">
              <div className="relative w-full max-w-6xl mx-auto">

                {/* Video wrapper with border */}
                <div className="border-l-2 border-4 border-black/5 rounded-lg p-2 md:p-4 bg-[#1a1a1a]/50 backdrop-blur-sm">
                  <div className="w-full h-[70vh] md:h-[85vh] overflow-hidden rounded-lg shadow-2xl border border-gray-800">
                    <video
                      src="/demo.mp4"
                      autoPlay
                      muted
                      loop
                      className="w-full h-full object-cover"
                      playsInline
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
