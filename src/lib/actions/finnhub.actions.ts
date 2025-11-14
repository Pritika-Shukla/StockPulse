import { cache } from "react";
import { MarketNewsArticle, RawNewsArticle } from "@/types";
import { getDateRange, validateArticle, formatArticle } from "../utils";
import { POPULAR_STOCK_SYMBOLS } from "../constants";

// Type definitions for Finnhub API
interface FinnhubSearchResult {
  symbol: string;
  description: string;
  displaySymbol: string;
  type: string;
}

interface FinnhubSearchResponse {
  result?: FinnhubSearchResult[];
}

interface FinnhubProfile {
  name?: string;
  ticker?: string;
  exchange?: string;
  finnhubIndustry?: string;
  country?: string;
  currency?: string;
  ipo?: string;
  logo?: string;
  marketCapitalization?: number;
  shareOutstanding?: number;
  weburl?: string;
  phone?: string;
  description?: string;
}

interface FinnhubQuote {
  c: number; // current price
  d: number; // change
  dp: number; // percent change
  h: number; // high price of the day
  l: number; // low price of the day
  o: number; // open price of the day
  pc: number; // previous close price
  t: number; // timestamp
}

interface FinnhubSearchResultWithExchange extends FinnhubSearchResult {
  __exchange?: string;
}

export interface StockWithWatchlistStatus {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
  isInWatchlist: boolean;
}

const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";
const NEXT_PUBLIC_FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

// Rate limiting: Finnhub allows 60 calls per minute for free tier
let lastCallTime = 0;
const MIN_CALL_INTERVAL = 1000; // 1 second between calls

async function rateLimitedFetch<T>(url: string, revalidateSeconds?: number): Promise<T> {
  const now = Date.now();
  const timeSinceLastCall = now - lastCallTime;
  
  if (timeSinceLastCall < MIN_CALL_INTERVAL) {
    const delay = MIN_CALL_INTERVAL - timeSinceLastCall;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  lastCallTime = Date.now();
  return fetchJSON<T>(url, revalidateSeconds);
}

async function fetchJSON<T>(url: string, revalidateSeconds?: number): Promise<T> {
  const options: RequestInit & { next?: { revalidate?: number } } = revalidateSeconds
    ? { cache: 'force-cache', next: { revalidate: revalidateSeconds } }
    : { cache: 'no-store' };

  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    
    // Handle rate limiting specifically
    if (res.status === 429) {
      console.warn('Rate limit exceeded, waiting before retry...');
      await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 1 minute
      throw new Error(`Rate limit exceeded: ${text}`);
    }
    
    throw new Error(`Fetch failed ${res.status}: ${text}`);
  }
  return (await res.json()) as T;
}

export { fetchJSON };

export async function getNews(symbols?: string[]): Promise<MarketNewsArticle[]> {
  try {
    const range = getDateRange(5);
    const token = process.env.FINNHUB_API_KEY ?? NEXT_PUBLIC_FINNHUB_API_KEY;
    if (!token) {
      throw new Error('FINNHUB API key is not configured');
    }
    const cleanSymbols = (symbols || [])
      .map((s) => s?.trim().toUpperCase())
      .filter((s): s is string => Boolean(s));

    const maxArticles = 6;

    // If we have symbols, try to fetch company news per symbol and round-robin select
    if (cleanSymbols.length > 0) {
      const perSymbolArticles: Record<string, RawNewsArticle[]> = {};

      // Process symbols sequentially to respect rate limits
      for (const sym of cleanSymbols) {
        try {
          const url = `${FINNHUB_BASE_URL}/company-news?symbol=${encodeURIComponent(sym)}&from=${range.from}&to=${range.to}&token=${token}`;
          const articles = await rateLimitedFetch<RawNewsArticle[]>(url, 300);
          perSymbolArticles[sym] = (articles || []).filter(validateArticle);
        } catch (e) {
          console.error('Error fetching company news for', sym, e);
          perSymbolArticles[sym] = [];
        }
      }

      const collected: MarketNewsArticle[] = [];
      // Round-robin up to 6 picks
      for (let round = 0; round < maxArticles; round++) {
        for (let i = 0; i < cleanSymbols.length; i++) {
          const sym = cleanSymbols[i];
          const list = perSymbolArticles[sym] || [];
          if (list.length === 0) continue;
          const article = list.shift();
          if (!article || !validateArticle(article)) continue;
          collected.push(formatArticle(article, true, sym, round));
          if (collected.length >= maxArticles) break;
        }
        if (collected.length >= maxArticles) break;
      }

      if (collected.length > 0) {
        // Sort by datetime desc
        collected.sort((a, b) => (b.datetime || 0) - (a.datetime || 0));
        return collected.slice(0, maxArticles);
      }
      // If none collected, fall through to general news
    }

    // General market news fallback or when no symbols provided
    const generalUrl = `${FINNHUB_BASE_URL}/news?category=general&token=${token}`;
    const general = await rateLimitedFetch<RawNewsArticle[]>(generalUrl, 300);

    const seen = new Set<string>();
    const unique: RawNewsArticle[] = [];
    for (const art of general || []) {
      if (!validateArticle(art)) continue;
      const key = `${art.id}-${art.url}-${art.headline}`;
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(art);
      if (unique.length >= 20) break; // cap early before final slicing
    }

    const formatted = unique.slice(0, maxArticles).map((a, idx) => formatArticle(a, false, undefined, idx));
    return formatted;
  } catch (err) {
    console.error('getNews error:', err);
    throw new Error('Failed to fetch news');
  }
}


