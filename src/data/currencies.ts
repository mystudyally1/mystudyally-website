// Plans are priced and charged in USD. Everything here is presentation: a
// visitor in Karachi should not have to convert $45 in their head to know
// whether this is affordable. The local figure is a guide — CurrencyNote
// states that the plan is billed in USD, and the JSON-LD Offers stay in USD
// so a crawler only ever sees one canonical price.

export interface Currency {
  code: string;
  /** Prefix shown before the amount; a 3-letter code takes a trailing space. */
  symbol: string;
  /** Full name, for the currency switcher. */
  label: string;
  /** USD -> this currency. 1 for USD itself. */
  rate: number;
  /**
   * Plan totals are rounded to this step so they read as prices rather than
   * as converter output. Sized to the currency: RM 5, PKR 500, KWD 0.5.
   */
  step: number;
}

// Rates pinned deliberately: a static export cannot call a rates API at build
// time without going stale the same day, and calling one at runtime would put
// a third party in front of the pricing page. The pegged currencies (AED, SAR,
// QAR, OMR, BHD, HKD, KWD) do not move. Review the floating ones — GBP, CAD,
// MYR, SGD and especially PKR — before each pricing update.
export const RATES_PINNED_AT = "2026-08-22";

export const BASE_CURRENCY = "USD";

export const CURRENCIES: Record<string, Currency> = {
  USD: { code: "USD", symbol: "$", label: "US dollar", rate: 1, step: 1 },
  GBP: { code: "GBP", symbol: "£", label: "British pound", rate: 0.79, step: 5 },
  CAD: { code: "CAD", symbol: "CA$", label: "Canadian dollar", rate: 1.37, step: 5 },
  AED: { code: "AED", symbol: "AED ", label: "UAE dirham", rate: 3.6725, step: 5 },
  SAR: { code: "SAR", symbol: "SAR ", label: "Saudi riyal", rate: 3.75, step: 5 },
  QAR: { code: "QAR", symbol: "QAR ", label: "Qatari riyal", rate: 3.64, step: 5 },
  KWD: { code: "KWD", symbol: "KWD ", label: "Kuwaiti dinar", rate: 0.307, step: 0.5 },
  OMR: { code: "OMR", symbol: "OMR ", label: "Omani rial", rate: 0.3845, step: 0.5 },
  BHD: { code: "BHD", symbol: "BHD ", label: "Bahraini dinar", rate: 0.376, step: 0.5 },
  HKD: { code: "HKD", symbol: "HK$", label: "Hong Kong dollar", rate: 7.8, step: 10 },
  MYR: { code: "MYR", symbol: "RM ", label: "Malaysian ringgit", rate: 4.4, step: 5 },
  SGD: { code: "SGD", symbol: "S$", label: "Singapore dollar", rate: 1.3, step: 5 },
  PKR: { code: "PKR", symbol: "Rs ", label: "Pakistani rupee", rate: 280, step: 500 },
};

/**
 * Fixed local price lists, keyed by currency and then by the plan's USD price.
 * A currency listed here is not converted at all for those plans — its prices
 * are set deliberately for that market, and the rate above is used only for
 * anything derived that is not a plan price outright.
 */
export const PRICE_OVERRIDES: Record<string, Record<number, number>> = {
  // Hong Kong is priced per class: HK$90 on Starter, rising HK$20 a tier.
  // Unlike the converted markets this ladder charges more per class as the
  // plan grows, so the totals climb steeply — Complete is 32 x HK$190.
  HKD: {
    45: 360,
    79: 880,
    105: 1560,
    135: 2400,
    189: 4080,
    239: 6080,
  },
};

// ISO 3166-1 alpha-2 -> currency. Anywhere not listed — including the Middle
// East outside the Gulf states, where pricing in USD is the norm — falls back
// to USD rather than guessing at a currency we have not set a rate for.
export const COUNTRY_CURRENCY: Record<string, string> = {
  GB: "GBP",
  US: "USD",
  CA: "CAD",
  HK: "HKD",
  MY: "MYR",
  SG: "SGD",
  PK: "PKR",
  AE: "AED",
  SA: "SAR",
  QA: "QAR",
  KW: "KWD",
  OM: "OMR",
  BH: "BHD",
};

// Fallback region signal, read straight from the browser with no network call.
// It is what makes local pricing work before (or without) the Worker's /geo
// answering — and it is instant, so most visitors never see USD flash first.
//
// Deliberately approximate in one place: tzdata makes Asia/Kuwait, Asia/Qatar
// and Asia/Bahrain links to Asia/Riyadh, and Windows maps Oman onto Asia/Dubai,
// so a Kuwaiti or Omani device often reports its neighbour's zone. The Worker
// lookup corrects that when it is reachable; there is no way to tell them apart
// from the timezone alone. Unlisted zones — the US included — stay on USD.
export const ZONE_COUNTRY: Record<string, string> = {
  "Europe/London": "GB",
  "Europe/Belfast": "GB",
  "Asia/Karachi": "PK",
  "Asia/Dubai": "AE",
  "Asia/Muscat": "OM",
  "Asia/Riyadh": "SA",
  "Asia/Kuwait": "KW",
  "Asia/Qatar": "QA",
  "Asia/Bahrain": "BH",
  "Asia/Hong_Kong": "HK",
  "Asia/Kuala_Lumpur": "MY",
  "Asia/Kuching": "MY",
  "Asia/Singapore": "SG",
  "America/Toronto": "CA",
  "America/Montreal": "CA",
  "America/Vancouver": "CA",
  "America/Edmonton": "CA",
  "America/Winnipeg": "CA",
  "America/Halifax": "CA",
  "America/Moncton": "CA",
  "America/Regina": "CA",
  "America/St_Johns": "CA",
  "America/Whitehorse": "CA",
  "America/Iqaluit": "CA",
};
