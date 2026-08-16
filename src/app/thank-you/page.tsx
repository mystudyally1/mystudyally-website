import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CONTACT_WHATSAPP_LINK, SLA_RESPONSE_TIME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Thank you",
  description: "Your inquiry has been received — a person on our team will reply shortly.",
  robots: { index: false, follow: true },
};

export default function ThankYouPage() {
  return (
    <Container className="flex flex-col items-center py-24 text-center">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-pill bg-primary-light text-2xl font-extrabold text-primary-shadow">
        ✓
      </span>
      <h1 className="mt-5 text-d-3xl text-ink">Thanks — your inquiry is in.</h1>
      <p className="mt-3 max-w-md text-md text-muted">
        A person on our team will read it and reply {SLA_RESPONSE_TIME}. In the meantime, feel
        free to message us on WhatsApp if it&rsquo;s urgent.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button as={Link} href="/">
          Back to homepage
        </Button>
        <Button as="a" href={CONTACT_WHATSAPP_LINK} variant="outline" target="_blank" rel="noopener">
          Message us on WhatsApp
        </Button>
      </div>
    </Container>
  );
}
