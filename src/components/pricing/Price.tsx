"use client";

import { BASE_CURRENCY } from "@/data/currencies";
import { formatPerClass, formatPrice, hasFixedPrices } from "@/lib/currency";
import { useCurrency } from "@/components/pricing/currency-store";

/**
 * A USD plan total, shown in the visitor's currency. `planUsd` names the plan
 * an amount is derived from where it is not a plan price itself — see convert().
 */
export function Price({ usd, planUsd }: { usd: number; planUsd?: number }) {
  const currency = useCurrency();
  return <>{formatPrice(usd, currency, planUsd ?? usd)}</>;
}

/** Per-class rate, derived from the rounded local total so the two agree. */
export function PerClass({ usd, classes }: { usd: number; classes: number }) {
  const currency = useCurrency();
  return <>{formatPerClass(usd, classes, currency)}</>;
}

/** The currency code rendered beside a headline price. */
export function CurrencyCode() {
  const currency = useCurrency();
  return <>{currency.code}</>;
}

/**
 * Only shown once a non-USD currency is in play. The plan is charged in USD —
 * a visitor who reads "RM 200" as the amount their card will be debited has
 * been misled, and finds out at the payment link.
 */
export function CurrencyNote({ className }: { className?: string }) {
  const currency = useCurrency();
  if (currency.code === BASE_CURRENCY) return null;
  // A market with its own price list is not being converted, so saying it is
  // would misdescribe the number the visitor is looking at.
  if (hasFixedPrices(currency)) {
    return (
      <p className={className}>
        Prices are shown in {currency.label}s and are set for this region. All plans are charged in
        US dollars.
      </p>
    );
  }
  return (
    <p className={className}>
      Prices are shown in {currency.label}s for guidance and converted at an indicative rate. All
      plans are charged in US dollars.
    </p>
  );
}
