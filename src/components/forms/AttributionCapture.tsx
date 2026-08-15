"use client";

import { useEffect } from "react";
import { captureAttributionOnce } from "@/lib/utm";

/** Mounted once near the root layout; records first-touch attribution client-side. */
export function AttributionCapture() {
  useEffect(() => {
    captureAttributionOnce();
  }, []);
  return null;
}
