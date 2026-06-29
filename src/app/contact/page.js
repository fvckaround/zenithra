"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import { Mail, MessageSquare, Clock } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState({ type: null, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: "" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Failed to send message");
      setStatus({
        type: "success",
        message: "Your message has been sent. We'll get back to you within 24 hours.",
      });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-navy-800/60 px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-gold-500/50";

  return (
    <>
      <Navbar />
      <main className="bg-navy-900 pt-32 pb-20">
        <Container className="max-w-5xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-500">
              Get in Touch
            </p>
            <h1 className="mt-3 font-display text-4xl font-medium text-ink sm:text-5xl">
              Contact Us
            </h1>
            <p className="mt-4 mx-auto max-w-xl text-sm text-ink-muted">
              Have a question about your account, a deposit, or our investment
              plans? Our support team is here to help.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-1">
              <InfoCard
                icon={Mail}
                title="Email Support"
                description="zenithraholding@outlook.com"
                sub="We reply within 24 hours"
              />
              <InfoCard
                icon={MessageSquare}
                title="Live Chat"
                description="Available on dashboard"
                sub="For verified account holders"
              />
              <InfoCard
                icon={Clock}
                title="Response Time"
                description="Under 24 hours"
                sub="Monday – Saturday"
              />
            </div>

            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-white/5 bg-navy-800/60 p-8">
                <p className="mb-6 text-sm font-medium text-ink">
                  Send us a message
                </p>

                {status.type && (
                  <div
                    className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
                      status.type === "success"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : "border-red-500/30 bg-red-500/10 text-red-400"
                    }`}
                  >
                    {status.message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs text-ink-muted">
                        Full Name
                      </label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs text-ink-muted">
                        Email Address
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs text-ink-muted">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    >
                      <option value="">Select a subject</option>
                      <option value="Deposit Issue">Deposit Issue</option>
                      <option value="Withdrawal Issue">Withdrawal Issue</option>
                      <option value="KYC Verification">KYC Verification</option>
                      <option value="Investment Plan">Investment Plan</option>
                      <option value="Account Access">Account Access</option>
                      <option value="Referral Program">Referral Program</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs text-ink-muted">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Describe your issue or question in detail..."
                      required
                      rows={5}
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-md bg-gold-500 px-6 py-3 text-sm font-semibold text-navy-900 transition-colors hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

function InfoCard({ icon: Icon, title, description, sub }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-navy-800/60 p-6">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/10 text-gold-400">
        <Icon size={18} strokeWidth={1.75} />
      </span>
      <p className="mt-4 text-sm font-medium text-ink">{title}</p>
      <p className="mt-1 text-sm text-gold-400">{description}</p>
      <p className="mt-1 text-xs text-ink-faint">{sub}</p>
    </div>
  );
}