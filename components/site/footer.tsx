import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">H1</span>
              </div>
              <span className="text-lg font-bold text-emerald-400">Hedge-One</span>
            </div>
            <p className="text-slate-400 text-sm">Algorithmic trading strategies for NIFTY50</p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-slate-100 mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/strategies" className="hover:text-emerald-400">
                  Strategies
                </Link>
              </li>
              <li>
                <Link href="/performance" className="hover:text-emerald-400">
                  Performance
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-slate-100 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/about" className="hover:text-emerald-400">
                  About
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400">
                  Blog
                </a>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-slate-100 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="#" className="hover:text-emerald-400">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400">
                  Disclaimer
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8">
          <p className="text-center text-slate-400 text-sm">© 2025 Hedge-One. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
