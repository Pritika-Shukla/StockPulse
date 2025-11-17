import { notFound } from "next/navigation";
import { getStockQuote, getStockProfile } from "@/lib/actions/finnhub.actions";
import StockDetailPage from "@/components/StockDetailPage";

interface StockPageProps {
  params: Promise<{ symbol: string }>;
}

export default async function StockPage({ params }: StockPageProps) {
  const { symbol } = await params;
  const cleanSymbol = symbol.toUpperCase();

  const [quote, profile] = await Promise.all([
    getStockQuote(cleanSymbol),
    getStockProfile(cleanSymbol),
  ]);

  if (!quote || !profile) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 pt-24 md:pt-32 ">
        <h1 className="text-4xl font-bold text-white mb-6">
          {profile.name || cleanSymbol} ({cleanSymbol}) Detail Analysis
        </h1>
      </div>
      <StockDetailPage symbol={cleanSymbol} quote={quote} profile={profile} />
    </div>
  );
}

