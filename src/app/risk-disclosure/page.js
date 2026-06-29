import Link from "next/link";
import Container from "@/components/ui/Container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Risk Disclosure | Zenithra Holding",
};

export default function RiskDisclosurePage() {
  return (
    <>
      <Navbar />
      <main className="bg-navy-900 pt-32 pb-20">
        <Container className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-500">
            Legal
          </p>
          <h1 className="mt-3 font-display text-4xl font-medium text-ink">
            Risk Disclosure
          </h1>
          <p className="mt-4 text-sm text-ink-muted">
            Last updated: January 1, 2026
          </p>

          <div className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-6 py-5 text-sm text-amber-400">
            <p className="font-semibold">Important Notice</p>
            <p className="mt-1">
              Digital asset investments carry significant risk. Please read this
              disclosure carefully before investing. You should only invest funds
              you can afford to lose entirely.
            </p>
          </div>

          <div className="mt-10 space-y-10 text-sm leading-relaxed text-ink-muted">
            <Section title="1. Volatility Risk">
              Digital assets and cryptocurrencies are highly volatile. The value
              of assets can fluctuate dramatically within short periods of time.
              While Zenithra Holding works to provide stable returns through
              structured investment plans, underlying market conditions can affect
              platform performance. Past returns do not guarantee future results.
            </Section>

            <Section title="2. No Guaranteed Returns">
              All return rates displayed on the Zenithra Holding platform are
              projections based on historical performance and current market
              conditions. They are not guaranteed. Actual returns may be lower
              than projected, or in adverse market conditions, you may lose some
              or all of your principal investment.
            </Section>

            <Section title="3. Liquidity Risk">
              Funds committed to an active investment plan are locked for the
              duration of the plan. You may not be able to withdraw your
              principal before the maturity date. Withdrawal requests are subject
              to admin approval and may take up to 24 hours to process. In
              extreme market conditions, processing times may be longer.
            </Section>

            <Section title="4. Regulatory Risk">
              The regulatory environment for digital assets varies by
              jurisdiction and is subject to change. New laws or regulations
              could affect the operation of Zenithra Holding or the legality of
              digital asset investments in your region. It is your responsibility
              to ensure compliance with the laws of your jurisdiction before
              investing.
            </Section>

            <Section title="5. Technology Risk">
              Digital asset platforms rely on blockchain technology and
              third-party infrastructure. Technical failures, cyberattacks,
              smart contract bugs, or network congestion could result in delays,
              losses, or disruption of service. While we take extensive security
              measures, no system is entirely immune to technical risk.
            </Section>

            <Section title="6. Counterparty Risk">
              By depositing funds on the Zenithra Holding platform, you are
              exposed to counterparty risk — the risk that the platform may be
              unable to fulfill its obligations. We maintain cold-storage
              security and reserve funds to mitigate this risk, but it cannot
              be entirely eliminated.
            </Section>

            <Section title="7. Fraud and Scam Risk">
              Be aware of phishing attempts, fake websites, and social
              engineering attacks that may impersonate Zenithra Holding. Always
              access the platform through the official URL. We will never ask
              for your password via email or chat. Report any suspicious
              activity to{" "}
              <a
                href="mailto:support@zenithra.com"
                className="text-gold-400 hover:text-gold-300"
              >
                support@zenithra.com
              </a>
              .
            </Section>

            <Section title="8. Investment Suitability">
              Digital asset investments may not be suitable for all investors.
              Before investing, consider your financial situation, risk
              tolerance, and investment objectives. We strongly recommend
              consulting a licensed financial advisor before committing
              significant funds to any investment platform.
            </Section>

            <Section title="9. Jurisdictional Restrictions">
              Zenithra Holding may not be available in all jurisdictions. It is
              your responsibility to determine whether using this platform is
              legal in your country or region. We do not offer services to
              residents of jurisdictions where such services are prohibited by
              law.
            </Section>

            <Section title="10. Acknowledgement">
              By using the Zenithra Holding platform, you acknowledge that you
              have read, understood, and accepted the risks outlined in this
              disclosure. You confirm that you are investing voluntarily and with
              full awareness of the risks involved.
            </Section>
          </div>

          <div className="mt-14 border-t border-white/5 pt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="text-sm text-gold-400 hover:text-gold-300">
              ← Back to home
            </Link>
            <div className="flex gap-6 text-xs text-ink-faint">
              <Link href="/privacy" className="hover:text-gold-400 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-gold-400 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="mb-3 font-display text-lg font-medium text-ink">{title}</h2>
      <p>{children}</p>
    </div>
  );
}