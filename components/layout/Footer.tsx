import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-4">
              <Image
                src="/uploads/Screenshot_2026-04-17_at_12.02.05_PM-removebg-preview.png"
                alt="クルマリンク"
                width={40}
                height={40}
                className="h-20 w-20 object-contain"
              />
              クルマリンク
            </Link>
            <p className="text-sm text-white/60 leading-relaxed">
              Premium car auctions you can trust. Transparent bidding, fair pricing, zero hassle.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/80">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {["Home", "Auctions", "How to Bid", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={item === "Home" ? "/" : item === "Auctions" ? "/auctions" : "#"}
                    className="text-sm text-white/60 hover:text-accent transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/80">
              Support
            </h4>
            <ul className="space-y-3">
              {["FAQ", "Terms of Service", "Privacy Policy", "Help Center"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-white/60 hover:text-accent transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/80">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li>info@kurumalink.com</li>
              <li>Customer Support</li>
              <li>Mon - Fri, 9am - 6pm</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} クルマリンク. All rights reserved.
          </span>
          <span className="text-sm text-white/40">Modern car auctions</span>
        </div>
      </div>
    </footer>
  );
}
