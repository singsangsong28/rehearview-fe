import Faq from "@/components/landing/Faq";
import Features from "@/components/landing/Features";
import Fields from "@/components/landing/Fields";
import FinalCta from "@/components/landing/FinalCta";
import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Privacy from "@/components/landing/Privacy";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <Fields />
        <Privacy />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
