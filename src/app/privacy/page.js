import LegalLayout, { LegalSection } from "@/components/layout/LegalLayout";

export const metadata = {
  title: "Privacy Policy | Zenithra Holding",
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="June 2026">
      <LegalSection heading="1. Information We Collect">
        <p>
          We collect information you provide directly, such as your name, email
          address, and account activity. We also collect technical data like
          device and usage information to operate and secure the Platform.
        </p>
      </LegalSection>

      <LegalSection heading="2. How We Use Your Information">
        <p>
          We use your information to provide and improve our services, process
          transactions, communicate with you, prevent fraud, and comply with
          legal obligations.
        </p>
      </LegalSection>

      <LegalSection heading="3. How We Protect Your Data">
        <p>
          Passwords are stored using one-way hashing, and access to your account
          is protected by signed session tokens. We apply industry-standard
          safeguards to protect your personal information.
        </p>
      </LegalSection>

      <LegalSection heading="4. Sharing of Information">
        <p>
          We do not sell your personal information. We may share data with service
          providers who help us operate the Platform, or where required by law.
        </p>
      </LegalSection>

      <LegalSection heading="5. Your Rights">
        <p>
          You may access, correct, or request deletion of your personal
          information at any time by contacting us. You may also opt out of
          non-essential communications.
        </p>
      </LegalSection>

      <LegalSection heading="6. Contact">
        <p>
          For privacy inquiries, contact{" "}
          <span className="text-gold-400">zenithraholding@outlook.com</span>.
        </p>
      </LegalSection>

      <p className="text-xs text-ink-faint">
        This is a demonstration platform. The content above is illustrative and
        does not constitute legal advice.
      </p>
    </LegalLayout>
  );
}
