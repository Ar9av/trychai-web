import Footer from "@/components/footer";
import Hero from "@/components/hero";
// import NavBar from "@/components/navbar";
import NavBar from "@/components/navbar";
import Pricing from "@/components/pricing";
import Partners from "@/components/partners";
import Faq from "@/components/faq";
import Features from "@/components/features";

export default function Home() {
  return (
    
    <main className="flex flex-col min-h-dvh">
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <NavBar />
      <Hero />
      <Partners />
      <Features />
      <Pricing />
      <Faq />
      <Footer />
    </main>
  );
}
