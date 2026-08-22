import {
  CONTACT_ADDRESS_PARTS,
  CONTACT_EMAIL,
  CONTACT_WHATSAPP_DISPLAY,
  FOUNDING_YEAR,
  KNOWS_ABOUT,
  OG_IMAGE_PATH,
  SERVICE_AREA_COUNTRIES,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  SOCIAL_LINKS,
  SUPPORT_HOURS,
} from "@/lib/constants";

/**
 * Structured data for the whole site.
 *
 * Everything is emitted as JSON-LD rather than microdata so the markup stays
 * out of the JSX, and every node that another node needs to point at gets a
 * stable `@id`. Without those `@id`s each page ships an unconnected island of
 * schema and search engines treat "MyStudyAlly" on /pricing/ as a different
 * entity from "MyStudyAlly" on /about/.
 */

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Absolute URL for a site-relative path. Schema.org wants absolute URLs. */
export const abs = (path: string) => `${SITE_URL}${path}`;

// EducationalOrganization rather than plain Organization: it is the type Google
// maps to the tutoring/education entity, and it accepts the address and
// service-area fields that a bare Organization ignores.
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": ORGANIZATION_ID,
  name: SITE_NAME,
  alternateName: `${SITE_NAME} Tutoring`,
  description: SITE_DESCRIPTION,
  slogan: SITE_TAGLINE,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    "@id": `${SITE_URL}/#logo`,
    url: abs(OG_IMAGE_PATH),
    width: 1200,
    height: 630,
    caption: SITE_NAME,
  },
  image: { "@id": `${SITE_URL}/#logo` },
  email: CONTACT_EMAIL,
  telephone: CONTACT_WHATSAPP_DISPLAY,
  foundingDate: FOUNDING_YEAR,
  address: {
    "@type": "PostalAddress",
    streetAddress: CONTACT_ADDRESS_PARTS.street,
    addressLocality: CONTACT_ADDRESS_PARTS.locality,
    postalCode: CONTACT_ADDRESS_PARTS.postalCode,
    addressCountry: CONTACT_ADDRESS_PARTS.countryCode,
  },
  // Named markets rather than "Worldwide": a concrete country list is what
  // associates the entity with those regional queries.
  areaServed: SERVICE_AREA_COUNTRIES.map((name) => ({ "@type": "Country", name })),
  knowsAbout: [...KNOWS_ABOUT],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: CONTACT_EMAIL,
      telephone: CONTACT_WHATSAPP_DISPLAY,
      availableLanguage: ["English"],
      areaServed: SERVICE_AREA_COUNTRIES.map((name) => ({ "@type": "Country", name })),
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [...SUPPORT_HOURS.days],
        opens: SUPPORT_HOURS.opens,
        closes: SUPPORT_HOURS.closes,
      },
    },
  ],
  // Verified profiles only — sameAs is how search engines reconcile this entity
  // with its social presence, and a wrong URL here merges the wrong brand.
  sameAs: [SOCIAL_LINKS.instagram, SOCIAL_LINKS.trustpilot],
};

// The WebSite node is what lets Google attribute the whole domain to one site
// entity (and is the prerequisite for a sitelinks search box, should an on-site
// search ever ship). `publisher` wires it to the organisation above.
export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  inLanguage: "en-GB",
  publisher: { "@id": ORGANIZATION_ID },
};

export interface Crumb {
  name: string;
  /** Site-relative, with leading and trailing slash, e.g. "/pricing/". */
  path: string;
}

/**
 * BreadcrumbList for a page.
 *
 * Google renders these as the ">"-separated trail above a result in place of
 * the raw URL, and does not require a visible breadcrumb widget to do it — the
 * design has no breadcrumb UI, so this is JSON-LD only. Always pass the trail
 * including Home and the page itself.
 */
export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${abs(crumbs[crumbs.length - 1]?.path ?? "/")}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

/** Home is the first crumb on every trail; this saves repeating it. */
export const homeCrumb: Crumb = { name: "Home", path: "/" };

/**
 * The WebPage node for a page, tied back to the site and the organisation.
 *
 * `type` narrows it where schema.org has a better fit — AboutPage, ContactPage,
 * CollectionPage — which is a stronger signal than a generic WebPage for the
 * "what kind of page is this" question.
 */
export function webPageJsonLd({
  type = "WebPage",
  title,
  description,
  path,
  crumbs,
  primaryImage = OG_IMAGE_PATH,
}: {
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" | "FAQPage" | "ProfilePage";
  title: string;
  description: string;
  path: string;
  crumbs?: Crumb[];
  primaryImage?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${abs(path)}#webpage`,
    url: abs(path),
    name: title,
    description,
    inLanguage: "en-GB",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
    primaryImageOfPage: { "@type": "ImageObject", url: abs(primaryImage) },
    ...(crumbs ? { breadcrumb: { "@id": `${abs(path)}#breadcrumb` } } : {}),
  };
}

/**
 * Serialises a graph of nodes into one `<script type="application/ld+json">`.
 *
 * One script per page rather than several: search engines parse either, but a
 * single array keeps the `@id` cross-references in one document and makes the
 * page's schema readable in the Rich Results Test as a unit.
 *
 * `<` is escaped because JSON.stringify does not escape it, and a `</script>`
 * appearing inside any string value would otherwise close the tag early.
 */
export function jsonLdScript(nodes: unknown[]): string {
  return (
    JSON.stringify(nodes.length === 1 ? nodes[0] : nodes)
      // These must emit the literal escape *sequence*, not the character it
      // denotes: `"\u003c"` in source already is "<", so the previous
      // `.replace(/</g, "\u003c")` swapped "<" for "<" and did nothing — a
      // "</script>" in any string value would still have closed the tag early.
      // JSON parsers decode \uXXXX, so the graph Google reads is unchanged.
      .replace(/</g, "\\u003c")
      .replace(/>/g, "\\u003e")
      .replace(/&/g, "\\u0026")
  );
}
