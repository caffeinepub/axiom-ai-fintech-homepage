export default function ComplianceBar() {
  const items = [
    "SEBI Registered",
    "AMFI Compliant",
    "Data encrypted at rest and in transit",
    "Not investment advice — for advisor use only",
  ];

  return (
    <div
      className="w-full py-4 px-6"
      style={{
        background: "rgba(255,255,255,0.02)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        {items.map((item, i) => (
          <span key={item} className="flex items-center gap-4">
            <span className="text-xs" style={{ color: "#5a5a5a" }}>
              {item}
            </span>
            {i < items.length - 1 && (
              <span className="text-xs" style={{ color: "#333" }}>
                |
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
