import Navigation from "@/components/navigation";
import Hero from "@/components/hero";
import Portfolio from "@/components/portfolio";
import CaseStudies from "@/components/case-studies";
import Contact from "@/components/contact";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <Portfolio />
        <CaseStudies />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
