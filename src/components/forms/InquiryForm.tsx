"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { cn } from "@/lib/cn";
import {
  Turnstile,
  type TurnstileHandle,
  type TurnstileStatus,
} from "@/components/forms/Turnstile";
import { getAttribution } from "@/lib/utm";
import { CONTACT_EMAIL, CONTACT_WHATSAPP_LINK, FORM_ENDPOINT } from "@/lib/constants";
import {
  CONTACT_ROLE_OPTIONS,
  inquiryFormSchema,
  type InquiryFormValues,
} from "@/lib/schemas/inquiry";
import { CURRICULA, getCurriculumByName } from "@/data/curricula";
import { SelectMenu } from "@/components/forms/SelectMenu";

// Field styling mirrors "website design/InquiryForm.dc.html".
// Both mobile designs give fields a 48px minimum height; they diverge on
// everything else, so the quick (curriculum) variant carries its own pair
// below. All four converge on the desktop treatment at md.
const inputClass =
  "w-full min-h-[48px] rounded-[12px] border border-border bg-white px-[14px] py-[12px] text-13_5 text-body placeholder:text-muted-3 focus:border-[#89E219] focus:outline-none focus-visible:outline-2 focus-visible:outline-link md:min-h-0 md:text-13";
const labelClass = "text-12 font-extrabold text-ink md:font-bold md:text-body";

/** Quick form on the curriculum pages: uppercase micro-labels, chunkier
 *  fields, all inside a bordered card ("IGCSE Mobile.dc.html"). */
const quickInputClass =
  "w-full min-h-[48px] rounded-[14px] border-2 border-border bg-white px-[14px] text-15 text-body placeholder:text-muted-3 focus:border-[#89E219] focus:outline-none focus-visible:outline-2 focus-visible:outline-link md:min-h-0 md:rounded-[12px] md:border md:py-[12px] md:text-13";
const quickLabelClass =
  "text-11 font-bold uppercase tracking-[0.1em] text-muted-3 md:text-12 md:normal-case md:tracking-normal md:text-body";
const CURRICULUM_NAMES = CURRICULA.map((c) => c.name);

const errorClass = "text-11_5 font-bold text-[#B4462B]";
const hintClass = "text-11_5 leading-[1.6] text-muted-3";

export interface InquiryFormProps {
  variant?: "full" | "compact";
  presetCurriculum?: string;
  className?: string;
  /** Contact page shows the "What can we help with?" intent selector. */
  showIntent?: boolean;
}

/** From the design's Contact form: the intent buttons above the fields. */
const INTENTS = [
  { key: "tutor", label: "Finding a tutor" },
  { key: "pricing", label: "Pricing or how it works" },
  { key: "other", label: "Something else" },
] as const;

type Intent = (typeof INTENTS)[number]["key"];

