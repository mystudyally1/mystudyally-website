export const SITE_NAME = "MyStudyAlly";
export const SITE_TAGLINE = "Curriculum-matched tutoring, done properly";
export const SITE_URL = "https://mystudyally.com";

// Canonical inquiry response-time SLA. The design files disagreed (some said
// "within 24 hours", the inquiry form said "within 2 hours" with an office-hours
// caveat) — 24 hours was chosen as the value every page should render from here,
// never hardcode a response time elsewhere.
export const SLA_RESPONSE_TIME = "within 24 hours";

export const CONTACT_EMAIL = "info@mystudyally.com";
export const CONTACT_WHATSAPP_DISPLAY = "+44 7868 197793";
export const CONTACT_WHATSAPP_LINK = "https://wa.me/447868197793";
export const CONTACT_ADDRESS = "7 Leamington Gardens, Ilford IG3 9TX, United Kingdom";

export const SOCIAL_LINKS = {
  whatsapp: CONTACT_WHATSAPP_LINK,
  instagram: "https://www.instagram.com/mystudyally",
  email: `mailto:${CONTACT_EMAIL}`,
  trustpilot: "https://www.trustpilot.com/review/mystudyally.com",
};

// Cloudflare Worker form endpoint + Turnstile site key are public by design
// (see implementation plan Part 0, secrets map). Set in .env.local to override.
// Defaults to the live workers.dev URL — swap to forms.mystudyally.com once
// that custom domain route is added to the Worker.
export const FORM_ENDPOINT =
  process.env.NEXT_PUBLIC_FORM_ENDPOINT ??
  "https://mystudyally-forms-worker.mystudyally1.workers.dev/";
export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
