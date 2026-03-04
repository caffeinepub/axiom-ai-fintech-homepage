import { Database, FlaskConical, ListOrdered, Target } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const pipelineNodes = [
  {
    icon: Database,
    label: "Raw Data",
    sublabel: "10K+ sources",
    step: "01",
  },
  {
    icon: FlaskConical,
    label: "Factor Analysis",
    sublabel: "40+ metrics",
    step: "02",
  },
  {
    icon: Target,
    label: "Risk Alignment",
    sublabel: "Client profile match",
    step: "03",
  },
  {
    icon: ListOrdered,
    label: "Ranked Output",
    sublabel: "Explainable picks",
    step: "04",
  },
];

const metrics = [
  {
    label: "Sharpe Ratio",
    value: "2.41",
    suffix: "",
    description: "Risk-adjusted return",
    accent: "#00c896",
  },
  {
    label: "Alpha Generated",
    value: "4.8",
    suffix: "%",
    description: "Above benchmark",
    accent: "#d4af37",
  },
  {
    label: "Max Drawdown",
    value: "-8.3",
    suffix: "%",
    description: "Controlled downside",
    accent: "#ff6b6b",
  },
  {
    label: "Consistency Score",
    value: "94",
    suffix: "%",
    description: "Across all market cycles",
    accent: "#ffb347",
  },
];

function useCountUp(target: number, started: boolean, duration = 1800) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    const isNegative = target < 0;
    const absTarget = Math.abs(target);
    const steps = 60;
    const stepDuration = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - (1 - progress) ** 3;
      const current = absTarget * eased;
      setCount(isNegative ? -current : current);
      if (step >= steps) clearInterval(timer);
    }, stepDuration);

    return () => clearInterval(timer);
  }, [started, target, duration]);

  return count;
}

function MetricCard({
  metric,
  started,
}: {
  metric: (typeof metrics)[number];
  started: boolean;
}) {
  const numTarget = Number.parseFloat(metric.value);
  const count = useCountUp(numTarget, started, 1800);
  const isDecimal = metric.value.includes(".");

  const displayValue = () => {
    if (!started) return "0";
    const val = isDecimal
      ? Math.abs(count).toFixed(1)
      : Math.floor(Math.abs(count)).toString();
    const prefix = numTarget < 0 ? "-" : "";
    return `${prefix}${val}`;
  };

  return (
    <div className="glass-card p-6 flex flex-col gap-3 text-center">
      <div
        className="text-xs font-semibold tracking-widest uppercase"
        style={{ color: "rgba(255,255,255,0.4)" }}
      >
        {metric.label}
      </div>
      <div
        className="section-headline text-4xl"
        style={{ color: metric.accent }}
      >
        {displayValue()}
        {metric.suffix && started && (
          <span className="text-2xl">{metric.suffix}</span>
        )}
      </div>
      <div className="text-xs" style={{ color: "#606060" }}>
        {metric.description}
      </div>
    </div>
  );
}

export default function AIEngine() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const pipelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            entry.target.classList.add("visible");
          }
        }
      },
      { threshold: 0.15 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    if (pipelineRef.current) observer.observe(pipelineRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="pricing"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #0d0d0d 0%, #1a1a2e 60%, #0d0d0d 100%)",
      }}
    >
      {/* Emerald glow background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 30%, rgba(0,200,150,0.05) 0%, transparent 65%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div ref={sectionRef} className="fade-in-section text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-5">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider"
              style={{
                background: "rgba(0,200,150,0.1)",
                border: "1px solid rgba(0,200,150,0.25)",
                color: "#00c896",
              }}
            >
              AI INTELLIGENCE ENGINE
            </span>
          </div>
          <h2 className="section-headline text-4xl md:text-5xl xl:text-6xl text-white mb-4">
            Not a Screener.{" "}
            <span className="gradient-text">An Intelligence Engine.</span>
          </h2>
          <p
            className="text-base md:text-lg max-w-2xl mx-auto"
            style={{ color: "#a0a0a0" }}
          >
            A multi-layer AI pipeline that processes raw market data into
            precise, risk-aligned fund rankings.
          </p>
        </div>

        {/* Pipeline diagram */}
        <div
          ref={pipelineRef}
          className="fade-in-section glass-card emerald-glow p-8 md:p-10 mb-10"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-2">
            {pipelineNodes.map((node, i) => (
              <div
                key={node.label}
                className="flex flex-col md:flex-row items-center gap-4 md:gap-2 w-full md:w-auto"
              >
                {/* Node */}
                <div className="flex flex-col items-center gap-2 text-center min-w-[120px]">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center relative"
                    style={{
                      background: "rgba(0,200,150,0.1)",
                      border: "1px solid rgba(0,200,150,0.2)",
                      boxShadow: visible
                        ? "0 0 20px rgba(0,200,150,0.15)"
                        : "none",
                      transition: `box-shadow 0.5s ease ${i * 0.2}s`,
                    }}
                  >
                    <node.icon
                      className="w-6 h-6"
                      style={{ color: "#00c896" }}
                    />
                    <span
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{ background: "#00c896", color: "#000" }}
                    >
                      {i + 1}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">
                      {node.label}
                    </div>
                    <div className="text-xs" style={{ color: "#606060" }}>
                      {node.sublabel}
                    </div>
                  </div>
                </div>

                {/* Arrow connector (not after last) */}
                {i < pipelineNodes.length - 1 && (
                  <div className="hidden md:flex items-center flex-1 mx-1 min-w-[40px]">
                    <div
                      className="pipeline-arrow w-full h-[2px] relative"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(0,200,150,0.4), rgba(0,200,150,0.1))",
                      }}
                    >
                      <svg
                        className="absolute right-0 top-1/2 -translate-y-1/2"
                        width="8"
                        height="12"
                        viewBox="0 0 8 12"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M1 1L7 6L1 11"
                          stroke="#00c896"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Mobile arrow */}
                {i < pipelineNodes.length - 1 && (
                  <div className="md:hidden flex flex-col items-center">
                    <div
                      className="w-[2px] h-8 relative overflow-hidden"
                      style={{ background: "rgba(0,200,150,0.2)" }}
                    >
                      <div
                        className="absolute w-full"
                        style={{
                          height: "40%",
                          background:
                            "linear-gradient(180deg, #00c896, transparent)",
                          animation: "pipeline-dot 1.8s ease-in-out infinite",
                        }}
                      />
                    </div>
                    <svg
                      width="12"
                      height="8"
                      viewBox="0 0 12 8"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M1 1L6 7L11 1"
                        stroke="#00c896"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Processing label */}
          <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-wrap items-center justify-center gap-3">
            {[
              "Momentum",
              "Quality",
              "Value",
              "Volatility",
              "Drawdown",
              "Consistency",
              "Alpha",
              "Beta",
            ].map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full text-xs font-medium"
                style={{
                  background: "rgba(0,200,150,0.08)",
                  border: "1px solid rgba(0,200,150,0.15)",
                  color: "rgba(0,200,150,0.8)",
                }}
              >
                {tag}
              </span>
            ))}
            <span className="text-xs" style={{ color: "#404040" }}>
              + 32 more factors
            </span>
          </div>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} started={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
