import WorkflowStepper from "./WorkflowStepper";

interface PageLayoutProps {
  children: React.ReactNode;
  activeStep: number;
  backTo?: string;
  backLabel?: string;
}

export default function PageLayout({
  children,
  activeStep,
  backTo,
  backLabel,
}: PageLayoutProps) {
  return (
    <div
      className="min-h-[calc(100vh-48px)] flex flex-col"
      style={{ background: "#0f1117", color: "#ffffff" }}
    >
      <WorkflowStepper
        activeStep={activeStep}
        backTo={backTo}
        backLabel={backLabel}
      />
      <main className="flex-1">{children}</main>
    </div>
  );
}
