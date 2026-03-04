import { useEffect, useRef } from "react";

const testimonials = [
  {
    quote:
      "VVSPL MF Agent cut my fund research time by 70%. My clients get better recommendations, and I spend more time building relationships instead of comparing spreadsheets.",
    name: "Priya Mehta",
    title: "CFP, Senior Advisor",
    firm: "WealthAxis Consulting",
    initials: "PM",
    accent: "#00c896",
  },
  {
    quote:
      "The risk profiling engine is incredibly accurate. I've never had a client question a recommendation since switching to VVSPL MF Agent. The explainability alone is worth it.",
    name: "Rajesh Iyer",
    title: "MFD, Founder",
    firm: "PeakPortfolio Advisors",
    initials: "RI",
    accent: "#d4af37",
  },
  {
    quote:
      "The automated rebalancing alerts alone saved one of my top clients ₹4.2L in a single quarter. VVSPL MF Agent pays for itself many times over.",
    name: "Sneha Kulkarni",
    title: "CFP\u1D9C\u1D39, Partner",
    firm: "ClearPath Wealth",
    initials: "SK",
    accent: "#ffb347",
  },
];

function StarRating() {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className="w-4 h-4"
          viewBox="0 0 20 20"
          fill="#d4af37"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

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
    for (const el of cardRefs.current) {
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #0d0d0d 0%, #1a1a2e 50%, #0d0d0d 100%)",
      }}
    >
      {/* Large quotation mark bg decoration */}
      <div
        className="absolute top-12 left-1/2 -translate-x-1/2 text-[280px] leading-none pointer-events-none select-none"
        style={{
          color: "rgba(0,200,150,0.03)",
          fontFamily: '"Bricolage Grotesque", sans-serif',
          fontWeight: 900,
        }}
      >
        "
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div ref={sectionRef} className="fade-in-section text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-5">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider"
              style={{
                background: "rgba(212,175,55,0.1)",
                border: "1px solid rgba(212,175,55,0.25)",
                color: "#d4af37",
              }}
            >
              ADVISOR STORIES
            </span>
          </div>
          <h2 className="section-headline text-4xl md:text-5xl xl:text-6xl text-white">
            Trusted by Financial Advisors
            <br />
            <span className="gradient-text">Across India</span>
          </h2>
        </div>

        {/* Testimonial cards — staggered layout */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={`fade-in-section glass-card glass-card-hover p-7 flex flex-col gap-5 stagger-${i + 1} ${
                i === 1
                  ? "md:-mt-4 md:shadow-[0_0_40px_rgba(0,200,150,0.08)]"
                  : ""
              }`}
              style={{
                border: `1px solid ${t.accent}20`,
              }}
            >
              {/* Decorative quote */}
              <div
                className="text-6xl leading-none font-black"
                style={{
                  color: `${t.accent}30`,
                  fontFamily: '"Bricolage Grotesque", sans-serif',
                  lineHeight: "0.8",
                  marginBottom: "-8px",
                }}
              >
                "
              </div>

              {/* Stars */}
              <StarRating />

              {/* Quote */}
              <blockquote
                className="text-base leading-relaxed"
                style={{ color: "#d4d4d4" }}
              >
                "{t.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.07]">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{
                    background: `${t.accent}18`,
                    border: `1px solid ${t.accent}35`,
                    color: t.accent,
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{t.name}</div>
                  <div className="text-xs" style={{ color: "#707070" }}>
                    {t.title} · {t.firm}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof bar */}
        <div className="fade-in-section mt-14 flex flex-wrap items-center justify-center gap-8 pt-10 border-t border-white/[0.06]">
          {[
            { value: "2,400+", label: "Active Advisors" },
            { value: "₹840 Cr+", label: "AUM Managed" },
            { value: "4.9/5", label: "Average Rating" },
            { value: "98%", label: "Retention Rate" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="section-headline text-2xl md:text-3xl"
                style={{ color: "#00c896" }}
              >
                {stat.value}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "#606060" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
