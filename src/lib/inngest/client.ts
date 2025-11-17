import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ 
  id: "StockPulse",
  // Configure AI providers
  ai: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY
    }
  }
});