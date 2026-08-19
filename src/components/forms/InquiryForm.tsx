"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Turnstile } from "@/components/forms/Turnstile";
import { getAttribution } from "@/lib/utm";
import { FORM_ENDPOINT } from "@/lib/constants";
import { CONTACT_ROLE_OPTIONS, inquirySchema, type InquiryFormValues } from "@/lib/schemas/inquiry";
import { CURRICULA, getCurriculumByName } from "@/data/curricula";

// Field styling mirrors "website design/InquiryForm.dc.html".
const inputClass =
  "w-full rounded-[12px] border border-border bg-white px-[14px] py-[12px] text-13 text-body placeholder:text-muted-3 focus:border-[#89E219] focus:outline-none";
const labelClass = "text-12 font-bold text-body";
const errorClass = "text-11_5 font-bold text-[#B4462B]";

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
    formState: { errors, isSubmitting },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
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
        setErrorMessage(
          "You've submitted a few inquiries recently — please try again later, or reach us on WhatsApp.",
        );
        return;
      }
      if (res.status === 400) {
        setErrorMessage("We couldn't verify your submission. Please retry the challenge below.");
        return;
      }
      setErrorMessage("Something went wrong on our end. Please try again in a moment.");
    } catch {
      setErrorMessage(
        "We couldn't reach the server — check your connection and try again. Your answers are still here.",
      );
    }
  }

  const consentBox = (
    <div className="flex flex-col gap-[6px]">
      <button
        type="button"
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
      {consentError && <span className={errorClass}>Please confirm we may contact you</span>}
    </div>
  );

  const honeypot = (
    <input
      type="text"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      className="hidden"
      {...register("website")}
    />
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
      <form onSubmit={handleSubmit(onSubmit)} className={cn("flex flex-col gap-[16px]", className)} noValidate>
        {alerts}

        <div className="flex flex-col gap-[6px]">
          <label className={labelClass}>
            Curriculum <span className="font-semibold text-muted-3">(set for this page)</span>
          </label>
          <div className="flex items-center justify-between gap-[12px] rounded-[12px] border border-border bg-surface-alt px-[14px] py-[12px] text-13 font-bold text-muted">
            {curriculum || "Not set"}
            <span className="inline-flex items-center gap-[6px] rounded-pill bg-primary-light px-[10px] py-[4px] text-11 font-extrabold text-primary-shadow">
              ✓ Selected
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className={labelClass} htmlFor="q_name">
            Your name <span className="text-[#B4462B]">*</span>
          </label>
          <input id="q_name" placeholder="Full name" className={inputClass} {...register("contact_name")} />
          {errors.contact_name && <span className={errorClass}>{errors.contact_name.message}</span>}
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className={labelClass} htmlFor="q_email">
            Email <span className="text-[#B4462B]">*</span>
          </label>
          <input
            id="q_email"
            type="email"
            placeholder="you@example.com"
            className={inputClass}
            {...register("contact_email")}
          />
          {errors.contact_email && <span className={errorClass}>{errors.contact_email.message}</span>}
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className={labelClass} htmlFor="q_phone">
            Phone <span className="font-semibold text-muted-3">(optional)</span>
          </label>
          <input id="q_phone" placeholder="+44 7700 900000" className={inputClass} {...register("contact_phone")} />
        </div>

        {subjectOptions.length + subjects.length > 0 && (
          <div className="flex flex-col gap-[8px]">
            <label className={labelClass} htmlFor="q_subjects">
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
        <Turnstile onVerify={setTurnstileToken} onExpire={() => setTurnstileToken("")} />

        <button
          type="submit"
          disabled={isSubmitting || !turnstileToken}
          className="cursor-pointer rounded-pill bg-primary p-[15px] text-14 font-extrabold text-white shadow-[0_4px_0_#58A700] hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Submitting…" : "Submit an inquiry"}
        </button>

        <div className="flex items-center justify-between">
          <span className="text-11 text-muted-3">Protected by Cloudflare Turnstile</span>
          <span className="text-11 text-muted-3">Our team reviews every inquiry personally</span>
        </div>
      </form>
    );
  }

  /* ---------------- full (contact page) ---------------- */
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("flex flex-col gap-[22px]", className)} noValidate>
      {alerts}

      {showIntent && (
        <div className="flex flex-col gap-[10px]">
          <label className="text-14 font-extrabold text-body">What can we help with?</label>
          <div className="flex gap-[10px]" role="group" aria-label="What can we help with?">
            {INTENTS.map((o) => (
              <button
                key={o.key}
                type="button"
                onClick={() => setIntent(o.key)}
                aria-pressed={intent === o.key}
                className={cn(
                  "flex-1 cursor-pointer rounded-[14px] border-2 px-[10px] py-[13px] text-center text-13 font-bold leading-[1.35]",
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
          <label className={labelClass} htmlFor="curriculum">
            Curriculum <span className="text-[#B4462B]">*</span>
          </label>
          <select
            id="curriculum"
            value={curriculum}
            onChange={(e) => {
              setCurriculum(e.target.value);
              setSubjects([]);
              setCurriculumError(false);
            }}
            className={cn(inputClass, curriculumError && "border-[#B4462B]")}
          >
            <option value="">Select a curriculum…</option>
            {CURRICULA.map((c) => (
              <option key={c.slug} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          {curriculumError && (
            <span className={errorClass}>
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
          <input id="contact_name" placeholder="Full name" className={inputClass} {...register("contact_name")} />
          {errors.contact_name && <span className={errorClass}>{errors.contact_name.message}</span>}
        </div>
        <div className="flex flex-col gap-[6px]">
          <label className={labelClass} htmlFor="contact_email">
            Email <span className="text-[#B4462B]">*</span>
          </label>
          <input
            id="contact_email"
            type="email"
            placeholder="you@example.com"
            className={inputClass}
            {...register("contact_email")}
          />
          {errors.contact_email && <span className={errorClass}>{errors.contact_email.message}</span>}
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
          <input id="student_name" placeholder="Your child's name" className={inputClass} {...register("student_name")} />
        </div>
      </div>
      )}

      <div className="grid gap-[16px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))]">
        <div className="flex flex-col gap-[6px]">
          <label className={labelClass} htmlFor="contact_phone">
            Phone <span className="font-semibold text-muted-3">(optional)</span>
          </label>
          <input id="contact_phone" placeholder="+44 7700 900000" className={inputClass} {...register("contact_phone")} />
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
      <Turnstile onVerify={setTurnstileToken} onExpire={() => setTurnstileToken("")} />

      <div className="flex flex-col items-start gap-[12px]">
        <button
          type="submit"
          disabled={isSubmitting || !turnstileToken}
          className="inline-flex cursor-pointer items-center gap-[10px] rounded-[16px] bg-primary px-[26px] py-[14px] text-14 font-extrabold text-white shadow-[0_4px_0_#58A700] hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Submitting…" : "Submit an inquiry"}
        </button>
        <span className="text-11 text-muted-3">
          Protected by Cloudflare Turnstile · Our team reviews every inquiry personally
        </span>
      </div>
    </form>
  );
}
