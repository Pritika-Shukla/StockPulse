import { MarketNews } from "@/types";

const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";
const NEXT_PUBLIC_FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

async function fetchJSON<T>(url: string, revalidateSeconds?: number): Promise<T> {
  const options: RequestInit & { next?: { revalidate?: number } } = revalidateSeconds
    ? { cache: 'force-cache', next: { revalidate: revalidateSeconds } }
    : { cache: 'no-store' };

  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Fetch failed ${res.status}: ${text}`);
  }
  return (await res.json()) as T;
}

export { fetchJSON };

export async function getNews(symbol: string): Promise<MarketNews[]> {
    try{
      const token=NEXT_PUBLIC_FINNHUB_API_KEY;
      if(!token) {
        console.error("Finnhub API key is not set");
        return [];
      }
            
    }
    catch(error) {
        console.error("Error getting news", error);
        return [];
    }
}