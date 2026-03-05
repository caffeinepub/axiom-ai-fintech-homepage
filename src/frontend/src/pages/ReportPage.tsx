import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Home,
  Printer,
  RefreshCw,
  Save,
  Shield,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useSession } from "../App";
import type { FundRecommendation } from "../backend.d";
import PageLayout from "../components/PageLayout";

interface LocationState {
  sessionId?: string;
  name?: string;
  monthly?: number;
  goal?: number;
  tenure?: number;
  corpus?: number;
  yearly?: number;
  riskProfile?: { type: string; score: number };
  selectedFunds?: FundRecommendation[];
  projection?: {
    totalInvested: number;
    projectedCorpus: number;
    wealthGain: number;
    projectedReturnRate: number;
  };
  expectedRate?: number;
}

function formatCrore(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
  return `₹${num.toLocaleString("en-IN")}`;
}

function generateRecommendation(state: LocationState): string {
  const name = state.name || "the investor";
  const profile = state.riskProfile?.type || "Moderate";
  const monthly = state.monthly || 0;
  const tenure = state.tenure || 10;
  const corpus = state.projection?.projectedCorpus || 0;
  const rate = state.expectedRate || 12;
  const funds = state.selectedFunds || [];

  const topFund = funds[0]?.fundName || "diversified mutual funds";
  const cagr = funds[0] ? Number(funds[0].cagr).toFixed(1) : rate.toString();

  return `Based on our comprehensive AI analysis, ${name} is classified as a ${profile} investor with a risk score of ${state.riskProfile?.score || 5}/10. With a monthly SIP of ₹${monthly.toLocaleString("en-IN")} over ${tenure} years, the projected corpus is ${formatCrore(corpus)} at an expected CAGR of ${rate}% per annum. We recommend a ${profile.toLowerCase()}-oriented portfolio led by ${topFund} (CAGR: ${cagr}%), which aligns with the investor's goals. The selected funds have been filtered using AI-driven analysis of 10,000+ data points, optimized for the ${profile.toLowerCase()} risk appetite. Regular SIP discipline combined with periodic rebalancing is advised for optimal long-term performance.`;
}

