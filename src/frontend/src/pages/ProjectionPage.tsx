import { useNavigate } from "@tanstack/react-router";
import { ChevronRight, Loader2, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useSession } from "../App";
import type { SIPProjection } from "../backend.d";
import PageLayout from "../components/PageLayout";
import { useActor } from "../hooks/useActor";

interface ScenarioPoint {
  year: number;
  conservative: number;
  moderate: number;
  aggressive: number;
}

function calculateGrowth(
  monthlyAmount: number,
  existingCorpus: number,
  tenureYears: number,
  _ratePercent: number,
): ScenarioPoint[] {
  const points: ScenarioPoint[] = [];
  const rates = { conservative: 0.07, moderate: 0.12, aggressive: 0.18 };

  for (let y = 0; y <= tenureYears; y++) {
    const point: ScenarioPoint = {
      year: y,
      conservative: 0,
      moderate: 0,
      aggressive: 0,
    };
    for (const [key, r] of Object.entries(rates) as [
      keyof typeof rates,
      number,
    ][]) {
      const compoundedCorpus = existingCorpus * (1 + r) ** y;
      const sipGrowth =
        r === 0
          ? monthlyAmount * 12 * y
          : monthlyAmount * 12 * (((1 + r) ** y - 1) / r);
      point[key] = Math.round(compoundedCorpus + sipGrowth);
    }
    points.push(point);
  }
  return points;
}

function formatCrore(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
  return `₹${num.toLocaleString("en-IN")}`;
}

