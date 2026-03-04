import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";

const phases = [
  {
    id: "input",
    label: "Input & Data Collection",
    color: "#3b82f6",
    glowColor: "rgba(59,130,246,0.2)",
    borderColor: "rgba(59,130,246,0.4)",
    nodes: ["Collect SIP Details", "Get Market Data"],
    icon: "📥",
  },
  {
    id: "analysis",
    label: "Analysis & Filtering",
    color: "#f59e0b",
    glowColor: "rgba(245,158,11,0.2)",
    borderColor: "rgba(245,158,11,0.4)",
    nodes: [
      "Check Fund Performance",
      "Match Risk Profile",
      "Filter Best Funds",
    ],
    icon: "🔍",
  },
  {
    id: "calculation",
    label: "Calculation & Recommendation",
    color: "#a855f7",
    glowColor: "rgba(168,85,247,0.2)",
    borderColor: "rgba(168,85,247,0.4)",
    nodes: ["Project Returns", "Generate Recommendation"],
    icon: "🧮",
  },
  {
    id: "output",
    label: "Output",
    color: "#00c896",
    glowColor: "rgba(0,200,150,0.2)",
    borderColor: "rgba(0,200,150,0.4)",
    nodes: ["Display Report", "Send Report"],
    icon: "📊",
  },
];

export default function WorkflowDiagram() {
  return (
    <section
      id="workflow"
      className="relative py-20 md:py-28 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #0d0d0d 0%, #0f1623 50%, #0d0d0d 100%)",
      }}
    >
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(0,200,150,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 md:mb-20"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider"
              style={{
                background: "rgba(0,200,150,0.1)",
                border: "1px solid rgba(0,200,150,0.25)",
                color: "#00c896",
              }}
            >
              AI WORKFLOW
            </span>
          </div>
          <h2 className="section-headline text-4xl md:text-5xl text-white mb-4">
            How the <span className="gradient-text">AI Engine Works</span>
          </h2>
          <p className="text-base max-w-2xl mx-auto" style={{ color: "#888" }}>
            A 4-phase intelligent pipeline — from raw data to actionable fund
            recommendations tailored to each investor's risk profile.
          </p>
        </motion.div>

        {/* Phases grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-3 relative">
          {/* Desktop connector arrows */}
          <div
            className="hidden md:flex absolute top-[72px] left-0 right-0 items-center justify-between pointer-events-none z-0 px-[calc(12.5%+8px)]"
            style={{ gap: "calc(25% - 16px)" }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.2 }}
                className="flex-1 h-px mx-2 pipeline-arrow"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(0,200,150,0.5), rgba(0,200,150,0.15))",
                  transformOrigin: "left center",
                }}
              />
            ))}
          </div>

          {phases.map((phase, i) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative z-10 flex flex-col rounded-2xl overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${phase.borderColor}`,
                boxShadow: `0 8px 32px ${phase.glowColor}`,
              }}
            >
              {/* Phase header */}
              <div
                className="px-4 py-4 flex items-center gap-3"
                style={{
                  borderBottom: `1px solid ${phase.borderColor}`,
                  background: `${phase.glowColor}`,
                }}
              >
                <span className="text-xl">{phase.icon}</span>
                <div>
                  <div
                    className="text-xs font-bold tracking-wider uppercase"
                    style={{ color: phase.color }}
                  >
                    Phase {i + 1}
                  </div>
                  <div className="text-sm font-semibold text-white leading-tight mt-0.5">
                    {phase.label}
                  </div>
                </div>
              </div>

              {/* Phase nodes */}
              <div className="p-4 flex flex-col gap-2.5">
                {phase.nodes.map((node, j) => (
                  <motion.div
                    key={node}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: i * 0.12 + j * 0.08 + 0.25,
                    }}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: phase.color }}
                    />
                    <span className="text-xs font-medium text-white/80">
                      {node}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Mobile down arrow */}
              {i < phases.length - 1 && (
                <div className="md:hidden flex justify-center pb-1 -mb-4 relative z-20">
                  <div
                    className="w-px h-6"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,200,150,0.5), rgba(0,200,150,0.1))",
                    }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            to="/sip-analysis"
            data-ocid="workflow.start_button"
            className="btn-primary px-8 py-3.5 text-base font-bold inline-flex items-center gap-2"
          >
            Start Your Analysis
            <span>→</span>
          </Link>
          <p className="mt-3 text-xs" style={{ color: "#555" }}>
            Takes under 5 minutes · No credit card required
          </p>
        </motion.div>
      </div>
    </section>
  );
}
