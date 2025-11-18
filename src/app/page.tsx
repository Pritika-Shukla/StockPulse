import HeroSection from "@/components/HeroSection";
import Header from "@/components/Header";

const Home = async () => {

    return (
        <div className="min-h-screen bg-gray-900">
            <Header  />
            {/* Hero Section */}
            <HeroSection />
            
           
        </div>
    )
}

export default Home;