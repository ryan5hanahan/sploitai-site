(() => {
  const RUNS = [
    { id: "v74", findings: 54, yield: 0.14 },
    { id: "v76", findings: 87, yield: 0.25 },
    { id: "v77", findings: 47, yield: 0.15 },
    { id: "v78", findings: 57, yield: 0.12 },
    { id: "v79", findings: 52, yield: 0.17 },
    { id: "v80", findings: 55, yield: 0.16 },
    { id: "v0324", findings: 35, yield: 0.15 },
    { id: "v0325", findings: 66, yield: 0.15 },
    { id: "v0330", findings: 60, yield: 0.16 },
  ];

  const canvas = document.getElementById("perf-chart");
  if (!canvas) return;

  const dpr = window.devicePixelRatio || 1;
  const W = 1060;
  const H = 340;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = "100%";
  canvas.style.maxWidth = W + "px";
  canvas.style.height = "auto";
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  const pad = { l: 60, r: 55, t: 30, b: 50 };
  const plotW = W - pad.l - pad.r;
  const plotH = H - pad.t - pad.b;

  const maxF = 100;
  const maxY = 0.3;
  const n = RUNS.length;
  const barW = Math.min(56, plotW / n * 0.6);
  const gap = plotW / n;

  function fY(v) {
    return pad.t + plotH - (v / maxF) * plotH;
  }

  function yY(v) {
    return pad.t + plotH - (v / maxY) * plotH;
  }

  function xC(i) {
    return pad.l + gap * i + gap / 2;
  }

  // Axes
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad.l, pad.t);
  ctx.lineTo(pad.l, pad.t + plotH);
  ctx.moveTo(pad.l, pad.t + plotH);
  ctx.lineTo(W - pad.r, pad.t + plotH);
  ctx.moveTo(W - pad.r, pad.t);
  ctx.lineTo(W - pad.r, pad.t + plotH);
  ctx.stroke();

  // Grid
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = "rgba(255,255,255,0.04)";
  for (let v = 25; v < maxF; v += 25) {
    ctx.beginPath();
    ctx.moveTo(pad.l, fY(v));
    ctx.lineTo(W - pad.r, fY(v));
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // Left Y labels (Findings)
  ctx.font = "11px monospace";
  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(0,255,136,0.5)";
  [0, 25, 50, 75, 100].forEach((v) => {
    ctx.fillText(String(v), pad.l - 8, fY(v) + 4);
  });

  // Right Y labels (Yield)
  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(0,209,255,0.5)";
  ctx.fillText("0", W - pad.r + 8, fY(0) + 4);
  ctx.fillText(".10", W - pad.r + 8, yY(0.1) + 4);
  ctx.fillText(".20", W - pad.r + 8, yY(0.2) + 4);
  ctx.fillText(".30", W - pad.r + 8, yY(0.3) + 4);

  // Axis titles
  ctx.save();
  ctx.fillStyle = "rgba(0,255,136,0.4)";
  ctx.font = "10px monospace";
  ctx.translate(16, pad.t + plotH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = "center";
  ctx.fillText("Findings", 0, 0);
  ctx.restore();

  ctx.save();
  ctx.fillStyle = "rgba(0,209,255,0.4)";
  ctx.font = "10px monospace";
  ctx.translate(W - 8, pad.t + plotH / 2);
  ctx.rotate(Math.PI / 2);
  ctx.textAlign = "center";
  ctx.fillText("Yield", 0, 0);
  ctx.restore();

  // Bars
  const grad = ctx.createLinearGradient(0, pad.t, 0, pad.t + plotH);
  grad.addColorStop(0, "rgba(0,255,136,0.35)");
  grad.addColorStop(1, "rgba(0,255,136,0.08)");

  RUNS.forEach((r, i) => {
    const x = xC(i) - barW / 2;
    const y = fY(r.findings);
    const h = pad.t + plotH - y;

    ctx.fillStyle = grad;
    ctx.strokeStyle =
      r.findings >= 80
        ? "rgba(0,255,136,0.55)"
        : "rgba(0,255,136,0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x, y, barW, h, 4);
    ctx.fill();
    ctx.stroke();

    // Bar value label
    ctx.fillStyle =
      r.findings >= 80 ? "#00ff88" : "rgba(0,255,136,0.7)";
    ctx.font =
      r.findings >= 80
        ? "bold 13px monospace"
        : "bold 11px monospace";
    ctx.textAlign = "center";
    ctx.fillText(String(r.findings), xC(i), y - 8);

    // X label
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.font = "11px monospace";
    ctx.fillText(r.id, xC(i), pad.t + plotH + 22);
  });

  // Yield line
  ctx.beginPath();
  ctx.setLineDash([8, 4]);
  ctx.strokeStyle = "#00d1ff";
  ctx.lineWidth = 2.5;
  ctx.lineJoin = "round";
  RUNS.forEach((r, i) => {
    const x = xC(i);
    const y = yY(r.yield);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();
  ctx.setLineDash([]);

  // Yield dots
  RUNS.forEach((r, i) => {
    const x = xC(i);
    const y = yY(r.yield);
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#00d1ff";
    ctx.fill();
    if (r.yield >= 0.25) {
      ctx.strokeStyle = "#0a0e14";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  });

  // Legend
  const ly = H - 16;
  const lx = W / 2 - 120;

  ctx.fillStyle = grad;
  ctx.strokeStyle = "rgba(0,255,136,0.4)";
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.roundRect(lx, ly - 5, 14, 10, 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = "11px monospace";
  ctx.textAlign = "left";
  ctx.fillText("Findings", lx + 20, ly + 4);

  ctx.setLineDash([6, 3]);
  ctx.strokeStyle = "#00d1ff";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(lx + 100, ly);
  ctx.lineTo(lx + 124, ly);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillText("Yield", lx + 130, ly + 4);
})();
