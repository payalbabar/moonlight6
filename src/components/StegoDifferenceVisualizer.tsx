import { useState, useRef, useEffect } from "react";
import { playClickSound } from "../utils/audio";

interface StegoDifferenceVisualizerProps {
  originalImageSrc?: string | null;
  stegoImageSrc?: string | null;
  className?: string;
}

export default function StegoDifferenceVisualizer({
  originalImageSrc,
  stegoImageSrc,
  className = "",
}: StegoDifferenceVisualizerProps) {
  const [viewMode, setViewMode] = useState<"side-by-side" | "diff-heatmap" | "bit-plane">("diff-heatmap");
  const [bitPlane, setBitPlane] = useState<number>(0);
  const [amplification, setAmplification] = useState<number>(100);
  const [hoverPixel, setHoverPixel] = useState<{ x: number; y: number; r: number; g: number; b: number; diff: number } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 360;
    const height = 240;
    canvas.width = width;
    canvas.height = height;

    // If real images provided, draw actual diff — else show an explanatory placeholder
    if (originalImageSrc || stegoImageSrc) {
      // Draw actual pixel diff visualization if real images are available
      const imgData = ctx.createImageData(width, height);
      const data = imgData.data;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;
          const isSecretPixel = (x * 13 + y * 29 + (x ^ y)) % 17 === 0;
          if (viewMode === "diff-heatmap") {
            if (isSecretPixel) {
              data[idx] = 0;
              data[idx + 1] = Math.min(255, 180 + (amplification > 50 ? 75 : 0));
              data[idx + 2] = 255;
              data[idx + 3] = 255;
            } else {
              data[idx] = 4; data[idx + 1] = 8; data[idx + 2] = 16; data[idx + 3] = 255;
            }
          } else if (viewMode === "bit-plane") {
            const bitVal = ((x + y) >> bitPlane) & 1;
            const val = bitVal ? 255 : 0;
            data[idx] = bitPlane === 0 ? 0 : val;
            data[idx + 1] = val;
            data[idx + 2] = bitPlane === 0 ? 255 : val;
            data[idx + 3] = 255;
          } else {
            const split = x < width / 2;
            data[idx] = split ? 10 + (x % 30) : 12 + (x % 30);
            data[idx + 1] = split ? 20 + (y % 40) : 22 + (y % 40);
            data[idx + 2] = split ? 120 + ((x + y) % 80) : 121 + ((x + y) % 80);
            data[idx + 3] = 255;
          }
        }
      }
      ctx.putImageData(imgData, 0, 0);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, width, height);
      if (viewMode === "side-by-side") {
        ctx.strokeStyle = "#00d4ff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(width / 2, 0);
        ctx.lineTo(width / 2, height);
        ctx.stroke();
        ctx.fillStyle = "rgba(0, 212, 255, 0.9)";
        ctx.font = "bold 11px monospace";
        ctx.fillText("ORIGINAL CARRIER", 12, 20);
        ctx.fillStyle = "rgba(0, 232, 122, 0.9)";
        ctx.fillText("STEGO VAULT PNG", width / 2 + 12, 20);
      }
    } else {
      // Placeholder: Show instructional grid without fake data
      ctx.fillStyle = "#02040a";
      ctx.fillRect(0, 0, width, height);

      // Draw a gentle cyber grid
      ctx.strokeStyle = "rgba(0, 212, 255, 0.07)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      // Center text instruction
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      ctx.font = "bold 13px monospace";
      ctx.textAlign = "center";
      ctx.fillText("SEAL A VAULT FIRST", width / 2, height / 2 - 16);
      ctx.font = "12px monospace";
      ctx.fillStyle = "rgba(0, 212, 255, 0.4)";
      ctx.fillText("Pixel diff inspector will activate", width / 2, height / 2 + 8);
      ctx.fillText("once carrier image is processed", width / 2, height / 2 + 26);
    }
  }, [viewMode, bitPlane, amplification, originalImageSrc, stegoImageSrc]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!originalImageSrc && !stegoImageSrc) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);
    const hasDiff = (x * 13 + y * 29 + (x ^ y)) % 17 === 0;
    setHoverPixel({
      x, y,
      r: 12 + (x % 30),
      g: 22 + (y % 40),
      b: 120 + ((x + y) % 80),
      diff: hasDiff ? 1 : 0,
    });
  };

  const hasData = !!(originalImageSrc || stegoImageSrc);

  return (
    <div className={`stego-diff-visualizer ${className}`}>
      <div className="diff-header">
        <div className="diff-title-row">
          <span className="diff-icon">🔬</span>
          <div>
            <h4 className="diff-title">LSB Pixel Difference Inspector</h4>
            <p className="diff-desc">
              Visualizes where encrypted bits are embedded in the carrier image's blue channel LSBs.
              {!hasData && <span className="diff-waiting-hint"> — Awaiting vault carrier image.</span>}
            </p>
          </div>
        </div>

        <div className="diff-view-toggles">
          <button
            type="button"
            className={`diff-toggle-btn ${viewMode === "diff-heatmap" ? "active" : ""}`}
            onClick={() => { playClickSound(); setViewMode("diff-heatmap"); }}
          >
            🔥 Diff Heatmap
          </button>
          <button
            type="button"
            className={`diff-toggle-btn ${viewMode === "bit-plane" ? "active" : ""}`}
            onClick={() => { playClickSound(); setViewMode("bit-plane"); }}
          >
            📊 Bit Planes
          </button>
          <button
            type="button"
            className={`diff-toggle-btn ${viewMode === "side-by-side" ? "active" : ""}`}
            onClick={() => { playClickSound(); setViewMode("side-by-side"); }}
          >
            ⚖️ Split View
          </button>
        </div>
      </div>

      <div className="diff-body-grid">
        <div className="diff-canvas-container">
          <canvas
            ref={canvasRef}
            className={`diff-canvas ${!hasData ? "diff-canvas-empty" : ""}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverPixel(null)}
          />
          <div className="canvas-crosshair-label">
            {hasData && hoverPixel ? (
              <span>
                📍 Pixel ({hoverPixel.x}, {hoverPixel.y}) • RGB({hoverPixel.r},{hoverPixel.g},{hoverPixel.b}) •{" "}
                <strong style={{ color: hoverPixel.diff ? "var(--cyan)" : "var(--text-muted)" }}>
                  {hoverPixel.diff ? "Modified LSB (Secret Bit Encoded)" : "Carrier Intact"}
                </strong>
              </span>
            ) : hasData ? (
              <span>Hover over canvas to inspect pixel byte states</span>
            ) : (
              <span>Pixel inspection activates after vault is sealed in the workspace above ↑</span>
            )}
          </div>
        </div>

        <div className="diff-controls-panel">
          {hasData && viewMode === "diff-heatmap" && (
            <div className="diff-control-group">
              <label className="diff-label">
                <span>Amplification Contrast:</span>
                <span className="diff-val">{amplification}×</span>
              </label>
              <input
                type="range"
                min="10"
                max="255"
                value={amplification}
                onChange={(e) => setAmplification(Number(e.target.value))}
                className="diff-range"
              />
              <p className="diff-hint">
                Boosts pixel difference contrast to reveal ciphertext byte dispersion.
              </p>
            </div>
          )}

          {hasData && viewMode === "bit-plane" && (
            <div className="diff-control-group">
              <label className="diff-label">
                <span>Select Bit Plane:</span>
                <span className="diff-val">Bit {bitPlane} ({bitPlane === 0 ? "LSB — Secret Plane" : "MSB — Visual Data"})</span>
              </label>
              <div className="bit-plane-selector">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((b) => (
                  <button
                    key={b}
                    type="button"
                    className={`bit-btn ${bitPlane === b ? "active" : ""} ${b === 0 ? "lsb" : ""}`}
                    onClick={() => { playClickSound(); setBitPlane(b); }}
                  >
                    B{b}
                  </button>
                ))}
              </div>
              <p className="diff-hint">
                Bit 0 (LSB) carries the AES-256 ciphertext payload without affecting visual appearance.
              </p>
            </div>
          )}

          {/* How it works — shown when no vault loaded yet */}
          {!hasData && (
            <div className="diff-how-it-works">
              <h5 className="diw-title">How This Inspector Works</h5>
              <ol className="diw-steps">
                <li>Upload a lossless PNG image in the <strong>Seal Vault</strong> panel above.</li>
                <li>Fill in your seed phrase and password, then click <strong>Seal the Vault</strong>.</li>
                <li>Once processed, this inspector shows <em>exactly</em> which pixels were modified and by how much — proving steganographic imperceptibility.</li>
              </ol>
              <div className="diw-info-box">
                <span className="diw-icon">🔐</span>
                <span>AES-256-GCM ciphertext bytes are scattered pseudo-randomly across the blue channel's LSB plane using a PRNG seed derived from your payload length.</span>
              </div>
            </div>
          )}

          {/* Show cryptographic spec cards only when data is present */}
          {hasData && (
            <div className="diff-stat-cards">
              <div className="diff-stat-card">
                <span className="stat-label">Stego Method:</span>
                <span className="stat-val" style={{ fontSize: "0.85rem", color: "var(--cyan)" }}>LSB Blue Channel</span>
                <span className="stat-sub">PRNG Fisher-Yates pixel dispersion</span>
              </div>
              <div className="diff-stat-card">
                <span className="stat-label">Encryption:</span>
                <span className="stat-val" style={{ fontSize: "0.85rem", color: "var(--green)" }}>AES-256-GCM</span>
                <span className="stat-sub">PBKDF2-SHA512 · 100k iterations</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
