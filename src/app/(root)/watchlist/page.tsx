import { SearchModal } from '@/components/SearchCommands';
import { getWatchlistByEmail } from '@/lib/actions/watchlist.actions'
import { getUserEmail } from '@/lib/actions/users.actions'
import { Star } from 'lucide-react';
import React from 'react'
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const WatchlistPage = async () => {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  const email = await getUserEmail();
  
  if (!email) {
    return <div>Unable to get user email</div>;
  }

  const watchlist = await getWatchlistByEmail(email)
  if (watchlist.length === 0) {
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
  return (
    <div>
      <h1>Watchlist</h1>
    </div>
  )
}

export default WatchlistPage
