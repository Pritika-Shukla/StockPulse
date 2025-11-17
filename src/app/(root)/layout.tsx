import type { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "StockPulse - Professional Trading Platform",
  description: "Master the markets with real-time data, advanced analytics, and personalized insights.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header showAuth={true} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
