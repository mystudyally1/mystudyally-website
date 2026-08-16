import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  LEGAL_ENTITY_NAME,
  LEGAL_POLICY_LAST_UPDATED,
  SITE_URL,
} from "@/lib/constants";
import { CLASS_DURATION_MINUTES } from "@/data/pricing";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms under which MyStudyAlly provides tutoring services, including plans, scheduling, recordings, and conduct.",
  alternates: { canonical: `${SITE_URL}/terms/` },
};

export default function TermsPage() {
  return (
    <Section className="py-14">
      <Container className="max-w-3xl">
        <div className="text-eyebrow text-muted">LEGAL</div>
        <h1 className="mt-4 text-d-3xl text-ink">Terms of Service</h1>
        <p className="mt-3 text-sm text-muted">Last updated: {LEGAL_POLICY_LAST_UPDATED}</p>

        <div className="mt-10 flex flex-col gap-8 text-md leading-relaxed text-muted">
          <section>
            <h2 className="mb-2 text-lg font-bold text-ink">1. Who these terms are with</h2>
            <p>
              These terms govern your use of the MyStudyAlly website and tutoring services,
              provided by {LEGAL_ENTITY_NAME}, {CONTACT_ADDRESS}. By submitting an inquiry or
              purchasing a plan, you agree to them.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-ink">2. Our service</h2>
            <p>
              We match students with tutors selected for the student&rsquo;s curriculum and
              subjects, and we handle scheduling and administration. We do not guarantee any
              particular academic result, grade, or examination outcome.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-ink">3. Inquiries and matching</h2>
            <p>
              Submitting an inquiry does not create a contract for tutoring. We will contact you
              to confirm details and propose a tutor. A free trial session is offered before any
              payment is taken.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-ink">4. Plans and payment</h2>
            <p>
              Tutoring is sold as prepaid plans of classes. Each class is{" "}
              {CLASS_DURATION_MINUTES} minutes of one-to-one tuition. Classes are deducted from
              your balance as sessions are completed. Plan prices are shown on our{" "}
              <Link href="/pricing/">pricing page</Link> and include no registration or platform
              fees. Payment is taken by secure link once you choose to enrol.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-ink">5. Validity, cancellation and refunds</h2>
            <p>
              Each plan carries a validity window shown at the point of purchase. Our detailed
              cancellation, rescheduling, expiry, and refund terms are being finalised. Until they
              are published here, our team will confirm the applicable terms with you in writing
              before you make any payment.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-ink">6. Sessions and recordings</h2>
            <p>
              Sessions are delivered online and are recorded by default so students can rewatch
              them. By attending a session you consent to that recording. Recordings are for the
              student&rsquo;s personal study and for our quality and safeguarding purposes; they
              may not be redistributed or published.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-ink">7. Conduct</h2>
            <p>
              We ask students and parents to treat tutors with respect, and we hold tutors to the
              same standard. All communication and scheduling goes through MyStudyAlly. We may
              suspend or end service for abusive behaviour or attempts to arrange tuition outside
              the platform.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-ink">8. Intellectual property</h2>
            <p>
              Materials we or our tutors provide remain our or their property and are licensed to
              you for personal study only.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-ink">9. Liability</h2>
            <p>
              Nothing in these terms limits liability for death or personal injury caused by
              negligence, for fraud, or for anything else that cannot lawfully be limited. Subject
              to that, our total liability in connection with the service is limited to the amount
              you paid for the plan in question.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-ink">10. Governing law</h2>
            <p>
              These terms are governed by the laws of England and Wales, and the courts of England
              and Wales have exclusive jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-ink">11. Contact</h2>
            <p>
              Questions about these terms: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </section>

          <p>
            See also our <Link href="/privacy/">Privacy Policy</Link>.
          </p>
        </div>
      </Container>
    </Section>
  );
}
