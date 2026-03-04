import { Zap } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative"
      style={{
        background: "#0d0d0d",
        borderTop: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #00c896, #d4af37)",
                }}
              >
                <Zap className="w-4 h-4 text-black fill-black" />
              </div>
              <span
                className="text-white font-bold text-lg tracking-[0.12em]"
                style={{
                  fontFamily:
                    '"Bricolage Grotesque", "Cabinet Grotesk", sans-serif',
                }}
              >
                VVSPL MF Agent
              </span>
            </div>
            <p className="text-sm max-w-xs" style={{ color: "#5a5a5a" }}>
              Institutional-grade fund intelligence for modern advisors.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              { label: "Privacy Policy", href: "#" },
              { label: "Terms of Service", href: "#" },
              { label: "Contact", href: "#" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm transition-colors duration-200 footer-link"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p className="text-xs" style={{ color: "#404040" }}>
            © {year} VVSPL MF Agent. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "#404040" }}>
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.hostname : "",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-200 hover:text-white/60"
              style={{ color: "#404040" }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
