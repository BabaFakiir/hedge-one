import Navbar from "@/components/site/navbar"
import Footer from "@/components/site/footer"
import Hero from "@/components/site/hero"
import FeatureCards from "@/components/site/feature-cards"
import PerformanceTeaser from "@/components/site/performance-teaser"
import StrategyShowcase from "@/components/site/strategy-showcase"

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-teal-900/20 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

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
