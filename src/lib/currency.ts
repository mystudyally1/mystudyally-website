import {
  BASE_CURRENCY,
  COUNTRY_CURRENCY,
  CURRENCIES,
  type Currency,
} from "@/data/currencies";

export function getCurrency(code: string): Currency {
  return CURRENCIES[code] ?? CURRENCIES[BASE_CURRENCY]!;
}

/** ISO country -> currency code, falling back to USD for anywhere unlisted. */
export function currencyForCountry(country: string): string {
  return COUNTRY_CURRENCY[country.toUpperCase()] ?? BASE_CURRENCY;
}

const round = (value: number, step: number) => Math.round(value / step) * step;

/**
 * A USD plan total in local money, rounded to the currency's step. USD is
 * returned untouched — it is the price actually charged, not a conversion.
 */
export function convert(usd: number, currency: Currency): number {
  if (currency.code === BASE_CURRENCY) return usd;
  return round(usd * currency.rate, currency.step);
}

/**
 * Whole amounts show no decimals ("$45", "RM 200"); anything with a fraction
 * shows exactly two ("£8.75", "KWD 24.50"). A single trailing digit — "£7.5" —
 * reads as a truncated number rather than a price.
 */
export function formatAmount(value: number, currency: Currency): string {
  const digits = Number.isInteger(value) ? 0 : 2;
  const n = value.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
  return `${currency.symbol}${n}`;
}

/** A USD plan total, converted and formatted. */
export function formatPrice(usd: number, currency: Currency): string {
  return formatAmount(convert(usd, currency), currency);
}

/**
 * Per-class price, derived from the *rounded* local total rather than
 * converted separately — otherwise the card shows £35 for 4 classes next to a
 * per-class figure that multiplies back to something else.
 */
export function formatPerClass(usd: number, classes: number, currency: Currency): string {
  const each = convert(usd, currency) / classes;
  return formatAmount(Math.round(each * 100) / 100, currency);
}

/** "$45" -> 45. The generated plan data stores prices as display strings. */
export const priceToNumber = (price: string) => Number(price.replace(/[^0-9.]/g, ""));
