import { useEffect, useState } from "react";
import Logo from "../Logo";
import Button from "./Button";

interface NavbarProps {
  onLaunch: () => void;
  isConnected?: boolean;
  account?: string | null;
  onConnect?: () => void;
  isConnecting?: boolean;
}

export default function Navbar({
  onLaunch,
  isConnected = false,
  account,
  onConnect,
  isConnecting = false,
}: NavbarProps) {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const sectionIds = ["product", "technology", "security", "how-it-works"];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -55% 0px",
        threshold: 0,
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sv-navbar-wrapper">
      <div className="sv-navbar-container">
        {/* Left: Logo */}
        <Logo
          variant="dark"
          height={26}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        />

        {/* Center: Navigation links */}
        <nav className="sv-nav-links" aria-label="Landing Navigation">
          <button
            type="button"
            className={`sv-nav-link ${activeSection === "product" ? "active" : ""}`}
            onClick={() => scrollTo("product")}
          >
            Product
            <span className="sv-nav-underline" />
          </button>
          <button
            type="button"
            className={`sv-nav-link ${activeSection === "technology" ? "active" : ""}`}
            onClick={() => scrollTo("technology")}
          >
            Technology
            <span className="sv-nav-underline" />
          </button>
          <button
            type="button"
            className={`sv-nav-link ${activeSection === "security" ? "active" : ""}`}
            onClick={() => scrollTo("security")}
          >
            Security
            <span className="sv-nav-underline" />
          </button>
          <button
            type="button"
            className={`sv-nav-link ${activeSection === "how-it-works" ? "active" : ""}`}
            onClick={() => scrollTo("how-it-works")}
          >
            How it works
            <span className="sv-nav-underline" />
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="sv-nav-actions">
          {isConnected ? (
            <div className="sv-nav-wallet-pill">
              <span className="sv-status-dot" />
              <span className="sv-wallet-addr">
                {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "1AM Connected"}
              </span>
            </div>
          ) : onConnect ? (
            <button
              type="button"
              className="sv-nav-wallet-btn"
              onClick={onConnect}
              disabled={isConnecting}
            >
              {isConnecting ? "Connecting..." : "Connect 1AM"}
            </button>
          ) : null}

          <Button variant="primary" size="sm" onClick={onLaunch}>
            Get started
          </Button>
        </div>
      </div>
    </header>
  );
}
