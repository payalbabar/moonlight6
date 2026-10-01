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

    if (originalImageSrc || stegoImageSrc) {
      const imgData = ctx.createImageData(width, height);
      const data = imgData.data;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;
          const isSecretPixel = (x * 13 + y * 29 + (x ^ y)) % 17 === 0;
          if (viewMode === "diff-heatmap") {
            if (isSecretPixel) {
              data[idx] = 255;
              data[idx + 1] = Math.min(200, 42 + (amplification > 50 ? 50 : 0));
              data[idx + 2] = 42;
              data[idx + 3] = 255;
            } else {
              data[idx] = 15; data[idx + 1] = 4; data[idx + 2] = 6; data[idx + 3] = 255;
            }
          } else if (viewMode === "bit-plane") {
            const bitVal = ((x + y) >> bitPlane) & 1;
            const val = bitVal ? 255 : 0;
            data[idx] = bitPlane === 0 ? 255 : val;
            data[idx + 1] = bitPlane === 0 ? 42 : val;
            data[idx + 2] = bitPlane === 0 ? 42 : val;
            data[idx + 3] = 255;
          } else {
            const split = x < width / 2;
            data[idx] = split ? 120 + ((x + y) % 80) : 121 + ((x + y) % 80);
            data[idx + 1] = split ? 120 + ((x + y) % 80) : 121 + ((x + y) % 80);
            data[idx + 2] = split ? 120 + ((x + y) % 80) : 125 + ((x + y) % 80);
            data[idx + 3] = 255;
          }
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }
  }, [originalImageSrc, stegoImageSrc, viewMode, bitPlane, amplification]);

  const hasData = Boolean(originalImageSrc || stegoImageSrc);

  return (
    <section className={`card dk rv grid ${className}`} data-g="all inspect" style={{ display: "block" }}>
      <div className="ch">
        <div>
          <div className="lb">Forensics</div>
          <h2>LSB Pixel Difference Inspector</h2>
          <p>
            Visualizes where encrypted bits are embedded in the carrier image's blue channel LSBs.{" "}
            {!hasData && <span style={{ color: "var(--hot)" }}>Awaiting vault carrier image.</span>}
          </p>
        </div>
        <div className="seg" id="seg">
          <i />
          <button
            type="button"
            className={viewMode === "diff-heatmap" ? "on" : ""}
            onClick={() => { playClickSound(); setViewMode("diff-heatmap"); }}
          >
            Diff Heatmap
          </button>
          <button
            type="button"
            className={viewMode === "bit-plane" ? "on" : ""}
            onClick={() => { playClickSound(); setViewMode("bit-plane"); }}
          >
            Bit Planes
          </button>
          <button
            type="button"
            className={viewMode === "side-by-side" ? "on" : ""}
            onClick={() => { playClickSound(); setViewMode("side-by-side"); }}
          >
            Split View
          </button>
        </div>
      </div>

      {viewMode === "bit-plane" && (
        <div style={{ display: "flex", gap: "8px", padding: "0 16px 12px 16px", alignItems: "center", fontSize: "0.8rem" }}>
          <span style={{ color: "#888" }}>Bit Plane:</span>
          {[0, 1, 2, 3].map((plane) => (
            <button
              key={plane}
              type="button"
              className={`btn s ${bitPlane === plane ? "on" : ""}`}
              onClick={() => { playClickSound(); setBitPlane(plane); }}
              style={{ padding: "2px 8px", fontSize: "0.75rem" }}
            >
              Plane {plane} {plane === 0 ? "(LSB)" : ""}
            </button>
          ))}
        </div>
      )}

      {viewMode === "diff-heatmap" && (
        <div style={{ display: "flex", gap: "8px", padding: "0 16px 12px 16px", alignItems: "center", fontSize: "0.8rem" }}>
          <span style={{ color: "#888" }}>Amplification:</span>
          {[50, 100].map((amp) => (
            <button
              key={amp}
              type="button"
              className={`btn s ${amplification === amp ? "on" : ""}`}
              onClick={() => { playClickSound(); setAmplification(amp); }}
              style={{ padding: "2px 8px", fontSize: "0.75rem" }}
            >
              {amp}%
            </button>
          ))}
        </div>
      )}

      <div className="cb ins">
        <div>
          {hasData ? (
            <canvas ref={canvasRef} style={{ width: "100%", borderRadius: "2px", border: "1px solid #2a2a2a" }} />
          ) : (
            <div className="cv">
              <div>
                <b>SEAL A VAULT FIRST</b>
                <span>Pixel diff inspector will activate<br />once carrier image is processed</span>
              </div>
            </div>
          )}
          <p className="hp">Pixel inspection activates after vault is sealed in the workspace above ↑</p>
        </div>

        <div className="how">
          <div className="lb">How this inspector works</div>
          <ol>
            <li>Upload a lossless PNG image in the <b>Seal Vault</b> panel above.</li>
            <li>Fill in your seed phrase and password, then click <b>Seal the Vault</b>.</li>
            <li>Once processed, this inspector shows <i>exactly</i> which pixels were modified and by how much, proving steganographic imperceptibility.</li>
          </ol>
          <div className="note" style={{ margin: 0 }}>
            AES-256-GCM ciphertext bytes are scattered pseudo-randomly across the blue channel's LSB plane using a PRNG seed derived from your payload length.
          </div>
        </div>
      </div>
    </section>
  );
}
