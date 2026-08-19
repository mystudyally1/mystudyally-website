"use client";

/**
 * The design's footer carries an autoplaying, muted, looping video panel.
 * Self-hosted from public/video rather than the design tool's CDN.
 */
export function FooterVideo() {
  return (
    <div className="relative h-[280px] w-full overflow-hidden rounded-[20px] bg-surface-dark">
      <video
        src="/video/footer.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
        className="block h-full w-full object-cover"
      />
    </div>
  );
}
