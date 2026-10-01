import { useRef, useEffect, useState } from "react";

export default function SolutionSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0.5);

  useEffect(() => {
    let frameId: number;

    const handleScroll = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const el = sectionRef.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Progress goes from -0.5 to 0.5 centered when section is centered
        const totalDist = windowHeight + rect.height;
        const currentDist = windowHeight - rect.top;
        const raw = currentDist / totalDist; // 0 to 1
        const centered = (raw - 0.5) * 2; // -1 to 1
        setScrollProgress(centered);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(frameId);
    };
  }, []);

  // Compute horizontal shifts: big circle shifts up to ~150px, small circle shifts in opposite direction by -0.6x
  const bigCircleShift = scrollProgress * 140; // in px
  const smallCircleShift = -0.6 * bigCircleShift;

  return (
    <section
      ref={sectionRef}
      className="sv-solution-section"
      id="technology"
      aria-label="StegoVault Three-Layer Architecture"
    >
      {/* Visual Animated Split Circles */}
      <div className="sv-solution-circles-wrapper" aria-hidden="true">
        {/* Big bone circle */}
        <div
          className="sv-circle-big"
          style={{
            transform: `translate(-50%, -50%) translateX(${bigCircleShift}px)`,
          }}
        >
          {/* Smaller ink circle inside */}
          <div
            className="sv-circle-small"
            style={{
              transform: `translate(-50%, -50%) translateX(${smallCircleShift}px)`,
            }}
          />
        </div>
      </div>

      {/* Content Split: Left (Red side) & Right (Bone side) */}
      <div className="sv-solution-container">
        {/* Left Side: On Red, Bone text */}
        <div className="sv-solution-left">
          <div className="sv-solution-left-content">
            <span className="sv-badge-light">THE VAULT PARADIGM</span>
            <h2 className="sv-solution-h2">
              Three layers.
              <br />
              One image.
            </h2>
            <p className="sv-solution-lead">
              Each layer answers a different attacker.
            </p>
          </div>
        </div>

        {/* Right Side: On Bone, Ink text */}
        <div className="sv-solution-right">
          <div className="sv-solution-right-content">
            <div className="sv-layer-block">
              <div className="sv-layer-header">
                <span className="sv-layer-number">01</span>
                <h3 className="sv-layer-title">Steganography</h3>
              </div>
              <p className="sv-layer-desc">
                Your data lives in the pixels of a normal PNG. The file looks like any other picture.
              </p>
            </div>

            <div className="sv-layer-divider" />

            <div className="sv-layer-block">
              <div className="sv-layer-header">
                <span className="sv-layer-number">02</span>
                <h3 className="sv-layer-title">Encryption</h3>
              </div>
              <p className="sv-layer-desc">
                AES-256-GCM locks the payload before it is embedded, so even a found secret is unreadable.
              </p>
            </div>

            <div className="sv-layer-divider" />

            <div className="sv-layer-block">
              <div className="sv-layer-header">
                <span className="sv-layer-number">03</span>
                <h3 className="sv-layer-title">Zero knowledge</h3>
              </div>
              <p className="sv-layer-desc">
                A Midnight proof shows the vault is valid without exposing a single word.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