export interface StockQuote {
  currentPrice: number;
  change: number;
  percentChange: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  timestamp: number;
}

export interface StockProfile {
  name: string;
  ticker: string;
  exchange: string;
  industry?: string;
  country?: string;
  currency?: string;
  ipo?: string;
  logo?: string;
  marketCapitalization?: number;
  shareOutstanding?: number;
  weburl?: string;
  phone?: string;
  description?: string;
}

export const getStockQuote = cache(async (symbol: string): Promise<StockQuote | null> => {
  try {
    const token = process.env.FINNHUB_API_KEY ?? NEXT_PUBLIC_FINNHUB_API_KEY;
    if (!token) {
      console.error('FINNHUB API key is not configured');
      return null;
    }

    const cleanSymbol = symbol.trim().toUpperCase();
    const url = `${FINNHUB_BASE_URL}/quote?symbol=${encodeURIComponent(cleanSymbol)}&token=${token}`;
    const quote = await rateLimitedFetch<FinnhubQuote>(url, 60); // Revalidate every minute

    if (!quote || quote.c === 0) {
      return null;
    }

    return {
      currentPrice: quote.c,
      change: quote.d,
      percentChange: quote.dp,
      high: quote.h,
      low: quote.l,
      open: quote.o,
      previousClose: quote.pc,
      timestamp: quote.t,
    };
  } catch (err) {
    console.error('Error fetching stock quote:', err);
    return null;
  }
});

export const getStockProfile = cache(async (symbol: string): Promise<StockProfile | null> => {
  try {
    const token = process.env.FINNHUB_API_KEY ?? NEXT_PUBLIC_FINNHUB_API_KEY;
    if (!token) {
      console.error('FINNHUB API key is not configured');
      return null;
    }

    const cleanSymbol = symbol.trim().toUpperCase();
    const url = `${FINNHUB_BASE_URL}/stock/profile2?symbol=${encodeURIComponent(cleanSymbol)}&token=${token}`;
    const profile = await rateLimitedFetch<FinnhubProfile>(url, 3600); // Revalidate every hour

    if (!profile || !profile.name) {
      return null;
    }

    return {
      name: profile.name,
      ticker: profile.ticker || cleanSymbol,
      exchange: profile.exchange || 'US',
      industry: profile.finnhubIndustry,
      country: profile.country,
      currency: profile.currency,
      ipo: profile.ipo,
      logo: profile.logo,
      marketCapitalization: profile.marketCapitalization,
      shareOutstanding: profile.shareOutstanding,
      weburl: profile.weburl,
      phone: profile.phone,
      description: profile.description,
    };
  } catch (err) {
    console.error('Error fetching stock profile:', err);
    return null;
  }
});

export const searchStocks = cache(async (query?: string): Promise<StockWithWatchlistStatus[]> => {
  try {
    const token = process.env.FINNHUB_API_KEY ?? NEXT_PUBLIC_FINNHUB_API_KEY;
    if (!token) {
      // If no token, log and return empty to avoid throwing per requirements
      console.error('Error in stock search:', new Error('FINNHUB API key is not configured'));
      return [];
    }

    const trimmed = typeof query === 'string' ? query.trim() : '';

    let results: (FinnhubSearchResult | FinnhubSearchResultWithExchange)[] = [];

    if (!trimmed) {
      // Fetch top 10 popular symbols' profiles
      const top = POPULAR_STOCK_SYMBOLS.slice(0, 10);
      const profiles = await Promise.all(
        top.map(async (sym) => {
          try {
            const url = `${FINNHUB_BASE_URL}/stock/profile2?symbol=${encodeURIComponent(sym)}&token=${token}`;
            // Revalidate every hour
            const profile = await fetchJSON<FinnhubProfile>(url, 3600);
            return { sym, profile };
          } catch (e) {
            console.error('Error fetching profile2 for', sym, e);
            return { sym, profile: null };
          }
        })
      );

      results = profiles
        .map(({ sym, profile }) => {
          const symbol = sym.toUpperCase();
          const name: string | undefined = profile?.name || profile?.ticker || undefined;
          const exchange: string | undefined = profile?.exchange || undefined;
          if (!name) return undefined;
          const r: FinnhubSearchResultWithExchange = {
            symbol,
            description: name,
            displaySymbol: symbol,
            type: 'Common Stock',
            __exchange: exchange,
          };
          return r;
        })
        .filter((x): x is FinnhubSearchResultWithExchange => Boolean(x));
    } else {
      const url = `${FINNHUB_BASE_URL}/search?q=${encodeURIComponent(trimmed)}&token=${token}`;
      const data = await fetchJSON<FinnhubSearchResponse>(url, 1800);
      results = Array.isArray(data?.result) ? data.result : [];
    }

    const mapped: StockWithWatchlistStatus[] = results
      .map((r) => {
        const upper = (r.symbol || '').toUpperCase();
        const name = r.description || upper;
        const exchangeFromDisplay = (r.displaySymbol as string | undefined) || undefined;
        const exchangeFromProfile = '__exchange' in r ? r.__exchange : undefined;
        const exchange = exchangeFromDisplay || exchangeFromProfile || 'US';
        const type = r.type || 'Stock';
        const item: StockWithWatchlistStatus = {
          symbol: upper,
          name,
          exchange,
          type,
          isInWatchlist: false,
        };
        return item;
      })
      .slice(0, 15);

    return mapped;
  } catch (err) {
    console.error('Error in stock search:', err);
    return [];
  }
});