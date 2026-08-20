import { LoopingVideo } from "@/components/ui/LoopingVideo";

/** The design's footer carries an autoplaying, muted, looping video panel. */
export function FooterVideo() {
  return (
    <div className="relative h-[200px] md:h-[280px] w-full overflow-hidden rounded-[18px] md:rounded-[20px] bg-surface-dark">
      <LoopingVideo src="/video/footer.mp4" poster="/video/footer-poster.webp" />
    </div>
  );
}
