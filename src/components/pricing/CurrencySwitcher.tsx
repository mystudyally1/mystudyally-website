"use client";

import { SWITCHER_ORDER } from "@/data/currencies";
import { getCurrency } from "@/lib/currency";
import { SelectMenu } from "@/components/forms/SelectMenu";
import { setCurrency, useCurrency } from "@/components/pricing/currency-store";

// Geo detection is a guess: a UK card holder in Dubai, anyone on a VPN, and
// every visitor in a country we hold no rate for all land somewhere they did
// not choose. The switcher is what makes that recoverable, and the choice is
// remembered.
const OPTIONS = SWITCHER_ORDER.map((code) => {
  const c = getCurrency(code);
  return `${c.code} — ${c.label}`;
});
const codeOf = (option: string) => option.split(" — ")[0]!;

export function CurrencySwitcher({ className }: { className?: string }) {
  const currency = useCurrency();
  const value = OPTIONS.find((o) => codeOf(o) === currency.code) ?? OPTIONS[0]!;

  return (
    <div className={className}>
      <span
        id="currency-switcher-label"
        className="text-11 font-bold uppercase tracking-[0.1em] text-muted-3"
      >
        Show prices in
      </span>
      <SelectMenu
        id="currency-switcher"
        labelledBy="currency-switcher-label"
        value={value}
        onChange={(o) => setCurrency(codeOf(o))}
        options={OPTIONS}
        placeholder="Choose a currency"
        className="mt-[6px] w-full min-h-[44px] rounded-[12px] border border-border bg-white px-[14px] text-13 font-bold text-body focus:border-[#89E219] focus:outline-none focus-visible:outline-2 focus-visible:outline-link md:min-h-0 md:w-[236px] md:py-[10px]"
      />
    </div>
  );
}
