import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowUpDown,
  ChevronRight,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useSession } from "../App";
import type { FundRecommendation } from "../backend.d";
import PageLayout from "../components/PageLayout";
import { useActor } from "../hooks/useActor";

type SortBy = "cagr" | "sharpe";

function getRiskBadge(riskLevel: string) {
  const level = riskLevel.toLowerCase();
  if (level.includes("low") || level.includes("conservative"))
    return {
      color: "#2dd4bf",
      bg: "rgba(45,212,191,0.1)",
      border: "rgba(45,212,191,0.3)",
    };
  if (level.includes("high") || level.includes("aggressive"))
    return {
      color: "#f87171",
      bg: "rgba(248,113,113,0.1)",
      border: "rgba(248,113,113,0.3)",
    };
  return {
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.3)",
  };
}

export default function FundRecommendationsPage() {
  const navigate = useNavigate();
  const { session, setSession } = useSession();
  const state = session;

  const { actor, isFetching } = useActor();
  const [funds, setFunds] = useState<FundRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("cagr");
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const profileType = state?.riskProfile?.type || "Moderate";

  useEffect(() => {
    if (!actor || isFetching) return;

    let cancelled = false;

    const fetchFunds = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await actor.getFundRecommendations(profileType);
        if (!cancelled) {
          setFunds(result);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Failed to load fund recommendations.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchFunds();
    return () => {
      cancelled = true;
    };
  }, [actor, isFetching, profileType]);

  const sortedFunds = [...funds].sort((a, b) => {
    if (sortBy === "cagr") return Number(b.cagr) - Number(a.cagr);
    return Number(b.sharpeRatio) - Number(a.sharpeRatio);
  });

  const toggleSelect = (idx: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const selectAll = () => {
    setSelected(new Set(sortedFunds.map((_, i) => i)));
  };

  const handleContinue = () => {
    const selectedFunds =
      selected.size > 0
        ? sortedFunds.filter((_, i) => selected.has(i))
        : sortedFunds;

    setSession({ selectedFunds });
    navigate({ to: "/projection" });
  };

  const riskColor =
    profileType.toLowerCase() === "conservative"
      ? "#2dd4bf"
      : profileType.toLowerCase() === "aggressive"
        ? "#f87171"
        : "#f59e0b";

  return (
    <PageLayout activeStep={3} backTo="/risk-profile" backLabel="Risk Profile">
      <div className="max-w-4xl mx-auto px-6 py-10 md:py-16">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider"
                style={{
                  background: "rgba(168,85,247,0.1)",
                  border: "1px solid rgba(168,85,247,0.25)",
                  color: "#a855f7",
                }}
              >
                PHASE 4 — FILTER FUNDS
              </div>
              {/* Risk badge */}
              <div
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  background: `${riskColor}18`,
                  border: `1px solid ${riskColor}50`,
                  color: riskColor,
                }}
              >
                {profileType}
              </div>
            </div>
            <h1 className="section-headline text-3xl md:text-4xl text-white">
              Filter Best Funds
            </h1>
            <p className="mt-2 text-sm" style={{ color: "#888" }}>
              AI-filtered top funds matching your{" "}
              <span style={{ color: riskColor }}>
                {profileType.toLowerCase()}
              </span>{" "}
              risk profile. Select funds to include in your projection.
            </p>
          </div>

          {/* Sort control */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs" style={{ color: "#555" }}>
              Sort:
            </span>
            <button
              type="button"
              data-ocid="funds.sort_button"
              onClick={() =>
                setSortBy((s) => (s === "cagr" ? "sharpe" : "cagr"))
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#00c896",
              }}
            >
              <ArrowUpDown className="w-3 h-3" />
              By {sortBy === "cagr" ? "CAGR" : "Sharpe"}
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div
            data-ocid="funds.loading_state"
            className="flex flex-col items-center gap-4 py-20"
          >
            <Loader2
              className="w-8 h-8 animate-spin"
              style={{ color: "#00c896" }}
            />
            <p className="text-sm" style={{ color: "#555" }}>
              AI is filtering best funds for your profile...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            data-ocid="funds.error_state"
            className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6"
            style={{
              background: "rgba(255,107,107,0.1)",
              border: "1px solid rgba(255,107,107,0.3)",
            }}
          >
            <AlertCircle
              className="w-4 h-4 shrink-0"
              style={{ color: "#ff6b6b" }}
            />
            <span className="text-sm" style={{ color: "#ff6b6b" }}>
              {error}
            </span>
          </div>
        )}

        {/* Fund Grid */}
        {!loading && funds.length > 0 && (
          <>
            {/* Select all */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs" style={{ color: "#555" }}>
                {selected.size === 0
                  ? "All funds will be included in projection"
                  : `${selected.size} fund${selected.size > 1 ? "s" : ""} selected`}
              </p>
              <button
                type="button"
                onClick={selectAll}
                className="text-xs font-medium transition-colors"
                style={{ color: "#00c896" }}
              >
                Select All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {sortedFunds.map((fund, i) => {
                const cagr = Number(fund.cagr);
                const sharpe = Number(fund.sharpeRatio) / 10;
                const riskScore = Number(fund.riskScore);
                const isSelected = selected.has(i);
                const badge = getRiskBadge(fund.riskLevel);

                return (
                  <motion.div
                    key={`${fund.fundName}-${i}`}
                    data-ocid={`funds.item.${i + 1}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="rounded-2xl p-5 flex flex-col gap-3 cursor-pointer transition-all duration-200"
                    onClick={() => toggleSelect(i)}
                    style={{
                      background: isSelected
                        ? "rgba(0,200,150,0.08)"
                        : "rgba(255,255,255,0.03)",
                      border: isSelected
                        ? "1px solid rgba(0,200,150,0.4)"
                        : "1px solid rgba(255,255,255,0.08)",
                      boxShadow: isSelected
                        ? "0 0 20px rgba(0,200,150,0.12)"
                        : "none",
                    }}
                  >
                    {/* Fund name + category */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div
                          className="text-xs font-semibold tracking-wider uppercase truncate mb-1"
                          style={{ color: "#555" }}
                        >
                          {fund.category}
                        </div>
                        <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">
                          {fund.fundName}
                        </h3>
                      </div>
                      {/* Selected checkbox */}
                      <div
                        className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center mt-0.5"
                        style={
                          isSelected
                            ? { background: "#00c896" }
                            : {
                                background: "rgba(255,255,255,0.08)",
                                border: "1px solid rgba(255,255,255,0.15)",
                              }
                        }
                      >
                        {isSelected && (
                          <svg
                            viewBox="0 0 10 8"
                            className="w-3 h-3"
                            fill="none"
                            role="img"
                            aria-label="Selected"
                          >
                            <path
                              d="M1 4L3.5 6.5L9 1"
                              stroke="#000"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-2">
                      <div
                        className="rounded-lg px-3 py-2"
                        style={{ background: "rgba(0,200,150,0.06)" }}
                      >
                        <div className="text-xs" style={{ color: "#555" }}>
                          CAGR
                        </div>
                        <div
                          className="text-base font-bold"
                          style={{ color: "#00c896" }}
                        >
                          {cagr.toFixed(1)}%
                        </div>
                      </div>
                      <div
                        className="rounded-lg px-3 py-2"
                        style={{ background: "rgba(212,175,55,0.06)" }}
                      >
                        <div className="text-xs" style={{ color: "#555" }}>
                          Sharpe
                        </div>
                        <div
                          className="text-base font-bold"
                          style={{ color: "#d4af37" }}
                        >
                          {sharpe.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Risk score bar */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <div
                          className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{
                            background: badge.bg,
                            border: `1px solid ${badge.border}`,
                            color: badge.color,
                          }}
                        >
                          {fund.riskLevel}
                        </div>
                        <span
                          className="text-xs"
                          style={{ color: "rgba(255,255,255,0.4)" }}
                        >
                          Risk: {riskScore}/10
                        </span>
                      </div>
                      <div
                        className="h-1 rounded-full overflow-hidden"
                        style={{ background: "rgba(255,255,255,0.08)" }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${riskScore * 10}%`,
                            background: badge.color,
                          }}
                        />
                      </div>
                    </div>

                    {/* Select button */}
                    <button
                      type="button"
                      data-ocid="funds.select_button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelect(i);
                      }}
                      className="text-xs font-semibold py-2 rounded-lg transition-all duration-200 text-center"
                      style={
                        isSelected
                          ? {
                              background: "rgba(0,200,150,0.15)",
                              border: "1px solid rgba(0,200,150,0.35)",
                              color: "#00c896",
                            }
                          : {
                              background: "rgba(255,255,255,0.04)",
                              border: "1px solid rgba(255,255,255,0.1)",
                              color: "rgba(255,255,255,0.5)",
                            }
                      }
                    >
                      {isSelected ? "✓ Selected" : "Select Fund"}
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* Continue button */}
            <button
              type="button"
              onClick={handleContinue}
              className="btn-primary w-full py-4 text-base font-bold flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              View Return Projections
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Empty state */}
        {!loading && funds.length === 0 && !error && (
          <div data-ocid="funds.empty_state" className="text-center py-20">
            <p className="text-base" style={{ color: "#555" }}>
              No funds found for profile: {profileType}
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
