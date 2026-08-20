"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Autoplaying muted background video.
 *
 * Two things this handles:
 *
 * 1. Cost. These are decorative, and the footer one sits below the fold on
 *    every page. The `src` is only attached once the element is near the
 *    viewport, so a visitor who never scrolls that far downloads nothing but
 *    the poster. `preload="none"` keeps the browser from pre-fetching.
 *
 * 2. Reduced motion. With `prefers-reduced-motion: reduce` the source is never
 *    attached, so the poster is all that is ever shown.
 *
 * 3. Autoplay reliability. Browsers drop or refuse autoplay after a
 *    client-side route change, on return to a backgrounded tab, or on a
 *    stalled buffer. The design works around this with a keepalive that
 *    re-issues play() on an interval (see SiteFooter.dc.html); without it the
 *    panel renders as a frozen frame.
 */
export function LoopingVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  // Attach the source only when the video is close to being seen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Someone who has asked their OS to reduce motion should not be served a
    // looping video at all — the poster frame carries the same information at
    // none of the cost.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") {
      // Browser too old to observe — just load it, but off the effect body so
      // this doesn't run as a synchronous cascading render.
      const t = setTimeout(() => setActive(true), 0);
      return () => clearTimeout(t);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setActive(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return;

    // Set imperatively too: some browsers ignore the muted attribute applied by
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
  }, [active, src]);

  return (
    <video
      ref={ref}
      src={active ? src : undefined}
      poster={poster}
      autoPlay={active}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      className={cn("block h-full w-full object-cover", className)}
    />
  );
}
