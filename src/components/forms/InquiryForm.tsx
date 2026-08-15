"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Turnstile } from "@/components/forms/Turnstile";
import { getAttribution } from "@/lib/utm";
import { FORM_ENDPOINT } from "@/lib/constants";
import { CONTACT_ROLE_OPTIONS, inquirySchema, type InquiryFormValues } from "@/lib/schemas/inquiry";
import { CURRICULA } from "@/data/curricula";

const inputClass =
  "w-full rounded-md border-2 border-border bg-white px-3.5 py-2.5 text-md text-ink placeholder:text-muted-3 focus:border-link focus:outline-none";
const labelClass = "mb-1.5 block text-sm font-bold text-ink";
const errorClass = "mt-1 text-xs font-semibold text-red-600";

export interface InquiryFormProps {
  variant?: "full" | "compact";
  presetCurriculum?: string;
  className?: string;
}

type SubmitState = "idle" | "submitting" | "error" | "rate_limited";

export function InquiryForm({ variant = "full", presetCurriculum, className }: InquiryFormProps) {
  const router = useRouter();
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      contact_role: "parent",
      curriculum: presetCurriculum ?? "",
      website: "",
    },
  });

  const isCompact = variant === "compact";

  async function onSubmit(values: InquiryFormValues) {
    setSubmitState("submitting");
    setErrorMessage(null);

    const attribution = getAttribution();
    const payload = {
      ...values,
      cf_turnstile_token: turnstileToken,
      ...attribution,
    };

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 201) {
        router.push("/thank-you/");
        return;
      }
      if (res.status === 429) {
        setSubmitState("rate_limited");
        setErrorMessage(
          "You've submitted a few inquiries recently — please try again later, or reach us on WhatsApp.",
        );
        return;
      }
      if (res.status === 400) {
        setSubmitState("error");
        setErrorMessage("We couldn't verify your submission. Please retry the challenge below.");
        return;
      }

      setSubmitState("error");
      setErrorMessage("Something went wrong on our end. Please try again in a moment.");
    } catch {
      setSubmitState("error");
      setErrorMessage(
        "We couldn't reach the server — check your connection and try again. Your answers are still here.",
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-4", className)}
      noValidate
    >
      {/* Honeypot — must stay visually hidden, not display:none (bots skip that check) */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="contact_name">
            Your name
          </label>
          <input id="contact_name" className={inputClass} {...register("contact_name")} />
          {errors.contact_name && <p className={errorClass}>{errors.contact_name.message}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="contact_email">
            Email
          </label>
          <input id="contact_email" type="email" className={inputClass} {...register("contact_email")} />
          {errors.contact_email && <p className={errorClass}>{errors.contact_email.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="contact_role">
            I am a
          </label>
          <select id="contact_role" className={inputClass} {...register("contact_role")}>
            {CONTACT_ROLE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="contact_phone">
            Phone (optional)
          </label>
          <input id="contact_phone" className={inputClass} {...register("contact_phone")} />
        </div>
      </div>

      {!isCompact && (
        <div>
          <label className={labelClass} htmlFor="student_name">
            Student&rsquo;s name (optional)
          </label>
          <input id="student_name" className={inputClass} {...register("student_name")} />
        </div>
      )}

      <div>
        <label className={labelClass} htmlFor="curriculum">
          Curriculum
        </label>
        <select
          id="curriculum"
          className={inputClass}
          disabled={isCompact && !!presetCurriculum}
          defaultValue={presetCurriculum ?? ""}
          onChange={(e) => setValue("curriculum", e.target.value)}
        >
          <option value="">Not sure yet</option>
          {CURRICULA.map((c) => (
            <option key={c.slug} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {!isCompact && (
        <div>
          <label className={labelClass} htmlFor="preferred_schedule">
            Preferred schedule (optional)
          </label>
          <input
            id="preferred_schedule"
            placeholder="e.g. weekday evenings, GMT"
            className={inputClass}
            {...register("preferred_schedule")}
          />
        </div>
      )}

      <div>
        <label className={labelClass} htmlFor="message">
          {isCompact ? "What do they need help with? (optional)" : "Message (optional)"}
        </label>
        <textarea id="message" rows={isCompact ? 3 : 5} className={inputClass} {...register("message")} />
      </div>

      <Turnstile onVerify={setTurnstileToken} onExpire={() => setTurnstileToken("")} />

      <p className="text-xs text-muted">
        By submitting, you agree to our{" "}
        <Link href="/privacy/" className="font-semibold">
          Privacy Policy
        </Link>
        .
      </p>

      {errorMessage && (
        <div
          className={cn(
            "rounded-md border-2 p-3 text-sm font-semibold",
            submitState === "rate_limited"
              ? "border-amber-300 bg-amber-50 text-amber-800"
              : "border-red-300 bg-red-50 text-red-700",
          )}
          role="alert"
        >
          {errorMessage}
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting || !turnstileToken}
        className="disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Submitting…" : "Submit an inquiry"}
      </Button>
    </form>
  );
}
