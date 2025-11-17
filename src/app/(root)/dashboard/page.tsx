import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome to Your Dashboard!</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Portfolio Overview</h2>
                <p className="text-gray-600">Track your investments and portfolio performance.</p>
                <div className="mt-4 text-2xl font-bold text-green-600">+12.5%</div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Watchlist</h2>
                <p className="text-gray-600">Monitor your favorite stocks and assets.</p>
                <div className="mt-4 text-sm text-gray-500">15 stocks tracked</div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Market News</h2>
                <p className="text-gray-600">Stay updated with the latest market insights.</p>
                <div className="mt-4 text-sm text-gray-500">24 new articles</div>
              </div>
            </div>
            
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">Bought 10 shares of AAPL</span>
                  <span className="text-sm text-gray-500">2 hours ago</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">Added TSLA to watchlist</span>
                  <span className="text-sm text-gray-500">1 day ago</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">Portfolio updated</span>
                  <span className="text-sm text-gray-500">3 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SignedIn>
    </div>
  );
};

export default Dashboard;
