import { NextRequest, NextResponse } from "next/server";
import { searchStocks, getStockQuote } from "@/lib/actions/finnhub.actions";
import { getWatchlistItems } from "@/lib/actions/watchlist.actions";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || undefined;
    
    const results = await searchStocks(query);
    
    // Get user's watchlist to mark items
    const watchlistItems = await getWatchlistItems();
    const watchlistSymbols = new Set(watchlistItems.map(item => item.symbol));
    
    // Fetch quotes for all results to determine trending status
    const resultsWithQuotes = await Promise.all(
      results.map(async (stock) => {
        try {
          const quote = await getStockQuote(stock.symbol);
          return {
            ...stock,
            isInWatchlist: watchlistSymbols.has(stock.symbol),
            percentChange: quote?.percentChange ?? 0,
          };
        } catch (error) {
          // If quote fetch fails, set percentChange to 0
          return {
            ...stock,
            isInWatchlist: watchlistSymbols.has(stock.symbol),
            percentChange: 0,
          };
        }
      })
    );
    
    // Sort by percent change (descending) - most trending first
    const sortedResults = resultsWithQuotes.sort((a, b) => {
      // First, prioritize stocks with positive percent change
      if (a.percentChange > 0 && b.percentChange <= 0) return -1;
      if (a.percentChange <= 0 && b.percentChange > 0) return 1;
      // Then sort by absolute percent change (descending)
      return Math.abs(b.percentChange) - Math.abs(a.percentChange);
    });
    
    return NextResponse.json(sortedResults);
  } catch (error) {
    console.error("Error in search API:", error);
    return NextResponse.json(
      { error: "Failed to search stocks" },
      { status: 500 }
    );
  }
}

