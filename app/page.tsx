import Navbar from "@/components/site/navbar"
import Footer from "@/components/site/footer"
import Hero from "@/components/site/hero"
import FeatureCards from "@/components/site/feature-cards"
import PerformanceTeaser from "@/components/site/performance-teaser"
import StrategyShowcase from "@/components/site/strategy-showcase"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 pointer-events-none" />
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <FeatureCards />
          <StrategyShowcase />
          <PerformanceTeaser />
        </main>
        <Footer />
      </div>
    </div>
  )
}
