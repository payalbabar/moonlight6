/**
 * Generates an in-memory futuristic cyber cover image PNG file
 * for 1-click test drive & instant judge demonstrations.
 */
export async function generateDemoCarrierFile(
  preset: "cyber-vault" | "deep-space" | "neon-matrix" = "cyber-vault"
): Promise<File> {
  const canvas = document.createElement("canvas");
  const width = 600;
  const height = 400;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Unable to obtain 2D canvas context");
  }

  if (preset === "cyber-vault") {
    // Cyberpunk Red Vault Shield Pattern
    const grad = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, 320);
    grad.addColorStop(0, "#1f0507");
    grad.addColorStop(0.5, "#0d0203");
    grad.addColorStop(1, "#050505");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Dynamic Circuit Grid
    ctx.strokeStyle = "rgba(255, 42, 42, 0.14)";
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Glowing Concentric Circles
    ctx.strokeStyle = "#ff2a2a";
    ctx.shadowColor = "#ff2a2a";
    ctx.shadowBlur = 16;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 90, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "#ff5a1f";
    ctx.shadowColor = "#ff5a1f";
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 50, 0, Math.PI * 2);
    ctx.stroke();

    // Central Vault Emblem
    ctx.fillStyle = "#ff4d3d";
    ctx.shadowColor = "#ff2a2a";
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Watermark text
    ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    ctx.font = "bold 16px monospace";
    ctx.textAlign = "center";
    ctx.fillText("STEGOVAULT // MIDNIGHT PREPROD CARRIER", width / 2, height - 30);
  } else if (preset === "deep-space") {
    // Starfield galaxy
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 200; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const r = Math.random() * 2;
      ctx.fillStyle = i % 5 === 0 ? "#ff2a2a" : i % 3 === 0 ? "#ff5a1f" : "#ffffff";
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    // Crimson Matrix
    ctx.fillStyle = "#060102";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#ff2a2a";
    ctx.font = "14px monospace";
    for (let x = 10; x < width; x += 24) {
      for (let y = 20; y < height; y += 22) {
        if (Math.random() > 0.4) {
          const char = String.fromCharCode(0x30a0 + Math.floor(Math.random() * 96));
          ctx.fillText(char, x, y);
        }
      }
    }
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Failed to create PNG blob"));
        return;
      }
      const file = new File([blob], `stegovault_carrier_${preset}.png`, { type: "image/png" });
      resolve(file);
    }, "image/png");
  });
}
