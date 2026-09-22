"use client";

import { useEffect, useRef, useState } from "react";
import { MARKET_SNAPSHOT } from "@/data/marketSnapshot";

export interface LiveQuote {
  price: number;
  change: number;
  changePct: number;
  status: "LOADING" | "LIVE" | "STALE" | "ERROR";
  asOf: string | null; // ISO timestamp of the last successful live fetch
  source: "yahoo" | "stooq" | null;
  marketState?: string;
  errorMessage: string | null;
  consecutiveFailures: number;
}

const POLL_MS = 45_000;
// If we haven't had a successful fetch in this long, mark the value STALE
// rather than let it look "live" forever.
const STALE_AFTER_MS = 3 * POLL_MS;

export function useLiveQuote(symbol: string = MARKET_SNAPSHOT.symbol): LiveQuote {
  const [quote, setQuote] = useState<LiveQuote>({
    price: MARKET_SNAPSHOT.price,
    change: MARKET_SNAPSHOT.change,
    changePct: MARKET_SNAPSHOT.changePct,
    status: "LOADING",
    asOf: null,
    source: null,
    errorMessage: null,
    consecutiveFailures: 0,
  });

  const mounted = useRef(true);
  const lastSuccessAt = useRef<number | null>(null);
  const failures = useRef(0);

  useEffect(() => {
    mounted.current = true;

    function markStaleIfNeeded() {
      if (
        lastSuccessAt.current !== null &&
        Date.now() - lastSuccessAt.current > STALE_AFTER_MS
      ) {
        setQuote((prev) =>
          prev.status === "LIVE" ? { ...prev, status: "STALE" } : prev
        );
      }
    }

    async function poll() {
      try {
        const res = await fetch(`/api/quote?symbol=${encodeURIComponent(symbol)}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (!mounted.current) return;

        if (res.ok && data.status === "LIVE") {
          failures.current = 0;
          lastSuccessAt.current = Date.now();
          setQuote({
            price: data.price,
            change: data.change,
            changePct: data.changePct,
            status: "LIVE",
            asOf: data.timestamp ?? new Date().toISOString(),
            source: data.source ?? "yahoo",
            marketState: data.marketState,
            errorMessage: data.degraded
              ? "Live, but via fallback source after the primary feed failed."
              : null,
            consecutiveFailures: 0,
          });
        } else {
          failures.current += 1;
          setQuote((prev) => ({
            ...prev,
            status: prev.status === "LOADING" ? "ERROR" : prev.status,
            errorMessage: data.message ?? `Live feed returned an error (HTTP ${res.status})`,
            consecutiveFailures: failures.current,
          }));
          markStaleIfNeeded();
        }
      } catch (err) {
        if (!mounted.current) return;
        failures.current += 1;
        setQuote((prev) => ({
          ...prev,
          status: prev.status === "LOADING" ? "ERROR" : prev.status,
          errorMessage: err instanceof Error ? err.message : "Network failure",
          consecutiveFailures: failures.current,
        }));
        markStaleIfNeeded();
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
