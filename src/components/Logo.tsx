interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "hero";
  showText?: boolean;
  subtitle?: string;
  className?: string;
  animated?: boolean;
}

export default function Logo({
  size = "md",
  showText = true,
  subtitle,
  className = "",
  animated = true,
}: LogoProps) {
  const sizeMap = {
    xs: { iconSize: 22, fontSize: "0.95rem", subSize: "0.6rem" },
    sm: { iconSize: 28, fontSize: "1.1rem", subSize: "0.65rem" },
    md: { iconSize: 36, fontSize: "1.25rem", subSize: "0.7rem" },
    lg: { iconSize: 48, fontSize: "1.5rem", subSize: "0.8rem" },
    xl: { iconSize: 64, fontSize: "1.9rem", subSize: "0.85rem" },
    hero: { iconSize: 80, fontSize: "2.4rem", subSize: "0.95rem" },
  };

  const { iconSize, fontSize, subSize } = sizeMap[size];

  return (
    <div
      className={`stegovault-brand-logo ${animated ? "logo-animated" : ""} ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size === "xs" ? "6px" : size === "sm" ? "8px" : "12px",
        userSelect: "none",
      }}
    >
      {/* SVG Icon Emblem */}
      <div
        className="logo-emblem-wrap"
        style={{
          width: iconSize,
          height: iconSize,
          position: "relative",
          flexShrink: 0,
        }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "100%", filter: "drop-shadow(0 0 10px rgba(0, 212, 255, 0.45))" }}
          aria-hidden="true"
        >
          <defs>
            {/* Cyber Gradient Definitions */}
            <linearGradient id="svOuterShield" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00d4ff" />
              <stop offset="50%" stopColor="#7a5af8" />
              <stop offset="100%" stopColor="#ff4694" />
            </linearGradient>

            <linearGradient id="svCoreGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00e87a" />
              <stop offset="50%" stopColor="#00d4ff" />
              <stop offset="100%" stopColor="#9b6dff" />
            </linearGradient>

            <radialGradient id="svIrisGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#7a5af8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#030712" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="svStegoBits" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00e87a" />
              <stop offset="100%" stopColor="#00d4ff" />
            </linearGradient>

            <filter id="svNeonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Hexagon Shield */}
          <polygon
            points="50,6 90,26 90,74 50,94 10,74 10,26"
            fill="#080e1c"
            stroke="url(#svOuterShield)"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Steganographic Matrix Grid Dots / Circuit Lines */}
          <g opacity="0.45">
            <line x1="24" y1="36" x2="76" y2="36" stroke="#4d9fff" strokeWidth="1" strokeDasharray="2 3" />
            <line x1="20" y1="50" x2="80" y2="50" stroke="#7a5af8" strokeWidth="1" strokeDasharray="3 4" />
            <line x1="24" y1="64" x2="76" y2="64" stroke="#4d9fff" strokeWidth="1" strokeDasharray="2 3" />
            
            {/* LSB Pixel Bits */}
            <rect x="28" y="34" width="4" height="4" rx="1" fill="url(#svStegoBits)" />
            <rect x="68" y="34" width="4" height="4" rx="1" fill="url(#svStegoBits)" />
            <rect x="70" y="62" width="4" height="4" rx="1" fill="url(#svStegoBits)" />
            <rect x="26" y="62" width="4" height="4" rx="1" fill="url(#svStegoBits)" />
          </g>

          {/* Midnight ZK Orbit Rings */}
          <circle
            cx="50"
            cy="50"
            r="26"
            stroke="url(#svCoreGlow)"
            strokeWidth="2"
            strokeDasharray="9 5 18 4"
            fill="url(#svIrisGlow)"
          />

          {/* Isometric Inner Vault Core */}
          <g transform="translate(50, 50)">
            {/* Vault Keyhole / Lock Shackle */}
            <path
              d="M-8,-5 V-12 C-8,-16.5 -4.5,-20 0,-20 C4.5,-20 8,-16.5 8,-12 V-5"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              filter="drop-shadow(0 0 4px #00d4ff)"
            />
            {/* Vault Box */}
            <rect
              x="-14"
              y="-5"
              width="28"
              height="24"
              rx="4"
              fill="#0d182e"
              stroke="url(#svOuterShield)"
              strokeWidth="2.5"
            />
            {/* ZK Eye / Center Iris Diamond */}
            <circle cx="0" cy="5" r="4" fill="#00e87a" />
            <path d="M0,7 V13" stroke="#00e87a" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* Corner Cyber Nodes */}
          <circle cx="50" cy="6" r="3" fill="#00d4ff" filter="url(#svNeonGlow)" />
          <circle cx="90" cy="26" r="2.5" fill="#7a5af8" />
          <circle cx="90" cy="74" r="2.5" fill="#ff4694" />
          <circle cx="50" cy="94" r="3" fill="#00e87a" filter="url(#svNeonGlow)" />
          <circle cx="10" cy="74" r="2.5" fill="#00d4ff" />
          <circle cx="10" cy="26" r="2.5" fill="#7a5af8" />
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
          <div
            style={{
              fontSize,
              fontWeight: 800,
              letterSpacing: "0.08em",
              fontFamily: "'Inter', system-ui, sans-serif",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #d8e5ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              STEGO
            </span>
            <span
              style={{
                background: "linear-gradient(135deg, #00d4ff 0%, #7a5af8 60%, #ff4694 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 8px rgba(0, 212, 255, 0.4))",
              }}
            >
              VAULT
            </span>
            <span
              style={{
                display: "inline-block",
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: "#00e87a",
                marginLeft: "5px",
                boxShadow: "0 0 8px #00e87a",
                animation: "pulseGlow 2s infinite ease-in-out",
              }}
            />
          </div>
          {subtitle !== undefined ? (
            <span
              style={{
                fontSize: subSize,
                color: "var(--text2)",
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.04em",
                marginTop: "2px",
              }}
            >
              {subtitle}
            </span>
          ) : (
            <span
              style={{
                fontSize: subSize,
                color: "#7a8cad",
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginTop: "2px",
                opacity: 0.85,
              }}
            >
              Midnight ZK · LSB Cold Storage
            </span>
          )}
        </div>
      )}
    </div>
  );
}
