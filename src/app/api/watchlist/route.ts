import { NextRequest, NextResponse } from "next/server";
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from "@/lib/actions/watchlist.actions";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get("symbol");

    if (!symbol) {
      return NextResponse.json(
        { error: "Symbol is required" },
        { status: 400 }
      );
    }

    const inWatchlist = await isInWatchlist(symbol);
    return NextResponse.json({ isInWatchlist: inWatchlist });
  } catch (error) {
    console.error("Error in watchlist GET API:", error);
    return NextResponse.json(
      { error: "Failed to check watchlist status" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { symbol, company, action } = body;

    if (!symbol) {
      return NextResponse.json(
        { error: "Symbol is required" },
        { status: 400 }
      );
    }

    if (action === "add") {
      if (!company) {
        return NextResponse.json(
          { error: "Company name is required" },
          { status: 400 }
        );
      }
      const result = await addToWatchlist(symbol, company);
      if (!result.success) {
        return NextResponse.json(
          { error: result.error || "Failed to add to watchlist" },
          { status: 400 }
        );
      }
      return NextResponse.json({ success: true });
    } else if (action === "remove") {
      const result = await removeFromWatchlist(symbol);
      if (!result.success) {
        return NextResponse.json(
          { error: result.error || "Failed to remove from watchlist" },
          { status: 400 }
        );
      }
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Invalid action. Use 'add' or 'remove'" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in watchlist API:", error);
    return NextResponse.json(
      { error: "Failed to process watchlist request" },
      { status: 500 }
    );
  }
}
