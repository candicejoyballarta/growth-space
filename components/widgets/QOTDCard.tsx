"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface Quote {
  q: string;
  a: string;
}

const QOTDCard = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuote() {
      try {
        setLoading(true);
        const res = await fetch("/api/qotd");
        if (!res.ok) return;
        const data = await res.json();
        setQuote(data);
      } catch (err) {
        throw new Error("Failed to fetch quote", { cause: err });
      } finally {
        setLoading(false);
      }
    }

    fetchQuote();
  }, []);

  // Hide card entirely if no quote and not loading
  if (!loading && !quote) return null;

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-green-100 to-green-50 border-0 shadow-lg gap-3 animate-pulse">
        <CardHeader>
          <CardTitle className="text-green-700 text-lg font-semibold">
            Loading Quote...
          </CardTitle>
        </CardHeader>
        <CardContent className="h-20 bg-green-100 rounded-md" />
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-green-100 to-green-50 border-0 shadow-lg gap-3">
      <CardHeader>
        <CardTitle className="text-green-700 text-lg font-semibold">
          Quote of the Day 🌱
        </CardTitle>
      </CardHeader>
      <CardContent className="relative text-gray-800 text-sm italic px-4 py-2">
        <span className="absolute -top-3 -left-3 text-4xl text-green-200 font-bold">
          “
        </span>
        <p className="ml-2">
          {quote?.q} <span className="font-semibold">– {quote?.a}</span>
        </p>
        <span className="absolute -bottom-3 -right-3 text-4xl text-green-200 font-bold rotate-180">
          ”
        </span>
      </CardContent>
    </Card>
  );
};

export default QOTDCard;
