import HeroSection from "@/components/HeroSection";
import Header from "@/components/Header";
import FeatureSection from "@/components/FeatureSection";
import Footer from "@/components/Footer";

const Home = async () => {

    return (
        <>
        <Header  />
        {/* Hero Section */}
        <HeroSection />
        {/* Feature Section */}
        <FeatureSection />
        {/* Footer */}
        <Footer />
  </>
    )
}

export default Home;