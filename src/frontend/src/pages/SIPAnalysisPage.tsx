import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, Calculator, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "../App";
import PageLayout from "../components/PageLayout";
import { useActor } from "../hooks/useActor";

export default function SIPAnalysisPage() {
  const navigate = useNavigate();
  const { setSession } = useSession();
  const { actor, isFetching } = useActor();

  const [name, setName] = useState("");
  const [monthly, setMonthly] = useState("");
  const [goal, setGoal] = useState("");
  const [tenure, setTenure] = useState("");
  const [corpus, setCorpus] = useState("");
  const [yearly, setYearly] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Auto-calculate yearly from monthly
  useEffect(() => {
    const m = Number.parseFloat(monthly);
    if (!Number.isNaN(m) && m > 0) {
      setYearly(String(Math.round(m * 12)));
    } else if (!monthly) {
      setYearly("");
    }
  }, [monthly]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;

    setError("");

    const monthlyNum = Number.parseFloat(monthly);
    const goalNum = Number.parseFloat(goal);
    const tenureNum = Number.parseFloat(tenure);
    const corpusNum = Number.parseFloat(corpus) || 0;
    const yearlyNum = Number.parseFloat(yearly) || monthlyNum * 12;

    if (!name.trim()) {
      setError("Please enter investor name.");
      return;
    }
    if (Number.isNaN(monthlyNum) || monthlyNum <= 0) {
      setError("Please enter a valid monthly SIP amount.");
      return;
    }
    if (Number.isNaN(goalNum) || goalNum <= 0) {
      setError("Please enter a valid investment goal.");
      return;
    }
    if (Number.isNaN(tenureNum) || tenureNum < 1 || tenureNum > 30) {
      setError("Investment tenure must be between 1 and 30 years.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await actor.submitSIPDetails(
        name.trim(),
        BigInt(Math.round(monthlyNum)),
        BigInt(Math.round(goalNum)),
        BigInt(Math.round(yearlyNum)),
        BigInt(Math.round(tenureNum)),
        BigInt(Math.round(corpusNum)),
      );

      const [sessionId] = result;

      setSession({
        sessionId: sessionId.toString(),
        name: name.trim(),
        monthly: monthlyNum,
        goal: goalNum,
        tenure: tenureNum,
        corpus: corpusNum,
        yearly: yearlyNum,
      });
      navigate({ to: "/risk-profile" });
    } catch (err) {
      console.error(err);
      setError("Failed to submit details. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout activeStep={1} backTo="/" backLabel="Home">
      <div className="max-w-2xl mx-auto px-6 py-10 md:py-16">
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
            PHASE 1 — INPUT
          </div>
          <h1 className="section-headline text-3xl md:text-4xl text-white mb-3">
            Collect SIP Details
          </h1>
          <p style={{ color: "#888", fontSize: "0.9rem", lineHeight: "1.6" }}>
            Enter investor information to begin the AI-powered fund analysis
            workflow. The engine will use these details to match the ideal risk
            profile and recommend top-performing funds.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Investor Name */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="investor-name"
              className="text-sm font-semibold text-white/80"
            >
              Investor Name
              <span style={{ color: "#ff6b6b" }}> *</span>
            </label>
            <input
              id="investor-name"
              type="text"
              data-ocid="sip.name_input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rajesh Kumar"
              className="sip-input"
              autoComplete="name"
              required
            />
          </div>

          {/* Monthly SIP */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="monthly-sip"
              className="text-sm font-semibold text-white/80"
            >
              Monthly SIP Amount (₹)
              <span style={{ color: "#ff6b6b" }}> *</span>
            </label>
            <div className="relative">
              <span
                className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold"
                style={{ color: "#00c896" }}
              >
                ₹
              </span>
              <input
                id="monthly-sip"
                type="number"
                data-ocid="sip.monthly_input"
                value={monthly}
                onChange={(e) => setMonthly(e.target.value)}
                placeholder="5000"
                min="100"
                className="sip-input pl-9"
                required
              />
            </div>
          </div>

          {/* Yearly (auto-calculated) */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="yearly-sip"
              className="text-sm font-semibold text-white/80 flex items-center gap-2"
            >
              Yearly Investment Amount (₹)
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(0,200,150,0.1)",
                  color: "#00c896",
                  border: "1px solid rgba(0,200,150,0.2)",
                }}
              >
                Auto-calculated
              </span>
            </label>
            <div className="relative">
              <span
                className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold"
                style={{ color: "#d4af37" }}
              >
                ₹
              </span>
              <input
                id="yearly-sip"
                type="number"
                value={yearly}
                onChange={(e) => setYearly(e.target.value)}
                placeholder="60000"
                min="100"
                className="sip-input pl-9"
                style={{ opacity: yearly ? 1 : 0.6 }}
              />
            </div>
            <p className="text-xs" style={{ color: "#555" }}>
              <Calculator className="w-3 h-3 inline mr-1" />
              Auto-filled as Monthly × 12. Editable if different.
            </p>
          </div>

          {/* Goal Amount */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="goal-amount"
              className="text-sm font-semibold text-white/80"
            >
              Investment Goal Amount (₹)
              <span style={{ color: "#ff6b6b" }}> *</span>
            </label>
            <div className="relative">
              <span
                className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold"
                style={{ color: "#00c896" }}
              >
                ₹
              </span>
              <input
                id="goal-amount"
                type="number"
                data-ocid="sip.goal_input"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="1000000"
                min="1000"
                className="sip-input pl-9"
                required
              />
            </div>
            <p className="text-xs" style={{ color: "#555" }}>
              Target corpus you want to accumulate (e.g. ₹10,00,000 for ₹10
              Lakh)
            </p>
          </div>

          {/* Tenure */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="tenure"
              className="text-sm font-semibold text-white/80"
            >
              Investment Tenure (Years)
              <span style={{ color: "#ff6b6b" }}> *</span>
            </label>
            <input
              id="tenure"
              type="number"
              data-ocid="sip.tenure_input"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              placeholder="10"
              min="1"
              max="30"
              className="sip-input"
              required
            />
            <p className="text-xs" style={{ color: "#555" }}>
              1 to 30 years
            </p>
          </div>

          {/* Existing Corpus */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="corpus"
              className="text-sm font-semibold text-white/80 flex items-center gap-2"
            >
              Existing Corpus (₹)
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.4)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                Optional
              </span>
            </label>
            <div className="relative">
              <span
                className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold"
                style={{ color: "#d4af37" }}
              >
                ₹
              </span>
              <input
                id="corpus"
                type="number"
                data-ocid="sip.corpus_input"
                value={corpus}
                onChange={(e) => setCorpus(e.target.value)}
                placeholder="0"
                min="0"
                className="sip-input pl-9"
              />
            </div>
            <p className="text-xs" style={{ color: "#555" }}>
              Any existing mutual fund investments to include in projections
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              data-ocid="sip.error_state"
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
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

          {/* Submit */}
          <button
            type="submit"
            data-ocid="sip.submit_button"
            disabled={submitting || isFetching || !actor}
            className="btn-primary py-4 text-base font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Continue to Risk Profile
                <span className="text-lg leading-none">→</span>
              </>
            )}
          </button>

          <p className="text-center text-xs" style={{ color: "#444" }}>
            Your data is secured with AES-256 encryption · SEBI Compliant
          </p>
        </form>
      </div>
    </PageLayout>
  );
}
