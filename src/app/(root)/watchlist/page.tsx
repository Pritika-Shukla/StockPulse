import { SearchModal } from '@/components/SearchCommands';
import { getWatchlistItems } from '@/lib/actions/watchlist.actions'
import { getStockQuote } from '@/lib/actions/finnhub.actions'
import { Star } from 'lucide-react';
import React from 'react'
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import WatchlistTable from '@/components/WatchlistTable';
import { Watchlist } from '@prisma/client';
import { StockQuote } from '@/lib/actions/finnhub.actions';

const WatchlistPage = async () => {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  const watchlistItems = await getWatchlistItems();
  
  if (watchlistItems.length === 0) {
    return (
      <section className="flex watchlist-empty-container">
        <div className="watchlist-empty">
          <Star className="watchlist-star" />
          <h2 className="empty-title">Your watchlist is empty</h2>
          <p className="empty-description">
            Start building your watchlist by searching for stocks and clicking the star icon to add them.
          </p>
        </div>
        <SearchModal />
      </section>
    );
  }

  // Fetch quotes for all watchlist items
  const itemsWithQuotes = await Promise.all(
    watchlistItems.map(async (item) => {
      const quote = await getStockQuote(item.symbol);
      return {
        ...item,
        quote,
      };
    })
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="watchlist-title">My Watchlist</h1>
        <p className="text-gray-400 mt-2">Track your favorite stocks</p>
      </div>
      <WatchlistTable watchlistItems={itemsWithQuotes} />
    </div>
  )
}

export default WatchlistPage
