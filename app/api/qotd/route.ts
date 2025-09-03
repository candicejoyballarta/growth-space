import { NextResponse } from "next/server";

let cachedQuote: { text: string; author: string }[] | null = null;
let lastFetch: number | null = null;

export async function GET() {
  const now = Date.now();
  const oneDay = 1000 * 60 * 60 * 24;

  try {
    if (!cachedQuote || !lastFetch || now - lastFetch > oneDay) {
      const res = await fetch("https://zenquotes.io/api/today");

      if (!res.ok) {
        return NextResponse.json(
          { error: "Failed to fetch quote" },
          { status: 500 }
        );
      }

      cachedQuote = await res.json();
      lastFetch = now;
    }

    if (cachedQuote && cachedQuote.length > 0) {
      return NextResponse.json(cachedQuote[0]);
    } else {
      return NextResponse.json(
        { error: "No quote available" },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
