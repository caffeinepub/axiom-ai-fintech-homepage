import { useNavigate } from "@tanstack/react-router";
import {
  ChevronRight,
  Loader2,
  Shield,
  Target,
  TrendingUp,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useSession } from "../App";
import PageLayout from "../components/PageLayout";
import { useActor } from "../hooks/useActor";

interface Question {
  id: number;
  text: string;
  options: { label: string; value: number }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What is your primary investment goal?",
    options: [
      { label: "Preserve capital — protect what I have", value: 1 },
      { label: "Regular income from investments", value: 3 },
      { label: "Moderate growth over time", value: 5 },
      { label: "High growth, willing to take risks", value: 7 },
      { label: "Maximum wealth creation", value: 10 },
    ],
  },
  {
    id: 2,
    text: "How would you react to a 20% drop in your portfolio?",
    options: [
      { label: "Panic and sell everything immediately", value: 1 },
      { label: "Sell some to cut losses", value: 3 },
      { label: "Hold and wait for recovery", value: 5 },
      { label: "Buy a little more at lower prices", value: 7 },
      { label: "Invest heavily — it's a buying opportunity", value: 10 },
    ],
  },
  {
    id: 3,
    text: "What is your investment time horizon?",
    options: [
      { label: "Less than 1 year", value: 1 },
      { label: "1 to 3 years", value: 3 },
      { label: "3 to 5 years", value: 5 },
      { label: "5 to 10 years", value: 7 },
      { label: "More than 10 years", value: 10 },
    ],
  },
  {
    id: 4,
    text: "How much of your savings can you afford to put at risk?",
    options: [
      { label: "None — I cannot afford any loss", value: 1 },
      { label: "Less than 10% of my savings", value: 3 },
      { label: "10% to 25% of my savings", value: 5 },
      { label: "25% to 50% of my savings", value: 7 },
      { label: "More than 50% of my savings", value: 10 },
    ],
  },
  {
    id: 5,
    text: "How would you describe your income stability?",
    options: [
      { label: "Very unstable — irregular freelance income", value: 1 },
      { label: "Unstable — variable income", value: 3 },
      { label: "Moderate — mostly stable", value: 5 },
      { label: "Stable — salaried with predictable income", value: 7 },
      { label: "Very stable — strong, secure income", value: 10 },
    ],
  },
];

function getRiskInfo(score: number) {
  if (score <= 3)
    return {
      type: "Conservative",
      color: "#2dd4bf",
      glow: "rgba(45,212,191,0.25)",
      border: "rgba(45,212,191,0.35)",
      bg: "rgba(45,212,191,0.08)",
      description:
        "You prefer capital protection over high returns. Debt and hybrid funds with low volatility are ideal for your profile.",
      icon: Shield,
      expectedReturn: "7–9% p.a.",
    };
  if (score <= 6)
    return {
      type: "Moderate",
      color: "#f59e0b",
      glow: "rgba(245,158,11,0.25)",
      border: "rgba(245,158,11,0.35)",
      bg: "rgba(245,158,11,0.08)",
      description:
        "You seek a balance between growth and stability. Balanced and large-cap equity funds suit your profile well.",
      icon: Target,
      expectedReturn: "10–13% p.a.",
    };
  return {
    type: "Aggressive",
    color: "#f87171",
    glow: "rgba(248,113,113,0.25)",
    border: "rgba(248,113,113,0.35)",
    bg: "rgba(248,113,113,0.08)",
    description:
      "You're willing to accept high risk for maximum returns. Small-cap and sectoral equity funds match your profile.",
    icon: TrendingUp,
    expectedReturn: "15–20% p.a.",
  };
}

