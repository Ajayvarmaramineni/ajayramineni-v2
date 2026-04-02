"use client";
import { useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const INTERVAL_MS = 8 * 60 * 1000; // 8 minutes

export default function KeepAlive() {
  useEffect(() => {
    const ping = () => fetch(`${API}/health`, { method: "GET" }).catch(() => {});
    ping(); // ping immediately on first load
    const id = setInterval(ping, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return null;
}