export default function ReportPage() {
  const navigate = useNavigate();
  const { session } = useSession();
  const state: LocationState | null = session?.name ? session : null;

  const name = state?.name || "Investor";
  const monthly = state?.monthly || 0;
  const goal = state?.goal || 0;
  const tenure = state?.tenure || 10;
  const corpus = state?.corpus || 0;
  const profileType = state?.riskProfile?.type || "Moderate";
  const selectedFunds = state?.selectedFunds || [];
  const projection = state?.projection;

  const riskColor =
    profileType.toLowerCase() === "conservative"
      ? "#2dd4bf"
      : profileType.toLowerCase() === "aggressive"
        ? "#f87171"
        : "#f59e0b";

  const recommendation = state ? generateRecommendation(state) : "";

  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  function saveReport() {
    if (!state?.name) {
      toast.error("No active report to save");
      return;
    }
    try {
      const existing = localStorage.getItem("vvspl_saved_reports");
      const reports = existing ? JSON.parse(existing) : [];
      const entry = {
        id: Date.now().toString(),
        savedAt: new Date().toISOString(),
        ...session,
      };
      reports.push(entry);
      localStorage.setItem("vvspl_saved_reports", JSON.stringify(reports));
      toast.success("Report saved successfully!");
    } catch {
      toast.error("Failed to save report. Please try again.");
    }
  }

  return (
    <PageLayout activeStep={5} backTo="/projection" backLabel="Projections">
      <div className="max-w-4xl mx-auto px-6 py-10 md:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider"
              style={{
                background: "rgba(0,200,150,0.1)",
                border: "1px solid rgba(0,200,150,0.25)",
                color: "#00c896",
              }}
            >
              <CheckCircle2 className="w-3 h-3" />
              REPORT READY
            </div>
            <span className="text-xs" style={{ color: "#555" }}>
              Generated: {today}
            </span>
          </div>
          <h1 className="section-headline text-3xl md:text-4xl text-white mb-2">
            SIP Recommendation Report
          </h1>
          <p style={{ color: "#888", fontSize: "0.9rem" }}>
            Comprehensive AI-generated investment analysis for{" "}
            <span style={{ color: "#fff" }}>{name}</span>
          </p>
        </motion.div>

        {/* Report content - printable */}
        <div id="report-content">
          {/* 1. Investor Details */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-2xl p-6 mb-5"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <h2
              className="text-xs font-bold tracking-wider uppercase mb-4"
              style={{ color: "#00c896" }}
            >
              Investor Details
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Investor Name", value: name },
                {
                  label: "Monthly SIP",
                  value: `₹${monthly.toLocaleString("en-IN")}`,
                },
                { label: "Goal Amount", value: formatCrore(goal) },
                { label: "Tenure", value: `${tenure} Years` },
                { label: "Existing Corpus", value: formatCrore(corpus) },
                {
                  label: "Session ID",
                  value: state?.sessionId || "—",
                },
              ].map((item) => (
                <div key={item.label}>
                  <div
                    className="text-xs mb-1"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    {item.label}
                  </div>
                  <div className="text-sm font-semibold text-white truncate">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 2. Risk Profile */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="rounded-2xl p-6 mb-5"
            style={{
              background: `${riskColor}0c`,
              border: `1px solid ${riskColor}35`,
            }}
          >
            <h2
              className="text-xs font-bold tracking-wider uppercase mb-3"
              style={{ color: riskColor }}
            >
              Risk Profile
            </h2>
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: `${riskColor}18` }}
              >
                <Shield className="w-6 h-6" style={{ color: riskColor }} />
              </div>
              <div>
                <div
                  className="text-2xl font-bold"
                  style={{ color: riskColor }}
                >
                  {profileType}
                </div>
                <div
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  Score: {state?.riskProfile?.score || "—"}/10 · Expected
                  Return:{" "}
                  {profileType === "Conservative"
                    ? "7–9%"
                    : profileType === "Aggressive"
                      ? "15–20%"
                      : "10–13%"}{" "}
                  p.a.
                </div>
              </div>
            </div>
          </motion.div>

          {/* 3. Selected Funds Table */}
          {selectedFunds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="rounded-2xl p-6 mb-5 overflow-x-auto"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <h2
                className="text-xs font-bold tracking-wider uppercase mb-4"
                style={{ color: "#00c896" }}
              >
                Selected Funds ({selectedFunds.length})
              </h2>
              <table className="w-full text-sm min-w-[480px]">
                <thead>
                  <tr
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    {["Fund Name", "Category", "CAGR", "Sharpe", "Risk"].map(
                      (h) => (
                        <th
                          key={h}
                          className="pb-3 text-left text-xs font-semibold"
                          style={{ color: "rgba(255,255,255,0.4)" }}
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {selectedFunds.map((fund, i) => (
                    <tr
                      key={`${fund.fundName}-${i}`}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      <td className="py-3 pr-3 text-white font-medium text-xs max-w-[180px]">
                        <div className="truncate">{fund.fundName}</div>
                      </td>
                      <td
                        className="py-3 pr-3 text-xs"
                        style={{ color: "#888" }}
                      >
                        {fund.category}
                      </td>
                      <td
                        className="py-3 pr-3 text-sm font-bold"
                        style={{ color: "#00c896" }}
                      >
                        {Number(fund.cagr).toFixed(1)}%
                      </td>
                      <td
                        className="py-3 pr-3 text-sm font-bold"
                        style={{ color: "#d4af37" }}
                      >
                        {(Number(fund.sharpeRatio) / 10).toFixed(2)}
                      </td>
                      <td className="py-3 text-xs" style={{ color: "#888" }}>
                        {fund.riskLevel}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {/* 4. Projection Summary */}
          {projection && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="rounded-2xl p-6 mb-5"
              style={{
                background: "rgba(0,200,150,0.04)",
                border: "1px solid rgba(0,200,150,0.15)",
              }}
            >
              <h2
                className="text-xs font-bold tracking-wider uppercase mb-4"
                style={{ color: "#00c896" }}
              >
                Projection Summary
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    label: "Total Invested",
                    value: formatCrore(projection.totalInvested),
                    color: "#888",
                  },
                  {
                    label: "Projected Corpus",
                    value: formatCrore(projection.projectedCorpus),
                    color: riskColor,
                  },
                  {
                    label: "Wealth Gain",
                    value: formatCrore(projection.wealthGain),
                    color: "#00c896",
                  },
                  {
                    label: "Return Rate",
                    value: `${(projection.projectedReturnRate / 10).toFixed(1)}%`,
                    color: "#d4af37",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="text-center p-3 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    <div
                      className="text-xs mb-1"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
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
              </div>
            </motion.div>
          )}

          {/* 5. AI Recommendation */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="rounded-2xl p-6 mb-8"
            style={{
              background: "rgba(168,85,247,0.05)",
              border: "1px solid rgba(168,85,247,0.2)",
            }}
          >
            <h2
              className="text-xs font-bold tracking-wider uppercase mb-3"
              style={{ color: "#a855f7" }}
            >
              ✦ AI Recommendation
            </h2>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              {recommendation}
            </p>
          </motion.div>
        </div>

        {/* Disclaimer */}
        <div
          className="rounded-xl px-4 py-3 mb-8 text-xs leading-relaxed"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.35)",
          }}
        >
          <span style={{ color: "#d4af37" }}>Disclaimer:</span> This report is
          generated by AI and is for informational purposes only. Mutual fund
          investments are subject to market risks. Past performance is not
          indicative of future results. Please consult a SEBI-registered
          investment advisor before making investment decisions.
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            data-ocid="report.print_button"
            onClick={() => window.print()}
            className="btn-primary flex items-center gap-2 px-6 py-3 text-sm font-bold"
          >
            <Printer className="w-4 h-4" />
            Print Report
          </button>

          <button
            type="button"
            data-ocid="report.save_button"
            onClick={saveReport}
            className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg transition-all hover:opacity-90 active:scale-95"
            style={{
              background: "rgba(0,200,150,0.12)",
              border: "1px solid rgba(0,200,150,0.3)",
              color: "#00c896",
            }}
          >
            <Save className="w-4 h-4" />
            Save Report
          </button>

          <button
            type="button"
            data-ocid="report.new_analysis_button"
            onClick={() => navigate({ to: "/sip-analysis" })}
            className="btn-ghost flex items-center gap-2 px-6 py-3 text-sm font-semibold"
          >
            <RefreshCw className="w-4 h-4" />
            New Analysis
          </button>

          <button
            type="button"
            data-ocid="report.home_button"
            onClick={() => navigate({ to: "/" })}
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors rounded-lg"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            <Home className="w-4 h-4" />
            Back to Home
          </button>
        </div>

        {/* Back nav bottom */}
        <div
          className="mt-8 pt-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center gap-1.5 text-xs transition-colors"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Projections
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
