import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center py-24 text-center">
      <h1 className="text-d-4xl text-ink">Page not found</h1>
      <p className="mt-4 max-w-md text-md text-muted">
        The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.
      </p>
      <Button as={Link} href="/" className="mt-8">
        Back to homepage
      </Button>
    </Container>
  );
}
