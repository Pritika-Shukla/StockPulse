"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { StockQuote } from "@/lib/actions/finnhub.actions";
import { Watchlist } from "@prisma/client";

interface WatchlistTableProps {
  watchlistItems: (Watchlist & { quote: StockQuote | null })[];
}

export default function WatchlistTable({ watchlistItems: initialItems }: WatchlistTableProps) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (symbol: string) => {
    setDeleting(symbol);
    try {
      const response = await fetch("/api/watchlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symbol,
          action: "remove",
        }),
      });

      if (response.ok) {
        setItems(items.filter(item => item.symbol !== symbol));
      } else {
        console.error("Failed to delete from watchlist");
      }
    } catch (error) {
      console.error("Error deleting from watchlist:", error);
    } finally {
      setDeleting(null);
    }
  };

  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  const formatChange = (change: number, percentChange: number) => {
    const isPositive = change >= 0;
    const sign = isPositive ? "+" : "";
    return (
      <span className={isPositive ? "text-green-500" : "text-red-500"}>
        {sign}{formatPrice(change)} ({sign}{percentChange.toFixed(2)}%)
      </span>
    );
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="watchlist-table">
      <table className="w-full">
        <thead>
          <tr className="table-header-row">
            <th className="table-header text-left py-3 px-4">Symbol</th>
            <th className="table-header text-left py-3 px-4">Company</th>
            <th className="table-header text-right py-3 px-4">Price</th>
            <th className="table-header text-right py-3 px-4">Change</th>
            <th className="table-header text-right py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const quote = item.quote;
            return (
              <tr
                key={item.id}
                className="table-row"
                onClick={() => router.push(`/stock/${item.symbol}`)}
              >
                <td className="table-cell py-4 px-4">
                  <span className="font-bold text-white">{item.symbol}</span>
                </td>
                <td className="table-cell py-4 px-4">
                  <span className="text-gray-300">{item.company}</span>
                </td>
                <td className="table-cell py-4 px-4 text-right">
                  {quote ? (
                    <span className="text-white font-semibold">
                      ${formatPrice(quote.currentPrice)}
                    </span>
                  ) : (
                    <span className="text-gray-500">Loading...</span>
                  )}
                </td>
                <td className="table-cell py-4 px-4 text-right">
                  {quote ? formatChange(quote.change, quote.percentChange) : (
                    <span className="text-gray-500">-</span>
                  )}
                </td>
                <td className="table-cell py-4 px-4 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.symbol);
                    }}
                    disabled={deleting === item.symbol}
                    className="trash-icon p-2 hover:bg-red-500/20 rounded transition-colors disabled:opacity-50"
                    title="Remove from watchlist"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