export function InquiryForm({
  variant = "full",
  presetCurriculum,
  className,
  showIntent = false,
}: InquiryFormProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileStatus, setTurnstileStatus] = useState<TurnstileStatus>("loading");
  const turnstileRef = useRef<TurnstileHandle>(null);
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [curriculum, setCurriculum] = useState(presetCurriculum ?? "");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [subjectFilter, setSubjectFilter] = useState("");
  const [subjectsOpen, setSubjectsOpen] = useState(false);
  const [intent, setIntent] = useState<Intent>("tutor");
  const [role, setRole] = useState<InquiryFormValues["contact_role"]>("parent");
  const [curriculumError, setCurriculumError] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isCompact = variant === "compact";
  // Only the "finding a tutor" path asks for curriculum, subjects and schedule.
  const isTutoring = !showIntent || intent === "tutor";

  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: { contact_role: "parent", website: "" },
  });

  const subjectOptions = useMemo(() => {
    const c = getCurriculumByName(curriculum);
    if (!c) return [];
    return c.subjects.filter(
      (s) => !subjects.includes(s) && s.toLowerCase().includes(subjectFilter.toLowerCase()),
    );
  }, [curriculum, subjects, subjectFilter]);

  async function onSubmit(values: InquiryFormValues) {
    if (isTutoring && showIntent && !curriculum) {
      setCurriculumError(true);
      return;
    }
    if (!consent) {
      setConsentError(true);
      return;
    }
    setConsentError(false);
    setErrorMessage(null);
    setRateLimited(false);

    const payload = {
      ...values,
      // Only send the tutoring-specific fields when that's what they asked about,
      // so a pricing question doesn't arrive tagged with a stale curriculum.
      curriculum: isTutoring ? curriculum || undefined : undefined,
      subjects_needed: isTutoring && subjects.length ? subjects : undefined,
      cf_turnstile_token: turnstileToken,
      ...getAttribution(),
    };

    // A Turnstile token is single-use. Whatever went wrong, the one we just
    // sent can never be accepted again — so every failure path re-challenges,
    // otherwise "try again" retries with a dead token and fails identically
    // forever.
    const failWith = (message: string) => {
      setTurnstileToken("");
      turnstileRef.current?.reset();
      setErrorMessage(message);
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
        setRateLimited(true);
        failWith(
          "You've submitted a few inquiries recently — please try again later, or reach us on WhatsApp.",
        );
        return;
      }
      if (res.status === 400) {
        failWith("We couldn't verify your submission. Please retry the challenge below.");
        return;
      }
      // The Worker is the source of truth for validation and its schema can
      // drift ahead of the client mirror in lib/schemas/inquiry.ts. Without
      // this branch a 422 reads as "our end", sending the visitor away from
      // the one thing only they can fix.
      if (res.status === 422) {
        failWith("Some of your answers weren’t accepted. Please check the form and try again.");
        return;
      }
      // ALLOWED_ORIGINS on the Worker does not list this hostname — only ever
      // seen in dev or on a preview deployment, but reporting it as a server
      // fault is what makes that cost an afternoon.
      if (res.status === 403) {
        failWith(
          "This form is not authorised to submit from this address. Please use mystudyally.com, or reach us on WhatsApp.",
        );
        return;
      }
      failWith("Something went wrong on our end. Please try again in a moment.");
    } catch {
      failWith(
        "We couldn't reach the server — check your connection and try again. Your answers are still here.",
      );
    }
  }

  // Validation errors render below their field; without moving focus a screen
  // reader user submits, hears nothing, and has no idea which field to fix.
  function onInvalid(formErrors: typeof errors) {
    const first = (Object.keys(formErrors) as (keyof InquiryFormValues)[])[0];
    if (!first) return;
    // A resolver error on a field the form does not render has nowhere to show
    // and nothing to focus, so the click reads as a dead button and the visitor
    // is left with no way forward. Never swallow the submit silently.
    if (!document.querySelector(`[name="${first}"]`)) {
      setErrorMessage("We couldn’t validate the form. Please refresh the page and try again.");
      return;
    }
    setFocus(first);
  }

  const challengeUnavailable = turnstileStatus === "unavailable";

  /** Turnstile is required by the Worker, so if it cannot run there is no
   *  submit path at all. Offer the channels that still work rather than
   *  leaving a dead button. */
  const fallbackContact = (
    <div className="flex flex-col gap-[10px] rounded-[14px] border-2 border-border bg-surface-alt px-[18px] py-[16px]">
      <span className="text-13 font-extrabold text-body">Send it to us directly instead</span>
      <div className="flex flex-wrap gap-[10px]">
        <a
          href={CONTACT_WHATSAPP_LINK}
          target="_blank"
          rel="noopener"
          className="inline-flex min-h-[44px] items-center rounded-[12px] bg-primary px-[16px] text-13 font-extrabold text-white hover:bg-primary-hover hover:text-white"
        >
          Message us on WhatsApp
        </a>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="inline-flex min-h-[44px] items-center rounded-[12px] border-2 border-border bg-white px-[16px] text-13 font-extrabold text-body hover:border-muted-3"
        >
          Email {CONTACT_EMAIL}
        </a>
      </div>
    </div>
  );

  const consentBox = (
    <div className="flex flex-col gap-[6px]">
      {/* Rendered as a styled control rather than an <input type="checkbox">,
          so it has to carry the checkbox role and state itself — otherwise a
          screen reader announces a button and never reads out whether consent
          is given. */}
      <button
        type="button"
        role="checkbox"
        aria-checked={consent}
        aria-invalid={consentError || undefined}
        aria-describedby={consentError ? "consent-error" : undefined}
        onClick={() => {
          setConsent((v) => !v);
          setConsentError(false);
        }}
        className="flex cursor-pointer items-start gap-[10px] p-0 text-left"
      >
        <span
          className={cn(
            "inline-flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-[6px] border-2 text-12 font-extrabold text-white",
            consentError
              ? "border-[#B4462B]"
              : consent
                ? "border-primary bg-primary"
                : "border-border bg-white",
          )}
        >
          {consent ? "✓" : ""}
        </span>
        <span className="text-12 leading-[1.5] text-muted">
          I agree to be contacted by MyStudyAlly about this inquiry, as described in the{" "}
          <Link href="/privacy/" className="underline">
            privacy policy
          </Link>
          .
        </span>
      </button>
      {consentError && (
        <span id="consent-error" className={errorClass}>
          Please confirm we may contact you
        </span>
      )}
    </div>
  );

  // Positioned off-screen rather than display:none — many bots skip fields that
  // are not rendered at all, which defeats the trap. Hidden from assistive tech
  // and removed from the tab order, and it carries a label so it is not an
  // unlabelled control if either of those ever fails.
  const honeypot = (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-[-9999px] top-[-9999px] h-px w-px overflow-hidden"
    >
      <label htmlFor="msa-website">Leave this field empty</label>
      <input
        id="msa-website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        {...register("website")}
      />
    </div>
  );

  const alerts = errorMessage && (
    <div
      role="alert"
      className={cn(
        "rounded-[14px] border-2 px-[18px] py-[14px] text-13 font-semibold leading-[1.6]",
        rateLimited
          ? "border-amber-300 bg-amber-50 text-amber-800"
          : "border-[#DC2626] text-[#DC2626]",
      )}
    >
      {errorMessage}
    </div>
  );

  /* ---------------- compact (curriculum hero) ---------------- */
  if (isCompact) {
    return (
      <form
        onSubmit={(e) => void handleSubmit(onSubmit, onInvalid)(e)}
        className={cn(
          "relative flex flex-col gap-[16px] rounded-[22px] border-2 border-border bg-white px-[18px] pb-[22px] pt-[20px] shadow-[0_2px_0_#E5E5E5] md:rounded-[20px] md:border md:p-[28px] md:shadow-none",
          className,
        )}
        noValidate
      >
        {alerts}

        <div className="flex flex-col gap-[6px]">
          <label className={quickLabelClass}>
            Curriculum{" "}
            {/* The design's mobile label is just "CURRICULUM" — the Selected
                chip already says the page has set it. */}
            <span className="hidden font-semibold text-muted-3 md:inline">(set for this page)</span>
          </label>
          <div className="flex min-h-[48px] items-center justify-between gap-[12px] rounded-[14px] border-2 border-border bg-surface-alt px-[14px] text-15 font-extrabold text-body md:min-h-0 md:rounded-[12px] md:border md:py-[12px] md:text-13 md:font-bold md:text-muted">
            {curriculum || "Not set"}
            <span className="text-11 font-extrabold uppercase tracking-[0.08em] text-primary-shadow md:inline-flex md:items-center md:gap-[6px] md:rounded-pill md:bg-primary-light md:px-[10px] md:py-[4px] md:normal-case md:tracking-normal">
              <span className="hidden md:inline">✓ </span>Selected
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className={quickLabelClass} htmlFor="q_name">
            Your name <span className="text-[#B4462B]">*</span>
          </label>
          <input
            id="q_name"
            placeholder="Full name"
            autoComplete="name"
            aria-invalid={errors.contact_name ? true : undefined}
            aria-describedby={errors.contact_name ? "q_name-error" : undefined}
            className={quickInputClass}
            {...register("contact_name")}
          />
          {errors.contact_name && (
            <span id="q_name-error" className={errorClass}>
              {errors.contact_name.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className={quickLabelClass} htmlFor="q_email">
            Email <span className="text-[#B4462B]">*</span>
          </label>
          <input
            id="q_email"
            type="email"
            inputMode="email"
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={errors.contact_email ? true : undefined}
            aria-describedby={errors.contact_email ? "q_email-error" : undefined}
            className={quickInputClass}
            {...register("contact_email")}
          />
          {errors.contact_email && (
            <span id="q_email-error" className={errorClass}>
              {errors.contact_email.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className={quickLabelClass} htmlFor="q_phone">
            Phone <span className="font-semibold text-muted-3">(optional)</span>
          </label>
          <input
            id="q_phone"
            type="tel"
            inputMode="tel"
            placeholder="+44 7700 900000"
            autoComplete="tel"
            className={quickInputClass}
            {...register("contact_phone")}
          />
        </div>

        {subjectOptions.length + subjects.length > 0 && (
          <div className="flex flex-col gap-[8px]">
            <label className={quickLabelClass} htmlFor="q_subjects">
              Subjects needed <span className="font-semibold text-muted-3">(pick any)</span>
            </label>
            <div className="relative">
              <input
                id="q_subjects"
                value={subjectFilter}
                onChange={(e) => {
                  setSubjectFilter(e.target.value);
                  setSubjectsOpen(true);
                }}
                onFocus={() => setSubjectsOpen(true)}
                onBlur={() => {
                  blurTimer.current = setTimeout(() => setSubjectsOpen(false), 150);
                }}
                placeholder="Type to search subjects…"
                className={quickInputClass}
                autoComplete="off"
              />
              {subjectsOpen && subjectOptions.length > 0 && (
                <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-40 max-h-[220px] overflow-y-auto rounded-[14px] border border-border bg-white p-[6px] shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                  {subjectOptions.map((o) => (
                    <button
                      key={o}
                      type="button"
                      onMouseDown={() => {
                        if (blurTimer.current) clearTimeout(blurTimer.current);
                        setSubjects((s) => [...s, o]);
                        setSubjectFilter("");
                        setSubjectsOpen(false);
                      }}
                      className="w-full cursor-pointer rounded-[10px] px-[12px] py-[9px] text-left text-13 font-semibold text-body hover:bg-surface-alt hover:text-ink"
                    >
                      {o}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {subjects.length > 0 && (
              <div className="flex flex-wrap gap-[8px]">
                {subjects.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-[8px] whitespace-nowrap rounded-pill border border-[#DDE9CF] bg-[#F1F7EA] py-[6px] pl-[14px] pr-[8px] text-12 font-bold text-body"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => setSubjects((v) => v.filter((x) => x !== s))}
                      aria-label={`Remove ${s}`}
                      className="inline-flex h-[18px] w-[18px] cursor-pointer items-center justify-center rounded-pill border-none bg-[#E3EFD5] p-0 text-12 leading-none text-primary-shadow"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {consentBox}
        {honeypot}
        <Turnstile
          ref={turnstileRef}
          onVerify={setTurnstileToken}
          onExpire={() => setTurnstileToken("")}
          onStatusChange={setTurnstileStatus}
        />

        {challengeUnavailable ? (
          fallbackContact
        ) : (
          <>
            <button
              type="submit"
              disabled={isSubmitting || !turnstileToken}
              aria-describedby={!turnstileToken ? "q-submit-hint" : undefined}
              className="cursor-pointer rounded-pill bg-primary p-[15px] text-14 font-extrabold text-white shadow-[0_4px_0_#58A700] hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Submitting…" : "Submit an inquiry"}
            </button>
            {/* A disabled button with no stated reason reads as a broken form. */}
            {!turnstileToken && (
              <span id="q-submit-hint" className={hintClass}>
                Complete the verification above to enable submitting.
              </span>
            )}
          </>
        )}

        <div className="flex items-center justify-between">
          <span className="text-11 text-muted-3">Protected by Cloudflare Turnstile</span>
          <span className="text-11 text-muted-3">Our team reviews every inquiry personally</span>
        </div>
      </form>
    );
  }

  /* ---------------- full (contact page) ---------------- */
  return (
    <form onSubmit={(e) => void handleSubmit(onSubmit, onInvalid)(e)} className={cn("relative flex flex-col gap-[22px]", className)} noValidate>
      {alerts}

      {showIntent && (
        <div className="flex flex-col gap-[10px]">
          <label className="text-14 font-extrabold text-body">What can we help with?</label>
          <div
            className="flex flex-col gap-[8px] md:flex-row md:gap-[10px]"
            role="group"
            aria-label="What can we help with?"
          >
            {INTENTS.map((o) => (
              <button
                key={o.key}
                type="button"
                onClick={() => setIntent(o.key)}
                aria-pressed={intent === o.key}
                className={cn(
                  "flex-1 cursor-pointer rounded-[14px] border-2 px-[10px] py-[13px] text-left text-13 font-bold leading-[1.35] md:text-center",
                  intent === o.key
                    ? "border-ink bg-ink text-white"
                    : "border-border bg-white text-muted hover:border-muted-3",
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Curriculum leads the form, as in the design */}
      {isTutoring && (
        <div className="flex flex-col gap-[6px]">
          <label className={labelClass} htmlFor="curriculum" id="curriculum-label">
            Curriculum <span className="text-[#B4462B]">*</span>
          </label>
          <SelectMenu
            id="curriculum"
            labelledBy="curriculum-label"
            value={curriculum}
            onChange={(v) => {
              setCurriculum(v);
              setSubjects([]);
              setCurriculumError(false);
            }}
            options={CURRICULUM_NAMES}
            placeholder="Select a curriculum…"
            invalid={curriculumError}
            describedBy={curriculumError ? "curriculum-error" : undefined}
            className={cn(inputClass, curriculumError && "border-[#B4462B]")}
          />
          {curriculumError && (
            <span id="curriculum-error" className={errorClass}>
              Please choose a curriculum so we can match the right tutor
            </span>
          )}
        </div>
      )}

      <div className="grid gap-[16px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))]">
        <div className="flex flex-col gap-[6px]">
          <label className={labelClass} htmlFor="contact_name">
            Your name <span className="text-[#B4462B]">*</span>
          </label>
          <input
            id="contact_name"
            placeholder="Full name"
            autoComplete="name"
            aria-invalid={errors.contact_name ? true : undefined}
            aria-describedby={errors.contact_name ? "contact_name-error" : undefined}
            className={inputClass}
            {...register("contact_name")}
          />
          {errors.contact_name && (
            <span id="contact_name-error" className={errorClass}>
              {errors.contact_name.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-[6px]">
          <label className={labelClass} htmlFor="contact_email">
            Email <span className="text-[#B4462B]">*</span>
          </label>
          <input
            id="contact_email"
            type="email"
            inputMode="email"
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={errors.contact_email ? true : undefined}
            aria-describedby={errors.contact_email ? "contact_email-error" : undefined}
            className={inputClass}
            {...register("contact_email")}
          />
          {errors.contact_email && (
            <span id="contact_email-error" className={errorClass}>
              {errors.contact_email.message}
            </span>
          )}
        </div>
      </div>

      {isTutoring && subjectOptions.length + subjects.length > 0 && (
        <div className="flex flex-col gap-[8px]">
          <label className={labelClass} htmlFor="subjects">
            Subjects needed <span className="font-semibold text-muted-3">(pick any)</span>
          </label>
          <div className="relative">
            <input
              id="subjects"
              value={subjectFilter}
              onChange={(e) => {
                setSubjectFilter(e.target.value);
                setSubjectsOpen(true);
              }}
              onFocus={() => setSubjectsOpen(true)}
              onBlur={() => {
                blurTimer.current = setTimeout(() => setSubjectsOpen(false), 150);
              }}
              placeholder="Type to search subjects…"
              className={inputClass}
              autoComplete="off"
            />
            {subjectsOpen && subjectOptions.length > 0 && (
              <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-40 max-h-[220px] overflow-y-auto rounded-[14px] border border-border bg-white p-[6px] shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                {subjectOptions.map((o) => (
                  <button
                    key={o}
                    type="button"
                    onMouseDown={() => {
                      if (blurTimer.current) clearTimeout(blurTimer.current);
                      setSubjects((s) => [...s, o]);
                      setSubjectFilter("");
                      setSubjectsOpen(false);
                    }}
                    className="w-full cursor-pointer rounded-[10px] px-[12px] py-[9px] text-left text-13 font-semibold text-body hover:bg-surface-alt hover:text-ink"
                  >
                    {o}
                  </button>
                ))}
              </div>
            )}
          </div>
          {subjects.length > 0 && (
            <div className="flex flex-wrap gap-[8px]">
              {subjects.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-[8px] whitespace-nowrap rounded-pill border border-border bg-surface-alt py-[6px] pl-[14px] pr-[8px] text-12 font-bold text-body"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => setSubjects((v) => v.filter((x) => x !== s))}
                    aria-label={`Remove ${s}`}
                    className="inline-flex h-[18px] w-[18px] cursor-pointer items-center justify-center rounded-pill border-none bg-border p-0 text-12 leading-none text-muted"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {isTutoring && (
      <div className="grid gap-[16px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))]">
        <div className="flex flex-col gap-[6px]">
          <span className={labelClass}>I am a</span>
          {/* Segmented control, per the design — not a dropdown */}
          <div
            className="flex gap-[4px] rounded-[12px] bg-surface-alt p-[4px]"
            role="group"
            aria-label="I am a"
          >
            {CONTACT_ROLE_OPTIONS.map((o) => {
              const on = role === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => {
                    setRole(o.value);
                    setValue("contact_role", o.value);
                  }}
                  aria-pressed={on}
                  className={cn(
                    "flex-1 cursor-pointer rounded-[9px] py-[9px] text-12_5 font-bold",
                    on
                      ? "bg-white text-body shadow-[0_2px_8px_rgba(60,60,60,0.12)]"
                      : "bg-transparent text-muted",
                  )}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-[6px]">
          <label className={labelClass} htmlFor="student_name">
            Student&#39;s name <span className="font-semibold text-muted-3">(optional)</span>
          </label>
          <input
            id="student_name"
            placeholder="Your child's name"
            autoComplete="off"
            className={inputClass}
            {...register("student_name")}
          />
        </div>
      </div>
      )}

      <div className="grid gap-[16px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))]">
        <div className="flex flex-col gap-[6px]">
          <label className={labelClass} htmlFor="contact_phone">
            Phone <span className="font-semibold text-muted-3">(optional)</span>
          </label>
          <input
            id="contact_phone"
            type="tel"
            inputMode="tel"
            placeholder="+44 7700 900000"
            autoComplete="tel"
            className={inputClass}
            {...register("contact_phone")}
          />
        </div>
        {isTutoring && (
          <div className="flex flex-col gap-[6px]">
            <label className={labelClass} htmlFor="preferred_schedule">
              Preferred schedule <span className="font-semibold text-muted-3">(optional)</span>
            </label>
            <input
              id="preferred_schedule"
              placeholder="e.g. Weekday evenings after 6pm"
              className={inputClass}
              {...register("preferred_schedule")}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-[6px]">
        <label className={labelClass} htmlFor="message">
          Message <span className="font-semibold text-muted-3">(optional)</span>
        </label>
        <textarea
          id="message"
          rows={3}
          placeholder={
            isTutoring
              ? "Anything else — goals, a tutor you'd like, or 'not sure of curriculum yet'"
              : "What would you like to know?"
          }
          className={cn(inputClass, "resize-y")}
          {...register("message")}
        />
      </div>

      {consentBox}
      {honeypot}
      <Turnstile
        ref={turnstileRef}
        onVerify={setTurnstileToken}
        onExpire={() => setTurnstileToken("")}
        onStatusChange={setTurnstileStatus}
      />

      {challengeUnavailable ? (
        fallbackContact
      ) : (
        <div className="flex flex-col items-start gap-[12px]">
          <button
            type="submit"
            disabled={isSubmitting || !turnstileToken}
            aria-describedby={!turnstileToken ? "submit-hint" : undefined}
            className="inline-flex cursor-pointer items-center gap-[10px] rounded-[16px] bg-primary px-[26px] py-[14px] text-14 font-extrabold text-white shadow-[0_4px_0_#58A700] hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Submitting…" : "Submit an inquiry"}
          </button>
          {/* A disabled button with no stated reason reads as a broken form. */}
          {!turnstileToken && (
            <span id="submit-hint" className={hintClass}>
              Complete the verification above to enable submitting.
            </span>
          )}
          <span className="text-11 text-muted-3">
            Protected by Cloudflare Turnstile · Our team reviews every inquiry personally
          </span>
        </div>
      )}
    </form>
  );
}
