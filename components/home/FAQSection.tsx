"use client";
import { useState } from "react";
import { Plus, Minus, Mail } from "lucide-react";
import { useScrollAnimation } from "./useScrollAnimation";

const categories = ["General", "Payment", "Bidding"];

const faqs: Record<string, { q: string; a: string }[]> = {
  General: [
    {
      q: "What is an auction?",
      a: "An auction is a public sale where goods or services are sold to the highest bidder. Bidders compete to offer the highest price, and the item is awarded to the bidder with the highest bid when the auction ends.",
    },
    {
      q: "How do auctions work?",
      a: "Auctions work by allowing registered bidders to place bids on items they are interested in. The bidding starts at a set price and increases as more bids are placed. The item goes to the highest bidder when the auction closes.",
    },
    {
      q: "What types of auctions are there?",
      a: "There are several types of auctions including English auctions (ascending price), Dutch auctions (descending price), sealed-bid auctions, and reserve auctions. Each type has its own rules and format.",
    },
    {
      q: "Who can participate in auctions?",
      a: "Anyone who registers an account and meets our verification requirements can participate in auctions. You need to be at least 18 years old and have a valid payment method on file.",
    },
    {
      q: "What happens if I win an auction?",
      a: "If you win an auction, you will be notified immediately. You will need to complete the payment within the specified timeframe. Once payment is confirmed, we will arrange delivery or pickup of your vehicle.",
    },
  ],
  Payment: [
    {
      q: "What payment methods are accepted?",
      a: "We accept major credit cards, bank transfers, and escrow payments. All transactions are secured and encrypted for your protection.",
    },
    {
      q: "When do I need to pay?",
      a: "Payment is due within 48 hours of winning an auction. Late payments may result in penalties or forfeiture of the item.",
    },
    {
      q: "Is there a buyer's premium?",
      a: "Yes, a buyer's premium of 5% is added to the final hammer price. This covers administration, vehicle inspection, and documentation costs.",
    },
  ],
  Bidding: [
    {
      q: "How do I place a bid?",
      a: "Simply navigate to the auction you're interested in, enter your bid amount (must be higher than the current bid), and click 'Place Bid'. Your bid will be recorded instantly.",
    },
    {
      q: "Can I retract a bid?",
      a: "Bids are generally binding. In exceptional circumstances, you may contact our support team to discuss bid retraction, but this is not guaranteed.",
    },
    {
      q: "What is auto-bidding?",
      a: "Auto-bidding allows you to set a maximum bid amount. The system will automatically place the minimum necessary bid on your behalf, up to your maximum, whenever you are outbid.",
    },
  ],
};

export default function FAQSection() {
  const sectionRef = useScrollAnimation();
  const [activeCategory, setActiveCategory] = useState("General");
  const [openIndex, setOpenIndex] = useState(0);

  const currentFaqs = faqs[activeCategory] ?? [];

  return (
    <section ref={sectionRef} className="animate-on-scroll bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-ink">
            Frequently Asked{" "}
            <span className="italic font-normal text-ink-soft">Questions</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-10">
          {/* Sidebar */}
          <div>
            <div className="space-y-1 mb-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setOpenIndex(0);
                  }}
                  className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-accent text-white"
                      : "text-ink hover:bg-surface"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="bg-surface rounded-2xl p-6">
              <h4 className="font-semibold text-ink text-sm mb-1">
                Ask the help community
              </h4>
              <p className="text-xs text-ink-muted mb-4">write to us now!</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-accent-soft flex items-center justify-center">
                  <Mail className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <span className="text-[10px] text-ink-muted block">To Send Mail</span>
                  <span className="text-sm font-medium text-ink">info@kurumalink.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Items */}
          <div className="space-y-3">
            {currentFaqs.map((faq, i) => (
              <div
                key={i}
                className="border border-line rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-medium text-ink text-sm pr-4">{faq.q}</span>
                  <div
                    className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
                      openIndex === i ? "bg-accent text-white" : "bg-accent-soft text-accent"
                    }`}
                  >
                    {openIndex === i ? (
                      <Minus className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === i ? "max-h-60" : "max-h-0"
                  }`}
                >
                  <div className="px-6 pb-5 text-sm text-ink-muted leading-relaxed">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
