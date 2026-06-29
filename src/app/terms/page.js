import LegalLayout, { LegalSection } from "@/components/layout/LegalLayout";

export const metadata = {
  title: "Terms of Service | Zenithra Holding",
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="June 2026">
      <LegalSection heading="1. Acceptance of Terms">
        <p>
          By creating an account or using Zenithra Holding (&quot;the
          Platform&quot;), you agree to be bound by these Terms of Service. If you
          do not agree, you may not access or use the Platform.
        </p>
      </LegalSection>

      <LegalSection heading="2. Eligibility">
        <p>
          You must be at least 18 years old and legally capable of entering into
          binding contracts to use the Platform. You are responsible for ensuring
          that your use complies with the laws of your jurisdiction.
        </p>
      </LegalSection>

      <LegalSection heading="3. Investment Risk">
        <p>
          All investments carry risk. Returns displayed on the Platform are
          illustrative and not guaranteed. Past performance does not guarantee
          future results. You should never invest funds you cannot afford to
          lose.
        </p>
      </LegalSection>

      <LegalSection heading="4. Account Security">
        <p>
          You are responsible for maintaining the confidentiality of your account
          credentials and for all activity that occurs under your account. Notify
          us immediately of any unauthorized use.
        </p>
      </LegalSection>

      <LegalSection heading="5. Deposits and Withdrawals">
        <p>
          Deposits and withdrawals are subject to the limits and processing times
          described on the Platform. We reserve the right to verify the source of
          funds and to delay or decline transactions where required by law.
        </p>
      </LegalSection>

      <LegalSection heading="6. Changes to These Terms">
        <p>
          We may update these Terms from time to time. Continued use of the
          Platform after changes take effect constitutes acceptance of the revised
          Terms.
        </p>
      </LegalSection>

      <LegalSection heading="7. Contact">
        <p>
          Questions about these Terms can be sent to{" "}
          <span className="text-gold-400">legal@zenithra.example</span>.
        </p>
      </LegalSection>

      <p className="text-xs text-ink-faint">
        This is a demonstration platform. The content above is illustrative and
        does not constitute legal or financial advice.
      </p>
    </LegalLayout>
  );
}
