"use client";

import dynamic from "next/dynamic";
import type { InquiryFormProps } from "@/components/forms/InquiryForm";

// Deferred island: react-hook-form + zod only load once this component
// scrolls into view / hydrates, so they never block first paint.
const InquiryForm = dynamic(
  () => import("@/components/forms/InquiryForm").then((m) => m.InquiryForm),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 animate-pulse rounded-2xl border-2 border-border bg-surface-alt" />
    ),
  },
);

export function InquiryFormLazy(props: InquiryFormProps) {
  return <InquiryForm {...props} />;
}
