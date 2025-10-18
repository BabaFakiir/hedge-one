import { Card } from "@/components/ui/card"
import { TrendingUp, Zap, Shield } from "lucide-react"

export default function FeatureCards() {
  const features = [
    {
      icon: TrendingUp,
      title: "Data-Driven",
      description: "Strategies backed by rigorous backtesting and statistical analysis",
    },
    {
      icon: Zap,
      title: "Real-Time",
      description: "Algorithms execute trades instantly based on market conditions",
    },
    {
      icon: Shield,
      title: "Risk Management",
      description: "Built-in safeguards to protect your capital",
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="bg-slate-900 border-slate-700 p-8">
                <Icon className="w-12 h-12 text-emerald-400 mb-4" />
                <h3 className="text-xl font-bold text-slate-100 mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
