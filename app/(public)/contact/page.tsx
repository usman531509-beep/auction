import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-28 pb-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-ink">
          Contact <span className="italic font-normal text-ink-soft">Us</span>
        </h1>
        <p className="text-sm text-ink-muted mt-2">
          Have a question or need help? Reach out to us anytime.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="space-y-5">
          {[
            {
              icon: Mail,
              title: "Email",
              detail: "info@kurumalink.com",
              sub: "We reply within 24 hours",
            },
            {
              icon: Phone,
              title: "Phone",
              detail: "+81 3-1234-5678",
              sub: "Mon - Fri, 9am - 6pm JST",
            },
            {
              icon: MapPin,
              title: "Office",
              detail: "Tokyo, Japan",
              sub: "Shibuya-ku, Tokyo 150-0001",
            },
            {
              icon: Clock,
              title: "Business Hours",
              detail: "Monday - Friday",
              sub: "9:00 AM - 6:00 PM JST",
            },
          ].map((item) => (
            <Card key={item.title}>
              <CardContent className="flex items-start gap-4 pt-6">
                <div className="h-10 w-10 rounded-xl bg-accent-soft flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink text-sm">{item.title}</h3>
                  <p className="text-ink mt-0.5">{item.detail}</p>
                  <p className="text-xs text-ink-muted mt-0.5">{item.sub}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Form */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="font-semibold text-ink text-lg mb-4">Send us a message</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-ink-soft">First name</label>
                  <input className="input" placeholder="John" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-ink-soft">Last name</label>
                  <input className="input" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-ink-soft">Email</label>
                <input type="email" className="input" placeholder="john@example.com" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-ink-soft">Subject</label>
                <input className="input" placeholder="How can we help?" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-ink-soft">Message</label>
                <textarea className="input min-h-[120px] resize-none" placeholder="Your message..." />
              </div>
              <button
                type="submit"
                className="w-full bg-accent hover:bg-accent-hover text-white py-3 rounded-lg font-medium transition-colors"
              >
                Send Message
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
