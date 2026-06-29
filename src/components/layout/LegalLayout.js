import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";

export default function LegalLayout({ title, updated, children }) {
  return (
    <>
      <Navbar />
      <main className="pb-20 pt-32 sm:pt-40">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h1 className="font-display text-3xl font-medium text-ink sm:text-4xl">
              {title}
            </h1>
            <p className="mt-2 text-sm text-ink-faint">Last updated {updated}</p>
            <div className="mt-10 space-y-8">{children}</div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

export function LegalSection({ heading, children }) {
  return (
    <section>
      <h2 className="font-display text-xl text-ink">{heading}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-muted">
        {children}
      </div>
    </section>
  );
}
