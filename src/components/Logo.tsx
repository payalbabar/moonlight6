const ROWS = ["111", "100", "111", "001", "111"];

const TONES = {
  dark: { fg: "#f1f0ee", dim: "#2a2828", accent: "#b3121b" },
  light: { fg: "#0c0b0b", dim: "#d9d6d3", accent: "#b3121b" },
  red: { fg: "#f1f0ee", dim: "#c8434a", accent: "#0c0b0b" },
} as const;

export type LogoVariant = "dark" | "light" | "red";

export interface LogoMarkProps {
  variant?: LogoVariant;
  height?: number;
  className?: string;
}

export function LogoMark({ variant = "dark", height = 28, className = "" }: LogoMarkProps) {
  const t = TONES[variant] || TONES.dark;
  return (
    <svg
      viewBox="0 0 31 53"
      height={height}
      role="img"
      aria-label="StegoVault Logo Mark"
      className={className}
      style={{ display: "block", flexShrink: 0 }}
    >
      {ROWS.flatMap((row, r) =>
        [...row].map((v, c) => (
          <rect
            key={`${r}-${c}`}
            x={c * 11}
            y={r * 11}
            width="9"
            height="9"
            fill={r === 2 && c === 1 ? t.accent : v === "1" ? t.fg : t.dim}
          />
        ))
      )}
    </svg>
  );
}

export interface LogoProps {
  variant?: LogoVariant;
  height?: number;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "hero";
  showText?: boolean;
  className?: string;
  subtitle?: string;
  onClick?: () => void;
}

export function Logo({
  variant = "dark",
  height,
  size,
  showText = true,
  className = "",
  subtitle,
  onClick,
}: LogoProps) {
  // Backward compatibility height calculation if size prop was provided
  let calculatedHeight = height || 28;
  if (!height && size) {
    const sizeToHeight: Record<string, number> = {
      xs: 20,
      sm: 24,
      md: 26,
      lg: 32,
      xl: 40,
      hero: 48,
    };
    calculatedHeight = sizeToHeight[size] || 28;
  }

  const textColor = variant === "light" ? "#0c0b0b" : "#f1f0ee";

  return (
    <span
      className={`sv-logo ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "12px",
        cursor: onClick ? "pointer" : "inherit",
        userSelect: "none",
        textDecoration: "none",
      }}
    >
      <LogoMark variant={variant} height={calculatedHeight} />
      {showText && (
        <span style={{ display: "inline-flex", flexDirection: "column", justifyContent: "center" }}>
          <span
            className="sv-wordmark"
            style={{
              fontFamily: '"Archivo", sans-serif',
              fontWeight: 800,
              fontStretch: "85%",
              letterSpacing: "-0.015em",
              fontSize: "22px",
              lineHeight: 1,
              color: textColor,
            }}
          >
            StegoVault
          </span>
          {subtitle && (
            <span
              style={{
                fontFamily: '"Instrument Sans", sans-serif',
                fontSize: "11px",
                color: "#8d8988",
                letterSpacing: "0.02em",
                marginTop: "3px",
              }}
            >
              {subtitle}
            </span>
          )}
        </span>
      )}
    </span>
  );
}

export default Logo;
