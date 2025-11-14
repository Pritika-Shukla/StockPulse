"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, Star, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { StockWithWatchlistStatus } from "@/lib/actions/finnhub.actions"

interface SearchModalProps {
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SearchModal({ isOpen: controlledIsOpen, onOpenChange }: SearchModalProps = {}) {
  const router = useRouter()
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [stocks, setStocks] = useState<StockWithWatchlistStatus[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [favorites, setFavorites] = useState(new Set<string>())
  const searchInputRef = useRef<HTMLInputElement>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

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

  // Fetch stocks when search query changes (with debounce)
  useEffect(() => {
    if (!isOpen) return

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    setIsLoading(true)

    // Debounce the search
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const query = searchQuery.trim() || undefined
        const url = query 
          ? `/api/search?q=${encodeURIComponent(query)}`
          : `/api/search`
        
        const response = await fetch(url)
        if (!response.ok) throw new Error("Failed to fetch stocks")
        
        const data = await response.json()
        setStocks(data || [])
      } catch (error) {
        console.error("Error fetching stocks:", error)
        setStocks([])
      } finally {
        setIsLoading(false)
      }
    }, 300) // 300ms debounce

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [searchQuery, isOpen])

  const toggleFavorite = (symbol: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(symbol)) {
      newFavorites.delete(symbol)
    } else {
      newFavorites.add(symbol)
    }
    setFavorites(newFavorites)

    // Update stocks with new favorite state
    setStocks(
      stocks.map((stock) => ({
        ...stock,
        isInWatchlist: newFavorites.has(stock.symbol),
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
            {isLoading ? (
              <div className="px-4 py-8 text-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Searching...</p>
              </div>
            ) : stocks.length > 0 ? (
              <>
                <div className="px-4 py-2 text-xs font-medium text-muted-foreground bg-gray-800">
                  {searchQuery.trim() ? `Search Results (${stocks.length})` : `Popular Stocks (${stocks.length})`}
                </div>
                <div className="divide-y divide-border/30">
                  {stocks.map((stock) => (
                    <div
                      key={stock.symbol}
                      onClick={() => {
                        router.push(`/stock/${stock.symbol}`)
                        setIsOpen(false)
                      }}
                      className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                          <span className="text-xs font-bold text-foreground">{stock.symbol.substring(0, 2)}</span>
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-sm text-foreground">{stock.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {stock.symbol} • {stock.exchange} • {stock.type}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(stock.symbol)
                        }}
                        className="ml-2 p-2 hover:bg-muted rounded transition-colors"
                      >
                        <Star
                          className={cn(
                            "h-4 w-4 transition-colors",
                            favorites.has(stock.symbol) || stock.isInWatchlist
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground",
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
