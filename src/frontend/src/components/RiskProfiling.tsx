import { Shield, TrendingUp, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type RiskLevel = "conservative" | "moderate" | "aggressive";

const riskData = {
  conservative: {
    label: "Conservative",
    color: "#2dd4bf",
    bgColor: "rgba(45,212,191,0.08)",
    borderColor: "rgba(45,212,191,0.25)",
    description: "Capital preservation with steady income focus",
    icon: Shield,
    funds: [
      {
        name: "Axis Liquid Fund",
        category: "Liquid",
        risk: "Low",
        cagr: "6.8%",
        sharpe: "1.82",
        bar: 28,
      },
      {
        name: "HDFC Short Term Debt",
        category: "Short Duration",
        risk: "Low-Med",
        cagr: "7.4%",
        sharpe: "1.95",
        bar: 31,
      },
      {
        name: "Kotak Savings Fund",
        category: "Ultra Short",
        risk: "Low",
        cagr: "6.2%",
        sharpe: "1.74",
        bar: 25,
      },
    ],
  },
  moderate: {
    label: "Moderate",
    color: "#ffb347",
    bgColor: "rgba(255,179,71,0.08)",
    borderColor: "rgba(255,179,71,0.25)",
    description: "Balanced growth with managed risk exposure",
    icon: TrendingUp,
    funds: [
      {
        name: "Mirae Asset Hybrid",
        category: "Hybrid",
        risk: "Moderate",
        cagr: "12.3%",
        sharpe: "2.11",
        bar: 52,
      },
      {
        name: "ICICI Pru Balanced Advantage",
        category: "Dynamic Asset",
        risk: "Moderate",
        cagr: "11.8%",
        sharpe: "2.06",
        bar: 49,
      },
      {
        name: "SBI Equity Hybrid",
        category: "Hybrid",
        risk: "Moderate",
        cagr: "12.7%",
        sharpe: "2.18",
        bar: 54,
      },
    ],
  },
  aggressive: {
    label: "Aggressive",
    color: "#ff6b6b",
    bgColor: "rgba(255,107,107,0.08)",
    borderColor: "rgba(255,107,107,0.25)",
    description: "Maximum growth potential with higher volatility",
    icon: Zap,
    funds: [
      {
        name: "Axis Small Cap Fund",
        category: "Small Cap",
        risk: "High",
        cagr: "28.4%",
        sharpe: "2.41",
        bar: 78,
      },
      {
        name: "Nippon India Small Cap",
        category: "Small Cap",
        risk: "High",
        cagr: "31.2%",
        sharpe: "2.54",
        bar: 84,
      },
      {
        name: "Quant Active Fund",
        category: "Multi Cap",
        risk: "High",
        cagr: "26.8%",
        sharpe: "2.33",
        bar: 72,
      },
    ],
  },
};

const riskOrder: RiskLevel[] = ["conservative", "moderate", "aggressive"];

export default function RiskProfiling() {
  const [activeRisk, setActiveRisk] = useState<RiskLevel>("moderate");
  const [animKey, setAnimKey] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        }
      },
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleRiskChange = (level: RiskLevel) => {
    setActiveRisk(level);
    setAnimKey((k) => k + 1);
  };

  const current = riskData[activeRisk];
  const CurrentIcon = current.icon;

  return (
    <section
      id="risk-engine"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: "#0d0d0d" }}
    >
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 30%, ${current.color}08 0%, transparent 65%)`,
          transition: "background 0.6s ease",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div ref={sectionRef} className="fade-in-section text-center mb-14">
          <div className="inline-flex items-center gap-2 mb-5">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider"
              style={{
                background: "rgba(0,200,150,0.1)",
                border: "1px solid rgba(0,200,150,0.25)",
                color: "#00c896",
              }}
            >
              RISK PROFILING ENGINE
            </span>
          </div>
          <h2 className="section-headline text-4xl md:text-5xl xl:text-6xl text-white mb-4">
            Your Risk. Your Rules.{" "}
            <span className="gradient-text">Our Intelligence.</span>
          </h2>
          <p
            className="text-base md:text-lg max-w-2xl mx-auto"
            style={{ color: "#a0a0a0" }}
          >
            Slide to your client's risk tolerance and watch VVSPL MF Agent adapt
            its recommendations in real time.
          </p>
        </div>

        {/* Risk toggle buttons */}
        <div className="flex flex-col items-center gap-8 mb-12">
          <div className="flex gap-3 flex-wrap justify-center">
            {riskOrder.map((level) => {
              const data = riskData[level];
              const isActive = activeRisk === level;
              return (
                <button
                  type="button"
                  key={level}
                  data-ocid={`risk.toggle.${riskOrder.indexOf(level) + 1}`}
                  onClick={() => handleRiskChange(level)}
                  className={`risk-toggle-btn ${isActive ? `active-${level}` : ""}`}
                  style={{ minWidth: "140px" }}
                >
                  <span className="flex items-center gap-2 justify-center">
                    <data.icon className="w-4 h-4" />
                    {data.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active level info bar */}
          <div
            className="px-5 py-3 rounded-xl flex items-center gap-3 transition-all duration-400"
            style={{
              background: current.bgColor,
              border: `1px solid ${current.borderColor}`,
            }}
          >
            <CurrentIcon
              className="w-4 h-4 shrink-0"
              style={{ color: current.color }}
            />
            <span
              className="text-sm font-semibold"
              style={{ color: current.color }}
            >
              {current.label}:
            </span>
            <span
              className="text-sm"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              {current.description}
            </span>
          </div>
        </div>

        {/* Fund cards */}
        <div
          key={animKey}
          ref={cardsRef}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {current.funds.map((fund, i) => (
            <div
              key={fund.name}
              className="glass-card p-6 flex flex-col gap-4 risk-card-animate"
              style={{
                animationDelay: `${i * 0.1}s`,
                border: `1px solid ${current.color}22`,
              }}
            >
              {/* Fund header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div
                    className="text-xs font-semibold mb-1"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    {fund.category}
                  </div>
                  <h4 className="text-base font-bold text-white leading-tight">
                    {fund.name}
                  </h4>
                </div>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 mt-0.5"
                  style={{
                    background: `${current.color}18`,
                    color: current.color,
                    border: `1px solid ${current.color}35`,
                  }}
                >
                  {fund.risk}
                </span>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div
                  className="glass-card p-3 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: "10px",
                  }}
                >
                  <div className="text-xs text-white/40 mb-1">3Y CAGR</div>
                  <div
                    className="text-lg font-bold"
                    style={{ color: current.color }}
                  >
                    {fund.cagr}
                  </div>
                </div>
                <div
                  className="glass-card p-3 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: "10px",
                  }}
                >
                  <div className="text-xs text-white/40 mb-1">Sharpe Ratio</div>
                  <div className="text-lg font-bold text-white">
                    {fund.sharpe}
                  </div>
                </div>
              </div>

              {/* Risk bar */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-white/40">Risk Score</span>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: current.color }}
                  >
                    {fund.bar}/100
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden bg-white/[0.06]">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${fund.bar}%`,
                      background: `linear-gradient(90deg, ${current.color}bb, ${current.color})`,
                    }}
                  />
                </div>
              </div>

              {/* Brand tag */}
              <div className="flex items-center gap-1.5 mt-auto pt-1">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: current.color }}
                />
                <span
                  className="text-xs"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  VVSPL MF Agent Risk-Aligned
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
