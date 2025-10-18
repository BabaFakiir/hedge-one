import Navbar from "@/components/site/navbar"
import Footer from "@/components/site/footer"
import { Card } from "@/components/ui/card"

export default function About() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="mb-16">
            <h1 className="text-5xl font-bold mb-6 text-emerald-400">About Hedge-One</h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              We implement tested strategies to create algorithms to make trades on NIFTY50 stocks.
            </p>
          </div>

          {/* Mission Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="bg-slate-900 border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-emerald-400 mb-4">Our Mission</h2>
              <p className="text-slate-300 leading-relaxed">
                To democratize algorithmic trading by providing sophisticated, data-driven strategies that deliver
                consistent returns in the Indian equity market.
              </p>
            </Card>
            <Card className="bg-slate-900 border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-blue-400 mb-4">Our Vision</h2>
              <p className="text-slate-300 leading-relaxed">
                To become the leading algorithmic trading platform for NIFTY50, empowering traders with intelligent
                automation and market insights.
              </p>
            </Card>
          </div>

          {/* Core Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-slate-100">Core Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Precision", description: "Rigorous backtesting and validation of all strategies" },
                { title: "Innovation", description: "Continuous research and algorithm optimization" },
                { title: "Transparency", description: "Clear reporting and performance metrics" },
              ].map((value) => (
                <Card key={value.title} className="bg-slate-900 border-slate-700 p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-2">{value.title}</h3>
                  <p className="text-slate-400">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Technology */}
          <Card className="bg-slate-900 border-slate-700 p-8">
            <h2 className="text-2xl font-bold text-slate-100 mb-4">Technology & Expertise</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Our platform leverages advanced machine learning, statistical analysis, and real-time market data to
              identify trading opportunities in the NIFTY50 index. We combine quantitative research with practical
              market experience to deliver algorithms that adapt to changing market conditions.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Every strategy undergoes extensive backtesting across multiple market cycles before deployment, ensuring
              robustness and reliability.
            </p>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
