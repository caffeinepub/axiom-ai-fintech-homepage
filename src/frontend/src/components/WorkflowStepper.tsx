import { Link } from "@tanstack/react-router";
import { Check, ChevronLeft } from "lucide-react";

const STEPS = [
  { id: 1, label: "SIP Details", shortLabel: "SIP" },
  { id: 2, label: "Risk Profile", shortLabel: "Risk" },
  { id: 3, label: "Best Funds", shortLabel: "Funds" },
  { id: 4, label: "Projection", shortLabel: "Proj" },
  { id: 5, label: "Report", shortLabel: "Report" },
];

interface WorkflowStepperProps {
  activeStep: number; // 1-5
  backTo?: string;
  backLabel?: string;
}

export default function WorkflowStepper({
  activeStep,
  backTo = "/",
  backLabel = "Back",
}: WorkflowStepperProps) {
  return (
    <div
      className="w-full py-4 px-4 md:px-6"
      style={{
        background: "rgba(13,13,13,0.95)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Back nav */}
        <Link
          to={backTo}
          className="inline-flex items-center gap-1.5 text-xs mb-3 transition-colors"
          style={{ color: "rgba(255,255,255,0.4)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "rgba(255,255,255,0.8)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(255,255,255,0.4)";
          }}
        >
          <ChevronLeft className="w-3 h-3" />
          {backLabel}
        </Link>

        {/* Stepper */}
        <div className="flex items-center gap-0">
          {STEPS.map((step, i) => {
            const isCompleted = step.id < activeStep;
            const isActive = step.id === activeStep;
            const isFuture = step.id > activeStep;

            return (
              <div
                key={step.id}
                className="flex items-center"
                style={{ flex: i < STEPS.length - 1 ? "1" : "0 0 auto" }}
              >
                {/* Step bubble + label */}
                <div
                  data-ocid={`workflow.stepper.item.${step.id}`}
                  className="flex flex-col items-center gap-1.5 shrink-0"
                >
                  {/* Bubble */}
                  <div
                    className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all duration-300 text-xs font-bold"
                    style={
                      isCompleted
                        ? {
                            background: "#00c896",
                            color: "#000",
                            boxShadow: "0 0 12px rgba(0,200,150,0.4)",
                          }
                        : isActive
                          ? {
                              background: "rgba(0,200,150,0.15)",
                              border: "2px solid #00c896",
                              color: "#00c896",
                              boxShadow: "0 0 16px rgba(0,200,150,0.3)",
                            }
                          : {
                              background: "rgba(255,255,255,0.05)",
                              border: "1px solid rgba(255,255,255,0.12)",
                              color: "rgba(255,255,255,0.3)",
                            }
                    }
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.id}
                  </div>

                  {/* Label */}
                  <span
                    className="text-[9px] md:text-[10px] font-medium tracking-wide hidden sm:block"
                    style={{
                      color: isCompleted
                        ? "#00c896"
                        : isActive
                          ? "#ffffff"
                          : isFuture
                            ? "rgba(255,255,255,0.3)"
                            : "rgba(255,255,255,0.3)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span className="hidden md:inline">{step.label}</span>
                    <span className="md:hidden">{step.shortLabel}</span>
                  </span>
                </div>

                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div
                    className="flex-1 h-px mx-1.5 md:mx-2 mt-[-10px] sm:mt-[-10px]"
                    style={{
                      background:
                        step.id < activeStep
                          ? "linear-gradient(90deg, #00c896, rgba(0,200,150,0.4))"
                          : "rgba(255,255,255,0.1)",
                      transition: "background 0.3s ease",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
