import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Stock Not Found</h1>
        <p className="text-gray-400 mb-8">The stock symbol you're looking for doesn't exist or is not available.</p>
        <Link
          href="/"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

