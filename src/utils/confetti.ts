// Lightweight zero-dependency canvas confetti explosion

export function triggerConfetti() {
  if (typeof window === "undefined") return;

  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "999999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    document.body.removeChild(canvas);
    return;
  }

  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const colors = ["#00d4ff", "#7a5af8", "#00e87a", "#ffaa00", "#ff3b69", "#ffffff"];
  const particles: Array<{
    x: number;
    y: number;
    size: number;
    color: string;
    vx: number;
    vy: number;
    rot: number;
    vrot: number;
    life: number;
    maxLife: number;
  }> = [];

  for (let i = 0; i < 90; i++) {
    particles.push({
      x: width * 0.5 + (Math.random() - 0.5) * 120,
      y: height * 0.45 + (Math.random() - 0.5) * 60,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 14,
      vy: Math.random() * -14 - 4,
      rot: Math.random() * 360,
      vrot: (Math.random() - 0.5) * 15,
      life: 0,
      maxLife: 80 + Math.random() * 40,
    });
  }

  let animationId: number;

  function render() {
    ctx!.clearRect(0, 0, width, height);

    let activeCount = 0;
    for (const p of particles) {
      p.life++;
      if (p.life < p.maxLife) {
        activeCount++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.4; // gravity
        p.vx *= 0.98; // air resistance
        p.rot += p.vrot;

        const opacity = Math.max(0, 1 - p.life / p.maxLife);
        ctx!.save();
        ctx!.translate(p.x, p.y);
        ctx!.rotate((p.rot * Math.PI) / 180);
        ctx!.globalAlpha = opacity;
        ctx!.fillStyle = p.color;
        ctx!.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx!.restore();
      }
    }

    if (activeCount > 0) {
      animationId = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationId);
      if (canvas.parentNode) {
        document.body.removeChild(canvas);
      }
    }
  }

  render();
}
