import { z } from "zod";

// Field-for-field mirror of mystudyally-forms-worker/src/schema.ts.
// Keep these two in sync — the Worker is the source of truth for validation,
// this copy only gives the form fast client-side feedback before submit.
export const inquirySchema = z.object({
  contact_name: z.string().min(2).max(100),
  contact_email: z.string().email().max(255),
  contact_role: z.enum(["parent", "student", "other"]),
  contact_phone: z.string().max(20).optional().or(z.literal("")),

  student_name: z.string().max(100).optional().or(z.literal("")),
  curriculum: z.string().max(50).optional().or(z.literal("")),
  subjects_needed: z.array(z.string().max(100)).max(20).optional(),
  preferred_schedule: z.string().max(200).optional().or(z.literal("")),
  message: z.string().max(2000).optional().or(z.literal("")),

  website: z.string().max(0).optional(),

  cf_turnstile_token: z.string().min(1, "Please complete the verification challenge."),

  utm_source: z.string().max(100).optional(),
  utm_medium: z.string().max(100).optional(),
  utm_campaign: z.string().max(100).optional(),
  referrer_url: z.string().max(500).optional(),
  page_path: z.string().max(300).optional(),
});

export type InquiryFormValues = z.infer<typeof inquirySchema>;

export const CONTACT_ROLE_OPTIONS: { value: InquiryFormValues["contact_role"]; label: string }[] = [
  { value: "parent", label: "Parent" },
  { value: "student", label: "Student" },
  { value: "other", label: "Other" },
];
