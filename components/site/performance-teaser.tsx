import { Card } from "@/components/ui/card"

export default function PerformanceTeaser() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-slate-100">Performance Highlights</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { label: "YTD Returns", value: "42.8%", icon: "📈" },
            { label: "Sharpe Ratio", value: "1.85", icon: "📊" },
            { label: "Win Rate", value: "62.3%", icon: "✓" },
            { label: "Strategies", value: "4+", icon: "⚙️" },
          ].map((stat) => (
            <Card key={stat.label} className="bg-slate-900 border-slate-700 p-6">
              <p className="text-3xl mb-2">{stat.icon}</p>
              <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-emerald-400">{stat.value}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