export default function RiskProfilePage() {
  const navigate = useNavigate();
  const { session, setSession } = useSession();
  const state = session;

  const { actor, isFetching } = useActor();

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ type: string; score: number } | null>(
    null,
  );

  const allAnswered = QUESTIONS.every((q) => answers[q.id] !== undefined);

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const avgScore = allAnswered
    ? Math.round(
        Object.values(answers).reduce((a, b) => a + b, 0) / QUESTIONS.length,
      )
    : 0;

  const handleSubmit = async () => {
    if (!actor || !allAnswered) return;

    const name = state?.name || "Investor";
    setError("");
    setSubmitting(true);

    try {
      const profile = await actor.submitRiskProfile(name, BigInt(avgScore));
      setResult({
        type: profile.profileType,
        score: Number(profile.riskScore),
      });
    } catch (err) {
      console.error(err);
      setError("Failed to submit risk profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleContinue = () => {
    if (!result) return;
    setSession({ riskProfile: result });
    navigate({ to: "/fund-recommendations" });
  };

  const riskInfo = result ? getRiskInfo(result.score) : null;

  return (
    <PageLayout activeStep={2} backTo="/sip-analysis" backLabel="SIP Details">
      <div className="max-w-2xl mx-auto px-6 py-10 md:py-16">
        {/* Header */}
        <div className="mb-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider mb-4"
            style={{
              background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.25)",
              color: "#f59e0b",
            }}
          >
            PHASE 3 — RISK PROFILE
          </div>
          <h1 className="section-headline text-3xl md:text-4xl text-white mb-3">
            Match Risk Profile
          </h1>
          <p style={{ color: "#888", fontSize: "0.9rem", lineHeight: "1.6" }}>
            Answer 5 questions honestly. The AI engine will calculate your risk
            score and match you to the appropriate fund category.
          </p>
          {state?.name && (
            <div
              className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
              style={{
                background: "rgba(0,200,150,0.08)",
                border: "1px solid rgba(0,200,150,0.2)",
              }}
            >
              <span style={{ color: "#00c896" }}>👤</span>
              <span style={{ color: "#00c896" }}>{state.name}</span>
            </div>
          )}
        </div>

        {/* Questions */}
        {!result && (
          <div className="flex flex-col gap-8">
            {QUESTIONS.map((q, i) => {
              const selected = answers[q.id];
              return (
                <motion.div
                  key={q.id}
                  data-ocid={`risk.question.item.${i + 1}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="rounded-2xl p-5 md:p-6"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: selected
                      ? "1px solid rgba(0,200,150,0.3)"
                      : "1px solid rgba(255,255,255,0.08)",
                    transition: "border-color 0.3s ease",
                  }}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={
                        selected
                          ? { background: "#00c896", color: "#000" }
                          : {
                              background: "rgba(255,255,255,0.08)",
                              color: "rgba(255,255,255,0.5)",
                            }
                      }
                    >
                      {i + 1}
                    </div>
                    <h3 className="text-sm md:text-base font-semibold text-white leading-snug">
                      {q.text}
                    </h3>
                  </div>

                  <div className="flex flex-col gap-2">
                    {q.options.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleAnswer(q.id, opt.value)}
                        className="text-left px-4 py-3 rounded-xl text-sm transition-all duration-200"
                        style={
                          selected === opt.value
                            ? {
                                background: "rgba(0,200,150,0.12)",
                                border: "1px solid rgba(0,200,150,0.4)",
                                color: "#ffffff",
                                boxShadow: "0 0 12px rgba(0,200,150,0.15)",
                              }
                            : {
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                color: "rgba(255,255,255,0.65)",
                              }
                        }
                        onMouseEnter={(e) => {
                          if (selected !== opt.value) {
                            e.currentTarget.style.background =
                              "rgba(255,255,255,0.06)";
                            e.currentTarget.style.borderColor =
                              "rgba(255,255,255,0.15)";
                            e.currentTarget.style.color =
                              "rgba(255,255,255,0.9)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selected !== opt.value) {
                            e.currentTarget.style.background =
                              "rgba(255,255,255,0.03)";
                            e.currentTarget.style.borderColor =
                              "rgba(255,255,255,0.08)";
                            e.currentTarget.style.color =
                              "rgba(255,255,255,0.65)";
                          }
                        }}
                      >
                        <span className="mr-2 text-xs opacity-50">
                          {String.fromCharCode(65 + q.options.indexOf(opt))}.
                        </span>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              );
            })}

            {/* Progress indicator */}
            <div className="flex items-center gap-3">
              <div
                className="flex-1 h-1.5 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(Object.keys(answers).length / QUESTIONS.length) * 100}%`,
                    background: "linear-gradient(90deg, #00c896, #d4af37)",
                  }}
                />
              </div>
              <span className="text-xs shrink-0" style={{ color: "#555" }}>
                {Object.keys(answers).length}/{QUESTIONS.length} answered
              </span>
            </div>

            {/* Error */}
            {error && (
              <div
                data-ocid="risk.error_state"
                className="px-4 py-3 rounded-xl text-sm"
                style={{
                  background: "rgba(255,107,107,0.1)",
                  border: "1px solid rgba(255,107,107,0.3)",
                  color: "#ff6b6b",
                }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="button"
              data-ocid="risk.submit_button"
              onClick={handleSubmit}
              disabled={!allAnswered || submitting || isFetching || !actor}
              className="btn-primary py-4 text-base font-bold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Calculating Risk Score...
                </>
              ) : (
                <>
                  Calculate My Risk Profile
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Result Card */}
        <AnimatePresence>
          {result && riskInfo && (
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
              className="flex flex-col gap-6"
            >
              {/* Risk card */}
              <div
                className="rounded-2xl p-6 md:p-8"
                style={{
                  background: riskInfo.bg,
                  border: `1px solid ${riskInfo.border}`,
                  boxShadow: `0 12px 40px ${riskInfo.glow}`,
                }}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                    style={{
                      background: `${riskInfo.color}22`,
                      border: `1px solid ${riskInfo.border}`,
                    }}
                  >
                    <riskInfo.icon
                      className="w-7 h-7"
                      style={{ color: riskInfo.color }}
                    />
                  </div>
                  <div>
                    <div
                      className="text-xs font-semibold tracking-wider uppercase mb-1"
                      style={{ color: riskInfo.color }}
                    >
                      Your Risk Profile
                    </div>
                    <h2 className="section-headline text-3xl text-white">
                      {result.type}
                    </h2>
                    <div
                      className="text-sm mt-1"
                      style={{ color: riskInfo.color }}
                    >
                      Risk Score: {result.score}/10 · Expected:{" "}
                      {riskInfo.expectedReturn}
                    </div>
                  </div>
                </div>

                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.75)" }}
                >
                  {riskInfo.description}
                </p>

                {/* Score bars */}
                <div className="mt-6 flex flex-col gap-2">
                  {[
                    {
                      label: "Conservative",
                      range: "1–3",
                      active: result.score <= 3,
                    },
                    {
                      label: "Moderate",
                      range: "4–6",
                      active: result.score >= 4 && result.score <= 6,
                    },
                    {
                      label: "Aggressive",
                      range: "7–10",
                      active: result.score >= 7,
                    },
                  ].map((tier) => (
                    <div key={tier.label} className="flex items-center gap-3">
                      <span
                        className="text-xs w-28 shrink-0"
                        style={{
                          color: tier.active
                            ? riskInfo.color
                            : "rgba(255,255,255,0.35)",
                        }}
                      >
                        {tier.label} ({tier.range})
                      </span>
                      <div
                        className="flex-1 h-1.5 rounded-full"
                        style={{
                          background: tier.active
                            ? riskInfo.color
                            : "rgba(255,255,255,0.1)",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Continue button */}
              <button
                type="button"
                onClick={handleContinue}
                className="btn-primary py-4 text-base font-bold flex items-center justify-center gap-2"
              >
                View Recommended Funds
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
}
