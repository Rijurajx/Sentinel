import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { HeroInterfaceMock } from "@/components/landing/HeroInterfaceMock";
import { ClientLogos } from "@/components/landing/ClientLogos";
import { BentoCapabilities } from "@/components/landing/BentoCapabilities";
import { ThreatWalkthrough } from "@/components/landing/ThreatWalkthrough";
import { SecuritySpecs } from "@/components/landing/SecuritySpecs";
import { CtaSection } from "@/components/landing/CtaSection";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#08090a] text-[#f7f8f8] selection:bg-[#5e6ad2]/30 selection:text-[#f7f8f8]">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HeroInterfaceMock />
        <ClientLogos />
        <BentoCapabilities />
        <ThreatWalkthrough />
        <SecuritySpecs />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
