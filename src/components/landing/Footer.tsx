import Logo from "../Logo";

interface FooterProps {
  onOpenGuide?: () => void;
  onOpenFeedback?: () => void;
}

export default function Footer({ onOpenGuide, onOpenFeedback }: FooterProps) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="sv-footer" role="contentinfo">
      <div className="sv-container sv-footer-container">
        {/* Left: Logo */}
        <div className="sv-footer-brand">
          <Logo
            variant="dark"
            height={26}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          />
        </div>

        {/* Center: Four Links */}
        <nav className="sv-footer-nav" aria-label="Footer Links">
          <button type="button" className="sv-footer-link" onClick={() => scrollTo("product")}>
            Product
          </button>
          <button type="button" className="sv-footer-link" onClick={() => scrollTo("technology")}>
            Technology
          </button>
          <button type="button" className="sv-footer-link" onClick={() => scrollTo("security")}>
            Security
          </button>
          <button type="button" className="sv-footer-link" onClick={() => scrollTo("how-it-works")}>
            How it works
          </button>
          {onOpenGuide && (
            <button type="button" className="sv-footer-link" onClick={onOpenGuide}>
              Guide
            </button>
          )}
          {onOpenFeedback && (
            <button type="button" className="sv-footer-link" onClick={onOpenFeedback}>
              Feedback
            </button>
          )}
        </nav>

        {/* Right: Badge */}
        <div className="sv-footer-right">
          <div className="sv-footer-badge">
            <span className="sv-footer-badge-dot" />
            <span>Built on Midnight</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
