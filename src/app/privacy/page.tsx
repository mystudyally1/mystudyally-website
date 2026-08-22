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
import { pageSocial } from "@/lib/metadata";

const TITLE = "Privacy Policy";
const DESCRIPTION =
  "How MyStudyAlly collects, uses, and protects the personal data you submit through inquiry forms.";

// Without an explicit `openGraph` these two pages inherited the root block —
// including its `url`, so both told every scraper their canonical URL was the
// homepage. `pageSocial` exists precisely so that cannot happen by omission.
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/privacy/` },
  ...pageSocial({ title: TITLE, description: DESCRIPTION, path: "/privacy/" }),
};

export default function PrivacyPage() {
  return (
    <Section className="py-14">
      <Container className="max-w-3xl">
        <div className="text-12 font-bold tracking-[0.14em] text-muted">LEGAL</div>
        <h1 className="mt-4 text-d44 font-extrabold tracking-[-0.02em] text-ink">Privacy Policy</h1>
        <p className="mt-3 text-13 text-muted">Last updated: {LEGAL_POLICY_LAST_UPDATED}</p>

        <div className="mt-10 flex flex-col gap-8 text-15 leading-relaxed text-muted">
          <section>
            <h2 className="mb-2 text-16 font-bold text-ink">Who we are</h2>
            <p>
              {LEGAL_ENTITY_NAME} (&ldquo;MyStudyAlly&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;)
              provides online tutoring services. Our registered address is {CONTACT_ADDRESS}. For
              any privacy question, contact{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-body underline underline-offset-[3px] hover:text-ink">{CONTACT_EMAIL}</a>.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-16 font-bold text-ink">What we collect</h2>
            <p>When you submit an inquiry through this website, we collect:</p>
            <ul className="mt-3 list-disc pl-5">
              <li>Your name, email address, and (if you provide it) phone number</li>
              <li>Whether you are a parent, student, or other</li>
              <li>
                The student&#39;s name, curriculum, subjects, and preferred schedule, if you
                choose to provide them
              </li>
              <li>Any message you write to us</li>
              <li>
                Basic attribution data — the page you submitted from, the referring website, and
                any campaign parameters in the link you arrived through
              </li>
              <li>
                A one-way hash of your IP address, used only to rate-limit abusive submissions. We
                do not store your raw IP address.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-16 font-bold text-ink">Why we collect it</h2>
            <p>
              We use this information solely to respond to your inquiry, match you with a suitable
              tutor, and arrange a trial session. Our lawful basis is your consent, given when you
              submit the form, and our legitimate interest in responding to enquiries about our
              services.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-16 font-bold text-ink">Who we share it with</h2>
            <p>
              We do not sell your data. We share it only with service providers who help us
              operate the site and respond to you:
            </p>
            <ul className="mt-3 list-disc pl-5">
              <li>Cloudflare — form processing, spam prevention, and hosting infrastructure</li>
              <li>SendGrid (Twilio) — delivering inquiry notifications to our team</li>
            </ul>
            <p className="mt-3">
              Tutors receive only the details needed to prepare for and deliver your sessions.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-16 font-bold text-ink">How long we keep it</h2>
            <p>
              Inquiry records are retained for as long as needed to respond and, if you become a
              client, for the duration of our relationship plus any period required by law. You
              can ask us to delete your inquiry at any time.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-16 font-bold text-ink">Your rights</h2>
            <p>
              Under UK GDPR you have the right to access, correct, delete, or restrict processing
              of your personal data, to object to processing, and to data portability. To exercise
              any of these, email{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-body underline underline-offset-[3px] hover:text-ink">{CONTACT_EMAIL}</a>. You also have the right to
              complain to the Information Commissioner&#39;s Office (ico.org.uk).
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-16 font-bold text-ink">Children&#39;s data</h2>
            <p>
              Our services are arranged by parents or guardians for students. Where a student is
              under 18, we expect a parent or guardian to submit the inquiry and provide consent
              on the student&#39;s behalf.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-16 font-bold text-ink">Cookies</h2>
            <p>
              This site does not use advertising or tracking cookies. We store campaign
              attribution data in your browser&#39;s session storage, which is cleared when you
              close the tab. Cloudflare Turnstile, our spam-prevention widget, may set a token
              needed to verify that you are not a bot.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-16 font-bold text-ink">Changes</h2>
            <p>
              We may update this policy. The date at the top reflects the most recent revision.
            </p>
          </section>

          <p>
            See also our <Link href="/terms/" className="font-semibold text-body underline underline-offset-[3px] hover:text-ink">Terms of Service</Link>.
          </p>
        </div>
      </Container>
    </Section>
  );
}
