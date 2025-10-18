import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-6xl md:text-7xl font-bold mb-6 text-slate-100">
          Algorithmic Trading for <span className="text-emerald-400">NIFTY50</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
          We implement tested strategies to create algorithms to make trades on NIFTY50 stocks.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/contact">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Get Started <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-slate-900 bg-transparent"
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  )
}
