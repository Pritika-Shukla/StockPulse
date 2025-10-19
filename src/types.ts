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