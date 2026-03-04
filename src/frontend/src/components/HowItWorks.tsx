import { BarChart3, Brain, FileText, Search, UserCheck } from "lucide-react";
import { useEffect, useRef } from "react";

const steps = [
  {
    number: "01",
    icon: UserCheck,
    title: "Collect SIP Details",
    description:
      "Enter investor name, monthly SIP amount, investment goal, tenure, and existing corpus to initialize the AI workflow.",
    tag: "Data Input",
  },
  {
    number: "02",
    icon: BarChart3,
    title: "Get Market Data",
    description:
      "The AI engine fetches real-time market data, NAV histories, and performance metrics from 10,000+ mutual funds.",
    tag: "Market Data",
  },
  {
    number: "03",
    icon: Brain,
    title: "Match Risk Profile",
    description:
      "A 5-question adaptive questionnaire calculates a precise risk score (1–10) and classifies the investor as Conservative, Moderate, or Aggressive.",
    tag: "Risk Matching",
  },
  {
    number: "04",
    icon: Search,
    title: "Filter Best Funds",
    description:
      "AI applies CAGR, Sharpe ratio, consistency, and drawdown filters to surface the top-ranked funds matching the risk profile.",
    tag: "AI Filtering",
  },
  {
    number: "05",
    icon: FileText,
    title: "Generate Report",
    description:
      "Full SIP projection report with corpus growth charts, fund comparison table, and AI-written recommendation — ready to share.",
    tag: "Report Output",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        }
      },
      { threshold: 0.12 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    for (const el of stepRefs.current) {
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="how-it-works"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #0d0d0d 0%, #1a1a2e 50%, #0d0d0d 100%)",
      }}
    >
      {/* Radial accent */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,200,150,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div
          ref={sectionRef}
          className="fade-in-section text-center mb-16 md:mb-20"
        >
          <div className="inline-flex items-center gap-2 mb-5">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider"
              style={{
                background: "rgba(0,200,150,0.1)",
                border: "1px solid rgba(0,200,150,0.25)",
                color: "#00c896",
              }}
            >
              HOW IT WORKS
            </span>
          </div>
          <h2 className="section-headline text-4xl md:text-5xl xl:text-6xl text-white">
            Five Steps to{" "}
            <span className="gradient-text">Smarter Advisory</span>
          </h2>
        </div>

        {/* Steps — horizontal on desktop, vertical on mobile */}
        <div className="relative">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-[52px] left-[calc(10%-16px)] right-[calc(10%-16px)] h-[2px] z-0 pointer-events-none">
            <div className="step-connector w-full h-full" />
          </div>

          <div className="grid md:grid-cols-5 gap-6 md:gap-4 relative z-10">
            {steps.map((step, i) => (
              <div
                key={step.number}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                className={`fade-in-section flex flex-col items-center md:items-center text-center gap-5 stagger-${i + 1}`}
              >
                {/* Mobile connector */}
                {i < steps.length - 1 && (
                  <div
                    className="md:hidden w-px h-10 self-center mt-0 relative overflow-hidden"
                    style={{ background: "rgba(0,200,150,0.3)" }}
                  >
                    <div
                      className="absolute top-0 left-0 w-full"
                      style={{
                        height: "40%",
                        background:
                          "linear-gradient(180deg, #00c896, transparent)",
                        animation: "connector-pulse-v 2s ease-in-out infinite",
                      }}
                    />
                  </div>
                )}

                {/* Number badge */}
                <div className="relative">
                  <div
                    className="w-[104px] h-[104px] rounded-2xl flex flex-col items-center justify-center gap-1 shrink-0"
                    style={{
                      background: "rgba(0,200,150,0.08)",
                      border: "1px solid rgba(0,200,150,0.2)",
                      boxShadow:
                        i === 1 ? "0 0 30px rgba(0,200,150,0.12)" : "none",
                    }}
                  >
                    <step.icon
                      className="w-7 h-7"
                      style={{ color: "#00c896" }}
                    />
                    <span
                      className="text-xs font-bold tracking-widest"
                      style={{ color: "rgba(0,200,150,0.6)" }}
                    >
                      {step.number}
                    </span>
                  </div>
                  {/* Emerald badge */}
                  <span
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: "#00c896", color: "#000" }}
                  >
                    {i + 1}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2 max-w-xs">
                  <div
                    className="text-xs font-semibold tracking-widest uppercase"
                    style={{ color: "rgba(0,200,150,0.65)" }}
                  >
                    {step.tag}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white">
                    {step.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#888" }}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA nudge */}
        <div className="fade-in-section mt-16 text-center">
          <p className="text-sm" style={{ color: "#606060" }}>
            Average time from setup to first recommendation:{" "}
            <span className="font-semibold" style={{ color: "#00c896" }}>
              Under 8 minutes
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
