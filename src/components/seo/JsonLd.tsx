import { jsonLdScript } from "@/lib/seo";

/**
 * Renders a page's structured-data graph as a single JSON-LD script.
 *
 * Pages used to inline `dangerouslySetInnerHTML={{ __html: JSON.stringify(x) }}`
 * one at a time, which meant every page repeated the escaping decision and some
 * shipped two or three unlinked scripts. Going through here means the `</script>`
 * escaping happens once and a page's whole graph stays in one document.
 */
export function JsonLd({ nodes }: { nodes: unknown[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdScript(nodes) }}
    />
  );
}
