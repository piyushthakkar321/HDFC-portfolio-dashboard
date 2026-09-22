"use client";

import { useEffect, useRef, useState } from "react";
import { MARKET_SNAPSHOT } from "@/data/marketSnapshot";

export interface LiveQuote {
  price: number;
  change: number;
  changePct: number;
  status: "LIVE" | "STATIC";
  asOf: string | null; // ISO timestamp of the last successful live fetch
}

const POLL_MS = 45_000;

export function useLiveQuote(symbol: string = MARKET_SNAPSHOT.symbol): LiveQuote {
  const [quote, setQuote] = useState<LiveQuote>({
    price: MARKET_SNAPSHOT.price,
    change: MARKET_SNAPSHOT.change,
    changePct: MARKET_SNAPSHOT.changePct,
    status: "STATIC",
    asOf: null,
  });

  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    async function poll() {
      try {
        const res = await fetch(`/api/quote?symbol=${encodeURIComponent(symbol)}`, { cache: "no-store" });
        const data = await res.json();
        if (!mounted.current) return;

        if (res.ok && data.status === "LIVE") {
          setQuote({
            price: data.price,
            change: data.change,
            changePct: data.changePct,
            status: "LIVE",
            asOf: data.timestamp ?? new Date().toISOString(),
          });
        }
        // On error/non-LIVE, silently keep whatever we currently have (static or last-good live value)
      } catch {
        // Network failure: keep last known value, no crash
      }
    }

    poll(); // fetch immediately on mount
    const id = setInterval(poll, POLL_MS);

    return () => {
      mounted.current = false;
      clearInterval(id);
    };
  }, [symbol]);

  return quote;
}