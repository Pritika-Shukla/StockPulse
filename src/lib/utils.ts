import { RawNewsArticle } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format relative time
export const formatTimeAgo = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp * 1000;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours >= 1) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }
};

// Delay helper
export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Market cap short format
export function formatMarketCapValue(marketCapUsd: number): string {
  if (!Number.isFinite(marketCapUsd) || marketCapUsd <= 0) return "N/A";

  if (marketCapUsd >= 1e12) return `$${(marketCapUsd / 1e12).toFixed(2)}T`;
  if (marketCapUsd >= 1e9) return `$${(marketCapUsd / 1e9).toFixed(2)}B`;
  if (marketCapUsd >= 1e6) return `$${(marketCapUsd / 1e6).toFixed(2)}M`;
  return `$${marketCapUsd.toFixed(2)}`;
}

// Date ranges
export const getDateRange = (days: number) => {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - days);

  return {
    to: to.toISOString().split("T")[0],
    from: from.toISOString().split("T")[0]
  };
};

export const getTodayDateRange = () => {
  const today = new Date().toISOString().split("T")[0];
  return { from: today, to: today };
};

// News distribution
export const calculateNewsDistribution = (symbolsCount: number) => {
  let itemsPerSymbol: number;
  const targetNewsCount = 6;

  if (symbolsCount < 3) itemsPerSymbol = 3;
  else if (symbolsCount === 3) itemsPerSymbol = 2;
  else itemsPerSymbol = 1;

  return { itemsPerSymbol, targetNewsCount };
};

// Validate article
export const validateArticle = (a: RawNewsArticle) =>
  a.headline && a.summary && a.url && a.datetime;

// Today's date string
export const getTodayString = () =>
  new Date().toISOString().split("T")[0];

// Format article
export const formatArticle = (
  article: RawNewsArticle,
  isCompanyNews: boolean,
  symbol?: string,
  index: number = 0
) => ({
  id: isCompanyNews ? Date.now() + Math.random() : article.id + index,
  headline: article.headline!.trim(),
  summary:
    article.summary!.trim().substring(0, isCompanyNews ? 200 : 150) + "...",
  source: article.source || (isCompanyNews ? "Company News" : "Market News"),
  url: article.url!,
  datetime: article.datetime!,
  image: article.image || "",
  category: isCompanyNews ? "company" : article.category || "general",
  related: isCompanyNews ? symbol! : article.related || ""
});

// Percent formatting
export const formatChangePercent = (p?: number) => {
  if (!p) return "";
  const sign = p > 0 ? "+" : "";
  return `${sign}${p.toFixed(2)}%`;
};

export const getChangeColorClass = (p?: number) => {
  if (!p) return "text-gray-400";
  return p > 0 ? "text-green-500" : "text-red-500";
};

// Price formatter
export const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(price);

// Today's formatted date
export const formatDateToday = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC"
});

export const getFormattedTodayDate = () =>
  new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC"
  });

/* ---------------------------------------------------------
   FIXED EXCHANGE HANDLING (NO MORE INVALID SYMBOL)
----------------------------------------------------------*/

// Normalize exchange into TradingView-compatible name
export const normalizeExchange = (exch: string): string => {
  if (!exch) return "";

  const key = exch.trim().split(/\s+/)[0].toUpperCase();

  const map: Record<string, string> = {
    "NASDAQ": "NASDAQ",
    "NMS": "NASDAQ",
    "NQ": "NASDAQ",

    "NYSE": "NYSE",
    "NYS": "NYSE",

    "AMEX": "AMEX",
    "ARCA": "NYSEARCA",
    "NYSEARCA": "NYSEARCA",

    "BATS": "BATS",
    "BAT": "BATS",

    "OTC": "OTC"
  };

  return map[key] || "";
};

// Build TradingView symbol like NYSE:ORCL or NASDAQ:AAPL
export const getTradingViewSymbol = (sym: string, exch: string): string => {
  const normalized = normalizeExchange(exch);

  if (normalized) return `${normalized}:${sym}`;

  // Fallback rules
  if (sym.length <= 4) return `NYSE:${sym}`;  // Most large caps
  return `NASDAQ:${sym}`;                    // Tech-heavy default
};
