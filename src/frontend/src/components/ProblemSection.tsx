import { AlertTriangle, Clock, TrendingDown } from "lucide-react";
import { useEffect, useRef } from "react";

const problems = [
  {
    icon: Clock,
    title: "Hours Wasted",
    subtitle: "Manual comparison kills productivity",
    description:
      "Manual fund comparison eats 3–4 hours per client. Time you'll never get back — and clients who expect answers now.",
    stat: "3–4 hrs",
    statLabel: "per client review",
    accent: "#ffb347",
  },
  {
    icon: AlertTriangle,
    title: "Gut-Feel Recommendations",
    subtitle: "Trust erodes without alignment",
    description:
      "Recommendations that don't align with client risk profiles erode trust and AUM. One bad quarter and they're gone.",
    stat: "↓ 22%",
    statLabel: "avg. AUM retention loss",
    accent: "#ff6b6b",
  },
  {
    icon: TrendingDown,
    title: "Missed Rebalancing",
    subtitle: "Silent return killer",
    description:
      "Delayed rebalancing signals cost clients 1.2% in annual returns on average — compounding into significant losses over time.",
    stat: "1.2%",
    statLabel: "avg. annual return lost",
    accent: "#d4af37",
  },
];

export default function ProblemSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        }
      },
      { threshold: 0.15 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    for (const el of cardRefs.current) {
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="features"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: "#0d0d0d" }}
    >
      {/* Subtle grid bg */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
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
                background: "rgba(255,179,71,0.1)",
                border: "1px solid rgba(255,179,71,0.25)",
                color: "#ffb347",
              }}
            >
              THE PROBLEM
            </span>
          </div>
          <h2 className="section-headline text-4xl md:text-5xl xl:text-6xl text-white mb-5">
            Fund Research Is Broken.
            <br />
            <span className="gradient-text">We Fixed It.</span>
          </h2>
          <p
            className="text-base md:text-lg max-w-2xl mx-auto"
            style={{ color: "#a0a0a0" }}
          >
            The manual, gut-feel approach to fund advisory isn't just slow —
            it's costing your clients real money and your business real growth.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((problem, i) => (
            <div
              key={problem.title}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={`fade-in-section glass-card glass-card-hover p-7 flex flex-col gap-5 stagger-${i + 1}`}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: `rgba(${problem.accent === "#ffb347" ? "255,179,71" : problem.accent === "#ff6b6b" ? "255,107,107" : "212,175,55"},0.12)`,
                  border: `1px solid ${problem.accent}30`,
                }}
              >
                <problem.icon
                  className="w-5 h-5"
                  style={{ color: problem.accent }}
                />
              </div>

              {/* Content */}
              <div>
                <p
                  className="text-xs font-semibold tracking-widest uppercase mb-1.5"
                  style={{ color: problem.accent }}
                >
                  {problem.subtitle}
                </p>
                <h3 className="text-xl font-bold text-white mb-3">
                  {problem.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#8a8a8a" }}
                >
                  {problem.description}
                </p>
              </div>

              {/* Stat */}
              <div className="mt-auto pt-5 border-t border-white/[0.07] flex items-end justify-between">
                <div>
                  <div
                    className="section-headline text-3xl"
                    style={{ color: problem.accent }}
                  >
                    {problem.stat}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "#606060" }}>
                    {problem.statLabel}
                  </div>
                </div>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
                  style={{
                    background: `${problem.accent}15`,
                    color: problem.accent,
                    border: `1px solid ${problem.accent}30`,
                  }}
                >
                  !
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
