"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search, Star, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface Stock {
  id: string
  symbol: string
  name: string
  category: string
  ticker: string
  isFavorited: boolean
}

const POPULAR_STOCKS: Stock[] = [
  {
    id: "1",
    symbol: "AAPL",
    name: "Apple Inc",
    category: "Consumer Electronics",
    ticker: "NASDAQ:NMS",
    isFavorited: true,
  },
  {
    id: "2",
    symbol: "MSFT",
    name: "Microsoft Corp",
    category: "Software",
    ticker: "NASDAQ:NMS",
    isFavorited: false,
  },
  {
    id: "3",
    symbol: "GOOGL",
    name: "Alphabet Inc",
    category: "Internet Content & Information",
    ticker: "NASDAQ:NMS",
    isFavorited: true,
  },
  {
    id: "4",
    symbol: "TSLA",
    name: "Tesla Inc",
    category: "Auto Manufacturers",
    ticker: "NASDAQ:NMS",
    isFavorited: false,
  },
  {
    id: "5",
    symbol: "META",
    name: "Meta Platforms Inc",
    category: "Internet Content & Information",
    ticker: "NASDAQ:NMS",
    isFavorited: false,
  },
]

interface SearchModalProps {
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SearchModal({ isOpen: controlledIsOpen, onOpenChange }: SearchModalProps = {}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [stocks, setStocks] = useState<Stock[]>(POPULAR_STOCKS)
  const [favorites, setFavorites] = useState(new Set(POPULAR_STOCKS.filter((s) => s.isFavorited).map((s) => s.id)))
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Use controlled state if provided, otherwise use internal state
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen
  const setIsOpen = useCallback((open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open)
    } else {
      setInternalIsOpen(open)
    }
  }, [onOpenChange])

  // Handle Cmd+K or Ctrl+K keyboard shortcut (always active)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, setIsOpen])

  // Focus search input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  // Filter stocks based on search query
  const filteredStocks = stocks.filter(
    (stock) =>
      stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(id)) {
      newFavorites.delete(id)
    } else {
      newFavorites.add(id)
    }
    setFavorites(newFavorites)

    // Update stocks with new favorite state
    setStocks(
      stocks.map((stock) => ({
        ...stock,
        isFavorited: newFavorites.has(stock.id),
      })),
    )
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setIsOpen(false)} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-32">
        <div className="w-full max-w-2xl rounded-lg bg-gray-700 shadow-lg">
          {/* Search Input */}
          <div className="flex items-center border-b border-border/50 px-4 py-3">
            <Search className="mr-3 h-5 w-5 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by symbol or company name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-foreground placeholder-muted-foreground text-sm"
            />
            <button onClick={() => setIsOpen(false)} className="ml-2 p-1 hover:bg-muted rounded transition-colors">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {filteredStocks.length > 0 ? (
              <>
                <div className="px-4 py-2 text-xs font-medium text-muted-foreground bg-gray-800">
                  Popular Stocks ({filteredStocks.length})
                </div>
                <div className="divide-y divide-border/30">
                  {filteredStocks.map((stock) => (
                    <div
                      key={stock.id}
                      className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                          <span className="text-xs font-bold text-foreground">{stock.symbol.substring(0, 2)}</span>
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-sm text-foreground">{stock.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {stock.symbol} • {stock.ticker} • {stock.category}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(stock.id)
                        }}
                        className="ml-2 p-2 hover:bg-muted rounded transition-colors"
                      >
                        <Star
                          className={cn(
                            "h-4 w-4 transition-colors",
                            favorites.has(stock.id) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground",
                          )}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-muted-foreground">No stocks found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
