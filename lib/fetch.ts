// lib/fetch.ts
import { useState, useEffect, useCallback } from "react";
import { Platform } from "react-native";

const HOST = Platform.OS === "android" ? "10.0.2.2" : "localhost";
const PORT = process.env.EXPO_PUBLIC_API_PORT ?? "3000";

export const API_BASE =
  process.env.EXPO_PUBLIC_API_BASE ?? `http://${HOST}:${PORT}`;

function toAbsoluteUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  const slash = path.startsWith("/") ? "" : "/";
  return `${API_BASE}${slash}${path}`;
}

export function useFetch<T>(path: string, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const url = toAbsoluteUrl(path);
    try {
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      const text = await res.text();
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${url}\n${text.slice(0,200)}`);
      }
      try {
        setData(JSON.parse(text));
      } catch {
        throw new Error(`Réponse non-JSON depuis ${url}:\n${text.slice(0,200)}`);
      }
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => { load(); }, [load, ...deps]);

  return { data, loading, error, refetch: load };
}

export async function getUsers() {
  const res = await fetch(toAbsoluteUrl("/api/ride/user"), {
    headers: { Accept: "application/json" },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status} – ${text.slice(0,120)}`);
  try { return JSON.parse(text); } catch {
    throw new Error(`Réponse non-JSON: ${text.slice(0,120)}`);
  }
}
