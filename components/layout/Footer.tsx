import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-4">
              <Image
                src="/logo.png"
                alt="クルマリンク"
                width={40}
                height={40}
                className="h-20 w-20 object-contain"
              />
              クルマリンク
            </Link>
            <p className="text-sm text-white/60 leading-relaxed">
              Premium cars you can trust. Transparent pricing, hassle-free ordering, fast delivery.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/80">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-white/60 hover:text-accent transition-colors">Home</Link></li>
              <li><Link href="/cars" className="text-sm text-white/60 hover:text-accent transition-colors">Cars</Link></li>
              <li><Link href="/cart" className="text-sm text-white/60 hover:text-accent transition-colors">Cart</Link></li>
              <li><Link href="/contact" className="text-sm text-white/60 hover:text-accent transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/80">
              Account
            </h4>
            <ul className="space-y-3">
              <li><Link href="/login" className="text-sm text-white/60 hover:text-accent transition-colors">Log in</Link></li>
              <li><Link href="/register" className="text-sm text-white/60 hover:text-accent transition-colors">Sign up</Link></li>
              <li><Link href="/dashboard" className="text-sm text-white/60 hover:text-accent transition-colors">My orders</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/80">
              Contact
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
          <span className="text-sm text-white/40">Premium car store</span>
        </div>
      </div>
    </footer>
  );
}
