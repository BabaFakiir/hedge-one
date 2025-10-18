import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Hedge-One - Algorithmic Trading for NIFTY50",
  description: "We implement tested strategies to create algorithms to make trades on NIFTY50 stocks.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased ${GeistSans.variable} ${GeistMono.variable} bg-slate-950 text-slate-50`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
