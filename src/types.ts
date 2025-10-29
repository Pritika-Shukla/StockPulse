import { Watchlist } from "@prisma/client";

export interface ClerkUser {
    id: string;
    clerkId: string;
    email_addresses: {
      email_address: string;
    }[];
    first_name?: string;
    last_name?: string;
    image_url?: string;
    created_at: number;
    updated_at: number;
  }

  export interface MarketNews {
      id: number;
      headline: string;
      summary: string;
      source: string;
      url: string;
      datetime: number;
      category: string;
      related: string;
      image?: string;
  };

  export interface  RawNewsArticle  {
      id: number;
      headline?: string;
      summary?: string;
      source?: string;
      url?: string;
      datetime?: number;
      image?: string;
      category?: string;
      related?: string;
  };

  export interface MarketNewsArticle {
    id: number;
    headline?: string;
    summary?: string;
    source?: string;
    url?: string;
    datetime?: number;
    image?: string;
    category?: string;
    related?: string;
  }


  export interface UserForNewsEmail {
    id: string;
    email: string;
    watchlist: string[];
  }

  export type User = {
    id: string;
    name: string;
    email: string;
};