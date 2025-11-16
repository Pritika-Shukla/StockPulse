import { notFound } from "next/navigation";
import { getStockQuote, getStockProfile } from "@/lib/actions/finnhub.actions";
import StockDetailPage from "@/components/StockDetailPage";
import Header from "@/components/Header";

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
      <StockDetailPage symbol={cleanSymbol} quote={quote} profile={profile} />
    </div>
  );
}

