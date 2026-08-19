"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Autoplaying muted background video.
 *
 * Browsers silently refuse or drop autoplay in several situations — a client
 * side route change that remounts the element, returning to a backgrounded
 * tab, a stalled buffer. The design works around this with a keepalive that
 * re-issues play() on an interval and on visibilitychange (see the footer
 * video in SiteFooter.dc.html); this does the same, plus a retry on error.
 * Without it the panel renders as a frozen or empty box.
 */
export function LoopingVideo({
  src,
  className,
  poster,
}: {
  src: string;
  className?: string;
  poster?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Set imperatively too: some browsers ignore the muted attribute set by
    // React on first paint, and an unmuted video is never allowed to autoplay.
    el.muted = true;
    el.defaultMuted = true;
    el.loop = true;

    let retries = 0;
    const tryPlay = () => {
      if (!el.paused) return;
      const p = el.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };

    const onError = () => {
      if (retries >= 3) return;
      retries += 1;
      setTimeout(() => {
        el.load();
        tryPlay();
      }, 600 * retries);
    };

    const events = ["loadeddata", "canplay", "canplaythrough", "stalled", "suspend", "pause"];
    events.forEach((e) => el.addEventListener(e, tryPlay));
    el.addEventListener("error", onError);
    document.addEventListener("visibilitychange", tryPlay);

    tryPlay();
    const timer = setInterval(tryPlay, 2000);

    return () => {
      clearInterval(timer);
      events.forEach((e) => el.removeEventListener(e, tryPlay));
      el.removeEventListener("error", onError);
      document.removeEventListener("visibilitychange", tryPlay);
    };
  }, [src]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
      className={cn("block h-full w-full object-cover", className)}
    />
  );
}
