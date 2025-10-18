import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function StrategyShowcase() {
  const strategies = [
    {
      name: "Momentum Trading",
      description: "Captures short-term price trends",
      returns: "12-18%",
      color: "text-emerald-400",
    },
    {
      name: "Mean Reversion",
      description: "Exploits overbought/oversold conditions",
      returns: "8-14%",
      color: "text-blue-400",
    },
    {
      name: "Statistical Arbitrage",
      description: "Identifies price discrepancies",
      returns: "10-16%",
      color: "text-purple-400",
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-slate-100">Our Strategies</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {strategies.map((strategy) => (
            <Card
              key={strategy.name}
              className="bg-slate-900 border-slate-700 p-8 hover:border-slate-600 transition-colors"
            >
              <h3 className={`text-xl font-bold mb-2 ${strategy.color}`}>{strategy.name}</h3>
              <p className="text-slate-400 mb-4">{strategy.description}</p>
              <Badge variant="outline" className="border-slate-600">
                {strategy.returns}
              </Badge>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
