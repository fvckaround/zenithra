import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import CryptoPrices from "@/components/landing/CryptoPrices";
import Testimonials from "@/components/landing/Testimonials";
import Plans from "@/components/landing/Plans";
import Footer from "@/components/layout/Footer";
import SocialProof from "@/components/landing/SocialProof";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <CryptoPrices />
        <Testimonials />
        <Plans />
      </main>
      <Footer />
      <SocialProof />
    </>
  );
}