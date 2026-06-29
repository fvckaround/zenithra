"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";

const TESTIMONIALS = [
  {
    quote:
      "Zenithra isn't just a platform; it's a complete shift in how I manage digital assets. The transparency on returns alone is worth the switch.",
    name: "Daniel R.",
    role: "Venture Capitalist",
    initials: "DR",
  },
  {
    quote:
      "Finally, a crypto platform that matches institutional standards. Fast deposits, clear reporting, and support that actually responds.",
    name: "Isabelle M.",
    role: "Fund Manager",
    initials: "IM",
  },
  {
    quote:
      "I moved a significant part of my portfolio to Zenithra after three months of tracking their compounding model. It's consistent, and that's rare.",
    name: "Lucas B.",
    role: "Private Investor",
    initials: "LB",
  },
  {
    quote:
      "The automated compounding feature genuinely changed how passive my investing could be. I check in weekly, not daily.",
    name: "Sophie T.",
    role: "Tech Entrepreneur",
    initials: "ST",
  },
  {
    quote:
      "I was skeptical at first, but after my first payout hit within 24 hours I was convinced. Zenithra is the real deal — nothing comes close.",
    name: "Marcus T.",
    role: "Retail Investor",
    initials: "MT",
  },
  {
    quote:
      "The Growth plan has outperformed every other investment vehicle I've tried this year. My portfolio is up significantly and I haven't touched it once.",
    name: "Elena V.",
    role: "Portfolio Manager",
    initials: "EV",
  },
  {
    quote:
      "What sets Zenithra apart is the admin responsiveness. Every deposit I've made was confirmed within the hour. That kind of reliability is priceless.",
    name: "James K.",
    role: "Angel Investor",
    initials: "JK",
  },
  {
    quote:
      "I referred three colleagues to Zenithra and all of them thanked me for it. The referral bonus was a nice touch on top of my daily returns.",
    name: "Claire D.",
    role: "Financial Analyst",
    initials: "CD",
  },
  {
    quote:
      "The KYC process was smooth and fast. Within an hour of submitting my documents I was fully verified and ready to invest. Very professional.",
    name: "Robert H.",
    role: "Real Estate Developer",
    initials: "RH",
  },
  {
    quote:
      "I've been with Zenithra for six months. My returns have been consistent every single day. This is the kind of passive income I was looking for.",
    name: "Natalie W.",
    role: "Business Owner",
    initials: "NW",
  },
];

function pairUp(arr) {
  const pairs = [];
  for (let i = 0; i < arr.length; i += 2) {
    pairs.push(arr.slice(i, i + 2));
  }
  return pairs;
}

export default function Testimonials() {
  const pairs = pairUp(TESTIMONIALS);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const goNext = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % pairs.length);
  };

  const goPrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + pairs.length) % pairs.length);
  };

  return (
    <section id="testimonials" className="bg-navy-950 py-20 sm:py-28">
      <Container>
        <ScrollReveal>
          <h2 className="text-center font-display text-3xl font-medium text-ink sm:text-4xl md:text-5xl">
            Trusted by the{" "}
            <span className="italic text-gold-400">Elite</span>
          </h2>
        </ScrollReveal>

        <div className="mt-14 flex items-center gap-3 sm:gap-6">
          <button
            onClick={goPrev}
            aria-label="Previous testimonials"
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/10 text-ink-muted transition-colors hover:border-gold-500/40 hover:text-gold-400"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="relative flex-1 overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2"
              >
                {pairs[index].map((t) => (
                  <TestimonialCard key={t.name} {...t} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            onClick={goNext}
            aria-label="Next testimonials"
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/10 text-ink-muted transition-colors hover:border-gold-500/40 hover:text-gold-400"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {pairs.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-gold-500" : "w-1.5 bg-white/15"
              }`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

function TestimonialCard({ quote, name, role, initials }) {
  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-white/5 bg-navy-900/80 p-7 sm:p-8">
      <p className="font-display text-base italic leading-relaxed text-ink sm:text-lg">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="mt-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/15 text-xs font-semibold text-gold-400">
          {initials}
        </span>
        <div>
          <p className="text-sm font-medium text-ink">{name}</p>
          <p className="text-xs text-ink-faint">{role}</p>
        </div>
      </div>
    </div>
  );
}