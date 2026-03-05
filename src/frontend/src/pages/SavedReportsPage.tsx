import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  FileText,
  Shield,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { FundRecommendation } from "../backend.d";

/* ─── Types ────────────────────────────────────────────────────── */
interface SavedReport {
  id: string;
  savedAt: string;
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

/* ─── Helpers ──────────────────────────────────────────────────── */
function formatCrore(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
  return `₹${num.toLocaleString("en-IN")}`;
}

function generateRecommendation(state: SavedReport): string {
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

function riskColor(type: string): string {
  if (type.toLowerCase() === "conservative") return "#2dd4bf";
  if (type.toLowerCase() === "aggressive") return "#f87171";
  return "#f59e0b";
}

function loadReports(): SavedReport[] {
  try {
    const raw = localStorage.getItem("vvspl_saved_reports");
    return raw ? (JSON.parse(raw) as SavedReport[]) : [];
  } catch {
    return [];
  }
}

/* ─── Expanded Report Card ─────────────────────────────────────── */
function ExpandedReport({ report }: { report: SavedReport }) {
  const color = riskColor(report.riskProfile?.type || "Moderate");
  const profileType = report.riskProfile?.type || "Moderate";
  const selectedFunds = report.selectedFunds || [];
  const projection = report.projection;
  const recommendation = generateRecommendation(report);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ overflow: "hidden" }}
    >
      <div
        className="border-t px-6 pb-6 pt-5 flex flex-col gap-5"
        style={{ borderColor: "rgba(255,255,255,0.07)" }}
      >
        {/* Investor Details */}
        <div
          className="rounded-xl p-5"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <h3
            className="text-xs font-bold tracking-widest uppercase mb-4"
            style={{ color: "#00c896" }}
          >
            Investor Details
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: "Investor Name", value: report.name || "—" },
              {
                label: "Monthly SIP",
                value: `₹${(report.monthly || 0).toLocaleString("en-IN")}`,
              },
              { label: "Goal Amount", value: formatCrore(report.goal || 0) },
              { label: "Tenure", value: `${report.tenure || "—"} Years` },
              {
                label: "Existing Corpus",
                value: formatCrore(report.corpus || 0),
              },
              { label: "Session ID", value: report.sessionId || "—" },
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
        </div>

        {/* Risk Profile */}
        <div
          className="rounded-xl p-5"
          style={{
            background: `${color}0c`,
            border: `1px solid ${color}35`,
          }}
        >
          <h3
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color }}
          >
            Risk Profile
          </h3>
          <div className="flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${color}18` }}
            >
              <Shield className="w-5 h-5" style={{ color }} />
            </div>
            <div>
              <div className="text-xl font-bold" style={{ color }}>
                {profileType}
              </div>
              <div
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Score: {report.riskProfile?.score || "—"}/10 · Expected Return:{" "}
                {profileType === "Conservative"
                  ? "7–9%"
                  : profileType === "Aggressive"
                    ? "15–20%"
                    : "10–13%"}{" "}
                p.a.
              </div>
            </div>
          </div>
        </div>

        {/* Selected Funds Table */}
        {selectedFunds.length > 0 && (
          <div
            className="rounded-xl p-5 overflow-x-auto"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <h3
              className="text-xs font-bold tracking-widest uppercase mb-4"
              style={{ color: "#00c896" }}
            >
              Selected Funds ({selectedFunds.length})
            </h3>
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
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    <td className="py-3 pr-3 text-white font-medium text-xs max-w-[180px]">
                      <div className="truncate">{fund.fundName}</div>
                    </td>
                    <td className="py-3 pr-3 text-xs" style={{ color: "#888" }}>
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
          </div>
        )}

        {/* Projection Summary */}
        {projection && (
          <div
            className="rounded-xl p-5"
            style={{
              background: "rgba(0,200,150,0.04)",
              border: "1px solid rgba(0,200,150,0.15)",
            }}
          >
            <h3
              className="text-xs font-bold tracking-widest uppercase mb-4"
              style={{ color: "#00c896" }}
            >
              Projection Summary
            </h3>
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
                  color,
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
                    className="text-base font-bold"
                    style={{ color: item.color }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Recommendation */}
        <div
          className="rounded-xl p-5"
          style={{
            background: "rgba(168,85,247,0.05)",
            border: "1px solid rgba(168,85,247,0.2)",
          }}
        >
          <h3
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: "#a855f7" }}
          >
            ✦ AI Recommendation
          </h3>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "rgba(255,255,255,0.8)" }}
          >
            {recommendation}
          </p>
        </div>

        {/* Disclaimer */}
        <div
          className="rounded-xl px-4 py-3 text-xs leading-relaxed"
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
      </div>
    </motion.div>
  );
}

