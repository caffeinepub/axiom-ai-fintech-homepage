import { useEffect, useRef, useState } from "react";

// Data points for the two lines (Year 1-10, value starting at 100)
const axiomPoints = [100, 112, 127, 144, 163, 182, 202, 220, 235, 247];
const typicalPoints = [100, 108, 116, 126, 136, 147, 158, 167, 177, 185];

const WIDTH = 600;
const HEIGHT = 300;
const PAD_LEFT = 48;
const PAD_RIGHT = 20;
const PAD_TOP = 20;
const PAD_BOTTOM = 48;

const CHART_W = WIDTH - PAD_LEFT - PAD_RIGHT;
const CHART_H = HEIGHT - PAD_TOP - PAD_BOTTOM;

const MIN_Y = 80;
const MAX_Y = 260;

const getX = (i: number) => PAD_LEFT + (i / (axiomPoints.length - 1)) * CHART_W;
const getY = (v: number) =>
  PAD_TOP + CHART_H - ((v - MIN_Y) / (MAX_Y - MIN_Y)) * CHART_H;

const buildPath = (points: number[]) =>
  points
    .map(
      (v, i) =>
        `${i === 0 ? "M" : "L"}${getX(i).toFixed(1)},${getY(v).toFixed(1)}`,
    )
    .join(" ");

const axiomPath = buildPath(axiomPoints);
const typicalPath = buildPath(typicalPoints);

// Area fill paths
const axiomArea = `${axiomPath} L${getX(axiomPoints.length - 1)},${PAD_TOP + CHART_H} L${getX(0)},${PAD_TOP + CHART_H} Z`;
const typicalArea = `${typicalPath} L${getX(typicalPoints.length - 1)},${PAD_TOP + CHART_H} L${getX(0)},${PAD_TOP + CHART_H} Z`;

const yLabels = ["₹1L", "₹1.5L", "₹2L", "₹2.5L"];
const yValues = [100, 150, 200, 250];

