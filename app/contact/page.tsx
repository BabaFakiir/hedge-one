import Navbar from "@/components/site/navbar"
import Footer from "@/components/site/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function Contact() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4 text-emerald-400">Get in Touch</h1>
          <p className="text-xl text-slate-300 mb-12">
            Have questions about our algorithmic trading strategies? We'd love to hear from you.
          </p>

          <Card className="bg-slate-900 border-slate-700 p-8">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                <Input
                  type="text"
                  placeholder="Your name"
                  className="bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  className="bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                <Input
                  type="text"
                  placeholder="How can we help?"
                  className="bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                <Textarea
                  placeholder="Your message..."
                  rows={6}
                  className="bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500"
                />
              </div>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2">
                Send Message
              </Button>
            </form>
          </Card>

          {/* Contact Info */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              { title: "Email", value: "hello@hedge-one.com" },
              { title: "Phone", value: "+91 (0) 123-456-7890" },
              { title: "Location", value: "Mumbai, India" },
            ].map((item) => (
              <Card key={item.title} className="bg-slate-900 border-slate-700 p-6 text-center">
                <p className="text-slate-400 text-sm mb-2">{item.title}</p>
                <p className="text-slate-100 font-semibold">{item.value}</p>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
