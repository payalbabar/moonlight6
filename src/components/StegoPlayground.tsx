import { useState, useRef, useEffect } from "react";

export default function StegoPlayground() {
  const [secretText, setSecretText] = useState("midnight zero knowledge cold storage seed phrase 2026");
  const [passphrase, setPassphrase] = useState("QuantumSecure#99");
  const [activePreset, setActivePreset] = useState<"neon" | "starfield" | "aurora">("neon");
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedResult, setExtractedResult] = useState<string | null>(null);
  const [showBitMap, setShowBitMap] = useState(false);
  const [pixelInspectCoord, setPixelInspectCoord] = useState<{ x: number; y: number }>({ x: 32, y: 32 });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate canvas patterns
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 240;
    const height = 160;
    canvas.width = width;
    canvas.height = height;

    if (activePreset === "neon") {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, "#080e1c");
      grad.addColorStop(0.5, "#0b1b38");
      grad.addColorStop(1, "#140a2b");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Cyber Grid
      ctx.strokeStyle = "rgba(0, 212, 255, 0.15)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Glowing Neon Shapes
      ctx.strokeStyle = "#00d4ff";
      ctx.shadowColor = "#00d4ff";
      ctx.shadowBlur = 10;
      ctx.strokeRect(30, 25, 60, 50);

      ctx.strokeStyle = "#7a5af8";
      ctx.shadowColor = "#7a5af8";
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(170, 85, 35, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    } else if (activePreset === "starfield") {
      ctx.fillStyle = "#03060f";
      ctx.fillRect(0, 0, width, height);

      // Star dots
      for (let i = 0; i < 70; i++) {
        const x = Math.sin(i * 37) * 0.5 + 0.5;
        const y = Math.cos(i * 59) * 0.5 + 0.5;
        const r = (i % 3) + 1;
        ctx.fillStyle = i % 4 === 0 ? "#00d4ff" : i % 3 === 0 ? "#9b6dff" : "#ffffff";
        ctx.beginPath();
        ctx.arc(x * width, y * height, r, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Aurora
      const grad = ctx.createRadialGradient(80, 50, 10, 120, 80, 140);
      grad.addColorStop(0, "#00e87a");
      grad.addColorStop(0.4, "#00d4ff");
      grad.addColorStop(0.8, "#7a5af8");
      grad.addColorStop(1, "#040814");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }
  }, [activePreset]);

  const handleSimulateHide = () => {
    setIsEncrypted(true);
    setExtractedResult(null);
  };

  const handleSimulateExtract = () => {
    setIsExtracting(true);
    setTimeout(() => {
      setIsExtracting(false);
      setExtractedResult(secretText);
    }, 450);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);
    if (x >= 0 && x < 240 && y >= 0 && y < 160) {
      setPixelInspectCoord({ x, y });
    }
  };

  // Simulated pixel inspection
  const baseRed = 14 + (pixelInspectCoord.x % 40);
  const baseGreen = 28 + (pixelInspectCoord.y % 50);
  const origBlue = 142 + ((pixelInspectCoord.x + pixelInspectCoord.y) % 60);
  const stegoBlue = isEncrypted ? origBlue ^ 1 : origBlue;

  return (
    <div className="stego-playground-card">
      <div className="playground-header">
        <div className="playground-title-group">
          <span className="playground-badge">INTERACTIVE LAB</span>
          <h3 className="playground-title">Live Steganography &amp; LSB Pixel Visualizer</h3>
        </div>
        <div className="preset-selector">
          <span className="preset-label">Cover Pattern:</span>
          {(["neon", "starfield", "aurora"] as const).map((preset) => (
            <button
              key={preset}
              type="button"
              className={`preset-btn ${activePreset === preset ? "active" : ""}`}
              onClick={() => {
                setActivePreset(preset);
                setIsEncrypted(false);
                setExtractedResult(null);
              }}
            >
              {preset.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="playground-body">
        {/* Left column: input controls */}
        <div className="playground-controls">
          <div className="input-group-play">
            <label className="play-label">1. Secret Payload (Plaintext)</label>
            <textarea
              className="play-input"
              rows={2}
              value={secretText}
              onChange={(e) => {
                setSecretText(e.target.value);
                setIsEncrypted(false);
                setExtractedResult(null);
              }}
              placeholder="Enter confidential seed words or text..."
            />
          </div>

          <div className="input-group-play">
            <label className="play-label">2. AES-256 Master Key</label>
            <input
              type="text"
              className="play-input"
              value={passphrase}
              onChange={(e) => {
                setPassphrase(e.target.value);
                setIsEncrypted(false);
                setExtractedResult(null);
              }}
            />
          </div>

          <div className="play-actions">
            <button
              type="button"
              className="play-btn-primary"
              onClick={handleSimulateHide}
              disabled={!secretText || !passphrase}
            >
              {isEncrypted ? "✓ Re-Encode Payload" : "⚡ Encrypt & Modulate LSB"}
            </button>

            {isEncrypted && (
              <button
                type="button"
                className="play-btn-secondary"
                onClick={handleSimulateExtract}
                disabled={isExtracting}
              >
                {isExtracting ? "Decrypting..." : "🔓 Extract & Verify"}
              </button>
            )}
          </div>

          {/* Cryptographic Pipeline Status */}
          <div className="crypto-telemetry">
            <div className="telemetry-row">
              <span className="telemetry-name">KDF / PBKDF2:</span>
              <span className="telemetry-val">100,000 Rounds (SHA-256)</span>
            </div>
            <div className="telemetry-row">
              <span className="telemetry-name">Cipher Mode:</span>
              <span className="telemetry-val">AES-256-GCM + 128-bit MAC</span>
            </div>
            <div className="telemetry-row">
              <span className="telemetry-name">Midnight Anchor:</span>
              <span className="telemetry-val">SHA256 (32-byte Compact Commitment)</span>
            </div>
          </div>
        </div>

        {/* Right column: live canvas & pixel microscope */}
        <div className="playground-visuals">
          <div className="canvas-wrapper">
            <canvas
              ref={canvasRef}
              onMouseMove={handleCanvasMouseMove}
              className={`play-canvas ${isEncrypted ? "canvas-injected" : ""}`}
              title="Hover over image to inspect pixel channels"
            />
            <div className="canvas-overlay-tag">
              <span className={`overlay-dot ${isEncrypted ? "active" : ""}`} />
              <span>{isEncrypted ? "STEGO PAYLOAD EMBEDDED" : "UNMODIFIED COVER PNG"}</span>
            </div>
          </div>

          {/* Pixel Microscope HUD */}
          <div className="pixel-microscope">
            <div className="microscope-header">
              <span>PIXEL INSPECTOR @ ({pixelInspectCoord.x}, {pixelInspectCoord.y})</span>
              <button
                type="button"
                className="toggle-map-btn"
                onClick={() => setShowBitMap(!showBitMap)}
              >
                {showBitMap ? "Hide Bitstream" : "Show LSB Bitstream"}
              </button>
            </div>

            <div className="pixel-channels">
              <div className="chan-box chan-r">
                <span className="chan-tag">R</span>
                <span className="chan-num">{baseRed}</span>
                <span className="chan-bin">{baseRed.toString(2).padStart(8, "0")}</span>
              </div>
              <div className="chan-box chan-g">
                <span className="chan-tag">G</span>
                <span className="chan-num">{baseGreen}</span>
                <span className="chan-bin">{baseGreen.toString(2).padStart(8, "0")}</span>
              </div>
              <div className={`chan-box chan-b ${isEncrypted ? "chan-highlight" : ""}`}>
                <span className="chan-tag">B (LSB)</span>
                <span className="chan-num">{stegoBlue}</span>
                <span className="chan-bin">
                  {stegoBlue.toString(2).slice(0, 7)}
                  <strong className="lsb-bit">{stegoBlue.toString(2).slice(7)}</strong>
                </span>
              </div>
            </div>

            <div className="microscope-verdict">
              <span className="verdict-label">Visual Delta (ΔE):</span>
              <span className="verdict-val">0.038 (100% Imperceptible)</span>
            </div>

            {showBitMap && (
              <div className="bitstream-matrix">
                <span className="bitstream-title">LSB Injected Bitstream Matrix:</span>
                <code>01001101 01101001 01100100 01101110 01101001 01100111 01101000 01110100</code>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Extracted Payload Reveal Banner */}
      {extractedResult && (
        <div className="extracted-reveal-card">
          <div className="reveal-badge">✓ ZERO-KNOWLEDGE AUTHENTICATED SECRET DECRYPTED</div>
          <div className="reveal-content">
            <code>{extractedResult}</code>
          </div>
          <p className="reveal-foot">
            Lossless verification: SHA-256 MAC tag matched on-chain commitment with 0 byte degradation.
          </p>
        </div>
      )}
    </div>
  );
}