export default function ProjectionPage() {
  const navigate = useNavigate();
  const { session, setSession } = useSession();
  const state = session;

  const { actor, isFetching } = useActor();
  const [projection, setProjection] = useState<SIPProjection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const svgRef = useRef<SVGSVGElement>(null);

  const monthly = state?.monthly || 5000;
  const tenure = state?.tenure || 10;
  const corpus = state?.corpus || 0;
  const name = state?.name || "Investor";
  const profileType = state?.riskProfile?.type || "Moderate";

  const expectedRate =
    profileType.toLowerCase() === "conservative"
      ? 7
      : profileType.toLowerCase() === "aggressive"
        ? 18
        : 12;

  const chartData = calculateGrowth(monthly, corpus, tenure, expectedRate);

  const riskColor =
    profileType.toLowerCase() === "conservative"
      ? "#2dd4bf"
      : profileType.toLowerCase() === "aggressive"
        ? "#f87171"
        : "#f59e0b";

  useEffect(() => {
    if (!actor || isFetching) return;

    let cancelled = false;

    const fetchProjection = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await actor.calculateSIPProjection(
          name,
          BigInt(Math.round(monthly)),
          BigInt(Math.round(tenure)),
          BigInt(Math.round(expectedRate * 10)),
        );
        if (!cancelled) setProjection(result);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Failed to calculate projection.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProjection();
    return () => {
      cancelled = true;
    };
  }, [actor, isFetching, name, monthly, tenure, expectedRate]);

  // SVG chart helpers
  const svgW = 600;
  const svgH = 260;
  const pad = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartW = svgW - pad.left - pad.right;
  const chartH = svgH - pad.top - pad.bottom;

  const maxY = Math.max(...chartData.map((d) => d.aggressive));
  const minY = Math.min(...chartData.map((d) => d.conservative));

  const toX = (year: number) => pad.left + (year / tenure) * chartW;
  const toY = (val: number) =>
    pad.top + chartH - ((val - minY) / (maxY - minY || 1)) * chartH;

  const makePath = (key: keyof Omit<ScenarioPoint, "year">) =>
    chartData
      .map(
        (d, i) =>
          `${i === 0 ? "M" : "L"} ${toX(d.year).toFixed(1)} ${toY(d[key]).toFixed(1)}`,
      )
      .join(" ");

  const makeArea = (key: keyof Omit<ScenarioPoint, "year">) => {
    const path = makePath(key);
    const lastX = toX(tenure).toFixed(1);
    const baseY = (pad.top + chartH).toFixed(1);
    return `${path} L ${lastX} ${baseY} L ${pad.left.toFixed(1)} ${baseY} Z`;
  };

  const activeKey =
    profileType.toLowerCase() === "conservative"
      ? "conservative"
      : profileType.toLowerCase() === "aggressive"
        ? "aggressive"
        : "moderate";

  const summaryData = projection
    ? [
        {
          label: "Total Invested",
          value: formatCrore(Number(projection.totalInvested)),
          color: "#888",
        },
        {
          label: "Projected Corpus",
          value: formatCrore(Number(projection.projectedCorpus)),
          color: riskColor,
        },
        {
          label: "Wealth Gain",
          value: formatCrore(Number(projection.wealthGain)),
          color: "#00c896",
        },
        {
          label: "Return Rate",
          value: `${(Number(projection.projectedReturnRate) / 10).toFixed(1)}% p.a.`,
          color: "#d4af37",
        },
      ]
    : [];

  const handleGenerateReport = () => {
    setSession({
      projection: projection
        ? {
            totalInvested: Number(projection.totalInvested),
            projectedCorpus: Number(projection.projectedCorpus),
            wealthGain: Number(projection.wealthGain),
            projectedReturnRate: Number(projection.projectedReturnRate),
          }
        : undefined,
      expectedRate,
    });
    navigate({ to: "/report" });
  };

  return (
    <PageLayout activeStep={4} backTo="/fund-recommendations" backLabel="Funds">
      <div className="max-w-4xl mx-auto px-6 py-10 md:py-16">
        {/* Header */}
        <div className="mb-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider mb-4"
            style={{
              background: "rgba(0,200,150,0.1)",
              border: "1px solid rgba(0,200,150,0.25)",
              color: "#00c896",
            }}
          >
            PHASE 5 — PROJECTION
          </div>
          <h1 className="section-headline text-3xl md:text-4xl text-white mb-3">
            Project Returns
          </h1>
          <p style={{ color: "#888", fontSize: "0.9rem" }}>
            Visualizing SIP growth over{" "}
            <span style={{ color: "#fff" }}>{tenure} years</span> for{" "}
            <span style={{ color: "#fff" }}>{name}</span> across three return
            scenarios.
          </p>
        </div>

        {/* SVG Chart */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl p-5 md:p-6 mb-8 overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-base font-bold text-white">
              SIP Corpus Growth
            </h2>
            <div className="flex items-center gap-4">
              {[
                {
                  key: "conservative",
                  label: "Conservative 7%",
                  color: "#2dd4bf",
                },
                { key: "moderate", label: "Moderate 12%", color: "#f59e0b" },
                {
                  key: "aggressive",
                  label: "Aggressive 18%",
                  color: "#f87171",
                },
              ].map((s) => (
                <div key={s.key} className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-0.5 rounded-full"
                    style={{
                      background: s.color,
                      opacity: s.key === activeKey ? 1 : 0.4,
                      height: s.key === activeKey ? "2px" : "1px",
                    }}
                  />
                  <span
                    className="text-xs"
                    style={{
                      color:
                        s.key === activeKey
                          ? "rgba(255,255,255,0.9)"
                          : "rgba(255,255,255,0.35)",
                    }}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <svg
            ref={svgRef}
            viewBox={`0 0 ${svgW} ${svgH}`}
            className="w-full"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="SIP corpus growth chart showing conservative, moderate, and aggressive scenarios"
          >
            <defs>
              {[
                { id: "grad-c", color: "#2dd4bf" },
                { id: "grad-m", color: "#f59e0b" },
                { id: "grad-a", color: "#f87171" },
              ].map(({ id, color }) => (
                <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity="0.15" />
                  <stop offset="100%" stopColor={color} stopOpacity="0.01" />
                </linearGradient>
              ))}
            </defs>

            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
              const y = pad.top + chartH * (1 - frac);
              const val = minY + (maxY - minY) * frac;
              return (
                <g key={frac}>
                  <line
                    x1={pad.left}
                    y1={y}
                    x2={pad.left + chartW}
                    y2={y}
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth={1}
                  />
                  <text
                    x={pad.left - 8}
                    y={y + 4}
                    textAnchor="end"
                    fontSize={9}
                    fill="rgba(255,255,255,0.3)"
                  >
                    {val >= 10000000
                      ? `${(val / 10000000).toFixed(1)}Cr`
                      : val >= 100000
                        ? `${(val / 100000).toFixed(0)}L`
                        : `${Math.round(val / 1000)}K`}
                  </text>
                </g>
              );
            })}

            {/* X axis labels */}
            {chartData
              .filter((_, i) => i % Math.ceil(tenure / 5) === 0 || i === tenure)
              .map((d) => (
                <text
                  key={d.year}
                  x={toX(d.year)}
                  y={pad.top + chartH + 20}
                  textAnchor="middle"
                  fontSize={9}
                  fill="rgba(255,255,255,0.3)"
                >
                  Yr{d.year}
                </text>
              ))}

            {/* Area fills */}
            <path
              d={makeArea("conservative")}
              fill="url(#grad-c)"
              opacity={activeKey === "conservative" ? 0.8 : 0.3}
            />
            <path
              d={makeArea("moderate")}
              fill="url(#grad-m)"
              opacity={activeKey === "moderate" ? 0.8 : 0.3}
            />
            <path
              d={makeArea("aggressive")}
              fill="url(#grad-a)"
              opacity={activeKey === "aggressive" ? 0.8 : 0.3}
            />

            {/* Lines */}
            <path
              d={makePath("conservative")}
              fill="none"
              stroke="#2dd4bf"
              strokeWidth={activeKey === "conservative" ? 2.5 : 1.5}
              strokeOpacity={activeKey === "conservative" ? 1 : 0.4}
              strokeLinejoin="round"
            />
            <path
              d={makePath("moderate")}
              fill="none"
              stroke="#f59e0b"
              strokeWidth={activeKey === "moderate" ? 2.5 : 1.5}
              strokeOpacity={activeKey === "moderate" ? 1 : 0.4}
              strokeLinejoin="round"
            />
            <path
              d={makePath("aggressive")}
              fill="none"
              stroke="#f87171"
              strokeWidth={activeKey === "aggressive" ? 2.5 : 1.5}
              strokeOpacity={activeKey === "aggressive" ? 1 : 0.4}
              strokeLinejoin="round"
            />

            {/* Goal line */}
            {state?.goal && state.goal > minY && state.goal < maxY && (
              <>
                <line
                  x1={pad.left}
                  y1={toY(state.goal)}
                  x2={pad.left + chartW}
                  y2={toY(state.goal)}
                  stroke="#d4af37"
                  strokeWidth={1.5}
                  strokeDasharray="5,4"
                  strokeOpacity={0.7}
                />
                <text
                  x={pad.left + chartW - 2}
                  y={toY(state.goal) - 5}
                  textAnchor="end"
                  fontSize={9}
                  fill="#d4af37"
                  opacity={0.8}
                >
                  Goal
                </text>
              </>
            )}
          </svg>
        </motion.div>

        {/* Summary cards */}
        {loading ? (
          <div
            data-ocid="projection.loading_state"
            className="flex items-center justify-center gap-3 py-12"
          >
            <Loader2
              className="w-6 h-6 animate-spin"
              style={{ color: "#00c896" }}
            />
            <span className="text-sm" style={{ color: "#555" }}>
              Calculating projection...
            </span>
          </div>
        ) : projection ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {summaryData.map((item) => (
              <div
                key={item.label}
                className="rounded-xl p-4 text-center"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className="text-xs mb-1.5" style={{ color: "#555" }}>
                  {item.label}
                </div>
                <div
                  className="text-lg font-bold"
                  style={{ color: item.color }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </motion.div>
        ) : error ? (
          <div
            data-ocid="projection.error_state"
            className="px-4 py-3 rounded-xl mb-8"
            style={{
              background: "rgba(255,107,107,0.1)",
              border: "1px solid rgba(255,107,107,0.3)",
              color: "#ff6b6b",
            }}
          >
            {error}
          </div>
        ) : null}

        {/* Generate Report button */}
        <button
          type="button"
          data-ocid="projection.generate_button"
          onClick={handleGenerateReport}
          disabled={loading}
          className="btn-primary w-full py-4 text-base font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <TrendingUp className="w-4 h-4" />
          Generate Recommendation Report
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </PageLayout>
  );
}
