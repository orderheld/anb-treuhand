"use client";

import { useEffect, useRef } from "react";

/** A little longer than MIN_FILL_MS in src/lib/requests/spam.ts. */
const LATE_TOKEN_WAIT_MS = 3200;
/** Below MAX_TOKEN_AGE_MS (24 h): a page left open overnight gets a fresh token. */
const REFRESH_AFTER_MS = 20 * 60 * 60 * 1000;

async function fetchToken(): Promise<string | null> {
  const res = await fetch("/api/form-token", { cache: "no-store" });
  if (!res.ok) return null;
  const body: unknown = await res.json();
  return typeof body === "object" && body !== null && "token" in body && typeof body.token === "string" ? body.token : null;
}

/**
 * Fetches the signed form token when the form appears and returns a function that adds it to the
 * submitted data. If the first fetch failed, it is fetched again on submit and the minimum fill
 * time is waited out, so a real visitor never runs into the spam check.
 */
export function useFormToken() {
  const token = useRef<string | null>(null);
  const fetchedAt = useRef(0);

  useEffect(() => {
    let active = true;
    fetchToken()
      .then((t) => {
        if (active && t) {
          token.current = t;
          fetchedAt.current = Date.now();
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return async function attachToken(data: FormData): Promise<void> {
    if (!token.current || Date.now() - fetchedAt.current > REFRESH_AFTER_MS) {
      try {
        token.current = await fetchToken();
        fetchedAt.current = Date.now();
        if (token.current) await new Promise((resolve) => setTimeout(resolve, LATE_TOKEN_WAIT_MS));
      } catch {
        // The server answers with a clear message if the token is still missing.
      }
    }
    if (token.current) data.set("formToken", token.current);
  };
}
