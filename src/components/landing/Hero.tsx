import { useEffect, useState } from "react";
import Button from "./Button";

interface HeroProps {
  onHideKey: () => void;
  onSeeHowItWorks: () => void;
}

export default function Hero({ onHideKey, onSeeHowItWorks }: HeroProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Desktop parallax scroll for hero object
    let frameId: number;
    const handleScroll = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        if (window.innerWidth > 1024) {
          setScrollY(window.scrollY);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(frameId);
    };
  }, []);

  const parallaxTransform = `translateY(${scrollY * 0.08}px) rotate(${scrollY * 0.008}deg)`;

  return (
    <section className="sv-hero-section" id="hero" aria-label="StegoVault Hero">
      <div className="sv-hero-container">
        {/* Left Column: 1.25fr */}
        <div className="sv-hero-left">
          {/* Category eyebrow with 36px red line */}
          <div className="sv-hero-eyebrow">
            <span className="sv-eyebrow-line" aria-hidden="true" />
            <span className="sv-eyebrow-text">Steganographic cold storage on Midnight</span>
          </div>

          {/* Masked staggered H1 */}
          <h1 className="sv-hero-title">
            <span className="sv-h1-mask">
              <span className="sv-h1-line sv-h1-line-1">Your seed</span>
            </span>
            <span className="sv-h1-mask">
              <span className="sv-h1-line sv-h1-line-2">phrase, hidden</span>
            </span>
            <span className="sv-h1-mask">
              <span className="sv-h1-line sv-h1-line-3">in plain sight.</span>
            </span>
          </h1>

          {/* Lead description */}
          <p className="sv-hero-lead">
            StegoVault conceals private keys inside ordinary PNG images, encrypted on your device.
            Midnight zero-knowledge proofs confirm the backup exists without revealing it.
          </p>

          {/* CTAs */}
          <div className="sv-hero-ctas">
            <Button variant="primary" size="lg" onClick={onHideKey}>
              Hide a key
            </Button>
            <Button variant="link" onClick={onSeeHowItWorks}>
              See how it works
            </Button>
          </div>
        </div>

        {/* Right Column: 1fr - SVG Vault Object */}
        <div className="sv-hero-right">
          <div
            className="sv-hero-object-wrapper"
            style={{ transform: parallaxTransform }}
          >
            <svg
              className="sv-hero-svg"
              viewBox="0 0 400 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="StegoVault Geometric Vault Object"
            >
              {/* Layer 1: Graphite square with line border */}
              <rect
                className="sv-svg-layer sv-svg-layer-1"
                x="30"
                y="30"
                width="340"
                height="340"
                fill="#161515"
                stroke="#2a2828"
                strokeWidth="1.5"
              />

              {/* Layer 2: Thin off-white outline square */}
              <rect
                className="sv-svg-layer sv-svg-layer-2"
                x="65"
                y="65"
                width="270"
                height="270"
                fill="none"
                stroke="#f1f0ee"
                strokeWidth="1.5"
                strokeOpacity="0.85"
              />

              {/* Layer 3: Off-white square with a big quarter-circle right side */}
              <path
                className="sv-svg-layer sv-svg-layer-3"
                d="M 100 100 H 200 A 100 100 0 0 1 300 200 V 300 H 100 Z"
                fill="#f1f0ee"
              />

              {/* Layer 4: Smaller red shape with the same quarter-circle profile */}
              <path
                className="sv-svg-layer sv-svg-layer-4"
                d="M 140 140 H 210 A 70 70 0 0 1 280 210 V 280 H 140 Z"
                fill="#b3121b"
              />

              {/* Layer 5: Small ink square in the centre */}
              <rect
                className="sv-svg-layer sv-svg-layer-5"
                x="180"
                y="180"
                width="40"
                height="40"
                fill="#0c0b0b"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Hero Bottom Strip */}
      <div className="sv-hero-strip" aria-label="StegoVault Core Guarantees">
        <div className="sv-hero-strip-container">
          <div className="sv-strip-item">
            <span className="sv-strip-dot" />
            <span>AES-256-GCM encryption</span>
          </div>
          <div className="sv-strip-item">
            <span className="sv-strip-dot" />
            <span>100% client-side</span>
          </div>
          <div className="sv-strip-item">
            <span className="sv-strip-dot" />
            <span>Zero servers</span>
          </div>
          <div className="sv-strip-item">
            <span className="sv-strip-dot" />
            <span>Compact contracts on Midnight</span>
          </div>
        </div>
      </div>
    </section>
  );
}
