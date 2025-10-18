import Navbar from "@/components/site/navbar"
import Footer from "@/components/site/footer"
import { Card } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function Performance() {
  const performanceData = [
    { month: "Jan", returns: 8.2, benchmark: 5.1 },
    { month: "Feb", returns: 6.5, benchmark: 4.2 },
    { month: "Mar", returns: 12.3, benchmark: 7.8 },
    { month: "Apr", returns: 9.8, benchmark: 6.5 },
    { month: "May", returns: 14.2, benchmark: 8.9 },
    { month: "Jun", returns: 11.5, benchmark: 7.2 },
  ]

  const strategyReturns = [
    { strategy: "Momentum", ytd: 45.2 },
    { strategy: "Mean Reversion", ytd: 38.7 },
    { strategy: "Stat Arb", ytd: 42.1 },
    { strategy: "Volatility", ytd: 52.3 },
  ]

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4 text-emerald-400">Performance</h1>
          <p className="text-xl text-slate-300 mb-12">Track our algorithmic trading performance metrics</p>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-4 mb-12">
            {[
              { label: "YTD Returns", value: "42.8%", color: "text-emerald-400" },
              { label: "Sharpe Ratio", value: "1.85", color: "text-blue-400" },
              { label: "Max Drawdown", value: "-8.2%", color: "text-red-400" },
              { label: "Win Rate", value: "62.3%", color: "text-emerald-400" },
            ].map((metric) => (
              <Card key={metric.label} className="bg-slate-900 border-slate-700 p-6">
                <p className="text-slate-400 text-sm mb-2">{metric.label}</p>
                <p className={`text-3xl font-bold ${metric.color}`}>{metric.value}</p>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-slate-900 border-slate-700 p-8">
              <h3 className="text-xl font-bold text-slate-100 mb-6">Monthly Returns vs Benchmark</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155" }} />
                  <Legend />
                  <Line type="monotone" dataKey="returns" stroke="#10b981" strokeWidth={2} name="Hedge-One" />
                  <Line type="monotone" dataKey="benchmark" stroke="#64748b" strokeWidth={2} name="Benchmark" />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="bg-slate-900 border-slate-700 p-8">
              <h3 className="text-xl font-bold text-slate-100 mb-6">Strategy YTD Returns</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={strategyReturns}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155" }} />
                  <Bar dataKey="ytd" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