export default function PerformanceChart() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setAnimated(true);
            entry.target.classList.add("visible");
          }
        }
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: "#0d0d0d" }}
    >
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="max-w-5xl mx-auto px-6">
        <div ref={sectionRef} className="fade-in-section">
          {/* Heading */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-5">
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider"
                style={{
                  background: "rgba(0,200,150,0.1)",
                  border: "1px solid rgba(0,200,150,0.25)",
                  color: "#00c896",
                }}
              >
                PERFORMANCE PROJECTION
              </span>
            </div>
            <h2 className="section-headline text-4xl md:text-5xl xl:text-6xl text-white mb-4">
              See What <span className="gradient-text">Smarter Allocation</span>{" "}
              Looks Like
            </h2>
            <p
              className="text-base md:text-lg max-w-xl mx-auto"
              style={{ color: "#a0a0a0" }}
            >
              The same capital. Different intelligence. Over 10 years, the gap
              compounds into a significant difference.
            </p>
          </div>

          {/* Chart container */}
          <div className="glass-card p-6 md:p-8">
            {/* Legend */}
            <div className="flex flex-wrap gap-5 mb-6 justify-end">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-[3px] rounded-full"
                  style={{ background: "#00c896" }}
                />
                <span
                  className="text-sm font-semibold"
                  style={{ color: "#00c896" }}
                >
                  VVSPL MF Agent
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-[2px] rounded-full"
                  style={{ background: "#a0a0a0", opacity: 0.6 }}
                />
                <span className="text-sm" style={{ color: "#a0a0a0" }}>
                  Typical Advisor
                </span>
              </div>
            </div>

            {/* SVG chart */}
            <div className={`w-full ${animated ? "chart-animated" : ""}`}>
              <svg
                viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                className="w-full"
                style={{ height: "auto", maxHeight: "340px" }}
                role="img"
                aria-label="Performance projection chart comparing VVSPL MF Agent vs Typical Advisor over 10 years"
              >
                {/* Defs */}
                <defs>
                  <linearGradient id="axiomGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00c896" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#00c896" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="typicalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a0a0a0" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#a0a0a0" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Y-axis grid lines */}
                {yValues.map((v) => (
                  <line
                    key={v}
                    x1={PAD_LEFT}
                    y1={getY(v)}
                    x2={WIDTH - PAD_RIGHT}
                    y2={getY(v)}
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Y-axis labels */}
                {yLabels.map((label, i) => (
                  <text
                    key={label}
                    x={PAD_LEFT - 6}
                    y={getY(yValues[i]) + 4}
                    fill="rgba(255,255,255,0.3)"
                    fontSize="10"
                    textAnchor="end"
                    fontFamily="Satoshi, sans-serif"
                  >
                    {label}
                  </text>
                ))}

                {/* X-axis labels */}
                {axiomPoints.map((_, i) => (
                  <text
                    key={`year-${i + 1}`}
                    x={getX(i)}
                    y={HEIGHT - 12}
                    fill="rgba(255,255,255,0.25)"
                    fontSize="10"
                    textAnchor="middle"
                    fontFamily="Satoshi, sans-serif"
                  >
                    Y{i + 1}
                  </text>
                ))}

                {/* Area fills */}
                <path d={typicalArea} fill="url(#typicalGrad)" />
                <path d={axiomArea} fill="url(#axiomGrad)" />

                {/* Typical line */}
                <path
                  d={typicalPath}
                  fill="none"
                  stroke="rgba(160,160,160,0.45)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="chart-line-delayed"
                />

                {/* VVSPL MF Agent line */}
                <path
                  d={axiomPath}
                  fill="none"
                  stroke="#00c896"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="chart-line"
                />

                {/* End-point labels */}
                {animated && (
                  <>
                    <circle
                      cx={getX(axiomPoints.length - 1)}
                      cy={getY(axiomPoints[axiomPoints.length - 1])}
                      r="5"
                      fill="#00c896"
                    />
                    <text
                      x={getX(axiomPoints.length - 1) - 2}
                      y={getY(axiomPoints[axiomPoints.length - 1]) - 12}
                      fill="#00c896"
                      fontSize="11"
                      fontWeight="bold"
                      textAnchor="end"
                      fontFamily="Satoshi, sans-serif"
                    >
                      +147%
                    </text>
                    <circle
                      cx={getX(typicalPoints.length - 1)}
                      cy={getY(typicalPoints[typicalPoints.length - 1])}
                      r="4"
                      fill="#a0a0a0"
                      fillOpacity="0.6"
                    />
                    <text
                      x={getX(typicalPoints.length - 1) - 2}
                      y={getY(typicalPoints[typicalPoints.length - 1]) + 18}
                      fill="rgba(160,160,160,0.6)"
                      fontSize="10"
                      textAnchor="end"
                      fontFamily="Satoshi, sans-serif"
                    >
                      +85%
                    </text>
                  </>
                )}
              </svg>
            </div>

            {/* X-axis label */}
            <div className="text-center mt-2">
              <span
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.2)" }}
              >
                Investment Period (Years)
              </span>
            </div>

            {/* Gap callout */}
            <div
              className="mt-5 p-4 rounded-xl text-center"
              style={{
                background: "rgba(0,200,150,0.06)",
                border: "1px solid rgba(0,200,150,0.15)",
              }}
            >
              <span
                className="text-sm font-semibold"
                style={{ color: "#00c896" }}
              >
                62% more returns
              </span>
              <span
                className="text-sm"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {" "}
                over 10 years — same capital, smarter allocation
              </span>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-center text-xs mt-5" style={{ color: "#444" }}>
            Past performance does not guarantee future results. Projections are
            illustrative only based on historical fund category averages. Not
            investment advice — for advisor use only.
          </p>
        </div>
      </div>
    </section>
  );
}
