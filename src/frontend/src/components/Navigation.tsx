import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Risk Engine", href: "#risk-engine" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const routerState = useRouterState();
  const isHomePage = routerState.location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    setMenuOpen(false);
    if (isHomePage) {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      navigate({ to: "/" });
    }
  };

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isHomePage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate({ to: "/" });
    }
  };

  const scrollToCTA = () => {
    if (isHomePage) {
      document.querySelector("#cta")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      navigate({ to: "/sip-analysis" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0d0d0d]/90 backdrop-blur-xl border-b border-white/[0.06] shadow-lg"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo — use button for scroll-to-top */}
        <button
          type="button"
          onClick={scrollToTop}
          className="flex items-center gap-2 group bg-transparent border-none p-0 cursor-pointer"
        >
          <img
            src="/assets/uploads/Valentiz-Venture-2-e1731567864942-1.webp"
            alt="VVSPL Logo"
            className="w-9 h-9 object-contain"
          />
          <span
            className="text-white font-bold text-lg tracking-[0.12em]"
            style={{
              fontFamily:
                '"Bricolage Grotesque", "Cabinet Grotesk", sans-serif',
            }}
          >
            VVSPL MF Agent
          </span>
        </button>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <li key={link.href}>
              <a
                href={link.href}
                data-ocid={`nav.link.${i + 1}`}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-medium text-white/60 hover:text-white transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-[#00c896] transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            data-ocid="nav.primary_button"
            onClick={scrollToCTA}
            className="btn-primary px-5 py-2 text-sm font-bold"
          >
            Get Early Access
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden text-white/70 hover:text-white transition-colors p-1"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0d0d0d]/98 border-b border-white/[0.08] backdrop-blur-xl">
          <div className="px-6 py-5 flex flex-col gap-4">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                data-ocid={`nav.link.${i + 1}`}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-white/70 hover:text-white font-medium py-1 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              data-ocid="nav.primary_button"
              onClick={() => {
                setMenuOpen(false);
                scrollToCTA();
              }}
              className="btn-primary px-5 py-2.5 text-sm font-bold mt-2 w-full"
            >
              Get Early Access
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