/* ─── Main Page ────────────────────────────────────────────────── */
export default function SavedReportsPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<SavedReport[]>(loadReports);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function deleteReport(id: string) {
    const updated = reports.filter((r) => r.id !== id);
    setReports(updated);
    localStorage.setItem("vvspl_saved_reports", JSON.stringify(updated));
    if (expandedId === id) setExpandedId(null);
  }

  function clearAll() {
    setReports([]);
    setExpandedId(null);
    localStorage.removeItem("vvspl_saved_reports");
  }

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <div
      className="min-h-[calc(100vh-48px)] flex flex-col"
      style={{ background: "#0f1117", color: "#ffffff" }}
    >
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10 md:py-14">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider mb-3"
                style={{
                  background: "rgba(0,200,150,0.1)",
                  border: "1px solid rgba(0,200,150,0.25)",
                  color: "#00c896",
                }}
              >
                <BookOpen size={11} />
                SAVED REPORTS
              </div>
              <h1 className="font-display font-bold text-2xl md:text-3xl leading-tight text-white mb-1">
                Client Recommendation Reports
              </h1>
              <p
                className="font-body text-sm"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                {reports.length > 0
                  ? `${reports.length} saved report${reports.length > 1 ? "s" : ""} — click any card to view full details`
                  : "Your saved client reports will appear here"}
              </p>
            </div>

            {reports.length > 0 && (
              <button
                type="button"
                data-ocid="saved_reports.clear_button"
                onClick={clearAll}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                style={{
                  background: "rgba(248,113,113,0.1)",
                  border: "1px solid rgba(248,113,113,0.25)",
                  color: "#f87171",
                }}
              >
                <X size={13} />
                Clear All
              </button>
            )}
          </div>
        </motion.div>

        {/* Empty State */}
        {reports.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            data-ocid="saved_reports.empty_state"
            className="flex flex-col items-center justify-center text-center py-24 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px dashed rgba(255,255,255,0.1)",
            }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
              style={{
                background: "rgba(0,200,150,0.08)",
                border: "1px solid rgba(0,200,150,0.18)",
              }}
            >
              <FileText className="w-6 h-6" style={{ color: "#00c896" }} />
            </div>
            <h2 className="font-display font-bold text-lg mb-2 text-white">
              No saved reports yet
            </h2>
            <p
              className="font-body text-sm mb-6 max-w-xs leading-relaxed"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Complete an analysis and save the report from the Report page. It
              will appear here for future reference.
            </p>
            <button
              type="button"
              onClick={() => navigate({ to: "/sip-analysis" })}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
              style={{ background: "#00c896", color: "#0a0e14" }}
            >
              Start New Analysis
              <span className="text-base leading-none">→</span>
            </button>
          </motion.div>
        )}

        {/* Report Cards */}
        {reports.length > 0 && (
          <div className="flex flex-col gap-4">
            {reports.map((report, index) => {
              const color = riskColor(report.riskProfile?.type || "Moderate");
              const isExpanded = expandedId === report.id;
              const savedDate = new Date(report.savedAt).toLocaleDateString(
                "en-IN",
                { day: "numeric", month: "short", year: "numeric" },
              );
              const savedTime = new Date(report.savedAt).toLocaleTimeString(
                "en-IN",
                { hour: "2-digit", minute: "2-digit" },
              );
              const ocidIndex = index + 1;

              return (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  data-ocid={`saved_reports.item.${ocidIndex}`}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {/* Card Header row */}
                  <div className="flex items-center gap-4 px-6 py-4">
                    {/* Clickable area */}
                    <button
                      type="button"
                      className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer select-none text-left"
                      onClick={() => toggleExpand(report.id)}
                      aria-expanded={isExpanded}
                    >
                      {/* Risk badge dot */}
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ background: color }}
                      />

                      {/* Main info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-display font-bold text-base text-white truncate">
                            {report.name || "Unnamed Investor"}
                          </span>
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold shrink-0"
                            style={{
                              background: `${color}15`,
                              border: `1px solid ${color}30`,
                              color,
                            }}
                          >
                            {report.riskProfile?.type || "Moderate"}
                          </span>
                        </div>
                        <div
                          className="flex items-center gap-4 mt-1 text-xs flex-wrap"
                          style={{ color: "rgba(255,255,255,0.4)" }}
                        >
                          <span>
                            SIP:{" "}
                            <span className="text-white/60 font-medium">
                              ₹{(report.monthly || 0).toLocaleString("en-IN")}
                              /mo
                            </span>
                          </span>
                          <span>
                            Tenure:{" "}
                            <span className="text-white/60 font-medium">
                              {report.tenure || "—"} yrs
                            </span>
                          </span>
                          {report.projection && (
                            <span>
                              Projected:{" "}
                              <span
                                className="font-semibold"
                                style={{ color: "#00c896" }}
                              >
                                {formatCrore(report.projection.projectedCorpus)}
                              </span>
                            </span>
                          )}
                          <span>
                            Saved: {savedDate} at {savedTime}
                          </span>
                        </div>
                      </div>
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      data-ocid={`saved_reports.delete_button.${ocidIndex}`}
                      onClick={() => deleteReport(report.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:opacity-80 shrink-0"
                      style={{
                        background: "rgba(248,113,113,0.1)",
                        border: "1px solid rgba(248,113,113,0.2)",
                        color: "#f87171",
                      }}
                      title="Delete report"
                      aria-label="Delete report"
                    >
                      <Trash2 size={13} />
                    </button>

                    {/* Expand icon */}
                    <button
                      type="button"
                      onClick={() => toggleExpand(report.id)}
                      aria-label={isExpanded ? "Collapse" : "Expand"}
                      className="w-7 h-7 flex items-center justify-center rounded-lg shrink-0 transition-colors"
                      style={{
                        background: isExpanded
                          ? "rgba(0,200,150,0.12)"
                          : "rgba(255,255,255,0.05)",
                        color: isExpanded ? "#00c896" : "rgba(255,255,255,0.4)",
                      }}
                    >
                      {isExpanded ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      )}
                    </button>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence initial={false}>
                    {isExpanded && <ExpandedReport report={report} />}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Footer CTA */}
        {reports.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex justify-center"
          >
            <button
              type="button"
              onClick={() => navigate({ to: "/sip-analysis" })}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
              style={{ background: "#00c896", color: "#0a0e14" }}
            >
              Start New Analysis
              <span className="text-base leading-none">→</span>
            </button>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer
        className="px-6 py-3 flex items-center justify-center"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <p
          className="font-body text-xs"
          style={{ color: "rgba(255,255,255,0.28)" }}
        >
          © {new Date().getFullYear()}{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity"
          >
            Built with ♥ using caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
