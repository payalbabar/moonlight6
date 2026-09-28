import { useState } from "react";

export default function CapacityCalculator() {
  const [resolution, setResolution] = useState<{ width: number; height: number }>({ width: 1920, height: 1080 });
  const [customW, setCustomW] = useState("1920");
  const [customH, setCustomH] = useState("1080");

  const totalPixels = resolution.width * resolution.height;
  // 1 bit per pixel in blue channel -> total bytes = floor(totalPixels / 8) - 4 header bytes
  const maxBytes = Math.max(0, Math.floor(totalPixels / 8) - 4);
  const maxKb = (maxBytes / 1024).toFixed(1);
  const maxMb = (maxBytes / (1024 * 1024)).toFixed(2);
  const estSeedPhrases = Math.floor(maxBytes / 450); // ~450 bytes per encrypted vault payload with metadata
  const estPrivateKeys = Math.floor(maxBytes / 380);

  const presets = [
    { label: "Avatar (512×512)", w: 512, h: 512 },
    { label: "HD (1280×720)", w: 1280, h: 720 },
    { label: "Full HD (1920×1080)", w: 1920, h: 1080 },
    { label: "4K UHD (3840×2160)", w: 3840, h: 2160 },
  ];

  const handleApplyCustom = () => {
    const w = parseInt(customW, 10);
    const h = parseInt(customH, 10);
    if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
      setResolution({ width: w, height: h });
    }
  };

  return (
    <div className="capacity-calculator-card">
      <div className="calc-header">
        <div className="calc-icon">📐</div>
        <div>
          <h3 className="calc-title">Steganographic Capacity &amp; Bit Gauge</h3>
          <p className="calc-sub">Estimate maximum concealed secret storage for your cover PNGs</p>
        </div>
      </div>

      <div className="calc-grid">
        {/* Preset selections */}
        <div className="calc-inputs-col">
          <label className="calc-label">Choose Resolution Preset:</label>
          <div className="preset-buttons-grid">
            {presets.map((p) => (
              <button
                key={p.label}
                type="button"
                className={`calc-preset-btn ${resolution.width === p.w && resolution.height === p.h ? "active" : ""}`}
                onClick={() => {
                  setResolution({ width: p.w, height: p.h });
                  setCustomW(p.w.toString());
                  setCustomH(p.h.toString());
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="custom-res-row">
            <div className="custom-input-wrap">
              <label>Width (px)</label>
              <input
                type="number"
                value={customW}
                onChange={(e) => setCustomW(e.target.value)}
                onBlur={handleApplyCustom}
              />
            </div>
            <span className="res-cross">×</span>
            <div className="custom-input-wrap">
              <label>Height (px)</label>
              <input
                type="number"
                value={customH}
                onChange={(e) => setCustomH(e.target.value)}
                onBlur={handleApplyCustom}
              />
            </div>
          </div>
        </div>

        {/* Output Metrics */}
        <div className="calc-metrics-col">
          <div className="metric-box highlight-box">
            <span className="metric-title">Max Hidden Payload</span>
            <span className="metric-val">{parseFloat(maxMb) > 1 ? `${maxMb} MB` : `${maxKb} KB`}</span>
            <span className="metric-sub">{maxBytes.toLocaleString()} raw encrypted bytes</span>
          </div>

          <div className="metrics-subgrid">
            <div className="metric-mini-box">
              <span className="mini-num">{estSeedPhrases.toLocaleString()}</span>
              <span className="mini-label">24-Word Seed Vaults</span>
            </div>
            <div className="metric-mini-box">
              <span className="mini-num">{estPrivateKeys.toLocaleString()}</span>
              <span className="mini-label">Hex Private Keys</span>
            </div>
            <div className="metric-mini-box">
              <span className="mini-num">100%</span>
              <span className="mini-label">Lossless Bit Fidelity</span>
            </div>
            <div className="metric-mini-box">
              <span className="mini-num">&lt; 0.05</span>
              <span className="mini-label">Perceptual Delta ΔE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
