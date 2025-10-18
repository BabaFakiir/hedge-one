import Navbar from "@/components/site/navbar"
import Footer from "@/components/site/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Strategies() {
  const strategies = [
    {
      name: "Momentum Trading",
      description: "Captures short-term price trends in NIFTY50 stocks",
      riskLevel: "Medium",
      returns: "12-18%",
    },
    {
      name: "Mean Reversion",
      description: "Exploits overbought and oversold conditions",
      riskLevel: "Low",
      returns: "8-14%",
    },
    {
      name: "Statistical Arbitrage",
      description: "Identifies price discrepancies between correlated stocks",
      riskLevel: "Low",
      returns: "10-16%",
    },
    {
      name: "Volatility Trading",
      description: "Profits from market volatility fluctuations",
      riskLevel: "High",
      returns: "15-25%",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4 text-emerald-400">Trading Strategies</h1>
          <p className="text-xl text-slate-300 mb-12">
            Our portfolio of tested algorithmic strategies for NIFTY50 trading
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {strategies.map((strategy) => (
              <Card key={strategy.name} className="bg-slate-900 border-slate-700 p-8">
                <h3 className="text-2xl font-bold text-emerald-400 mb-3">{strategy.name}</h3>
                <p className="text-slate-300 mb-6">{strategy.description}</p>
                <div className="flex gap-4 flex-wrap">
                  <div>
                    <p className="text-sm text-slate-400">Risk Level</p>
                    <Badge variant="outline" className="mt-1 border-slate-600">
                      {strategy.riskLevel}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Expected Returns</p>
                    <Badge variant="outline" className="mt-1 border-emerald-600 text-emerald-400">
                      {strategy.returns}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
