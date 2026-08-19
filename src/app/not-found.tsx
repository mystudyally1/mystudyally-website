import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you were looking for doesn't exist or has moved.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center py-24 text-center">
      <h1 className="text-d48 font-extrabold tracking-[-0.02em] text-ink">Page not found</h1>
      <p className="mt-4 max-w-md text-15 text-muted">
        The page you&#39;re looking for doesn&#39;t exist or has moved.
      </p>
      <Button as={Link} href="/" className="mt-8">
        Back to homepage
      </Button>
    </Container>
  );
}
