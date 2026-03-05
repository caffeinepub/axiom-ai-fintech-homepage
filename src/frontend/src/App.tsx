import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import {
  Activity,
  BarChart2,
  Filter,
  Shield,
  Target,
  TrendingUp,
} from "lucide-react";
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { FundRecommendation } from "./backend.d";
import AnimatedBackground from "./components/AnimatedBackground";
import FundRecommendationsPage from "./pages/FundRecommendationsPage";
import ProjectionPage from "./pages/ProjectionPage";
import ReportPage from "./pages/ReportPage";
import RiskProfilePage from "./pages/RiskProfilePage";
import SIPAnalysisPage from "./pages/SIPAnalysisPage";
import SavedReportsPage from "./pages/SavedReportsPage";

/* ─── Shared Session Context ───────────────────────────────────── */
export interface SessionState {
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

interface SessionContextType {
  session: SessionState;
  setSession: (update: Partial<SessionState>) => void;
}

export const SessionContext = createContext<SessionContextType>({
  session: {},
  setSession: () => {},
});

export function useSession() {
  return useContext(SessionContext);
}

function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<SessionState>({});
  const setSession = (update: Partial<SessionState>) =>
    setSessionState((prev) => ({ ...prev, ...update }));
  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
}

/* ─── Tab Nav ──────────────────────────────────────────────────── */
function TabNav({ activePath }: { activePath: string }) {
  const navLinks = [
    { label: "Dashboard", to: "/" },
    { label: "Risk Profile", to: "/risk-profile" },
    { label: "Fund Analysis", to: "/fund-recommendations" },
    { label: "Recommendations", to: "/projection" },
    { label: "Saved Reports", to: "/saved-reports" },
  ];
  return (
    <nav
      style={{
        background: "rgba(10,14,20,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
      className="flex items-center gap-0 px-6 h-12 sticky top-0 z-50"
    >
      {/* Logo */}
      <a
        href="/"
        data-ocid="nav.link"
        className="flex items-center gap-2 mr-8 shrink-0"
        onClick={(e) => {
          e.preventDefault();
          router.navigate({ to: "/" });
        }}
      >
        <img
          src="/assets/uploads/Valentiz-Venture-2-e1731567864942-1.webp"
          alt="Valentiz"
          className="h-7 w-auto object-contain"
        />
        <span
          className="font-display font-bold text-sm tracking-tight"
          style={{ color: "#ffffff" }}
        >
          VVSPL MF Agent
        </span>
      </a>

      {/* Tab links */}
      <div className="flex items-stretch h-full">
        {navLinks.map((link) => {
          const isActive =
            link.to === "/"
              ? activePath === "/"
              : activePath.startsWith(link.to);
          return (
            <a
              key={link.to}
              href={link.to}
              data-ocid="nav.link"
              onClick={(e) => {
                e.preventDefault();
                router.navigate({ to: link.to });
              }}
              className="flex items-center px-4 text-xs font-body font-medium tracking-wide transition-colors relative"
              style={{
                color: isActive ? "#00c896" : "rgba(255,255,255,0.55)",
              }}
            >
              {link.label}
              {isActive && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full"
                  style={{ background: "#00c896" }}
                />
              )}
            </a>
          );
        })}
      </div>
    </nav>
  );
}

/* ─── Home Page ────────────────────────────────────────────────── */
function HomePage() {
  const stats = [
    { label: "FUND UNIVERSE", value: "16", sub: "Active Funds" },
    { label: "RISK PROFILES", value: "3", sub: "Con / Mod / Agg" },
    { label: "SCORING FACTORS", value: "6", sub: "Weighted Metrics" },
    { label: "DATA POINTS", value: "256+", sub: "Per Fund" },
  ];

  const pipeline = [
    {
      icon: Shield,
      iconColor: "#818cf8",
      iconBg: "rgba(99,102,241,0.12)",
      title: "Risk Profiling",
      desc: "Quantitative classification via 5-factor scoring model",
      step: "Step 1",
      route: "/sip-analysis",
    },
    {
      icon: Filter,
      iconColor: "#fbbf24",
      iconBg: "rgba(251,191,36,0.10)",
      title: "Fund Filtering",
      desc: "Eliminate underperformers using AUM, expense, consistency gates",
      step: "Step 2",
      route: "/risk-profile",
    },
    {
      icon: BarChart2,
      iconColor: "#00c896",
      iconBg: "rgba(0,200,150,0.10)",
      title: "Scoring Engine",
      desc: "Weighted formula: Sharpe, Alpha, Downside Dev, Expense, Returns",
      step: "Step 3",
      route: "/fund-recommendations",
    },
    {
      icon: Target,
      iconColor: "#34d399",
      iconBg: "rgba(52,211,153,0.10)",
      title: "Portfolio Build",
      desc: "Asset allocation with AMC diversification & category caps",
      step: "Step 4",
      route: "/projection",
    },
    {
      icon: TrendingUp,
      iconColor: "#00c896",
      iconBg: "rgba(0,200,150,0.10)",
      title: "SIP Projection",
      desc: "Return simulation across conservative/expected/optimistic paths",
      step: "Step 5",
      route: "/report",
    },
  ];

  return (
    <div
      className="flex flex-col"
      style={{
        background: "transparent",
        color: "#ffffff",
        minHeight: "calc(100vh - 48px)",
      }}
    >
      <main className="flex-1 flex flex-col justify-center px-6 py-5 max-w-[1280px] mx-auto w-full">
        {/* ── Row 1: Hero Card ── */}
        <div
          className="relative rounded-xl p-6 mb-4 overflow-hidden"
          style={{
            background: "rgba(20,25,32,0.85)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
          data-ocid="hero.card"
        >
          <div
            className="absolute top-0 right-0 w-64 h-40 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at top right, rgba(0,200,150,0.12) 0%, transparent 70%)",
            }}
          />
          <button
            type="button"
            onClick={() => router.navigate({ to: "/sip-analysis" })}
            data-ocid="hero.primary_button"
            className="absolute top-5 right-5 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body font-semibold transition-all hover:opacity-90 active:scale-95"
            style={{ background: "#00c896", color: "#0a0e14" }}
          >
            Start Analysis
            <span className="text-base leading-none">→</span>
          </button>

          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-body font-semibold tracking-widest mb-3"
            style={{
              background: "rgba(0,200,150,0.1)",
              color: "#00c896",
              border: "1px solid rgba(0,200,150,0.2)",
            }}
          >
            <Activity size={11} />
            ADVISORY ENGINE V1.0
          </div>

          <h1
            className="font-display font-bold text-2xl md:text-3xl mb-2 leading-tight"
            style={{ color: "#ffffff", maxWidth: "70%" }}
          >
            Mutual Fund Advisory Agent
          </h1>
          <p
            className="font-body text-sm leading-relaxed"
            style={{ color: "rgba(255,255,255,0.45)", maxWidth: "65%" }}
          >
            Automated system that scans, analyzes, filters, and recommends
            optimal mutual funds based on client risk profile, fund performance
            analytics, and portfolio construction rules.
          </p>
        </div>

        {/* ── Row 2: Stats ── */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="rounded-xl p-4"
              style={{
                background: "rgba(20,25,32,0.80)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
              }}
              data-ocid={`stats.card.${i + 1}`}
            >
              <p
                className="font-body text-[10px] font-semibold tracking-widest mb-2 uppercase"
                style={{ color: "rgba(255,255,255,0.38)" }}
              >
                {stat.label}
              </p>
              <p
                className="font-display font-bold text-3xl leading-none mb-1"
                style={{ color: "#ffffff" }}
              >
                {stat.value}
              </p>
              <p
                className="font-body text-xs"
                style={{ color: "rgba(255,255,255,0.38)" }}
              >
                {stat.sub}
              </p>
            </div>
          ))}
        </div>

        {/* ── Row 3: Pipeline ── */}
        <div>
          <p
            className="font-body text-[10px] font-semibold tracking-widest uppercase mb-3"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            PROCESSING PIPELINE
          </p>
          <div className="grid grid-cols-5 gap-3">
            {pipeline.map((step, i) => {
              const Icon = step.icon;
              return (
                <button
                  key={step.title}
                  type="button"
                  onClick={() => router.navigate({ to: step.route })}
                  className="rounded-xl p-4 flex flex-col cursor-pointer transition-all hover:translate-y-[-1px] text-left"
                  style={{
                    background: "rgba(20,25,32,0.80)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                  }}
                  data-ocid={`pipeline.card.${i + 1}`}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center mb-3 shrink-0"
                    style={{ background: step.iconBg }}
                  >
                    <Icon size={16} color={step.iconColor} />
                  </div>
                  <h3
                    className="font-display font-semibold text-sm mb-1.5 leading-snug"
                    style={{ color: "#ffffff" }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="font-body text-xs leading-relaxed flex-1"
                    style={{ color: "rgba(255,255,255,0.42)" }}
                  >
                    {step.desc}
                  </p>
                  <span
                    className="inline-block mt-3 text-xs font-body font-semibold"
                    style={{ color: "#00c896" }}
                  >
                    {step.step} →
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </main>

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

/* ─── Page Wrapper (inner pages with nav) ───────────────────────── */
function PageWrapper({
  children,
  activePath,
}: {
  children: ReactNode;
  activePath: string;
}) {
  return (
    <div style={{ background: "transparent", minHeight: "100vh" }}>
      <TabNav activePath={activePath} />
      {children}
    </div>
  );
}

/* ─── Root Layout ───────────────────────────────────────────────── */
function RootLayout() {
  return (
    <SessionProvider>
      <div
        style={{
          position: "relative",
          minHeight: "100vh",
          background: "#0a0e14",
        }}
      >
        <AnimatedBackground />
        <div style={{ position: "relative", zIndex: 1 }}>
          <Toaster
            toastOptions={{
              style: {
                background: "rgba(26,26,46,0.95)",
                border: "1px solid rgba(0,200,150,0.2)",
                color: "#ffffff",
                backdropFilter: "blur(12px)",
              },
            }}
          />
          <Outlet />
        </div>
      </div>
    </SessionProvider>
  );
}

/* ─── Route Definitions ────────────────────────────────────────── */
const rootRoute = createRootRoute({ component: RootLayout });

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <>
      <TabNav activePath="/" />
      <HomePage />
    </>
  ),
});

const sipRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sip-analysis",
  component: () => (
    <PageWrapper activePath="/sip-analysis">
      <SIPAnalysisPage />
    </PageWrapper>
  ),
});

const riskRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/risk-profile",
  component: () => (
    <PageWrapper activePath="/risk-profile">
      <RiskProfilePage />
    </PageWrapper>
  ),
});

const fundsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/fund-recommendations",
  component: () => (
    <PageWrapper activePath="/fund-recommendations">
      <FundRecommendationsPage />
    </PageWrapper>
  ),
});

const projectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projection",
  component: () => (
    <PageWrapper activePath="/projection">
      <ProjectionPage />
    </PageWrapper>
  ),
});

const reportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/report",
  component: () => (
    <PageWrapper activePath="/report">
      <ReportPage />
    </PageWrapper>
  ),
});

const savedReportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/saved-reports",
  component: () => (
    <PageWrapper activePath="/saved-reports">
      <SavedReportsPage />
    </PageWrapper>
  ),
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  sipRoute,
  riskRoute,
  fundsRoute,
  projectionRoute,
  reportRoute,
  savedReportsRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

/* ─── App ──────────────────────────────────────────────────────── */
export default function App() {
  return <RouterProvider router={router} />;
}
