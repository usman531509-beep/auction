"use client";
import { useScrollAnimation } from "./useScrollAnimation";
import { UserPlus, Search, Gavel, CreditCard } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Registration",
    description: "Create your account with essential details to get started on your bidding journey.",
    icon: UserPlus,
    points: ["Specific Information", "Required For Registration", "Such As Identification"],
  },
  {
    step: "02",
    title: "Select Product",
    description: "Browse our curated collection and find the perfect vehicle that matches your needs.",
    icon: Search,
    points: ["Search Your Auction", "Find The Right Product", "Review Vehicle Details"],
  },
  {
    step: "03",
    title: "Go to Bidding",
    description: "Place your bid with confidence. Our transparent system ensures fair competition.",
    icon: Gavel,
    points: ["Choose The Bid Product", "Bid according to your ability", "Keep your eyes on the bid"],
  },
  {
    step: "04",
    title: "Make Payment",
    description: "Secure and easy payment process to complete your winning auction purchase.",
    icon: CreditCard,
    points: ["Specific Information", "Required For Registration", "Such As Identification"],
  },
];

export default function WorkProcess() {
  const sectionRef = useScrollAnimation();

  return (
    <section ref={sectionRef} className="animate-on-scroll bg-surface py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-ink">
            4 Step Of Our Work{" "}
            <span className="italic font-normal text-ink-soft">Process</span>
          </h2>
        </div>

        {/* Step indicators */}
        <div className="hidden md:flex items-center justify-between max-w-3xl mx-auto mb-16 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-line -translate-y-1/2" />
          {steps.map((s) => (
            <div key={s.step} className="relative z-10 flex flex-col items-center">
              <div className="bg-accent-soft border-2 border-accent text-accent text-xs font-bold rounded-full px-4 py-1.5">
                Step-{s.step}
              </div>
            </div>
          ))}
        </div>

        {/* Step cards */}
        <div className="stagger-children visible grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="bg-white rounded-2xl p-6 border border-line hover:shadow-lift transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-12 w-12 rounded-xl bg-accent-soft flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-bold text-ink text-lg mb-2 italic">{s.title}</h3>
                <p className="text-sm text-ink-muted mb-4 leading-relaxed">{s.description}</p>
                <ul className="space-y-2">
                  {s.points.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-ink-soft">
                      <span className="text-ink-muted font-medium min-w-[24px]">
                        {String(i + 1).padStart(2, "0")}.
                      </span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
